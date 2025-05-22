// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media/config'
import { Users } from './collections/Users/config'
import { Admins } from './collections/Admins/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'admins',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    routes: {
      login: '/auth/login',
    },
    components: {
      logout: {
        Button: {
          path: '@/components/payload/ui/root/logoutButton',
          exportName: 'LogoutButton',
        },
      },
      providers: [
        '@/components/payload/providers/clerkPayloadProvider',
        '@/components/payload/providers/reactQueryProvider',
      ],
    },
  },
  collections: [Media, Users, Admins],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})

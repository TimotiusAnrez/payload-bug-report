import { CollectionConfig } from 'payload'
import { ClerkAuthStrategy } from './strategy/clerkStrategy'
import { login } from 'node_modules/payload/dist/auth/operations/local/login'

/**
 * How users will be able to create an Admin Account to manage their business directory?
 *
 * 1. Have a verified account (have admin verified user document type and document number)
 * 2. Admin be able to create admin account for user
 * 3. When account created user will be emailed and access admin panel via their personal profile
 */

export const Admins: CollectionConfig = {
  slug: 'admins',
  auth: {
    disableLocalStrategy: true,
    strategies: [ClerkAuthStrategy],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'isSuspended',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      label: 'Suspend Account?',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        {
          label: 'Admin User',
          value: 'ADMIN_USER', //User Created Business Admin have create update delete their own business
        },
        {
          label: 'Admin Agriculture',
          value: 'ADMIN_AGRI', //agriculture admin
        },
        {
          label: 'Admin',
          value: 'ADMIN ', //Admin managing the visit manggarai web can view and update all business status, can verify and banned user, can crud news, create comment on discussion, and mark report as resolved.
        },
        {
          label: 'Super Admin',
          value: 'SUPER_ADMIN', //Super admin have full access to the system excluding User privilige such as creating user, business, review, and discussion.
        },
      ],
      required: true,
      hasMany: false,
    },
  ],
}

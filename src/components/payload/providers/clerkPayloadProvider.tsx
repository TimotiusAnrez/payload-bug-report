import { ClerkProvider } from '@clerk/nextjs'

export default function ClerkPayloadProvider({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>
}

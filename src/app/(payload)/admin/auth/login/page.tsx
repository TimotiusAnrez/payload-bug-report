import { SignIn } from '@clerk/nextjs'

export default function AdminLoginPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SignIn />
    </div>
  )
}

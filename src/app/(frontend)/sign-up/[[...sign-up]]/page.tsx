import { SignUp } from '@clerk/nextjs'

export default async function SignUpPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <h1>Sign Up to M-Smart</h1>
      <SignUp />
    </div>
  )
}

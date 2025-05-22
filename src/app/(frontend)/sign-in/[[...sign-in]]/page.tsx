import { SignIn } from '@clerk/nextjs'

export default async function SignInPage() {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="login-container flex flex-col gap-6 items-center">
        <SignIn />
      </div>
    </div>
  )
}

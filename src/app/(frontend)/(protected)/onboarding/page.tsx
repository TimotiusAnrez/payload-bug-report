import { RedirectToSignIn } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import OnboardingUserForm from '@/components/onboarding/OnboardingUserForm'

export default async function OnboardingPage() {
  const user = await currentUser()

  if (!user) return <RedirectToSignIn />

  const payload = await getPayload({
    config,
  })

  const result = await payload.find({
    collection: 'users',
    where: {
      clerkID: {
        equals: user.id,
      },
    },
  })

  if (result.docs.length === 0) return <RedirectToSignIn />

  return (
    <div>
      <h1>Welcome to M-Smart Let's complete your profile first</h1>
      <OnboardingUserForm user={result.docs[0]} />
    </div>
  )
}

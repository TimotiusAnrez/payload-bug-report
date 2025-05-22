import { Admin } from '@/payload-types'
import { auth, currentUser, clerkClient } from '@clerk/nextjs/server'
import {
  AuthStrategy,
  AuthStrategyFunctionArgs,
  AuthStrategyResult,
  User,
  type Payload,
} from 'payload'

export async function getUser({ payload }: { payload: Payload }): Promise<User | null> {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return null
    }

    const clerkUser = await (await clerkClient()).users.getUser(userId)

    if (!clerkUser.privateMetadata.role || !clerkUser.privateMetadata.adminID) return null

    const adminID = clerkUser.privateMetadata.adminID as number

    const adminQuery = await payload.findByID({
      collection: 'admins',
      id: adminID,
    })

    //   need to add extra check if admin with user id exist or not, if not then return null

    if (!adminQuery) return null

    return {
      collection: 'admins',
      ...adminQuery,
    }
  } catch (error) {
    console.log(error)

    return null
  }
}

async function authenticate({ payload }: AuthStrategyFunctionArgs): Promise<AuthStrategyResult> {
  const user = await getUser({ payload })

  if (!user) {
    return { user: null }
  }

  return {
    user,
  }
}

export const ClerkAuthStrategy: AuthStrategy = {
  name: 'clerk-auth-strategy',
  authenticate,
}

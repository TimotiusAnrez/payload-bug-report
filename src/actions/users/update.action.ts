'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { OnboardingFormValues } from '@/components/onboarding/OnboardingUserForm'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createError, createSuccess } from '@/helper/serverActionResponse'
import { ActionResult, ErrorSource } from '@/types/serverAction.types'
import { User } from '@/payload-types'

export async function UpdateUserFromOnboarding(
  data: OnboardingFormValues,
  userID: number,
  clerkID: string,
) {
  try {
    const payload = await getPayload({ config })
    const { userId } = await auth()

    if (!userId || userId != clerkID) {
      return {
        message: 'Unauthorized',
        status: 401,
      }
    }

    const client = await clerkClient()

    const update = await payload.update({
      collection: 'users',
      id: userID,
      data: {
        userInformation: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          DOB: data.DOB.toISOString(),
        },
        userContact: {
          email: data.email,
          phoneNumber: data.phoneNumber,
        },
        citizenshipDocument: {
          documentType: data.documentType,
          documentID: data.documentID,
        },
      },
    })

    const res = await client.users.updateUser(clerkID, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })

    console.log(res)

    return {
      message: 'success',
      status: 200,
      data: {
        id: update.id,
        firstName: update.userInformation.firstName,
        lastName: update.userInformation.lastName,
        gender: update.userInformation.gender,
        DOB: update.userInformation.DOB,
        email: update.userContact.email,
        phoneNumber: update.userContact.phoneNumber,
        documentType: update.citizenshipDocument.documentType,
        documentID: update.citizenshipDocument.documentID,
      },
    }
  } catch (error) {
    console.log(error)
    return {
      message: `Error: ${error}`,
      status: 500,
    }
  }
}

interface VerifyUserDocumentProps {
  id: number
  clerkID: string
}

interface VerifyDocumentResponse {
  id: number
  isVerified?: boolean | null
}
//need fixing find out why is it not updating boolean value?
export async function VerifyUser({
  id,
  clerkID,
}: VerifyUserDocumentProps): Promise<ActionResult<VerifyDocumentResponse>> {
  const { userId } = await auth()

  //checking admin credibility
  if (userId != clerkID) {
    return createError(ErrorSource.AUTHENTICATION, 'Unauthorized User', 'UNAUTHORIZED')
  }
  const allowedRole = ['SUPER_ADMIN', 'ADMIN']
  const client = (await clerkClient()).users.getUser(userId)
  const adminRole = (await client).privateMetadata.role as string

  if (!allowedRole.includes(adminRole)) {
    return createError(ErrorSource.AUTHORIZATION, 'Unauthorized User', 'UNAUTHORIZED')
  }

  const payload = await getPayload({ config })
  const user = await payload.findByID({
    collection: 'users',
    id: id,
  })

  if (!user) {
    return createError(ErrorSource.PAYLOAD, 'User not found', 'PAYLOAD_ERROR')
  }

  const req = { payload }

  const update = await payload.update({
    collection: 'users',
    id: id,
    data: {
      citizenshipDocument: {
        ...user.citizenshipDocument,
        isVerified: true,
      },
    },
    req,
  })

  console.log(update)

  if (
    !update ||
    update.citizenshipDocument.isVerified === false ||
    update.citizenshipDocument.isVerified === undefined
  ) {
    return createError(ErrorSource.PAYLOAD, 'Failed to verify user', 'PAYLOAD_ERROR')
  }

  const response = await (
    await clerkClient()
  ).users.updateUserMetadata(clerkID, {
    privateMetadata: {
      isVerified: true,
    },
  })

  return createSuccess({
    message: 'User verified successfully',
    status: 200,
    id: update.id,
    data: {
      id: update.id,
      isVerified: update.citizenshipDocument.isVerified,
    },
  })
}

interface SuspendUserProps {
  id: number
  clerkID: string
}

interface SuspendResponse {
  id: number
  isSuspended?: boolean | null
}

export async function SuspendUser({
  id,
  clerkID,
}: SuspendUserProps): Promise<ActionResult<SuspendResponse>> {
  const { userId } = await auth()

  //checking admin credibility
  if (userId != clerkID) {
    return createError(ErrorSource.AUTHENTICATION, 'Unauthorized User', 'UNAUTHORIZED')
  }
  const allowedRole = ['SUPER_ADMIN', 'ADMIN']
  const client = (await clerkClient()).users.getUser(userId)
  const adminRole = (await client).privateMetadata.role as string

  if (!allowedRole.includes(adminRole)) {
    return createError(ErrorSource.AUTHORIZATION, 'Unauthorized User', 'UNAUTHORIZED')
  }

  const payload = await getPayload({ config })
  const user = await payload.update({
    collection: 'users',
    id,
    data: {
      isSuspended: true,
    },
  })

  if (!user || user.isSuspended === false || user.isSuspended === undefined) {
    return createError(ErrorSource.PAYLOAD, 'Failed to suspend user', 'PAYLOAD_ERROR')
  }

  console.log(user)

  const response = await (
    await clerkClient()
  ).users.updateUserMetadata(clerkID, {
    privateMetadata: {
      isSuspended: true,
    },
  })

  return createSuccess({
    message: 'User suspended successfully',
    status: 200,
    id: user.id,
    isSuspended: user.isSuspended,
  })
}

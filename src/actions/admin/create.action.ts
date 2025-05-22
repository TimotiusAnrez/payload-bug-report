'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { ActionResult, ErrorSource } from '@/types/serverAction.types'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { createError, createSuccess } from '@/helper/serverActionResponse'

interface CreateBusinessAccountProps {
  id: number
  clerkID: string
}

export async function CreateBusinessAccount({
  id,
  clerkID,
}: CreateBusinessAccountProps): Promise<ActionResult> {
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
  const user = await payload.find({
    collection: 'users',
    where: {
      clerkID: {
        equals: clerkID,
      },
    },
  })

  if (user.docs.length < 1) {
    return createError(ErrorSource.AUTHENTICATION, 'User Not Found', 'USER_NOT_FOUND')
  }

  const updateUser = await payload.create({
    collection: 'admins',
    data: {
      user: id,
      isSuspended: false,
      role: 'ADMIN_USER',
    },
  })

  if (!updateUser) {
    return createError(ErrorSource.PAYLOAD, 'Failed to create business account', 'PAYLOAD_ERROR')
  }

  const response = await (
    await clerkClient()
  ).users.updateUserMetadata(clerkID, {
    privateMetadata: {
      role: 'ADMIN_USER',
      adminID: updateUser.id,
    },
  })

  return createSuccess({
    message: 'Business account created successfully',
    status: 200,
  })
}

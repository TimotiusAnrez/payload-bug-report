'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { ActionResult, ErrorSource } from '@/types/serverAction.types'
import { createError, createSuccess } from '@/helper/serverActionResponse'
import { User } from '@/payload-types'

export async function getUser({ id }: { id: number }): Promise<ActionResult<User>> {
  const payload = await getPayload({ config })
  const user: User = await payload.findByID({
    collection: 'users',
    id,
  })

  if (!user) return createError(ErrorSource.PAYLOAD, 'User not found', 'USER_NOT_FOUND')

  return createSuccess(user)
}

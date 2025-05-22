import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type

    if (!id) return new Response('No user id', { status: 403 })

    if (eventType === 'user.created') {
      const UserDefaultValue = {
        firstName: 'John',
        lastName: 'Doe',
        gender: 'male' as 'male',
        DOB: new Date().toISOString(),
        documentType: 'KTP' as 'KTP',
        documentID: '123456782929',
        isVerified: false,
        email: 'example@mail.com',
        phoneNumber: '2819203000222',
      }

      let clerkData = {
        clerkID: id,
        isSuspended: false,
        userInformation: {
          firstName: evt.data.first_name ?? UserDefaultValue.firstName,
          lastName: evt.data.last_name ?? UserDefaultValue.lastName,
          gender: UserDefaultValue.gender,
          DOB: UserDefaultValue.DOB,
        },
        citizenshipDocument: {
          documentType: UserDefaultValue.documentType,
          documentID: UserDefaultValue.documentID,
          isVerified: false,
        },
        userContact: {
          email: evt.data.email_addresses[0].email_address ?? UserDefaultValue.email,
          phoneNumber: UserDefaultValue.phoneNumber,
        },
      }

      const payload = await getPayload({
        config,
      })

      const result = await payload.create({
        collection: 'users',
        data: {
          ...clerkData,
        },
      })

      if (result) {
        return new Response('User created', { status: 200 })
      }
    }

    if (eventType === 'user.updated') {
      return new Response('User Successfully Updated', { status: 200 })
    }

    if (eventType === 'user.deleted') {
      const payload = await getPayload({
        config,
      })

      const result = await payload.delete({
        collection: 'users',
        where: {
          clerkID: {
            equals: id,
          },
        },
      })

      if (result) {
        return new Response('User deleted', { status: 200 })
      }

      return new Response('User Successfully Deleted', { status: 200 })
    }

    return new Response('User not created', { status: 500 })
  } catch (err) {
    return new Response('Webhook Error', { status: 400 })
  }
}

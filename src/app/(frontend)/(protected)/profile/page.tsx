import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { NavigationLink } from '@/types/globals.enum'

import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DialogClose } from '@radix-ui/react-dialog'

function NavigateToBusinessButton({
  verificationStatus,
  userID,
  documentType,
  documentID,
}: {
  verificationStatus: boolean
  userID: number
  documentType: 'KTP' | 'PASSPORT'
  documentID: string
}) {
  if (!verificationStatus) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button>Business Panel</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Business Account Request</DialogTitle>
            <DialogDescription>
              Ask admin to verify document to access business panel
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Link href={NavigationLink.ADMIN}>
      <Button>Business Panel</Button>
    </Link>
  )
}

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) return redirect(NavigationLink.SIGN_IN)

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

  if (result.docs.length === 0) return redirect(NavigationLink.SIGN_IN)

  const data = result.docs[0]
  console.log(data)

  return (
    <div>
      <h1>Profile</h1>
      <NavigateToBusinessButton
        verificationStatus={data.citizenshipDocument.isVerified ?? false}
        userID={data.id}
        documentType={data.citizenshipDocument.documentType}
        documentID={data.citizenshipDocument.documentID}
      />

      {data.userInformation && (
        <>
          <p>{data.userInformation.firstName}</p>
          <p>{data.userInformation.lastName}</p>
          <p>{data.userInformation.gender}</p>
          <p>{data.userInformation.DOB}</p>
        </>
      )}

      {data.citizenshipDocument && (
        <>
          <p>{data.citizenshipDocument.documentType}</p>
          <p>{data.citizenshipDocument.documentID}</p>
          <p>{data.citizenshipDocument.isVerified}</p>
        </>
      )}

      {data.userContact && (
        <>
          <p>{data.userContact.email}</p>
          <p>{data.userContact.phoneNumber}</p>
        </>
      )}
    </div>
  )
}

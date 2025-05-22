'use client'

import { useState } from 'react'
import { UserCheck, Building, AlertTriangle, Shield, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ActionType } from './settingsPopover'
import { User } from '@/payload-types'
import { SuspendUser, VerifyUser } from '@/actions/users/update.action'
import { toast } from 'sonner'
import { CreateBusinessAccount } from '@/actions/admin/create.action'

interface ActionDialogProps {
  user: User
  action: ActionType
  open: boolean
  clerkID: string
  onOpenChange: (open: boolean) => void
}

interface VerifyDocumentProps {
  id: number
  clerkID: string
  documentType: 'PASSPORT' | 'KTP'
  documentID: string
  firstname: string
  lastname: string
  gender: string
  DOB: string
  onOpenChange: (open: boolean) => void
}

interface CreateBusinessAccount {
  id: number
  clerkID: string
  firstName: string
  lastName: string
  onOpenChange: (open: boolean) => void
}

interface SuspendUser {
  id: number
  clerkID: string
  firstName: string
  lastName: string
  onOpenChange: (open: boolean) => void
}

function RenderVerifyDocument({
  id,
  clerkID,
  documentType,
  documentID,
  firstname,
  lastname,
  gender,
  DOB,
  onOpenChange,
}: VerifyDocumentProps) {
  const [loading, setLoading] = useState(false)

  const handleAction = () => {
    setLoading(true)
    // Simulate API call
    VerifyUser({ id, clerkID }).then((res) => {
      if (res.httpStatus === 200) {
        toast.success(`Account ${res.data?.id} Verified: ${res.data?.isVerified}`)
        onOpenChange(false)
      } else {
        toast.error(`${res.error?.message}`)
        onOpenChange(false)
      }
    })
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5 text-green-500" />
          Verify Documents
        </DialogTitle>
        <DialogDescription>
          Please recheck the information carefuly before approving the document
        </DialogDescription>
      </DialogHeader>
      <div className="information-form space-y-4">
        <div className="user-information flex gap-x-2">
          <div className="fullname w-1/2">
            <Label htmlFor="notes">Fullname</Label>
            <Input
              id="fullname"
              placeholder="Add any additional information..."
              value={`${firstname} ${lastname}`}
              disabled
            />
          </div>
          <div className="gender w-1/4">
            <Label htmlFor="gender">Gender</Label>
            <Input
              id="gender"
              placeholder="Add any additional information..."
              value={gender}
              disabled
            />
          </div>
          <div className="DOB w-1/4">
            <Label htmlFor="DOB">DOB</Label>
            <Input id="DOB" placeholder="Add any additional information..." value={DOB} disabled />
          </div>
        </div>
        <div className="document-field flex w-full items-center gap-x-2">
          <div className="document-type w-1/3 space-y-2">
            <Label htmlFor="document-type text-lg font-semibold">Document Type</Label>
            <Input id="document-type" type="text" value={documentType} disabled />
          </div>
          <div className="document-field w-2/3 space-y-2">
            <Label htmlFor="document-id text-lg font-semibold">Document ID</Label>
            <Input id="document-id" type="text" value={documentID} disabled />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleAction}
          disabled={loading}
          variant={'default'}
          className={` ${loading && 'bg-blue-500/50'} border-none hover:bg-blue-300 duration-300 bg-blue-500 text-white `}
        >
          {loading ? 'Processing...' : 'Verify Documents'}
        </Button>
      </DialogFooter>
    </>
  )
}

function RenderCreateBusinessAccount({
  id,
  clerkID,
  firstName,
  lastName,
  onOpenChange,
}: CreateBusinessAccount) {
  const [loading, setLoading] = useState(false)

  const handleAction = () => {
    setLoading(true)
    // Simulate API call
    CreateBusinessAccount({ id, clerkID }).then((res) => {
      if (res.success) {
        toast.success(`Business Account Created Successfully`)
        onOpenChange(false)
      } else {
        toast.error(`${res.error?.message}`)
        onOpenChange(false)
      }
    })
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-500" />
          Create Business Account
        </DialogTitle>
        <DialogDescription>
          Set up a business account for user: {firstName} {lastName}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleAction}
          disabled={loading}
          variant={'default'}
          className={` ${loading && 'bg-blue-500/50'} border-none hover:bg-blue-300 duration-300 bg-blue-500 text-white `}
        >
          {loading ? 'Processing...' : 'Proceed'}
        </Button>
      </DialogFooter>
    </>
  )
}

function RenderSuspendUser({ id, clerkID, firstName, lastName, onOpenChange }: SuspendUser) {
  const [loading, setLoading] = useState(false)

  const handleAction = () => {
    setLoading(true)
    // Simulate API call
    SuspendUser({ id, clerkID }).then((res) => {
      if (res.success) {
        toast.success(`User Suspended Successfully`)
        onOpenChange(false)
      } else {
        toast.error(`${res.error?.message}`)
        onOpenChange(false)
      }
    })
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Suspend User {firstName} {lastName}
        </DialogTitle>
        <DialogDescription>
          You are about to suspend user: {firstName} {lastName}. This action can be reversed later.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="rounded-md bg-red-100 p-4">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-destructive">Warning</h4>
            <p className="text-sm text-gray-700">
              Suspending this account will immediately revoke access to all services. The user will
              be notified via email.
            </p>
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="suspension-reason">Reason for Suspension</Label>
          <select
            id="suspension-reason"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="terms-violation">Terms of Service Violation</option>
            <option value="suspicious-activity">Suspicious Activity</option>
            <option value="payment-issue">Payment Issue</option>
            <option value="user-request">User Request</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="suspension-notes">Additional Notes</Label>
          <Textarea
            id="suspension-notes"
            placeholder="Provide details about the suspension..."
            className="w-full resize-y focus:border-none"
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={handleAction}
          disabled={loading}
          variant={'default'}
          className={` ${loading && 'bg-red-500/50'} border-none hover:bg-red-300 duration-300 bg-red-500 text-white `}
        >
          {loading ? 'Processing...' : 'Suspend'}
        </Button>
      </DialogFooter>
    </>
  )
}

export function ActionDialog({ user, clerkID, action, open, onOpenChange }: ActionDialogProps) {
  const renderDialogContent = () => {
    switch (action) {
      case 'VerifyDocument':
        return (
          <RenderVerifyDocument
            id={user.id}
            clerkID={clerkID}
            documentType={user.citizenshipDocument.documentType}
            documentID={user.citizenshipDocument.documentID}
            onOpenChange={onOpenChange}
            firstname={user.userInformation.firstName}
            lastname={user.userInformation.lastName}
            gender={user.userInformation.gender}
            DOB={user.userInformation.DOB.split('T')[0]}
          />
        )
      case 'CreateBusinessAccount':
        return (
          <RenderCreateBusinessAccount
            id={user.id}
            clerkID={clerkID}
            firstName={user.userInformation.firstName}
            lastName={user.userInformation.lastName}
            onOpenChange={onOpenChange}
          />
        )
      case 'SuspendUser':
        return (
          <RenderSuspendUser
            id={user.id}
            firstName={user.userInformation.firstName}
            lastName={user.userInformation.lastName}
            clerkID={clerkID}
            onOpenChange={onOpenChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-4 bg-white shadow-none hover:bg-white border-none hover:cursor-pointer"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-6 w-6 " />
        </Button>

        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  )
}

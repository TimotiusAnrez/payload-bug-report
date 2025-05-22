'use client'

import { useState } from 'react'
import { UserCheck, Building, AlertTriangle, SettingsIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ActionDialog } from '@/components/payload/ui/collections/users/settingActionDialog'
import { usePathname } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '@/actions/users/read.action'
import { User } from '@/payload-types'
import { useAuth } from '@clerk/nextjs'

export type ActionType = 'VerifyDocument' | 'CreateBusinessAccount' | 'SuspendUser'

//will receive admin id later to verify admin instead of using client
export default function UserSettingsPopover() {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null)
  const pathName = usePathname()
  const id = +pathName.split('/').reverse()[0]
  const { data, isLoading, error } = useQuery({
    queryKey: ['get-user'],
    queryFn: () => getUser({ id }),
  })
  const { userId } = useAuth()

  const handleActionClick = (action: ActionType) => {
    setCurrentAction(action)
    setDialogOpen(true)
    setOpen(false)
  }

  if (isLoading)
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full bg-white hover:bg-gray-200 duration-300 hover:border-gray-500 hover:cursor-pointer"
      >
        <SettingsIcon size={24} className="animate-spin" />
      </Button>
    )

  if (error || !data || !data.data || !userId)
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-white hover:bg-gray-200 duration-300 hover:border-gray-500 hover:cursor-pointer"
        disabled
      >
        <SettingsIcon size={24} />
      </Button>
    )

  const user: User = data.data

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full bg-white hover:bg-gray-200 duration-300 hover:border-gray-500 hover:cursor-pointer"
          >
            <SettingsIcon size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-fit px-4 py-2 border-gray-500 border-[0.5px] space-y-2 bg-white"
          align="end"
        >
          <Button
            variant="ghost"
            className="flex w-full justify-start border-none gap-2 px-2 py-2 text-md h-fit bg-white text-gray-500 hover:text-primary duration-300 hover:cursor-pointer"
            onClick={() => handleActionClick('VerifyDocument')}
          >
            <UserCheck className="h-4 w-4" />
            Verify Documents
          </Button>
          <Button
            variant="ghost"
            className="flex w-full justify-start border-none gap-2 px-2 py-2 text-md h-fit bg-white text-gray-500 hover:text-primary duration-300 hover:cursor-pointer"
            onClick={() => handleActionClick('CreateBusinessAccount')}
          >
            <Building className="h-4 w-4" />
            Create Business Account
          </Button>
          <Button
            variant="ghost"
            className="flex w-full justify-start border-none gap-2 px-2 py-2 text-md h-fit bg-white text-gray-500 hover:text-primary duration-300 hover:cursor-pointer"
            onClick={() => handleActionClick('SuspendUser')}
          >
            <AlertTriangle className="h-4 w-4" />
            Suspend Account
          </Button>
        </PopoverContent>
      </Popover>

      {currentAction && (
        <ActionDialog
          user={data.data}
          clerkID={userId}
          action={currentAction}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  )
}

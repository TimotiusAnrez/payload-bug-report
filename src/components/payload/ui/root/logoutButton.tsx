import { Button } from '@/components/ui/button'
import { SignOutButton } from '@clerk/nextjs'
import { LogOutIcon } from 'lucide-react'

export async function LogoutButton() {
  return (
    <div className="w-full p-2 relative bottom-5 hover:cursor-pointer">
      <SignOutButton>
        <div className="w-full flex justify-center  gap-x-4 items-center">
          <LogOutIcon size={24} />
          <h3>Exit</h3>
        </div>
      </SignOutButton>
    </div>
  )
}

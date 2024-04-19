'use client'

import { User } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { LogOut, ShoppingBag } from 'lucide-react'

type Props= {
  user: User
}
export default function UserAccountNav({ user }: Props) {

  const router= useRouter()

  async function onLogout(){
    
    await signOut({ redirect: false })
    router.refresh()
    router.push("/")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='overflow-visible'>
        <Button
          variant='ghost'
          size='sm'
          className='relative'>
          Mi cuenta
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='bg-white w-60'
        align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            <p className='font-medium text-sm text-black'>
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='#'>
            <Button variant="ghost" className='px-1 w-full gap-2 justify-start' disabled>
              <ShoppingBag className='w-5 h-5' /> Mis ordenes
            </Button>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onLogout}
          className=''>
            <Button variant="ghost" className='px-1 w-full gap-2 justify-start'>
              <LogOut size={20}/> <p>Logout</p> 
            </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}



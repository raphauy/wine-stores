"use client"

import { useEffect, useState } from "react";
import { ArrowLeftRight, ChevronsLeft, ChevronsRight, Loader, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserForm, DeleteUserForm } from "./user-forms"
import { getUserDAOAction } from "./user-actions"
import { UserRole } from "@prisma/client";
import { useRoles } from "./use-roles";
import { useSession } from "next-auth/react";

type Props= {
  id?: string
  storeId?: string
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create User</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function UserDialog({ id, storeId }: Props) {
  const [open, setOpen] = useState(false);

  const role= useSession().data?.user.role
  if (role !== UserRole.ADMIN && role !== UserRole.STORE_OWNER && role !== UserRole.STORE_ADMIN) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : addTrigger }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Actualizar' : 'Crear'} Usuario
          </DialogTitle>
        </DialogHeader>
        <UserForm closeDialog={() => setOpen(false)} id={id} storeId={storeId} />
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteUserDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  const role= useSession().data?.user.role
  if (role !== UserRole.ADMIN && role !== UserRole.STORE_OWNER && role !== UserRole.STORE_ADMIN) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Usuario</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteUserForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  

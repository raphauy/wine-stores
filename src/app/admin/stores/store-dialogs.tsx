"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, PlusCircle, Trash2, User } from "lucide-react";
import { useState } from "react";
import { IgStoreForm } from "./ig-handle-form";
import { DeleteStoreForm, StoreForm } from "./store-forms";
import UserSelector from "./user-selector";

type Props= {
  id?: string
  igForm?: boolean
}

const addTrigger= <Button><PlusCircle size={22} className="mr-2"/>Create Store</Button>
const addTriggerIg= <Button><PlusCircle size={22} className="mr-2"/>Create with IG handle</Button>
const updateTrigger= <Pencil size={30} className="pr-2 hover:cursor-pointer"/>

export function StoreDialog({ id, igForm }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {id ? updateTrigger : igForm ? addTriggerIg : addTrigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? 'Update' : 'Create'} Store
          </DialogTitle>
        </DialogHeader>
        {
          igForm ? <IgStoreForm id={id} closeDialog={() => setOpen(false)} /> : <StoreForm id={id} closeDialog={() => setOpen(false)} />
        }
      </DialogContent>
    </Dialog>
  )
}
  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteStoreDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Store</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteStoreForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

type UserSelectorProps= {
  storeId: string
}

export function UserSelectorDialog({ storeId }: UserSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <User />
        </Button>
      </DialogTrigger>
      <DialogContent className="h-96 flex flex-col">
        <DialogHeader>
          <DialogTitle>Select the Owner</DialogTitle>
          <DialogDescription className="py-3">Select the owner of the store</DialogDescription>
        </DialogHeader>
        <UserSelector storeId={storeId} closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
  

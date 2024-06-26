"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteOrderForm } from "./order-forms";
import { useSession } from "next-auth/react";

  
type DeleteProps= {
  id: string
  description: string
}

export function DeleteOrderDialog({ id, description }: DeleteProps) {
  const [open, setOpen] = useState(false)
  const session= useSession()
  const user= session?.data?.user
  if (user?.email !== "rapha.uy2@rapha.uy") 
    return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Trash2 className="hover:cursor-pointer"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Order</DialogTitle>
          <DialogDescription className="py-8">{description}</DialogDescription>
        </DialogHeader>
        <DeleteOrderForm closeDialog={() => setOpen(false)} id={id} />
      </DialogContent>
    </Dialog>
  )
}

interface CollectionProps{
  id: string
  title: string
}




  

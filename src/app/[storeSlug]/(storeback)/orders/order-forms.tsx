"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteOrderAction, createOrUpdateOrderAction, getOrderDAOAction } from "./order-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCart } from "@/hooks/use-cart"
import { z } from "zod"
import { FormValues, schema } from "../../(storefront)/checkout/datos-de-envio/page"

type Props= {
  setData: (data: FormValues) => void
}

export function OrderForm({ setData }: Props) {
  const { email, phone, address } = useCart() 

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email,
      phone,
      address,
    },
    mode: "onChange",
  })

  const router= useRouter()

  const onSubmit = async (data: FormValues) => {
    setData(data)
  }


  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Tu email" {...field} />
                </FormControl>
                <FormDescription>Tu orden quedará asociada a este email</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input placeholder="ej: 099..." {...field} />
                </FormControl>
                <FormDescription>Un celular de contacto (opcional pero recomendado)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección" {...field} />
                </FormControl>
                <FormDescription>La dirección a la que quieres que se te envíe tu compra</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex flex-col gap-2">
            <Button type="submit" className="flex-1">Continuar</Button>
            <Button onClick={() => router.back()} type="button" variant={"secondary"} className="">Volver</Button>
          </div>

        </form>
      </Form>
    </div>     
  )
}

type DeleteProps= {
  id: string
  closeDialog: () => void
}
export function DeleteOrderForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteOrderAction(id)
    .then(() => {
      toast({title: "Order deleted" })
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}


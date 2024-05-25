"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { useCart } from "@/hooks/use-cart"
import { DatosEnvioFormValues, datosEnvioSchema } from "@/services/order-services"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { deleteOrderAction } from "./order-actions"

type Props= {
  setData: (data: DatosEnvioFormValues) => void
}

export function OrderForm({ setData }: Props) {
  const { email, name, address, phone } = useCart()  

  const form = useForm<DatosEnvioFormValues>({
    resolver: zodResolver(datosEnvioSchema),
    defaultValues: {
      email,
      name,
      address,
      phone,
    },
    mode: "onChange",
  })

  const router= useRouter()

  const onSubmit = async (data: DatosEnvioFormValues) => {
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del destinatario</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} />
                </FormControl>
                <FormDescription>Tu nombre</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección del destinatario</FormLabel>
                <FormControl>
                  <Input placeholder="Garzón 1214" {...field} />
                </FormControl>
                <FormDescription>La dirección a la que quieres que se te envíe tu compra</FormDescription>
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


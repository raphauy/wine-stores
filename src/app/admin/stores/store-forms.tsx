"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { StoreFormValues, storeSchema } from '@/services/store-services'
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { createOrUpdateStoreAction, deleteStoreAction, getStoreDAOAction } from "./store-actions"

type Props= {
  id?: string
  closeDialog: () => void
}

export function StoreForm({ id, closeDialog }: Props) {
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      prefix: "",
      slug: "",
      image: "",
      igHandle: "",
      description: "",
      mpRedirectUrl: "",
      contactEmail: "",
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: StoreFormValues) => {

    setLoading(true)
    try {
      await createOrUpdateStoreAction(id ? id : null, data)
      toast({ title: id ? "Store updated" : "Store created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getStoreDAOAction(id).then((data) => {
        if (data) {
          form.setValue("name", data.name)
          form.setValue("prefix", data.prefix)
          form.setValue("slug", data.slug)
          form.setValue("image", data.image)
          form.setValue("igHandle", data.igHandle)
          form.setValue("contactEmail", data.contactEmail)
          form.setValue("description", data.description)
          form.setValue("mpRedirectUrl", data.mpRedirectUrl)
          form.setValue("mpMarketplaceFee", data.mpMarketplaceFee.toString())
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Store's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prefix"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prefix</FormLabel>
                <FormControl>
                  <Input placeholder="Store's prefix" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input placeholder="Store's image" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
      
          <FormField
            control={form.control}
            name="igHandle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IgHandle</FormLabel>
                <FormControl>
                  <Input placeholder="Store's igHandle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="Contact Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mpRedirectUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MP Redirect URL</FormLabel>
                <FormControl>
                  <Input placeholder="MP Redirect URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mpMarketplaceFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MP Marketplace percentage fee (%)</FormLabel>
                <FormControl>
                  <Input placeholder="ej: 10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      
        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancelar</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Guardar</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteStoreForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteStoreAction(id)
    .then(() => {
      toast({ title: "Store deleted" })
    })
    .catch((error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}


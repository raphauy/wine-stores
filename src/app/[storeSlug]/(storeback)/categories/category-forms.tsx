"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteCategoryAction, createOrUpdateCategoryAction, getCategoryDAOAction } from "./category-actions"
import { categorySchema, CategoryFormValues } from '@/services/category-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { useParams } from "next/navigation"
import { generateSlug } from "@/lib/utils"

type Props= {
  id?: string
  closeDialog: () => void
}

export function CategoryForm({ id, closeDialog }: Props) {
  const params= useParams()
  const storeSlug= params.storeSlug as string

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      storeSlug
    },
    mode: "onChange",
  })
  const watchName = form.watch("name")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    setSlug(generateSlug(watchName))
  }, [watchName])
  const [loading, setLoading] = useState(false)
  

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateCategoryAction(id ? id : null, data)
      toast({ title: id ? "Category updated" : "Category created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getCategoryDAOAction(id).then((data) => {
        if (data) {
          form.setValue("name", data.name)
          form.setValue("storeSlug", storeSlug)
          form.setValue("slug", data.slug)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id, storeSlug])

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
                  <Input placeholder="Category's name" {...field} />
                </FormControl>
                <FormMessage />
                <p>slug: {slug}</p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} disabled={true} value={generateSlug(watchName)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

      
        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteCategoryForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCategoryAction(id)
    .then(() => {
      toast({title: "Category deleted" })
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
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 ml-2 gap-1">
        { loading && <Loader className="h-4 w-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}


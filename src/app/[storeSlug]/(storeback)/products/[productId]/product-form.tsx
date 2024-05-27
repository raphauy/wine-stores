"use client"

import * as z from "zod"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/heading"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/image-upload"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductDAO, ProductFormValues, productSchema } from "@/services/product-services"
import { ImageDAO } from "@/services/image-services"
import { CategoryDAO } from "@/services/category-services"
import { toast } from "@/components/ui/use-toast"
import { DeleteProductDialog } from "../product-dialogs"
import { createProductAction, updateProductAction } from "../product-actions"
import { Textarea } from "@/components/ui/textarea"
import { generateSlug } from "@/lib/utils"


interface ProductFormProps {
  initialData: ProductDAO | null;
  categories: CategoryDAO[];
};

export function ProductForm({ initialData, categories }: ProductFormProps) {

  const params= useParams()
  const storeSlug= params.storeSlug as string
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Editar' : 'Crear' + " producto";
  const description = initialData ? 'Editar un producto.' : 'Agregar un nuevo producto';
  const toastMessage = initialData ? 'Producto actualizado.' : 'Producto creado.';
  const action = initialData ? 'Guardar' : 'Crear';

  const defaultValues = initialData ? {
    ...initialData,
    description: initialData.description || "",
    price: String(initialData?.price),
    discountPrice: String(initialData?.discountPrice),
  } : {
    name: '',
    slug: '',
    description: '',
    images: [],
    price: "0",
    discountPrice: "0",
    categoryId: '',
    isFeatured: false,
    isArchived: false,
    initialQuantity: "0",
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues
  });
  const watchName = form.watch("name")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    setSlug(generateSlug(watchName))
    form.setValue("slug", slug)
  }, [watchName, slug, form])
  

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true)
      data.slug= slug
      if (initialData) {
        await updateProductAction(initialData.id, data)
      } else {
        const categorySlug= categories.find((category) => category.id === data.categoryId)?.slug
        if (!categorySlug) {
          toast({ title: "Error", description: "No se pudo crear el producto, el categoría no existe.", variant: "destructive" })
        } else {
          await createProductAction(storeSlug, categorySlug, data)
        }
      }
      toast({ title: toastMessage })        
      router.push(`/products`);
    } catch (error: any) {
      toast({ title: "Algo salió mal!", description: error.message, variant: "destructive"})
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <DeleteProductDialog id={initialData.id} description={`Seguro que deseas eliminar el producto ${initialData.name}`} />
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full bg-white p-2 border rounded-md">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload 
                    value={field.value.map((image) => image.url)} 
                    disabled={loading} 
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-2 gap-8 space-y-4">
          <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p></p>
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Slug</FormLabel>
                  <FormControl >
                    <Input placeholder="" {...field} disabled={true} value={slug} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p>slug: {slug}</p>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio con descuento</FormLabel>
                    <FormControl>
                      <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea rows={6} disabled={loading} placeholder="Descripción del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Destacado
                    </FormLabel>
                    <FormDescription>
                      Este producto aparecerá en la página principal.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archivado
                    </FormLabel>
                    <FormDescription>
                      Este producto dejará de estar a la venta.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad inicial</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

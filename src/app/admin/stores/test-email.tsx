"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { sendConfirmationTestEmailAction } from "./store-actions"
import { toast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from "lucide-react"

type TestProps= {
    storeId: string
    type: "confirmation" | "general"
}
  
  export function TestConfirmatioinEmailDialog({ storeId, type }: TestProps) {
    const [open, setOpen] = useState(false);
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="whitespace-nowrap">Enviar email de prueba</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar email de prueba</DialogTitle>
          </DialogHeader>
          { type === "confirmation" && <TestConfirmatioinEmailForm closeDialog={() => setOpen(false)} storeId={storeId} /> }
          
        </DialogContent>
      </Dialog>
    )
  }
  

type TestFormProps= {
    storeId: string
    closeDialog: () => void
}

export function TestConfirmatioinEmailForm({ storeId, closeDialog }: TestFormProps) {
const testEnvioSchema = z.object({
    mailTo: z.string().email({ message: "Invalid email" }),
})

type TestEnvioFormValues = z.infer<typeof testEnvioSchema>

const form = useForm<TestEnvioFormValues>({
    resolver: zodResolver(testEnvioSchema),
    defaultValues: {},
    mode: "onChange",
})
const [loading, setLoading] = useState(false)


const onSubmit = async (data: TestEnvioFormValues) => {
    setLoading(true)
    try {
        await sendConfirmationTestEmailAction(storeId, data.mailTo)
        toast({ title: "Email de prueba enviado" })
        closeDialog()
    } catch (error: any) {
        toast({ title: "Error", description: "Verifica que el Newsletter hasya sido guardado.", variant: "destructive" })
    } finally {
        setLoading(false)
    }
}


return (
    <div className="p-4 bg-white rounded-md">
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        <FormField
            control={form.control}
            name="mailTo"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Email To</FormLabel>
                <FormControl>
                <Input placeholder="Email To" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button variant="outline" type="submit" className="w-32 ml-2">
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <p>Enviar Email</p>}
            </Button>
        </div>
        </form>
    </Form>
    </div>     
)
}

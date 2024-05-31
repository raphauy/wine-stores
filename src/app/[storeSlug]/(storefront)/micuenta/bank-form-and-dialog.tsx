"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { BankDataDAO } from "@/services/bankdata-services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getBanksDatasOfStoreAction } from "../../(storeback)/bankdatas/bankdata-actions";
import { setOrderTransferenciaBancariaPaymentSentWithBankAction } from "../../(storeback)/orders/order-actions";
import { Textarea } from "@/components/ui/textarea";

  
type Props= {
  orderId: string
  storeId: string
}

export function MarkAsPaidDialog({ storeId, orderId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Marcar transferencia enviada</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar transferencia enviada</DialogTitle>
        </DialogHeader>
        <MarkAsPaidForm closeDialog={() => setOpen(false)} storeId={storeId} orderId={orderId} />
      </DialogContent>
    </Dialog>
  )
}

export const bankSchema = z.object({
	bankId: z.string(),
	comment: z.string().optional(),
})

export type BankFormValues = z.infer<typeof bankSchema>

type FormProps= {
  orderId: string
  storeId: string
  closeDialog: () => void
}

export function MarkAsPaidForm({ storeId, orderId, closeDialog }: FormProps) {

  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankId: "",
      comment: ""
    },
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [bankId, setBankId] = useState("")
  const [bankData, setBankData] = useState<BankDataDAO[] | null>([])

  const onSubmit = async (data: BankFormValues) => {
    setLoading(true)
    try {
      await setOrderTransferenciaBancariaPaymentSentWithBankAction(orderId, data.bankId, data.comment)      
      toast({ title: "Orden marcada como pagada" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBanksDatasOfStoreAction(storeId)
    .then((data) => {
      if (data) {
        setBankData(data) 
      }
    })
  }, [storeId])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="bankId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banco</FormLabel>
                <Select onValueChange={(value) => field.onChange(value)} value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el banco por el que transferiste" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bankData?.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>{bank.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentario (Opcional)</FormLabel>
                <Textarea rows={5}  {...field} />
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

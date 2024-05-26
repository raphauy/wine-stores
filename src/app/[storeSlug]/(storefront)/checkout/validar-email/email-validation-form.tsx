"use client";

import { FormError } from "@/app/auth/login/_components/form-error";
import { FormSuccess } from "@/app/auth/login/_components/form-success";
import { loginAction } from "@/app/auth/login/actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { LoginSchema } from "@/services/login-services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";


type Props = {
  requestedEmail?: string
  storeName?: string
}
export function EmailValidationForm({ requestedEmail, storeName }: Props) {

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in use with different provider!"
    : "";

  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [otpText, setOtpText] = useState("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: requestedEmail || "",      
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(() => {
      if (showOTP && !values.code) {
        setError("Por favor ingrese el código de verificación")
        return;
      }
      loginAction(values, "/checkout/datos-bancarios")
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error)
            form.setValue("email", values.email)
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success)
          }

          if (data?.code) {
            setShowOTP(true)
            form.setValue("email", values.email)
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-10 rounded-2xl bg-white dark:bg-black dark:shadow-gray-100 dark:shadow-xl border shadow-2xl"
      >
        <div className="mb-7 w-full text-muted-foreground">
          <p className="font-bold text-center mb-10">Solo nos queda validar tu email</p>
          {showOTP && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem  className="flex flex-col items-center">
                  <FormLabel>Código de acceso</FormLabel>
                  <FormControl className="w-full ">
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <p>-</p>
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Ingresa el código enviado a tu email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />            )}
          {!showOTP && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input                        
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@ejemplo.com"
                        type="email"
                      />
                    </FormControl>
                    <FormDescription className="pt-3">
                      Te enviaremos un código a esta casilla de correo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </>
        )}
        </div>
        <FormError message={error || urlError} />
        <FormSuccess message={success} />
        <Button disabled={isPending} type="submit" className="w-full">
          {showOTP ? "Confirmar" : isPending ? <Loader className="w-6 h-6 animate-spin" /> : "Enviar código"}
        </Button>
      </form>
    </Form>

  );
};

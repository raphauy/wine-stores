import { getCurrentUser } from "@/lib/utils"
import { redirect } from "next/navigation"
import { EmailValidationForm } from "./email-validation-form"

type Props = {
  searchParams: {
    email: string
  }
}
export default async function ValidarEmailPage({ searchParams }: Props) {
  const email= searchParams.email

  const user= await getCurrentUser()

  if (user) {
    return redirect("/checkout/datos-bancarios")
  }
  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">
      <EmailValidationForm requestedEmail={email} />
    </div>
  )
}

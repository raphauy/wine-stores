import { redirect } from "next/navigation"

export default function RedirectLoginPage() {

    redirect("/auth/login")

    return (
        <div>RedirectLoginPage</div>
    )
}

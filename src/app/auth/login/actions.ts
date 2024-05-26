"use server";

import { signIn } from "@/lib/auth";
import { sendCodeEmail } from "@/lib/mail";
import { LoginSchema, createOTPConfirmation, deleteOTPConfirmation, generateOTPCode, getOTPCodeByEmail, getOTPConfirmationByUserId, getUserByEmail, setUserAsVerified } from "@/services/login-services";
import { UserFormValues, createUser } from "@/services/user-services";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import * as z from "zod";


export async function loginAction(values: z.infer<typeof LoginSchema>, callbackUrl?: string) {
  
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, code } = validatedFields.data;

  let user = await getUserByEmail(email);

  if (!user || !user.email) {
    // create new user
    const data: UserFormValues= {
      email,
      role: "CLIENT"
    }
    user = await createUser(data)
    if (!user) {
      return { error: "Error al crear usuario! Por favor intenta de nuevo." }
    }
  }

  if (user.email) {
    if (code) {
      const oTPCode = await getOTPCodeByEmail(user.email)

      if (!oTPCode) {
        return { error: "Código no encontrado!" }
      }

      if (oTPCode.code !== code) {
        return { error: "Código equivocado!" }
      }

      const hasExpired = new Date(oTPCode.expires) < new Date()

      if (hasExpired) {
        return { error: "Código expirado!" }
      }

      await setUserAsVerified(user.id)

      // await deleteOTPCode(oTPCode.id)

      const existingConfirmation = await getOTPConfirmationByUserId(user.id)

      if (existingConfirmation) {
        await deleteOTPConfirmation(existingConfirmation.id)
      }

      await createOTPConfirmation(user.id)
    } else {
      const oTPCode = await generateOTPCode(user.email)
      await sendCodeEmail(
        oTPCode.email,
        oTPCode.code,
      );

      return { code: true, success: "Te enviamos un código de acceso!" };
    }
  }

  try {
    console.log("credentials", { email, code });
    
    const ok= await signIn("credentials", {
      email,
      code
    }, callbackUrl)

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credenciales inválidas!" }
        default:
          return { error: "Algo salió mal!" }
      }
    }

    throw error;
  }
};

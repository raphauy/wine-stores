import { OrderDAO } from "@/services/order-services";
import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_URL;

export async function sendNodeMailerEmail(to: string, subject: string, html: string, bcc?: string) {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    bcc: bcc,
    subject,
    html,
  });
}

export async function sendCodeEmail(email: string, code: string) {
  
    await sendNodeMailerEmail(email, "Código de acceso", `<p>Código de acceso para Latidio: <span>${code}</span></p>`);
}

export async function sendOrderConfirmationEmail(email: string, order: OrderDAO, url: string) {
  const store= order.store
  const html = `
    <p>Muchas gracias por comprar en ${store.name}!</p>
    <p>Este es un email de confirmación de tu compra.</p>
    <p>En breve nos pondremos en contacto contigo para brindarle información sobre el envío.</p>
    <p>Puedes revisar el estado de tu compra en <a href="${url}">Mi cuenta</a></p>
    <p>Gracias por su compra!</p>
  `;

  const bcc= process.env.EMAIL_BCC
  await sendNodeMailerEmail(email, "Confirmación de compra", html, bcc);

  console.log("sendOrderConfirmationEmail to", email)
  
}
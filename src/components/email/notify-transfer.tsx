import { StoreDAO } from "@/services/store-services";
import { Body, Container, Button, Column, Head, Hr, Html, Img, Link, Preview, Row, Section, Text, Tailwind, Heading } from "@react-email/components"
import * as React from "react";

interface VercelInviteUserEmailProps {
  store: StoreDAO
  buyerName: string;
  buyerEmail: string;
  paymentAmount: number;
  paymentMethod: string;
  orderNumber: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const NotifyTransferEmail = ({
  store,
  buyerName,
  buyerEmail,
  paymentAmount,
  paymentMethod,
  orderNumber,
}: VercelInviteUserEmailProps) => {
  const previewText = `Transferencia enviada`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[32px]">
              <Img
                src="https://res.cloudinary.com/dcy8vuzjb/image/upload/v1713885570/demo-store/248451668_2739383413037833_764397266421891032_n.jpg_i6wwz2.jpg"
                width="50"
                height="50"
                alt="Latidio"
                className="my-0 mx-auto rounded-full border"
              />
            </Section>
            <Heading className="text-blue-500 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Transferencia enviada!</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              Hola {store.name}, <strong>{buyerName}</strong> (
              <Link
                href={`mailto:${buyerEmail}`}
                className="text-blue-600 no-underline"
              >
                {buyerEmail}
              </Link>
              ) ha marcado como enviada una <strong>{paymentMethod}</strong>.
            </Text>
            <Text className="text-black text-[14px] leading-[24px] text-center">
              El siguiente paso es verificar que el dinero haya llegado y marcar la orden como pagada en el dashboard de ventas.
            </Text>
            <Text className="text-black text-[20px] leading-[24px] text-center mt-10 mb-10">
              Monto: <strong>$ {paymentAmount}</strong>
            </Text>
            <Text className="text-black text-[14px] leading-[24px] text-center mt-10 mb-5">
              Orden: <strong>{orderNumber}</strong>
            </Text>
            <Section>
              <Row>
                <Column align="center">
                  <Img
                    className="rounded-full"
                    src={store.image}
                    width="64"
                    height="64"
                  />
                </Column>
              </Row>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Link href={`${store.mpRedirectUrl}/orders`}
                className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center px-5 py-3"
                >
                Dashboard de Ventas en {store.name}
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

NotifyTransferEmail.PreviewProps = {
  store: {
    contactEmail: "soporte@uruguayenvinos.com",
    name: "Uruguay en Vinos",
    image: "https://res.cloudinary.com/dcy8vuzjb/image/upload/v1715110186/demo-store/uruguay_en_vinos_n9orku.png",
  },
  buyerName: "Alan",
  buyerEmail: "alan.turing@example.com",
  paymentAmount: 100,
  paymentMethod: "Transferencia bancaria",
  orderNumber: "UV#00000123",
} as VercelInviteUserEmailProps;

export default NotifyTransferEmail

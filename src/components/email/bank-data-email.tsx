import { generateSlug } from "@/lib/utils"
import { BankDataDAO } from "@/services/bankdata-services"
import { OrderItem } from "@prisma/client"
import { Body, Container, Button, Column, Head, Hr, Html, Img, Link, Preview, Row, Section, Text } from "@react-email/components"
import * as React from "react"

type Props = {
  storeName: string
  storeId: string
  orderEmail: string
  orderId: string
  baseUrl: string
  formattedDate: string
  name: string
  address: string
  city: string
  phone: string
  items: OrderItem[]
  totalPrice: number
  finalText: string
  bankData: BankDataDAO[]
}
export default function BankDataEmail({ storeName="Latidio", storeId, orderEmail="test@test.com", orderId="clvwozc58000135igexu0egeu", baseUrl="http://localhost:3000", formattedDate="18 enero 2024", name="Alan Turing", address="Garzón 1234", city="Montevideo", phone="0987654321", items=[], totalPrice=0, finalText="Texto final", bankData=[] }: Props) {
    return (
  <Html>
    <Head />
    <Preview>Orden de compra pendiente de pago</Preview>

    <Body style={main}>
      <Container style={container}>
        <Section>
          <Row>
            <Column style={logoColumn}>
              <Img
                src={`https://res.cloudinary.com/dcy8vuzjb/image/upload/v1715110186/demo-store/uruguay_en_vinos_n9orku.png`}
                width="42"
                height="42"
                style={logoStyle}
                alt="Logo de la tienda"
              />
            </Column>
            <Column>
              <Text style={heading}>{storeName}</Text>
            </Column>
          </Row>
        </Section>
        <Section>
          <Row>
            <Column align="center">
              <Text style={heading2}>Orden de compra pendiente de pago</Text>
            </Column>
          </Row>
        </Section>
        <Section style={productTitleTable}>
          <Text style={productsTitle}>Datos para realizar el pago vía transferencia bancaria:</Text>
        </Section>
        <Section>
          {
          bankData.map((item, index) => (
            <Row key={index} style={ { marginBottom: "10px" } }>
              <Column style={{ paddingLeft: "22px", verticalAlign: "top" }}>
                <Text style={{ fontWeight: "bold", fontSize: "20px" }}>{item.name}</Text>
                <Text style={{ whiteSpace: "pre-line" }}>
                  {item.info}
                </Text>
              </Column>
            </Row>
          ))
          }
            {/* <Row style={ { marginBottom: "1px" } }>
              <Column style={{ paddingLeft: "22px", verticalAlign: "top" }}>
                <Text style={{ fontWeight: "bold", fontSize: "20px" }}>BROU</Text>
                <Text style={{ whiteSpace: "pre-line" }}>
                  {"UYU (CA): 001197054-00001 (Fabio Raphael Carvalho)"}
                  {"\nFormato viejo: CA, Suc: 151, Cuenta: 1274858"}
                  {"\nUSD (CA): 001197054-00002 (Fabio Carvalho)"}
                </Text>
              </Column>
            </Row> */}
        </Section>

        
        <Section style={productTitleTable}>
          <Text style={productsTitle}>Detalle de la compra:</Text>
        </Section>
        <Section>
          {
          items.map((item, index) => (
            <Row key={index} style={ { marginBottom: "10px" } }>
              <Column style={{ width: "64px" }}>
                <Img
                  src={item.soldImage || "#"}
                  width="64"
                  height="64"
                  alt={item.soldName || "Producto"}
                  style={productIcon}
                />
              </Column>
              <Column style={{ paddingLeft: "22px" }}>
                <Text style={productTitle}>{item.soldName}</Text>
                <Text style={productCategory}>{item.soldCategory}</Text>
                <Link style={productLink} href={`${baseUrl}/${generateSlug(item.soldCategory || "")}/${generateSlug(item.soldName || "")}`}>
                  Volver a comprar
                </Link>
              </Column>

              <Column style={productPriceWrapper} align="right">
                <Text style={productPrice}>
                  {item.quantity > 1 ? `(x ${item.quantity}) ` : ""}
                  ${item.soldUnitPrice}
                </Text>
              </Column>
            </Row>
          ))
          }
        </Section>
        {/* <Section>
          <Row>
            <Column style={{ width: "64px" }}>
              <Img
                src={`https://res.cloudinary.com/dcy8vuzjb/image/upload/v1715110186/demo-store/uruguay_en_vinos_n9orku.png`}
                width="64"
                height="64"
                alt="HBO Max"
                style={productIcon}
              />
            </Column>
            <Column style={{ paddingLeft: "22px" }}>
              <Text style={productTitle}>Uruguay en Vinos</Text>
              <Text style={productCategory}>Libros</Text>
              <Link
                href="#"
                style={productLink}
              >
                Volver a comprar
              </Link>
            </Column>

            <Column style={productPriceWrapper} align="right">
              <Text style={productPrice}>$1490</Text>
            </Column>
          </Row>
        </Section> */}
        <Hr style={productPriceLine} />
        <Section align="right">
          <Row>
            <Column style={tableCell} align="right">
              <Text style={productPriceTotal}>TOTAL a transferir</Text>
            </Column>
            <Column style={productPriceVerticalLine}></Column>
            <Column style={productPriceLargeWrapper}>
              <Text style={productPriceLarge}>${totalPrice}</Text>
            </Column>
          </Row>
        </Section>
        <Hr style={{margin: "0 0 20px 0"}} />
        <Text style={finalTextStyle}>
          {finalText}
        </Text>
        <Button style={button} href={`${baseUrl}/micuenta?email=${orderEmail}&storeId=${storeId}&orderId=${orderId}`}>
          Ingresar a Mi cuenta
        </Button>
        <Text style={finalTextStyle}>
          {"\nGracias por la compra,\n" + storeName}
        </Text>
      </Container>
    </Body>
  </Html>
)
}

const main = {
  fontFamily: '"Helvetica Neue",Helvetica,Arial,sans-serif',
  backgroundColor: "#ffffff",
};

const resetText = {
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const container = {
  margin: "0 auto",
  padding: "20px 20px 20px 20px",
  width: "660px",
  maxWidth: "100%",
  borderRadius: "10px",
  border: "1px solid rgba(128,128,128,0.3)",
};

const finalTextStyle = {
  margin: "0 0 20px 0",
  fontSize: "14px",
  fontWeight: "500",
  color: "#111111",
  whiteSpace: "pre-line",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const tableCell = { display: "table-cell" };

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#000000",
};

const heading2 = {
  marginTop: "40px",
  fontSize: "24px",
  fontWeight: "300",
  color: "#888888",
};

const logoStyle= {
  borderRadius: "50%",
  border: "1px solid rgba(128,128,128,0.2)",
}

const logoColumn = {
  width: "42px",
  height: "42px",
  paddingRight: "10px",
}

const cupomText = {
  textAlign: "center" as const,
  margin: "36px 0 40px 0",
  fontSize: "14px",
  fontWeight: "500",
  color: "#111111",
};

const supStyle = {
  fontWeight: "300",
};

const informationTable = {
  borderSpacing: "0px",
  color: "rgb(51,51,51)",
  backgroundColor: "rgb(250,250,250)",
  borderRadius: "5px",
  border: "1px solid rgba(128,128,128,0.3)",  
  fontSize: "12px",
};

const informationTableRow = {
  height: "46px",
};

const informationTableColumn = {
  width: "200px",
  paddingLeft: "20px",
  borderStyle: "solid",
  borderColor: "white",
  borderWidth: "0px 1px 1px 0px",
  height: "44px",
};

const informationTableLabel = {
  ...resetText,
  color: "rgb(102,102,102)",
  fontSize: "18px",
};

const informationTableValue = {
  fontSize: "14px",
  margin: "0",
  padding: "0",
  lineHeight: 1.4,
};

const productTitleTable = {
  ...informationTable,
  margin: "30px 0 15px 0",
  paddingTop: "5px",
  height: "24px",
};

const productsTitle = {
  background: "#fafafa",
  paddingLeft: "10px",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const envioValue = {
  fontSize: "14px",
  margin: "0",
  padding: "0px 0px 0px 25px",
  lineHeight: 1.4,
};

const productIcon = {
  margin: "0 0 0 20px",
  borderRadius: "12px",
  border: "1px solid rgba(128,128,128,0.2)",
};

const productTitle = { fontSize: "12px", fontWeight: "600", ...resetText };

const productCategory = { fontSize: "12px", color: "rgb(102,102,102)", ...resetText };

const productDescription = {
  fontSize: "12px",
  color: "rgb(102,102,102)",
  ...resetText,
};

const productLink = {
  fontSize: "12px",
  color: "rgb(0,112,201)",
  textDecoration: "none",
};

const divisor = {
  marginLeft: "4px",
  marginRight: "4px",
  color: "rgb(51,51,51)",
  fontWeight: 200,
};

const productPriceTotal = {
  margin: "0",
  color: "rgb(102,102,102)",
  fontSize: "10px",
  fontWeight: "600",
  padding: "0px 30px 0px 0px",
  textAlign: "right" as const,
};

const productPrice = {
  fontSize: "12px",
  fontWeight: "600",
  margin: "0",
};

const productPriceLarge = {
  margin: "0px 20px 0px 0px",
  fontSize: "16px",
  fontWeight: "600",
  whiteSpace: "nowrap" as const,
  textAlign: "right" as const,
};

const productPriceWrapper = {
  display: "table-cell",
  padding: "0px 20px 0px 0px",
  width: "100px",
  verticalAlign: "top",
};

const productPriceLine = { margin: "30px 0 0 0" };

const productPriceVerticalLine = {
  height: "48px",
  borderLeft: "1px solid",
  borderColor: "rgb(238,238,238)",
};

const productPriceLargeWrapper = { display: "table-cell", width: "90px" };

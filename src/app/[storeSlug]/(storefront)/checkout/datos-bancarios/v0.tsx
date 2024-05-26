import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Component() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-4 mb-6">
        <Avatar>
          <AvatarImage alt="Uruguay en Vinos" src="/placeholder.svg?height=50&width=50" />
          <AvatarFallback>UV</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">Uruguay en Vinos</h1>
      </div>
      <h2 className="text-xl font-semibold mb-4">Orden de compra pendiente de pago</h2>
      <div className="border-t border-b py-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Datos para realizar el pago vía transferencia bancaria:</h3>
        <p className="font-bold">BROU</p>
        <p>Nombre: Gabriela Zimmer</p>
        <p>Moneda: UYU</p>
        <p>Caja de ahorro</p>
        <p>Cuenta: 001234567-00001</p>
        <p>Formato viejo: CA, Suc: 15, Cuenta: 1274727</p>
      </div>
      <div className="border-t border-b py-4 mb-6">
        <h3 className="text-lg font-medium mb-2">Detalle de la compra:</h3>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              alt="Libro"
              className="rounded"
              height="50"
              src="/placeholder.svg"
              style={{
                aspectRatio: "50/50",
                objectFit: "cover",
              }}
              width="50"
            />
            <div>
              <p className="font-semibold">Uruguay en Vinos</p>
              <p>Libros</p>
              <Button className="mt-2" variant="outline">
                Volver a comprar
              </Button>
            </div>
          </div>
          <p className="font-bold text-lg">$1490</p>
        </div>
        <div className="flex justify-between items-center mt-4 font-bold text-lg">
          <span>TOTAL a transferir</span>
          <span>$1490</span>
        </div>
      </div>
      <p className="mb-4">
        Una vez que hayas realizado el pago, debes ingresar a Mi cuenta y marcar la orden como pagada.
      </p>
      <Button>Mi cuenta</Button>
    </div>
  )
}
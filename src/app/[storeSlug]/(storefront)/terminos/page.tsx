import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { extractEmail } from "@/lib/utils"
import { getStoreDAOBySlug } from "@/services/store-services"

type Props= {
  params: {
    storeSlug: string
  }
}

export default async function TerminosPage({ params }: Props) {
    const store= await getStoreDAOBySlug(params.storeSlug)

    if (!store) {
        return <div>Store not found</div>
    }

    return (
        <div className="w-full bg-white p-8">
        <MaxWidthWrapper>
            <h1 className="text-4xl font-bold mb-8">Términos del Servicio</h1>

            <div className="space-y-6">
            <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
                <p>Bienvenido a la tienda de {store.name}. Al realizar una compra en nuestra tienda, usted acepta los siguientes términos del servicio. Por favor, léalos cuidadosamente antes de realizar su compra.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">2. Productos y Precios</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Los precios de los productos están en pesos uruguayos (UYU) e incluyen impuestos aplicables, salvo indicación contraria.</li>
                <li>Nos reservamos el derecho de modificar los precios en cualquier momento sin previo aviso. Sin embargo, los precios aplicables a su pedido serán los indicados en el momento de la compra.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">3. Pedidos</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Al realizar un pedido, usted se compromete a proporcionar información veraz, precisa y completa.</li>
                <li>La confirmación del pedido se enviará por correo electrónico.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">4. Pagos</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Aceptamos los siguientes métodos de pago: Mercado Pago y transferencia bancaria.</li>
                <li>Usted garantiza que está autorizado a utilizar el método de pago seleccionado y que los datos proporcionados son correctos.</li>
                <li>El pago se procesará en el momento de la confirmación del pedido.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">5. Envíos</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Los gastos de envío se calcularán en el momento de la compra y dependerán del destino y del método de envío seleccionado.</li>
                <li>No nos responsabilizamos por retrasos en la entrega causados por terceros.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">6. Devoluciones y Reembolsos</h2>
                <p>No ofrecemos reembolsos para libros una vez comprados. Por favor, asegúrese de que desea el libro antes de completar su compra.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">7. Garantía y Responsabilidad</h2>
                <p>No somos responsables por daños directos, indirectos, incidentales o consecuentes que resulten del uso o la incapacidad de usar los productos comprados.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">8. Privacidad</h2>
                <p>La información personal proporcionada durante el proceso de compra será tratada de acuerdo con nuestra Política de Privacidad.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">9. Modificaciones</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Nos reservamos el derecho de modificar estos términos del servicio en cualquier momento. Las modificaciones serán efectivas a partir de su publicación en la tienda.</li>
                <li>Es su responsabilidad revisar periódicamente estos términos para estar informado de cualquier cambio.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">10. Contacto</h2>
                <p>Si tiene alguna pregunta o inquietud sobre estos términos del servicio, por favor contáctenos en {extractEmail(store.contactEmail || "Soporte <soporte@latidio.com>")}</p>
            </section>
            </div>
        </MaxWidthWrapper>
        </div>
    )
}

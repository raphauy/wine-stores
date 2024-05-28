import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { extractEmail } from "@/lib/utils"
import { getStoreDAOBySlug } from "@/services/store-services"

type Props= {
  params: {
    storeSlug: string
  }
}

export default async function PoliticaPrivacidadPage({ params }: Props) {
    const store= await getStoreDAOBySlug(params.storeSlug)

    if (!store) {
        return <div>Store not found</div>
    }

    return (
        <div className="w-full bg-white p-8">
        <MaxWidthWrapper>
            <h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>

            <div className="space-y-6">
            <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
                <p>Valoramos su privacidad y nos comprometemos a proteger su información personal. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos sus datos personales cuando utiliza nuestra tienda.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Información de contacto: nombre, dirección de correo electrónico, dirección postal, número de teléfono.</li>
                <li>Información de pedidos: detalles de los productos que ha comprado y las fechas de sus pedidos.</li>
                <li>Información de navegación: datos sobre su uso de nuestro sitio web, incluyendo dirección IP, tipo de navegador, páginas visitadas y duración de las visitas.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">3. Uso de la Información</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Procesar y completar sus pedidos.</li>
                <li>Comunicarnos con usted sobre su pedido y proporcionar soporte al cliente.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">4. Compartir Información</h2>
                <p>No compartimos su información personal con terceros.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">5. Seguridad de la Información</h2>
                <p>Implementamos medidas de seguridad adecuadas para proteger su información personal contra el acceso no autorizado, la alteración, divulgación o destrucción.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">6. Sus Derechos</h2>
                <ul className="list-disc list-inside space-y-2 ml-7">
                <li>Acceder a sus datos personales y solicitar una copia de la información que tenemos sobre usted.</li>
                <li>Solicitar la corrección de cualquier información incorrecta o incompleta.</li>
                <li>Solicitar la eliminación de sus datos personales, sujeto a ciertas excepciones legales.</li>
                <li>Retirar su consentimiento para el uso de sus datos personales en cualquier momento.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">7. Cambios en la Política de Privacidad</h2>
                <p>Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Cualquier cambio será publicado en esta página y la fecha de la última actualización será indicada al final de la política.</p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
                <p>Si tiene alguna pregunta o inquietud sobre esta Política de Privacidad, por favor contáctenos en {extractEmail(store.contactEmail || "Soporte <soporte@latidio.com>")}</p>
            </section>

            <p className="text-gray-500 mt-8">Última actualización: Mayo 2024</p>
            </div>
        </MaxWidthWrapper>
        </div>
    )
}

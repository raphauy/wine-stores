import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { getInventoryItemDAOByProductId } from "@/services/inventoryitem-services"
import { DataTable } from "../../stockmovements/stockmovement-table"
import { columns } from "../../stockmovements/stockmovement-columns"
import { StockMovementDialog } from "../../stockmovements/stockmovement-dialogs"
import StatBox from "./stat-box"

type Props = {
    params: {
        productId: string
    }
}
export default async function ProductInventoryPage({ params }: Props) {
    const productId = params.productId
    const inventoryItem = await getInventoryItemDAOByProductId(productId)
    if (!inventoryItem) return <div className="w-full">No se encontró el inventario del producto</div>

    const stockMovements = inventoryItem?.stockMovements
    const totalSold= stockMovements?.reduce((acc, stockMovement) => acc + (stockMovement.type === "VENTA" ? stockMovement.quantity : 0), 0)
    const soldPercentage = (totalSold / inventoryItem?.quantity * 100).toFixed(0)
    const totalRetirado= stockMovements?.reduce((acc, stockMovement) => acc + (stockMovement.type === "SALIDA" ? stockMovement.quantity : 0), 0)
    const retiradoPercentage = (totalRetirado / inventoryItem?.quantity * 100).toFixed(0)
    return (
        <div className="w-full">
            <Card className="p-2 md:p-4 flex justify-between items-center">
                <CardTitle>Inventario de {inventoryItem?.product?.name}</CardTitle>
                <StockMovementDialog inventoryItemId={inventoryItem.id} />
            </Card>

            <div className="w-full pt-6 grid md:grid-cols-3 gap-4 lg:w-[900px] mx-auto">
                <StatBox title="Stock" subtitle={`queda ${100-Number(soldPercentage)-Number(retiradoPercentage)}% del stock`} value={inventoryItem?.quantity} percentange={100-Number(soldPercentage)-Number(retiradoPercentage)} />
                <StatBox title="Vendidos" subtitle={`${soldPercentage}% del stock vendido`} value={totalSold} percentange={Number(soldPercentage)} />
                <StatBox title="Retirados" subtitle={`${retiradoPercentage}% del stock retirado`} value={totalRetirado} percentange={Number(retiradoPercentage)} />
            </div>

            <div className="container mt-6 bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
                <DataTable columns={columns} data={stockMovements} subject="Order"/>
            </div>

        </div>
    )
}

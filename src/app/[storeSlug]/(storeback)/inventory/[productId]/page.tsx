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
    const totalSold= stockMovements?.reduce((acc, stockMovement) => acc + (stockMovement.type === "SALIDA" ? stockMovement.quantity : 0), 0)
    const soldPercentage = (totalSold / inventoryItem?.quantity * 100).toFixed(0)
    return (
        <div className="w-full">
            <Card className="p-2 md:p-4">
                <CardTitle>Inventario de {inventoryItem?.product?.name}</CardTitle>
                <div className="flex justify-between mt-4">
                    <div className="flex flex-col gap-2">
                        <div className="">
                            <div className="text-xl">{inventoryItem?.quantity} en stock</div>
                            <div className="text-xl">vendidos: {totalSold}</div>
                        </div>
                    </div>
                    <StockMovementDialog inventoryItemId={inventoryItem.id} />
                </div>
            </Card>

            <div className="w-full pt-6 grid md:grid-cols-2 gap-4 lg:w-[600px] mx-auto">
                <StatBox title="Stock" subtitle={`queda ${100-Number(soldPercentage)}% del stock`} value={inventoryItem?.quantity} percentange={100-Number(soldPercentage)} />
                <StatBox title="Vendidos" subtitle={`${soldPercentage}% del stock vendido`} value={totalSold} percentange={Number(soldPercentage)} />
            </div>

            <div className="container mt-6 bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
                <DataTable columns={columns} data={stockMovements} subject="Order"/>
            </div>

        </div>
    )
}

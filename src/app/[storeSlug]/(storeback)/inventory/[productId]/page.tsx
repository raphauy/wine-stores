import { Button } from "@/components/ui/button"
import { Card, CardTitle } from "@/components/ui/card"
import { getInventoryItemDAOByProductId } from "@/services/inventoryitem-services"
import { DataTable } from "../../stockmovements/stockmovement-table"
import { columns } from "../../stockmovements/stockmovement-columns"
import { StockMovementDialog } from "../../stockmovements/stockmovement-dialogs"

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
    return (
        <div className="w-full">
            <Card className="p-2 md:p-4">
                <CardTitle>Inventario de {inventoryItem?.product?.name}</CardTitle>
                <div className="flex justify-between mt-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div className="text-xl">{inventoryItem?.quantity} en stock</div>
                        </div>
                    </div>
                    <StockMovementDialog inventoryItemId={inventoryItem.id} />
                </div>
            </Card>

            <div className="container mt-10 bg-white p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
                <DataTable columns={columns} data={stockMovements} subject="Order"/>
            </div>

        </div>
    )
}

import { getStoreDAOBySlug } from "@/services/store-services";
import { ProductForm } from "./product-form";
import { getProductDAO } from "@/services/product-services";
import { getAllCategorysDAO } from "@/services/category-services";

type Props= {
    params: {
        storeSlug: string;
        productId?: string;
    }
}
export default async function NewProductPage({ params }: Props) {
    const storeSlug = params.storeSlug
    const productId = params.productId

    const product= productId ? await getProductDAO(productId) : null    

    const categories= await getAllCategorysDAO(storeSlug)

    return ( 
        <div className="flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm 
              categories={categories} 
              initialData={product}
            />
          </div>
        </div>
      );
}    
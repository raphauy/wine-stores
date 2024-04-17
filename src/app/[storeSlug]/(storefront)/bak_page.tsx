import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ProductDAO, getFeaturedProducts, getFullProductsDAO, getMostPopularProducts, getNewestProducts } from "@/services/product-services"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

type Props= {
  params: {
      storeSlug: string;
  }
}

export default function HomePage({ params }: Props) {
  const storeSlug= params.storeSlug
  return (
    <main className="space-y-12 pt-10">
      <ProductGridSection title="Destacados" productsFetcher={getFeaturedProducts} storeSlug={storeSlug} />
      <ProductGridSection title="Todos" productsFetcher={getFullProductsDAO} storeSlug={storeSlug} />
    </main>
  )
}

type ProductGridSectionProps = {
  title: string
  productsFetcher: (storeSlug: string) => Promise<ProductDAO[]>
  storeSlug: string
}

export function ProductGridSection({ productsFetcher, title, storeSlug }: ProductGridSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {/* <h2 className="text-3xl font-bold">{title}</h2>
        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button> */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetcher={productsFetcher} storeSlug={storeSlug} />
        </Suspense>
      </div>
    </div>
  )
}

type FetcherProps = {
  storeSlug: string
  productsFetcher: (storeSlug: string) => Promise<ProductDAO[]>
}
async function ProductSuspense({ storeSlug, productsFetcher }: FetcherProps) {
  return (await productsFetcher(storeSlug)).map((product) => (
    <ProductCard key={product.id} {...product} />
  ))
}

'use client'

import ProductCard from './ProductCard'

type Product = {
  name: string
  description: string
  slug: string
  imageUrl?: string
}

type ProductGridProps = {
  products: Product[]
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (

    <section className="bg-[#0F0F0F] py-10">

      <div className="mx-auto max-w-6xl px-6">

        <div className="grid gap-20 md:grid-cols-2">

          {products.map((product) => (

            <ProductCard
              key={product.slug}
              name={product.name}
              description={product.description}
              slug={product.slug}
              imageUrl={product.imageUrl}
            />

          ))}

        </div>

      </div>

    </section>

  )
}
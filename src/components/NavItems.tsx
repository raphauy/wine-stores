'use client'

import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { useEffect, useRef, useState } from 'react'
import NavItem from './NavItem'
import { CategoryDAO } from '@/services/category-services'
import { ProductDAO } from '@/services/product-services'

type Props= {
  categories: CategoryDAO[]
  featuredProducts: ProductDAO[]
}

export default function NavItems({ categories, featuredProducts }: Props) {
  const [activeIndex, setActiveIndex] = useState<
    null | number
  >(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null)
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])

  const isAnyOpen = activeIndex !== null

  const navRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(navRef, () => setActiveIndex(null))

  return (
    <div className='flex gap-4 h-full' ref={navRef}>
      {categories.map((category, i) => {
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIndex(null)
          } else {
            setActiveIndex(i)
          }
        }

        const close = () => setActiveIndex(null)

        const isOpen = i === activeIndex

        return (
          <NavItem
            category={category}
            close={close}
            handleOpen={handleOpen}
            isOpen={isOpen}
            key={category.name}
            isAnyOpen={isAnyOpen}
            categories={categories}
            featuredProducts={featuredProducts}
          />
        )
      })}
    </div>
  )
}



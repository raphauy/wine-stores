'use client'

import { useCart } from '@/hooks/use-cart'


export default function SendData() {

  const { email, name, address, phone } = useCart()

  return (
    <section className='mt-8 rounded-lg border bg-white px-4 py-6 sm:p-6'>
      <h2 className='text-lg font-medium text-gray-900'>Datos de envío</h2>
      <div className='flex items-center'>
        <p className='w-20'>Email:  </p>
        <p className='font-bold'>{email}</p>
      </div>
      <div className='flex items-center'>
        <p className='w-20'>Nombre:  </p>
        <p className='font-bold'>{name}</p>
      </div>
      <div className='flex items-center'>
        <p className='w-20'>Dirección:  </p>
        <p className='font-bold'>{address}</p>
      </div>
      <div className='flex items-center'>
        <p className='w-20'>Teléfono:  </p>
        <p className='font-bold'>{phone}</p>
      </div>
    </section>
)
}



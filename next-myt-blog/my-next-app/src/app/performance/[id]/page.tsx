'use client';
import React from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation';
import { products } from '../page';


function Page() {
  const params=useParams();
  const product = products.find(item => item.id == params.id)!;
  return (
    <div className='contianer mx-auto pt-8'>
      <Image alt={product?.imageAlt}
        src={product?.imageSrc} width={500} height={500} className='mx-auto rounded-lg' />
        <div className='border-2 border-dashed border-gray-500 rounded-lg p-3'>
      <p>
        <strong>Title</strong>{product.imageAlt}
      </p>
      <p>
        <strong>price</strong>{product.price}
      </p>
      <p>
        <strong>Desc</strong>{product.color}
      </p>
        </div>
    </div>
  )
}

export default Page
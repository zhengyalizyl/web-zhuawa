'use client';
import React from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { products } from '../../page';


function Page() {
  const params=useParams();
  const product = products.find(item => item.id == params.id)!;
 const router= useRouter();
  return (
    <div className='flex justify-center items-center fixed inset-0 bg-gray-500/[.8]' onClick={router.back}>
      <Image alt={product?.imageAlt}
        src={product?.imageSrc} width={500} height={500} className='mx-auto rounded-lg' onClick={e=>e.stopPropagation()} />
    </div>
  )
}

export default Page
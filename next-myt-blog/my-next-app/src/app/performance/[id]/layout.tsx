'use client';
import React from 'react'
import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({
  children,
  modal
}: {
  children: React.ReactNode
 modal: React.ReactNode
}) {
  return (
    <>
      { modal}
      {children}

    </>
  )
}

import React from 'react'
import './loader.css'

export default function Loader({text}) {
  return (
    <div>
      <div>loading {text}...</div>
      <div className="weird-loader"></div>
      <div className="weird-loader"></div>
      <div className="weird-loader"></div>
      <div className="weird-loader"></div>
    </div>
  )
}

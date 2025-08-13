'use client'
import { useSearchParams } from "next/navigation"
export default function  Des() {
    const search=useSearchParams()
    const id =search.get('id')
    const title=search.get('title')
     const desc=search.get('descrption')

    
    return (
        <>
        <h1>{id}</h1>
        <h1>{title}</h1>
        <h1>{desc}</h1>
        </>
    )
}
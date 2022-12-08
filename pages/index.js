import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'
import {useRouter} from 'next/router'
import { useState } from 'react'

import Navbar from '../components/Navbar'
import Carousel from '../components/Carousel'
import Products from '../components/Products'

export default function Home() {
  const router = useRouter()
  const[chosenItems, setItems] = useState([])

  function check(list, item) {
    let bool = false
    list.forEach((i)=>{
      if(i.product_id===item.product_id) {
        bool = true
      }else{
        bool = false
      }
    })
    return bool
  }

  async function addProductToBasket(item) {
    let newList = [...chosenItems]
    let product

    console.log(newList)
    if(newList.length === 0){
      setItems([...chosenItems, item])
    }else{

      product = chosenItems.filter((i)=>i["product_id"]==item["product_id"])
      
      if(product.length!=0){
        newList[newList.indexOf(product[0])]["quantity"] += 1
        setItems([])
        setItems(newList)
  
      }else{
        setItems([...chosenItems, item])
      }
    }
    // setItems([...chosenItems, item])
    showBasket(false)
  }

  function showBasket(toggle) {
    let elClass = document.getElementById("basket").className
    if(toggle===true){
      if(elClass==="fixed border-2 border-black bg-white rounded-md p-3 text-black right-5 flex flex-wrap flex-col") {
        document.getElementById("basket").className = "fixed border-2 border-black bg-white rounded-md p-3 text-black right-5 flex flex-wrap flex-col hidden"
      } else{
          document.getElementById("basket").className = "fixed border-2 border-black bg-white rounded-md p-3 text-black right-5 flex flex-wrap flex-col"
      }  
    }else{
      document.getElementById("basket").className = "fixed border-2 border-black bg-white rounded-md p-3 text-black right-5 flex flex-wrap flex-col"
    }
  }

  async function handleCheckout() {
    const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(chosenItems)
    })
    .then(r=>{return(r.json())})
    .then(url => {
      if (typeof window !== 'undefined') {
        router.push(url.msg)
      }
    })   
  }

  return (
    <>
      <Head>
        <Script rel="stylesheet" href="https://unpkg.com/tailwindcss@2.2.19/dist/tailwind.min.css"></Script>
        <Script href="https://fonts.googleapis.com/css?family=Work+Sans:200,400&display=swap" rel="stylesheet"></Script>
        <title>Ecommerce Store</title>
      </Head>
    <div>
      <Navbar chosenItems={chosenItems} showBasket={showBasket} />
      <Carousel />
      <Products addProductToBasket={addProductToBasket} handleCheckout={handleCheckout} />
    </div>
    </>
  )
}

import React, { useState } from 'react'
import ProductList from '../components/ProductList'
import apiService from '../services/apiService'

const Main = () => {
  const [products, setProducts] = useState([])

  const handleProductFetch = async () => {
    const fetchedProducts = await apiService.getCategory('jackets')
    console.log('fetched', fetchedProducts)
    fetchedProducts && setProducts(fetchedProducts)
  }

  return (
    <>
      <h1>Products</h1>
      <button onClick={handleProductFetch}>Jackets</button>
      <ProductList products={products} />
    </>
  )
}

export default Main

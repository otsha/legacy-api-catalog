import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Navigation from '../components/Navigation'
import ProductList from '../components/ProductList'
import apiService from '../services/apiService'

const categories = [{ name: 'Jackets' }, { name: 'Shirts' }, { name: 'Accessories' }]

const Category = () => {
  const router = useRouter()
  const { category } = router.query
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!categories.find(cat => cat.name.toLowerCase() === category)) {
      router.replace('/jackets')
      return
    }

    setProducts(null)
    const fetchProducts = async () => {
      const fetchedProducts = await apiService.getProductsByCategory(category)
      fetchedProducts.error
        ? setError(fetchedProducts.error)
        : setProducts(fetchedProducts)
    }

    fetchProducts()
  }, [category])

  return (
    <>
      <Navigation categories={categories} currentCategory={category} />
      { error && <p>{error}</p>}
      <ProductList products={products} />
    </>
  )
}

export default Category

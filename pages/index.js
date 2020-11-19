import React, { useState, useEffect } from 'react'
import ProductList from '../components/ProductList'
import apiService from '../services/apiService'

const categories = [{ name: 'jackets' }, { name: 'shirts' }, { name: 'accessories' }]

const Main = () => {
  const [category, setCategory] = useState(categories.find(c => c.name === 'jackets'))
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await apiService.getCategory(category.name)
      fetchedProducts && setProducts(fetchedProducts)
    }

    fetchProducts()
  }, [category])

  return (
    <>
      <h1>Products</h1>
      <nav>
        {categories.map(cat =>
          <button
            key={cat.name}
            onClick={() => setCategory(categories.find(c => c.name === cat.name))}>
            {cat.name}
          </button>
        )}
      </nav>
      <ProductList products={products} />
    </>
  )
}

export default Main

import React, { useState, useEffect } from 'react'
import ProductList from '../components/ProductList'
import apiService from '../services/apiService'

const categories = [{ name: 'Jackets' }, { name: 'Shirts' }, { name: 'Accessories' }]

const Main = () => {
  const [category, setCategory] = useState(categories.find(c => c.name === 'Jackets'))
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    setProducts(null)
    const fetchProducts = async () => {
      const fetchedProducts = await apiService.getProductsByCategory(category.name)
      fetchedProducts.error
        ? setError(fetchedProducts.error)
        : setProducts(fetchedProducts)
    }

    fetchProducts()
  }, [category])

  return (
    <>
      <h1>Product Catalog</h1>
      <nav>
        {categories.map(cat =>
          <button
            className={cat.name === category.name ? 'active-category' : ''}
            key={cat.name}
            onClick={() => setCategory(categories.find(c => c.name === cat.name))}>
            {cat.name}
          </button>
        )}
    </nav>
      { error && <p>{error}</p> }
  <ProductList products={products} />
    </>
  )
}

export default Main

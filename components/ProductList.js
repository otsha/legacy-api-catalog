import React from 'react'

const ProductList = ({ products }) => {
  if (!products) {
    return <div>Loading...</div>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Color</th>
          <th>Manufacturer</th>
          <th>Price</th>
          <th>Availability</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) =>
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.color}</td>
            <td>{product.manufacturer}</td>
            <td>{product.price}</td>
            <td>{product.availability || 'AVAILABILITY UNKNOWN'}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ProductList

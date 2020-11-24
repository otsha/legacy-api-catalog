import axios from 'axios'

const apiUrl = 'https://bad-api-assignment.reaktor.com'

let cachedCategories = new Map()
let cachedManufacturers = new Map()

/**
 * Fetches products in a given category from the product API, then
 * combines availability information fetched from the availability API to
 * return a list of products with all the desired information included.
 *
 * @param {*} category The category from which to fetch products
 */
const getProductsByCategory = async (category) => {
  const products = await getCategory(category.toLowerCase())

  if (products.error) {
    return products
  }

  const manufacturers = [...new Set(products.map(p => p.manufacturer))]

  const availabilities = await Promise.all(
    manufacturers.map(async m => ({
      name: m,
      products: await getManufacturer(m)
    }))
  )

  const productsWithAvailability = products.map(product => {
    const productAvailability = availabilities
      .find(manufacturer => manufacturer.name === product.manufacturer)
      .products
      .find(p => p.id.toUpperCase() === product.id.toUpperCase())

    return ({
      ...product,
      availability: productAvailability ? productAvailability.DATAPAYLOAD : null
    })
  })

  return productsWithAvailability
}

/**
 * A helper function that fetches a list of products in a given category from the product API.
 *
 * @param {*} category The category to be fetched
 */
export const getCategory = async (category) => {
  const res = await axios.get(`${apiUrl}/products/${category}`)

  switch (res.status) {
    case 200:
      cachedCategories.set(category, res.data)
      return res.data
    case 304:
      return cachedCategories.get(category)
    default:
      return { error: `ERROR: Product API returned ${res.status}: ${res.statusText}` }
  }
}

/**
 * A helper function that fetches the list of products and their availability information from the availability API.
 *
 * @param {*} manufacturer The manufacturer whose availability info should be fetched
 */
export const getManufacturer = async (manufacturer) => {
  const res = await axios.get(`${apiUrl}/availability/${manufacturer}`)

  switch (res.status) {
    case 200: {
      if (res.data.response === '[]') {
        return []
      }

      const trimmed = res.data.response.map(product => ({
        id: product.id,
        DATAPAYLOAD: product.DATAPAYLOAD.replace(/<\/?\w+>|(\n|\\n)\s*/g, '')
      }))

      cachedManufacturers.set(manufacturer, trimmed)
      return trimmed
    }
    case 304:
      return cachedManufacturers.get(manufacturer)
    default:
      return []
  }
}

export default { getProductsByCategory }

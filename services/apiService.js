import axios from 'axios'

const apiUrl = 'https://bad-api-assignment.reaktor.com'

/* NOTE: The current CORS options of the API do not allow accessing the ETag header. */
let categoryETag = ''
let manufacturerETag = ''

/**
 * Fetches products in a given category from the product API, then
 * combines availability information fetched from the availability API to
 * return a list of products with all desired information included.
 *
 * @param {*} category The category from which to fetch products
 */
const getProductsByCategory = async (category) => {
  const products = await getCategory(category)
  const manufacturers = [...new Set(products.map(p => p.manufacturer))]

  let availabilitiesByManufacturer = []
  for (const manufacturer of manufacturers) {
    const manufacturerInfo = await getManufacturer(manufacturer)
    availabilitiesByManufacturer.push(manufacturerInfo)
  }

  const availabilities = [].concat.apply([], availabilitiesByManufacturer)

  const productsWithAvailability = products.map(product => {
    const availabilityInfo = availabilities.find(p => p.id === product.id.toUpperCase())
    return ({
      ...product,
      availability: availabilityInfo ? availabilityInfo.DATAPAYLOAD : null
    })
  })

  return productsWithAvailability
}

/**
 * A private helper function that fetches a list of products in a given category from the product API.
 *
 * @param {*} category The category to be fetched
 */
const getCategory = async (category) => {
  const config = { headers: { 'If-None-Match': categoryETag } }
  const res = await axios.get(`${apiUrl}/products/${category}`, config)

  switch (res.status) {
    case 200:
      categoryETag = res.headers['etag']
      return res.data
    case 304:
      return null
    default:
      console.warn('Server returned', res.status, res.statusText)
      return null
  }
}

/**
 * A private helper function that fetches the list of products and their availability information from the availability API.
 *
 * @param {*} manufacturer The manufacturer whose availability info should be fetched
 */
const getManufacturer = async (manufacturer) => {
  const config = { headers: { 'If-None-Match': manufacturerETag } }
  const res = await axios.get(`${apiUrl}/availability/${manufacturer}`, config)

  switch (res.status) {
    case 200:
      res.data.response !== [] && (manufacturerETag = res.headers['etag'])
      return res.data.response
    case 304:
      return null
    default:
      console.warn('Server returned', res.status, res.statusText)
      return null
  }
}

export default { getProductsByCategory }

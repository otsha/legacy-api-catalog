import axios from 'axios'

const apiUrl = 'https://bad-api-assignment.reaktor.com'

let categoryETag = ''

/**
 * Fetches a list of products in a given category from the product API.
 * @param {*} category The category to be fetched
 * |
 */
const getCategory = async (category) => {
  const config = { headers: { 'If-None-Match': categoryETag } }
  const res = await axios.get(`${apiUrl}/products/${category}`, config)

  if (res.status === 304) {
    return null
  } else {
    categoryETag = res.headers['etag']
    return res.data
  }
}

export default { getCategory }

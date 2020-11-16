import axios from 'axios'

const apiUrl = 'https://bad-api-assignment.reaktor.com'

let categoryETag = ''

/* Internal helper methods actually responsible for fetching data from the APIs */

const getCategory = async (category) => {
  const config = { headers: { 'If-None-Match': categoryETag } }
  const res = await axios.get(`${apiUrl}/products/${category}`, config)

  if (res.status === 304) {
    console.log('API returned 304: Unmodified')
    return null
  } else {
    categoryETag = res.headers['etag']
    console.log(categoryETag)
    return res.data
  }
}

export default { getCategory }

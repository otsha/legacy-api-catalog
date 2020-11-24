import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import apiService, { getCategory, getManufacturer } from './apiService'

jest.mock('axios')

let mockJackets = [
  { id: '0a', type: 'jacket', name: 'SPEEDRACER', color: ['black', 'red'], price: '50', manufacturer: 'adios' },
  { id: '1p', type: 'jacket', name: 'EXPLORER', color: ['white', 'blue', 'green'], price: '120', manufacturer: 'duckling' },
  { id: '2d', type: 'jacket', name: 'BUDGET CASUAL', color: ['black', 'brown'], price: '24.99', manufacturer: 'kide' }
]

let mockManufacturers = [
  {
    code: 200,
    response: [
      { id: '0A', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' },
      { id: '4C', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' },
      { id: 'B5', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' }
    ]
  },
  {
    code: 200,
    response: [
      { id: '25', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' },
      { id: '1P', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>LESSTHAN10</INSTOCKVALUE>\n</AVAILABILITY>' },
      { id: '6W', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' }
    ]
  },
  {
    code: 200,
    response: [
      { id: '2D', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' },
    ]
  }
]

const apiFailureResponse = { code: 200, response: [] }

describe('When the availability API does not fail', () => {

  test('The returned product availabilities are not null', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockJackets })
      .mockResolvedValueOnce({ status: 200, data: mockManufacturers[0] })
      .mockResolvedValueOnce({ status: 200, data: mockManufacturers[1] })
      .mockResolvedValue({ status: 200, data: mockManufacturers[2] })

    const products = await apiService.getProductsByCategory('jackets')
    expect(products.every(p => p.availability !== null)).toBe(true)
  })

  test('Unused XML is stripped from the availability status', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockJackets })
      .mockResolvedValueOnce({ status: 200, data: mockManufacturers[0] })
      .mockResolvedValueOnce({ status: 200, data: mockManufacturers[1] })
      .mockResolvedValue({ status: 200, data: mockManufacturers[2] })

    const products = await apiService.getProductsByCategory('jackets')
    expect(products.every(p => ['INSTOCK', 'OUTOFSTOCK', 'LESSTHAN10'].includes(p.availability))).toBe(true)
  })

  test('When a manufacturer returns status 304, the availability list matches the previously cached one', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockManufacturers[0] })
      .mockResolvedValue({ status: 304 })

    const fetchedManufacturer = await getManufacturer('adios')
    const cachedManufacturer = await getManufacturer('adios')
    expect(cachedManufacturer).toEqual(fetchedManufacturer)
  })

  test('If a manufacturer returns updated information, the availability list does not match the cached one', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: { response: [{ id: '0A', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>OUTOFSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' }] } })
      .mockResolvedValue({ status: 200, data: { response: [{ id: '0A', DATAPAYLOAD: '<AVAILABILITY>\n  <INSTOCKVALUE>INSTOCK</INSTOCKVALUE>\n</AVAILABILITY>' }] } })

    const fetchedProducts = await getManufacturer('adios')
    const newProducts = await getManufacturer('adios')
    expect(newProducts).not.toEqual(fetchedProducts)
  })
})

describe('When the availability API fails', () => {

  describe('by returning code 200 and an empty array for some manufacturer(s)', () => {
    beforeEach(() => {
      axios.get
        .mockResolvedValueOnce({ status: 200, data: mockJackets })
        .mockResolvedValueOnce({ status: 200, data: mockManufacturers[0] })
        .mockResolvedValue({ status: 200, data: apiFailureResponse })
    })

    test('The product availability field is still created', async () => {
      const products = await apiService.getProductsByCategory('jackets')
      products.map(p => expect(p).toHaveProperty('availability'))
    })

    test('Missing availability information is set to null', async () => {
      const products = await apiService.getProductsByCategory('jackets')
      expect(products.some(p => p.availability === null)).toBe(true)
    })
  })

  describe('by returning something other than code 200 or 304', () => {

    beforeEach(() => {
      axios.get
        .mockResolvedValueOnce({ status: 200, data: mockJackets })
        .mockResolvedValue({ status: 500, statusText: 'Internal Server Error' })
    })

    test('The product availability field is still created', async () => {
      const products = await apiService.getProductsByCategory('jackets')
      products.map(p => expect(p).toHaveProperty('availability'))
    })

    test('Missing availability information is set to null', async () => {
      const products = await apiService.getProductsByCategory('jackets')
      expect(products.some(p => p.availability === null)).toBe(true)
    })
  })
})

test('When the product API returns something other than code 200 or 304 an error message is parsed', async () => {
  const mockError = { status: 418, statusText: 'I\'m a teapot' }
  axios.get.mockResolvedValue(mockError)

  const products = await getCategory('shirts')
  expect(products.error).toBeDefined()
  expect(products.error).toContain(mockError.status, mockError.statusText)
})

test('When the product API returns code 304 the product list matches the previously fetched one', async () => {
  axios.get
    .mockResolvedValueOnce({ status: 200, data: mockJackets })
    .mockResolvedValue({ status: 304 })

  const fetchedProducts = await getCategory('jackets')
  const cachedProducts = await getCategory('jackets')

  expect(cachedProducts).toEqual(fetchedProducts)
})

test('When the product database has been modified the product list does not match the previously fetched one', async () => {
  axios.get
    .mockResolvedValueOnce({ status: 200, data: mockJackets })
    .mockResolvedValue({
      status: 200, data: mockJackets.concat({ id: '3f', type: 'jacket', name: 'SAILOR', color: ['yellow', 'orange'], price: '39.90', manufacturer: 'kide' }
      )
    })

  const fetchedProducts = await getCategory('jackets')
  const newProducts = await getCategory('jackets')

  expect(newProducts).not.toEqual(fetchedProducts)
})

import '@testing-library/jest-dom/extend-expect'
import axios from 'axios'
import apiService from './apiService'

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
  test('Valid availabilities are returned', async () => {
    axios.get
      .mockResolvedValueOnce({ status: 200, data: mockJackets })
      .mockResolvedValueOnce({ status: 200, data: mockManufacturers[0] })
      .mockResolvedValueOnce({ status: 200, data: mockManufacturers[1] })
      .mockResolvedValue({ status: 200, data: mockManufacturers[2] })

    const products = await apiService.getProductsByCategory('jackets')
    expect(products.every(p => p.availability !== null)).toBe(true)
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

  describe('by returning something other than code 200', () => {

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

test('When the product API returns something other than code 200 an error message is parsed', async () => {
  const mockError = { status: 418, statusText: 'I\'m a teapot' }
  axios.get.mockResolvedValue(mockError)

  const products = await apiService.getProductsByCategory('shirts')
  expect(products.error).toBeDefined()
  expect(products.error).toContain(mockError.status, mockError.statusText)
})

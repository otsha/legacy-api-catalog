module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/jackets',
        permanent: true
      }
    ]
  }
}
# Legacy API Product Catalog

*A demo application for warehouse use that fetches and combines product information from two legacy APIs in a single user interface.*

## To Run the Application Locally

1. Make sure you have Node.js and a your preferred package manager (Yarn or npm) installed
2. Download the repository or clone it using Git:
```
$ git clone https://github.com/otsha/legacy-api-catalog.git <directory-name-here>
```
3. Install the required dependencies 
```bash
$ yarn install
```
4. To run the application in development mode, run the ```dev``` script:
```bash
$ yarn dev
```
5. Navigate to ```http://localhost:3000``` in your web browser


## Why Next.js?
First and foremost, Next.js is a React framework and I'm already familiar with React. Secondly, with the APIs already existing on the client's server, there was no need to build a more complex [Node.js](https://nodejs.org/en/) & [Express](https://github.com/expressjs/express) setup - a simple [JAMStack](https://jamstack.org/) application would do. It's also a little less opinionated and [a little more battle tested](https://nextjs.org/showcase) compared to something like [Gatsby](https://www.gatsbyjs.com/), which in turn would offer better SEO and a hefty number of plugins for all kinds of uses - if those were required features.

## Deficiencies
The primary issue with the application is definitely how the API cache is handled. This boils down to the client's servers' CORS options not allowing accessing the [```ETag```](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header. If this was possible, we could check if the API has updated since our last ```GET``` request by using the [```If-None-Match```](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) header. The server would then return status ```304: Unmodified``` if it wasn't.

However, because this functionality is not available for us, we rely on the browser to perform these checks and use cache automatically if necessary. 

We can examine how Firefox and Chrome handle the situation in their respective network tabs with cache enabled:
- Firefox shows that the server returns status 304, but we cannot access this status code with axios. Instead, we're forwarded status 200 and the locally cached data in the form of a regular response.
- Chrome's doesn't even go as far as showing status 304, instead displaying status 200. However, by inspecting the actual amount of data transferred, we can deduce that the data was fetched from local cache instead of the API.

For any edge cases where status 304 is accessible to us, I have simply added two JavaScript Map variables to store the product & availibility data in temporarily (see [apiService.js](./services/apiService.js)).
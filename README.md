# Legacy API Product Catalog

*A demo application for warehouse use that fetches and combines product information from two legacy APIs in a single user interface.*

---

- [**The Application on Heroku**](https://otsha-legacy-api-catalog.herokuapp.com) (The initial load may take a little longer)
- [Running the Application Locally](#to-run-the-application-locally)
    - [Using Docker Compose](#using-docker-compose)
    - [Using Node.js](#using-nodejs)
- [Why Next.js?](#why-nextjs)
- [Why Docker?](#why-docker)
- [Issues](#issues)

---

## To Run the Application Locally

You can run the application locally with either Node.js (make sure you have either Yarn or npm installed) or Docker Compose.

1. Download the repository or clone it using Git:
```bash
$ git clone https://github.com/otsha/legacy-api-catalog.git <directory-name-here>
```

### Using Docker Compose

- To build and run the image in production mode, run
```
$ docker-compose up
```
- Navigate to ```http://localhost:3000``` in your web browser

### Using Node.js

- Install the required dependencies 
```bash
$ yarn install
```
- To run the application in development mode, use the ```dev``` script:
```bash
$ yarn dev
```
- If you'd like to build and run the application in production mode, build the application with the ```build``` script, then run the ```start``` script with the port you'd like the application to run in
```bash
$ yarn build
...
$ yarn start <port>
```
- Navigate to ```http://localhost:<port>``` in your web browser. If you executed the application in development mode, the port will be 3000 by default.

---

## Why Next.js?
First and foremost, Next.js is a React framework and I'm already familiar with React. Secondly, with the APIs already existing on the client's server, there was no need to build a more complex [Node.js](https://nodejs.org/en/) & [Express](https://github.com/expressjs/express) setup - a simple [JAMStack](https://jamstack.org/) application would do. It's also a little less opinionated and [a little more battle tested](https://nextjs.org/showcase) compared to something like [Gatsby](https://www.gatsbyjs.com/), which in turn would offer better SEO and a hefty number of plugins for all kinds of uses - if those were required features.

---

## Why Docker?
For a demonstration application of this scope, using Docker might seem like overkill or an unnecessary hurdle. The answer is simply that I wanted to showcase my ability to use it. And Docker ***is*** lovely, isn't it?

---

## Issues
The most glaring issue with the application in its current form is how long it takes for the product list to be displayed after selecting a category. Currently, data from all manufacturers in a given product category is requested and parsed in one go. A more refined approach would have been to sort the products by manufacturer and requesting the availability data for each manufacturer individually as the user scrolls down the list.

The primary issue while developing the application was approaching the API cache. This boiled down to the client's servers' CORS options not allowing accessing the [```ETag```](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) header. If this was possible, we could check if the API has updated since our last ```GET``` request by using the [```If-None-Match```](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-None-Match) header. The server would then return status ```304: Unmodified``` if it wasn't.

However, because this functionality is not available for us, we rely on the browser to perform these requests and use cache automatically if necessary.

We can examine how Firefox and Chrome handle the situation in their respective network tabs with cache enabled:
- Firefox shows that the server returns status 304, but we cannot access this status code with axios. Instead, we're forwarded status 200 and the locally cached data in the form of a regular response.
- Chrome doesn't even go as far as showing status 304, instead displaying status 200. However, by inspecting the actual amount of data transferred, we can deduce that the data was fetched from local cache instead of the API.

For any edge cases where status 304 is accessible to us, I have simply added two JavaScript Map variables to store the product & availibility data in temporarily (see [apiService.js](./services/apiService.js)).

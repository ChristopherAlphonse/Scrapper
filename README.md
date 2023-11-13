# Scraper Project Documentation

### This documentation provides an overview and explanation of a scraper project that utilizes various libraries and technologies to extract data from web pages. The project is built using JavaScript and the following libraries and modules:

    - Express: A fast and minimalist web application framework for Node.js that provides a set of features for web and mobile applications.

    - Cheerio: A server-side implementation of jQuery that allows parsing and manipulating HTML documents using a familiar syntax.

    - Cluster: A module in Node.js that enables the creation of multiple worker processes to handle incoming requests, improving the performance and scalability of the application.

    - CORS: A middleware for Express that enables Cross-Origin Resource Sharing, allowing requests from different domains or origins.

    - node-fetch: A module that provides a simple and efficient way to make HTTP requests in Node.js.

    - os: A module in Node.js that provides information and utilities related to the operating system.

### The scraper project aims to extract specific information from web pages by making HTTP requests, parsing the HTML response, and extracting relevant data using Cheerio. The extracted data is then returned in a structured format.



## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

Open your terminal and sure node and nodemon is installed and up to date

- Make a folder
  ```sh
  mkdir Fetch
  cd Fetch
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ChristopherAlphonse/Scrapper.git
   code .
   ```
2. Install packages
   ```sh
   yarn or pnpm i
   ```
3. ```sh
4.  pnpm dev
5.  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

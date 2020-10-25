"use strict";

// import the needed node_modules.
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { stock, customers } = require("./data/inventory");

express()
  // Below are methods that are included in express(). We chain them for convenience.
  // --------------------------------------------------------------------------------

  // This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
  .use(morgan("tiny"))
  .use(bodyParser.json())

  // Any requests for static files will go into the public folder
  .use(express.static("public"))

  // Nothing to modify above this line
  // ---------------------------------
  // add new endpoints here 👇

  .post(`/order`, (req, res) => {
    // deconstruct req.body (the user input that we get from the front end)
    const {
      order,
      size,
      givenName,
      surname,
      email,
      address,
      city,
      province,
      postcode,
      country,
    } = req.body;

    // create a variable that evalues to true if the customer's name, email or address has already been used
    const hasPlacedOrder = customers.find(
      (customer) =>
        (customer.givenName.toLowerCase() === givenName.toLowerCase() &&
          customer.surname.toLowerCase() === surname.toLowerCase()) ||
        customer.email.toLowerCase() === email.toLowerCase() ||
        customer.address.toLowerCase() === address.toLowerCase()
    );
    // create a variable that evaluates to true if the email is valid (contains "@")
    const isValidEmail = email.includes("@");
    // create a variable that evaluates to true if the address is valid (country is "canada")
    const isValidAddress = country.toLowerCase() === "canada";
    // create a variable that evaluates to true if the item is in stock (value is greater than 0)
    const isInStock = stock[order] > 0;

    if (hasPlacedOrder) {
      res.status(200).json({
        status: "error",
        error: "repeat-customer",
      });
    } else if (!isValidEmail) {
      res.status(200).json({
        status: "error",
        error: "missing-data",
      });
    } else if (!isValidAddress) {
      res.status(200).json({
        status: "error",
        error: "undeliverable",
      });
    } else if (order === "tshirt" && stock.shirt[size] === "0") {
      res.status(200).json({
        status: "error",
        error: "unavailable",
      });
    } else if (!isInStock) {
      res.status(200).json({
        status: "error",
        error: "unavailable",
      });
    } else {
      res.status(200).json({
        status: "success",
        // if the order is a success we pass the customer information that we'll need to render the success page to the front end
        data: { givenName, order, province },
      });
    }
  })

  // add new endpoints here ☝️
  // ---------------------------------
  // Nothing to modify below this line

  // this is our catch all endpoint.
  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  // Node spins up our server and sets it to listen on port 8000.
  .listen(8000, () => console.log(`Listening on port 8000`));

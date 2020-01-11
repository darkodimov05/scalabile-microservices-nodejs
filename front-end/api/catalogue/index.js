(function () {
  'use strict';

  var express = require("express"),
    request = require("request"),
    endpoints = require("../endpoints"),
    helpers = require("../../helpers"),
    app = express()

  app.get("/catalogue/images*", function (req, res, next) {
    var url = endpoints.catalogueUrl + req.url.toString();
    console.log("images url " + url);
    request.get(url)
      .on('error', function (e) {
        next(e);
      })
      .pipe(res);
  });

  app.get("/getProducts", function (req, res, next) {
    var x = endpoints.catalogueUrl + "/getProducts"; //+ req.url.toString();
    console.log("getProducts " + x);
    helpers.simpleHttpRequest(x, res, next);
  });

  app.get("/tags", function (req, res, next) {
    helpers.simpleHttpRequest(endpoints.tagsUrl, res, next);
  });

  app.post("/newProduct", function (req, res, next) {
    var postProd = {
      uri: endpoints.newProductUrl,
      method: 'POST',
      json: true,
      body: req.body
    };


    request(postProd, function (error, response, body) {
      if (error !== null) {
        console.log("ERROR:" + JSON.stringify(error));
        return;
      }
      console.log(response.statusCode);
    });

  });

  module.exports = app;
}());
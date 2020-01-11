var http = require('http'),
    fs = require('fs'),
    url = require('url');
var p = require('path');
var qs = require('querystring');
var mysql = require('mysql');
var root = __dirname;
var headers = [
    "Product Name", "Price", "Picture", "Buy Button"
];


var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', //SQL password for user account
    database: 'shop'
});
var cart = [];
var theuser = null;
var theuserid = null;

var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    var url1 = url.parse(request.url);
    if (request.method == 'POST') {
        switch (path) {
            case "/newProduct": //PART 3 B. 
                console.log("newProduct");
                var body = ''; //Will hold the request
                console.log("add ");
                request.on('data', function (data) {
                    body += data;
                });
                request.on('end', function () {
                    var product = JSON.parse(body);
                    console.log('new Product');
                    console.log(JSON.stringify(product, null, 2));
                    var query = "SELECT * FROM products where name='" + product.name + "'"; //Check if product exists 
                    response.writeHead(200, { //CORS
                        'Access-Control-Allow-Origin': '*'
                    });

                    db.query(query, [],
                        function (err, rows) {
                            if (err) {
                                response.end("error has occured! Exiting");
                                throw err;
                            }

                            //Checks Product already present in the db using query
                            if (rows != null && rows.length > 0) { 
                                console.log("product is already present in db!");
                                response.end("product is already present in db!");
                           
                            } else { //IF SUCCESSFUL
                                query = "INSERT INTO products (name, quantity, price, image)" +
                                    "VALUES(?, ?, ?, ?)";
                                db.query(
                                    query,
                                    [product.name, product.quantity, product.price, product.image],
                                    function (err, result) {
                                        if (err) {
                                            // 2 response is an sql error
                                            response.end('{"error": "4"}');
                                            throw err;
                                        }
                                        theuserid = result.insertId;
                                        var obj = {
                                            id: theuserid
                                        }
                                        response.end(JSON.stringify(obj));

                                    }
                                );
                            }
                        }
                    );
                });
            break;
        }
    } else {
        switch (path) {
            case "/getProducts":
                console.log("getProducts");
                response.writeHead(200, { //CORS
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                var query = "SELECT * FROM products ";
                db.query(
                    query,
                    [],
                    function(err, rows) {
                        if (err) throw err;
                        console.log(JSON.stringify(rows, null, 2));
                        response.end(JSON.stringify(rows));
                        console.log("Products sent");
                    }
                );
            break;

            case "/getProduct"    :
                console.log("getProduct");
                var body="";
                request.on('data', function (data) {
                    body += data;
                });

                request.on('end', function () {
                    var product = JSON.parse(body);
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    console.log(JSON.stringify(product, null, 2));
                    var query = "SELECT * FROM products where productID="+
                        product.id;


                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err) throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            response.end(JSON.stringify(rows[0]));
                            console.log("Products sent");
                        }
                    );
                });
            break;
        }
    }
});
server.listen(3002);
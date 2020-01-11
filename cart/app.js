var express = require("express"),
    morgan = require("morgan"),
    path = require("path"),
    bodyParser = require("body-parser"),
    app = express();


app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

//app.use(morgan("dev", {}));
var cart = [];

app.post("/add", function (req, res, next) {
    var obj = req.body;
    console.log("add ");
    console.log("Attempting to add to cart: " + JSON.stringify(req.body));
    var max = 0;
    var ind = 0;

    console.log(cart);
    if (cart["" + obj.custId] === undefined)
        cart["" + obj.custId] = [];
        
    var c = cart["" + obj.custId];
    for (ind = 0; ind < c.length; ind++)
        if (max < c[ind].cartid)
            max = c[ind].cartid;

    var cartid = max + 1;
    var data = {
        "cartid": cartid,
        "productID": obj.productID,
        "name": obj.name,
        "price": obj.price,
        "image": obj.image,
        "quantity": obj.quantity
    };

    //PART 4 A: Combine items in card.
    console.log(JSON.stringify(data));
    var duplicateItem = false; //Boolean to decide if the item should be added or updated.
   
    c.forEach(item => {
        if(item.productID == obj.productID){// If there is a duplicate just edit info
            duplicateItem = true;
            console.log("Duplicate Item detected!"); 
            item.quantity = parseInt(item.quantity) + parseInt(obj.quantity)              
        }
    });
    //If item has no duplicate put it in as a new item
    if(duplicateItem == false){
        c.push(data);
    }
    console.log(JSON.stringify(c));
    res.status(201);
    res.send("");
});

//PART 4: Fix Delete.
app.delete("/cart/:custId/items/:id", function (req, res, next) {
    //var tempCart = cart;
    var custId = req.params.custId; //Grabs the Cust ID from the URL 
    if (cart["" + custId] === undefined)
        cart["" + custId] = [];

    var c = cart["" + custId];
    
    c.forEach((item, index) => { 
        console.log("item is " + JSON.stringify(item))
        if(item.productID == req.params.id){ 
            if(parseInt(item.quantity) > 1){ //Removes one from the quantity
                item.quantity = parseInt(item.quantity) - 1;
            }else if(item.quantity == 1){ //Removes item if it's the only one
                c.splice(index,1);
            }
        }
    });
    console.log(JSON.stringify(c));
    res.status(201);
    res.send(' ');
});


app.get("/cart/:custId/items", function (req, res, next) {
    var custId = req.params.custId;
    console.log("getCart" + custId);
    console.log('custID ' + custId);
    console.log(JSON.stringify(cart["" + custId], null, 2));
    res.send(JSON.stringify(cart["" + custId]));
    console.log("cart sent");
});


var server = app.listen(process.env.PORT || 3003, function () {
    var port = server.address().port;
    console.log("App now running in %s mode on port %d", app.get("env"), port);
});
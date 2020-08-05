'use strict';

const express = require('express');
const socketIO = require('socket.io');
const request = require('request');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});



setInterval(() => io.emit('time', JSON.stringify(auth), 1000));



var auth;
var auth1;
var newBody;
function createBody(orderNum, products) {
    body = {
        "order_id": "0000",
        "products": [{
            "quantity": "1",
            "productUuid": "f7e60750-3c4c-11ea-8904-8bc74c688db4",
            "variantUuid": "f7e62e60-3c4c-11ea-8904-8bc74c688db4",
            "vatPercentage": 0,
            "unitPrice": 0,
            "rowTaxableAmount": 0,
            "name": "Take Away",
            "description": "",
            "variantName": "",
            "autoGenerated": false,
            "id": "0",
            "type": "PRODUCT",
            "libraryProduct": true
        }, {
            "quantity": "3",
            "productUuid": "5b3518e0-3c53-11ea-aeb9-9304bbabbcff",
            "variantUuid": "29559f40-3f67-11ea-b68e-d872fe59a498",
            "vatPercentage": 0,
            "unitPrice": 180,
            "rowTaxableAmount": 540,
            "name": "Latte",
            "description": "",
            "variantName": "",
            "autoGenerated": false,
            "id": "1",
            "type": "PRODUCT",
            "libraryProduct": true
        }, {
            "quantity": "1",
            "productUuid": "9d9e2280-3c53-11ea-92b0-36c9f69b5c55",
            "variantUuid": "9d9ee5d0-3c53-11ea-9c5a-55e770000ad6",
            "vatPercentage": 0,
            "unitPrice": 180,
            "rowTaxableAmount": 180,
            "name": "Cappuccino",
            "description": "",
            "variantName": "",
            "autoGenerated": false,
            "id": "2",
            "type": "PRODUCT",
            "libraryProduct": true
        }]
    }

    body.order_id = orderNum;
    body.products = products;

    body.isnew = true;
    body.istable = doesOrderContainTable(products);
    body.isclosed = false;


    //console.log("createBody: " + JSON.stringify(body));
    return JSON.stringify(body);
}


function doesOrderContainTable(orderData) {
	if (orderData != null) {
    var itemsInOrder = orderData.length;
}
    var count = -1;
    var tableCheck = null;
    var tableOrder;
    for (var y = 0; y < itemsInOrder; y++) {
        var orderName = orderData[y].name.substring(0,5)
        if(orderName == "Table") {
            tableOrder = true;
            tableCheck = orderData[y].name;
            table = orderData[y].name;
            count = count + 1
        }
    }
    if(tableCheck == null) {tableOrder = false}
return tableOrder;
}



function postDB(orderNum, products) {
    reqBody = createBody(orderNum, products);
    //reqBody = reqBody.slice(9)
    //console.log("reqBody: " + reqBody)
    var postSettings = {
        'method': 'POST',
        'url': 'https://mydbrestservice.herokuapp.com/orders',
        'headers': {
            'Prefer': 'resolution=merge-duplicates',
            'Content-Type': 'application/json'
        },
        body: reqBody
    };
    //console.log("Settings: " + JSON.stringify(postSettings));
    request(postSettings, function(error, response) {
        if (error) throw new Error(error);
        //console.log("DBPOST: " + response.body);
    });
}

var request = require('request');
var options = {
    'method': 'POST',
    'url': 'https://mycorsprox.herokuapp.com/https://oauth.izettle.com/token',
    'headers': {
        'X-Requested-With': '*',
        'Origin': 'null',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'client_id': 'a0a378da-a98c-11ea-91ee-01dae521f2fa',
        'assertion': 'eyJraWQiOiIwIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJpWmV0dGxlIiwiYXVkIjoiQVBJIiwiZXhwIjoyNTM4MzMwOTgwLCJzdWIiOiI0MjQzNjNkZS0zNmMwLTExZWEtYjNkYi1iMzAwN2NjNDc0ZTMiLCJpYXQiOjE1OTE2MjMyMDQsInJlbmV3ZWQiOmZhbHNlLCJzY29wZSI6WyJXUklURTpQQVlNRU5UIiwiUkVBRDpQUk9EVUNUIiwiUkVBRDpQVVJDSEFTRSIsIlJFQUQ6Q1VTVE9NRVIiLCJSRUFEOlBBWU1FTlQiLCJXUklURTpGSU5BTkNFIiwiV1JJVEU6UkVGVU5EMiIsIlJFQUQ6VVNFUklORk8iLCJXUklURTpQVVJDSEFTRSIsIldSSVRFOkNVU1RPTUVSIiwiV1JJVEU6T05MSU5FUEFZTUVOVCIsIlJFQUQ6RklOQU5DRSIsIldSSVRFOlBST0RVQ1QiLCJXUklURTpVU0VSSU5GTyIsIldSSVRFOlJFRlVORCIsIlJFQUQ6T05MSU5FUEFZTUVOVCJdLCJ1c2VyIjp7InVzZXJUeXBlIjoiVVNFUiIsInV1aWQiOiI0MjQzNjNkZS0zNmMwLTExZWEtYjNkYi1iMzAwN2NjNDc0ZTMiLCJvcmdVdWlkIjoiNDI0MWIzZjQtMzZjMC0xMWVhLTg5ZjEtMDRmZGFiN2FkMjhmIiwidXNlclJvbGUiOiJPV05FUiJ9LCJ0eXBlIjoidXNlci1hc3NlcnRpb24iLCJjbGllbnRfaWQiOiJhMGEzNzhkYS1hOThjLTExZWEtOTFlZS0wMWRhZTUyMWYyZmEifQ.rC8gc5LHSA4u1l2n2K0pOzMtdLRtzJQQCriAexOtlpKJyQxcj0uTKqYySscMXGg3mqbnHSrARCdbFsZXdj6JQ7CO4-BpP_WO_n0Mrd4RvrrJ6ooGS-uO6TMsTkEJrY_JpJVyMAm_G2rB6_vZsqjgg4btBlCT4n4hvznpgRrX2_eOElXGWmkV0BaaTkxBsQedttU_ZP14NCVQ85W6tMvtndD5J5k5nme45a5oo8Mj_FoCOciQG4g4JUhL4kcKcT0dO7jJYKsrQVa9uk5D24ieVQF8vsjmjTkIt8vacJzPtntW9y3wyQV4IojH29yxKUzJsJDRCbBLTBn7JGJCI2CCqg',
        '': ''
    }
};

setInterval(function() {
    request(options, function(error, response) {
        if (error) throw new Error(error);

        auth = JSON.parse(response.body);
        auth = JSON.stringify(auth.access_token);
        auth = auth.substring(1, auth.length - 1);
        auth = 'Bearer ' + auth

        var options1 = {
            'url': "https://purchase.izettle.com/purchases/v2?limit=1&descending=true",
            'method': "GET",
            'timeout': 0,
            'headers': {
                "content-type": "application/json",
                'Authorization': auth
            }
        }

        request(options1, function(error, response) {
            if (error) throw new Error(error);
            auth1 = response.body;
            auth1 = JSON.parse(auth1);
            newBody = createBody(auth1.purchases[0].globalPurchaseNumber, auth1.purchases[0].products);
            //console.log(newBody.slice(9))
            postDB(auth1.purchases[0].globalPurchaseNumber, auth1.purchases[0].products);
        });
    });
}, 1000)
max = 0

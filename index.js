const express = require ("express")
const mongoose = require("mongoose")
const {MongoClient} = require ('mongodb')
const axios = require('axios')
const cheerio = require('cheerio')

require("dotenv").config()

const app = express();
const port = process.env.PORT||5001

app.use(express.json())

//*******************************************************************//



//*******************************************************************//

const connection = mongoose.connection;
const mainClient = new MongoClient(process.env.URL);

    app.listen(port,()=>{    

        console.log(`server connected on port ${process.env.PORT}`);

    }).on( 'error', function (e) { 

        if (e.code == 'EADDRINUSE') { 
          console.log('Address in use');
        }
    });

    mongoose.connect(process.env.URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    }).then(() => console.log("database connected"))
    .catch((err) => console.log("error de connectyion database "));

//routers:
const routerCollection = require("./Router/showCollections.router.js")
const { response } = require("express")

app.use("/", routerCollection)







// app.use('/collections', showCollections)
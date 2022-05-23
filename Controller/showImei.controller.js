const res = require('express/lib/response');
const {MongoClient} = require ('mongodb')
const imeiController = {};
const mongoose = require("mongoose")

const client = new MongoClient(process.env.URL);
const database = client.db("active_tracking");


//==============================ImeiEndPoint=======================================//

imeiController.findTheImei = async(req,res)=>{
    
    const q = req.query;


    let valFiltr = "";
        if(q.query){
            valFiltr = q.query
        }
    
    const keys = ['_id', 'count'];

    const search = (data) => {
        return data.filter((item)=> 
            keys.some((key)=>item[key].toLowerCase().includes(valFiltr))
        )
    }

    try {

        await client.connect();
   
        allImei = await getTheImei(database);        
   
        valFiltr!=""? res.json(search(allImei)):res.json(allImei);
   
    } catch (error) {
   
        
        res.status(500).send(error)
   
    }
}

//===============================IMEIstart======================================//
function getTheImei (database){
    var theFinalTab
    return new Promise (async resolve=> {

        var objectTab =[];
        
        callCollImei = await findCollectionInfo2(database); 


        theFinalTab = await new Promise (async resolve => {

            for (coli of callCollImei){

                const actualCollection = client.db("active_tracking").collection(coli.name);
                imeiListCursor = actualCollection.aggregate([{$group:{_id:"$imei",count:{$sum:1}}}]);

                // var imeiTab = [];

                for await (const doc of imeiListCursor){
                    console.log(doc);

                    objectTab.push(doc)
                }

                // var obj = { 
                //     // name : coli.name, 
                //     imeiList : imeiTab
                // }
                

                // objectTab.push(imeiTab)
            } ;
        resolve(objectTab)
        });
        resolve (theFinalTab)
    })}






//==============================find collections info=======================================//

function findCollectionInfo2(database){
    return new Promise(async resolve => {
        await database.listCollections().toArray(async function(err,collInfos){ 
            resolve(collInfos)
        })   
    })
}





module.exports = imeiController;
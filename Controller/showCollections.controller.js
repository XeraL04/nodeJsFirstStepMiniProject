const res = require('express/lib/response');
const {MongoClient} = require ('mongodb')
const collectionController = {};
const mongoose = require("mongoose")

const client = new MongoClient(process.env.URL);
const database = client.db("active_tracking");





//=====================================================================//

function findCollectionInfo(database){
    return new Promise(async resolve => {
        await database.listCollections().toArray(async function(err,collInfos){ 
                resolve(collInfos)
        })   
    })
}

//=====================================================================//

function needdedCollections (database){ 
    var newTab
    
    return new Promise(async resolve => {
        
        console.log("from sofian")
        
        var objTab = [] ; 
        
        collInfos = await findCollectionInfo(database) ;
        console.log(collInfos.length); 
        // after we get access to the database and get our collections listed now
        // we start a new promise and loop inside those collections to get what we want. 
        newTab = await new Promise(async resolve => {
            
            console.log("2 loop collInfos ") ;
            for ( col of collInfos) { 
                
                  
                    console.log("3 Starting promise collInfos ") ; 
                    size = await getCollectionCounts(col.name) ;                            
                    console.log(size);
                    var obj = {      
                        name :  col.name          ,
                        count : "" + size
                    }   
                    console.log("4 End promise collInfos ") ;                                                    
                                            
                objTab.push(obj) 
                
                console.log("5- en loop ") ;  
                console.log(objTab)                
                
            } ;
            console.log("6- out of the loop ") ;  
            
            resolve(objTab);
            
        }) ;
        console.log("6 End promise listcollection ") ;
        
        console.log(newTab);
        
        resolve(newTab);
    })}

//==========================getCollectionEndPoint===========================================//

collectionController.getcollections = async (req,res)=>{
    
    try{

        await client.connect();        
        collex = await needdedCollections(database);
        console.log("7 ........ ") ;
        res.send(collex);

    }catch(error){
        res.status(500).send(error)
    }
}

//==============================getCollectionCounts=======================================//

 function getCollectionCounts(collection) {
    let estimate = 0 ;    
    return  new Promise(async resolve => {
        try {        
            
            const myDocs = database.collection(collection);            
            console.log(`3.1-The number of documents in your collection  ${collection}`);
            
            estimate = await  myDocs.estimatedDocumentCount();
            console.log(`3.2-The number of documents in your collection  ${collection} is: ${estimate}`);
            
        } catch(error){
            console.log(`3.3-The number of documents in your collection  ${collection} is: ${estimate}`);
            console.log(error);
            
        }
        console.log(`3.4-The number of documents in your collection  ${collection} is: ${estimate}`);
        resolve(estimate);
    });
}

//===============================IMEIstart======================================//



function getTheImei (database){
    var theFinalTab
    return new Promise (async resolve=> {

        var objectTab =[];

        callCollImei = await findCollectionInfo2(database);

        console.log(`the access to the db is OK and you have ${callCollImei.length} collections`);

        theFinalTab = await new Promise (async resolve => {

            for (coli of callCollImei){
                console.log(`aggregate of collections`);
                console.log(coli.name);
                console.log(`inside the db and startinga new loop`);

                const actualCollection = client.db("active_tracking").collection(coli.name);
                imeiListCursor = actualCollection.aggregate([{$group:{_id:"$imei",count:{$sum:1}}}]);
                console.log(imeiListCursor);

                var imeiTab = [];

                for await (const doc of imeiListCursor){
                    console.log(doc);

                    imeiTab.push(doc)
                }

                var obj = { 
                    name : coli.name, 
                    imeiList : imeiTab
                }

                objectTab.push(obj)
            } 
        console.log(objectTab);
        resolve(objectTab)
        })
        resolve (theFinalTab)
    })}

   

//===============================================================================//

// async function findImei (collection){
//     const result = await getTheImei(collection);
//     console.log(result);
//     // console.log(`2.find Imei`);
//     return result
// }


// const collection = client.db("active_tracking").collection("data_3546365045555737401")

//==============================ImeiEndPoint=======================================//

collectionController.findTheImei = async(req,res)=>{
    try {
        await client.connect();
   
        // console.log(`1.access to the db`);
   
        allImei = await getTheImei(database);
        
   
        // console.log(`3.the end`);
   
        res.send(allImei)
   
    } catch (error) {
   
        console.log(error);
   
        res.status(500).send(error)
   
    }
}
 
//==================================listVehicleStart===================================//

function getTheVehicleList (database){
    
    var nowTab 
    return new Promise (async resolve=> {

        var objctTab = [];

        callInfosV = await findCollectionInfo2(database)

    

        console.log(`the access to the db is OK and you have ${callInfosV.length} collections`);
        
        nowTab = await new Promise(async resolve =>{

            for (coil of callInfosV){
               // console.log(`qgrregqte of collection `);
               // console.log(coil.name); 
               // console.log(`inside the bd and starting a new loop`);
               const currentCollection = client.db("active_tracking").collection(coil.name)
               vehicleListCursor = currentCollection.aggregate([{$group:{_id:"$deviceLabel",count:{$sum:1}}}])
                // console.log(vehicleListCursor);
                var vehicleTab = [];


                for await (const doc of vehicleListCursor) {
                    
                //console.log(doc);
                    vehicleTab.push(doc)
                }

                var obj = {
                    name : coil.name,
                    vehicleList : vehicleTab
                }
               // console.log(`========== wowowo we are here ==========`);
                objctTab.push(obj)

            }
            console.log(objctTab);
            resolve(objctTab)
        });
        
        resolve (nowTab)
    })}

//========================================================================================//

//  function getTheViListDis (database) {
//     return new Promise((async resolve=>{
//         await database.collection.distinct("deviceLabel").then ((vList)=>{console.log(vList)
//         }).catch((err)=>{
//             console.log(err.message);
//         })
//         resolve(vList)
//     })
// )}

//========================================================================================//

function findCollectionInfo2(database){
    return new Promise(async resolve => {
        await database.listCollections().toArray(async function(err,collInfos){ 
            resolve(collInfos)
        })   
    })
}

//=================================vehicleListEndPoint====================================//

collectionController.findTheVehicleList = async(req,res)=>{
    try {
    
        await client.connect();
    
        // console.log(`1.access to the db`);

        allvehicles = await getTheVehicleList(database);
        
        // console.log(`5.the end`);
        
        res.send(allvehicles)
    
    } catch (error) {
    
        console.log(error);
    
        res.status(500).send(error)
    
    }
}
//=========================================================================================//

module.exports = collectionController;
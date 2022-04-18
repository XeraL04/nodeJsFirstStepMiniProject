const res = require('express/lib/response');
const {MongoClient} = require ('mongodb')
const collectionController = {};
const mongoose = require("mongoose")

const client = new MongoClient(process.env.URL);
const database = client.db("active_tracking");


//=====================================================================//
function needdedCollections (database){ 
    var newTab

    return new Promise(async resolve => {
       
        console.log("from sofian")
        await database.listCollections().toArray(async function(err,collInfos){    
            var objTab = [] ; 
            console.log("1 Starting promise listCollections ") ;
            newTab = await new Promise(async resolve => {
                // console.log(collInfos)
                
                console.log("2 loop collInfos ") ;
                 for ( col of collInfos) { 
                                       
                    if(col.name != "postdocs"){   
                        console.log("3 Starting promise collInfos ") ; 
                        size = await getCollectionCounts(col.name) ;                            console.log(size);
                        var obj = {      
                            name :  col.name          ,
                            count : "" + size
                        }   
                        console.log("4 End promise collInfos ") ;                                                    
                    }                              
                    objTab.push(obj) 
                   
                console.log("5- en loop ") ;  
                console.log(objTab)                
               
                } ;
                console.log("6- out of the loop ") ;  
            
                resolve(objTab);
            
            }) ;
            console.log("6 End promise listcollection ") ;
        
             console.log(newTab);
            

        })     
        // return newTab ;



        resolve(newTab);
    })       
        
}

// function needdedCollections (database){ 
//     var newTab

//     return new Promise(async resolve => {
       
//         console.log("from sofian") ;
        
//         database.listCollections().toArray(async function(err,collInfos){  })        
//             var objTab = [] ; 
//             console.log("1 Starting promise listCollections ") ;
//             newTab = await new Promise(async resolve => {
//                 // console.log(collInfos)
                
//                 console.log("2 loop collInfos ") ;
//                  for ( col of collInfos) { 
                                       
//                     if(col.name != "postdocs"){   
//                         console.log("3 Starting promise collInfos ") ; 
//                         size = await getCollectionCounts(col.name) ;                            
//                         console.log(size);
//                         var obj = {      
//                             name :  col.name          ,
//                             count : "" + size
//                         }   
//                         console.log("4 End promise collInfos ") ;                                                    
//                     }                              
//                     objTab.push(obj) 
                   
//                 console.log("5- en loop ") ;  
//                 console.log(objTab)                
               
//                 } ;
//                 console.log("6- out of the loop ") ;  
            
//                 resolve(objTab);
            
//             }) ;
//             console.log("6 End promise listcollection ") ;
        
//              console.log(newTab);
            

       
//         // return newTab ;



//         resolve(newTab);
//     })       
        
// }

// function findCollections (database){    
//     return new Promise(resolve=>{
//         const result = needdedCollections(database);
//         console.log("7 ") ;
//         console.log(result);
//         resolve (result)
//     })
   
// }


async function findCollections (database){

    const result = await needdedCollections(database);
    console.log("7") ;
    // console.log(result);
    console.log(result);
    // return result
}





collectionController.getcollections = async (req,res)=>{

    try{
        await client.connect();

        cls = await needdedCollections(database);
        console.log("7 ........ ") ;
            // resolve(cls);
               
        console.log(collex);

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

//===============================getCollectionCountsEndPoint======================================//

collectionController.numberOfDocuments = async (req,res)=>{
    try {
        await client.connect();
        collex = await findCollections(database);
        
        tab = [];

        collex.forEach(async (col) => {
            t =  await getCollectionCounts(col.name);
            tab.push(t);
        });

        res.send(tab)
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}









//===============================IMEIstart======================================//

function getTheImei (collection){
    return new Promise (async resolve=> {
        const result = collection.aggregate([{$group:{_id:"$imei",count:{$sum:1}}}])
        let setObject =[] ; 

        try {
            for await (const doc of result){
                console.log(`what happening here`);
                if (doc._id !=null){
                    objct = {
                        imei : doc._id,
                        count : doc.count
                    }
                    setObject.push(objct)
            }}
            console.log(`it's done`);

                resolve (setObject)
        } catch (error) {
            resolve(error)
        }
    })}
//=====================================================================//

async function findImei (collection){
    const result = await getTheImei(collection);
    console.log(result);
    console.log(`2.find Imei`);
    return result
}


const collection = client.db("active_tracking").collection("data_3546365045555737401")
//==============================ImeiEndPoint=======================================//

collectionController.findTheImei = async(req,res)=>{
    try {
        await client.connect();
        console.log(`1.access to the db`);
        allImei = await findImei(collection);
        
        // tabl = []
        // console.log(`3.using the eachfor`);

        // allImei.forEach(async (collection) => {
        //     k = await getTheImei(collection);
        //     tabl.push(k)
        // })
        // console.log(tabl);
        console.log(`3.the end`);
        res.send(allImei)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

// the question is : how to made the function avalibal to all the collections.








//==================================listVehicle===================================//

function getTheVehicleList (collection){
    return new Promise (async resolve=> {
        const result = collection.aggregate([{$group:{_id:"$deviceLabel",count:{$sum:1}}}])
        let setObject =[] ; 

        try {
            for await (const doc of result){
                console.log(`what happening here`);
                if (doc._id !=null){
                    objct = {
                        deviceLabel : doc._id,
                        count : doc.count
                    }
                    setObject.push(objct)
            }}
            console.log(`it's done`);

                resolve (setObject)
        } catch (error) {
            resolve(error)
        }
    })}

//=====================================================================//

async function findVehicleList (collection){
    const result = await getTheVehicleList(collection);
    console.log(result);
    console.log(`2.find vehicle list`);
    return result
}

//=================================vehicleListEndPoint====================================//

collectionController.findTheVehicleList = async(req,res)=>{
    try {
    
        await client.connect();
    
        console.log(`1.access to the db`);
    
        allImei = await findVehicleList(collection);
        
        console.log(`3.the end`);
        
        res.send(allImei)
    
    } catch (error) {
    
        console.log(error);
    
        res.status(500).send(error)
    
    }
}
//=====================================================================//

module.exports = collectionController;
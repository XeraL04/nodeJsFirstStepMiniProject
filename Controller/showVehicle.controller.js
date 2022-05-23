const res = require('express/lib/response');
const {MongoClient} = require ('mongodb')
const vehicleController = {};
const mongoose = require("mongoose")

const client = new MongoClient(process.env.URL);
const database = client.db("active_tracking");



//==================================list Vehicle Start===================================//

function getTheVehicleList (database){
    
    var nowTab 
    return new Promise (async resolve=> {

        var objctTab = [];

        callInfosV = await findCollectionInfo2(database)

    

        console.log(`the access to the db is OK and you have ${callInfosV.length} collections`);
        
        nowTab = await new Promise(async resolve =>{

            for (coil of callInfosV){
               
               const currentCollection = client.db("active_tracking").collection(coil.name)
               vehicleListCursor = currentCollection.aggregate([{$group:{_id:"$deviceLabel",count:{$sum:1}}}])

            //    var vehicleTab = [];


                for await (const doc of vehicleListCursor) {
                    
                //console.log(doc);
                    // vehicleTab.push(doc)
                    objctTab.push(doc)
                }

                // var obj = {
                //     name : coil.name,
                //     vehicleList : vehicleTab
                // }
                // objctTab.push(obj)

            }
            console.log(objctTab);
            resolve(objctTab)
        });
        
        resolve (nowTab)
    })}



//========================================================================================//

function findCollectionInfo2(database){
    return new Promise(async resolve => {
        await database.listCollections().toArray(async function(err,collInfos){ 
            resolve(collInfos)
        })   
    })
}

//=================================vehicleListEndPoint====================================//

vehicleController.findTheVehicleList = async(req,res)=>{
    try {

        const q = req.query;

        var filtredValue = "";

        if(q.query){
            filtredValue = q.query;
        };

        const keys = ['_id', 'count'];
        
        const search = (data) =>{
            return data.filter((item)=> 
            keys.some((key)=>
                item[key].toLowerCase().includes(filtredValue))
            );
        };
    
        await client.connect();
    
        allvehicles = await getTheVehicleList(database);
            
        // res.send(allvehicles)
    
        filtredValue != ""?res.json(search(allvehicles)):res.send(allvehicles)

    } catch (error) {
    
        console.log(error);
    
        res.status(500).send(error)
    
    }
}

module.exports = vehicleController;

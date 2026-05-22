
require('dotenv').config();
const mongoose=require('mongoose');

const atlasURI = process.env.MONGODB_URI;
const connect=mongoose.connect(atlasURI).then(()=>{
    console.log('connected');
}).catch(()=>{
     console.log('err');
});
module.exports=connect;
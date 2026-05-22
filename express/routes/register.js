const express=require('express');
const register=require('../controllers/Register');
const route=express.Router();
route.post('/register',register);
module.exports=route;
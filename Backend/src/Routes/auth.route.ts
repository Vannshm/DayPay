import express from 'express'
const route = express.Router()

import {register,login} from '../Controllers/auth.controller.js'

route.get('/',(req,res)=>{
  res.send('hi')
})

route.post('/user-register',register)
route.post('/user-login',login)


export default route;
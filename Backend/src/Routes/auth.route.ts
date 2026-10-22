import express from 'express'
const route = express.Router()

import {register,login,logout} from '../Controllers/auth.controller.js'

route.get('/',(req,res)=>{
  res.send('hi')
})

route.post('/user-register',register)
route.post('/user-login',login)
route.post('/user-logout',logout)


export default route;
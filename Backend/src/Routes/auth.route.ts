import express from 'express'
const route = express.Router()

import {register,login,logout,getProfile} from '../Controllers/auth.controller.js'
import { authMiddleware } from '../Middleware/auth.middleware.js'

route.get('/',(req,res)=>{
  res.send('hi')
})

route.post('/user-register',register)
route.post('/user-login',login)
route.get('/get-Profile',authMiddleware,getProfile)
route.post('/user-logout',authMiddleware,logout)


export default route;
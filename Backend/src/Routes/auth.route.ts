import express from 'express'
const route = express.Router()

route.post('/',(req,res)=>{
  console.log('DashBoard');
  res.status(200).json({
    message:'welcome to dashboard'
  })
})


export default route;
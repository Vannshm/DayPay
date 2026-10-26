import express from 'express'
const route = express.Router()
import { addExpense , getAllExpense , getExpense , updateExpense } from '../Controllers/expense.controller.js'
import { authMiddleware } from '../Middleware/auth.middleware.js'

route.post('/addExpense',authMiddleware,addExpense)
route.get('/allExpenses',authMiddleware,getAllExpense)
route.get('/getExpense/:id',authMiddleware,getExpense)
route.put('/updateExpense/:id',authMiddleware,updateExpense)


export default route;
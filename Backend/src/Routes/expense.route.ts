import express from 'express'
const route = express.Router()
import { addExpense , getAllExpense , getExpense , updateExpense , deleteExpense, getFilterExpenses } from '../Controllers/expense.controller.js'
import { authMiddleware } from '../Middleware/auth.middleware.js'

route.post('/addExpense',authMiddleware,addExpense)
route.get('/allExpenses',authMiddleware,getAllExpense)
route.get('/getExpense/:id',authMiddleware,getExpense)
route.put('/updateExpense/:id',authMiddleware,updateExpense)
route.delete('/deleteExpense/:id',authMiddleware,deleteExpense)
route.get('/filterExpenses',authMiddleware,getFilterExpenses)


export default route;
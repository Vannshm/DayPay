import express from 'express'
const route = express.Router()
import { addExpense , getAllExpense } from '../Controllers/expense.controller.js'
import { authMiddleware } from '../Middleware/auth.middleware.js'

route.post('/addExpense',authMiddleware,addExpense)
route.get('/allExpenses',authMiddleware,getAllExpense)


export default route;
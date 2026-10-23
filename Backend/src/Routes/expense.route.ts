import express from 'express'
const route = express.Router()
import { addExpense } from '../Controllers/expense.controller.js'
import { authMiddleware } from '../Middleware/auth.middleware.js'

route.post('/addExpense',authMiddleware,addExpense)


export default route;
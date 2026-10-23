import 'dotenv/config'
import express  from 'express'
import cookieParser from 'cookie-parser'

import  authRoute  from './Routes/auth.route.js'
import expenseRoute from './Routes/expense.route.js'


const app = express()
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth/',authRoute);
app.use('/api/expense',expenseRoute)


export default app;
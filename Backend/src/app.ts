import 'dotenv/config'
import express  from 'express'

import  authRoute  from './Routes/auth.route.js'


const app = express()
app.use(express.json());


app.use('/api/auth/',authRoute);


export default app;
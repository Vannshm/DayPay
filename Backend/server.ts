import app from './src/app.js'
import { ConnectDb } from './src/DB/db.js'

ConnectDb()

app.listen(3000,()=>{
  console.log('Server is Listening at port: 3000')
})
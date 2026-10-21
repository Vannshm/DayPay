import mongoose from 'mongoose'

export async function ConnectDb(){
  try{

    const connection = await mongoose.connect(process.env.DB_CONNECTION_STRING!);
    console.log('DB is Connected Sucessfully');
    return connection;
  }catch(err){
    console.log('error to connect to db...');
    console.log(err);
  }
}
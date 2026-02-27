import express from "express";
import { nanoid } from "nanoid";
import connectDB from "./Config/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
//Body parser
app.use(express.urlencoded({extended: false}));

//Serve static files from the "public" directory
app.use(express.static('public'));

//Routes
import urlRoutes from "./Routes/urls.js";
import redirectRoutes from "./Routes/redirect.js";
import lookupRoutes from "./Routes/lookup.js";

app.use('/api/v1', urlRoutes);
app.use('/', redirectRoutes)
app.use('/api/v1/lookup', lookupRoutes);

const PORT = 3000
const startServer = async() =>{
    try{
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT,()=>
        console.log(`Server is listening on port ${PORT}...`));   
    }catch(error){
        console.log('Failed to connect to the database', error);
    }
    
}

startServer();
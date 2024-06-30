const express =require('express');
const mongoose=require('mongoose');
const cors =require('cors')//policy error solver



const app=express();
app.use(express.json());//json is middleware
app.use(cors())
//let todos=[];//it was local storage..once the server stop then data was lost
//so we move to mongodb db

//connect mongodb
mongoose.connect('mongodb://127.0.0.1:27017/mern-todo')//it is promise so use then
.then(()=>{
    console.log('DB connected');
})
.catch((err)=>{
    console.log(err);
})

//create schema ..it used to store the data at particular collections
const todoSchema= new mongoose.Schema({
    title:{
        require :true,
        type: String
    },
    description:String
})

//create models with schema
const todoModel =mongoose.model('Todo',todoSchema);//Todo=collection name--it nust be in singluar,it was created in db


//create a new todo item 
app.post('/todos',async(req,res)=>{
    const {title,description}=req.body;
    try{//ithu asynconorous funstion so try and catch
        const newTodo=new todoModel({title,description});
        await newTodo.save();//db operations wait panni tha nadakum
        res.status(201).json(newTodo);//status =show corect and json=data format
    }catch(error){
       console.log(error);
       res.status(500).json({message :error.message});
    }
     
})

// Get all todos
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find(); // Retrieve all todos from the database
        res.json(todos); // Send todos in JSON format
    } catch (error) {
        console.error(error);
        res.status(500).json({message :error.message});
    }
});

//update todo item
app.put('/todos/:id',async(req,res)=>{//id is imprttant for update (:id)
    try {
        const {title,description}=req.body;
       const id =req.params.id;
       const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        { title , description},
        {new :true}//it give the new updates data
       )
       if(!updatedTodo)//id was incorrect,it was sshown 
        {
            return res.status(404).json({message :"todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})
//deleteing a todo item
app.delete('/todos/:id',async(req,res)=>{
    try {
        const id =req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error.message});
    }
})

const port=8000;
 app.listen(port,()=>{
    console.log("server was listening to port"+port);
 })
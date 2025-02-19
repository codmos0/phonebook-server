require('dotenv').config()

// This is ODM for connecting with MongoDB
const mongoose = require('mongoose')

// This is URL of MongoDB used by mongoose
const uri = process.env.MONGODB_URL
mongoose.set('strictQuery',false)
// Here we try to connect with mongoDB with callbacks for success or failure
mongoose.connect(uri)
        .then(result=> console.log("Connected to mongoDB"))
        .catch(error => console.log("Cannot connect to mongoDB: ", error.message))

// This is how our mongoDB collection should look like for controlled document creation
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

// This transforms Person to a desired object
personSchema.set('toJSON', {
    transform: (document, returnedObj)=>{
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
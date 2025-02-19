require('dotenv').config()

// This is ODM for connecting with MongoDB
const mongoose = require('mongoose')

// This is URL of MongoDB used by mongoose
const uri = process.env.MONGODB_URL
mongoose.set('strictQuery',false)

console.log("Connecting to mongoDB server...")

// Here we try to connect with mongoDB with callbacks for success or failure
mongoose.connect(uri)
        .then(result=> console.log("Connected to mongoDB"))
        .catch(error => console.log("Cannot connect to mongoDB: ", error.message))

// This is how our mongoDB collection should look like for controlled document creation
const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: true
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: function(v) {
          return /\d{2}-\d{7}/.test(v);  
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  });
  

// This transforms Person to a desired object
personSchema.set('toJSON', {
    transform: (document, returnedObj)=>{
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
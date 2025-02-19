const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const PORT = process.env.PORT || 3001

let persons = []

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    if(error.name === 'ValidationError'){
        return res.status(400).send({ error: error.message })
    }

    next(error)
}

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people.</br>${(new Date()).toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(person => {
        if (person) {
            res.json(person)
        }
        else {
            res.status(404).end()
        }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id).then(result=>{
        res.status(204).end()
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const body = req.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(id, person, {new:true}).then(result=>{
        res.json(result)
    }).catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: true,
            message: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        if(savedPerson){
            res.json(savedPerson)
        }
    }).catch(error => next(error))
})

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
})
const express = require('express')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const PORT = process.env.PORT || 3001

let persons = []

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people.</br>${(new Date()).toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(result=>{
        res.json(result)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id).then(person =>
        res.json(person)
    )
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        return res.status(400).json({
            error: true,
            message: 'content missing'
        })
    }

    const personExist = persons.find(p => p.name === body.name)
    if (personExist) {
        return res.status(400).json({
            error: true,
            message: 'name must be unique'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
})
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const PORT = 3001

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people.</br>${(new Date()).toString()}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).send()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)
    res.status(204).end()
})

const genrateId = () => {
    const maxId = Math.max(...persons.map(p => Number(p.id)))
    return String(maxId + 1)
}

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

    const person = {
        id: genrateId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.send(person)
})

app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`)
})
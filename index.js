require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

const Person = require('./models/persons')

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ' '
  })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
  

/*let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]
*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>`
    )
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
});


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

const generateId = () => {
    return Math.floor(Math.random() * 1000000)
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body);
    
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'name or number is missing' 
        })
      }
    /*
    const nameExists = persons.some(person => 
        person.name === body.name
    )
      if (nameExists) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
      }*/
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
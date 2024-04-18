require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./model/persons')

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info',(request,response) => {
    Person.find({}).then(persons => {
        response.send(`Phonebook has info for ${persons.length} people <br> ${new Date()}`)
    })
})

app.get('/api/persons/:id', (request,response) => {
    Person.findById(request.params.id)
    .then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons/', (request, response) => {
    const {name, number} = request.body
    if (!name || !number) {
        return response.status(400).json({error: 'content missing'})
    }
    const person = new Person({
        name: name,
        number: number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response) =>{
    const {name, number} = request.body
    const person = {
        name: name,
        number: number
    }
    Person.findByIdAndUpdate(request.params.id, person , {new: true})
    .then (updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}, happy coding.`)
})
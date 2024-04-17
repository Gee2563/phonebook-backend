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

const cors = require('cors')

app.use(cors())
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
    .catch(error => {
        console.log(error)
        response.status(404).end()
    })
})


app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => {
        console.log(error)
        response.status(404).end()
    })
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


const PORT = process.env.PORT 
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}, happy coding.`)
})
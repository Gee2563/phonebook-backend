const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/info',(request,response) => {
    const date = new Date()
    response.send(`<p>There are ${persons.length} entries in the phone book. <br /> ${date}. </p>`)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    }else {
        response.status(404)
    }

})

const generateID =()=> {
    const id = Math.floor(Math.random()*100000)
    return id
}

app.post('/api/persons/', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({error: 'content missing'})
    }
    else if (persons.find(person => person.name === body.name)){
        return response.status(400).json({error: 'name already exists'})
    }
    else if (persons.find(person => person.number === body.number)){
        return response.status(400).json({error: 'number already exists'})
    }else {
        const person = {
            id: generateID(),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(person)

        return response.json(person)
    }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}, happy coding.`)
})
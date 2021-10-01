const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

const cors = require('cors')

app.use(cors())

app.use(express.static('build'))


morgan.token('post', (request) => {
    if (request.method === 'POST')
      return JSON.stringify(request.body)
    else
      return ''
  })
  
  morgan.format('postFormat', ':method :url :status :res[content-length] - :response-time ms :post')
  
  app.use(morgan('postFormat'))



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
app.get('/api/persons', (request,response) =>{
    response.json(persons)
})

app.get('/info',(request,response)=>{
    const numberOfPeople = persons.length

    response.send(`
    <p> Phonebook has info for ${numberOfPeople} people </p>
    <p> ${new Date} </p>
    `)
    response
})


app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
app.post('/api/persons',(req,res) =>{
    const body = req.body

    console.log(body)

    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })}

    const newPerson = {
        id:generateId(),
        name:body.name,
        number:body.number
    }

    persons = persons.concat(newPerson)

    res.json(persons)

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
const { response } = require('express')
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()

const Person = require('./models/Person')

require('dotenv').config()

app.use(express.json())
const cors = require('cors')
const { Mongoose } = require('mongoose')
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



let persons = []
 app.get('/api/persons', (request,response) =>{
    Person.find({}).then(result =>{
      console.log(result.length)
      persons = result
      response.json(persons)
    })
})

app.get('/info',(request,response)=>{
  
    let numberOfPeople 

    Person.find({}).then(result =>{
      console.log(result.length)
      numberOfPeople = result.length
      response.send(`
      <p> Phonebook has info for ${numberOfPeople} people </p>
      <p> ${new Date} </p>
      `)
    })

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

  
app.post('/api/persons',(req,res) =>{
    const body = req.body

    console.log(body)

    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'content missing' 
        })}

    const newPerson = new Person({
        name:body.name,
        number:body.number
    })

   newPerson.save().then(savedPerson =>{
     console.log(savedPerson)
     persons.push(savedPerson)
     console.log(persons)
     res.json(persons)
   })

    

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
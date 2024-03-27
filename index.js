const express = require('express');
const app = express();
// const data = require('./data');
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
require('dotenv').config();

app.use(cors())
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}

morgan.token('body', (request) => JSON.stringify(request.body))

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :body');

app.use(express.json());
// app.use(morgan('tiny'))

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get('/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error))
})

app.delete('/persons/:id', (request, response) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then(deletedPerson => {
      if (deletedPerson) {
        response.status(204).end();
      } else {
        response.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => {
      response.status(500).json({ error: 'Internal Server Error' });
    });
});

// app.get('/info', (request, response) => {
//   const len = data.length;
//   const localTime = new Date();
//   response.send(`There are ${len} entries in the data. <br/> ${localTime}`);
// });

app.post('/persons', (request, response) => {
  const body = request.body

  const existingName = findb
  if (body.number === undefined) {
    return response.status(400).json({ error: 'number missing' })
  }

  if (body.name === undefined) {
    return response.status(400).json({ error: 'name missing' })
  }

  // if(body.name )

  // const person = new Person({
  //   name: body.name,
  //   number: body.number
  // })

  person.save()
    .then(savedPerson =>
    {
      response.json(savedPerson)
    })
    .catch(error => {
      response.status(500).json({ error: 'Internal Server Error' });
    });
})

app.put('/persons/:id', (req, res, next) =>
{
  const body = req.body
  
  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson =>
    {
      res.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

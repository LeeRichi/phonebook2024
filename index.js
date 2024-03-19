const express = require('express');
const app = express();
const data = require('./data');
var morgan = require('morgan')
const cors = require('cors')

app.use(cors())

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
  response.json(data);
});

app.get('/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const person = data.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/persons/:id', (request, response) => {
  const id = parseInt(request.params.id);
  const index = data.findIndex(person => person.id === id);
  if (index !== -1) {
    data.splice(index, 1);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  const len = data.length;
  const localTime = new Date();
  response.send(`There are ${len} entries in the data. <br/> ${localTime}`);
});

app.post('/persons', postMorgan, (request, response, next) => {
  const person = request.body;
  const foundPerson = data.find(dataPerson => dataPerson.name === person.name);
  if (foundPerson || !person.name || !person.number) {
    return response.status(400).json({ error: 'name must be unique' });
  }
  person.id = generateId();
  data.push(person);
  response.status(201).json(person);
});

app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

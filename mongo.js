const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
    `mongodb+srv://applerich0306:${password}@cluster0.ts6vlph.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
}, { collection: 'person' })

const Person = mongoose.model('Person', personSchema)


if (process.argv.length > 3)
{ 
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`add ${name} number ${number} to phonebook!`)
        mongoose.connection.close()
    })
}

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        result.forEach(note => {
            console.log(note)
        })
        mongoose.connection.close()
    })
}

// const person = new Person({
//   name: 'Dog chi',
//   number: 123,
// })

// person.save().then(result => {
//   console.log('person saved!')
//   mongoose.connection.close()
// })

// Person.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })
const mongoose = require('mongoose')

console.log(`The length of process.argv is ${process.argv.length}`);

if(process.argv.length < 3){
    console.log("Please provide the password as an argumuent e.g. (node mongo.js <password>");
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://Admin:${password}@phonebookbackend.lx31u.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const phoneSchema = new mongoose.Schema({
    name:String,
    number:String,
})

const Phone = mongoose.model('Phone',phoneSchema)

// no name nor number given
if(process.argv.length == 3){
    console.log('entered')
    Phone.find({}).then(result =>{
        result.forEach(note =>{
            console.log(note);
        })
        mongoose.connection.close()
    })
}

else{
    
const phone = new Phone({
    name:process.argv[3],
    number:process.argv[4]
  })
  
  phone.save().then(result => {
    console.log(`added ${phone.name} number ${phone.number} to phonebook`)
    mongoose.connection.close()
  })

}

process.exit(1)
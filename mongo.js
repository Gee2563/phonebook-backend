const mongoose = require('mongoose');
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url =
`mongodb+srv://georgefarhatsmith:${password}@cluster0.ycoopao.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false);

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);


if (process.argv[3] && process.argv[4]){
    console.log('Adding person to phonebook...');
const person = Person ({
    name: process.argv[3],
    number: process.argv[4]
});
person.save().then(result => {
    console.log(`Added ${result.name} with number ${result.number} to phonebook.`);
    mongoose.connection.close();
});
} else if (process.argv.length ===3){
    console.log('Phonebook:');
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number);
        });
        mongoose.connection.close();
    });
} else {
    console.log('Please provide the name and number of the person you want to add to the phonebook: node mongo.js <password> <name> <number>');
    process.exit(1);
}
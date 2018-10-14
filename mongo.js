const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const url = process.env.MONGODB_URI;

mongoose.connect(
  url,
  { useNewUrlParser: true }
);

const Person = mongoose.model("Person", {
  name: String,
  number: String
});

if (process.argv.length === 4) {
  //If there exists 4 arguments take third and fourth and save them to database
  const nameString = process.argv[2];
  const numberString = process.argv[3];

  const newPerson = new Person({
    name: nameString,
    number: numberString
  });

  newPerson.save().then(result => {
    console.log(
      "Lisätään henkilö ",
      newPerson.name,
      " numero ",
      newPerson.number,
      " luetteloon"
    );
    mongoose.connection.close();
  });
} else if (process.argv.length === 2) {
  //If no arguments exists get the list of persons
  console.log("puhelinluettelo:");
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}

// testPerson.save().then(result => {
//   console.log("Person saved");
//   mongoose.connection.close();
// });

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("build"));

/* define a token function for morgan
returns the content of the message if any exists */

morgan.token("content", (req, res) => {
  return JSON.stringify(req.body);
});
// use morgan, basically the same setup as 'tiny' but with content added
app.use(
  morgan(
    ":method :url :content :status :res[content-length] - :response-time ms"
  )
);

const formatPerson = person => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  };
};

app.get("/info", (req, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
  <p>Serverin kello on: ${new Date()}`);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(formatPerson));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(formatPerson(person));
    })
    .catch(error => {
      console.log(error);
      res.status(404).end();
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => {
      res.status(400).send({ error: "bad id" });
    });
});

app.post("/api/persons", (req, res) => {
  // Check that the request has a name and a number and that
  // the name is not in the persons array

  const body = req.body;
  if (body.name === undefined) {
    return res.status(400).json({ error: "Name missing" });
    
  } else if (body.number === undefined) {
    return res.status(400).json({ error: "Number missing" });
    
  }
  //Define the person as name and number exists
  const person = new Person({
    name: body.name,
    number: body.number
  });

  //save only if the person does not exists
  Person.find({ name: {$regex: new RegExp(`^${person.name}$`,'i')}}).then(persons => {
    if (persons.length > 0) { //Person with same name is in the list
      return res.status(400).json({ error: "Name must be unique" });
    } else { // name is unique, save person
      person.save().then(savedPerson => {
        res.json(formatPerson(savedPerson));
      });
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

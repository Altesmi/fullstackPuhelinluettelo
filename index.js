const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan');
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());
app.use(express.static('build'))


/* define a token function for morgan
returns the content of the message if any exists */

morgan.token('content', (req,res) => {
  return JSON.stringify(req.body)
}
)
// use morgan, basically the same setup as 'tiny' but with content added
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'));
let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  }
];

app.get("/info", (req, res) => {
  res.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
  <p>Serverin kello on: ${new Date()}`);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  // Check that the request has a name and a number and that
  // the name is not in the persons array

  if (req.body.name === undefined) {
    return res.status(400).json({ error: "Name missing" });
  } else if (req.body.number === undefined) {
    return res.status(400).json({ error: "Number missing" });
  } else if (
    persons.filter(
      person => person.name.toLowerCase() === req.body.name.toLowerCase()
    ).length > 0
  ) {
    return res.status(400).json({error: 'Name must be unique'})
  }

  const person = req.body;
  person.id = Math.ceil(Math.random() * 1000000);

  persons = persons.concat(person);

  res.json(person);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const app = express();

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

app.delete("/api/persons/:id",(req,res) => {
  const id = Number(req.params.id);
  const arrayLengthAtStart = persons.length
  persons = persons.filter(person => person.id !== id);

  // if length is smaller resource was deleted, otherwise id did not match the persons => return 404

  if(persons.length < arrayLengthAtStart) {
    res.status(404).end();
  } else {
    res.status(204).end();
  }

})

const PORT = 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express')
const cors = require('cors')

const logger = require('./loggerMiddleware')
const app = express()

app.use(cors())
app.use(express.json()) // Método que le dice a express que lo que esperamos de las solicitudes creadas son objetos en formato JSON.

app.use(logger) // Indicamos el uso de un middleware que importamos de un módulo externo creado por nosotros.

let notes = [ // Declaramos nuestra lista de notas.
  {
    id: 1,
    content: 'Tengo que capturas las notas pendientes y escuchar música.',
    date: '21/05/2022',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que aprender sobre nodejs y express.',
    date: '21/05/2022',
    important: true
  },
  {
    id: 3,
    content: 'Investigar cómo asar corte tomahawk.',
    date: '21/05/2022',
    important: true
  }
]

// Empezamos a declarar rutas de nuestra API

app.get('/', (req, res) => {
  res.send('<h1>Hello, world</h1>')
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id) // El request puede tener parametros consigo y podemos acceder a ellos por el request.params.<parametro>.
  const note = notes.find(note => note.id === id)
  note ? res.json(note) : res.status(404).end()
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is missing!'
    })
  }

  const maxId = Math.max(notes.map(note => note.id))

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  res.json(newNote)
})

app.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Not found'
  })
})

const PORT = 3001 // Declaramos el puerto.
app.listen(PORT, () => { // Inicializamos la escucha (levantamos el servidor) en el puerto previamente declarado.
  console.log(`Server running on port ${PORT}`)
})

/*
Common actions
.get
.post
.delete
.put

Basic HTTP request example.

const http = require("http");

const app = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.end(JSON.stringify(notes))
});

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
*/

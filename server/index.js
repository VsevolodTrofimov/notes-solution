const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const NoteService = require('./notes')


const app = express()
const port = 8080
const root = path.resolve(__dirname, '../')
const staticPath = path.resolve(root, './src')
const notes = NoteService(path.join(__dirname, 'notes.json'))

app.use(bodyParser.json())
app.use('/src', express.static(staticPath))


app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'index.html'))
})

app.get('/api/notes', (req, res) => {
  notes.get(notes => res.send(notes))
})

app.post('/api/note/:id', (req, res) => {
  notes.set(req.params.id, req.body.note)
  res.status(200).send('Saved')
})

app.put('/api/note/', (req, res) => {
  notes.add(req.body.note, id => res.send(id))
})

app.delete('/api/note/:id', (req, res) => {
  notes.delete(req.params.id)
  res.status(200).send('Deleted')
})

app.listen(port, () => {
  console.log('listening on', `localhost:${port}`)
})

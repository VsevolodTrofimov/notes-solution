const fs = require('fs')
const path = require('path')


const fileName = path.join(__dirname, 'notes.json')


let notes, notesReadSubscibers = []

fs.readFile(fileName, 'utf8', (err, data) => {
  if(err) throw err
  
  notes = JSON.parse(data)
  notesReadSubscibers.forEach(cb => cb())
})

const afterLoad = (cb, args) => {
  if(typeof notes !== 'undefined') cb()
  else notesReadSubscibers.push(cb)
}

const saveNotes = () => {
  fs.writeFile(fileName, JSON.stringify(notes), (err, data) => {
    if(err) throw err
  })
}


const getNotes = cb => {
  afterLoad(() => cb(notes))
}

const setNote = (id, note) => {
  afterLoad(() => {
    notes[id] = note
    saveNotes()
  })
}

const addNote = (note, cb) => {
  afterLoad(() => {
    const Ids = Object.keys(notes).map(Number)
    Ids.sort()

    let i
    for (i = 0; i <= Ids.length; ++i) {
      if(Ids[i] > i) break
    }
    const newId = i.toString()

    setNote(newId, note)
    cb(newId)
  })
}

const deleteNote = (id, note) => {
  afterLoad(() => {
    delete notes[id]
    saveNotes()
  })
}

module.exports = {
  get: getNotes,
  set: setNote,
  add: addNote,
  delete: deleteNote
}
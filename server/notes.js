const fs = require('fs')
const path = require('path')


const fileName = path.join(__dirname, 'notes.json')


let saving = false, reSave = false, notes, readSubscribers = []

fs.readFile(fileName, 'utf8', (err, data) => {
  if(err) throw err

  notes = JSON.parse(data)
  readSubscribers.forEach(cb => cb())
})

const afterLoad = (cb, args) => {
  if(typeof notes !== 'undefined') cb()
  else readSubscribers.push(cb)
}

const saveNotes = () => {
  if(saving) reSave = true
  else {
    saving = true
    reSave = false
    fs.writeFile(fileName, JSON.stringify(notes), (err, data) => {
      if(err) throw err
      saving = false
      if(reSave) saveNotes()
    })
  }
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

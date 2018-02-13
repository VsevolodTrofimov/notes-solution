common.store = (function storeModule() {
  const prossibleColors = ['blue', 'red', 'orange', 'yellow']
  const note_backups = {}
  const subscribers = []

  const newNote = () => ({
    title: '',
    text: '',
    color: undefined,
    state: 'new'
  })

  const extractNoteData = note => ({
    title: note.title,
    text: note.text,
    img: note.img,
    color: note.color,
    priority: note.priority,
  })

  const state = {
    notes: {
      'new': newNote()
    }
  }

  const reactions = {
    NOTES_UPDATE_ALL: ({notes}) => {
      const allNotes = Object.assign({}, state.notes, notes)

      for(let id in allNotes) {
        if((state.notes[id] && state.notes[id].state === 'edit')
        || (id === 'new')) {
          // don't mess againt user's actions
          continue
        }

        if(notes[id]) {
          if( ! state.notes[id]) state.notes[id] = {}
          Object.assign(state.notes[id], notes[id])
        } else {
          delete state.notes[id]
        }
      }
    },

    NOTE_SET_ID: ({oldId, newId}) => {
        state.notes[newId] = state.notes[oldId]
        delete state.notes[oldId]
    },

    NOTE_ADD: () => {
      const nextTmpId = 'tmp-' + String(Object.keys(state.notes).length - 2)
      state.notes[nextTmpId] = state.notes['new']
      state.notes[nextTmpId].state = 'default'
      state.notes.new = newNote()

      const note = state.notes[nextTmpId]

      common.net.request('/api/note', 'PUT', {note: extractNoteData(note)})
        .then(id => common.store.dispatch({
          type: 'NOTE_SET_ID',
          oldId: nextTmpId,
          newId: id
        }))
    },

    NOTE_EDIT: ({noteId}) => {
      const note = state.notes[noteId]
      note_backups[noteId] = Object.assign({}, note)
      note.state = 'edit'
    },
    NOTE_EDIT_SAVE: ({noteId}) => {
      const note = state.notes[noteId]
      note.state = 'default'

      common.net.request(`/api/note/${noteId}`, 'POST',
                         {note: extractNoteData(note)})

      delete note_backups[noteId]
    },
    NOTE_EDIT_CANCEL: ({noteId}) => {
      state.notes[noteId] = note_backups[noteId]
      state.notes[noteId].state = 'default'
      delete note_backups[noteId]
    },
    NOTE_TITLE_SET: ({noteId, value}) => {
      state.notes[noteId].title = value
    },
    NOTE_TEXT_SET: ({noteId, value}) => {
      state.notes[noteId].text = value
    },
    NOTE_IMAGE_PROMPT: ({noteId}) => {
      const note = state.notes[noteId]
      note.img = prompt('Image URL', note.img)
    },

    NOTE_COLOR_NEXT: ({noteId}) => {
      const note = state.notes[noteId]
      const idx = prossibleColors.indexOf(note.color)
      note.color = prossibleColors[(idx + 1) % prossibleColors.length]
    },
    NOTE_PRIORITY_TOGGLE: ({noteId}) => {
      state.notes[noteId].priority = !state.notes[noteId].priority

      common.net.request(`/api/note/${noteId}`, 'POST',
                         {note: extractNoteData(state.notes[noteId])})
    },

    NOTE_DELETE: ({noteId}) => {
      delete state.notes[noteId]

      common.net.request(`/api/note/${noteId}`, 'DELETE')
    }
  }

  const react = action => {
    if(reactions[action.type]) {
      reactions[action.type](action)
      subscribers.forEach(cb => cb(state))
    }
  }

  const unsubscribe = cb => {
    const idx = subscribers.indexOf(cb)
    if(idx !== -1) subscribers.splice(idx, 1)
  }

  const subscribe = cb => {
    subscribers.push(cb)
    return () => unsubscribe(cb)
  }

  const dispatch = action => {
    react(action)
  }

  return {
    state,
    dispatch,
    subscribe,
    unsubscribe
  }
} ())

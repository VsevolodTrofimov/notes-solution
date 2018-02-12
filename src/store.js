common.store = (function() {
  const prossibleColors = ['blue', 'red', 'orange', 'yellow']
  const note_backups = {}
  const subscribers = []

  const newNote = () => ({
    title: '',
    text: '',
    color: undefined,
    state: 'new'
  })

  const state = {
    notes: {
      '0': {
        title: "Колок",
        text: "Затащить на пятюню",
        color: 'blue',
        priority: true,
      }, 
      '1': {
        color: 'orange',
        title:"IMG",
        img: "https://pp.userapi.com/c637917/v637917736/7213e/bKbdB4CLC5Q.jpg",
        text:"OTHER TEXT LL",
      },
      'new': newNote()
    }
  }


  const reactions = {
    NOTE_ADD: () => {
      const nextTmpId = 'tmp-' + String(Object.keys(state.notes).length - 2)
      state.notes[nextTmpId] = state.notes['new']
      state.notes[nextTmpId].state = 'default'
      state.notes.new = newNote()
    },

    NOTE_EDIT: ({noteId}) => {
      const note = state.notes[noteId]
      note_backups[noteId] = Object.assign({}, note)
      note.state = 'edit'
    },
    NOTE_EDIT_SAVE: ({noteId}) => {
      const note = state.notes[noteId]
      note.state = 'default'
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
    },

    NOTE_DELETE: ({noteId}) => {
      delete state.notes[noteId]
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
    console.log(action)
    react(action)
  }

  return {
    state,
    dispatch,
    subscribe,
    unsubscribe
  }
} ())
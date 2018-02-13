(function init() {
  const updateApp = state => {
    const sections = [{
      title: 'High Priority',
      notes : []
    },{
        title: 'Default',
        notes : []
    }]
    
    let noteNew

    for(let id in state.notes) {
      const note = state.notes[id]

      if(id === 'new') {
        noteNew = {id, ...note}
        continue
      }

      sections[(note.priority ? 0 : 1)].notes.push({
        id,
        ...note
      })
    }

    sections[1].notes.push(noteNew)

    const vm = common.templates.app({sections})
    common.render(document.body, vm)
  }

  common.store.subscribe(updateApp)
  common.net.sync.start('/api/notes', notes => {
    common.store.dispatch({
      type: 'NOTES_UPDATE_ALL',
      notes
    })
  }, 5000)
}())

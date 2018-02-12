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
    
    console.log('re-render', state, sections)
    console.log(vm)

    common.render(document.body, vm)
  }

  common.store.subscribe(updateApp)
  updateApp(common.store.state)
}())
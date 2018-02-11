(function init() {
  const updateApp = state => {
    const sections = [{
      title: 'High Priority',
      notes : []
    },{
        title: 'Default',
        notes : []
    }, {
      title: 'New note',
      notes: []
    }]
    
    for(let id in state.notes) {
      const note = state.notes[id]
      const sectionIdx = id === 'new' ? 2 : (note.priority ? 0 : 1)
      sections[sectionIdx].notes.push({
        id,
        ...note
      })
    }

    console.log('re-render', state, sections)

    const vm = common.templates.app({sections})

    console.log(vm)
    common.render(document.body, vm)
  }

  common.store.subscribe(updateApp)
  updateApp(common.store.state)
}())
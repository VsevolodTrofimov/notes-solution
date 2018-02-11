common.templates = (function templatesModule() {
  const h = (tag, props={}, children=[]) => ({tag, props, children})

  const noteActions = props => {
    const color = h('button', {
      class: 'note__actions__action',
      onClick: () => alert(props.text)
    }, ['color'])

    const del = h('button', {
      class: 'note__actions__action',
      onClick: () => alert(props.text)
    }, ['Delete'])

    const priority = h('button', {
      class: 'note__actions__action',
      onClick: () => alert(props.text)
    }, ['Priority'])

    const actions = h('div', {class: 'note__actions'}, [
      color,
      priority,
      del,
    ])

    return actions
  }
  
  const note = props => {
    const image = h('div', {
      style: `background-image: url(${props.img})`, 
      class: 'note__image'
    })
    
    const title = h('textarea', {
      class: 'note__title',
      placeholder: 'Title',
      onInput: event => common.utils.autoResizeTextarea(event.target),
      onKeyPress: props.titleUpdate,
    }, [props.title])

    const text = h('textarea', {
      class: 'note__text',
      placeholder: 'Text',
      onKeyPress: props.textUpdate,
    }, [props.text])

    return h('div', {class: `note note--color-${props.color}`}, [
      props.img ? image : null,
      title,
      text,
      noteActions({text: 'actions'})
    ])
  }

  const section = props => {
    const heading = h('h1', {class: 'section__title'}, [props.title])

    const notes = props.notes.map(note).map(note => {
      note.props.class += ' section__note'
      return note
    })
    const row = h('div', {class: 'section__row'}, notes)

    return h(
      'section', {class: 'section'}, [
      heading,
      row
    ])
  }

  const app = props => {
    const sections = props.sections.map(s => s.notes.length ? section(s) : null)
    return h('div', {class: 'app'}, sections)
  }

  return {
    note,
    section,
    app
  }
}())
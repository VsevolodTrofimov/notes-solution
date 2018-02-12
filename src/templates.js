common.templates = (function templatesModule() {
  const h = (tag, props={}, children=[]) => ({tag, props, children})

  const noteAction = (noteId, label, type) => {
    if(typeof type === 'undefined') type="NOTE_" + label.toUpperCase()
    
    return h('button', {
      class: 'note__actions__action',
      onClick: () => common.store.dispatch({
        type,
        noteId
      })
    }, [label])
  }

  
  const noteActions = props => {
    const makeAction = (label, type) => {
      return common.templates.noteAction(props.noteId, label, type)
    }

    let actions = []
    
    if(props.type === 'edit') {
      actions = [
        makeAction('Save', 'NOTE_EDIT_SAVE'),
        makeAction('Color', 'NOTE_COLOR_NEXT'),
        makeAction('Image', 'NOTE_IMAGE_PROMPT'),
        makeAction('Cancel', 'NOTE_EDIT_CANCEL')
      ]
    } else if(props.type === 'new') {
      actions = [
        makeAction('Color', 'NOTE_COLOR_NEXT'),
        makeAction('Image', 'NOTE_IMAGE_PROMPT'),
        makeAction('Add')
      ]
    } else {
      actions = [
        makeAction('Priority', 'NOTE_PRIORITY_TOGGLE'),
        makeAction('Edit'),
        makeAction('Delete'),
      ]
    }


    return h('div', {class: 'note__actions'}, actions)
  }
  
  const note = props => {
    let state = props.state
    if(typeof state === 'undefined') state = 'default'

    const image = h('div', {
      style: `background-image: url(${props.img})`, 
      class: 'note__image'
    })

    const title = h('textarea', {
      class: 'note__title',
      disabled: state === 'default',
      placeholder: 'Title',
      onInput: event => {
        common.store.dispatch({
          type: 'NOTE_TITLE_SET',
          noteId: props.id,
          value: event.target.value
        })
        common.utils.autoResizeTextarea(event.target)
      }
    }, [props.title])

    const text = h('textarea', {
      class: 'note__text',
      disabled: state === 'default',
      placeholder: 'Text',
      onInput: event => {
        common.store.dispatch({
          type: 'NOTE_TEXT_SET',
          noteId: props.id,
          value: event.target.value
        })
      }
    }, [props.text])

    const actions = common.templates.noteActions({
      type: state,
      noteId: props.id
    })

    return h('div', {class: `note note--color-${props.color}`}, [
      props.img ? image : null,
      title,
      text,
      actions
    ])
  }

  const section = props => {
    const heading = h('h1', {class: 'section__title'}, [props.title])

    const notes = props.notes.map(common.templates.note)

    notes.map(note => {
      note.props.class += ' section__note'
      return note
    })

    const row = h(
      'div', {class: 'section__row'}, 
      notes.length ? notes : ['No notes']
    )

    return h(
      'section', {class: 'section'}, [
      heading,
      row
    ])
  }

  const app = props => {
    const sections = props.sections.map(common.templates.section)
    return h('div', {class: 'app'}, sections)
  }

  return {
    app,
    section,
    note,
    noteActions,
    noteAction,
  }
}())
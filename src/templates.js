common.templates = (function templatesModule() {
  const h = (tag, props={}, children=[]) => ({tag, props, children})

  const noteActions = props => {
    return h('button', {
      onClick: () => alert(props.text)
    }, ['lol-', props.text])
  }
  
  const note = props => {
    const image = h('img', {src: props.img, class: 'note__image'})
    
    const title = h('input', {
      class: 'note__title',
      value: props.title,
      onKeyPress: props.titleUpdate
    })

    const text = h('textarea', {
      class: 'note__text',
      onKeyPress: props.textUpdate
    }, [props.text])

    return h('div', {}, [
      props.img ? image : null,
      title,
      text,
      noteActions({text: 'actions'})
    ])
  }

  const noteRow = data => {
    
  }

  return {
    note
  }
}())
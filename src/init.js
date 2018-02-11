(function init() {
  const notes = [{
    id: 0,
    title: "Колок",
    text: "Затащить на пятюню",
    color: 'blue',
    titleUpdate: console.log,
  }, {
    id:1,
    color: 'orange',
    title:"IMG",
    img: "https://pp.userapi.com/c637917/v637917736/7213e/bKbdB4CLC5Q.jpg",
    text:"OTHER TEXT LL",
  }]

  const sections = [
    {
      title: 'Приоритетные',
      notes
    },
    {
      title: 'Обычные',
      notes
    }
  ]

  const vm = common.templates.app({
    sections
  })
  
  common.render(document.body, vm)
}())
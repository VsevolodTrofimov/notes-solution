(function init() {
  const vm = common.templates.note({
    id: 0,
    title: "Колок",
    text: "Затащить на пятюню",
    titleUpdate: console.log,
  })
  
  const vmImg = common.templates.note({
    id:1,
    title:"IMG",
    img: "https://pp.userapi.com/c637917/v637917736/7213e/bKbdB4CLC5Q.jpg",
    text:"OTHER TEXT LL",
  })
  
  common.render(document.body, vm)
  setTimeout(() => {
    console.log(vm, vmImg)
    common.render(document.body, vmImg)
  }, 1000)
}())
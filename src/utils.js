common.utils = (function() {
  const autoResizeTextarea = $textarea => {
    $textarea.style.height = '0px'
    $textarea.style.height = $textarea.scrollHeight + 'px'  
  }

  return {
    autoResizeTextarea
  }
}())
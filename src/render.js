/**
 * Virtual DOM node
 * @typedef {(string|{tag: string, props: Object, children: [VNode]})} VNode
 */

common.render = (function renderModule() {
  // utility
  const checkNodeTypeEqual = (node1, node2) => {
    if (node1 === null || node2 === null) return false
    if (typeof node1 !== typeof node2) return false
    if (typeof node1 === 'string' && node1 !== node2) return false
    if (node1.tag !== node2.tag) return false
    return true
  }

  const getEvent = propName => {
    const lower = propName.toLowerCase()
    if(lower.startsWith('on')) return lower.substring(2)
    else return false
  }
  

  // props
  const setProp = ($target, name, value) => {
    const event = getEvent(name)
    if (event) return $target.addEventListener(event, value)
    if (typeof value === 'boolean') return $target[name] = value
    return $target.setAttribute(name, value)
  }

  const removeProp = ($target, name, value) => {
    const event = getEvent(name)
    if (event) return $target.removeEventListener(event, value)
    $target.removeAttribute(name, value)
  }
  
  const setProps = ($target, props) => {
    Object.keys(props).forEach(name => {
      setProp($target, name, props[name])
    })
  }
  

  // nodes
  const createElement = node => {
    if ( ! node) return document.createComment(' empty vnode ')
    if (typeof node === 'string') return document.createTextNode(node)

    const $el = document.createElement(node.tag)
    setProps($el, node.props)

    // cb in setTimeout(cb, 0) fires after stack is cleared
    setTimeout(() => {
      const event = new Event('mount')
      $el.dispatchEvent(event)
    }, 0)

    node.children
      .map(createElement)
      .forEach($child => $el.appendChild($child))

    return $el
  }


  // update
  const updateProp = ($target, name, oldVal, newVal) => {
    if ( ! newVal) return removeProp($target, name, oldVal)
    if ( ! oldVal || newVal !== oldVal) {
      // event listeners must be removed first
      if(getEvent(name)) removeProp($target, name, oldVal)
      setProp($target, name, newVal)
    }
  }

  const updateProps = ($target, oldProps, newProps) => {
    const props = Object.assign({}, newProps, oldProps)
    Object.keys(props).forEach(name => {
      updateProp($target, name, oldProps[name], newProps[name])
    })
  }

  /**
   * Updates DOM bssed on VDOM's diff
   * @param {HTMLElement} $parent
   * @param {VNode} newNode 
   * @param {VNode} oldNode
   * @param {number} index 
   */
  const update = ($parent, oldNode, newNode, index=0) => {
    // tags with special behaviour
    if($parent.tagName.toLowerCase() === 'textarea') {
      return $parent.value = newNode
    }

    if (typeof oldNode === 'undefined') {
      // parent got more children
      $parent.appendChild(createElement(newNode))
    } else if (typeof newNode === 'undefined') {
      // parent got less children
      $parent.removeChild($parent.childNodes[index])
    } else if ( ! checkNodeTypeEqual(oldNode, newNode)) {
      // child tag changed
      $parent.replaceChild(createElement(newNode), $parent.childNodes[index])
    } else if (newNode.tag) {
      // child tag is the same, but we are not sure about props & children
      const $this = $parent.childNodes[index]
      
      updateProps(
        $this,
        oldNode.props || {},
        newNode.props
      )

      const newLength = newNode.children.length
      const oldLength = oldNode.children.length
      for (let i = 0; i < newLength || i < oldLength; ++i) {
        update(
          $this,
          oldNode.children[i],
          newNode.children[i],
          i
        )
      }
    }
  }


  // API
  /**
   * Updates DOM bssed on VDOM's diff
   * @param {HTMLElement} $root element to mount app into
   * @param {VNode} vNode virtual DOM to render effectively
   */
  const render = ($root, vNode) => {
    if(!render.previousVersion) $root.innerHTML = ''
    update($root, render.previousVersion, vNode)
    render.previousVersion = vNode
  }

  render.update = update

  return render
}())

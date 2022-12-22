class MyComponent extends HTMLElement {
  constructor() {
    super()
    this.count = 0
  }
  connectedCallback() {
    this.app = document.querySelector('my-event-bus')
    this.counter = this.querySelector('.counter')
    this.button = this.querySelector('button')
    this.subComponent = this.querySelector('my-sub-component')

    this.update()

    this.countListener = (e) => {
      this.count += parseInt(e.detail.step)
      this.update()
    }
    this.app.addEventListener('my-sub-component:clicked', this.countListener)

    this.clearListener = (e) => {e.preventDefault(); this.onClear()}
    this.app.addEventListener('my-sub-component:clear', this.clearListener)

    this.clickListener = () => {
      this.subComponent?.clear()
    }
    this.button?.addEventListener('click', this.clickListener)
  }

  disconnectedCallback() {
    this.app?.removeEventListener('my-sub-component:clicked', this.countListener)
    this.button?.removeEventListener('click', this.clickListener)
  }

  update() {
    if (this.counter){
      this.counter.textContent = this.count
    }
  }

  onClear() {
    this.count = 0
    this.update()
  }
}

class MySubComponent extends HTMLElement {
  connectedCallback() {
    this.app = document.querySelector('my-event-bus')
    this.button = this.querySelector('button')

    if(!this.button) {
      throw new Error('sub component is missing a button')
    }

    this.clickListener = () => {
      this.app.dispatchEvent(new CustomEvent('my-sub-component:clicked', { detail: { step: 1 } }))
    }
    this.button.addEventListener('click', this.clickListener)
  }

  disconnectedCallback() {
    this.button?.removeEventListener('click', this.clickListener)
  }

  clear() {
    this.app.dispatchEvent(new CustomEvent('my-sub-component:clear'))
  }
}

class ValidatedInput extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.insertAdjacentHTML(`<my-error-messages />`)
  }
}


class MyPassword extends HTMLInputElement {
  connectedCallback() {
    this.required = this.hasAttribute("required")
    this.minCharacters = this.getAttribute("min")
  }

  validate() {
    return this.textContent.length >= parseInt(this.minCharacters)
  }
}

customElements.define('my-component', MyComponent)
customElements.define('my-sub-component', MySubComponent)
customElements.define('my-password', MyPassword, { extends: "input" })


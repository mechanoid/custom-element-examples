class MyComponent extends HTMLElement {
  connectedCallback() {
    console.log('MyComponent:', 'connected');
  }
}

customElements.define('my-component', MyComponent)

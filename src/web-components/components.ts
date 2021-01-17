const webComponents = () => {
    class PostBody extends HTMLElement {
        connectedCallback() {
            const content = this.innerText.replace(/<script>|<script src=("|').*("|')(\s+|)>/g, '&lt;script&gt;')
            .replace(/<\/script>/g, '&lt;/script&gt;');
            this.innerHTML = content;
        }

    }
    window.customElements.define('post-body', PostBody);

    class PostBodyEdit extends HTMLElement {
        static get observedAttributes() {
            return ['body'];
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (name === 'body' && oldValue !== newValue) {
                const body = this.getAttribute('body');
                const content = body?.replace(/<script>|<script src=("|').*("|')(\s+|)>/g, '&lt;script&gt;')
                .replace(/<\/script>/g, '&lt;/script&gt;');
                this.innerHTML = content || '';
            }
        }

    }
    window.customElements.define('post-body-edit', PostBodyEdit);

    class TextInput extends HTMLElement {
        static get observedAttributes() {
            return ['value', 'className'];
        }

        connectedCallback() {
            const value = this.getAttribute('value');
            const className = this.getAttribute('className');
            if (className) {
                for (const _class of className.split(' ')) {
                    this.classList.add(_class);
                }
            }
            this.style.display = 'block';
            this.textContent = value || this.innerText;
        }

        attributeChangedCallback(name: string, oldValue: string, newValue: string) {
            if (name === 'value' && newValue !== oldValue) {
                this.textContent = this.getAttribute(name);
            }
        }
    }
    window.customElements.define('text-input', TextInput);
}

export default webComponents;
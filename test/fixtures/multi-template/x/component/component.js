import { LightningElement, api } from 'lwc'
import a from './a.html'
import b from './b.html'

export default class extends LightningElement {
    @api renderB = false

    renderedCallback() {
        const template = this.renderB ? b : a
        this.renderB = !this.renderB
        return template
    }
}

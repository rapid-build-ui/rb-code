/**********
 * RB-CODE
 **********/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import template                from '../views/rb-code.html';
import '../../rb-popover/scripts/rb-popover.js';

export class RbCode extends RbBase() {
	viewReady() {
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			textarea: this.shadowRoot.querySelector('textarea'),
		});
	}

	/* Properties
	 *************/
	static get props() {
		return {
			caption: Object.assign({}, props.string, {
				default: 'html'
			}),
			kind: Object.assign({}, props.string, {
				default: 'default'
			})
		};
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-code', RbCode);

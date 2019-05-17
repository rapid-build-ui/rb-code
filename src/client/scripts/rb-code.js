/**********
 * RB-CODE
 **********/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import Type                    from '../../rb-base/scripts/public/services/type.js';
import Converter               from '../../rb-base/scripts/public/props/converters.js';
import Editor                  from './editor.js';
import Modes                   from './modes.js';
import template                from '../views/rb-code.html';
import '../../rb-popover/scripts/rb-popover.js';

export class RbCode extends RbBase() {
	/* Lifecycle
	 ************/
	disconnectedCallback() { // :void
		super.disconnectedCallback && super.disconnectedCallback();
		this.destroyEditor();
	}
	async viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			textarea: this.shadowRoot.querySelector('textarea'),
		});
		this.setTextareaValue();
		this._mode = this.mode;
		await Editor.load();
		// console.log('view ready');
		await Editor.loadMode(this._mode);
		this.updateCaption();
		this.initEditor();
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			caption: props.string,
			height: Object.assign({}, props.string, {
				default: 'tall'
			}),
			kind: Object.assign({}, props.string, { // TODO: maybe
				default: 'default'
			}),
			mode: Object.assign({}, props.string, {
				default: 'text'
			}),
			readonly: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
			}),
			scrollable: Object.assign({}, props.boolean, {
				default: true,
				deserialize: Converter.boolean
			}),
			theme: Object.assign({}, props.string, {
				default: 'one-dark'
			})
		};
	}

	/* Getters and Setters
	 **********************/
	get _mode() { // :mode<object>
		return this.__mode;
	}
	set _mode(mode) { // :void
		this.__mode = Modes[mode] || Modes['text']; // :object
	}

	/* Helpers
	 **********/
	destroyEditor() { // :void
		if (!this.editor) return;
		this.editor.toTextArea();
	}
	setTextareaValue() { // :void (hidden textarea value)
		this.rb.elms.textarea.value = this.innerHTML.trim();
	}
	updateCaption() { // :void
		if (this.caption) return;
		this.caption = this._mode.title || '';
	}
	updateReadonlyOpts() { // :void
		this.editor.setOption('cursorBlinkRate', -1); // hides cursor
	}

	/* Editor
	 *********/
	initEditor() { // :void
		this.editor = CodeMirror.fromTextArea(this.rb.elms.textarea, {
			indentUnit: 4, // without, smartIndent uses 2 spaces
			indentWithTabs: true,
			lineNumbers: false,
			lineWrapping: false,
			mode: this._mode.config,
			readOnly: this.readonly,
			// smartIndent: true, // default
			// tabSize: 4, // default
			theme: this.theme,
			viewportMargin: Infinity // monitor performance (maybe 50)
		});
		if (this.readonly) this.updateReadonlyOpts();
		// console.log(this.editor);
		// console.log(this.editor.options.mode);
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-code', RbCode);

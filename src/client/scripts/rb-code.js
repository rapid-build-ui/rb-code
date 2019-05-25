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
	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			eStyles:  this.shadowRoot.getElementById('editor'),
			eTheme:   this.shadowRoot.getElementById('theme'),
			textarea: this.shadowRoot.querySelector('textarea')
		});
		this.setTextareaValue();
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
				default: 'one-dark',
				deserialize(val) { // :string
					if (!Type.is.string(val)) return val;
					return val.trim().toLowerCase();
				}
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
	async loadEditor() { // :void
		this._mode = this.mode;
		await Editor.loadPrereqs(this.rb.elms.eStyles);
		await Editor.loadMode(this._mode);
		await Editor.loadTheme(this.rb.elms.eTheme, this.theme);
		this.updateCaption();
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
	async initEditor() { // :void
		await this.loadEditor();
		if (!this.rb.elms.textarea) return; // JIC
		// console.log(this.rb.elms.textarea);
		this.editor = CodeMirror.fromTextArea(this.rb.elms.textarea, {
			indentUnit: 4, // without, smartIndent uses 2 spaces
			indentWithTabs: true,
			lineNumbers: false,
			lineWrapping: false,
			mode: this._mode.config,
			readOnly: this.readonly,
			// smartIndent: true, // default
			// tabSize: 4, // default
			theme: this.theme === 'codemirror' ? 'default' : this.theme,
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

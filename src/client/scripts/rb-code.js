/**********
 * RB-CODE
 **********/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import Type                    from '../../rb-base/scripts/public/services/type.js';
import Converter               from '../../rb-base/scripts/public/props/converters.js';
import View                    from '../../rb-base/scripts/public/view/directives.js';
import Editor                  from './editor.js';
import Modes                   from './modes.js';
import template                from '../views/rb-code.html';
import '../../rb-popover/scripts/rb-popover.js';
// true if phone or tablet (TODO: move to base and improve)
const IS_MOBILE = !Type.is.undefined(window.orientation);

export class RbCode extends RbBase() {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this._editorEvents = {}; // populated in _attachEditorEvents()
	}
	disconnectedCallback() { // :void
		super.disconnectedCallback && super.disconnectedCallback();
		if (!this.editor) return;
		this.editor.off('change', this._editorEvents.change);
		this.editor.toTextArea();
	}
	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			eStyles:  this.shadowRoot.getElementById('editor'),
			eTheme:   this.shadowRoot.getElementById('theme'),
			textarea: this.shadowRoot.querySelector('textarea')
		});
		this._setTextareaValue();
		this._initEditor();
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			caption: props.string,
			placeholder: props.string,
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
				deserialize: Converter.valueless
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

	/* Getter and Setter (methods)
	 ********************/
	_getCursorBlinkRate() { // :milliseconds<int> (-1 hides the cursor)
		return this.readonly ? -1 : CodeMirror.defaults.cursorBlinkRate;
	}
	_getReadonly() { // :boolean | string
		// if mobile then 'nocursor' (prevents keyboard from popping up)
		return this.readonly ? IS_MOBILE ? 'nocursor' : true : false;
	}
	_setCaption() { // :void
		if (this.caption) return;
		this.caption = this._mode.title || '';
	}
	_setTextareaValue() { // :void (hidden textarea value)
		this.rb.elms.textarea.value = this.innerHTML.trim();
	}

	/* Loaders
	 **********/
	async _loadEditor() { // :void
		this._mode = this.mode;
		await Editor.loadPrereqs(this.rb.elms.eStyles);
		await Editor.loadMode(this._mode);
		await Editor.loadTheme(this.rb.elms.eTheme, this.theme);
		if (this.placeholder) await Editor.loadAddon('placeholder');
	}

	/* Event Management
	 *******************/
	_attachEditorEvents() { // :void
		this._editorEvents.change = this._onchange.bind(this);
		this.editor.on('change', this._editorEvents.change);
	}
	_onchange(editor, change) { // :void
		// console.log('EDITOR:', this.editor);
		// console.log('CHANGE:', change);
		this.editor.save();
		// console.log('TEXTAREA VALUE:');
		// console.log(this.rb.elms.textarea.value);
	}

	/* Editor
	 *********/
	async _initEditor() { // :void
		await this._loadEditor();
		this._setCaption();
		if (!this.rb.elms.textarea) return; // JIC

		this.editor = CodeMirror.fromTextArea(this.rb.elms.textarea, {
			indentUnit: 4, // uses 2 spaces without smartIndent
			indentWithTabs: true,
			lineNumbers: false,
			lineWrapping: false,
			mode: this._mode.config,
			readOnly: this._getReadonly(),
			cursorBlinkRate: this._getCursorBlinkRate(),
			// smartIndent: true, // default
			// tabSize: 4, // default
			theme: this.theme === 'codemirror' ? 'default' : this.theme,
			viewportMargin: Infinity // monitor performance (maybe 50)
		});

		this._attachEditorEvents();
		// console.log(this.editor);
		// console.log(CodeMirror.modes);
		// console.log(CodeMirror.defaults);
		// console.log(CodeMirror.defaults.cursorBlinkRate);
		// console.log(this.editor.options.mode);
		// console.log(this.editor.getOption('readOnly'));
		// console.log(this.editor.getOption('cursorBlinkRate'));
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-code', RbCode);

/**********
 * RB-CODE
 **********/
import { RbBase, props, html } from '../../rb-base/scripts/rb-base.js';
import FormControl             from '../../form-control/scripts/form-control.js';
import Type                    from '../../rb-base/scripts/public/services/type.js';
import Converter               from '../../rb-base/scripts/public/props/converters.js';
import View                    from '../../rb-base/scripts/public/view/directives.js';
import Modes                   from './modes.js';
import template                from '../views/rb-code.html';
import './generated/editor.js';
import '../../rb-button/scripts/rb-button.js';
import '../../rb-popover/scripts/rb-popover.js';
// true if phone or tablet (TODO: move to base and improve)
const IS_MOBILE = !Type.is.undefined(window.orientation);

export class RbCode extends FormControl(RbBase()) {
	/* Lifecycle
	 ************/
	constructor() {
		super();
		this._initValue();
		this._editorEvents = {};
		this.rb.formControl.isTextarea = true;
	}
	connectedCallback() { // :void
		super.connectedCallback && super.connectedCallback();
		setTimeout(() => {
			const textarea = this.shadowRoot.querySelector('textarea');
			this.rb.elms.textarea = textarea;
			Object.assign(this.rb.formControl, {
				elm:      textarea,
				focusElm: textarea
			});
			this._mode = this.mode;
			this._initEditor();
		});
	}
	disconnectedCallback() { // :void
		super.disconnectedCallback && super.disconnectedCallback();
		this._destroyEditor();
	}
	viewReady() { // :void
		super.viewReady && super.viewReady();
		Object.assign(this.rb.elms, {
			clearBtn:    this.shadowRoot.getElementById('clear'),
			copyPopover: this.shadowRoot.getElementById('copy'),
		});
		this._setLabel();
		this._attachEvents();
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			label: props.string,
			value: props.string,
			subtext: props.string,
			placeholder: props.string,
			height: Object.assign({}, props.string, {
				default: 'tall' // TODO: maybe change this
			}),
			kind: Object.assign({}, props.string, { // TODO: maybe
				default: 'default'
			}),
			lineNumbers: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
			}),
			lineWrapping: Object.assign({}, props.boolean, {
				deserialize: Converter.valueless
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
				default: 'default',
				deserialize(val) { // :string
					if (!Type.is.string(val)) return val;
					return val.trim().toLowerCase();
				}
			})
		};
	}

	/* Observer
	 ***********/
	updating(prevProps) { // :void
		if (prevProps.value === this.value) return;
		this.rb.events.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
	}

	/* Helpers
	 **********/
	_clearHostContent() { // :void
		while (this.firstChild)
			this.removeChild(this.firstChild);
	}
	_initValue() { // :void
		if (this.hasAttribute('value')) return;
		this.value = this.innerHTML.trim();
		this._clearHostContent();
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
	_setLabel() { // :void
		if (this.label) return;
		this.label = this._mode.label || '';
	}

	/* Event Management
	 *******************/
	_attachEvents() { // :void
		this.rb.elms.copyPopover.onclick = this._copy.bind(this);
		if (this.rb.elms.clearBtn) this.rb.elms.clearBtn.onclick = this._clear.bind(this);
		this.rb.events.add(this.rb.elms.textarea, 'focus', this._onfocusTextarea);
	}
	_clear(evt) { // :void
		this.editor.setValue('');
		this.editor.focus();
	}
	_copy(evt) { // :void
		const { textarea } = this.rb.elms;
		this._skipFocus = true;
		textarea.select(); // must select first to copy, don't focus()
		textarea.setSelectionRange(0, textarea.textLength); // iOS won't copy without this
		document.execCommand('copy');
		textarea.blur(); // removes selection
		setTimeout(() => this.rb.elms.copyPopover.open = false, 1500);
	}
	_onfocusTextarea(evt) { // :void
		if (this._skipFocus) return this._skipFocus = false;
		this.editor.focus();
	}

	/* Editor Events
	 ****************/
	_attachEditorEvents() { // :void
		Object.assign(this._editorEvents, {
			blur:   this._onblurEditor.bind(this),
			change: this._onchangeEditor.bind(this),
			focus:  this._onfocusEditor.bind(this),
		});
		this.editor.on('blur',   this._editorEvents.blur);
		this.editor.on('change', this._editorEvents.change);
		this.editor.on('focus',  this._editorEvents.focus);
	}
	_destroyEditor() { // :void
		if (!this.editor) return;
		this.editor.off('blur',   this._editorEvents.blur);
		this.editor.off('change', this._editorEvents.change);
		this.editor.off('focus',  this._editorEvents.focus);
		this.editor.toTextArea();
	}
	async _onchangeEditor(editor, change) { // :void
		this.editor.save();
		const oldVal = this.value;
		const newVal = this.rb.elms.textarea.value;
		this.value = newVal;
		if (!this._dirty && newVal !== oldVal)
			return this._dirty = true;
		if (!this._touched) return;
		await this.validate();
	}
	async _onblurEditor(editor, evt) { // :void
		this._active = false;
		if (!this._dirty) return;
		this._touched = true;
		this.value = this.rb.elms.textarea.value;
		await this.validate();
	}
	_onfocusEditor(editor, evt) { // :void
		this._active = true;
	}

	/* Editor
	 *********/
	_initEditor() { // :void
		this.editor = CodeMirror.fromTextArea(this.rb.elms.textarea, {
			indentUnit:      4, // uses 2 spaces without smartIndent
			indentWithTabs:  true,
			lineNumbers:     this.lineNumbers,
			lineWrapping:    this.lineWrapping,
			mode:            this._mode.config,
			readOnly:        this._getReadonly(),
			cursorBlinkRate: this._getCursorBlinkRate(),
			theme:           this.theme,
			viewportMargin:  Infinity, // monitor performance (maybe 50)
			// smartIndent:     true, // default
			// tabSize:         4, // default
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

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
		this._content = this.innerHTML; // store for textarea later
		this._clearContent();
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
			copyPopover: this.shadowRoot.getElementById('copy'),
			eStyles:     this.shadowRoot.getElementById('editor'),
			eTheme:      this.shadowRoot.getElementById('theme'),
			textarea:    this.shadowRoot.querySelector('textarea')
		});
		this._setTextareaValue();
		this._attachEvents();
		this._initEditor();
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			label: props.string,
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

	/* Helpers
	 **********/
	_clearContent() { // :void
		while (this.firstChild)
			this.removeChild(this.firstChild);
	}

	/* Getters and Setters
	 **********************/
	get _content() { // :html<string>
		// console.log('GET CONTENT');
		// console.log(this.__content);
		return this.__content;
	}
	set _content(content='') { // :void
		// console.log('SET CONTENT');
		// console.log(content);
		this.__content = content.trim();
	}
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
	_setTextareaValue() { // :void (hidden textarea)
		this.rb.elms.textarea.value = this._content;
	}
	async _setEditorStyles(theme) { // :void
		const styleElm = this.rb.elms[theme !== 'default' ? 'eTheme' : 'eStyles'];
		// console.log('STYLE ELM:', styleElm);
		if (styleElm.getAttribute('populated') === theme) return;
		styleElm.textContent = await Editor.getTheme(theme);
		styleElm.setAttribute('populated', theme);
	}

	/* Loaders
	 **********/
	async _loadEditor() { // :void
		this._mode = this.mode;
		await Editor.loadDeps();
		await this._setEditorStyles('default');
		if (this.theme !== 'default') await this._setEditorStyles(this.theme);
		await Editor.loadMode(this._mode);
		if (this.placeholder) await Editor.loadAddon('placeholder');
	}

	/* Event Management
	 *******************/
	_attachEvents() { // :void
		this.rb.elms.copyPopover.onclick = this._copy.bind(this);
	}
	_copy(evt) { // :void
		const { textarea } = this.rb.elms;
		textarea.select(); // must select first to copy, don't focus()
		textarea.setSelectionRange(0, textarea.textLength); // iOS won't copy without this
		document.execCommand('copy');
		textarea.blur(); // removes selection
		setTimeout(() => this.rb.elms.copyPopover.open = false, 1500);
	}

	/* Editor Events
	 ****************/
	_attachEditorEvents() { // :void
		this._editorEvents.change = this._onchange.bind(this);
		this.editor.on('change', this._editorEvents.change);
	}
	_onchange(editor, change) { // :void (updates hidden textarea)
		// console.log('EDITOR:', this.editor);
		// console.log('CHANGE:', change);
		// console.log('TEXTAREA VALUE:');
		// console.log(this.rb.elms.textarea.value);
		this.editor.save();
	}

	/* Editor
	 *********/
	async _initEditor() { // :void
		await this._loadEditor();
		this._setLabel();
		if (!this.rb.elms.textarea) return; // JIC

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

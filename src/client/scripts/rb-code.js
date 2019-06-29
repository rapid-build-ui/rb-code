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
		this._editorEvents = {};
		this.rb.formControl.isTextarea = true;
	}
	connectedCallback() { // :void
		super.connectedCallback && super.connectedCallback();
		this._mode = this.mode;
		this._setLabel();
		this._shiftShockFix();
		setTimeout(() => {
			this._initValue();
			this._clearHostContent();
			const textarea = this.shadowRoot.querySelector('textarea');
			this.rb.elms.textarea = textarea;
			Object.assign(this.rb.formControl, {
				elm:      textarea,
				focusElm: textarea
			});
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
			titlebar:    this.shadowRoot.querySelector('.label'),
			label:       this.shadowRoot.querySelector('label')
		});
		this._attachEvents();
	}

	/* Properties
	 *************/
	static get props() { // :object
		return {
			...super.props,
			rows: props.number,
			label: props.string,
			subtext: props.string,
			placeholder: props.string,
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
			actions: Object.assign({}, props.array, {
				deserialize(val) { // :string[]
					if (!Type.is.string(val)) return [];
					if (!/^\[[^]*\]$/.test(val)) return [];
					val = JSON.parse(val);
					val.sort().reverse(); // desc order [copy, clear] (works for now)
					val = val.map(str => str.trim().toLowerCase());
					return val;
				}
			}),
			theme: Object.assign({}, props.string, {
				default: 'default',
				deserialize(val) { // :string
					if (!Type.is.string(val)) return val;
					return val.trim().toLowerCase();
				}
			}),
			value: Object.assign({}, props.string, {
				coerce(val) {
					// prevents returning string 'null' and 'undefined'
					if (Type.is.null(val)) return val;
					if (Type.is.undefined(val)) return val;
					return String(val);
				}
			}),
			_editorReady: props.boolean
		};
	}

	/* Helpers
	 **********/
	_clearHostContent() { // :void
		while (this.firstChild)
			this.removeChild(this.firstChild);
	}
	_initValue() { // :void
		if (this.hasAttribute('value')) return;
		const xmp    = this.firstElementChild;
		const hasXmp = !!xmp && xmp.localName === 'xmp';
		if (!hasXmp) return;
		let value = xmp.textContent;
			value = this._getFormattedValue(value);
		this.value = value;
	}

	/* Shift Shock Fix
	 ******************/
	_shiftShockFix() { // :void (runs in connectedCallback - fixes vertical shift shock if rows option is set)
		const getTitlebarHeight = () => { // :float | null (becomes px unit)
			const hasTitleBar = !!this.label.trim() || !!this.actions.length;
			if (!hasTitleBar) return null;
			return this.theme === 'rapid' ? 22.5 : 31.5; // hard coded, titlebar isn't available in time
		}
		const getEditorFontSize = () => { // :float
			return this.theme === 'rapid' ? 16 : 11.5; // if changed must also change in fonts.scss and rapid-theme.scss
		}
		const setHostMinHeight = () => { // :void
			let height = 0;
			const eHeight = this._getEditorHeight();
			const tHeight = getTitlebarHeight();
			if (!eHeight && !tHeight) return;
			const eFontSize = getEditorFontSize();
			if (!!eHeight) height += eHeight * eFontSize; // em to px (ex: 11.349em * 11.5px);
			if (!!tHeight) height += tHeight;
			height = Math.floor(height); // round down convert to int
			if (this.theme === 'rapid') height += 3; // focus bar
			height = `${height}px` // ex: 162px
			this.style.minHeight = height; // this is host elm
		}
		setHostMinHeight();
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
	_getFormattedValue(value) { // :string | any
		const has = {
			newLines(text) { // :boolean
				const index = text.indexOf('\n');
				return index !== -1;
			},
			tabs(text) { // :boolean
				const index = text.indexOf('\t');
				return index !== -1;
			}
		};
		const get = {
			firstCharIndex(text) { // :int
				return text.search(/\S/);
			},
			firstLineTabsCnt(text) { // :int
				const index      = this.firstCharIndex(text);
				const whitespace = text.substring(0, index);
				const tabs       = whitespace.match(/\t/g);
				if (!tabs) return 0;
				return tabs.length;
			},
			formattedText(text) { // :string
				const tabsCnt = this.firstLineTabsCnt(text);
				const re = new RegExp(`\n\t{${tabsCnt}}`,'g');
				text = text.trim().replace(re,'\n');
				return text;
			},
			text(text) { // :string | any
				if (!Type.is.string(text)) return text;
				text = text.trimRight();
				if (!has.newLines(text) && !has.tabs(text)) return text;
				return this.formattedText(text);
			}
		}
		return get.text(value);
	}
	_getReadonly() { // :boolean | string
		// if mobile then 'nocursor' (prevents keyboard from popping up)
		return this.readonly ? IS_MOBILE ? 'nocursor' : true : false;
	}
	_getEditorTheme() { // string
		if (this.theme !== 'rapid') return this.theme;
		return 'default';
	}
	_getEditorHeight() { // :float | null (becomes em unit)
		if (!this.rows) return null;
		if (this.rows <= 1) return null;
		let height = this.theme === 'rapid' ? 1.47 : 1.91;
		height = this.rows * height;
		return height;
	}
	_setEditorHeight() { // :void (if rows option is set)
		let height = this._getEditorHeight();
		if (!height) return;
		height = `${height}em`; // ex: 11.349em
		this.shadowRoot.querySelector('.CodeMirror-scroll').style.minHeight = height;
		if (!this.scrollable) return;
		this.shadowRoot.querySelector('.CodeMirror').style.height = height;
	}
	_setLabel() { // :void
		if (this.label) return; // custom label
		if (!this.label.trim() && this.hasAttribute('label')) return; // blank label
		this.label = this._mode.label || '';
	}

	/* Event Management
	 *******************/
	_attachEvents() { // :void
		const { clearBtn, copyPopover, label, textarea } = this.rb.elms;
		if (clearBtn) clearBtn.onclick = this._clear.bind(this);
		if (copyPopover) copyPopover.onclick = this._copy.bind(this);
		this.rb.events.add(textarea, 'focus', this._onfocusTextarea);
		if (!label) return;
		this.rb.events.add(label, 'click',      this._onLabelEvent);
		this.rb.events.add(label, 'mouseenter', this._onLabelEvent);
		this.rb.events.add(label, 'mouseleave', this._onLabelEvent);
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
	_onLabelEvent(evt) { // :void
		switch (evt.type) {
			case 'click':
				this._onfocusTextarea(evt);
				break;
			case 'mouseenter':
				this.rb.elms.titlebar.classList.add('hover');
				break;
			case 'mouseleave':
				this.rb.elms.titlebar.classList.remove('hover');
				break;
		}
	}

	/* Observer
	 ***********/
	updating(prevProps) { // :void
		if (prevProps.value === this.value) return;
		this.rb.events.emit(this, 'value-changed', {
			detail: { value: this.value }
		});
		// when manually setting rb-code elm value
		if (!this.editor) return;
		if (this.value === this.editor.getValue()) return;
		this.editor.setValue(this.value);
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
		if (change.origin.toLowerCase() === 'setvalue') return; // called from updating()
		// console.log('EDITOR CHANGED');
		this.editor.save(); // updates textarea
		const oldVal     = this.value;
		const newVal     = this.rb.elms.textarea.value;
		const hasChanged = newVal !== oldVal;
		this.value = newVal;
		if (!this._dirty && hasChanged) return this._dirty = true;
		if (!this._touched) return;
		await this.validate();
	}
	async _onblurEditor(editor, evt) { // :void
		this._active = false;
		if (!this._dirty) return;
		this._touched = true;
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
			theme:           this._getEditorTheme(),
			viewportMargin:  Infinity, // monitor performance (maybe 50)
			tabindex:        this.disabled ? -1 : 1,
			// smartIndent:     true, // default
			// tabSize:         4, // default
		});
		this._setEditorHeight();
		this._attachEditorEvents();
		this._editorReady = true;
		// this.rb.elms.label.focus();
		// this.state.editor.ready = true;
		// console.log(this.state.editor.ready);
		// this.triggerUpdate();
		// const hScroll = this.shadowRoot.querySelector('.CodeMirror-hscrollbar');
		// this.rb.events.add(hScroll, 'scroll', evt => {
		// 	console.log(evt);
		// });
		// console.log(this.editor);
		// console.log(CodeMirror.modes);
		// console.log(CodeMirror.defaults);
		// console.log(CodeMirror.defaults.cursorBlinkRate);
		// console.log(this.editor.options.mode);
		// console.log(this.editor.getOption('readOnly'));
		// console.log(this.editor.getOption('cursorBlinkRate'));
		// this.editor.execCommand('selectAll');
		// this.editor.indentSelection('smart');
	}

	/* Template
	 ***********/
	render({ props }) { // :string
		return html template;
	}
}

customElements.define('rb-code', RbCode);

/****************
 * EDITOR LOADER
 ****************/
import Type   from '../../rb-base/scripts/public/services/type.js';
import Modes  from './modes.js';
import Paths  from './paths.js';
import Themes from './themes.js';

/* Style Cache
 **************/
const StyleCache = {};

/* Helpers
 **********/
const Help = {
	exeJS(js) { // :void
		new Function(js).call(window); // similar to but safer eval()
		// console.log('execute js');
	},
	async fetch(path, baseUrl = Paths.rbCode) { // :string
		const url      = new URL(path, baseUrl);
		const response = await fetch(url);
		const string   = await response.text(); // :string
		// console.log('fetch file');
		return string;
	},
	async fetchAndExecute(path) { // :void
		const js = await this.fetch(path);
		// console.log('fetch and execute');
		this.exeJS(js);
	},
	async loadModeDeps(deps) { // :void (synchronously)
		for (const dep of deps) await this.loadMode(Modes[dep].load);
	},
	async loadMode(mode) { // :void (load mode deps, recursion if deps have deps)
		const { deps, name, path } = mode;
		const _name = name === 'text' ? 'null' : name; // codemirror's default mode name is 'null'
		// CodeMirror.modes[_name]
		// 	? console.log('cached mode:', name)
		// 	: console.log('requested mode:', name);
		if (CodeMirror.modes[_name]) return; // already loaded
		if (Type.is.array(deps)) await Help.loadModeDeps(deps);
		if (!path) return;
		await Help.fetchAndExecute(path);
	},
	async loadStyles(styleElm, theme) { // :void (populates style elms in view)
		// StyleCache[theme]
		// 	? console.log('cached theme:', theme)
		// 	: console.log('requested theme:', theme);
		if (StyleCache[theme]) {
			styleElm.textContent = StyleCache[theme];
		} else {
			const css = await this.fetch(Themes[theme]);
			StyleCache[theme]    = css;
			styleElm.textContent = css;
		}
		styleElm.setAttribute('populated', theme);
	}
};

/* Public
 *********/
const Editor = {
	async loadPrereqs(styleElm) { // :void
		if (!window.CodeMirror)
			await Help.fetchAndExecute(`${Paths.editor.lib}/codemirror.js`);
		if (!styleElm.hasAttribute('populated'))
			await Help.loadStyles(styleElm, 'codemirror');
	},
	async loadMode(mode) { // :void
		await Help.loadMode(mode.load);
	},
	async loadTheme(styleElm, theme) { // :void
		theme = theme.toLowerCase();
		if (styleElm.getAttribute('populated') === theme) return;
		styleElm.textContent = null;   // clear existing styles
		if (theme === 'codemirror') return; // already loaded in loadPrereqs()
		await Help.loadStyles(styleElm, theme);
	}
};

/* Export it!
 *************/
export default Editor;
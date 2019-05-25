/****************
 * EDITOR LOADER
 ****************/
import Type   from '../../rb-base/scripts/public/services/type.js';
import Modes  from './modes.js';
import Paths  from './paths.js';
import Themes from './themes.js';

/* Helpers
 **********/
const Help = {
	exeJS(js) { // :void
		new Function(js).call(window); // similar to but safer eval()
		// console.log('execute js');
	},
	async fetch(_path, baseUrl = Paths.rbCode) { // :string
		const url      = new URL(_path, baseUrl);
		const response = await fetch(url);
		const string   = await response.text(); // :string
		// console.log('fetch file');
		return string;
	},
	async fetchAndExecute(_path) { // :void
		const js = await this.fetch(_path);
		// console.log('fetch and execute');
		this.exeJS(js);
	},
	async loadModeDeps(deps) { // :void (synchronously)
		for (const dep of deps)
			await this.loadMode(Modes[dep].mode);
	},
	async loadMode(mode) { // :void (recursive if deps have deps)
		if (window.CodeMirror.modes[mode.name]) return; // already loaded (only load once)
		const { deps, path: _path } = mode;
		if (Type.is.array(deps)) await Help.loadModeDeps(deps);
		if (!_path) return;
		await Help.fetchAndExecute(`${Paths.editor.modes}/${_path}`);
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

/* Style Cache
 **************/
const StyleCache = {};

/* Public
 *********/
const Editor = {
	async loadPrereqs(styleElm) { // :void
		if (!window.CodeMirror)
			await Help.fetchAndExecute(`${Paths.editor.lib}/codemirror.js`);
		if (!styleElm.hasAttribute('populated'))
			await Help.loadStyles(styleElm, 'codemirror');
	},
	async loadMode(mode) { // :void (load mode deps then mode)
		await Help.loadMode(mode.mode);
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
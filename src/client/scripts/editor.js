/****************
 * EDITOR LOADER
 ****************/
import Type   from '../../rb-base/scripts/public/services/type.js';
import Addons from './addons.js';
import Modes  from './modes.js';
import Paths  from './paths.js';
import Themes from './themes.js';

/* Cache
 ********/
const CACHE = {
	addons: {}, // { name: boolean }
	themes: {}  // { name: css<string> }
};

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
	}
};

/* Loaders
 **********/
const Load = {
	async addon(addon) { // :void
		addon = addon.toLowerCase();
		const path = Addons[addon];
		if (!path) return;
		// CACHE.addons[addon]
		// 	? console.log('cached addon:', addon)
		// 	: console.log('requested addon:', addon);
		if (CACHE.addons[addon]) return;
		await Help.fetchAndExecute(path);
		CACHE.addons[addon] = true;
	},
	async mode(mode) { // :void (load mode deps, recursion if deps have deps)
		const { deps, name, path } = mode;
		const _name = name === 'text' ? 'null' : name; // codemirror's default mode name is 'null'
		// CodeMirror.modes[_name]
		// 	? console.log('cached mode:', name)
		// 	: console.log('requested mode:', name);
		if (CodeMirror.modes[_name]) return; // already loaded
		if (Type.is.array(deps)) await Load.modeDeps(deps);
		if (!path) return;
		await Help.fetchAndExecute(path);
	},
	async modeDeps(deps) { // :void (synchronously)
		for (const dep of deps) await Load.mode(Modes[dep].load);
	},
	async theme(styleElm, theme, isTheme = false) { // :void (populates style elms in view)
		theme = theme.toLowerCase();
		if (styleElm.getAttribute('populated') === theme) return;
		if (isTheme && theme === 'codemirror') // already loaded in loadPrereqs()
			return styleElm.textContent = null; // clear existing styles
		// CACHE.themes[theme]
		// 	? console.log('cached theme:', theme)
		// 	: console.log('requested theme:', theme);
		if (CACHE.themes[theme]) {
			styleElm.textContent = CACHE.themes[theme];
		} else {
			const css = await Help.fetch(Themes[theme]);
			CACHE.themes[theme]  = css;
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
			await Load.theme(styleElm, 'codemirror');
	},
	async loadAddon(addon) { // :void
		await Load.addon(addon);
	},
	async loadMode(mode) { // :void
		await Load.mode(mode.load);
	},
	async loadTheme(styleElm, theme) { // :void
		await Load.theme(styleElm, theme, true);
	}
};

/* Export it!
 *************/
export default Editor;
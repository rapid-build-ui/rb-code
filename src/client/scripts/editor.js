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
	modes:  {}, // { name: boolean }
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
		// CACHE.modes[name]
		// 	? console.log('cached mode:', name)
		// 	: console.log('requested mode:', name);
		if (CACHE.modes[name]) return;
		if (Type.is.array(deps)) await Load.modeDeps(deps);
		if (!path) return CACHE.modes[name] = true; // codemirror's default mode which is 'null'
		await Help.fetchAndExecute(path);
		CACHE.modes[name] = true;
	},
	async modeDeps(deps) { // :void (synchronously)
		for (const dep of deps) await Load.mode(Modes[dep].load);
	},
	async theme(theme) { // :css<string>
		theme = theme.toLowerCase();
		const styles = CACHE.themes[theme];
		// styles
		// 	? console.log('cached theme:', theme)
		// 	: console.log('requested theme:', theme);
		if (styles) return styles;
		const css = await Help.fetch(Themes[theme]);
		CACHE.themes[theme] = css;
		return css;
	}
};

/* Public
 *********/
const Editor = {
	async loadDeps() { // :void
		if (!window.CodeMirror) await Help.fetchAndExecute(`${Paths.editor.lib}/codemirror.js`);
		await Load.theme('default');
	},
	async loadAddon(addon) { // :void
		await Load.addon(addon);
	},
	async loadMode(mode) { // :void
		await Load.mode(mode.load);
	},
	async getTheme(theme) { // :css<string>
		return await Load.theme(theme);
	}
};

/* Export it!
 *************/
export default Editor;
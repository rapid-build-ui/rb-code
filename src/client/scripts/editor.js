/****************
 * EDITOR LOADER
 ****************/
import Type  from '../../rb-base/scripts/public/services/type.js';
import Modes from './modes.js';

// Private
const ePath = '../../../codemirror'; // relative to this file
const ePaths = {
	editor:  ePath,
	baseUrl: import.meta.url,
	addons:  `${ePath}/addon`,
	lib:     `${ePath}/lib`,
	modes:   `${ePath}/mode`
}
const Help = {
	exeJS(js) { // :void
		new Function(js).call(window); // similar to eval()
		// console.log('execute js');
	},
	async fetch(_path) { // :js<string>
		const url      = new URL(_path, ePaths.baseUrl);
		const response = await fetch(url);
		const js       = await response.text(); // :string
		// console.log('fetch file');
		return js;
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
		await Help.fetchAndExecute(`${ePaths.modes}/${_path}`);
	}
}

/* Public
 *********/
const Editor = {
	async load() { // :void
		if (window.CodeMirror) return;
		await Help.fetchAndExecute(`${ePaths.lib}/codemirror.js`);
	},
	async loadMode(mode) { // :void (load mode deps then mode)
		await Help.loadMode(mode.mode);
	}
}

/* Export it!
 *************/
export default Editor;
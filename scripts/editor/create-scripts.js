/************************
 * CREATE EDITOR SCRIPTS
 ************************/
const UglifyJS       = require('uglify-es');
const Help           = require('./helpers');
const Paths          = require('./paths');
const INCLUDE_ADDONS = require('./include/addons');
const INCLUDE_MODES  = require('./include/modes');

/* Helpers
 **********/
const Helper = {
	async _minify(_path) { // // :Promise<void>
		const js     = await Help.getFileContents(_path);
		const result = UglifyJS.minify(js, {}); // runs synchronously
		if (result.error) {
			const ePath = _path.replace(Paths.project.path,'');
			const eMsg  = `JS MINIFY ERROR:\n${ePath}\n${result.error}`
			console.error(eMsg.error);
			process.exit();
		}
		return Help.writeFile(_path, result.code);
	},
	async createLib() { // :Promise<void>
		let js = await Help.getFileContents(`${Paths.editor.lib}/codemirror.js`);
		js = js.replace('}(this', '}(this || window'); // first param of the UMD
		return Help.writeFile(`${Paths.dist.scripts}/lib.js`, js);
	},
	async createAddons() { // :Promise<void>
		let js = '';
		const paths = [];
		for (const [addon, file] of Object.entries(INCLUDE_ADDONS)) {
			if (typeof file === 'string') {
				if (!Help.isFileType(file,'js')) continue;
				paths.push(`${Paths.editor.addons}/${file}`);
				continue;
			}
			if (!Array.isArray(file)) continue;
			for (const _file of file) {
				if (!Help.isFileType(_file,'js')) continue;
				paths.push(`${Paths.editor.addons}/${_file}`);
			}
		}
		for (const _path of paths) // populate js string
			js += await Help.getFileContents(_path);
		return Help.writeFile(`${Paths.dist.scripts}/addons.js`, js);
	},
	async createModes() { // :Promise<void>
		let js = '';
		const paths = [];
		for (const file of INCLUDE_MODES)
			paths.push(`${Paths.editor.modes}/${file}/${file}.js`);
		for (const _path of paths)
			js += await Help.getFileContents(_path);
		return Help.writeFile(`${Paths.dist.scripts}/modes.js`, js);
	},
	minifyFiles() { // :Promise<void>
		return Promise.all([
			Helper._minify(`${Paths.dist.scripts}/lib.js`),
			Helper._minify(`${Paths.dist.scripts}/modes.js`),
			Helper._minify(`${Paths.dist.scripts}/addons.js`)
		]);
	},
	async concatFiles() { // :Promise<void>
		let js = '';
		const paths = [
			`${Paths.dist.scripts}/lib.js`,
			`${Paths.dist.scripts}/modes.js`,
			`${Paths.dist.scripts}/addons.js`
		]
		for (const _path of paths)
			js += await Help.getFileContents(_path);
		return Help.writeFile(`${Paths.dist.script}`, js);
	},
	cleanup() { // :Promise<void>
		return Promise.all([
			Help.remove(`${Paths.dist.scripts}/lib.js`),
			Help.remove(`${Paths.dist.scripts}/modes.js`),
			Help.remove(`${Paths.dist.scripts}/addons.js`)
		]);
	},
	async copyToDest() { // :Promise<void>
		await Help.remove(Paths.client.script);
		return Help.copy(Paths.dist.script, Paths.client.script);
	}
}

/* Create Scripts
 *****************/
const init = async () => { // :void
	await Promise.all([
		Helper.createLib(),
		Helper.createModes(),
		Helper.createAddons()
	]);
	await Helper.minifyFiles();
	await Helper.concatFiles();
	await Helper.cleanup();
	await Helper.copyToDest();

	console.log(`
		EDITOR SCRIPT CREATED!
		${Paths.client.script.replace(Paths.project.path,'')}
	`.replace(/\t/g,'').trim().minor);
}

/* Export it!
 *************/
module.exports = init;
/***********************
 * CREATE EDITOR STYLES
 ***********************/
const CleanCSS       = require('clean-css');
const Help           = require('./helpers');
const Paths          = require('./paths');
const INCLUDE_THEMES = require('./include/themes');

/* Helpers
 **********/
const Helper = {
	async _minify(_path) { // // :Promise<void>
		const css    = await Help.getFileContents(_path);
		const result = await new CleanCSS({ returnPromise: true }).minify(css);
		const errors = [...result.errors, ...result.warnings];
		if (errors.length) {
			const ePath = _path.replace(Paths.project.path,'');
			const eMsg  = `CSS MINIFY ERROR:\n${ePath}\n${errors.join(' ')}`
			console.error(eMsg.error);
			process.exit();
		}
		return Help.writeFile(_path, result.styles);
	},
	async createLib() { // :Promise<void>
		let css = await Help.getFileContents(`${Paths.editor.lib}/codemirror.css`);
		return Help.writeFile(`${Paths.dist.styles}/lib.css`, css);
	},
	async createThemes() { // :Promise<void>
		let css = '';
		const paths = [Paths.oneDark.theme];
		for (const file of INCLUDE_THEMES)
			paths.push(`${Paths.editor.themes}/${file}.css`);
		for (const _path of paths)
			css += await Help.getFileContents(_path);
		return Help.writeFile(`${Paths.dist.styles}/themes.css`, css);
	},
	minifyFiles() { // :Promise<void>
		return Promise.all([
			Helper._minify(`${Paths.dist.styles}/lib.css`,),
			Helper._minify(`${Paths.dist.styles}/themes.css`)
		]);
	},
	async concatFiles() { // :Promise<void>
		let css = '';
		const paths = [
			`${Paths.dist.styles}/lib.css`,
			`${Paths.dist.styles}/themes.css`
		]
		for (const _path of paths)
			css += await Help.getFileContents(_path);
		return Help.writeFile(`${Paths.dist.style}`, css);
	},
	cleanup() { // :Promise<void>
		return Promise.all([
			Help.remove(`${Paths.dist.styles}/lib.css`),
			Help.remove(`${Paths.dist.styles}/themes.css`)
		]);
	},
	async copyToDest() { // :Promise<void>
		await Help.remove(Paths.client.style);
		return Help.copy(Paths.dist.style, Paths.client.style);
	}
}

/* Create Styles
 ****************/
const init = async () => { // :void
	await Promise.all([
		Helper.createLib(),
		Helper.createThemes()
	]);
	await Helper.minifyFiles();
	await Helper.concatFiles();
	await Helper.cleanup();
	await Helper.copyToDest();

	console.log(`
		EDITOR STYLES CREATED!
		${Paths.client.style.replace(Paths.project.path,'')}
	`.replace(/\t/g,'').trim().minor);
}

/* Export it!
 *************/
module.exports = init;
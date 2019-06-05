/*****************
 * EDITOR HELPERS
 *****************/
const fs         = require('fs');
const fse        = require('fs-extra');
const fsPromises = fs.promises;

/* Helpers
 **********/
const Helpers = {
	copy(src, dest) { // :Promise<void>
		return fse.copy(src, dest);
	},
	async getFileContents(_path) { // :fileContents<string>
		const file = await fsPromises.readFile(_path); // :Buffer
		return file.toString();
	},
	mkdir(_path) { // :Promise<void>
		return fsPromises.mkdir(_path, { recursive: true });
	},
	remove(_path) { // :Promise<void>
		return fse.remove(_path);
	},
	writeFile(_path, data) { // :Promise<void>
		return fsPromises.writeFile(_path, data);
	}
}

/* Export it!
 *************/
module.exports = Helpers;
/**************
 * EDITOR DIST
 **************/
const Help  = require('./helpers');
const Paths = require('./paths');

/* Create Dist
 **************/
const init = async () => { // :void
	await Help.remove(Paths.dist.path);
	await Promise.all([
		Help.mkdir(Paths.dist.scripts),
		Help.mkdir(Paths.dist.styles)
	]);

	console.log(`
		EDITOR DIST CREATED!
		${Paths.dist.path.replace(Paths.project.path,'')}
	`.replace(/\t/g,'').trim().minor);
}

/* Export it!
 *************/
module.exports = init;
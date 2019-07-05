/**********************
 * CREATE EDITOR FILES
 **********************/
require('./bootstrap');
const createDist    = require('./create-dist');
const createScripts = require('./create-scripts');
const createStyles  = require('./create-styles');

/* INIT
 *******/
const init = async () => { // :void
	console.log(`
		-------------------
		CREATE EDITOR FILES
		-------------------
	`.replace(/\t/g,'').trim().attn);

	await createDist();
	await Promise.all([
		createScripts(),
		createStyles()
	]);

	console.log(`
		---------------------
		EDITOR FILES CREATED!
	`.replace(/\t/g,'').trimStart().attn);
}


/* Work It!
 ***********/
init();


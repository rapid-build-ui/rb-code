/********************
 * CODEMIRROR ADDONS
 ********************/
import Paths from './paths.js';

/* Addons
 *********/
const Addons = {
	placeholder: 'display/placeholder.js'
};

/* Populate
 ***********/
(() => {
	for (const [addon, path] of Object.entries(Addons))
		Addons[addon] = `${Paths.editor.addons}/${path}`;
})();

/* Export it!
 *************/
export default Addons;
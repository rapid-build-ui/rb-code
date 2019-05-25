/***********************************************
 * CODEMIRROR MODES/LANGUAGES
 * --------------------------------------------
 * root keys = id
 * title  = component caption
 * config = editor instance mode option
 * load   = loading info (dynamically add path
 *			based on load.name, ex: css/css.js)
 ***********************************************/
import Paths from './paths.js';

/* Modes
 ********/
const Modes = {
	css: {
		title: 'css',
		config: { name: 'css' },
		load: { name: 'css' }
	},
	html: {
		title: 'html',
		config: { name: 'htmlmixed' },
		load: {
			name: 'htmlmixed',
			deps: ['xml','js','css']
		}
	},
	js: {
		title: 'js',
		config: { name: 'javascript' },
		load: { name: 'javascript' }
	},
	json: {
		title: 'json',
		config: {
			name: 'javascript',
			json: true
		},
		load: { name: 'javascript' }
	},
	less: {
		title: 'less',
		config: { name: 'text/x-less' },
		load: { name: 'css' }
	},
	scss: {
		title: 'scss',
		config: { name: 'text/x-scss' },
		load: { name: 'css' }
	},
	shell: {
		title: 'shell',
		config: { name: 'shell' },
		load: { name: 'shell' }
	},
	text: {
		title: 'text',
		config: { name: 'text/plain' },
		load: { name: 'text' }
	},
	xml: {
		title: 'xml',
		config: { name: 'xml' },
		load: { name: 'xml' }
	}
};

/* Populate Load Path
 *********************/
(() => {
	for (const [id, mode] of Object.entries(Modes)) {
		if (id === 'text') continue; // codemirror's default mode (nothing to load)
		const { name } = mode.load;
		mode.load.path = `${Paths.editor.modes}/${name}/${name}.js`;
	}
})();

/* Export it!
 *************/
export default Modes;
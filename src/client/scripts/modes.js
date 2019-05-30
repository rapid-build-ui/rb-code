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
	c: {
		title: 'c',
		config: { name: 'text/x-csrc' },
		load: { name: 'clike' }
	},
	'c++': {
		title: 'c++',
		config: { name: 'text/x-c++src' },
		load: { name: 'clike' }
	},
	'c#': {
		title: 'c#',
		config: { name: 'text/x-csharp' },
		load: { name: 'clike' }
	},
	coffeescript: {
		title: 'coffee',
		config: { name: 'coffeescript' },
		load: { name: 'coffeescript' }
	},
	cson: {
		title: 'cson',
		config: { name: 'coffeescript' },
		load: { name: 'coffeescript' }
	},
	css: {
		title: 'css',
		config: { name: 'css' },
		load: { name: 'css' }
	},
	css: {
		title: 'css',
		config: { name: 'css' },
		load: { name: 'css' }
	},
	elm: {
		title: 'elm',
		config: { name: 'elm' },
		load: { name: 'elm' }
	},
	erlang: {
		title: 'erlang',
		config: { name: 'erlang' },
		load: { name: 'erlang' }
	},
	erlang: {
		title: 'erlang',
		config: { name: 'erlang' },
		load: { name: 'erlang' }
	},
	'f#': {
		title: 'f#',
		config: { name: 'text/x-fsharp' },
		load: { name: 'mllike' }
	},
	haml: {
		title: 'haml',
		config: { name: 'haml' },
		load: { name: 'haml', deps: ['html','ruby'] }
	},
	html: {
		title: 'html',
		config: { name: 'htmlmixed' },
		load: { name: 'htmlmixed', deps: ['xml','js','css'] }
	},
	java: {
		title: 'java',
		config: { name: 'text/x-java' },
		load: { name: 'clike' }
	},
	js: {
		title: 'js',
		config: { name: 'javascript' },
		load: { name: 'javascript' }
	},
	json: {
		title: 'json',
		config: { name: 'javascript', json: true },
		load: { name: 'javascript' }
	},
	jsx: {
		title: 'jsx',
		config: { name: 'jsx' },
		load: { name: 'jsx', deps: ['xml','js'] }
	},
	less: {
		title: 'less',
		config: { name: 'text/x-less' },
		load: { name: 'css' }
	},
	markdown: {
		title: 'markdown',
		config: { name: 'markdown' },
		load: { name: 'markdown', deps: ['xml'] }
	},
	'objective-c': {
		title: 'objective-c',
		config: { name: 'text/x-objectivec' },
		load: { name: 'clike' }
	},
	ocaml: {
		title: 'ocaml',
		config: { name: 'text/x-ocaml' },
		load: { name: 'mllike' }
	},
	perl: {
		title: 'perl',
		config: { name: 'perl' },
		load: { name: 'perl' }
	},
	php: {
		title: 'php',
		config: { name: 'php' },
		load: { name: 'php', deps: ['html','c'] }
	},
	powershell: {
		title: 'powershell',
		config: { name: 'powershell' },
		load: { name: 'powershell' }
	},
	properties: {
		title: 'properties',
		config: { name: 'properties' },
		load: { name: 'properties' }
	},
	python: {
		title: 'python',
		config: { name: 'python' },
		load: { name: 'python' }
	},
	ruby: {
		title: 'ruby',
		config: { name: 'ruby' },
		load: { name: 'ruby' }
	},
	sass: {
		title: 'sass',
		config: { name: 'sass' },
		load: { name: 'sass', deps: ['css'] }
	},
	scala: {
		title: 'scala',
		config: { name: 'text/x-scala' },
		load: { name: 'clike' }
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
	spreadsheet: {
		title: 'spreadsheet',
		config: { name: 'spreadsheet' },
		load: { name: 'spreadsheet' }
	},
	sql: {
		title: 'sql',
		config: { name: 'sql' },
		load: { name: 'sql' }
	},
	stylus: {
		title: 'stylus',
		config: { name: 'stylus' },
		load: { name: 'stylus' }
	},
	swift: {
		title: 'swift',
		config: { name: 'swift' },
		load: { name: 'swift' }
	},
	text: {
		title: 'text',
		config: { name: 'text/plain' },
		load: { name: 'text' }
	},
	typescript: {
		title: 'typescript',
		config: { name: 'text/typescript' },
		load: { name: 'javascript' }
	},
	xml: {
		title: 'xml',
		config: { name: 'xml' },
		load: { name: 'xml' }
	},
	xquery: {
		title: 'xquery',
		config: { name: 'xquery' },
		load: { name: 'xquery' }
	},
	yaml: {
		title: 'yaml',
		config: { name: 'yaml' },
		load: { name: 'yaml' }
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
/***********************************************
 * CODEMIRROR MODES/LANGUAGES
 * --------------------------------------------
 * root keys = id
 * label  = component label
 * config = editor instance mode option
 * load   = loading info (dynamically add path
 *			based on load.name, ex: css/css.js)
 ***********************************************/
import Paths from './paths.js';

/* Modes
 ********/
const Modes = {
	c: {
		label: 'c',
		config: { name: 'text/x-csrc' },
		load: { name: 'clike' }
	},
	'c++': {
		label: 'c++',
		config: { name: 'text/x-c++src' },
		load: { name: 'clike' }
	},
	'c#': {
		label: 'c#',
		config: { name: 'text/x-csharp' },
		load: { name: 'clike' }
	},
	coffeescript: {
		label: 'coffee',
		config: { name: 'coffeescript' },
		load: { name: 'coffeescript' }
	},
	cson: {
		label: 'cson',
		config: { name: 'coffeescript' },
		load: { name: 'coffeescript' }
	},
	css: {
		label: 'css',
		config: { name: 'css' },
		load: { name: 'css' }
	},
	css: {
		label: 'css',
		config: { name: 'css' },
		load: { name: 'css' }
	},
	elm: {
		label: 'elm',
		config: { name: 'elm' },
		load: { name: 'elm' }
	},
	erlang: {
		label: 'erlang',
		config: { name: 'erlang' },
		load: { name: 'erlang' }
	},
	erlang: {
		label: 'erlang',
		config: { name: 'erlang' },
		load: { name: 'erlang' }
	},
	'f#': {
		label: 'f#',
		config: { name: 'text/x-fsharp' },
		load: { name: 'mllike' }
	},
	haml: {
		label: 'haml',
		config: { name: 'haml' },
		load: { name: 'haml', deps: ['html','ruby'] }
	},
	html: {
		label: 'html',
		config: { name: 'htmlmixed' },
		load: { name: 'htmlmixed', deps: ['xml','js','css'] }
	},
	java: {
		label: 'java',
		config: { name: 'text/x-java' },
		load: { name: 'clike' }
	},
	js: {
		label: 'js',
		config: { name: 'javascript' },
		load: { name: 'javascript' }
	},
	json: {
		label: 'json',
		config: { name: 'javascript', json: true },
		load: { name: 'javascript' }
	},
	jsx: {
		label: 'jsx',
		config: { name: 'jsx' },
		load: { name: 'jsx', deps: ['xml','js'] }
	},
	less: {
		label: 'less',
		config: { name: 'text/x-less' },
		load: { name: 'css' }
	},
	markdown: {
		label: 'markdown',
		config: { name: 'markdown' },
		load: { name: 'markdown', deps: ['xml'] }
	},
	'objective-c': {
		label: 'objective-c',
		config: { name: 'text/x-objectivec' },
		load: { name: 'clike' }
	},
	ocaml: {
		label: 'ocaml',
		config: { name: 'text/x-ocaml' },
		load: { name: 'mllike' }
	},
	perl: {
		label: 'perl',
		config: { name: 'perl' },
		load: { name: 'perl' }
	},
	php: {
		label: 'php',
		config: { name: 'php' },
		load: { name: 'php', deps: ['html','c'] }
	},
	powershell: {
		label: 'powershell',
		config: { name: 'powershell' },
		load: { name: 'powershell' }
	},
	properties: {
		label: 'properties',
		config: { name: 'properties' },
		load: { name: 'properties' }
	},
	python: {
		label: 'python',
		config: { name: 'python' },
		load: { name: 'python' }
	},
	ruby: {
		label: 'ruby',
		config: { name: 'ruby' },
		load: { name: 'ruby' }
	},
	sass: {
		label: 'sass',
		config: { name: 'sass' },
		load: { name: 'sass', deps: ['css'] }
	},
	scala: {
		label: 'scala',
		config: { name: 'text/x-scala' },
		load: { name: 'clike' }
	},
	scss: {
		label: 'scss',
		config: { name: 'text/x-scss' },
		load: { name: 'css' }
	},
	shell: {
		label: 'shell',
		config: { name: 'shell' },
		load: { name: 'shell' }
	},
	spreadsheet: {
		label: 'spreadsheet',
		config: { name: 'spreadsheet' },
		load: { name: 'spreadsheet' }
	},
	sql: {
		label: 'sql',
		config: { name: 'sql' },
		load: { name: 'sql' }
	},
	stylus: {
		label: 'stylus',
		config: { name: 'stylus' },
		load: { name: 'stylus' }
	},
	swift: {
		label: 'swift',
		config: { name: 'swift' },
		load: { name: 'swift' }
	},
	text: {
		label: 'text',
		config: { name: 'text/plain' },
		load: { name: 'text' }
	},
	typescript: {
		label: 'typescript',
		config: { name: 'text/typescript' },
		load: { name: 'javascript' }
	},
	xml: {
		label: 'xml',
		config: { name: 'xml' },
		load: { name: 'xml' }
	},
	xquery: {
		label: 'xquery',
		config: { name: 'xquery' },
		load: { name: 'xquery' }
	},
	yaml: {
		label: 'yaml',
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
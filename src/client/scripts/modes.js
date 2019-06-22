/***************************************
 * CODEMIRROR MODES/LANGUAGES
 * ------------------------------------
 * root keys = id
 * label  = component label
 * config = editor instance mode option
 ***************************************/
const Modes = {
	c: {
		label: 'c',
		config: { name: 'text/x-csrc' }
	},
	'c++': {
		label: 'c++',
		config: { name: 'text/x-c++src' }
	},
	'c#': {
		label: 'c#',
		config: { name: 'text/x-csharp' }
	},
	coffeescript: {
		label: 'coffee',
		config: { name: 'coffeescript' }
	},
	cson: {
		label: 'cson',
		config: { name: 'coffeescript' }
	},
	css: {
		label: 'css',
		config: { name: 'css' }
	},
	elm: {
		label: 'elm',
		config: { name: 'elm' }
	},
	erlang: {
		label: 'erlang',
		config: { name: 'erlang' }
	},
	'f#': {
		label: 'f#',
		config: { name: 'text/x-fsharp' }
	},
	go: {
		label: 'go',
		config: { name: 'go' }
	},
	groovy: {
		label: 'groovy',
		config: { name: 'groovy' }
	},
	html: {
		label: 'html',
		config: { name: 'htmlmixed' }
	},
	java: {
		label: 'java',
		config: { name: 'text/x-java' }
	},
	javascript: {
		label: 'js',
		config: { name: 'javascript' }
	},
	json: {
		label: 'json',
		config: { name: 'javascript', json: true }
	},
	jsx: {
		label: 'jsx',
		config: { name: 'jsx' }
	},
	less: {
		label: 'less',
		config: { name: 'text/x-less' }
	},
	markdown: {
		label: 'markdown',
		config: { name: 'markdown' }
	},
	'objective-c': {
		label: 'objective-c',
		config: { name: 'text/x-objectivec' }
	},
	ocaml: {
		label: 'ocaml',
		config: { name: 'text/x-ocaml' }
	},
	perl: {
		label: 'perl',
		config: { name: 'perl' }
	},
	php: {
		label: 'php',
		config: { name: 'php' }
	},
	powershell: {
		label: 'powershell',
		config: { name: 'powershell' }
	},
	python: {
		label: 'python',
		config: { name: 'python' }
	},
	ruby: {
		label: 'ruby',
		config: { name: 'ruby' }
	},
	sass: {
		label: 'sass',
		config: { name: 'sass' }
	},
	scala: {
		label: 'scala',
		config: { name: 'text/x-scala' }
	},
	scss: {
		label: 'scss',
		config: { name: 'text/x-scss' }
	},
	shell: {
		label: 'shell',
		config: { name: 'shell' }
	},
	sql: {
		label: 'sql',
		config: { name: 'sql' }
	},
	stylus: {
		label: 'stylus',
		config: { name: 'stylus' }
	},
	swift: {
		label: 'swift',
		config: { name: 'swift' }
	},
	text: {
		label: 'text',
		config: { name: 'text/plain' }
	},
	typescript: {
		label: 'typescript',
		config: { name: 'text/typescript' }
	},
	xml: {
		label: 'xml',
		config: { name: 'xml' }
	},
	yaml: {
		label: 'yaml',
		config: { name: 'yaml' }
	}
};

/* Export it!
 *************/
export default Modes;
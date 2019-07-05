/***************
 * EDITOR PATHS
 ***************/
const cwd       = process.cwd(); // project root
const dir       = __dirname;
const dist      = `${dir}/dist`;
const client    = `${cwd}/src/client`;
const modules   = `${dir}/node_modules`;
const editor    = `${modules}/codemirror`;
const oneDark   = `${modules}/codemirror-one-dark-theme`;
const editorJS  = 'editor.js';
const editorCSS = 'editor.css';

const Paths = {
	project: {
		path: cwd
	},
	dist: {
		path: dist,
		scripts: `${dist}/scripts`,
		styles:  `${dist}/styles`,
		script:  `${dist}/scripts/${editorJS}`,
		style:   `${dist}/styles/${editorCSS}`
	},
	client: {
		script: `${client}/scripts/generated/${editorJS}`,
		style:  `${client}/styles/generated/${editorCSS}`
	},
	editor: {
		path: editor,
		addons: `${editor}/addon`,
		lib:    `${editor}/lib`,
		modes:  `${editor}/mode`,
		themes: `${editor}/theme`
	},
	oneDark: {
		theme: `${oneDark}/one-dark.css`
	}
};

// console.log(Paths);

/* Export it!
 *************/
module.exports = Paths;
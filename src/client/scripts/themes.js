/********************
 * CodeMirror Themes
 ********************/
const Paths = { // path info
	rel:    '../../..', // relative to this file
	editor: 'codemirror/lib',
	themes: 'codemirror/theme'
};

const CodemirrorThemes = [ // themes included with codemirror
	'3024-day',
	'3024-night',
	'abcdef',
	'ambiance',
	'base16-dark',
	'base16-light',
	'bespin',
	'blackboard',
	'cobalt',
	'colorforth',
	'darcula',
	'dracula',
	'duotone-dark',
	'duotone-light',
	'eclipse',
	'elegant',
	'erlang-dark',
	'gruvbox-dark',
	'hopscotch',
	'icecoder',
	'idea',
	'isotope',
	'lesser-dark',
	'liquibyte',
	'lucario',
	'material',
	'mbo',
	'mdn-like',
	'midnight',
	'monokai',
	'neat',
	'neo',
	'night',
	'nord',
	'oceanic-next',
	'panda-syntax',
	'paraiso-dark',
	'paraiso-light',
	'pastel-on-dark',
	'railscasts',
	'rubyblue',
	'seti',
	'shadowfox',
	'solarized',
	'ssms',
	'the-matrix',
	'tomorrow-night-bright',
	'tomorrow-night-eighties',
	'ttcn',
	'twilight',
	'vibrant-ink',
	'xq-dark',
	'xq-light',
	'yeti',
	'yonce',
	'zenburn'
];

const ExternalThemes = { // third party packages
	'one-dark': `codemirror-one-dark-theme/one-dark.css`
};

let Themes = { // :{ theme: <string>path | null }
	codemirror: `${Paths.rel}/${Paths.editor}/codemirror.css` // codemirror's required styles
};

/* Populate Themes (add themes with css paths then sort them)
 ******************/
for (const theme of CodemirrorThemes)
	Themes[theme] = `${Paths.rel}/${Paths.themes}/${theme}.css`;

for (const [theme, _path] of Object.entries(ExternalThemes))
	Themes[theme] = `${Paths.rel}/${_path}`;

Themes = Object.fromEntries(Object.entries(Themes).sort());

/* Export it!
 *************/
export default Themes;
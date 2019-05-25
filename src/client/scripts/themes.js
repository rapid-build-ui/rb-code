/********************
 * CODEMIRROR THEMES
 ********************/
import Paths from './paths.js';

/* Included Themes (with codemirror)
 ******************/
const IncludedThemes = [
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

/* Third Party Themes
 *********************/
const ExternalThemes = {
	'one-dark': `codemirror-one-dark-theme/one-dark.css`
};

/* Themes Export (init with codemirror's required styles)
 ****************/
let Themes = { // :{ theme: <string>path | null }
	codemirror: `${Paths.editor.lib}/codemirror.css`
};

/* Populated and Sort
 *********************/
(() => {
	for (const theme of IncludedThemes)
		Themes[theme] = `${Paths.editor.themes}/${theme}.css`;

	for (const [theme, _path] of Object.entries(ExternalThemes))
		Themes[theme] = `${Paths.node_modules}/${_path}`;

	Themes = Object.fromEntries(Object.entries(Themes).sort());
})();

/* Export it!
 *************/
export default Themes;
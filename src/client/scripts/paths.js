/*************************************************************************
 * CODEMIRROR PATHS
 * ----------------------------------------------------------------------
 * CodeMirror doesn't support import so we have
 * to dynamically load it's css and script files.
 * ----------------------------------------------------------------------
 * API (all path props)
 * ----------------------------------------------------------------------
 - rbCode       = absolute path to rb-code.js for fetch() base url option
 - node_modules = relative path to node_modules directory
 - editor:
 ◦ lib    = codemirror required files
 ◦ addons = additional functionality
 ◦ modes  = language support (aka lexers)
 ◦ themes = additional styling
 *************************************************************************/
const node_modules = '../../..';
const editor       = `${node_modules}/codemirror`;
const rbCode       = import.meta.url.replace('paths.js', 'rb-code.js');

/* Export it!
 *************/
export default {
	rbCode,
	node_modules,
	editor: {
		lib:    `${editor}/lib`,
		addons: `${editor}/addon`,
		modes:  `${editor}/mode`,
		themes: `${editor}/theme`
	}
};
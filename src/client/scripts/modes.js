/*********************************************
 * CodeMirror Modes/Languages
 * ------------------------------------------
 * root keys: are ids
 * title:     for component caption
 * config:    for editor instance mode option
 * mode:      for loading
 *********************************************/
export default {
	bash: {
		title: 'bash',
		config: {
			name: 'shell'
		},
		mode: {
			name: 'shell',
			path: 'shell/shell.js'
		}
	},
	css: {
		title: 'css',
		config: {
			name: 'css'
		},
		mode: {
			name: 'css',
			path: 'css/css.js'
		}
	},
	html: {
		title: 'html',
		config: {
			name: 'htmlmixed'
		},
		mode: {
			name: 'htmlmixed',
			path: 'htmlmixed/htmlmixed.js',
			deps: ['xml','js','css']
		}
	},
	js: {
		title: 'js',
		config: {
			name: 'javascript'
		},
		mode: {
			name: 'javascript',
			path: 'javascript/javascript.js'
		}
	},
	json: {
		title: 'json',
		config: {
			name: 'javascript',
			json: true
		},
		mode: {
			name: 'javascript',
			path: 'javascript/javascript.js'
		}
	},
	less: {
		title: 'less',
		config: {
			name: 'text/x-less'
		},
		mode: {
			name: 'css',
			path: 'css/css.js'
		}
	},
	scss: {
		title: 'scss',
		config: {
			name: 'text/x-scss'
		},
		mode: {
			name: 'css',
			path: 'css/css.js'
		}
	},
	shell: {
		title: 'shell',
		config: {
			name: 'shell'
		},
		mode: {
			name: 'shell',
			path: 'shell/shell.js'
		}
	},
	text: {
		title: 'text',
		config: {
			name: 'text/plain'
		},
		mode: {
			name: 'null'
		}
	},
	xml: {
		title: 'xml',
		config: {
			name: 'xml'
		},
		mode: {
			name: 'xml',
			path: 'xml/xml.js'
		}
	}
};
import type { OrgNode, OrgSource } from './types';

const lineMatchers = {
	header: /^(\*+)\s+(.*)$/, // m[1] => level, m[2] => content
	preformatted: /^(\s*):(?: (.*)$|$)/, // m[1] => indentation, m[2] => content
	unorderedListElement: /^(\s*)(?:-|\+|\s+\*)\s+(.*)$/, // m[1] => indentation, m[2] => content
	orderedListElement: /^(\s*)(\d+)(?:\.|\))\s+(.*)$/, // m[1] => indentation, m[2] => number, m[3] => content
	tableSeparator: /^(\s*)\|((?:\+|-)*?)\|?$/, // m[1] => indentation, m[2] => content
	tableRow: /^(\s*)\|(.*?)\|?$/, // m[1] => indentation, m[2] => content
	blank: /^\s*$/,
	horizontalRule: /^(\s*)-{5,}$/, //
	blockdirective: /^(\s*)#\+(?:(begin|end)_)?(.*)$/i, // m[1] => indentation, m[2] => type, m[3] => content
	// TODO: Extend list of directives
	docdirective: /^(\s*)#\+(?:(TITLE|TODO|STARTUP|AUTHOR|DATE)):\s*(.*)$/, // m[1] => indentation, m[2] => type, m[3] => content
	comment: /^(\s*)#(.*)$/,
	line: /^(\s*)(.*)$/
};

let todoKeywords: { todo: string[]; done: string[] } = { todo: ['TODO'], done: ['DONE'] };

function detectNodeState(node: OrgNode) {
	const title = node.title;
	if (title) {
		// Check if title starts with a keyword from todoKeywords
		for (const keyword of todoKeywords.todo) {
			if (title.startsWith(keyword)) {
				node.state = 'todo';
				node.stateKeyword = keyword;
				node.title = title.slice(keyword.length).trim();
				return;
			}
		}
		for (const keyword of todoKeywords.done) {
			if (title.startsWith(keyword)) {
				node.state = 'done';
				node.stateKeyword = keyword;
				node.title = title.slice(keyword.length).trim();
				return;
			}
		}
	}
}

export function orgTextToMindMap(org: string): OrgNode {
	const rootNode: OrgNode = {
		line: 0,
		title: 'Untitled Org File',
		state: 'none',
		stateKeyword: '',
		body: [],
		children: []
	};

	let currentNode = rootNode;
	let level = 0;

	const orgLines = org.split('\n');
	for (let i = 0; i < orgLines.length; i++) {
		const line = orgLines[i];
		let m: RegExpMatchArray | null = null;
		// const lineMatch = line.match(lineMatchers.header);
		if ((m = line.match(lineMatchers.header))) {
			const newLevel = m[1].length;
			const title = m[2];

			// console.log('Header', newLevel, title);

			if (newLevel > level) {
				// console.log('New child', newLevel, title);
				const newNode: OrgNode = {
					line: i,
					title,
					state: 'none',
					stateKeyword: '',
					body: [],
					children: [],
					parent: currentNode
				};
				detectNodeState(newNode);
				currentNode.children.push(newNode);
				currentNode = newNode;
				level = newLevel;
			} else if (newLevel === level) {
				// console.log('New sibling', newLevel, title);
				const newNode: OrgNode = {
					line: i,
					title,
					state: 'none',
					stateKeyword: '',
					body: [],
					children: [],
					parent: currentNode.parent
				};
				detectNodeState(newNode);
				currentNode.parent?.children.push(newNode);
				currentNode = newNode;
			} else if (newLevel < level) {
				// console.log('New parent', newLevel, title);
				const newNode: OrgNode = {
					line: i,
					title,
					state: 'none',
					stateKeyword: '',
					body: [],
					children: []
				};
				const diff = level - newLevel;
				let parent = currentNode.parent;
				for (let j = 0; j < diff; j++) {
					parent = parent?.parent;
				}
				newNode.parent = parent;
				parent?.children.push(newNode);
				detectNodeState(newNode);
				currentNode = newNode;
				level = newLevel;
			}
		} else if ((m = line.match(lineMatchers.docdirective))) {
			console.log('Directive', m[1], m[2], m[3]);
			const type = m[2];
			const content = m[3];
			if (type === 'TITLE') {
				rootNode.title = content;
			} else if (type === 'TODO') {
				console.log('TODO directive:', content);
				const [todos, dones] = content.split('|');
				todoKeywords = { todo: todos.split(' '), done: dones.split(' ') };
				// Trim whitespace and trailing parenteses including content from keywords
				todoKeywords.todo = todoKeywords.todo
					.map((k) => k.trim().replace(/\(.*$/, ''))
					.filter((k) => k);
				todoKeywords.done = todoKeywords.done
					.map((k) => k.trim().replace(/\(.*$/, ''))
					.filter((k) => k);
				console.log('TODO keywords:', todoKeywords);
				// } else if (type === 'BEGIN_SRC') {
				// 	console.log('BEGIN_SRC directive:', content);
				// 	const newNode: OrgNode = {
				// 		line: i,
				// 		title: content,
				// 		state: 'none',
				// 		stateKeyword: '',
				// 		body: [],
				// 		children: [],
				// 		parent: currentNode
				// 	};
				// 	currentNode.children.push(newNode);
				// 	currentNode = newNode;
			} else {
				console.log('Unknown directive type: ', type);
			}
		} else if ((m = line.match(lineMatchers.blockdirective))) {
			const [type, content] = m.slice(2);
			const [blocktype, language] = content.split(' ');
			if (type === 'BEGIN' && blocktype === 'SRC') {
				// const lang = content.trim();
				console.log('SRC block:', language);
				const element: OrgSource = { type: 'source', language, text: '' };
				const srcLines = [];

				// Scan until we find an END_SRC directive while adding lines to the source block
				for (let j = i + 1; j < orgLines.length; j++) {
					const line = orgLines[j];
					const m = line.match(lineMatchers.blockdirective);
					if (m && m[2] === 'END') {
						i = j;
						break;
					}
					srcLines.push(line);
				}
				element.text = srcLines.join('\n');
				currentNode.body.push(element);
			} else {
				console.log('Unknown block directive type: ', type, m);
			}
		} else if ((m = line.match(lineMatchers.blank))) {
			// console.log('Blank line');
		} else if ((m = line.match(lineMatchers.line))) {
			// console.log('Line', m[1], m[2]);
			currentNode.body.push({ type: 'text', text: line });
		} else {
			console.log('Unknown line type: ', line);
		}
	}

	return rootNode;
}

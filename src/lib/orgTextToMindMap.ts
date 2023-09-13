import type { OrgNode } from './orgtree';

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
	docdirective: /^(\s*)#\+(?:(TITLE|TODO|STARTUP)):\s*(.*)$/, // m[1] => indentation, m[2] => type, m[3] => content
	comment: /^(\s*)#(.*)$/,
	line: /^(\s*)(.*)$/
};

export function orgTextToMindMap(org: string): OrgNode {
	const rootNode: OrgNode = {
		line: 0,
		title: 'Untitled Org File',
		body: '',
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
					body: '',
					children: [],
					parent: currentNode
				};
				currentNode.children.push(newNode);
				currentNode = newNode;
				level = newLevel;
			} else if (newLevel === level) {
				// console.log('New sibling', newLevel, title);
				const newNode: OrgNode = {
					line: i,
					title,
					body: '',
					children: [],
					parent: currentNode.parent
				};
				currentNode.parent?.children.push(newNode);
				currentNode = newNode;
			} else if (newLevel < level) {
				// console.log('New parent', newLevel, title);
				const newNode: OrgNode = {
					line: i,
					title,
					body: '',
					children: []
				};
				const diff = level - newLevel;
				let parent = currentNode.parent;
				for (let j = 0; j < diff; j++) {
					parent = parent?.parent;
				}
				newNode.parent = parent;
				parent?.children.push(newNode);
				currentNode = newNode;
				level = newLevel;
			}
		} else if ((m = line.match(lineMatchers.docdirective))) {
			console.log('Directive', m[1], m[2], m[3]);
			const type = m[2];
			const content = m[3];
			if (type === 'TITLE') {
				rootNode.title = content;
			} else {
				console.log('Unknown directive type: ', type);
			}
		} else if ((m = line.match(lineMatchers.blank))) {
			// console.log('Blank line');
		} else if ((m = line.match(lineMatchers.line))) {
			// console.log('Line', m[1], m[2]);
			currentNode.body += line + '\n';
		} else {
			console.log('Unknown line type: ', line);
		}
	}

	return rootNode;
}

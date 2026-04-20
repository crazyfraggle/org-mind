import { describe, it, expect } from 'vitest';
import { orgTextToMindMap } from './orgTextToMindMap';
import { isLink, isSource, isText } from './types';

describe('header parsing tests', () => {
	it('detects a header', () => {
		const org = `
* Header 1
** Header 2
*** Header 3
        `;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(1);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].children[0].title).toBe('Header 3');
	});

	it('can detect two headers at the same level', () => {
		const org = `
* Header 1
** Header 2
* Header 3

        `;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(2);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[1].title).toBe('Header 3');
	});

	it('can detect two headers at the same level with a sibling', () => {
		const org = `
* Header 1
** Header 2
* Header 3
** Header 4
** Header 5
        `;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(2);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[1].title).toBe('Header 3');
		expect(rootNode.children[1].children.length).toBe(2);
		expect(rootNode.children[1].children[0].title).toBe('Header 4');
		expect(rootNode.children[1].children[1].title).toBe('Header 5');
	});

	it('can detect two headers at the same level with a sibling and a child', () => {
		const org = `
* Header 1
** Header 2
* Header 3
** Header 4
** Header 5
*** Header 6
        `;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(2);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[1].title).toBe('Header 3');
		expect(rootNode.children[1].children.length).toBe(2);
		expect(rootNode.children[1].children[0].title).toBe('Header 4');
		expect(rootNode.children[1].children[1].title).toBe('Header 5');
		expect(rootNode.children[1].children[1].children.length).toBe(1);
		expect(rootNode.children[1].children[1].children[0].title).toBe('Header 6');
	});

	it('can properly jump more than one level backwards', () => {
		const org = `
* Header 1
** Header 2
*** Header 3
* Header 4
		`;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(2);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].children[0].title).toBe('Header 3');
		expect(rootNode.children[1].title).toBe('Header 4');
	});

	it('detects a TODO keyword', () => {
		const org = `
* TODO Header 1
** Header 2
*** Header 3
		`;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(1);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].state).toBe('todo');
		expect(rootNode.children[0].stateKeyword).toBe('TODO');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].children[0].title).toBe('Header 3');
	});

	it('detects a DONE keyword', () => {
		const org = `
* DONE Header 1
** Header 2
*** Header 3
		`;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(1);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].state).toBe('done');
		expect(rootNode.children[0].stateKeyword).toBe('DONE');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].children[0].title).toBe('Header 3');
	});

	it('detects a custom TODO keyword', () => {
		const org = `#+TODO: TODOS | DONES
* TODOS Header 1
** Header 2
*** Header 3
		`;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(1);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].state).toBe('todo');
		expect(rootNode.children[0].stateKeyword).toBe('TODOS');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].children[0].title).toBe('Header 3');
	});
});

describe('directive parsing tests', () => {
	// 	it('detects a BEGIN_SRC directive', () => {
	// 		const org = `
	// * Header 1
	// ** Header 2
	// #+BEGIN_SRC javascript
	// console.log('Hello World');
	// #+END_SRC
	//         `;
	// 		const rootNode = orgTextToMindMap(org);
	// 		expect(rootNode.children.length).toBe(1);
	// 		expect(rootNode.children[0].title).toBe('Header 1');
	// 		expect(rootNode.children[0].children.length).toBe(1);
	// 		expect(rootNode.children[0].children[0].title).toBe('Header 2');
	// 		expect(rootNode.children[0].children[0].children.length).toBe(1);
	// 		expect(rootNode.children[0].children[0].children[0].title).toBe('javascript');
	// 		expect(rootNode.children[0].children[0].children[0].body).toBe("console.log('Hello World');");
	// 	});

	it('detects a TITLE directive and sets it on the root node', () => {
		const org = `
#+TITLE: My Title
* Header 1
** Header 2
`;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.title).toBe('My Title');
	});
});

describe('metadata parsing tests', () => {
	it('parses DEADLINE onto the node', () => {
		const org = `
* TODO Some task
DEADLINE: <2026-04-15 Wed>
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.deadline).toBe('2026-04-15 Wed');
		expect(node.body.length).toBe(0);
	});

	it('parses SCHEDULED onto the node', () => {
		const org = `
* Some task
SCHEDULED: <2026-04-17 Fri>
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.scheduled).toBe('2026-04-17 Fri');
		expect(node.body.length).toBe(0);
	});

	it('parses CLOSED onto the node', () => {
		const org = `
* DONE Some task
CLOSED: [2026-04-14 Tue 11:42]
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.closed).toBe('2026-04-14 Tue 11:42');
		expect(node.body.length).toBe(0);
	});

	it('parses combined CLOSED + DEADLINE on one line', () => {
		const org = `
** DONE Android
CLOSED: [2026-04-14 Tue 11:42] DEADLINE: <2026-04-15 Wed>
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.closed).toBe('2026-04-14 Tue 11:42');
		expect(node.deadline).toBe('2026-04-15 Wed');
		expect(node.body.length).toBe(0);
	});
});

describe('drawer parsing tests', () => {
	it('parses :PROPERTIES: drawer into node.properties', () => {
		const org = `
* Some heading
:PROPERTIES:
:ID: abc-123
:CUSTOM: value
:END:
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.properties).toEqual({ ID: 'abc-123', CUSTOM: 'value' });
		expect(node.body.length).toBe(0);
	});

	it('skips non-PROPERTIES drawers from body', () => {
		const org = `
* Some heading
:PEOPLE:
Ahmed: Knows things
Zach: Does stuff
:END:
Some body text
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.properties).toBeUndefined();
		expect(node.body.length).toBe(1);
		if (isText(node.body[0])) {
			expect(node.body[0].text).toBe('Some body text');
		}
	});

	it('skips :LOGBOOK: drawer from body', () => {
		const org = `
* Some heading
:LOGBOOK:
CLOCK: [2026-04-14 Tue 13:07]--[2026-04-14 Tue 13:11] =>  0:04
:END:
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.body.length).toBe(0);
	});
});

describe('org link parsing tests', () => {
	it('parses a standalone org link as OrgLink body element', () => {
		const org = `
* Some heading
[[id:d093e89e-9fe3-44d2-b955-92a8f48748cd][2026-04 ContentOrigin change]]
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.body.length).toBe(1);
		expect(isLink(node.body[0])).toBe(true);
		if (isLink(node.body[0])) {
			expect(node.body[0].target).toBe('id:d093e89e-9fe3-44d2-b955-92a8f48748cd');
			expect(node.body[0].description).toBe('2026-04 ContentOrigin change');
		}
	});

	it('keeps a line with mixed text and link as OrgText', () => {
		const org = `
* Some heading
See [[id:abc][link here]] for details
`;
		const rootNode = orgTextToMindMap(org);
		const node = rootNode.children[0];
		expect(node.body.length).toBe(1);
		expect(isText(node.body[0])).toBe(true);
	});
});

describe('body parsing tests', () => {
	it('detects a body', () => {
		const org = `
* Header 1
** Header 2
This is a body
`;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(1);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].body.length).toBe(1);
		expect(isText(rootNode.children[0].children[0].body[0])).toBe(true);
		if (isText(rootNode.children[0].children[0].body[0])) {
			expect(rootNode.children[0].children[0].body[0].text).toBe('This is a body');
		}
	});

	it('detects a body with a sibling', () => {
		const org = `
* Header 1
** Header 2
This is a body
** Header 3
`;

		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(1);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(2);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].body.length).toBe(1);
		expect(isText(rootNode.children[0].children[0].body[0])).toBe(true);
		if (isText(rootNode.children[0].children[0].body[0])) {
			expect(rootNode.children[0].children[0].body[0].text).toBe('This is a body');
		}
		expect(rootNode.children[0].children[1].title).toBe('Header 3');
	});

	it('detects a SRC body', () => {
		const org = `
* Header 1
** Header 2
#+BEGIN_SRC javascript
console.log('Hello World');
#+END_SRC
`;
		const rootNode = orgTextToMindMap(org);
		expect(rootNode.children.length).toBe(1);
		expect(rootNode.children[0].title).toBe('Header 1');
		expect(rootNode.children[0].children.length).toBe(1);
		expect(rootNode.children[0].children[0].title).toBe('Header 2');
		expect(rootNode.children[0].children[0].body.length).toBe(1);
		expect(isSource(rootNode.children[0].children[0].body[0])).toBe(true);
		if (isSource(rootNode.children[0].children[0].body[0])) {
			expect(rootNode.children[0].children[0].body[0].language).toBe('javascript');
			expect(rootNode.children[0].children[0].body[0].text).toBe("console.log('Hello World');");
		}
	});
});

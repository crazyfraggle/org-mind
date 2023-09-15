import { describe, it, expect } from 'vitest';
import { orgTextToMindMap } from './orgTextToMindMap';

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
		expect(rootNode.children[0].children[0].body[0].type).toBe('text');
		expect(rootNode.children[0].children[0].body[0].text).toBe('This is a body');
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
		expect(rootNode.children[0].children[0].body[0].type).toBe('text');
		expect(rootNode.children[0].children[0].body[0].text).toBe('This is a body');
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
		expect(rootNode.children[0].children[0].body[0].type).toBe('source');
		expect(rootNode.children[0].children[0].body[0].language).toBe('javascript');
		expect(rootNode.children[0].children[0].body[0].text).toBe("console.log('Hello World');");
	});
});

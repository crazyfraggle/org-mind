export interface OrgText {
	type: 'text';
	text: string;
}
export interface OrgTable {
	type: 'table';
	rows: string[][];
}
export interface OrgPreformatted {
	type: 'preformatted';
	text: string;
}
export interface OrgSource {
	type: 'source';
	language: string;
	text: string;
}

export interface OrgUnorderedList {
	type: 'unorderedList';
	// indentation: number;
	items: OrgBodyElement[];
}
export interface OrgOrderedList {
	type: 'orderedList';
	// indentation: number;
	// number: number;
	items: OrgBodyElement[];
}

export type OrgBodyElement =
	| OrgText
	| OrgTable
	| OrgPreformatted
	| OrgSource
	| OrgUnorderedList
	| OrgOrderedList;

export interface OrgNode {
	line: number;
	title: string;
	state: 'todo' | 'done' | 'none';
	stateKeyword: string;
	body: OrgBodyElement[];
	children: OrgNode[];
	parent?: OrgNode;
}

// Type narrowing functions
export function isText(element: OrgBodyElement): element is OrgText {
	return element.type === 'text';
}
export function isTable(element: OrgBodyElement): element is OrgTable {
	return element.type === 'table';
}
export function isPreformatted(element: OrgBodyElement): element is OrgPreformatted {
	return element.type === 'preformatted';
}
export function isSource(element: OrgBodyElement): element is OrgSource {
	return element.type === 'source';
}
export function isUnorderedList(element: OrgBodyElement): element is OrgUnorderedList {
	return element.type === 'unorderedList';
}
export function isOrderedList(element: OrgBodyElement): element is OrgOrderedList {
	return element.type === 'orderedList';
}

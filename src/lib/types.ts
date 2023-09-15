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

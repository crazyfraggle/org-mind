export interface OrgNode {
	line: number;
	title: string;
	body: string;
	children: OrgNode[];
	parent?: OrgNode;
}

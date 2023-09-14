<script lang="ts">
	import Mindmap from '$lib/mindmap.svelte';
	import { orgTextToMindMap } from '$lib/orgTextToMindMap';

	const orgText = `
	#+TITLE: Org-mode mind
#+AUTHOR: @crazyfraggle
#+DATE: <2023-09-12>

* Idea
Since org-mode files are hierarchical, we can use them as a mind map.

* Learnings
** [ ] Can Svelte be an electron app?
** [X] Vitest is great at testing.
** Svelte is great at building.
** Co-pilot is great at writing code.
** Co-pilot like to brag about itself.
** Co-pilot is awesome at writing tests.

* New things tested out
** vitest
Snappy and easy to use.
Co-pilot happily created actual usable tests.

** css variables
Allows passing CSS props from top level containers into child components without the need for prop drilling.

** Svelte
Nah, done that before. Just needs pointing out.

** VSCode Org mode
It sux.

* Todos
** Table support
We need to support this:
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
** Pre-formatted text
Some pre-formatted text:
#+BEGIN_EXAMPLE
** This is a headline
#+END_EXAMPLE

** Code blocks
#+BEGIN_SRC javascript
const a = 1;
#+END_SRC

** Links
[[https://www.google.com][Google]]

** Images
[[file:./images/2021-08-22-16-00-00.png]]

** Lists

*** Unordered
- List item 1
- List item 2

+ List item 1
+ List item 2
  - Sub list item

*** Ordered
1. List item 1
2. List item 2


	`;

	const orgTree = orgTextToMindMap(orgText);
</script>

<div>
	<Mindmap orgtree={orgTree} />
</div>

# Threads View Reference

Alternative view for org files that tracks parallel work streams. Top-level nodes render as horizontal cards; sub-nodes are columns; linked files provide the vertical thread of entries.

Toggle between Mindmap and Threads views via the toolbar radio buttons in `src/routes/+page.svelte`.

## Component hierarchy

```
+page.svelte              — toolbar, file/dir pickers, view toggle, idnavigate handler
  └─ ThreadsView          — horizontal flex container of cards
      └─ ThreadCard       — one top-level thread (one project/stream)
          ├─ ThreadItem   — sub-task column inside the card
          │   └─ ThreadEntry (× N)   — entries from the linked file
          └─ ThreadEntry  — entries shown directly on the card when it has no children
                            but a body id: link (link-only cards)
```

Each level uses `<OrgNodeBody>` for any body content.

## Data flow

1. User opens an org directory (`showDirectoryPicker`). We build two things:
   - `orgFiles: FileSystemFileHandle[]` — root-level `.org` files, shown in a toolbar dropdown for selection.
   - `idIndex: Map<string, FileSystemFileHandle>` — UUID → file handle, built by walking the directory and scanning every `.org` file for `:ID:` lines in `:PROPERTIES:` drawers.
2. User picks a file. Its text populates `orgText`, which reactively parses into `orgTree`.
3. `ThreadsView` passes `idIndex` down to `ThreadCard` → `ThreadItem`.
4. `ThreadCard` and `ThreadItem` both look for an `id:` link in their body. If found and `idIndex` is available, they resolve it asynchronously:
   - `ThreadItem` resolves when it has a body link (for sub-task columns pointing to a journal file).
   - `ThreadCard` only resolves when it has **no children** — i.e. the card IS just a link to another file (link-only cards).
5. Resolution fetches the linked file's text, parses it into an `OrgNode`, and renders:
   - `linkedNode.body` as an "intro" entry (styled with a darkcyan left border).
   - `linkedNode.children` as a vertical list of `<ThreadEntry>` collapsible cards.

## id: link navigation (map view too)

`OrgNodeBody` renders `id:`-prefixed `OrgLink`s as buttons. Clicking dispatches a bubbling DOM `CustomEvent('idnavigate', { detail: uuid, bubbles: true })`. The `#content` div in `+page.svelte` catches it via a `use:listenIdNavigate` action, resolves via `idIndex`, and replaces `orgText`. This works in both Mindmap and Threads views.

## Reload flow

The toolbar "Reload files" button:
1. Re-reads the currently-selected file into `orgText`.
2. Increments `reloadKey`.

The content area wraps its views in `{#key reloadKey}`, so incrementing destroys and recreates all components. This matters because `ThreadCard` and `ThreadItem` cache their link-resolution state (`resolved = true` prevents re-fetching). A full recreation resets that and forces fresh reads of all linked files.

File handles in `idIndex` stay valid across reloads — `handle.getFile()` returns current content on each call. The index only needs rebuilding if files are added/removed/renamed (re-open the org dir for that).

## Parser extensions

`src/lib/orgTextToMindMap.ts` handles the following (all before the catch-all `lineMatchers.line`):

- **DEADLINE / SCHEDULED / CLOSED** — matched against each line; multiple can appear on one line. Set as optional fields on the node, not pushed into body.
- **Property drawers** — `:NAME:` through `:END:`. `:PROPERTIES:` key/value pairs go into `node.properties`. Other drawers (`:LOGBOOK:`, `:PEOPLE:`) have their content dropped entirely.
- **Standalone org links** — a line containing only `[[target][description]]` becomes an `OrgLink` body element (not wrapped in `OrgText`). This is what lets `ThreadCard`/`ThreadItem` find the link to resolve.
- **Case-insensitive directives** — `#+title:` works as well as `#+TITLE:` (added `i` flag and `.toUpperCase()` normalization).

`src/lib/orgnodetext.svelte` also auto-linkifies plain URLs (`protocol://...`) in `OrgText` content, rendering them as `target="_blank"` anchors.

## UX behaviors

- **Hide/show done** — per-card toggle on `ThreadCard` filters out sub-items with `state === 'done'`. Keyed `{#each visibleChildren as child (child.line)}` prevents component-reuse bugs when filtering.
- **Collapsible entries** — `ThreadEntry` starts collapsed when `entry.state === 'done'`. Click the title bar to toggle.
- **Viewport containment** — `#page` is `height: 100vh` flex column; `#content` is `flex: 1; overflow: hidden`; each `ThreadCard` has its own `overflow-y: auto`. Cards stretch full height; the horizontal container scrolls instead of the page.

## Key files

| File | Role |
|------|------|
| `src/routes/+page.svelte` | Toolbar, pickers, view toggle, id-navigate action, reload key |
| `src/lib/threadsview.svelte` | Horizontal flex container of cards |
| `src/lib/threadcard.svelte` | Top-level thread card; columns of sub-items or resolved link-only entries |
| `src/lib/threaditem.svelte` | Sub-task column; resolves body id: link to show linked file's entries |
| `src/lib/threadentry.svelte` | Collapsible entry card; done entries start collapsed |
| `src/lib/orgIdIndex.ts` | `buildOrgIdIndex` (walks dir, scans `:ID:` lines) + `resolveIdLink` |
| `src/lib/orgnodebody.svelte` | Renders body elements; `id:` links become buttons that dispatch `idnavigate` |
| `src/lib/orgnodetext.svelte` | Auto-linkifies plain URLs in text |
| `src/lib/orgTextToMindMap.ts` | Parser with metadata, drawers, links, case-insensitive directives |
| `src/lib/types.ts` | `OrgLink` type, `isLink()` guard, optional metadata fields on `OrgNode` |

## File System Access API notes

- No file-watching primitive exists. Reload is manual. The `FileSystemObserver` proposal is not yet generally available.
- `FileSystemDirectoryHandle.values()` returns an async iterator of entries (files and subdirs). We walk recursively to build the id index; only root files show in the toolbar dropdown.
- Type declarations for `showDirectoryPicker`, `showOpenFilePicker`, and `FileSystemDirectoryHandle.values()` live in `src/app.d.ts` — they're not yet in the default `lib.dom.d.ts`.

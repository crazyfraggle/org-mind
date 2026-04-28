import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'org-mind:theme';

function initial(): Theme {
	if (!browser) return 'light';
	const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const theme = writable<Theme>(initial());

if (browser) {
	theme.subscribe((value) => {
		document.documentElement.dataset.theme = value;
		localStorage.setItem(STORAGE_KEY, value);
	});
}

export function toggleTheme() {
	theme.update((t) => (t === 'dark' ? 'light' : 'dark'));
}

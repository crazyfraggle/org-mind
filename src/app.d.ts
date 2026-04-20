// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	// File System Access API types (not yet in lib.dom.d.ts)
	interface FileSystemDirectoryHandle {
		values(): AsyncIterableIterator<FileSystemDirectoryHandle | FileSystemFileHandle>;
	}

	interface Window {
		showOpenFilePicker(options?: object): Promise<FileSystemFileHandle[]>;
		showDirectoryPicker(options?: object): Promise<FileSystemDirectoryHandle>;
	}
}

export {};

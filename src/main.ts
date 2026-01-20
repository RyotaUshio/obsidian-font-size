import { Plugin } from 'obsidian';


declare module "obsidian" {
	interface App {
		updateFontSize(): void;
	}
	interface Vault {
		getConfig(name: string): any;
		setConfig(name: string, value: any): void;
	}
}


export default class FontSizeAdjuster extends Plugin {
	async onload() {
		this.addCommand({
			id: 'increment-font-size',
			name: 'Increase Font Size (+)',
			repeatable: true, // holding hotkey repeatedely trigger command
			checkCallback: (checking) => {
				const currentSize = this.app.vault.getConfig('baseFontSize');

				if (typeof currentSize !== 'number') return false;

				// updateFontSize() actually clamps font size to '10 <= size <= 30'
				// so making font size doesn't go over 30px
				if (currentSize >= 30) return false;

				if (!checking) {
					this.app.vault.setConfig('baseFontSize', currentSize + 1);
					this.app.updateFontSize();
				}
				return true;
			}
		});

		this.addCommand({
			id: 'decrement-font-size',
			name: 'Decrease Font Size (-)',
			repeatable: true, // holding hotkey repeatedely trigger command
			checkCallback: (checking) => {
				const currentSize = this.app.vault.getConfig('baseFontSize');

				if (typeof currentSize !== 'number') return false;
				// updateFontSize() actually clamps font size to '10 <= size <= 30'
				// so making font size doesn't go under 10px
				if (currentSize <= 10) return false;

				if (!checking) {
					this.app.vault.setConfig('baseFontSize', currentSize - 1);
					this.app.updateFontSize();
				}
				return true;
			}
		});

		this.addCommand({
			id: 'reset-font-size',
			name: 'Reset to Default Font Size',
			checkCallback: (checking: boolean) => {
				const currentSize = this.app.vault.getConfig('baseFontSize');
				if (typeof currentSize !== 'number') return false;

				if (!checking) {
					// default value for font-text is 16px
					// https://docs.obsidian.md/Reference/CSS+variables/Foundations/Typography
					this.app.vault.setConfig('baseFontSize', 16);
					this.app.updateFontSize();
				}
				return true;
			}

		});
	}
}

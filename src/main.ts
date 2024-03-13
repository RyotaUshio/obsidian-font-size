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
			name: 'Increment font size',
			checkCallback: (checking) => {
				const currentSize = this.app.vault.getConfig('baseFontSize');

				if (typeof currentSize !== 'number') return false;

				if (!checking) {
					this.app.vault.setConfig('baseFontSize', currentSize + 1);
					this.app.updateFontSize();
				}
				return true;
			}
		});

		this.addCommand({
			id: 'decrement-font-size',
			name: 'Decrement font size',
			checkCallback: (checking) => {
				const currentSize = this.app.vault.getConfig('baseFontSize');
				if (typeof currentSize !== 'number') return false;

				if (!checking) {
					this.app.vault.setConfig('baseFontSize', currentSize - 1);
					this.app.updateFontSize();
				}
				return true;
			}
		});

		this.addCommand({
			id: 'reset-font-size',
			name: 'Rest font size to default',
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

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
			name: 'Increment Font Size',
			callback: () => {
				const currentSize: number = this.app.vault.getConfig('baseFontSize');
				this.app.vault.setConfig('baseFontSize', currentSize + 1);
				this.app.updateFontSize();
			}
		});

		this.addCommand({
			id: 'decrement-font-size',
			name: 'Decrement Font Size',
			callback: () => {
				const currentSize: number = this.app.vault.getConfig('baseFontSize');
				this.app.vault.setConfig('baseFontSize', currentSize - 1);
				this.app.updateFontSize();
			}
		});
	}
}

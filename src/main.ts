import { Plugin } from 'obsidian';


declare module "obsidian" {
	interface App {
		updateFontSize(): void;
		// Obsidian >= 1.15 keeps the font size per device in localStorage
		getBaseFontSize?(): number;
		setBaseFontSize?(size: number): void;
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
			repeatable: true, // holding hotkey repeatedely trigger command
			checkCallback: (checking) => {
				const currentSize = this.getFontSize();

				if (typeof currentSize !== 'number') return false;

				// updateFontSize() actually clamps font size to '10 <= size <= 30'
				// so making font size doesn't go over 30px
				if (currentSize >= 30) return false;

				if (!checking) this.setFontSize(currentSize + 1);
				return true;
			}
		});

		this.addCommand({
			id: 'decrement-font-size',
			name: 'Decrement font size',
			repeatable: true, // holding hotkey repeatedely trigger command
			checkCallback: (checking) => {
				const currentSize = this.getFontSize();

				if (typeof currentSize !== 'number') return false;
				// updateFontSize() actually clamps font size to '10 <= size <= 30'
				// so making font size doesn't go under 10px
				if (currentSize <= 10) return false;

				if (!checking) this.setFontSize(currentSize - 1);
				return true;
			}
		});

		this.addCommand({
			id: 'reset-font-size',
			name: 'Rest font size to default',
			checkCallback: (checking: boolean) => {
				const currentSize = this.getFontSize();
				if (typeof currentSize !== 'number') return false;

				// default value for font-text is 16px
				// https://docs.obsidian.md/Reference/CSS+variables/Foundations/Typography
				if (!checking) this.setFontSize(16);
				return true;
			}

		});
	}

	getFontSize(): unknown {
		if (this.app.getBaseFontSize) return this.app.getBaseFontSize();
		return this.app.vault.getConfig('baseFontSize');
	}

	setFontSize(size: number) {
		if (this.app.setBaseFontSize) {
			this.app.setBaseFontSize(size);
			return;
		}
		this.app.vault.setConfig('baseFontSize', size);
		this.app.updateFontSize();
	}
}

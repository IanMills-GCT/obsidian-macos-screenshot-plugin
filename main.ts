import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, MarkdownView } from 'obsidian';

interface ScreenshotSettings {
    screenshotFolder: string;
    defaultFormat: string;
    includeTimestamp: boolean;
    autoInsertIntoNote: boolean;
}

const DEFAULT_SETTINGS: ScreenshotSettings = {
    screenshotFolder: 'screenshots',
    defaultFormat: 'png',
    includeTimestamp: true,
    autoInsertIntoNote: true
}

export default class ScreenshotPlugin extends Plugin {
    settings: ScreenshotSettings;

    async onload() {
        console.log('Loading macOS Screenshot Plugin');
        
        await this.loadSettings();

        // Add ribbon icon - directly goes to window selection
        this.addRibbonIcon('camera', 'Take Window Screenshot', () => {
            this.takeSystemScreenshot('window');
        });

        // Add commands
        this.addCommand({
            id: 'take-screenshot-window',
            name: 'Take Screenshot - Select Window',
            callback: () => this.takeSystemScreenshot('window')
        });

        this.addCommand({
            id: 'take-screenshot-menu',
            name: 'Take Screenshot - Show All Options',
            callback: () => this.showScreenshotOptions()
        });

        this.addCommand({
            id: 'take-screenshot-area',
            name: 'Take Screenshot - Select Area',
            callback: () => this.takeSystemScreenshot('interactive')
        });

        this.addCommand({
            id: 'take-screenshot-fullscreen',
            name: 'Take Screenshot - Full Screen',
            callback: () => this.takeSystemScreenshot('fullscreen')
        });

        // Add settings tab
        this.addSettingTab(new ScreenshotSettingTab(this.app, this));
    }

    async onunload() {
        console.log('Unloading macOS Screenshot Plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    showScreenshotOptions() {
        new SystemScreenshotModal(this.app, (option) => {
            this.takeSystemScreenshot(option);
        }).open();
    }

    async takeSystemScreenshot(option: string) {
        try {
            // Import Node.js modules
            const { exec } = require('child_process');
            const { promisify } = require('util');
            const execAsync = promisify(exec);
            
            // Show initial notice
            let optionName = '';
            switch (option) {
                case 'window':
                    optionName = 'window selection';
                    new Notice('Click on a window to capture it...');
                    break;
                case 'interactive':
                    optionName = 'area selection';
                    new Notice('Drag to select an area to capture...');
                    break;
                case 'fullscreen':
                    optionName = 'full screen';
                    new Notice('Taking full screen screenshot...');
                    break;
            }
            
            // Create filename
            const timestamp = this.settings.includeTimestamp 
                ? new Date().toISOString().replace(/[:.]/g, '-').split('.')[0]
                : '';
            const fileName = timestamp 
                ? `${this.settings.screenshotFolder}/screenshot-${timestamp}.${this.settings.defaultFormat}`
                : `${this.settings.screenshotFolder}/screenshot.${this.settings.defaultFormat}`;
            
            // Ensure screenshots folder exists
            if (!await this.app.vault.adapter.exists(this.settings.screenshotFolder)) {
                await this.app.vault.createFolder(this.settings.screenshotFolder);
            }
            
            // Get full file path
            const fullPath = `${this.app.vault.adapter.basePath}/${fileName}`;
            
            // Build screenshot command
            let command = '';
            switch (option) {
                case 'interactive':
                    // Interactive area selection
                    command = `screencapture -i "${fullPath}"`;
                    break;
                case 'window':
                    // Interactive window selection
                    command = `screencapture -i -w "${fullPath}"`;
                    break;
                case 'fullscreen':
                    // Full screen capture (with 1 second delay to hide the notice)
                    command = `screencapture -T 1 "${fullPath}"`;
                    break;
                case 'fullscreen-immediate':
                    // Immediate full screen capture
                    command = `screencapture "${fullPath}"`;
                    break;
            }
            
            console.log(`Executing screenshot command: ${command}`);
            
            // Execute the screenshot command
            const result = await execAsync(command);
            
            // Check if file was actually created
            if (await this.app.vault.adapter.exists(fileName)) {
                new Notice(`✅ Screenshot saved: ${fileName}`);
                
                // Insert the image into the current note
                await this.insertImageIntoCurrentNote(fileName);
                
                // Optional: Try to refresh the file explorer
                try {
                    this.app.vault.adapter.list(this.settings.screenshotFolder);
                } catch (e) {
                    // Ignore refresh errors
                }
            } else {
                new Notice('❌ Screenshot cancelled or failed');
            }
            
        } catch (error) {
            console.error('Screenshot failed:', error);
            
            // Provide user-friendly error messages
            if (error.message.includes('Operation not permitted')) {
                new Notice('❌ Permission denied. Enable "Screen Recording" for Obsidian in System Preferences → Security & Privacy');
            } else if (error.message.includes('killed')) {
                new Notice('📷 Screenshot cancelled by user');
            } else {
                new Notice(`❌ Screenshot failed: ${error.message}`);
            }
        }
    }

    // Insert image into current note
    async insertImageIntoCurrentNote(fileName: string) {
        // Check if auto-insert is enabled
        if (!this.settings.autoInsertIntoNote) {
            return;
        }
        
        try {
            // Get the active editor
            const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
            
            if (!activeView) {
                new Notice('No active note found to insert image');
                return;
            }
            
            const editor = activeView.editor;
            if (!editor) {
                new Notice('No editor found to insert image');
                return;
            }
            
            // Create the markdown image link
            const imageMarkdown = `![](${fileName})\n`;
            
            // Get current cursor position
            const cursor = editor.getCursor();
            
            // Insert the image at cursor position
            editor.replaceRange(imageMarkdown, cursor);
            
            // Move cursor to end of inserted text
            const newCursor = {
                line: cursor.line + 1,
                ch: 0
            };
            editor.setCursor(newCursor);
            
            new Notice('📝 Image inserted into note');
            
        } catch (error) {
            console.error('Failed to insert image into note:', error);
            new Notice('⚠️ Screenshot saved but failed to insert into note');
        }
    }

    // Helper method to take a quick screenshot with clipboard copy
    async takeQuickScreenshot() {
        try {
            const { exec } = require('child_process');
            const { promisify } = require('util');
            const execAsync = promisify(exec);
            
            new Notice('Taking screenshot to clipboard...');
            
            // Take screenshot to clipboard
            await execAsync('screencapture -i -c');
            
            new Notice('📋 Screenshot copied to clipboard');
            
        } catch (error) {
            new Notice('Failed to take screenshot to clipboard');
            console.error(error);
        }
    }
}

// Modal for selecting screenshot type
class SystemScreenshotModal extends Modal {
    onSelect: (option: string) => void;

    constructor(app: App, onSelect: (option: string) => void) {
        super(app);
        this.onSelect = onSelect;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        
        contentEl.createEl('h2', { text: 'Screenshot Options' });
        contentEl.createEl('p', { 
            text: 'Choose how you want to take a screenshot:',
            cls: 'screenshot-modal-description'
        });
        
        // Add styling
        contentEl.createEl('style', {
            text: `
                .screenshot-modal-description {
                    margin-bottom: 20px;
                    opacity: 0.8;
                }
                .screenshot-option {
                    display: flex;
                    align-items: center;
                    padding: 15px;
                    border: 1px solid var(--background-modifier-border);
                    border-radius: 8px;
                    margin: 8px 0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .screenshot-option:hover {
                    background-color: var(--background-modifier-hover);
                    border-color: var(--interactive-accent);
                }
                .screenshot-option-icon {
                    font-size: 24px;
                    margin-right: 15px;
                    width: 30px;
                    text-align: center;
                }
                .screenshot-option-content {
                    flex: 1;
                }
                .screenshot-option-title {
                    font-weight: 600;
                    margin-bottom: 4px;
                    font-size: 16px;
                }
                .screenshot-option-desc {
                    font-size: 13px;
                    opacity: 0.7;
                    line-height: 1.3;
                }
                .screenshot-option-shortcut {
                    font-size: 11px;
                    opacity: 0.5;
                    margin-left: 10px;
                    padding: 2px 6px;
                    background: var(--background-modifier-border);
                    border-radius: 3px;
                }
                .modal-button-container {
                    margin-top: 20px;
                    text-align: center;
                }
            `
        });
        
        // Window selection option
        const windowOption = contentEl.createDiv('screenshot-option');
        windowOption.createDiv({ cls: 'screenshot-option-icon', text: '🪟' });
        const windowContent = windowOption.createDiv('screenshot-option-content');
        windowContent.createDiv({ cls: 'screenshot-option-title', text: 'Select Window' });
        windowContent.createDiv({ cls: 'screenshot-option-desc', text: 'Click on any window to capture it' });
        windowOption.createDiv({ cls: 'screenshot-option-shortcut', text: 'Cmd+Shift+4, Space' });
        windowOption.addEventListener('click', () => {
            this.onSelect('window');
            this.close();
        });
        
        // Interactive area selection option
        const interactiveOption = contentEl.createDiv('screenshot-option');
        interactiveOption.createDiv({ cls: 'screenshot-option-icon', text: '✂️' });
        const interactiveContent = interactiveOption.createDiv('screenshot-option-content');
        interactiveContent.createDiv({ cls: 'screenshot-option-title', text: 'Select Area' });
        interactiveContent.createDiv({ cls: 'screenshot-option-desc', text: 'Drag to select any area of the screen' });
        interactiveOption.createDiv({ cls: 'screenshot-option-shortcut', text: 'Cmd+Shift+4' });
        interactiveOption.addEventListener('click', () => {
            this.onSelect('interactive');
            this.close();
        });
        
        // Full screen option
        const fullscreenOption = contentEl.createDiv('screenshot-option');
        fullscreenOption.createDiv({ cls: 'screenshot-option-icon', text: '🖥️' });
        const fullscreenContent = fullscreenOption.createDiv('screenshot-option-content');
        fullscreenContent.createDiv({ cls: 'screenshot-option-title', text: 'Full Screen' });
        fullscreenContent.createDiv({ cls: 'screenshot-option-desc', text: 'Capture the entire screen (1 second delay)' });
        fullscreenOption.createDiv({ cls: 'screenshot-option-shortcut', text: 'Cmd+Shift+3' });
        fullscreenOption.addEventListener('click', () => {
            this.onSelect('fullscreen');
            this.close();
        });

        // Immediate full screen option
        const immediateOption = contentEl.createDiv('screenshot-option');
        immediateOption.createDiv({ cls: 'screenshot-option-icon', text: '⚡' });
        const immediateContent = immediateOption.createDiv('screenshot-option-content');
        immediateContent.createDiv({ cls: 'screenshot-option-title', text: 'Full Screen (Immediate)' });
        immediateContent.createDiv({ cls: 'screenshot-option-desc', text: 'Capture the entire screen immediately' });
        immediateOption.addEventListener('click', () => {
            this.onSelect('fullscreen-immediate');
            this.close();
        });

        // Cancel button
        const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });
        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.addEventListener('click', () => this.close());
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

// Settings tab
class ScreenshotSettingTab extends PluginSettingTab {
    plugin: ScreenshotPlugin;

    constructor(app: App, plugin: ScreenshotPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h2', { text: 'macOS Screenshot Plugin Settings' });

        new Setting(containerEl)
            .setName('Screenshot folder')
            .setDesc('Folder where screenshots will be saved (relative to vault root)')
            .addText(text => text
                .setPlaceholder('screenshots')
                .setValue(this.plugin.settings.screenshotFolder)
                .onChange(async (value) => {
                    this.plugin.settings.screenshotFolder = value || 'screenshots';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('File format')
            .setDesc('Default file format for screenshots')
            .addDropdown(dropdown => dropdown
                .addOption('png', 'PNG (recommended)')
                .addOption('jpg', 'JPEG')
                .addOption('pdf', 'PDF')
                .setValue(this.plugin.settings.defaultFormat)
                .onChange(async (value) => {
                    this.plugin.settings.defaultFormat = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Include timestamp')
            .setDesc('Add timestamp to filename to avoid overwriting')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.includeTimestamp)
                .onChange(async (value) => {
                    this.plugin.settings.includeTimestamp = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Auto-insert into note')
            .setDesc('Automatically insert screenshot into the current note after taking it')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.autoInsertIntoNote)
                .onChange(async (value) => {
                    this.plugin.settings.autoInsertIntoNote = value;
                    await this.plugin.saveSettings();
                }));

        // Add help section
        containerEl.createEl('h3', { text: 'Help & Tips' });
        
        const helpDiv = containerEl.createDiv();
        helpDiv.createEl('p', { text: '📷 Camera icon: Directly opens window selection' });
        helpDiv.createEl('p', { text: '⌨️ Commands: Available in Command Palette (Cmd+P)' });
        helpDiv.createEl('p', { text: '🔒 Permissions: Enable "Screen Recording" for Obsidian in System Preferences → Security & Privacy' });
        helpDiv.createEl('p', { text: '❌ Cancel: Press Escape during window/area selection' });
        helpDiv.createEl('p', { text: '📝 Auto-insert: Screenshots are automatically added to your current note' });
        
        // Add keyboard shortcuts info
        containerEl.createEl('h4', { text: 'macOS Screenshot Shortcuts' });
        const shortcutsDiv = containerEl.createDiv();
        shortcutsDiv.createEl('p', { text: 'Cmd+Shift+3: Full screen screenshot' });
        shortcutsDiv.createEl('p', { text: 'Cmd+Shift+4: Area selection' });
        shortcutsDiv.createEl('p', { text: 'Cmd+Shift+4, then Space: Window selection' });
    }
}

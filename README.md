# macOS Screenshot Plugin for Obsidian

Take screenshots on macOS using native system commands and automatically insert them into your notes. This plugin provides a seamless screenshot workflow optimized for Mac users.

## ✨ Features

- 🪟 **Window Selection**: Click any window to capture it (even if it's not the active window)
- ✂️ **Area Selection**: Drag to select any area of the screen  
- 🖥️ **Full Screen**: Capture entire screen with delay or immediately
- 📝 **Auto-Insert**: Screenshots automatically inserted into current note at cursor position
- ⚙️ **Configurable Settings**: Choose folder location, file format, and timestamp options
- ⚡ **Fast Workflow**: One-click from ribbon icon directly to window selection
- 📁 **Organized Storage**: Automatically creates and manages screenshot folders
- 🔧 **Multiple Access Methods**: Ribbon icon, command palette, or keyboard shortcuts

## 🚀 Quick Start

1. **Click the camera icon** in the Obsidian ribbon (left sidebar)
2. **Click on any window** you want to capture
3. **Screenshot is automatically saved** to your vault and **inserted into your current note**

That's it! The image appears immediately where your cursor was positioned.

## 📖 Detailed Usage

### Ribbon Icon (Primary Method)
- Click the 📷 camera icon in the left ribbon
- Directly starts window selection mode
- Click any window to capture it

### Command Palette Methods
Press `Cmd+P` and search for "screenshot" to access:

- **Take Screenshot - Select Window**: Click any window to capture
- **Take Screenshot - Select Area**: Drag to select screen area
- **Take Screenshot - Full Screen**: Capture entire screen (1 second delay)
- **Take Screenshot - Show All Options**: Opens full options menu

### macOS Native Shortcuts
The plugin uses macOS's built-in screenshot system, so these shortcuts work:
- `Cmd+Shift+4` then `Space`: Window selection
- `Cmd+Shift+4`: Area selection  
- `Cmd+Shift+3`: Full screen

## ⚙️ Settings

Access settings via: **Settings → Community plugins → macOS Screenshot Plugin**

### Available Options

| Setting | Description | Default |
|---------|-------------|---------|
| **Screenshot folder** | Where screenshots are saved (relative to vault root) | `screenshots` |
| **File format** | PNG (recommended), JPEG, or PDF | `PNG` |
| **Include timestamp** | Add timestamp to filename to avoid overwriting | `Enabled` |
| **Auto-insert into note** | Automatically add screenshot to current note | `Enabled` |

### File Naming
- **With timestamp**: `screenshot-2025-09-21T00-15-30.png`
- **Without timestamp**: `screenshot.png`

## 🔧 Requirements

### System Requirements
- **macOS only** (uses native `screencapture` command)
- **Obsidian 0.15.0+**
- **Screen Recording permission** for Obsidian

### Setting Up Permissions

On first use, macOS will prompt for Screen Recording permission:

1. **Open System Preferences** (or System Settings on newer macOS)
2. **Go to Security & Privacy → Privacy**
3. **Select "Screen Recording"** from the left sidebar
4. **Click the lock** to unlock (enter password)
5. **Check the box next to Obsidian**
6. **Restart Obsidian**

If Obsidian doesn't appear in the list:
1. Click the **"+"** button
2. Navigate to **Applications**
3. Select **Obsidian**
4. Restart Obsidian

## 📥 Installation

### From Community Plugins (Recommended)
1. Open **Obsidian Settings**
2. Go to **Community plugins → Browse**
3. Search for **"macOS Screenshot"**
4. Click **Install** and then **Enable**

### Manual Installation
1. Download the latest release from https://github.com/IanMills-GCT/obsidian-macos-screenshot-plugin
2. Extract the files to `<your-vault>/.obsidian/plugins/macos-screenshot-plugin/`
3. The folder should contain: `main.js`, `manifest.json`, and optionally `styles.css`
4. Restart Obsidian
5. Go to **Settings → Community plugins** and enable the plugin

## 🐛 Troubleshooting

### "Permission denied" Error
**Cause**: Screen Recording permission not granted to Obsidian  
**Solution**: Follow the [permission setup steps](#setting-up-permissions) above

### Screenshots Not Appearing in Note
**Possible causes**:
- No note is currently open
- Cursor is not positioned in a note
- "Auto-insert into note" is disabled in settings

**Solutions**:
- Open a note and place your cursor where you want the image
- Check plugin settings and enable "Auto-insert into note"
- Try manually: the screenshot is still saved in your screenshots folder

### Plugin Not Working
**Possible causes**:
- Not on macOS (this plugin requires macOS)
- Plugin not enabled
- Permission issues

**Solutions**:
- Ensure you're on macOS (this plugin won't work on Windows/Linux)
- Check Settings → Community plugins → Ensure "macOS Screenshot Plugin" is enabled
- Try restarting Obsidian after granting permissions

### Screenshot Cancelled Message
**Cause**: You pressed `Escape` or clicked away during window/area selection  
**Solution**: This is normal behavior - just try again

### File Not Found Errors
**Cause**: Screenshot folder doesn't exist or has permission issues  
**Solution**: The plugin should auto-create the folder, but you can manually create it if needed

## 🎯 Tips & Best Practices

### Workflow Optimization
- **Position your cursor** where you want images before taking screenshots
- **Use consistent folder structure** - the default "screenshots" folder keeps things organized
- **Enable timestamps** to avoid accidentally overwriting screenshots

### Integration with Other Plugins
- Works great with image editing plugins
- Compatible with image resizing and optimization plugins
- Plays well with attachment management plugins

### File Management
- Screenshots are saved as regular files in your vault
- They can be moved, renamed, or organized like any other file
- Consider using descriptive filenames by temporarily disabling timestamps

## 🔄 Workflow Examples

### Meeting Notes
1. Open your meeting notes
2. Position cursor where you want to capture something
3. Click camera icon → click presenter's window
4. Screenshot appears in your notes instantly

### Documentation
1. Writing documentation that needs UI screenshots
2. Use area selection to capture specific interface elements
3. Images automatically appear where you're writing

### Research
1. Researching online content
2. Quickly capture browser windows or specific articles
3. All screenshots organized in one folder with timestamps

## 🚧 Limitations

- **macOS only** - uses macOS-specific `screencapture` command
- **Desktop only** - mobile Obsidian doesn't support this functionality
- **Requires permissions** - needs Screen Recording access on macOS
- **Static images only** - doesn't support video capture or GIFs

## 🛠️ Development

This plugin is open source! Contributions welcome.

### Building from Source
```bash
git clone https://github.com/IanMills-GCT/obsidian-macos-screenshot-plugin.git
cd obsidian-macos-screenshot-plugin
npm install
npm run build
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Support

If you find this plugin helpful:
- ⭐ Star the repository on GitHub
- 🐛 Report bugs by opening an issue
- 💡 Suggest features via GitHub issues
- 📝 Help improve documentation

## 📞 Getting Help

1. **Check this README** for common solutions
2. **Search existing issues** on GitHub
3. **Open a new issue** if you can't find a solution
4. **Join the discussion** on the Obsidian forum

## 🔗 Links

- [GitHub Repository](https://github.com/IanMills-GCT/obsidian-macos-screenshot-plugin.git)
- [Issue Tracker](https://github.com/IanMills-GCT/obsidian-macos-screenshot-plugin/issues)
- [Obsidian Community Forum](https://forum.obsidian.md/)
- [Obsidian Discord](https://discord.gg/veuWUTm)

---

**Made with ❤️ for the Obsidian community**

*Streamline your screenshot workflow on macOS and keep your notes visual and engaging!*
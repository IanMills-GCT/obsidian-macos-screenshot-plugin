#!/bin/bash
VAULT_PATH="$HOME/Library/CloudStorage/OneDrive-CongressWBN/Vault/AppDev/.obsidian/plugins/screenshot-plugin"

# Create directory if it doesn't exist
#mkdir -p "$VAULT_PATH"

# Copy files
cp main.js manifest.json "$VAULT_PATH/"

# Copy styles.css if it exists
if [ -f "styles.css" ]; then
    cp styles.css "$VAULT_PATH/"
fi

echo "Plugin deployed to test vault!"

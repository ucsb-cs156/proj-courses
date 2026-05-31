#!/bin/bash

# ==============================================================================
# USAGE INSTRUCTIONS:
# This script modifies your current shell environment to switch Node versions.
# Because of this, running it normally (e.g., './script.sh') WILL NOT WORK.
# 
# You MUST source the script so it executes in your current terminal session:
#   source ./nvm-pj.sh   OR   . ./nvm-pj.sh
# ==============================================================================

# 1. Locate the node version line, isolate the value, and strip unwanted characters (^, ~, v, quotes, spaces, commas)
CLEAN_VERSION=$(grep '"node":' package.json | head -n 1 | cut -d':' -f2 | tr -d '"^~v, ')

# Check if a version was successfully extracted
if [ -z "$CLEAN_VERSION" ]; then
  echo "❌ Error: Could not find 'node' engine defined in package.json"
  # Use return instead of exit so it doesn't close the user's terminal when sourced
  return 1 2>/dev/null || exit 1
fi

echo "✅ Found Node version target: $CLEAN_VERSION"

# 2. Load NVM into this script session (NVM is a shell function, not a system binary)
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "❌ Error: NVM directory not found at $NVM_DIR"
  return 1 2>/dev/null || exit 1
fi

# 3. Switch to the extracted version
nvm use "$CLEAN_VERSION"
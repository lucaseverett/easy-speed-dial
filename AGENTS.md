# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Easy Speed Dial is a cross-platform browser extension that replaces the new tab page with a customizable grid of bookmarks. It supports Chrome, Firefox, and has a web demo version.

## Key Architecture

- **Multi-target builds**: Uses environment variables (`PROJECT=chrome|firefox|demo`) to build different versions
- **State management**: MobX for reactive state management with multiple stores:
  - `useBookmarks` (src/stores/useBookmarks/index.ts) - manages browser bookmarks via WebExtension API, includes folder navigation, CRUD operations, and real-time sync
  - `useSettings` (src/stores/useSettings/index.ts) - handles user preferences, theming, custom colors/images, dial customization, and cross-tab synchronization via BroadcastChannel
  - `useContextMenu` (src/stores/useContextMenu.ts) - manages right-click context menu positioning and focus management
  - `useColorPicker` (src/stores/useColorPicker.ts) - handles color picker popup positioning and state
  - `useModals` (src/stores/useModals.ts) - controls modal dialogs with focus management and bookmark editing state
- **Path aliases**: Uses `#*` import paths that resolve to `./src/*`
- **Browser compatibility**: Uses webextension-polyfill for cross-browser compatibility
- **Global constants**: Vite defines `__CHROME__`, `__FIREFOX__`, `__DEMO__`, `__APP_VERSION__` at build time

## Common Commands

### Development

```bash
npm run dev        # Start development server
npm run test       # Run tests once
npm run test:watch # Run tests in watch mode
```

### Building

```bash
npm run build              # Build web demo
npm run build:chrome       # Build Chrome extension
npm run build:firefox      # Build Firefox extension
npm run preview            # Preview web build
```

### Code Quality

```bash
npm run lint    # Lint with ESLint
npm run format  # Format with Prettier
```

## File Structure

- `src/index.tsx` - Main bookmarks page entry point
- `src/settings.tsx` - Settings page entry point
- `src/stores/` - MobX state management
- `src/components/` - React components with co-located CSS
- `src/pages/` - Top-level page components
- `public/chrome/` & `public/firefox/` - Platform-specific manifests and icons
- `dist-{chrome|firefox|demo}/` - Build outputs

## Development Notes

- Uses React 19 with MobX for state management
- TypeScript with strict configuration
- Vite for building with multi-entry support (index.html, settings.html)
- Mock bookmarks system for demo mode (src/stores/useBookmarks/mockBookmarks/)
- Custom wallpapers and theming system with CSS custom properties
- Browser storage for persistence with cross-tab synchronization via BroadcastChannel

## Testing

Uses Vitest for testing. Tests are located alongside source files with `.test.ts` extensions.

## Code Conventions

- Use exports from random-color-library where applicable for color utilities

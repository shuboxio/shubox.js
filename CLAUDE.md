# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Shubox.js is a JavaScript SDK for uploading files directly to S3 from the browser. It wraps Dropzone.js and provides seamless integration with the Shubox service for S3 signatures and image transformations.

**Key capabilities:**
- Direct browser-to-S3 uploads via pre-signed URLs
- Image/video transformations (resize, crop, format conversion)
- Support for drag-and-drop, click, paste, and form element uploads
- Multiple output formats: ES module and UMD

## Build and Development Commands

### Setup
```bash
./bin/setup
```
Installs dependencies, builds demo HTML files, and creates demo config file.

### Development server
```bash
npm run dev
```
Starts Vite dev server at http://localhost:8888 with demo pages.

### Testing
```bash
npm test              # Run all tests once
npm run test-watch    # Run tests in watch mode
npm run test-debugger # Run tests with debugger attached
```
Tests use Vitest with jsdom environment. Main test files: `tests/shubox.test.ts`, `tests/shubox/variant.test.ts`, `tests/shubox/filename_from_file.test.ts`.

### Build
```bash
npm run build
```
Runs tests, compiles TypeScript, and builds both ES and UMD bundles to `dist/` directory.

### Running a single test
```bash
npx vitest run tests/shubox/variant.test.ts
```

## Architecture

### Core Entry Points
- `src/shubox.ts` - Re-exports default from `src/shubox/index.ts`
- `src/shubox/index.ts` - Main `Shubox` class that initializes Dropzone instances

### Main Class: Shubox (`src/shubox/index.ts`)

The `Shubox` class is the primary interface. Constructor signature:
```typescript
new Shubox(selector: string = ".shubox", options: IUserOptions = {})
```

**Key responsibilities:**
- Queries DOM for elements matching selector and initializes Dropzone for each
- Manages API endpoint configuration (signatures, uploads)
- Delegates to `ShuboxOptions` and `ShuboxCallbacks` for Dropzone configuration
- Maintains static array of all Dropzone instances in `Shubox.instances`

### Options Layer (`src/shubox/shubox_options.ts`)

`ShuboxOptions` class provides default configuration values that get merged with user options and passed to Dropzone. Key defaults:
- `acceptedFiles: "image/*"`
- `textBehavior: "replace"` (for form elements)
- `successTemplate: "{{s3url}}"` (template for inserting URLs)
- `previewsContainer: false` for INPUT/TEXTAREA elements

### Callbacks Layer (`src/shubox/shubox_callbacks.ts`)

`ShuboxCallbacks` class wraps and extends Dropzone lifecycle callbacks:
- **accept**: Fetches S3 signature from Shubox API before upload
- **sending**: Posts file to S3 with signed form data, handles extraParams
- **success**: Triggers transform polling, template insertion into form elements, user callbacks
- **addedfile**: Handles uploadingTemplate insertion
- **error**: Delegates to user error handler
- **pasteCallback**: Static method for handling paste events

The callbacks bridge between Dropzone events and Shubox-specific functionality like transform polling and S3 signature generation.

### Transform System (`src/shubox/transform_callback.ts`, `src/shubox/variant.ts`)

Transforms are image/video variants generated server-side (e.g., "200x200#" for crop, ".webp" for format conversion).

**Workflow:**
1. User specifies transforms in options: `transforms: { "200x200#": (file) => {...} }`
2. `TransformCallback` class polls Shubox upload API for transform completion
3. When transform ready, executes user callback with `file.transform.s3url`
4. `Variant` class parses transform strings and generates polling endpoints

### Utility Modules
- `src/shubox/filename_from_file.ts` - Extracts filename from file objects
- `src/shubox/insert_at_cursor.ts` - Inserts text at cursor position in form elements
- `src/shubox/object_to_form_data.ts` - Converts objects to FormData for multipart requests
- `src/shubox/upload_complete_event.ts` - Custom event dispatched when upload completes

## TypeScript Configuration

- Path alias: `~` maps to `./src` (configured in tsconfig.json and vite.config.mts)
- Target: ESNext with DOM types
- Strict mode enabled
- Types include: vite/client, node

## Build System (Vite)

Configuration in `vite.config.mts`:
- Entry point: `src/shubox.ts`
- Outputs ES module (`shubox.es.js`) and UMD bundle (`shubox.umd.js`)
- UMD global name: `Shubox`
- TypeScript declarations generated to `dist/shubox.d.ts`
- Dev server port: 3000 (note: README says 8888 in dev command)

## Dropzone Integration

Shubox wraps Dropzone.js (v5.7.2) and extends its functionality. All Dropzone configuration options can be passed through to Shubox options. Key integration points:
- Shubox disables Dropzone.autoDiscover
- Dropzone URL set to dummy "http://localhost" initially, then updated per-file with S3 endpoint
- File uploads go directly to S3, not to Dropzone's configured URL
- Dropzone instances stored in `Shubox.instances` array

## Demo Pages

Demo HTML files in `demo/` directory are built by `bin/build_html.rb` from partials. Requires sandbox key from https://dashboard.shubox.io/v2/sandbox.txt placed in `demo/javascript/shubox_config.js`.

## API Communication

**Signature endpoint:** `POST https://api.shubox.io/signatures`
- Fetches pre-signed S3 form data
- Body: FormData with file metadata, key, s3Key
- Returns: AWS endpoint URL, signature, policy, and S3 key

**Upload completion endpoint:** `GET https://api.shubox.io/uploads/:id`
- Polls for transform status after upload
- Used by `TransformCallback` to detect when transforms are ready

Custom base URLs can be configured via `baseUrl`, `signatureUrl`, or `uploadUrl` options.

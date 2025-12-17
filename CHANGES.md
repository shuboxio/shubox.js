# Shubox.js Changes

## Master

## 2.0.0

### Added

- **7-module architecture** - Reorganized into core, api, dom, errors, events, transforms, and utils modules.
- **Specialized modules** - ShuboxConfig, ShuboxDomRenderer, ShuboxApiClient, ShuboxErrorHandler, ShuboxResourceManager, ShuboxTransformManager.
- **Typed error system** - Error classes (NetworkError, TimeoutError, OfflineError, UploadError, TransformError) with error codes.
- **Custom events** - Lifecycle events for error, timeout, retry, and recovery monitoring.
- **Automatic retry** - Network failures retry with exponential backoff, configurable via retryAttempts.
- **Offline detection** - Auto-detects offline state and disables/re-enables uploads accordingly.
- **Template variables** - Form values support {{name}}, {{s3url}}, {{size}} interpolation.

### Changed

- **Source organization** - Moved from flat to modular structure following TypeScript conventions.
- **ShuboxCallbacks** - Refactored to coordinate modules via dependency injection.
- **Error callback** - Now receives typed Error objects instead of strings.
- **Import paths** - Updated all files to new module structure.
- **Form updates** - Support replace, append, and insertAtCursor behaviors with templates.

### Removed

- **Flat file structure** - Replaced with modular subdirectories.
- **Inline error handling** - Delegated to ShuboxErrorHandler.
- **Private callback helpers** - Moved to specialized modules.

### Fixed

- **Uploading template bug** - uploadingTemplate now properly replaced by successTemplate.
- **Async test errors** - Fixed unhandled promise rejections.
- **Type safety** - Fixed callback types and removed unsafe assertions.
- **Memory leaks** - Added cleanup for retry timeouts and CSS classes.

## v1.1.0

## v0.5.2

- Lock Dropzone to 5.7.1.

## v0.5.1

- Add method to directly upload generated file objects. See [README](https://github.com/shuboxio/shubox.js#uploading-a-file-directly-from-javascript).
- Lock Dropzone to 5.5.1.
- Turn off the camera's streams when finished recording in addition to explicitly stopping the camera.

## v0.5.0

- Update README.md with information regarding new string interpolation capabilities in the `s3Key` option.
- Add this file - CHANGES.md - for clearer visibility into the new things delivered to the library.
- Update list of codecs supported for the MediaRecorder options so that Firefox now works. Now using `video/webm;codecs="vp8,opus"` for FF.
- Refactor video events to accommodate Safari. Use the `onstop` event on the MediaRecorder object, since Safari does not have access to the recorded chunks until that event in the lifecycle is fired.
- Fix bug with `uploadingTemplate` value not being replaced by the final `successTemplate`

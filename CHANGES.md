Shubox.js Changes
=================

Master
------

v1.1.0
------

### Error Handling Improvements (Phases 1 & 2)

* **New error type system** - Typed error classes (`NetworkError`, `SignatureError`, `UploadError`, `TransformError`, `ValidationError`, `TimeoutError`, `OfflineError`) with error codes for better error handling
* **Automatic retry with exponential backoff** - Network failures automatically retry up to 3 times (configurable via `retryAttempts` option)
* **Transform failure notifications** - Transform failures now invoke the error callback instead of failing silently
* **HTTP status validation** - Proper validation of HTTP response status codes before processing
* **Timeout protection** - All network requests have configurable timeout support (default: 30s, configurable via `timeout` option)
* **Offline detection** - Uploads are blocked immediately when offline with clear error message
* **Upload complete error handling** - Metadata upload failures now retry automatically and log properly
* New `retryAttempts` option - Configure number of retry attempts (default: 3)
* New `timeout` option - Configure request timeout in milliseconds (default: 30000)
* Enhanced `error` callback - Now receives typed error objects with `code`, `message`, `recoverable`, and `originalError` properties
* **Breaking change (minor)**: Error callback may now receive Error objects instead of just strings (backward compatible - string errors still work)

### Other Changes

* New `transforms` option instead of `transformName` and `transformCallbacks`. See README.md
* Upgrade lerna (7.4.1)
* Update logic to detect and set codec(s) when capturing video/audio.
* Upgrade typescript to `3.9.7` (yes. it's behind).
* Add .tool-versions file to specify versions of nodejs and python to use in building.
* Update scripts to fall back to legacy ssl provider.
* Fix bug with portraitMode where the logic for width and height were opposite of what is desired.

v0.5.2
------

* Lock Dropzone to 5.7.1.

v0.5.1
-------

* Add method to directly upload generated file objects. See [README](https://github.com/shuboxio/shubox.js#uploading-a-file-directly-from-javascript).
* Lock Dropzone to 5.5.1.
* Turn off the camera's streams when finished recording in addition to explicitly stopping the camera.

v0.5.0
------

* Update README.md with information regarding new string interpolation capabilities in the `s3Key` option.
* Add this file - CHANGES.md - for clearer visibility into the new things delivered to the library.
* Update list of codecs supported for the MediaRecorder options so that Firefox now works. Now using `video/webm;codecs="vp8,opus"` for FF.
* Refactor video events to accommodate Safari. Use the `onstop` event on the MediaRecorder object, since Safari does not have access to the recorded chunks until that event in the lifecycle is fired.
* Fix bug with `uploadingTemplate` value not being replaced by the final `successTemplate`

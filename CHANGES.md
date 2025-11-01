Shubox.js Changes
=================

Master
------

### Error Handling Improvements

** Foundation & Critical Fixes**

* **New error type system** - Typed error classes (`NetworkError`, `SignatureError`, `UploadError`, `TransformError`, `ValidationError`, `TimeoutError`, `OfflineError`) with error codes for better error handling
* **HTTP status validation** - Proper validation of HTTP response status codes before processing
* **Transform failure notifications** - Transform failures now invoke the error callback instead of failing silently
* **Upload complete error handling** - Metadata upload failures now retry automatically and log properly
* Enhanced `error` callback - Now receives typed error objects with `code`, `message`, `recoverable`, and `originalError` properties

**Automatic Retry Mechanisms**

* **Automatic retry with exponential backoff** - Network failures automatically retry with smart backoff (1s, 2s, 4s...)
* **Intelligent error classification** - Automatically determines which errors should be retried (5xx, timeouts, network failures) vs. which shouldn't (4xx client errors)
* **Signature fetch retry** - S3 signature requests retry on recoverable failures
* **S3 upload retry** - Failed uploads automatically retry up to configured limit
* New `retryAttempts` option - Configure number of retry attempts (default: 3)
* New `onRetry` callback - Optional callback invoked on each retry attempt
* New `timeout` option - Configure request timeout in milliseconds (default: 60000 for uploads, 30000 for signatures)

**Enhanced User Feedback**

* **Offline detection with prevention** - Automatically detects offline state and disables file selection, re-enables when connection restored
* **Improved error messages** - Context-aware, actionable error messages (e.g., "Upload timed out. Please check your connection and try again.")
* **Comprehensive event system** - New custom events for monitoring upload lifecycle:
  - `shubox:error` - Dispatched when errors occur
  - `shubox:timeout` - Dispatched on timeout
  - `shubox:retry:start` - Dispatched on first retry attempt
  - `shubox:retry:attempt` - Dispatched on each retry with attempt details
  - `shubox:recovered` - Dispatched when upload succeeds after retries
* New `offlineCheck` option - Enable/disable offline detection (default: true)
* Visual offline indicators - Adds `shubox-offline` CSS class and `data-shubox-offline` attribute when offline
* All events bubble up the DOM and are cancelable for flexible integration

**Graceful Degradation**

* **Resource cleanup on cancel** - Properly cleans up retry state, pending timeouts, CSS classes, and progress attributes when uploads are canceled or files removed
* **Lifecycle callbacks** - New `canceled`, `removedfile`, and `queuecomplete` callbacks for handling upload lifecycle events
* **Partial success handling** - Main upload success callback fires even if transforms fail; transform failures reported separately with clear messages
* **Non-blocking metadata** - Upload complete notification failures logged but don't block UI (main upload already succeeded)
* **Memory leak prevention** - All timeouts cleared, retry counters reset, no orphaned resources
* **CSS class management** - Proper cleanup of `.shubox-uploading`, `.shubox-error`, and progress indicators throughout lifecycle

**Configuration Options Summary:**
* `timeout` - Request timeout in milliseconds (default: 60000)
* `retryAttempts` - Number of retry attempts (default: 3)
* `offlineCheck` - Enable offline detection (default: true)
* `onRetry` - Callback for retry attempts: `(attempt, error, file) => {}`
* `canceled` - Callback when upload is canceled: `(file) => {}`
* `removedfile` - Callback when file is removed: `(file) => {}`
* `queuecomplete` - Callback when upload queue completes: `() => {}`

**Breaking Changes:**
* **Minor**: Error callback may now receive Error objects instead of just strings (backward compatible - string errors still work)
* **Minor**: `TimeoutError` and `OfflineError` now extend `ShuboxError` directly instead of `NetworkError` (improves TypeScript readonly property handling)

v1.1.0
------


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

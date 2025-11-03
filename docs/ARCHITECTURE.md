# Shubox.js Architecture Documentation

## Overview

Shubox.js is organized into 7 independent modules, each responsible for a specific aspect of the file upload workflow. This modular architecture enables better testability, maintainability, and supports tree-shaking for smaller bundle sizes.

## Module Structure

```
src/shubox/
├── index.ts                          # Public API entry point
├── core/
│   ├── Shubox.ts                    # Main library class
│   ├── ShuboxCallbacks.ts           # Dropzone callback coordination
│   ├── ShuboxOptions.ts             # Option processing
│   ├── types.ts                     # Type definitions
│   └── index.ts                     # Barrel export
├── api/
│   ├── ApiClient.ts                 # S3 signature fetching
│   ├── fetchWithRetry.ts            # Network utility with retries
│   ├── uploadCompleteEvent.ts       # Metadata upload notifications
│   └── index.ts                     # Barrel export
├── dom/
│   ├── DomRenderer.ts               # DOM state management
│   ├── insertAtCursor.ts            # Text insertion utility
│   ├── ResourceManager.ts           # File lifecycle management
│   └── index.ts                     # Barrel export
├── errors/
│   ├── ShuboxError.ts               # Error type definitions
│   ├── ErrorHandler.ts              # Error handling and retries
│   └── index.ts                     # Barrel export
├── events/
│   ├── dispatchEvent.ts             # Custom event system
│   └── index.ts                     # Barrel export
├── transforms/
│   ├── TransformManager.ts          # Transform coordination
│   ├── TransformCallback.ts         # Transform callbacks
│   ├── Variant.ts                   # Variant handling
│   └── index.ts                     # Barrel export
└── utils/
    ├── config.ts                    # Configuration constants
    ├── filenameFromFile.ts          # Filename extraction
    ├── objectToFormData.ts          # Object conversion
    └── index.ts                     # Barrel export
```

## Module Responsibilities

### Core Module

**Shubox.ts** - Main library orchestrator

- Initializes the library
- Creates Dropzone instances
- Sets up offline detection
- Manages online/offline event listeners
- Entry point for the entire library

**ShuboxCallbacks.ts** - Callback coordinator

- Implements Dropzone callback handlers
- Coordinates between all other modules
- Delegates to appropriate modules for each responsibility
- Uses dependency injection to receive module instances

**ShuboxOptions.ts** - Configuration processor

- Handles user-provided options
- Merges with default configuration
- Validates option values

**types.ts** - Type definitions

- Defines all TypeScript interfaces and types
- Extends Dropzone types where needed
- Documents expected data structures

### API Module

**ApiClient.ts** - API communication

- Fetches S3 signatures for file uploads
- Handles retry logic through `fetchWithRetry`
- Manages request timeout and configuration
- Processes API responses

**fetchWithRetry.ts** - Network utility

- Implements fetch with exponential backoff
- Handles timeout with AbortController
- Classifies HTTP status codes
- Determines if errors are retryable
- Merges multiple abort signals

**uploadCompleteEvent.ts** - Metadata notifications

- Sends upload completion data to backend
- Non-blocking (failures logged but don't block UI)
- Handles retry of metadata uploads
- Prepares form data for submission

### DOM Module

**DomRenderer.ts** - DOM state management

- Manages CSS class lifecycle (uploading, success, error)
- Updates form element values with templates
- Manages progress indicators via data attributes
- Handles cursor positioning in textareas/inputs
- Provides template interpolation

**insertAtCursor.ts** - Text insertion utility

- Inserts text at cursor position in inputs/textareas
- Preserves existing text
- Works with selection ranges

**ResourceManager.ts** - File lifecycle management

- Tracks and cleans up retry timeouts
- Removes CSS classes on upload completion
- Cleans up retry counters
- Manages file cancellation and removal
- Prevents memory leaks

### Errors Module

**ShuboxError.ts** - Error type system

- Defines base `ShuboxError` class
- Implements specific error types:
  - `NetworkError` - Network failures
  - `TimeoutError` - Request timeouts
  - `OfflineError` - Offline detection
  - `UploadError` - S3 upload failures
  - `TransformError` - Image transform failures
  - `ValidationError` - File validation failures
- Each error has code, message, and recoverable flag

**ErrorHandler.ts** - Error handling and retries

- Classifies errors as recoverable or not
- Calculates exponential backoff delays
- Dispatches error events (error, timeout, retry, recovered)
- Determines which errors should be retried
- Integrates with custom event system

### Events Module

**dispatchEvent.ts** - Custom event system

- Dispatches custom events throughout upload lifecycle
- Events bubble and are cancelable
- Provides strongly typed event details
- Integrates with error handling for error events

### Transforms Module

**TransformManager.ts** - Transform coordination

- Checks if transforms are configured
- Lists available transform variants
- Coordinates transform processing

**TransformCallback.ts** - Transform success callbacks

- Executes user callbacks when transforms are ready
- Handles variant-specific callbacks
- Integrates with error handling for transform failures

**Variant.ts** - Variant handling

- Processes image variants
- Manages variant URLs and metadata

### Utils Module

**config.ts** - Configuration constants

- `DEFAULT_TIMEOUT` - Default request timeout (30000ms)
- `DEFAULT_RETRY_ATTEMPTS` - Default retry count (3)
- `REPLACEABLE_VARIABLES` - Template placeholder names
- `DEFAULT_ACCEPTED_FILES` - Default file types (image/\*)
- `DEFAULT_TEXT_BEHAVIOR` - Default text insertion mode (replace)
- `DEFAULT_SUCCESS_TEMPLATE` - Default success template
- `DEFAULT_UPLOADING_TEMPLATE` - Default uploading template

**filenameFromFile.ts** - Filename extraction

- Extracts filename from file object
- Handles special characters and encoding

**objectToFormData.ts** - Object serialization

- Converts objects to FormData format
- Handles nested objects
- Preserves field types

## Data Flow

### Upload Workflow

1. **User selects file** → Dropzone detects file
2. **addedfile callback** → ShuboxCallbacks.addedfile() sets default options
3. **accept callback** → ShuboxApiClient fetches S3 signature → signature attached to file
4. **sending callback** → Prepares FormData with S3 credentials
5. **uploadProgress callback** → ShuboxDomRenderer updates progress indicator
6. **success callback** → parseS3URL → ShuboxDomRenderer sets success state → uploadCompleteEvent sends metadata → TransformCallbacks execute
7. **error callback** → ShuboxErrorHandler determines if recoverable → if recoverable: schedules retry, else: ShuboxDomRenderer sets error state

### Retry Logic

1. **Error occurs** → ShuboxErrorHandler.isRecoverableError() checks error type
2. **If recoverable** → calculateBackoffDelay() schedules retry with exponential backoff
3. **dispatchRetryEvent()** → Notifies user of retry attempt via custom events
4. **File re-queued** → Dropzone re-processes file
5. **Retry succeeds** → dispatchRecoveredEvent() notifies user of recovery
6. **All retries exhausted** → error callback invoked with final error

### Offline Detection

1. **Library initialization** → Shubox.\_setupOfflineDetection() adds event listeners
2. **User goes offline** → offline event fires → all dropzones disabled
3. **User comes online** → online event fires → all dropzones enabled

## Dependency Injection Pattern

The library uses constructor injection for dependencies:

```typescript
// ShuboxCallbacks constructor
constructor(shubox: Shubox, instances: Dropzone[]) {
  this.domRenderer = new ShuboxDomRenderer(shubox.element);
  this.apiClient = new ShuboxApiClient(shubox);
  this.errorHandler = new ShuboxErrorHandler(shubox.element);
  this.resourceManager = new ShuboxResourceManager(shubox.element);
  this.transformManager = new ShuboxTransformManager();
}
```

Benefits:

- **Testability** - Easy to mock dependencies in tests
- **Flexibility** - Can swap implementations without changing call sites
- **Clarity** - Dependencies are explicit and visible
- **Loose coupling** - Modules don't create their own dependencies

## Testing Strategy

Each module has focused unit tests:

- **config.test.ts** - Tests constant values
- **api_client.test.ts** - Tests API communication and error handling
- **dom_renderer.test.ts** - Tests DOM manipulation
- **error_handler.test.ts** - Tests error classification and retry logic
- **fetch_with_retry.test.ts** - Tests network retry mechanism
- **transform_manager.test.ts** - Tests transform coordination
- **etc.**

Integration tests verify modules work together correctly.

## Adding New Features

To add a new feature:

1. **Identify the module** - Which concern does it belong to?
   - Network operations? → API module
   - DOM changes? → DOM module
   - Error handling? → Errors module
   - etc.

2. **Create the module file** in the appropriate directory

3. **Write tests first** following TDD pattern

4. **Update types** if adding new public interfaces

5. **Create barrel export** in `src/shubox/{module}/index.ts`

6. **Integrate with callbacks** if it affects the upload workflow by updating `ShuboxCallbacks.ts`

## Import Guidelines

**Public imports** (for library users):

```typescript
import Shubox, { NetworkError, TimeoutError, OfflineError } from 'shubox';
```

**Internal imports** (between modules):

```typescript
// Relative path from one module to another
import { ShuboxApiClient } from '../api/ApiClient';
import type { SignatureResponse } from '../core/types';
```

**Never**:

- Import from `src/` paths in production code
- Create circular dependencies between modules
- Import private/internal implementation details
- Bypass modules to access functionality

## Performance Considerations

- **Tree-shaking** - Unused modules are eliminated by bundlers
- **Lazy loading** - Consider code splitting for large transforms
- **Memory** - Resource cleanup prevents memory leaks from retry timeouts
- **Network** - Exponential backoff reduces server load during failures
- **DOM** - CSS class changes are batched where possible

## Future Improvements

- Consider making modules pluggable for different S3 providers
- Add more granular error types for better user feedback
- Implement transform caching for repeated uploads
- Add metrics/telemetry integration points
- Support for parallel uploads with shared configurations

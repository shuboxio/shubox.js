# Bug Report: uploadingTemplate Not Being Inserted Into Form Elements

**Date:** 2025-10-30
**Severity:** High
**Component:** `src/shubox/shubox_callbacks.ts`
**Status:** Fixed

## Summary

When using Shubox with `uploadingTemplate` and `successTemplate` options, no text was being inserted into textarea/input elements during file upload. The issue affected the complete upload flow where users expected to see temporary "uploading" text that would be replaced with the final URL upon completion.

## Symptoms

- No text appeared in the textarea/input during file upload
- No text appeared after successful upload
- Console logs showed `interpolatedText` was being generated correctly
- Console logs showed "placing after text" code path was being executed
- No JavaScript errors were thrown

## Root Cause Analysis

### The Bug

The `_updateFormValue` method (lines 253-257) did not handle `templateName="uploadingTemplate"`. The ternary expression only checked for two cases:
- `"successTemplate"`
- `"s3urlTemplate"` (deprecated)

When called with `templateName="uploadingTemplate"`, it fell through to `undefined`.

```typescript
// BEFORE (buggy code)
const templateValue = effectiveTemplateName === "successTemplate"
    ? this.shubox.options.successTemplate
    : effectiveTemplateName === "s3urlTemplate"
        ? this.shubox.options.s3urlTemplate
        : undefined;  // ← uploadingTemplate falls through to here!
```

### The Cascade Effect

This caused a cascade of failures in the upload flow:

#### Phase 1: Sending (Upload Starts)
1. Line 109: `_updateFormValue(file, "uploadingTemplate")` is called
2. Lines 253-257: `templateValue = undefined` (because "uploadingTemplate" not handled)
3. Lines 259-262: Condition `if (templateValue)` is false, so `interpolatedText` stays as `""`
4. Lines 270-277: `uploadingText` is built correctly but not used in this phase
5. Lines 297-301: With `textBehavior: "append"`, executes: `el.value = el.value + ""`
   - **Result: Nothing gets added to the textarea**

#### Phase 2: Success (Upload Completes)
1. Line 155: `_updateFormValue(file, "successTemplate")` is called
2. `interpolatedText` is built correctly: `![test.jpg](https://example.com/test.jpg)`
3. `uploadingText` is built correctly: `![Uploading test.jpg...]()`
4. Lines 282-289: Tries to replace uploadingText with interpolatedText
5. Line 286: `el.value = el.value.replace(uploadingText, interpolatedText)`
   - **Problem: `uploadingText` was never inserted during Phase 1**
   - JavaScript's `.replace()` returns original string unchanged if search string not found
   - **Result: Textarea remains empty**

### Why _placeCursorAfterText Wasn't The Problem

The method `_placeCursorAfterText` (lines 309-314) only positions the cursor - it doesn't insert text. It:
1. Finds the text position in `el.value`
2. Calculates position after the text
3. Sets the selection range (cursor position)
4. Focuses the element

This method works correctly, but only if the text was already inserted by `_updateFormValue`.

## The Fix

### Code Changes

**File:** `src/shubox/shubox_callbacks.ts`

**Change 1: Add uploadingTemplate handling (lines 253-259)**
```typescript
// AFTER (fixed code)
const templateValue = effectiveTemplateName === "successTemplate"
    ? this.shubox.options.successTemplate
    : effectiveTemplateName === "s3urlTemplate"
        ? this.shubox.options.s3urlTemplate
        : effectiveTemplateName === "uploadingTemplate"
            ? this.shubox.options.uploadingTemplate  // ← Added this case
            : undefined;
```

**Change 2: Add uploadingTemplate to TypeScript interface (line 18)**
```typescript
export interface IShuboxDefaultOptions {
    success?: (file: Dropzone.DropzoneFile) => void;
    error?: (file: Dropzone.DropzoneFile, message: string) => void;
    sending?: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: any) => void;
    addedfile?: (file: Dropzone.DropzoneFile) => void;
    textBehavior?: string;
    s3urlTemplate?: string;
    successTemplate?: string;
    uploadingTemplate?: string;  // ← Added this property
    acceptedFiles?: string;
    // ... rest of interface
}
```

### How The Fix Works

Now the flow works correctly:

1. **During sending:** `uploadingTemplate` gets processed → `interpolatedText` is set → text is appended to textarea
2. **During success:** The appended uploading text gets found and replaced with the success text

## Missing Test Coverage

### Current State
No tests exist for `ShuboxCallbacks` or the `_updateFormValue` method.

### Test That Would Have Caught This Bug

```typescript
describe('ShuboxCallbacks', () => {
  describe('_updateFormValue with uploadingTemplate', () => {
    test('inserts uploadingTemplate text during sending phase', () => {
      // Setup
      const textarea = document.createElement('textarea');
      textarea.id = 'test-textarea';
      document.body.appendChild(textarea);

      const shubox = new Shubox('#test-textarea', {
        key: 'test-key',
        uploadingTemplate: '![Uploading {{name}}...]()\n',
        successTemplate: '![{{name}}]({{s3url}})\n',
        textBehavior: 'append'
      });

      // Create a mock file
      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        s3: 'path/to/test.jpg',
        s3url: 'https://example.com/test.jpg',
        postData: {}
      };

      // Trigger the sending callback (upload starts)
      const callbacks = shubox.callbacks.toHash();
      callbacks.sending.call(shubox, mockFile, new XMLHttpRequest(), new FormData());

      // Assert: uploadingTemplate should be in the textarea
      expect(textarea.value).to.contain('![Uploading test.jpg...]()');
    });

    test('replaces uploadingTemplate with successTemplate on upload success', () => {
      // Setup
      const textarea = document.createElement('textarea');
      textarea.id = 'test-textarea';
      document.body.appendChild(textarea);

      const shubox = new Shubox('#test-textarea', {
        key: 'test-key',
        uploadingTemplate: '![Uploading {{name}}...]()\n',
        successTemplate: '![{{name}}]({{s3url}})\n',
        textBehavior: 'append'
      });

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        s3: 'path/to/test.jpg',
        s3url: 'https://example.com/test.jpg',
        postData: {}
      };

      const callbacks = shubox.callbacks.toHash();

      // First: sending (upload starts)
      callbacks.sending.call(shubox, mockFile, new XMLHttpRequest(), new FormData());

      // Then: success (upload completes)
      const mockResponse = '<Location>https://example.com/test.jpg</Location>';
      callbacks.success.call(shubox, mockFile, mockResponse);

      // Assert: uploadingTemplate should be replaced with successTemplate
      expect(textarea.value).to.not.contain('Uploading');
      expect(textarea.value).to.contain('![test.jpg](https://example.com/test.jpg)');
    });
  });
});
```

### Why These Tests Would Have Caught The Bug

1. **First test (sending phase):** Would fail because `uploadingTemplate` wasn't being processed, textarea would remain empty
2. **Second test (success phase):** Would fail because the replace operation would find nothing to replace, textarea would remain empty

### Additional Test Coverage Needed

- Different `textBehavior` options: `append`, `insertAtCursor`, `replace`
- Handling of deprecated `s3urlTemplate` option
- Edge cases: missing templates, empty file names, special characters in filenames
- `_placeCursorAfterText` cursor positioning behavior
- Multiple file uploads with different templates
- Template interpolation for all supported variables: `{{name}}`, `{{s3url}}`, `{{s3}}`, `{{size}}`, `{{type}}`, `{{width}}`, `{{height}}`

## Debugging Methodology Used

This bug was discovered and fixed using **systematic debugging**:

1. **Phase 1: Root Cause Investigation**
   - Gathered evidence about actual vs expected behavior
   - Identified console log outputs showing "placing after text"
   - Traced the data flow through both sending and success phases
   - Examined the `interpolatedText` values at each step

2. **Phase 2: Pattern Analysis**
   - Compared the code path for uploadingTemplate vs successTemplate
   - Identified the missing case in the ternary expression

3. **Phase 3: Hypothesis**
   - Hypothesis: "uploadingTemplate is not being handled in lines 253-257, causing templateValue to be undefined"
   - Verification: Traced through the code confirming the hypothesis

4. **Phase 4: Implementation**
   - Added the missing case for uploadingTemplate
   - Added the TypeScript interface property
   - Verified the fix addresses the root cause

## Key Takeaways

1. **Silent failures are dangerous:** The bug caused no errors but completely broke functionality
2. **Test the happy path:** Even basic integration tests would have caught this
3. **Template systems need comprehensive handling:** When adding template options, ensure all code paths handle all templates
4. **JavaScript's replace() is silent:** When the search string isn't found, it returns the original unchanged - no error
5. **Systematic debugging works:** Following the process from symptoms → root cause → fix prevented guess-and-check thrashing

## References

- Bug location: `src/shubox/shubox_callbacks.ts:253-259`
- Related methods: `_updateFormValue`, `sending`, `success`
- Related options: `uploadingTemplate`, `successTemplate`, `textBehavior`
- Testing framework: Vitest with jsdom environment

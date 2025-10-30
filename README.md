<p width="100%" bgcolor="#f9f2ff" align="center">
  <img src="https://shubox.io/assets/blog/shubox.svg" width="150" height="150">
</p>

<p align="center"g>
  <br>
  <a href="https://www.npmjs.com/package/shubox"><img src="https://img.shields.io/npm/v/shubox.svg?style=flat" alt="npm"></a>
  <a href="https://www.npmjs.com/package/shubox"><img src="https://img.shields.io/npm/dt/shubox.svg" alt="downloads" ></a><br>
</p>

# Shubox

> Simple. Fast. _Customizable._
> Upload images from your web app directly to Amazon S3.

## What does this do?

The Shubox mission is to take the tedium and boilerplate out of the web-based
file storage and image manipulation story. After creating your Shubox account,
and setting our js library up on your website(s), you will be able to:

* Upload to S3, "the internet's ftp server", **_directly_ from the web browser**.
* Manipulate and transform images and videos after they are uploaded -
  **cropping, optimizing, changing formats**.
* Using front-end technologies you are comfortable with, **Javascript and
  CSS**, you can create the user experience YOU want using our Javascript
  library. We have [some demos at Codepen](https://codepen.io/shubox/)!

## Why?

Quite frankly I was tired of setting up the file attachment library du jour
that was uploading files to an app server **then** to S3. It was slow, it
hogged compute resources, it was repetitive and rote. In addition to that, the
solutions that existed that did this sort of thing were ugly, hamfisted, and
didn't provide for ways to customize the user experience that I wanted. I built
Shubox so that I had some way to quickly and elegantly build the file upload
processes that lived in my mind's eye.

## Huh?

Visit [shubox.io](https://shubox.io) to learn more. Contact the Shubox team
directly via [email](mailto://team@shubox.io), or the "Send a Message" chat box
on bottom right of the Shubox website (thanks
[smallchat](https://small.chat/)!).

Follow [@shuboxio](https://twitter.com/shuboxio) on Twitter for important
announcements, or the occasional pithy tweet.

***

# Table of Contents

* [Installation](#installation)
	* [Using the "Sandbox"](#using-the-sandbox)
	* [Signing Up](#sign-up-for-an-account)
	* [Download the Library](#download-the-library)
	* [Your First Shubox Code](#initialize-your-shubox-object)
* [Set Up Your Own S3 Bucket](#set-up-your-own-s3-bucket)
* [Examples &amp; Ideas](#examples--ideas)
* [Library Documentation](#library-documentation)
	* [Event Lifecycle Callbacks](#event-lifecycle-callbacks)
	* [Error Handling](#error-handling)
		* [Error Types](#error-types)
		* [Automatic Retry](#automatic-retry)
		* [Offline Detection](#offline-detection)
		* [Transform Error Handling](#transform-error-handling)
* [Development Notes](#development-notes)
	* [Setup](#development-setup)
	* [Lerna](#lerna)
* [Code of Conduct](#code-of-conduct)

***

# Installation

## Using the "Sandbox"

To get things working as fast as possible we'll operate under the understanding
that we'll use a **sandbox** bucket that we've already set up. It's an
ephemeral S3 bucket with limitations that you can use to upload and test
against.

## Sign up for an account

There's a lot under the hood (bucket setup, signatures, CORS policies) that
needs to happen in order to get things working just right. We handle all of
that stuff via the Shubox service.

1. [Sign up for an account at Shubox](https://dashboard.shubox.io/sign_up)
2. [Obtain your "Sandbox" key from the Shubox dashboard.](https://dashboard.shubox.io/v2/sandbox.txt).
   You'll need this for your Javascript code when you initialize your first Shubox object.

## Download the Library

### With Yarn or Npm

You can use npm or yarn to install the library from npm:

```sh
$ npm install shubox
$ yarn add shubox
```

Require the Shubox library in your JS, via ES module:

```javascript
import Shubox from 'shubox'
```

### Or via the UMD module (IIFE)

Download and embed the shubox js file directly in your html

```sh
$ curl -L https://unpkg.com/shubox -o public/shubox.umd.js
```

In your HTML:

```
<script src="shubox.umd.js"></script>
```

## Initialize your Shubox object

For this (very contrived) example let's say you want your users to upload an
avatar or profile photo.  You have an HTML element with the ID `"#avatar"`.
And your provided sandbox key is `"abcde-qwerty-12345`.

```
new Shubox('#avatar', { key: "abcde-qwerty-12345" })
```

That's it! When you click that element you will see a file dialog pop up where
you can select your image. Once that image is selected it will be uploaded to
the sandbox S3 bucket. Your code works! Sure, it uploads to a temporary S3
bucket, but the code works! (More info soon on how to set up your own bucket)

# Set Up Your Own S3 Bucket

Instructions coming soon!

# Examples & Ideas

Between the common and not-so-common use-cases, we've gathered some up and will
be adding to them down below for the times you might be looking for a quick
copypasta, or ideas as to what you could do with the Shubox library.

*NOTE:* All of the following are in ES6 syntax and assume that you have already
installed the shubox script into your JS bundle, or have embedded and executed
the standalone shubox.js script.

## Upload an "Avatar" and manually insert into your element

```html
<div id="avatar"></div>
```

```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const avatar = new Shubox('#avatar', {
  key: window.shuboxKey,

  // prevents from inserting the base64 preview image
  previewsContainer: false,

  success: function(file) { // passed a ShuboxFile object
    // create new image element
    let img = new Image()

    // once loaded, insert it inside div#avatar
    img.onload = function() {
      let el = document.getElementById('avatar')
      el.insertAdjacentHTML('beforeend', '<img src="' + file.s3url + '">')
    }

    // assign the src and let it load
    img.src = file.s3url
  }
})
```

![](https://shubox.io/images/README/shubox_demo_avatar.gif)

## Upload several images with preview thumbnails

```html
<div class="multiple-files-container">
  <div class="shubox--upload-target" id="shubox--multiple-files"></div>
  <div class="shubox--upload-preview" id="shubox--multiple-files-preview"></div>
</div>
```

```css
.multiple-files-container {
  padding: 40px;
  width: 500px;
  text-align: left;
  margin: 0 auto;
}

.shubox--upload-target:hover {
  border-color: silver;
}

.shubox--upload-target:before {
  content: 'Drag && Drop || Click';
  font-size: .6rem;
  color: silver;
  display: block;
  font-family: courier;
  margin-top: .4rem;
  line-height: 1rem;
}

.shubox--upload-preview {
  overflow: hidden;
}

.shubox--upload-preview > div {
  display: inline-block;
  position: relative;
  width: 4rem;
  height: 4rem;
  margin-right: 1rem;
  overflow: hidden;
}

.dz-progress {
  display: block;
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
}

.dz-upload {
  border-radius: 3px;
  height: 5px;
  background: #bce29e;
  display: block;
  clear: both;
}

.dz-upload[style="width: 100%;"] { display: none; }

.dz-error-message,
.dz-filename,
.dz-size,
.dz-success-mark,
.dz-error-mark { display: none; }

.dz-complete.dz-success .dz-success-mark,
.dz-complete.dz-error .dz-error-mark {
  display: block;
  position: absolute;
  right: 5px;
  bottom: 0px;
  text-shadow: 1px 1px white;
}
```

```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const multfiles = new Shubox("#shubox--multiple-files", {
  key: window.shuboxKey,
  previewsContainer: '#shubox--multiple-files-preview',
})
```

![Demo Multiple Files](https://shubox.io/images/README/shubox_demo_multiple_files.gif)

## Upload avatar and insert generated transform/variant image

"Transforms" are variants of uploaded images that you define as an option in
the `Shubox` initializer. For example: you may want a `100x100` sized image
generated after an 800x600 photo is uploaded, or an image to be converted to an
`avif`.

In the JS library you can define a corresponding callback that will fire once
that version of the image is generated, and HTTP request and response
successfully executed. For example, if you define a `"144x144#"` transform,
that will intelligently resize and crop all uploaded images to that exact pixel
size -- 144 pixels wide by 144 pixels tall. To run a callback once that image
exists, the following options will add an image tag with that version of the
image's URL.


```html
<div id="avatar"></div>
```

```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const avatar = new Shubox('#avatar', {
  key: window.shuboxKey,
  previewsContainer: false,

  // image transforms represented by an array of ImageMagick Geometries
  // see: https://legacy.imagemagick.org/Usage/resize/#resize
  transforms: {
    // resize and crop to 144x144
    '144x144#': function(shuboxFile) {
      // once image is found, insert an `img`
      // tag with that url as the src
      let el = document.getElementById('avatar')
      el.insertAdjacentHTML(
        'beforeend',
        `<img src='${shuboxFile.transform.s3url}'>`
      )
    }
  }
})
```

![](https://shubox.io/images/README/shubox_demo_transform_callback.gif)

## Mimicing the GitHub file upload user experience

```html
<textarea placeholder="Leave a comment or drag and drop some images."
          class="shubox--textarea"
          id="shubox--textarea"></textarea>

<div id="shubox--click-to-upload" class="shubox--click-to-upload">
  Attach files by dragging &amp; dropping, <strong>selecting them</strong>,
  or pasting from the clipboard.
</div>
```

```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const githubForm = new Shubox('#shubox--textarea', {
  key: window.shuboxKey,

  // clicking on the element corresponding to the `clickable` selector
  // will trigger the file dialog
  clickable: '#shubox--click-to-upload',

  // Once the file starts uploading the string in `uploadingTemplate` will be
  // interpolated with the file's name and added to the textarea
  uploadingTemplate: '![Uploading {{name}}...]()',

  // Once the file completes uploading the string in `successTemplate` will be
  // interpolated with the file's name and S3 url, then placed in the textarea
  successTemplate: '![{{name}}]({{s3url}})'
})
```

![](https://shubox.io/images/README/shubox_demo_github_form.gif)

## Add the final S3 url to the location of the cursor in the input/textarea

```html
<textarea placeholder="Leave a comment or drag and drop some images."
          class="shubox--textarea shubox--textarea--no-click-bar"
          id="shubox--textarea--cursor">Click to place cursor and upload.</textarea>
```


```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const atCursor = new Shubox('#shubox--textarea--cursor', {
  key: window.shuboxKey,
  // when inserting text into an input or textarea the `insertAtCursor` value
  // tells shubox to add the S3 url wherever the cursor is currently placed
  textBehavior: 'insertAtCursor',
  // the text inserted into the form element is the final S3 url with a space
  // before and after
  successTemplate: ' {{s3url}} '
})
```

![](https://shubox.io/images/README/shubox_demo_insert_at_cursor.gif)

## Replace all text in input/textarea with S3 URL

```html
<textarea
  tabindex="1"
  placeholder="Leave a comment or drag and drop some images."
  class="shubox--textarea shubox--textarea--no-click-bar"
  id="shubox--textarea--replace">Drag & drop to replace this text</textarea>
```

```javascript
const replace = new Shubox('#shubox--textarea--replace', {
  key: window.shuboxSandboxKey,
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
})
```

![](https://shubox.io/images/README/shubox_demo_replace_text.gif)

## Append S3 URL at the tail end of input/textarea

```html
<textarea
  tabindex="1"
  placeholder="Leave a comment or drag and drop some images."
  class="shubox--textarea shubox--textarea--no-click-bar"
  id="shubox--textarea--append">
    Dragging & dropping here will append after 👉
</textarea>
```

```javascript
const append = new Shubox('#shubox--textarea--append', {
  key: window.shuboxSandboxKey,
  successTemplate: ' See? Told you. Right after --> {{s3url}}',
  textBehavior: 'append',
})
```

![](https://shubox.io/images/README/shubox_demo_append_after.gif)

### Uploading a file directly from javascript

There are some cases where you might have a file object programmatically
generated for you and all you want to do is upload it to S3 yourself. Using any
combination of the options we provide to you, you can accomplish this by
explicitly calling `upload` on the instantiated Shubox object. Example:

```javascript
const shuboxObject = new Shubox('#element', { key: window.shuboxSandboxKey })
const file = new File(["contents"], "file.png", { type: "image/png" })

shuboxObject.upload(file)
```

# Library Documentation

The following section outlines what the _Shubox specific_ options are for the
Shubox object instantiation. You might ask - "Isn't it all Shubox specific?"
Well, the answer is "No" because under the hood is a wonderful little library
called [Dropzone.js](https://www.dropzonejs.com). Shubox does a tremendous
amount of heavy lifting in addition to, instead of, on top of, Dropzone.js. You
can pass any [Dropzone.js](https://www.dropzonejs.com/#configuration-options)
options to the Shubox instantiation and they will be passed along into
Dropzone.js in addition to Shubox.

Without further ado, here's what you get out of the box (~~no~~ pun intended)
with Shubox.

## Event Lifecycle callbacks

These are all piggybacking on the Dropzone events and are also [documented
there](https://www.dropzonejs.com/#events) but should be called out here
nevertheless. These are the big-ticket events that would be most often used
during the lifecycle of uploaded files.

### sending:

The `sending` callback is called immediately before each file is sent. It
receives `file`\[[1](#file-object)\], `xhr`, and `formData` objects. This
allows you to modify any or all of these object before they go in flight to
your endpoint (to add headers, etc).

```javascript
sending: function(file, xhr, formData) {}
```

### success:

Assign a function to the success key that accepts a `file` parameter which will
be run after files are successfully uploaded. More information about the `File`
type passed into this function [can be found below](#file-object).

```javascript
success: function(file) {}
```

### error:

Assign a function to the error key, accepting a [file object](#file-object) and
error message or error object. This method will be called when errors are incurred
with a file upload, during the S3 signature generation process, or when transforms fail.

Starting with version 1.1.0, the error parameter may be a typed error object
(see [Error Types](#error-types) below) which provides more context about the failure.

```javascript
error: function(file, error) {
  // error can be a string or an Error object
  if (error instanceof TransformError) {
    console.log('Transform failed for variant:', error.variant)
  } else if (error instanceof OfflineError) {
    alert('Cannot upload while offline')
  } else {
    console.log('Upload error:', error.message || error)
  }
}
```

### queuecomplete:

The queuecomplete callback will be called when all files are finished
uploading.

```javascript
queuecomplete: function() {}
```

### canceled:

The canceled callback will be called when a user cancels an upload. Shubox automatically
cleans up resources (retry state, pending timeouts, CSS classes) before calling this callback.

```javascript
canceled: function(file) {
  console.log('Upload canceled:', file.name);
  // Perform any additional custom cleanup here
}
```

### removedfile:

The removedfile callback will be called when a file is removed from the upload queue.
Shubox automatically cleans up resources before calling this callback.

```javascript
removedfile: function(file) {
  console.log('File removed:', file.name);
  // Remove any custom UI elements associated with this file
}
```

## Error Handling

Shubox.js v1.1.0+ includes comprehensive error handling with automatic retries,
timeout protection, and offline detection.

### Error Types

Shubox provides typed error classes for better error handling:

- **`NetworkError`** - Network failures or timeouts (recoverable)
- **`SignatureError`** - S3 signature fetch failures
- **`UploadError`** - S3 upload failures (includes `statusCode`)
- **`TransformError`** - Image transform failures (includes `variant` name)
- **`ValidationError`** - File validation failures
- **`TimeoutError`** - Request timeout (extends NetworkError)
- **`OfflineError`** - Offline detection (extends NetworkError)

All error types extend the base `ShuboxError` class and include:
- `code` - Error code string
- `message` - Human-readable error message
- `recoverable` - Boolean indicating if retry is possible
- `originalError` - Underlying error object (if any)

### Automatic Retry

Network failures are automatically retried with exponential backoff:

```javascript
new Shubox('#upload', {
  key: 'my-key',
  retryAttempts: 3,  // Number of retry attempts (default: 3)
  timeout: 30000,    // Request timeout in ms (default: 30000)

  error: function(file, error) {
    // Called only after all retries are exhausted
    console.error('Upload failed:', error.message)
  }
})
```

**What gets retried:**
- ✅ 5xx server errors (e.g., 500, 503)
- ✅ Network failures (connection refused, DNS failures)
- ✅ 429 rate limit errors
- ✅ Request timeouts
- ❌ 4xx client errors (e.g., 400, 404) - no retry

**Retry behavior:**
- Exponential backoff: 1s, 2s, 4s, 8s...
- Applies to signature fetching, S3 uploads, and transform polling
- Upload complete notifications also retry (non-blocking)

### Offline Detection

Shubox automatically detects when the user is offline and prevents file selection:

```javascript
new Shubox('#upload', {
  key: 'my-key',
  offlineCheck: true,  // Default: true - automatically detects offline state
  error: function(file, error) {
    if (error instanceof OfflineError) {
      // User is offline
      showNotification('Cannot upload while offline. Please check your connection.')
    }
  }
})
```

**Offline behavior:**
- When offline, Dropzone is automatically disabled (prevents file selection)
- Visual indicator: `shubox-offline` CSS class and `data-shubox-offline` attribute added to element
- When connection restored, Dropzone automatically re-enabled
- To disable this feature, set `offlineCheck: false`

**Styling offline state:**
```css
.shubox-offline {
  opacity: 0.5;
  cursor: not-allowed;
}

.shubox-offline::before {
  content: 'Offline - uploads disabled';
  color: #999;
}
```

### Transform Error Handling

Transform failures are now reported instead of failing silently:

```javascript
new Shubox('#upload', {
  key: 'my-key',
  transforms: {
    '200x200#': function(file) {
      // Called when transform succeeds
      document.getElementById('avatar').src = file.transform.s3url
    }
  },
  error: function(file, error) {
    if (error instanceof TransformError) {
      // Transform failed after retries
      console.log(`Failed to generate ${error.variant} variant`)
      // You can still use the original uploaded file
      console.log('Original file:', file.s3url)
    }
  }
})
```

### Comprehensive Error Handling Example

```javascript
new Shubox('#upload', {
  key: 'my-key',
  retryAttempts: 5,      // Retry up to 5 times
  timeout: 60000,        // 60 second timeout
  offlineCheck: true,    // Enable offline detection

  transforms: {
    '400x400#': function(file) {
      // Success - use transformed image
    }
  },

  onRetry: function(attempt, error, file) {
    // Called on each retry attempt
    console.log(`Retry ${attempt}: ${error.message}`)
  },

  error: function(file, error) {
    // Differentiate error types
    if (error instanceof OfflineError) {
      showBanner('You appear to be offline. Upload will retry when connection is restored.')
    }
    else if (error instanceof TransformError) {
      showNotification(`Image processing failed for ${error.variant}, but original uploaded successfully`)
      // Fall back to original image
      useOriginalImage(file.s3url)
    }
    else if (error instanceof TimeoutError) {
      showNotification('Upload timed out. Please try again.')
    }
    else if (error instanceof NetworkError && error.recoverable) {
      showNotification('Network error - upload failed after retries')
    }
    else if (error instanceof UploadError && error.statusCode === 403) {
      showNotification('Upload forbidden - check your Shubox key and bucket permissions')
    }
    else {
      showNotification(`Upload failed: ${error.message || error}`)
    }
  },

  success: function(file) {
    hideNotifications()
    console.log('Upload successful:', file.s3url)
  }
})
```

## Event System

Shubox dispatches custom events throughout the upload lifecycle for monitoring, analytics, and user feedback. All events bubble up the DOM and are cancelable.

### Available Events

**`shubox:error`** - Dispatched when an upload error occurs (after all retries exhausted)
```javascript
element.addEventListener('shubox:error', (e) => {
  console.error('Upload error:', e.detail.error.message)
  console.log('Failed file:', e.detail.file.name)
})
```

**`shubox:timeout`** - Dispatched when a request times out
```javascript
element.addEventListener('shubox:timeout', (e) => {
  console.log(`Request timed out after ${e.detail.timeout}ms`)
})
```

**`shubox:retry:start`** - Dispatched on the first retry attempt
```javascript
element.addEventListener('shubox:retry:start', (e) => {
  console.log(`Starting retry (max ${e.detail.maxRetries} attempts)`)
  showNotification('Upload failed, retrying...')
})
```

**`shubox:retry:attempt`** - Dispatched on each retry attempt
```javascript
element.addEventListener('shubox:retry:attempt', (e) => {
  console.log(`Retry ${e.detail.attempt}/${e.detail.maxRetries}`)
  console.log(`Waiting ${e.detail.delay}ms before retry`)
  updateProgressBar(e.detail.attempt, e.detail.maxRetries)
})
```

**`shubox:recovered`** - Dispatched when upload succeeds after previous failures
```javascript
element.addEventListener('shubox:recovered', (e) => {
  console.log(`Upload recovered after ${e.detail.attemptCount} attempts`)
  showSuccessNotification('Upload succeeded after retry!')
})
```

### Event System Example

```javascript
const uploadElement = document.querySelector('#upload')

// Monitor all upload lifecycle events
uploadElement.addEventListener('shubox:retry:start', (e) => {
  showMessage('Upload failed, retrying...')
})

uploadElement.addEventListener('shubox:retry:attempt', (e) => {
  showMessage(`Retry attempt ${e.detail.attempt}/${e.detail.maxRetries}...`)
})

uploadElement.addEventListener('shubox:recovered', (e) => {
  showSuccess(`Upload succeeded after ${e.detail.attemptCount} attempts!`)
})

uploadElement.addEventListener('shubox:error', (e) => {
  if (e.detail.error instanceof OfflineError) {
    showError('You appear to be offline')
  } else {
    showError(`Upload failed: ${e.detail.error.message}`)
  }
})

uploadElement.addEventListener('shubox:timeout', (e) => {
  analytics.track('upload_timeout', {
    timeout: e.detail.timeout,
    file: e.detail.file.name
  })
})

// Initialize Shubox
new Shubox('#upload', {
  key: 'my-key',
  retryAttempts: 3,
  timeout: 60000
})
```

### Global Event Monitoring

Listen at the document level to monitor all Shubox instances:

```javascript
// Analytics integration
document.addEventListener('shubox:error', (e) => {
  analytics.track('upload_error', {
    error: e.detail.error.code,
    file: e.detail.file.name
  })
})

document.addEventListener('shubox:recovered', (e) => {
  analytics.track('upload_recovered', {
    attempts: e.detail.attemptCount
  })
})
```

## File Object

Upon successful upload of an image the Shubox library will pass a file object
to all JavaScript callbacks. The format of this file object follows:

```javascript
{
  accepted: true,
  custom_status: "ready",
  name: "my-upload.jpg",                          // filename w/ext
  width: 281,                                     // in pixels
  height: 500,                                    // in pixels
  size: 15596,                                    // in bytes
  lastModified: 1446064073000,
  lastModifiedDate: Sun Jan 1 2016 00:00:01 ...,  // Date Object
  postData: {
    AWSAccessKeyId: "...",                        // AWS Key
    Content-Type: "",
    acl: "public-read",
    key: "path/to/file/in/bucket/filename.jpg",
    policy: "...",                                // policy string
    signature: "...",                             // signature string
    success_action_status: "201"                  // HTTP response code
  },
  processing: true,
  s3: "path/to/file/in/bucket/filename.jpg",
  s3Url: "https://bucket.s3.amazonaws.com/path/to/file...",
  transforms: {
    "variantName": {
      s3Url: "https://s3.amazonaws.com/bucket/variantName_file.jpg"
    },
    // ...
  },
  status: "success",
  type: "image/jpeg",
  upload: {
    bytesSent: 999,
    total: 999,
    progress: 100
  }
}
```

## Shubox-specific Parameters

### `cdn`:

CDN's are ubiquitous and almost a requirement these days. To that end, putting
newly uploaded images behind a CDN, or a hostname that lives between a web
browser and the S3 bucket, instead of linking directly to the S3 object is
something you can with the `cdn` option.

```javascript
cdn: 'https://cdn.example.com' // will replace "https://s3.amazonaws.com/bucketname"
```

### `s3Key`:

(**NOTE:** the `s3Key` option is not permitted when using the
[sandbox](#using-the-sandbox))

Do you want any/all files uploaded through one of your Shubox uploaders to have
an _exact_ S3 key? The default behavior is for Shubox to send files up to your
bucket with the key `/[random string]/filename.ext` so that you will not
overwrite previously uploaded files.

Setting the s3Key would be useful if you know that you are not risking an
overwrite unless you deliberately mean to. For example, you're logged in as
"Sam" and the Shubox uploader for your `avatar` shuttles all images up to
`/users/avatars/sam.jpg`. Similarly, if you have a resource/record that needs a
single photo associated with it, like
`/dealership/:dealership_id/cars/:id/photo.jpg`.

If you are looking to customize _part_ of the s3Key, but want to use some values
that are determined at the time a file is uploaded -- like the filename -- then
you can interpolate some values with representations in the string like:

* `{{domainSlug}}` - the domain slug
* `{{uuid}}` - uuid (the random generated string)
* `{{filename}}` - file name (duh)
* `{{fileExtension}}` - file extension (the "jpg" part of "hello.jpg")
* `{{baseFilename}}` - base filename (the "hello" part of "hello.jpg")


```javascript
s3Key: '/[random letters and numbers]/filename.extension' // default
s3Key: '/users/avatars/sam.jpg'
s3Key: '/client-name/project-name/{{filename}}'
```

### `transformKey` and `transformCallbacks`:

> [!WARNING]
> `transformKey` and `transformCallbacks` are deprecated and will be removed
> from the library in version `1.2`. They have been replaced by the
> `transforms` option, which acts as a combination/unification of the two.

To view previous documentation around these two options [visit a previous
version of this README](https://github.com/shuboxio/shubox.js/blob/593a57f11eb24150c8653ed493381040ecd81cd5/README.md).

### `transforms`:

```javascript
transforms: null // default
transforms: { string: function }
```

Assigning an object/hash to `transforms` with keys that contain a ImageMagick
compatible geometry string, and a default of `null` will tell Shubox to
generate a variant of that image. For example, the following will tell Shubox
to resize and generate an image with the width of 200px, while maintaining the
aspect ratio with a variable height.

```javascript
transforms: {
  '200x': ()=>{}
}
```

While the following will resize and crop (to fit) a 300x300 image, _and_
convert it to the `webp` format. Additionally, it will execute the provided
callback function once that file's URL returns a successful HTTP HEAD request.

```javascript
transforms: {
  '300x300#.webp': function(shuboxFile) {
	  // once image is found, insert an `img`
	  // tag with that url as the src
	  let el = document.getElementById('shuboxElement')
	  el.insertAdjacentHTML(
	    'beforeend',
	    `<img src='${shuboxFile.transform.s3url}'>`
	  )
  }
}
```


**Image resize and file format variants**

Here are the variants that you can watch for.

The file formats you can convert _to_:

* `'.webp'`
* `'.webm'`
* `'.mp4'`
* `'.jp2'`

The imagemagick geometries/sizes (more [here](https://www.imagemagick.org/script/command-line-processing.php#geometry)):

* `'200'`, _width_ - Width given, height automagically selected to preserve aspect ratio.
* `'x200'`, _xheight_ - Height given, width automagically selected to preserve aspect ratio.
* `'200x200'`, _widthxheight_ - Maximum values of height and width given, aspect ratio preserved.
* `'200x200^'`, _widthxheight^_ - Minimum values of width and height given, aspect ratio preserved.
* `'200x200!'`, _widthxheight!_ - Width and height given, original aspect ratio ignored.
* `'200x200#'`, _widthxheight#_ Width and height explicitly given, cropped to fill.

The extracted animated GIF frame:

* `'frame'`


```javascript
transformCallbacks: null // default

transformCallbacks: {

  // for the 200x200 image, trigger this
  // method when it's available
  '200x200': function(shuboxFile) {
    // the `shuboxFile` has a property, `transforms`
    // that is a hash with the versions of the file
    // you are waiting for.
    console.log(shuboxFile.transforms["200x200"].s3url);
  },

  // if you ask to convert images to WEBP format, this
  // will run when it is available
  '.webp': function(shuboxFile) {
    console.log("a JPG converted to WEBP");
    console.log(shuboxFile.transforms[".webp"].s3url);
  },

  // ... or combine the two
  '200x200.webp': function(shuboxFile) {
    console.log("a JPG resized AND converted to WEBP");
    console.log(shuboxFile.transforms["200x200.webp"].s3url);
  }

}
```

**NOTE:**

* You _*can*_ have more than one variant callback, like in the above example.
* You _*can*_ combine a resized variant with a new file format variant (`200x200` + `webp`).
* The resulting variant images/files need to have publicly readable permissions.
* If there are many variations in your transform pipeline it _may_ take a long
  time to get through them, and therefore a long time (or _not at all_) before
  your callback is triggered.

### `successTemplate`:

*NOTE:* _Formerly `s3urlTemplate`. Will be deprecated with version 1.0._

When uploading to a _form element_, a string containing the URL to your S3
resource will be placed in your form element's value. By default this is a
result of a template having placeholder values interpolated before being
placed in your form element. That template is merely a handlebars-like value of
`'{{s3Url}}'` to start out with but has several more values that can be used.

This can be changed to any string. For example, to instead insert markdown's
image pseudo code you would change this to `'![{{name}}]({{s3url}})'`.

Other placeholders you may use:

* `height` - image height
* `width` - image width
* `name` - filename
* `s3` - path of s3 object
* `s3url` - url to file
* `size` - file size in bytes
* `type` - file type

```javascript
s3urlTemplate: '{{s3Url}}' // just the url
s3urlTemplate: '![{{name}}]({{s3url}})' // markdown image tag
s3urlTemplate: '<img src="{{s3Url}} width="{{width}}" height="{{height}}">' // img tag
```

### `uploadingTemplate`:

Similar to `successTemplate` - this is a string that gets interpolated with the
following values, however this is added _while_ a file is being uploaded.

* `height` - image height
* `width` - image width
* `name` - filename
* `s3` - path of s3 object
* `s3url` - url to file
* `size` - file size in bytes
* `type` - file type

```javascript
uploadingTemplate: 'uploading {{size}} byte file: {{name}}'
uploadingTemplate: '![Uploading {{name}}...]()' // "temp" markdown tag a-la GH
```

### `textBehavior`:

When uploading through a form element (`<input>`, `<textarea>`, etc) the
behavior, by default, will be to `'replace'` the contents of the form element
value with the URL to the newly uploaded file.

The value `'append'` will append the resulting value from the newly uploaded
file to the form element.

`'insertAtCursor'` will, as I am sure you are shocked to hear, insert the text
wherever your cursor is placed at the time of the upload.

```javascript
textBehavior: 'replace' // default value
textBehavior: 'append'
textBehavior: 'insertAtCursor'
```

### `extraParams`:

Shubox provides a mechanism with which to post custom data via a webhook
to an address of your choosing whenever files are uploaded. This will
allow you to share any information available during your users' session. The
information within the `extraParams` hash will be sent to your webhook
endpoint along with the data from the uploaded file.

As an example, you may want to send data about the uploaded file(s) _**with**_
a user's ID or email. It's not uncommon to want to know _**who**_ is uploading
a particular file.

```javascript
extraParams: {} // default
extraParams: {  // override with whatever you want
  userID: 123,
  userEmail: 'team@shubox.io',
  reecesPiecesOrPBCups: 'cups, obviously'
}
```

### `acceptedFiles`:

If you only want _certain_ file types allowed to be uploaded, you may provide a
list of mime types or extensions. The contents of the option may include a
comma separated list of mime types or file extensions. Eg.:

```javascript
acceptedFiles: "image/*"                      // default value
acceptedFiles: "image/*,application/pdf,.psd" // image, pdfs, psd
```

# Development Notes

## Development Setup

*Clone this repo:*

```sh
git clone https://github.com/shuboxio/shubox.js.git shubox.js
cd ./shubox.js
```

*Set everything up*

```sh
./bin/setup
```

This will install dependencies, build the demo html files, and copy local
demo config files.

*Grab your "Sandbox" key from the [Shubox dashboard](https://dashboard.shubox.io/v2/sandbox).*

```sh
open http://dashboard.shubox.io/v2/sandbox.txt
```

*Place your key into shubox_config.js as a global variable*. This will allow
your local dev/example server to use your sandbox key. _This is done within
`./bin/setup` but, just in case:

```sh
cp demo/javascript/shubox_config_sample.js \
   demo/javascript/shubox_config.js

echo "var shuboxSandboxKey = '[SANDBOX KEY GOES HERE]';" > \
   demo/javascript/shubox_config.js
```

*Run local example server*

```sh
npm run dev
# ... then open up http://localhost:3000/
```

![](https://shubox.io/images/README/localhost-9001.png)

# Code of Conduct

We believe in safe, open, and inclusive environments to collaborate in. As such
this project adheres to the Contributor Covenant code of conduct. By
participating, you are expected to uphold this code. Please report unacceptable
behavior to [team@shubox.io](mailto://team@shubox.io).

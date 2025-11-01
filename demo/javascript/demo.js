import Shubox from '../../src/shubox';

new Shubox('#avatar', {
  key: window.shuboxSandboxKey,
  previewsContainer: false,
  success: file => {
    let img = new Image()
    img.onload = () => {
      let el = document.getElementById('avatar')
      el.insertAdjacentHTML('beforeend', '<img src="' + file.s3url + '">')
    }
    img.src = file.s3url
  },
  transforms: {
    // resize to 500 px wide, and then do nothing.
    // Just let it do its thing.
    '500x': ()=>{},

    // resize and crop to 144x144
    '144x144#': (shuboxFile) => {
      // once image is found, insert an `img`
      // tag with that url as the src
      const el  = document.getElementById("avatar")
      const img = document.createElement("img")

      // when the image is loaded, swap the images
      img.addEventListener('load', () => {
        // remove the previous image
        el.firstChild.remove()
        // then append the new one
        el.appendChild(img);
      });

      img.alt = "cropped avatar"
      img.className = "avatar"
      img.src = shuboxFile.transform.s3url
    }
  }
})

new Shubox("#shubox--multiple-files", {
  key: window.shuboxSandboxKey,
  previewsContainer: '#shubox--multiple-files-preview',
  addedfile: () => { console.log('added') },
  success: () => { console.log('file uploaded') },
  queuecomplete: () => { console.log('done') }
})

new Shubox('#shubox--textarea', {
  key: window.shuboxSandboxKey,
  clickable: '#shubox--click-to-upload',
  uploadingTemplate: '![Uploading {{name}}...]()\n',
  successTemplate: '![{{name}}]({{s3url}})\n',
  textBehavior: 'append',
})

new Shubox('#shubox--textarea--cursor', {
  key: window.shuboxSandboxKey,
  clickable: null,
  uploadingTemplate: "![Uploading {{name}}...]()",
  successTemplate: "![{{name}}]({{s3url}})",
  textBehavior: 'insertAtCursor',
})

new Shubox('#shubox--textarea--append', {
  key: window.shuboxSandboxKey,
  clickable: null,
  textBehavior: 'append',
  uploadingTemplate: "![Uploading {{name}}...]()",
  successTemplate: "![{{name}}]({{s3url}})",
})

new Shubox('#shubox--textarea--replace', {
  key: window.shuboxSandboxKey,
  clickable: null,
  // used intentionally to display deprecation warning
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
  uploadingTemplate: "![Uploading {{name}}...]()",
  successTemplate: "![{{name}}]({{s3url}})",
})

new Shubox('#avatar-cropped', {
  key: window.shuboxSandboxKey,
  previewsContainer: false,
  maxFiles: 1,
  transforms: {
    // once the 200x200 AVIF is created and found, replace the image with this one
    "200x200#.avif": (shuboxFile) => {
      // once image is found, insert an `img`
      // tag with that url as the src
      const el  = document.getElementById("avatar-cropped")
      const img = document.createElement("img")

      // when the image is loaded...
      img.addEventListener('load', () => {
        // ... append the new one
        el.appendChild(img);
      });

      img.alt = "cropped avif avatar"
      img.className = "avatar"
      img.src = shuboxFile.transform.s3url
    }
  },
  // Handle transform errors (v1.1.0+)
  error: (file, error) => {
    if (error.code === 'TRANSFORM_ERROR') {
      console.log(`Transform '${error.variant}' failed, but original uploaded:`, file.s3url)
      // Could fall back to original image here
    }
  }
})

new Shubox('#avatar-events', {
  key: window.shuboxSandboxKey,
  previewsContainer: false,
  maxFiles: 1,
  retryAttempts: 3,    // Retry failed uploads up to 3 times
  timeout: 30000,      // 30 second timeout
  offlineCheck: true,  // Enable offline detection

  addedfile: _file => { logEvent('Added file!') },

  error: (_file, error) => {
    // Enhanced error handling with typed errors (v1.1.0+)
    let errorMsg = 'Oops. Error: ';

    if (typeof error === 'string') {
      errorMsg += error;
    } else if (error.code === 'OFFLINE_ERROR') {
      errorMsg += 'You are offline. Please check your connection.';
    } else if (error.code === 'TRANSFORM_ERROR') {
      errorMsg += `Image processing failed for variant '${error.variant}'`;
    } else if (error.code === 'TIMEOUT_ERROR') {
      errorMsg += 'Upload timed out. Please try again.';
    } else if (error.code === 'NETWORK_ERROR' && error.recoverable) {
      errorMsg += 'Network error - failed after retries';
    } else {
      errorMsg += error.message || error;
    }

    logEvent(errorMsg);
  },

  onRetry: (attempt, error, _file) => {
    logEvent(`Retry attempt ${attempt}: ${error.message}`);
  },

  queuecomplete: () => { logEvent('Queue complete!') },
  sending: (_file, _xhr, _formData) => { logEvent('Sending file!') },
  success: (_file, _responseText, _e) => { logEvent('File sent!') },
})

// Add event listeners for new Phase 4 events
const avatarEventsElement = document.getElementById('avatar-events');
if (avatarEventsElement) {
  avatarEventsElement.addEventListener('shubox:retry:start', (e) => {
    logEvent(`🔄 Starting retry (max ${e.detail.maxRetries} attempts)`);
  });

  avatarEventsElement.addEventListener('shubox:retry:attempt', (e) => {
    logEvent(`🔄 Retry ${e.detail.attempt}/${e.detail.maxRetries} (waiting ${e.detail.delay}ms)`);
  });

  avatarEventsElement.addEventListener('shubox:recovered', (e) => {
    logEvent(`✅ Upload recovered after ${e.detail.attemptCount} attempts!`);
  });

  avatarEventsElement.addEventListener('shubox:timeout', (e) => {
    logEvent(`⏱️ Timeout after ${e.detail.timeout}ms`);
  });

  avatarEventsElement.addEventListener('shubox:error', (e) => {
    logEvent(`❌ Error event: ${e.detail.error.code}`);
  });
}

const logEvent = e =>{
  let eventsEl = document.getElementById("events")
  eventsEl.innerHTML = ` ${eventsEl.innerHTML}\n<li>${e}</li>`
}

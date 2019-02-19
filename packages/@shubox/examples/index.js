import Shubox from 'shubox'

const avatar = new Shubox('#avatar', {
  key: 'bf897b63-50f2-4055-b4f6-825e613f3d3e',
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  previewsContainer: false,
  s3Key: 'users/avatar/me.jpg'
})

const cropped_avatar = new Shubox('#avatar-cropped', {
  key: 'bf897b63-50f2-4055-b4f6-825e613f3d3e',
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  previewsContainer: false,
  transformName: 'test-transform',
  transformCallbacks: {
    '144x144#': function(file) {
      let el = document.getElementById('avatar-cropped')
      el.insertAdjacentHTML(
        'beforeend',
        `<img src='${file.transforms["144x144#"].s3url}'>`
      )
    }
  }
})

const multfiles = new Shubox("#shubox--multiple-files", {
  key: window.shuboxSandboxKey,
  previewsContainer: '#shubox--multiple-files-preview',
  addedfile: () => { console.log('added') },
  success: () => { console.log('file uploaded') },
  queuecomplete: () => { console.log('done') }
})

const githubForm = new Shubox('#shubox--textarea', {
  key: 'bf897b63-50f2-4055-b4f6-825e613f3d3e',
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  clickable: '#shubox--click-to-upload',
  uploadingTemplate: '![Uploading {{name}}...]()',
  successTemplate: '![{{name}}]({{s3url}})',
})

const atCursor = new Shubox('#shubox--textarea--cursor', {
  key: 'bf897b63-50f2-4055-b4f6-825e613f3d3e',
  clickable: null,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  successTemplate: ' {{s3url}} ',
  textBehavior: 'insertAtCursor',
})

const append = new Shubox('#shubox--textarea--append', {
  key: 'bf897b63-50f2-4055-b4f6-825e613f3d3e',
  clickable: null,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  successTemplate: ' See? Told you. Right after --> {{s3url}}',
  textBehavior: 'append',
})

const replace = new Shubox('#shubox--textarea--replace', {
  key: 'bf897b63-50f2-4055-b4f6-825e613f3d3e',
  clickable: null,
  // used intentionally to display deprecation warning
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
})

const logEvent = function(e){
  let eventsEl = document.getElementById("events")
  eventsEl.innerHTML = ` ${eventsEl.innerHTML}\n<li>${e}</li>`
}

const events = new Shubox('#avatar-events', {
  key: 'bf897b63-50f2-4055-b4f6-825e613f3d3e',
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  previewsContainer: false,
  maxFiles: 1,

  addedfile: function(file) { logEvent('Added file!') },
  error: function (file, message) { logEvent('Oops. Error: ' + message) },
  queuecomplete: function() { logEvent('Queue complete!') },
  sending: function (file, xhr, formData) { logEvent('Sending file!') },
  success: function(file, responseText, e) { logEvent('File sent!') },
})

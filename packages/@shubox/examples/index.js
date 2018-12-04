import Shubox from 'shubox'

const avatar = new Shubox('#avatar', {
  uuid: window.shuboxSandboxUUID,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  previewsContainer: false,
  success: function(file) {
    let img = new Image()
    img.onload = function() {
      let el = document.getElementById('avatar')
      el.insertAdjacentHTML('beforeend', '<img src="' + file.s3url + '">')
    }
    img.src = file.s3url
  },
})

const githubForm = new Shubox('#shubox--textarea', {
  uuid: window.shuboxSandboxUUID,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  clickable: '#shubox--click-to-upload',
  uploadingTemplate: '![Uploading {{name}}...]()',
  successTemplate: '![{{name}}]({{s3url}})',
})

const atCursor = new Shubox('#shubox--textarea--cursor', {
  uuid: window.shuboxSandboxUUID,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  successTemplate: ' {{s3url}} ',
  textBehavior: 'insertAtCursor',
})

const append = new Shubox('#shubox--textarea--append', {
  uuid: window.shuboxSandboxUUID,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  successTemplate: ' See? Told you. Right after --> {{s3url}}',
  textBehavior: 'append',
})

const replace = new Shubox('#shubox--textarea--replace', {
  uuid: window.shuboxSandboxUUID,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
})

const logEvent = function(e){
  let eventsEl = document.getElementById("events")
  eventsEl.innerHTML = `<p>${e}</p>\n ${eventsEl.innerHTML}`
}

const events = new Shubox('#avatar-events', {
  uuid: window.shuboxSandboxUUID,
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

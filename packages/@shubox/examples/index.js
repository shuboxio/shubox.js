import Shubox from 'shubox'

const avatar = new Shubox('#avatar', {
  key: window.shuboxSandboxKey,
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

const multfiles = new Shubox("#shubox--multiple-files", {
  key: window.shuboxSandboxKey,
  previewsContainer: '#shubox--multiple-files-preview',
  addedfile: () => { console.log('added') },
  success: () => { console.log('file uploaded') },
  queuecomplete: () => { console.log('done') }
})

const githubForm = new Shubox('#shubox--textarea', {
  key: window.shuboxSandboxKey,
  clickable: '#shubox--click-to-upload',
  uploadingTemplate: '![Uploading {{name}}...]()',
  successTemplate: '![{{name}}]({{s3url}})',
})

const atCursor = new Shubox('#shubox--textarea--cursor', {
  key: window.shuboxSandboxKey,
  clickable: null,
  successTemplate: ' {{s3url}} ',
  textBehavior: 'insertAtCursor',
})

const append = new Shubox('#shubox--textarea--append', {
  key: window.shuboxSandboxKey,
  clickable: null,
  successTemplate: ' See? Told you. Right after --> {{s3url}}',
  textBehavior: 'append',
})

const replace = new Shubox('#shubox--textarea--replace', {
  key: window.shuboxSandboxKey,
  clickable: null,
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
})

const logEvent = function(e){
  let eventsEl = document.getElementById("events")
  eventsEl.innerHTML = ` ${eventsEl.innerHTML}\n<li>${e}</li>`
}

const events = new Shubox('#avatar-events', {
  key: window.shuboxSandboxKey,
  previewsContainer: false,
  maxFiles: 1,

  addedfile: function(file) { logEvent('Added file!') },
  error: function (file, message) { logEvent('Oops. Error: ' + message) },
  queuecomplete: function() { logEvent('Queue complete!') },
  sending: function (file, xhr, formData) { logEvent('Sending file!') },
  success: function(file, responseText, e) { logEvent('File sent!') },
})

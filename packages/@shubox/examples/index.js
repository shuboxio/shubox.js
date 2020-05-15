import Shubox from 'shubox'

window.Shubox = Shubox;

new Shubox('#webcam-photo', {
  key: window.shuboxSandboxKey,
  webcam: 'photo',
  success: function(file) {
    console.log(`File ${file.name} successfully uploaded!`)
    console.log(file.s3url)
  },
})

new Shubox('#webcam-with-options', {
  key: window.shuboxSandboxKey,
  webcam: {
    type: 'photo',
    startCamera: '#webcam-start',
    stopCamera: '#webcam-stop',
    startCapture: '#webcam-capture',
    cameraStarted: function(webcam) {
      console.log("camera started");
    },
    cameraStopped: function(webcam) {
      console.log("camera stopped");
    },
    photoTaken: function(webcam, file) {
      console.log("photo taken");
    }
  },
  success: function(file) {
    console.log(`File ${file.name} successfully uploaded!`)
    console.log(file.s3url)
  },
})

new Shubox('#webcam-video', {
  key: window.shuboxSandboxKey,
  acceptedFiles: "video/webm",
  webcam: {
    type: 'video',
    startCamera: '#video-start',
    stopCamera: '#video-stop',
    startRecording: '#video-record-start',
    stopRecording: '#video-record-stop',
    videoTemplate: `
      <video muted autoplay></video>
      <select class="shubox-audioinput"></select>
      <select class="shubox-videoinput"></select>
    `,
    cameraStarted: function(webcam) {
      console.log("camera started");
    },
    cameraStopped: function(webcam) {
      console.log("camera stopped");
    },
    recordingStarted: function(webcam) {
      console.log("recording started");
    },
    recordingStopped: function(webcam, file) {
      console.log("recording stopped");
    }
  },
  success: function(file) {
    console.log(`File ${file.name} successfully uploaded!`)
    console.log(file.s3url)
  },
})

new Shubox('#avatar', {
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
  uploadingTemplate: '![Uploading {{name}}...]()',
  successTemplate: '![{{name}}]({{s3url}})',
})

new Shubox('#shubox--textarea--cursor', {
  key: window.shuboxSandboxKey,
  clickable: null,
  successTemplate: ' {{s3url}} ',
  textBehavior: 'insertAtCursor',
})

new Shubox('#shubox--textarea--append', {
  key: window.shuboxSandboxKey,
  clickable: null,
  successTemplate: ' See? Told you. Right after --> {{s3url}}',
  textBehavior: 'append',
})

new Shubox('#shubox--textarea--replace', {
  key: window.shuboxSandboxKey,
  clickable: null,
  // used intentionally to display deprecation warning
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
})

new Shubox('#avatar-events', {
  key: window.shuboxSandboxKey,
  previewsContainer: false,
  maxFiles: 1,

  addedfile: function(_file) { logEvent('Added file!') },
  error: function (_file, message) { logEvent('Oops. Error: ' + message) },
  queuecomplete: function() { logEvent('Queue complete!') },
  sending: function (_file, _xhr, _formData) { logEvent('Sending file!') },
  success: function(_file, _responseText, _e) { logEvent('File sent!') },
})

const logEvent = function(e){
  let eventsEl = document.getElementById("events")
  eventsEl.innerHTML = ` ${eventsEl.innerHTML}\n<li>${e}</li>`
}

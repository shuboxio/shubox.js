import Shubox from 'shubox'

window.Shubox = Shubox;

new Shubox('#webcam-photo', {
  key: window.shuboxSandboxKey,
  webcam: 'photo',
  success: (file) => {
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
    cameraStarted: (_webcam) => { console.log("camera started") },
    cameraStopped: (_webcam) => { console.log("camera stopped") },
    photoTaken: (_webcam, _file) => { console.log("photo taken") }
  },
  success: file => {
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
    videoTemplate: `<video muted autoplay></video>`,
    audioInput: '.shubox-audioinput',
    videoInput: '.shubox-videoinput',
    cameraStarted: (_webcam) => { console.log("camera started") },
    cameraStopped: (_webcam) => { console.log("camera stopped") },
    recordingStarted: (_webcam) => { console.log("recording started") },
    recordingStopped: (_webcam, _file) => { console.log("recording stopped") }
  },
  success: file => {
    console.log(`File ${file.name} successfully uploaded!`)
    console.log(file.s3url)
  },
})

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

  addedfile: _file => { logEvent('Added file!') },
  error: (_file, message) => { logEvent('Oops. Error: ' + message) },
  queuecomplete: () => { logEvent('Queue complete!') },
  sending: (_file, _xhr, _formData) => { logEvent('Sending file!') },
  success: (_file, _responseText, _e) => { logEvent('File sent!') },
})

const logEvent = e =>{
  let eventsEl = document.getElementById("events")
  eventsEl.innerHTML = ` ${eventsEl.innerHTML}\n<li>${e}</li>`
}

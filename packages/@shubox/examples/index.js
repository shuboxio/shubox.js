import Shubox from 'shubox'

const avatar = new Shubox('#avatar', {
  uuid: window.shuboxSandboxUUID,
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
  clickable: '#shubox--click-to-upload',
  uploadingTemplate: '![Uploading {{name}}...]()',
  successTemplate: '![{{name}}]({{s3url}})',
})

const atCursor = new Shubox('#shubox--textarea--cursor', {
  uuid: window.shuboxSandboxUUID,
  successTemplate: ' {{s3url}} ',
  textBehavior: 'insertAtCursor',
})

const append = new Shubox('#shubox--textarea--append', {
  uuid: window.shuboxSandboxUUID,
  successTemplate: ' See? Told you. Right after --> {{s3url}}',
  textBehavior: 'append',
})

const replace = new Shubox('#shubox--textarea--replace', {
  uuid: window.shuboxSandboxUUID,
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
})

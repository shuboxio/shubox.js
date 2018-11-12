import Shubox from 'shubox'

const avatar = new Shubox('#avatar', {
  uuid: window.shuboxSandboxUUID,
  previewsContainer: false,
  success: function (file) {
    let img = new Image()
    img.onload = function () {
      let el = document.getElementById('avatar')
      el.insertAdjacentHTML('beforeend', '<img src="' + file.s3url + '">')
    }
    img.src = file.s3url
  }
})

const githubForm = new Shubox('#shubox--textarea', {
  uuid: window.shuboxSandboxUUID,
  clickable: '#shubox--click-to-upload',
  s3urlTemplate: '![{{name}}]({{s3url}})',
  uploadingTemplate: '![Uploading {{name}}...]()'
})

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
  s3urlTemplate: '![{{name}}]({{s3url}})',
  uploadingTemplate: '![Uploading {{name}}...]()',
})

const avatarVariant = new Shubox('#avatar-cropped', {
  uuid: window.shuboxSandboxUUID,
  signatureUrl: 'http://localhost:4101/signatures',
  uploadUrl: 'http://localhost:4101/uploads',
  previewsContainer: false,
  transformName: "avatar-crop",
  awaitGeneration: {
    '144x144#': function(file) {
      console.log(file)
      console.log(file.variants['144x144#'].s3url)
      alert('IT EXISTS')
    },
  },
})

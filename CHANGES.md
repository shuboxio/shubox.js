Shubox.js Changes
=================

Master
------

v1.1.0
------

* New `transforms` option instead of `transformName` and `transformCallbacks`. See README.md
* Upgrade lerna (7.4.1)
* Update logic to detect and set codec(s) when capturing video/audio.
* Upgrade typescript to `3.9.7` (yes. it's behind).
* Add .tool-versions file to specify versions of nodejs and python to use in building.
* Update scripts to fall back to legacy ssl provider.
* Fix bug with portraitMode where the logic for width and height were opposite of what is desired.

v0.5.2
------

* Lock Dropzone to 5.7.1.

v0.5.1
-------

* Add method to directly upload generated file objects. See [README](https://github.com/shuboxio/shubox.js#uploading-a-file-directly-from-javascript).
* Lock Dropzone to 5.5.1.
* Turn off the camera's streams when finished recording in addition to explicitly stopping the camera.

v0.5.0
------

* Update README.md with information regarding new string interpolation capabilities in the `s3Key` option.
* Add this file - CHANGES.md - for clearer visibility into the new things delivered to the library.
* Update list of codecs supported for the MediaRecorder options so that Firefox now works. Now using `video/webm;codecs="vp8,opus"` for FF.
* Refactor video events to accommodate Safari. Use the `onstop` event on the MediaRecorder object, since Safari does not have access to the recorded chunks until that event in the lifecycle is fired.
* Fix bug with `uploadingTemplate` value not being replaced by the final `successTemplate`

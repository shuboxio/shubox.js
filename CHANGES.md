Shubox.js Changes
=================

Master
------

* Turn off the camera's streams when finished recording in addition to explicitly stopping the camera

v0.5.0
------

* Update README.md with information regarding new string interpolation capabilities in the `s3Key` option.
* Add this file - CHANGES.md - for clearer visibility into the new things delivered to the library.
* Update list of codecs supported for the MediaRecorder options so that Firefox now works. Now using `video/webm;codecs="vp8,opus"` for FF.
* Refactor video events to accommodate Safari. Use the `onstop` event on the MediaRecorder object, since Safari does not have access to the recorded chunks until that event in the lifecycle is fired.
* Fix bug with `uploadingTemplate` value not being replaced by the final `successTemplate`

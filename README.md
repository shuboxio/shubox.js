

<p width="100%" bgcolor="#f9f2ff" align="center">
  <img src="https://shubox.io/assets/blog/shubox.svg" width="150" height="150">
</p>

<p align="center"g>
  <br>
  <a href="https://www.npmjs.com/package/shubox"><img src="https://img.shields.io/npm/v/shubox.svg?style=flat" alt="npm"></a>
  <a href="https://unpkg.com/shubox"><img src="https://img.badgesize.io/https://unpkg.com/shubox/dist/shubox.umd.js?compression=gzip" alt="gzip size"></a>
  <a href="https://www.npmjs.com/package/shubox"><img src="https://img.shields.io/npm/dt/shubox.svg" alt="downloads" ></a><br>
</p>

# Shubox

>  Simple. Fast. _Customizable._
>  Upload images from your web app directly to Amazon S3.

## What does this do?

The Shubox mission is to take the tedium and boilerplate out of the web-based file storage and image manipulation story. After signing up for a shubox account and setting our js library up on your website(s) you will be able to:

* Upload to S3, "the internet's ftp server", **_directly_ from the web browser**.
* Manipulate and transform images and videos after they are uploaded - **cropping, optimizing, changing formats**.
* Using front-end technologies you are comfortable with, **Javascript and CSS**, you can create the user experience YOU want using our Javascript library. We have [some demos at Codepen](https://codepen.io/shubox/)!

## Why?

Quite frankly I was tired of setting up the file attachment library du jour that was uploading files to an app server **then** to S3. It was slow, it hogged compute resources, it was repetitive and rote. In addition to that, the solutions that existed that did this sort of thing were ugly, hamfisted, and didn't provide for ways to customize the user experience that I wanted. I built Shubox so that I had some way to quickly and elegantly build the file upload processes that lived in my mind's eye.

## Huh?

Visit [shubox.io](https://shubox.io) to learn more. Contact the Shubox team directly via [email](mailto://team@shubox.io), or the "Send a Message" chat box on bottom right of the Shubox website (thanks [smallchat](https://small.chat/)!).

Follow [@shuboxio](https://twitter.com/shuboxio) on Twitter for important announcements, or the occasional pithy tweet.

***

# Table of Contents

* [Installation](#installation)
	* [Using the "Sandbox"](#using-the-sandbox)
	* [Signing Up](#sign-up-for-an-account)
	* [Download the Library](#download-the-library)
	* [Your First Shubox Code](#initialize-your-shubox-object)
* [Set Up Your Own S3 Bucket](#set-up-your-own-s3-bucket)
* [Examples &amp; Ideas](#examples--ideas)
* [Library Documentation](#library-documentation)
* [Development Notes](#development-notes)
	* [Setup](#development-setup)
	* [Lerna](#lerna)
* [Code of Conduct](#code-of-conduct)

***

# Installation

## Using the "Sandbox"
To get things working as fast as possible we'll operate under the understanding that we'll use a **sandbox** domain that we've already set up. It's an ephemeral S3 bucket with some limitations that you can use to upload and test against.

## Sign up for an account

There's a lot under the hood (bucket setup, signatures, CORS policies) that needs to happen in order to get things working just right. We handle all of that stuff via the Shubox service.

1. [Sign up for an account at Shubox](https://dashboard.shubox.io/sign_up)
2. [Obtain your "Sandbox" key from the Shubox dashboard.](https://dashboard.shubox.io/domains/sandbox). You'll need this for your Javascript code when you initialize your first Shubox object.

## Download the Library

### With Yarn or Npm

You can use npm or yarn to install the library from npm:

```sh
$ npm install shubox
$ yarn add shubox
```

Require the Shubox library in your JS.

```javascript
import Shubox from 'shubox'
```

### The 👴 "old school" 👵 script embed

Download and embed the shubox js file directly in your html

```sh
$ curl -O https://unpkg.com/shubox
```

In your HTML:

```
<script src="shubox.umd.js"></script>
```

## Initialize your Shubox object

For this (very contrived) example let's say you want your users to upload an avatar or profile photo.
You have an HTML element with the ID `"#avatar"`.
And your provided sandbox key is `"abcde-qwerty-12345`.

```
new Shubox('#avatar', { key: "abcde-qwerty-12345" })
```

That's it! When you click that element you will see a file dialog pop up where you can select your image. Once that image is selected it will be uploaded to the sandbox S3 bucket. Your code works! Sure, it uploads to a temporary S3 bucket, but the code works! (More info soon on how to set up your own bucket)

# Set Up Your Own S3 Bucket

Coming soon!

# Examples & Ideas

Between the common and not-so-common use-cases, we've gathered some up and will
be adding to them down below for the times you might be looking for a quick
copypasta, or ideas as to what you could do with the Shubox library.

*NOTE:* All of the following are in ES6 syntax and assume that you have already
installed the shubox script into your JS bundle, or have embedded and executed
the standalone shubox.js script.

## Upload an "Avatar" and manually insert into your element

```html
<div id="avatar"></div>
```

```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const avatar = new Shubox('#avatar', {
  key: window.shuboxKey,

  // prevents from inserting the base64 preview image
  previewsContainer: false,

  success: function(file) { // passed a ShuboxFile object
    // create new image element
    let img = new Image()

    // once loaded, insert it inside div#avatar
    img.onload = function() {
      let el = document.getElementById('avatar')
      el.insertAdjacentHTML('beforeend', '<img src="' + file.s3url + '">')
    }

    // assign the src and let it load
    img.src = file.s3url
  }
})
```

![](https://shubox.io/images/README/shubox_demo_avatar.gif)

## Upload avatar and insert generated transform/variant image

"Transforms" are variants of uploaded images that you define in the Shubox dashboard. If you want a `100x100` sized image generated after an 800x600 photo is uploaded you can define that image transform in the [Image Transforms](https://dashboard.shubox.io/image_transforms) section of the dashboard.

In the JS library you can define a corresponding callback that will fire once that version of the image is generated, and HTTP request and response successfully executed. For example, if you define a `"144x144#"` transform, that will intelligently resize and crop all uploaded images to that exact pixel size -- 144 pixels wide by 144 pixels tall. To run a callback once that image exists, the following options will add an image tag with that version of the image's URL.


```html
<div id="avatar"></div>
```

```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const avatar = new Shubox('#avatar', {
  key: window.shuboxKey,
  previewsContainer: false,
  
  // the image transform's name, as defined
  // in the dashboard, is 'test-transform'
  transformName: 'test-transform',
  
  // a hash with N keys corresponding to
  // the versions of the transforms
  transformCallbacks: {
  
    // the image size defined in the dashboard is '144x144#'
    '144x144#': function(shuboxFile) {
    
      // once image is found, insert an `img`
      // tag with that url as the src
      let el = document.getElementById('avatar')
      el.insertAdjacentHTML(
        'beforeend',
        `<img src='${shuboxFile.transforms["144x144#"].s3url}'>`
      )
    }
  }
})

```

![](https://shubox.io/images/README/shubox_demo_transform_callback.gif)

## Mimicing the GitHub file upload user experience

```html
<textarea placeholder="Leave a comment or drag and drop some images."
          class="shubox--textarea"
          id="shubox--textarea"></textarea>

<div id="shubox--click-to-upload" class="shubox--click-to-upload">
  Attach files by dragging &amp; dropping, <strong>selecting them</strong>,
  or pasting from the clipboard.
</div>
```

```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const githubForm = new Shubox('#shubox--textarea', {
  key: window.shuboxKey,

  // clicking on the element corresponding to the `clickable` selector
  // will trigger the file dialog
  clickable: '#shubox--click-to-upload',

  // Once the file starts uploading the string in `uploadingTemplate` will be
  // interpolated with the file's name and added to the textarea
  uploadingTemplate: '![Uploading {{name}}...]()',

  // Once the file completes uploading the string in `successTemplate` will be
  // interpolated with the file's name and S3 url, then placed in the textarea
  successTemplate: '![{{name}}]({{s3url}})'
})
```

![](https://shubox.io/images/README/shubox_demo_github_form.gif)

## Add the final S3 url to the location of the cursor in the input/textarea

```html
<textarea placeholder="Leave a comment or drag and drop some images."
          class="shubox--textarea shubox--textarea--no-click-bar"
          id="shubox--textarea--cursor">Click to place cursor and upload.</textarea>
```


```javascript
const shuboxKey = "[copied from Shubox dashboard]"

const atCursor = new Shubox('#shubox--textarea--cursor', {
  key: window.shuboxKey,
  // when inserting text into an input or textarea the `insertAtCursor` value
  // tells shubox to add the S3 url wherever the cursor is currently placed
  textBehavior: 'insertAtCursor',
  // the text inserted into the form element is the final S3 url with a space
  // before and after
  successTemplate: ' {{s3url}} '
})
```

![](https://shubox.io/images/README/shubox_demo_insert_at_cursor.gif)

## Replace all text in input/textarea with S3 URL

```html
<textarea
  tabindex="1"
  placeholder="Leave a comment or drag and drop some images."
  class="shubox--textarea shubox--textarea--no-click-bar"
  id="shubox--textarea--replace">Drag & drop to replace this text</textarea>
```

```javascript
const replace = new Shubox('#shubox--textarea--replace', {
  key: window.shuboxSandboxKey,
  s3urlTemplate: 'Replaced with: {{s3url}} ',
  textBehavior: 'replace',
})
```

![](https://shubox.io/images/README/shubox_demo_replace_text.gif)

## Append S3 URL at the tail end of input/textarea

```html
<textarea
  tabindex="1"
  placeholder="Leave a comment or drag and drop some images."
  class="shubox--textarea shubox--textarea--no-click-bar"
  id="shubox--textarea--append">
    Dragging & dropping here will append after 👉
</textarea>
```

```javascript
const append = new Shubox('#shubox--textarea--append', {
  key: window.shuboxSandboxKey,
  successTemplate: ' See? Told you. Right after --> {{s3url}}',
  textBehavior: 'append',
})
```

![](https://shubox.io/images/README/shubox_demo_append_after.gif)

# Library Documentation

Current documentation [can be found on the Shubox website](https://shubox.io/docs/#javascript-api). _Updated_ docs are coming soon!

# Development Notes

## Development Setup

*Clone this repo:*

```sh
git clone https://github.com/shuboxio/shubox.js.git shubox.js
cd ./shubox.js
```

*Install dependencies*

```sh
yarn install
```

*Grab your "Sandbox" key from the [Shubox dashboard](https://dashboard.shubox.io/domains/sandbox).*

```sh
open http://dashboard.shubox.io/domains/sandbox/key.txt
```

*Place your key into shubox_config.js as a global variable*. This will allow your local dev/example server to use your sandbox key.

```sh
echo "var shuboxSandboxUUID = '[SANDBOX KEY GOES HERE]';" > \
  ./packages/@shubox/examples/public/shubox_config.js
```

*Run the tests*

```sh
yarn test
```

*Run local example server*

```sh
yarn start
# ... then open up http://localhost:9001/
```

![](https://shubox.io/images/README/localhost-9001.png)

## Lerna

```sh
$ lerna bootstrap
```

Bootstrap the packages in the current Lerna repo.
Installs all of their dependencies and links any cross-dependencies. Including
all local dependencies

When run, this command will:

1. `yarn install` all external dependencies of each package.
2. Symlink together all Lerna `packages` that are dependencies of each other.
3. `npm run prepublish` in all bootstrapped packages.
4. `npm run prepare` in all bootstrapped packages.

# Code of Conduct

We believe in safe, open, and inclusive environments to collaborate in. As such this project adheres to the Contributor Covenant code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to [team@shubox.io](mailto://team@shubox.io).

# Shubox.js Requirements Checklist

[x] UMD for js module so that it can be used solo, or with/by other packaging libs.
[-] Use any version of dropzone that is installed. (use npm)
[-] Load dropzone from CDN if it is not installed.
[] Have a default signature url. Allow overriding.
[] Have a default upload announce url (for webhooks). Allow overriding.
[] Initialize with provided shubox public key.
[] After initialize - fetch AWS endpoint.
[] After initialize - fetch file size limit.

# Notes

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


# Installing Shubox

To install Shubox in your application, add the [`shubox` npm package](https://www.npmjs.com/package/shubox) to your JavaScript bundle. Or, load [`shubox.umd.js`](https://unpkg.com/shubox/dist/shubox.umd.js) in a `<script>` tag.

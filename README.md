# *Monkey Scripts

Grease/Tamper Monkey scripts
---

## Setup

The simplest way to install/edit scripts is to copy and paste [one of the scripts](scripts) from this repo into a new script within the Grease/Tamper monkey extension. If any of the scripts contain `@require` headers that point to itself, delete them (those are for the below workflows).
There may be lint warnings (based on your extension's settings). Unfortunately those can't be configured at the script level for now, and will be up to the User to fix.

If you want automatic updates, or to keep scripts under version control, follow the below steps first, then complete your setup by following the instructions under **Remote Auto-Updates** or **Local Development** (depending on your needs).

Go into the extension's Dashboard area.
- Create a new script
- Copy the headers from the script you want to use (in this repo). The headers are all the items within the `// ==UserScript==` block.
- Replace the headers in the new script (in the extension), with the headers you just copied.

### Remote Auto-Updates

Remove the `@require` header that starts with `file://`. All updates will now be dependent on any updates pushed to the remote repo.

### Local Development

This repo utilizes ESLint so you'll need to run `npm i` to ensure it's installed.

These steps allow editing of local files and keeping changes under version control, while also allowing for the extension to reference your local files.

- Clone this repo. All references to `<REPO_PATH>` will be the absolute path to the repo.
- In your extension's settings (Grease or Tamper Monkey), you need to enable `Allow access to file URLs`.
  - Remove the `@require` header that starts with `https://github.com`.
  - Replace `<REPO_PATH>` with the actual path.
  - Save your new script. Go to a page that matches the pattern referenced in the `@match` header, and see if the new script runs.
- If your new script is loading the file referenced in the `@require` header, you can now make edits with any editor you like, and reload the page to see your new changes reflected.

### Best of both

If yo want to go between remote files and local files, you can simply move the commented `@require` header out of the `==UserScript==` block. So if you want remote files, keep the `https://github.com` header in, and visa versa if you want to work locally.

---

## Documentation

- [GreaseMonkey](https://wiki.greasespot.net/Greasemonkey_Manual:API)
- [TamperMonkey](https://www.tampermonkey.net/documentation.php)

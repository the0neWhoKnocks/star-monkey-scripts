# *Monkey Scripts

Grease/Tamper Monkey scripts
---

## Setup

- Clone this repo. All references to `<REPO_PATH>` will be the absolute path to the repo.
- In your extension's settings (Grease or Tamper Monkey), you need to enable `Allow access to file URLs`.
- Go into the extension's Dashboard area.
  - Create a new script
  - Copy the headers from the script you want to use (in this repo). There'll be a section marked with `[Copy the above headers`.
  - Replace the headers in the new script, with the headers you just copied.
  - Add a new `@require` header that points to a repo script. It'll be something like
    ```js
    // @require      file://<REPO_PATH>/scripts/github/Github_UI_Updates.user.js
    ```
  - The final script will look something like:
    ```js
    // ==UserScript==
    // @name         GitHub UI Updates
    // @namespace    http://tampermonkey.net/
    // @version      1.0.0
    // @description  Updates the GitHub UI to bring in some needed features.
    // @match        https://github.com/*
    // @icon         https://www.google.com/s2/favicons?domain=github.com
    // @grant        none
    // 
    // @require      file:///Users/<USER>/star-monkey-scripts/scripts/github/Github_UI_Updates.user.js
    // ==/UserScript==
    ```
  - Save your new script. Go to a page that matches the pattern referenced in the `@match` header, and see if the new script runs.
- If your new script is loading the file referenced in the `@require` header, you can now make edits with any editor you like, and reload the page to see your new changes reflected.

---

## Documentation

- [TamperMonkey](https://www.tampermonkey.net/documentation.php)

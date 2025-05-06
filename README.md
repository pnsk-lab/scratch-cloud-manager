# Scratch Clouddata Manager

A tool to manage, visualize, analyze, and hack Cloud Variables in Scratch 3.0 project pages.

## Features

- **Manage**: View and manage Cloud Variables in Scratch projects.
- **Disable Cloud Variables**: Disables the feature that prevents cloud variables from being changed when viewed by anyone other than the author in a Scratch project.

## Usage

This tool is published as a [JSR Package](https://jsr.io/@pnsk-lab/scratch-cloud-manager). And you can use it in your browser as a bookmarklet via esm.sh.

```
javascript:import('https://esm.sh/jsr/@pnsk-lab/scratch-cloud-manager').then(m=>m.inject())
```
Or, you can specify the version you want to use:
```
javascript:import('https://esm.sh/jsr/@pnsk-lab/scratch-cloud-manager@0.1.2').then(m=>m.inject())
```

And you can create an user script for Tampermonkey or Violentmonkey.

```javascript
// ==UserScript==
// @name         Scratch Clouddata Manager
// ==/UserScript==

async function main() {
  const { inject } = await import('https://esm.sh/jsr/@pnsk-lab/scratch-cloud-manager')
  inject()
}
```

## License

This project is founded by @P-nutsK. Thanks to @P-nutsK, this project is open-sourced under the MIT License.

![今ここでMITってことにします(?)](https://github.com/user-attachments/assets/d96c3a6e-3904-41e9-98de-99ffa8cfb1d9)

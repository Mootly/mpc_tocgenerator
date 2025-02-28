# MoosePlum Table of Contents Generator

This is script autogenerates a Table of Contents for the current page based on page headings.

It is intentionally designed to only track two layers deep on the TOC. If you need more layers your page is probably way to long and complex and should be broken out into a subsite.

## Dependencies

This was written in TypeScript and exported to ES2020.

## Assets

The files in this set are as follows:

| path                        | description                                        |
| --------------------------- | -------------------------------------------------- |
| LICENSE.md                  | License notice ( [MIT](https://mit-license.org) ). |
| README.md                   | This document.                                     |
| mpc_tocgenerator.ts         | The class definition in TypeScript.                |
| mpc_tocgenerator.js         | The class definition in ES6.                       |
| mpc_tocgenerator.min.js     | Minified version.                                  |
| mpc_tocgenerator.min.js.map | Map file.                                          |
| tsconfig.json               | Example TS > ES2020 config setting.                |
| _invoke.js                  | Example implementation code.                       |

## Installation

Download this repo, or just the script, and add it to the script library for your site.

This script has no external dependencies.

### Compiling from the TypeScript

To save to ES2020 in the current folder, assuming you have the correct libraries installed, run the following in this folder:

`tsc -p tsconfig.json`

## Configuration

The script inserts a menu after an element with a given ID, the default is `toc-links`.

The menu will include all tier 1 elements not marked for exclusion and all tier 2 elements marked for inclusion. The default tier 1 elements are `h2` tags. The default tier 2 elements are `h3` and `dt`.

If a targeted element does not have an ID, one is created for it. It only uses IDs for creating links. **It does not use anchor tags.**

The script will only check elements in a specified division, as specified by the division's ID.

- `class="add-toc"` for inclusion of tier 2 elements.
- `class="toc-skip"` to exclude tier 1 elements.

You can also exclude elements by `innerText` value. On instantiation, the script accepts a comma separated list of strings to look for.

### Assumptions

This script assumes the TOC is only being generated for a specific section of the page, the content section, to the exclusion of headers, footers, navigation sections, etc.

Set the header for the TOC to `display="none"` when creating the document. The script will set it to visible. This is to prevent the heading for the TOC to display if the TOC doesn't generate.

### Recommended HTML Code

Use a &lt;div /&gt; element to make it easier to manage margins without messing up the contents.

Add a class to mark the next immediate element. The script grabs the next programmatically, but it is nice to have self-documenting page elements.

```html
<div class="page-body">
  <h2 id="toc-links">Contents</h2>
  ⋮
</div>
```

### Parameters

| name        | type      | default     | description
| ----------  | --------- | ----------  | ----------
| pLocation   | string    | 'toc-links' | ID of header for table of contents.
| pContainer  | string    | 'page-body' | Container element to search for headings.
| pTier1      | string    | 'h2'        | Heading to use to generate the TOC.
|             |           |             | There can be only one.
| pTier2      | string    | 'h3, dt'    | Comma separated list of elements to check for add-toc.
|             |           |             | Should normally not be more than two:
|             |           |             | Next heading level and DT.
| pExclude    | string    | ''          | Comma separated list of headings to exclude.
|             |           |             | Use innerText.
|             |           |             | Script automaticaly excludes id="toc-links".
| pAuto       | boolean   | true        | Whether to automatically generate TOC.

### Coding Example

Use the `mp` namespace to help avoid collisions.

Arguments may be omitted if using defaults.

```js
const toc_location  = 'toc-links';
const toc_container = 'page-body';
const toc_tier1     = 'h2';
const toc_tier2     = 'h3, dt';
const toc_exclude   = '';
const toc_auto      = true;

let mp = {
  contents: new constructor(toc_location, toc_container, toc_tier1, toc_tier2, toc_exclude, toc_auto),
  ⋮
};
```

If auto is set to false, manually invoke the TOC generator on load.

```js
window.addEventListener('load', (e) => { mp.contents.create(); });
```

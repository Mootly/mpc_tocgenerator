/* ---------------------------------------------------------------------------- */
/*! --- Implementation Examples Scripts --------------------------------------- *
 * Copyright (c) 2023 Mootly Obviate -- See /LICENSE.md
 * ---------------------------------------------------------------------------- */
                    // Table of contents variables                              *
                    // All are optional if you want to use the defaults         *
const toc_location  = 'toc-links';
const toc_container = 'page-body';
const toc_tier1     = 'h2';
const toc_tier2     = 'h3, dt';
const toc_exclude   = '';
const toc_auto      = true;
                    // All scripts in the mp namespace to avoid collisions.     *
let mp = {
  contents: new mpc_tocgenerator(toc_location, toc_container, toc_tier1, toc_tier2, toc_exclude, toc_auto),
// ...
};
                    // only invoke these manually if auto=false                 *
// window.addEventListener('load', (e) => { mpl.contents.create(); });
/* ---------------------------------------------------------------------------- */

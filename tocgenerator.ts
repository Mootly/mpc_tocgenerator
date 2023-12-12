/*! --- Table of Contents Generator ------------------------------------------- *
 * mpc_tocgenerator 1.0.0
 * @copyright 2017-2023 Mootly Obviate -- See /LICENSE.md
 * @license   MIT
 * @version   1.0.0
 * ---------------------------------------------------------------------------- *
 *  Automate Table of Contents generation based on headings the current page.
 *  Invokes on: onload
 * -----
 *  Tasks:
 *  - A menu is inserted after element with id="toc-links":
 *    Example: <h2 id="toc-links">Contents</h2>
 *  - The menu includes all tier 1 elements (var: mpv_tocTier1).
 *  - Checks for '.add-toc" to include tier 2 elements (var: mpv_tocTier2).
 *  - If a listed element does not have an ID, it assigns one.
 * -----
 *  Assumptions:
 *  - Only uses IDs. (Do not use embedded anchors.)
 *  - Only checks for targets in specified divs by ID.
 * -----
 *  Parameters 
 *  Most of these are best declared at the template level
 * name       | type      | default     | description 
 * ---------- | --------- | ----------  | ----------
 * pLocation  | string    | 'toc-links' | ID of header for table of contents.
 * pContainer | string    | 'page-body' | Container element to search for headings.
 * pTier1     | string    | 'h2'        | Heading to use to generate the TOC.
 *            |           |             | There can be only one.
 * pTier2     | string    | 'h3,dt'     | Comma separated list of elements to check for add-toc.
 *            |           |             | Should normally not be more than two:
 *            |           |             | Next heading level and DT.
 * pExclude   | string    | ''          | Comma separated list of headings to exclude.
 *            |           |             | Use innerText.
 *            |           |             | Script automaticaly excludes id="toc-links".
 * pAuto      | boolean   | true        | Whether to automatically generate TOC.
 * -----
 *  Notes:
 *    Set the TOC header to display: none; in case script fails to fire.
 *    Script will change this to display: block;
 * *** Initialize - Example --------------------------------------------------- *
 * let mp = {
 *   contents: new mpc_sticky(pLocation, pContainer, pTier1, pTier2, pExclude, pAuto),
 *   ...
 * };
 * if auto set to false, use an event listener
 * window.addEventListener('load', (e) => { mp.contents.create(););
 * --- Revision History ------------------------------------------------------- *
 * 2023-12-08 | New TypeScript-compliant version completed.
 * ---------------------------------------------------------------------------- */
                    // Begin Class Definition                                   *
class mpc_tocgenerator {
  skipChildren      : boolean;
  idCount           : number;
  tocContainer      : string;
  tocExclude        : string;
  tocInclude        : string;
  tocList           : NodeListOf<HTMLElement>;
  tocParent         : HTMLElement;
  tocTarget         : HTMLElement;
  tocTier1          : string;
  tocTier2          : string;
  el_linkItem       : HTMLAnchorElement;
  el_linkSubitem    : HTMLAnchorElement;
  el_linkText       : string;
  el_listItem       : HTMLElement;
  el_listSubitem    : HTMLElement;
  el_tocList        : HTMLUListElement;
  el_tocSublist     : HTMLUListElement;
                    // *** Constructor ---------------------------------------- *
                    // Grab the specified table of content element by ID.       *
                    // If specified element does not exist,  do nothing.        *
  constructor(
    pLocation       : string  = 'toc-links',
    pContainer      : string  = 'page-body',
    pTier1          : string  = 'h2',
    pTier2          : string  = 'h3, dt',
    pExclude        : string  = '',
    pAuto           : boolean = true
  ) {
    this.tocTarget  = document.getElementById(pLocation) as HTMLElement;
    if (this.tocTarget?.parentNode) {
      this.tocParent = this.tocTarget.parentNode as HTMLElement;
                    // Unhide TOC - TOC hidden in case script doesn't load      *
                    this.tocTarget.style.display = 'block';
                    // TOC starts with this heading level                       *
      this.tocTier1   = pTier1 || 'h2';
                    // Limit TOC to these additional elements                   *
      this.tocTier2   = pTier2 || 'h3, dt';
      this.tocInclude = this.tocTier1 + ', ' + this.tocTier2;
                    // ID of content section to apply contents to               *
      this.tocContainer = pContainer || 'page-body';
                    // Array of headings to exclude by text value               *
                    // Can also use the class of 'toc-skip' within a page       *
      this.tocExclude = (pExclude)
        ? this.tocTarget.innerText.toString() + ', ' + pExclude
        : this.tocTarget.innerText;
                    // If auto, create TOC.                                     *
      this.skipChildren = false;
      if (pAuto) { this.create(); }
    }
  }

                    // *** Generate our TOC block ----------------------------- *
  create() {
                    // Place the container element,then                         *
                    // Pepurpose to add inner content to HTML                   *
    this.el_tocList     = document.createElement('ul');
    this.el_tocSublist  = document.createElement('ul');
    this.el_tocList.id  = 'jumpto';
    this.tocParent.insertBefore(this.el_tocList, this.tocTarget.nextSibling);
    this.el_tocList = document.getElementById('jumpto') as HTMLUListElement;
                    // Get elements to be added to TOC                          *
    this.tocList    = document.getElementById(this.tocContainer)?.querySelectorAll(this.tocInclude) as NodeListOf<HTMLElement>;
                    // Haxie to generate unique ids                             *
    this.idCount    = 1;
                    // Begin Generation Loop ---------------------------------- *
                    // Skip empty elements when generating TOC                  *
    this.tocList.forEach ((el) => {
      if (el.textContent) {
        this.el_linkText = el.textContent || '';
      } else {
        return false;
      }
                    // Add id attribute to target if none.                      *
                    // This adds an id to all elements that _might_ be in TOC.  *
      if (!(el.hasAttribute('id'))) {
        el.id       = 'goto-'+(this.idCount++)+'-'+(this.el_linkText
                    .replace(/[`~!@#$%^&*()|+=?;'",.<>{}[\]\\/]/gi,'')
                    .trim().replace(/ /g,'-')).substring(0,24);
      }
                    // Queue up sub-menu listings if exist                      *
                    // Counterintuitive.                                        * !!!!!!
                    // Review for a better approach.                            * !!!!!!
      if ((this.el_tocSublist.childElementCount) && (this.el_tocList.childElementCount)) {
        this.el_tocList.lastElementChild?.appendChild(this.el_tocSublist.cloneNode(true));
        while (this.el_tocSublist.firstChild) {
          this.el_tocSublist.removeChild(this.el_tocSublist.firstChild);
        }
      }
                    // Conditions                                               *
                    // - match list of tier 1 tags                              *
                    // - check exclusion list                                   *
                    // - check for toc-skip                                     *
      if (el.classList.contains('toc-skip') || ((el.textContent) && (this.tocExclude.indexOf(el.textContent) != -1))) {
        this.skipChildren = true;
      } else if ((el.textContent) && (el.tagName.toLowerCase()  == this.tocTier1)) {
        this.skipChildren = false;
                    // add linkto TOC element                                   *
        this.el_listItem                = document.createElement('li');
        this.el_listItem.id             = 'jumpto_'+el.id;
        this.el_linkItem                = document.createElement('a');
        this.el_linkItem.setAttribute('href', '#'+el.id);
        this.el_linkItem.innerText      = el.textContent;
        this.el_listItem.appendChild(this.el_linkItem);
        this.el_tocList?.appendChild(this.el_listItem);
      }
                    // add add-toc subelement                                   *
      if ((el.textContent) && (el.classList?.contains('add-toc')) && !(this.skipChildren)) {
        this.el_listSubitem             = document.createElement('li');
        this.el_listSubitem.id          = 'jumpto'+el.id;
        this.el_linkSubitem             = document.createElement('a');
        this.el_linkSubitem.setAttribute('href', '#'+el.id);
        this.el_linkSubitem.innerText   = el.textContent;
        this.el_listSubitem.appendChild(this.el_linkSubitem);
        this.el_tocSublist?.appendChild(this.el_listSubitem);
      }
    });
  }
                    // End Generation Loop                                      *
}
/*! --------------------------------------------------------------------------- */

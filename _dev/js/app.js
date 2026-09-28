/***************************************************
██╗    ██╗██╗██████╗ ██╗ ██████╗ ██████╗ ███╗   ███╗
██║    ██║██║██╔══██╗██║██╔════╝██╔═══██╗████╗ ████║
██║ █╗ ██║██║██████╔╝██║██║     ██║   ██║██╔████╔██║
██║███╗██║██║██╔══██╗██║██║     ██║   ██║██║╚██╔╝██║
╚███╔███╔╝██║██████╔╝██║╚██████╗╚██████╔╝██║ ╚═╝ ██║
 ╚══╝╚══╝ ╚═╝╚═════╝ ╚═╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝
***************************************************/
let styles = [
  "background: black",
  "color: white",
  "display: block",

  "line-height: 40px",
  "text-align: center",
  "fontsize: 20px",
  "font-weight: lighter",
].join(";");

console.info("%c HANDMADED WITH ❤ ", styles);

/****************************************************
 *****************************************************
 *GESTION DU PUBLIC PATH DYNAMIC ;
 *****************************************************
 ****************************************************/
__webpack_public_path__ = data.base + "/dist/";
/****************************************************
 *****************************************************
 *IMPORT GLOBALS DEPENDENCIES FROM NODE MODULES;
 *****************************************************
 ****************************************************/
window.isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0) ? true : false;

window.dev = true;
async function lazyLoadJQuery() {
  if (typeof jQuery !== "undefined") {
    // If jQuery is already loaded, resolve immediately
    window.$ = window.jQuery = jQuery;
    Promise.resolve(true).then(() => {
      lazyLoadInitScript();
    });
  } else {
    // If jQuery is not loaded, lazy load it
    const $ = await import(
      /* webpackMode: "lazy" */ /* webpackChunkName: "jquery" */ "jquery"
    );
    // jQuery is now loaded, assign it globally
    window.$ = window.jQuery = $.default;
    // Call lazyLoadInitScript() after jQuery is loaded

    lazyLoadInitScript();
  }
}

// Lazy load other scripts after jQuery is loaded
const lazyLoadInitScript = () => {
  new Promise((resolve) => {
    import(
      /* webpackMode: "lazy" */ /* webpackChunkName: "init" */ "@js/init"
    ).then(() => {
      // The 'init.js' file is now loaded and executed
      resolve(true);
    });
  });
};

// Call the lazy load function when needed
lazyLoadJQuery();
let DEBUG = process.env.NODE_ENV == "development" ? true : false;
if (!DEBUG) {
  if (!window.console) window.console = {};
  var methods = ["log", "debug", "warn", "info"];
  for (var i = 0; i < methods.length; i++) {
    console[methods[i]] = function () { };
  }
}

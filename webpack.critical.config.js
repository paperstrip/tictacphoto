
// Take control of the browser instance used by Penthouse.
// Can be used to setup custom configuration, and more.
// See puppeteer docs for more options:
// https://github.com/GoogleChrome/puppeteer).
const penthouse = require('penthouse')
const puppeteer = require('puppeteer') // installed by penthouse

const browserPromise = puppeteer.launch({
  ignoreHTTPSErrors: true,
  keepLargerMediaQueries:true,
  args: ['--disable-setuid-sandbox', '--no-sandbox'],
  // not required to specify here, but saves Penthouse some work if you will
  // re-use the same viewport for most penthouse calls.
  defaultViewport: {
    width: 1440,
    height: 900
  }
  
})
penthouse({
	// pageGotoOptions are the options for puppeteer: Check the available options : https://github.com/puppeteer/puppeteer/blob/v14.0.0/docs/api.md#pagegotourl-options
  url: 'http://127.0.0.1:8000/',
  css: 'http://127.0.0.1:8000/assets/main.min.css',
  renderWaitTime:8000,
  blockJSRequests:true,
  puppeteer: {
    getBrowser: () => browserPromise,
  }
}).then(criticalCss => {
    console.info(criticalCss)
})

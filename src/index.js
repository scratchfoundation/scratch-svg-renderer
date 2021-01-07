const SVGRenderer = require('./svg-renderer');
const BitmapAdapter = require('./bitmap-adapter');
const fixupSvgString = require('./fixup-svg-string');
const inlineSvgFonts = require('./font-inliner');
const SvgElement = require('./svg-element');
const convertFonts = require('./font-converter');
// /**
//  * Export for NPM & Node.js
//  * @type {RenderWebGL}
//  */
module.exports = {
    BitmapAdapter: BitmapAdapter,
    convertFonts: convertFonts,
    fixupSvgString: fixupSvgString,
    inlineSvgFonts: inlineSvgFonts,
    SvgElement: SvgElement,
    SVGRenderer: SVGRenderer
};

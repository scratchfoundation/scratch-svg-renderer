const DOMPurify = require('dompurify');
const fixupSvgString = require('./fixup-svg-string');

// Add a hook to post-process a sanitized SVG
DOMPurify.addHook('afterSanitizeAttributes', node => {
    // Fix namespaces added by Adobe Illustrator
    node.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    node.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
});

const sanitizeSvg = rawSVGText => {
    // Clean SVG string and allow the "filter" tag
    let cleanedSVGText = DOMPurify.sanitize(rawSVGText, {
        ADD_TAGS: ['filter'],
        USE_PROFILES: {svg: true, svgFilters: true}
    });
    // Remove partial XML comment that is sometimes left in the HTML
    const badTag = cleanedSVGText.indexOf(']&gt;');
    cleanedSVGText = cleanedSVGText.substring(badTag < 0 ? 0 : 5, cleanedSVGText.length);

    // also use our custom fixup rules
    cleanedSVGText = fixupSvgString(cleanedSVGText);
    return cleanedSVGText;
};

module.exports = sanitizeSvg;

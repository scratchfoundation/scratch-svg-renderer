const DOMPurify = require('dompurify');

const sanitizeSvg = rawSVGText => DOMPurify.sanitize(rawSVGText, {
    USE_PROFILES: {svg: true}
});

module.exports = sanitizeSvg;

const measureSvgBBox = svgTag => new Promise((resolve, reject) => {
    // Append the SVG dom to the document.
    // This allows us to use `getBBox` on the page,
    // which returns the full bounding-box of all drawn SVG
    // elements, similar to how Scratch 2.0 did measurement.
    const iframeElement = document.createElement('iframe');
    iframeElement.setAttribute('sandbox', 'allow-same-origin');
    
    try {
        const clonedTag = svgTag.cloneNode(/* deep */ true);
        // eslint-disable-next-line no-undef
        const svgBlob = new Blob([clonedTag.outerHTML], {type: 'image/svg+xml'});
        const iframeContent = URL.createObjectURL(svgBlob);
        let timeout = null;
        iframeElement.onload = () => {
            clearTimeout(timeout);
            const bbox = iframeElement.getSVGDocument().children[0].getBBox();
            resolve(bbox);
            document.body.removeChild(iframeElement);
        };
        iframeElement.src = iframeContent;
        document.body.appendChild(iframeElement);
        timeout = setTimeout(() => {
            reject(new Error('Timed out loading SVG'));
            document.body.removeChild(iframeElement);
        }, 30 * 1000);
    } catch (e) {
        reject(e);
        document.body.removeChild(iframeElement);
    }
});

module.exports = measureSvgBBox;

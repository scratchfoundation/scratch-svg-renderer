const measureSvgBBox = svgTag => new Promise((resolve, reject) => {
    // Append the SVG dom to the document.
    // This allows us to use `getBBox` on the page,
    // which returns the full bounding-box of all drawn SVG
    // elements, similar to how Scratch 2.0 did measurement.
    const iframeElement = document.createElement('iframe');
    iframeElement.setAttribute('sandbox', 'allow-same-origin');
    const svgBlob = new Blob([svgTag.outerHTML], {type: 'image/svg+xml'});
    const iframeContent = URL.createObjectURL(svgBlob);
    iframeElement.onload = () => {
        const bbox = iframeElement.getSVGDocument().children[0].getBBox();
        console.log(bbox);
        resolve(bbox);
    };
    iframeElement.src = iframeContent;
    document.body.appendChild(iframeElement);
    setTimeout(() => reject(new Error('Timed out loading SVG')), 30 * 1000);
});

module.exports = measureSvgBBox;

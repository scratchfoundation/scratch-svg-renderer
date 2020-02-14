const test = require('tap').test;
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const mockRequire = require('mock-require');
// The font inliner uses Webpack loader require syntax, which doesn't work in Node.
mockRequire('../src/font-inliner', () => {});

const SvgRenderer = require('../src/svg-renderer');

const {window} = new JSDOM();
// The SvgRenderer constructor tries to get a canvas' context, which doesn't work in JSDOM
window.HTMLCanvasElement.prototype.getContext = () => {};
global.window = window;
global.document = window.document;
global.DOMParser = window.DOMParser;
const parser = new window.DOMParser();

const renderer = new SvgRenderer();

const parseSVGString = svgString => parser.parseFromString(svgString, 'image/svg+xml').documentElement;

test('stroke-width set to maximum', t => {
    const svg = parseSVGString(`
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256" height="256" width="256">
        <circle r="128" cy="128" cx="128" fill="red" fill-rule="nonzero" stroke="black" stroke-width="16" />
        <circle r="128" cy="128" cx="128" fill="blue" fill-rule="nonzero" stroke="black" stroke-width="32" />
        <circle r="128" cy="128" cx="128" fill="green" fill-rule="nonzero" stroke="black" stroke-width="48" />
    </svg>
    `);

    const largestStrokeWidth = renderer._findLargestStrokeWidth(svg);

    t.equals(largestStrokeWidth, 48, 'stroke-width is set to largest value');
    t.end();
});


test('stroke-width unset', t => {
    const svg = parseSVGString(`
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256" height="256" width="256">
        <circle r="128" cy="128" cx="128" fill="red" fill-rule="nonzero" stroke="black" />
    </svg>
    `);

    const largestStrokeWidth = renderer._findLargestStrokeWidth(svg);

    t.equals(largestStrokeWidth, 1, 'stroke-width is 1 by default');
    t.end();
});

test('stroke set to none', t => {
    const svg = parseSVGString(`
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256" height="256" width="256">
        <circle r="128" cy="128" cx="128" fill="red" fill-rule="nonzero" stroke="none" stroke-width="32" />
        <circle r="128" cy="128" cx="128" fill="red" fill-rule="nonzero" stroke="black" stroke-width="16" />
    </svg>
    `);

    const largestStrokeWidth = renderer._findLargestStrokeWidth(svg);

    t.equals(largestStrokeWidth, 16, 'stroke="none" doesn\'t affect width');
    t.end();
});

test('stroke-width below 1', t => {
    const svg = parseSVGString(`
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256" height="256" width="256">
        <circle r="128" cy="128" cx="128" fill="red" fill-rule="nonzero" stroke="black" stroke-width="0.5" />
    </svg>
    `);

    const largestStrokeWidth = renderer._findLargestStrokeWidth(svg);

    t.equals(largestStrokeWidth, 0.5, 'stroke-width is 0.5');
    t.end();
});

test('stroke-width but no stroke', t => {
    const svg = parseSVGString(`
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256" height="256" width="256">
        <circle r="128" cy="128" cx="128" fill="red" fill-rule="nonzero" stroke="black" stroke-width="16" />
        <circle r="128" cy="128" cx="128" fill="white" fill-rule="nonzero" stroke-width="32" />
    </svg>
    `);

    const largestStrokeWidth = renderer._findLargestStrokeWidth(svg);

    t.equals(largestStrokeWidth, 16, 'stroke-width is ignored when element has no stroke attribute');
    t.end();
});

test('stroke-width set to invalid value', t => {
    const svg = parseSVGString(`
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256" height="256" width="256">
        <circle r="128" cy="128" cx="128" fill="red" fill-rule="nonzero" stroke="black" stroke-width="wrong" />
    </svg>
    `);

    const largestStrokeWidth = renderer._findLargestStrokeWidth(svg);

    t.equals(largestStrokeWidth, 1, 'invalid stroke-width defaults to 1');
    t.end();
});

test('stroke-width on the wrong elements', t => {
    const svg = parseSVGString(`
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256" height="256" width="256">
          <image href="" stroke="black" stroke-width="64" />
          <circle r="128" cy="128" cx="128" fill="white" fill-rule="nonzero" stroke="black" stroke-width="16" />
    </svg>
    `);

    const largestStrokeWidth = renderer._findLargestStrokeWidth(svg);

    t.equals(largestStrokeWidth, 16, 'stroke-width is ignored when applied to elements that cannot have a stroke');
    t.end();
});

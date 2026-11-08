import {checkSvgLayout} from './svg-layout-check.mjs';
await checkSvgLayout({dir:'docs/sources/cs-systems-foundations/staged-assets',out:'.local/cs-systems-svg',select:f=>f.endsWith('.svg')});

import {checkSvgLayout} from './svg-layout-check.mjs';
console.error('Checking eight M05-05 SVGs for text boundaries and overlaps.');
await checkSvgLayout({dir:'site/images/ceh',out:'.local/m05-05/svg',select:f=>/^m05-05-(signals|groups|probability|workflow)-(zh|en)-v1-0-0\.svg$/.test(f)});

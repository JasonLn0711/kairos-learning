import {checkSvgLayout} from './svg-layout-check.mjs';
await checkSvgLayout({dir:'site/images/ceh',out:'.local/m05-04-svg',select:f=>/^m05-04-.*v1-0-0\.svg$/.test(f)});

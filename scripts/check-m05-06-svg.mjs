import {checkSvgLayout} from './svg-layout-check.mjs';
await checkSvgLayout({dir:'site/images/ceh',out:'.local/m05-06/svg',select:f=>/^m05-06-(paths|gates|result)-(zh|en)-v1-0-0\.svg$/.test(f)});

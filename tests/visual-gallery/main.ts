import { mount } from 'svelte';
import Primitives from './Primitives.svelte';
import Glyphs from './Glyphs.svelte';
mount(location.search==='?glyphs'?Glyphs:Primitives,{target:document.getElementById('app')!});

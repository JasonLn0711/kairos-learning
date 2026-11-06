import assert from 'node:assert/strict';
import {compareContentVersions} from '../../src/lib/concepts.ts';

type DateKey = 'date' | 'revisedOn';
export type HistoricalEdition = {
 id:string; publishedOn:string; dateKey:DateKey;
 after:{revision:number;contentVersion:string;date?:string;revisedOn?:string};
};
type CanonicalEdition = {
 id:string; publishedOn:string; revision:number; contentVersion:string;
 date?:string; revisedOn?:string;
};
export type RenderedEdition = {version:string;publishedOn:string;revisedOn:string};

// The release manifest is an immutable historical floor, not today's edition.
export function currentEdition(row:HistoricalEdition,current:CanonicalEdition):RenderedEdition {
 assert.equal(current.id,row.id,row.id+': canonical identity');
 assert.equal(current.publishedOn,row.publishedOn,row.id+': original publication');
 assert.ok(compareContentVersions(current.contentVersion,row.after.contentVersion)>=0,row.id+': version below historical floor');
 assert.ok(current.revision>=row.after.revision,row.id+': revision below historical floor');
 const revisedOn=current[row.dateKey],floor=row.after[row.dateKey];
 assert.ok(revisedOn && floor && revisedOn>=floor,row.id+': revision date below historical floor');
 return {version:current.contentVersion,publishedOn:row.publishedOn,revisedOn};
}

// A stale page must fail even when its edition satisfies the historical floor.
export function assertRenderedEdition(metadata:string,expected:RenderedEdition,label:string):void {
 const version=metadata.match(/<span\b[^>]*>v(\d+\.\d+\.\d+)<\/span>/)?.[1];
 assert.equal(version,expected.version,label+': current canonical edition');
 // Select the semantic fields so a content-check date cannot mask a missing revision.
 const publishedOn=metadata.match(/<span\b[^>]*>(?:原發布|First published)\s*<time datetime="([^"]+)"/)?.[1];
 const revisedOn=metadata.match(/<span\b[^>]*>(?:版本修訂|Version revised)\s*<time datetime="([^"]+)"/)?.[1];
 assert.deepEqual([publishedOn,revisedOn],[expected.publishedOn,expected.revisedOn],label+': original publication and current revision dates');
}

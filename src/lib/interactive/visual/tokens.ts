export const surfaces = {
  neutral: {top:'#f6f4ed',left:'#d8d8cb',right:'#b5baac'},
  teal: {top:'#d8ede5',left:'#9bcaba',right:'#70a496'},
  clay: {top:'#fae4c9',left:'#ebc198',right:'#c49473'},
  violet: {top:'#ece6f6',left:'#c7bbdc',right:'#a496bb'}
} as const;
export type Tone = keyof typeof surfaces;

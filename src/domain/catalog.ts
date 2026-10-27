import type { FurnitureDefinition } from './types';
export const FURNITURE_CATALOG: FurnitureDefinition[] = [
  {kind:'sofa',name:'Sofa',description:'A softer place to land',size:{width:2.3,depth:0.95,height:0.8},color:'#879381'},
  {kind:'armchair',name:'Lounge chair',description:'Your favourite corner',size:{width:0.9,depth:0.86,height:0.84},color:'#d2b798'},
  {kind:'table',name:'Coffee table',description:'Gather around',size:{width:1.2,depth:0.65,height:0.38},color:'#ab7950'},
  {kind:'desk',name:'Dining table',description:'Space for good company',size:{width:1.65,depth:0.85,height:0.76},color:'#bd9063'},
  {kind:'bed',name:'Platform bed',description:'Room to unwind',size:{width:1.65,depth:2.1,height:0.65},color:'#d9cbb8'},
  {kind:'plant',name:'Indoor tree',description:'A little life, indoors',size:{width:0.7,depth:0.7,height:1.65},color:'#71826a'},
  {kind:'shelf',name:'Bookshelf',description:'Make space for stories',size:{width:1.3,depth:0.38,height:1.7},color:'#b58c65'},
];
export const WALL_FINISHES = [{id:'chalk',name:'Warm chalk',color:'#e8e3d8'},{id:'sage',name:'Soft sage',color:'#b4bda8'},{id:'clay',name:'Earth clay',color:'#c59e85'}] as const;
export const FLOOR_FINISHES = [{id:'oak',name:'Natural oak',color:'#c8a77e'},{id:'ash',name:'Light ash',color:'#ded1b9'},{id:'walnut',name:'Smoked walnut',color:'#8e6b50'}] as const;
export const FURNITURE_COLORS = ['#879381','#d2b798','#b66c50','#d9cbb8','#687c88','#4d514d','#ab7950'];

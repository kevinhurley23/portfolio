import TextCircle from "./TextCircle";

export default function TextCircles() {
  const innerDiameter = 300;
  const textLines = [
    `!function(e,t){"use strict"}document`,
    `module&&"object"==typeof module.exports?module.exports=`,
    `e.document?t(e,!0):function(e){if(!e.document)throw.error`,
    `t(e)}("undefined"!=typeof window?window:this,function(C,e){"use strict";var t=[]`,
    `r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)}`,
    `r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)}`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)}`,
    `r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)}`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)}`,
    `r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)}`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return S.each(this,e)}`,
  ];

  return (
    <div id="text-circles">
      {textLines.map((line, index) => (
        <TextCircle
          key={index}
          index={index}
          line={line}
          diameter={innerDiameter * (1 + index / 4)}
        />
      ))}
    </div>
  );
}

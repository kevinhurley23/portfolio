import { useEffect, useState } from "react";
import TextCircle from "./TextCircle";
import { motion } from "framer-motion";

export default function TextCircles() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const innerDiameter = 300;
  const textLines = [
    `! function    {"use strict"} document`,
    `module&&"object"    ==typeof    module.exports`,
    `e.document?t(e,!0):      function(e){if(!e.document)`,
    `t(e)}    ("undefined"!=typeof    window?window:this,function   {"use strict";`,
    `r=Object.getPrototypeOf,   s=t.slice,g=t.flat?    function(e){return t.flat.call(e)}:function  `,
    `constructor:    S,length:0,toArray:     function(){return s.call(this)},get:function(e){return null==e?s   `,
    `e<0?this[e+this.length]     ,pushStack:function(e{   var t=S.merge(this.constructor(),e);return t.prevObject    `,
    `r=Object    .getPrototypeOf,s=t.   slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat   `,
    `constructor:S,length:0,    toArray:function()    {return s.call(this)},get:function(e)   {return null==e?s`,
    `e<0?this[e+this.length]    ,pushStack:  function(e)   {var t=S.merge  (this.constructor(),e)   t.prevObject=this,t}`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},    pushStack:function(e){var     t=S.merge(this.constructor(),e);return    each:function(e){return`,
    `r=Object.getPrototypeOf,s=t.slice,g=t.flat?function(e){return t.flat.call(e)}:function(e){return t.concat.apply`,
    `constructor:S,length:0,toArray:function(){return s.call(this)},get:function(e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e)`,
    `e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=S.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return`,
  ];

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addListener(listener);

    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQuery.removeListener(listener);
    };
  }, []);

  let viewport = Math.max(viewportWidth, viewportHeight);

  let numCircles = textLines.length;
  if (viewport < 1600) {
    numCircles = Math.floor(viewport / 100);
  }

  return (
    <motion.div
      id="text-circles"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 4, ease: "easeIn" }}
    >
      {textLines.slice(0, numCircles).map((line, index) => (
        <TextCircle
          key={index}
          index={index}
          line={line}
          numCircles={numCircles}
          diameter={innerDiameter * (1 + index / 3.5)}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </motion.div>
  );
}

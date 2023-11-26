import { useEffect, useState } from "react";
import TextCircle from "./TextCircle";
import { motion } from "framer-motion";

export default function TextCircles({ animationsOn }) {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const innerDiameter = 300;
  const textLines = [
    `!function    {"use strict"} document`,
    `  module&&"object"  =typeof   module.exports  `,
    `e.document?t(e,!0):    function(e)   {if(!e.document)`,
    `t(e)}    ("undefined"!=typeof window?window:this,function   {"use strict";`,
    `   r=Object.getPrototypeOf,   s=t.slice,g=t.flat?    function(e){return t.call   :function  `,
    `constructor:   length:0,toArray:   function()   {return s.call(this)}    :function(e){return   null==e?s`,
    `e<0?this[e+this.length]     ,pushStack:function(e{   var t=S.merge   (constructor(),e);return t.prevObject    `,
    `   r=Object    .getPrototypeOf,s=t.   slice,g=t.flat?function    {return t.flat.call(e)}   :function{return t.concat`,
    `constructor:S,length:0,    toArray:function()    {return s.call(this)},get:   function(e)   {return null==e?s`,
    `e<0?this[e+this.length],pushStack:    function(e)   {var t=S.merge  (this.constructor(),e)   t.prevObject=this,t}`,
    `constructor:S,    0,toArray:function(){return     (this)},get:function    (e){return null==e?s.call(this)`,
    `e<0?this[e+this.length]:this[e]},    pushStack:function(e){var     t=S.merge(this.constructor(),e);return    each:function(e)`,
    `r=Object   .getPrototypeOf,   s=t.slice,g=t.flat?   function(e){return   t.flat.call(e)}:function(e)    {return t.concat.apply`,
    `constructor:S,length   toArray:function(){return s.call    ,get:function(e){return   null==e?s.call(this)`,
    `e<0?this[e+this.length]    :this[e]},  pushStack:function(e){var    t=S.merge(this.constructor()    ,e);return t.prevObject=this,t}`,
    `e<0?this    [length]:this[e]},pushStack:function    {var t=S  (this.constructor();return   prevObject=this,t},each:function`,
  ];

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
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
      className="flex-center"
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
          animationsOn={animationsOn}
        />
      ))}
    </motion.div>
  );
}

var M=(I,b)=>{throw{code:I,message:b}};var z=(I)=>{return new Proxy(new URLSearchParams(I),{get:(b,$)=>b.get($)})};var B=async(I,b)=>{const $=new URL(b.url),A=b.method.charCodeAt(0)===71,k=$.pathname.slice(1).split("/"),R=k[0],f=k[1];if(!R)M(404,"Namespace not provided");else if(!(R in I))M(404,`Namespace [${R}] does not exist`);else if(!f)M(404,"Procedure not provided");else if(!(f in I[R]))M(404,`Procedure [${f}] does not exist`);const j=I[R][f];if(j.input){const w=A?z($.search):await b.json();return j.input(w),await j.handler(w,b)}else return await j.handler(null,b)};var C=(I,b)=>({type:"query",input:I,handler:b});var D=(I,b)=>({type:"mutation",input:I,handler:b});export{C as query,D as mutation,B as execute,M as error};

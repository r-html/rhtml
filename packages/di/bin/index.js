(function () {var a={};Object.defineProperty(a,"__esModule",{value:!0});class m{}var j=m;a.InjectionToken=j;let b=new WeakMap;const s=$=>$.prototype&&$.prototype.constructor?new $:$;function t($){return b.get($)}var w=t;function e($){return!!b.has($)}a.get=w;var i=e;function c($,e){return b.has($)?b.get($):b.set(e||$,s($)).get(e||$)}a.has=i;var k=c;function l($){return b.delete($)}a.set=k;var x=l;a.remove=x;var n=function(){b=new WeakMap};function o(...$){return(...[,,e])=>{const a=e.value;e.value=function(...e){return()=>a.apply(this,e)($.map($=>c($)))}}}a.clear=n;var p=o;function d($=[]){for(const e of $)e.use?c(e.use,e.provide):c(e)}a.Reader=p;var r=($={})=>e=>class extends e{constructor(...e){d($.imports),d($.providers),super(...e)}};a.Module=r;const f=new WeakMap,g=($,e,a)=>Object.defineProperty($,e,{get:()=>c(a),configurable:!0});function u($){return(e,a,r,t=f.get(e)||[])=>{a?g(e,a,$):(t.push([r,$]),f.set(e,t))}}var v=u;a.Inject=v;const h=($,e)=>{for(const[a,r]of e)g($,a,r)};var q=({providers:$}={providers:[]})=>(e,a=f.get(e)||[])=>class extends e{constructor(...r){r.length||(d($),Reflect.getMetadata&&h(r,Reflect.getMetadata("design:paramtypes",e).map(($,e)=>[e,$])),h(r,a)),super(...r)}};a.Injectable=q;if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=a}else if(typeof define==="function"&&define.amd){define(function(){return a})}})();
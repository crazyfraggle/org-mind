function S(){}function C(n,t){for(const e in t)n[e]=t[e];return n}function M(n){return n()}function K(){return Object.create(null)}function P(n){n.forEach(M)}function Q(n){return typeof n=="function"}function R(n,t){return n!=n?t==t:n!==t||n&&typeof n=="object"||typeof n=="function"}function U(n){return Object.keys(n).length===0}function B(n,...t){if(n==null){for(const i of t)i(void 0);return S}const e=n.subscribe(...t);return e.unsubscribe?()=>e.unsubscribe():e}function V(n,t,e){n.$$.on_destroy.push(B(t,e))}function X(n,t,e,i){if(n){const l=w(n,t,e,i);return n[0](l)}}function w(n,t,e,i){return n[1]&&i?C(e.ctx.slice(),n[1](i(t))):e.ctx}function Y(n,t,e,i){if(n[2]&&i){const l=n[2](i(e));if(t.dirty===void 0)return l;if(typeof l=="object"){const s=[],c=Math.max(t.dirty.length,l.length);for(let u=0;u<c;u+=1)s[u]=t.dirty[u]|l[u];return s}return t.dirty|l}return t.dirty}function Z(n,t,e,i,l,s){if(l){const c=w(t,e,i,s);n.p(c,l)}}function $(n){if(n.ctx.length>32){const t=[],e=n.ctx.length/32;for(let i=0;i<e;i++)t[i]=-1;return t}return-1}function nn(n){return n??""}let m=!1;function tn(){m=!0}function en(){m=!1}function L(n,t,e,i){for(;n<t;){const l=n+(t-n>>1);e(l)<=i?n=l+1:t=l}return n}function O(n){if(n.hydrate_init)return;n.hydrate_init=!0;let t=n.childNodes;if(n.nodeName==="HEAD"){const r=[];for(let a=0;a<t.length;a++){const o=t[a];o.claim_order!==void 0&&r.push(o)}t=r}const e=new Int32Array(t.length+1),i=new Int32Array(t.length);e[0]=-1;let l=0;for(let r=0;r<t.length;r++){const a=t[r].claim_order,o=(l>0&&t[e[l]].claim_order<=a?l+1:L(1,l,j=>t[e[j]].claim_order,a))-1;i[r]=e[o]+1;const v=o+1;e[v]=r,l=Math.max(v,l)}const s=[],c=[];let u=t.length-1;for(let r=e[l]+1;r!=0;r=i[r-1]){for(s.push(t[r-1]);u>=r;u--)c.push(t[u]);u--}for(;u>=0;u--)c.push(t[u]);s.reverse(),c.sort((r,a)=>r.claim_order-a.claim_order);for(let r=0,a=0;r<c.length;r++){for(;a<s.length&&c[r].claim_order>=s[a].claim_order;)a++;const o=a<s.length?s[a]:null;n.insertBefore(c[r],o)}}function T(n,t){if(m){for(O(n),(n.actual_end_child===void 0||n.actual_end_child!==null&&n.actual_end_child.parentNode!==n)&&(n.actual_end_child=n.firstChild);n.actual_end_child!==null&&n.actual_end_child.claim_order===void 0;)n.actual_end_child=n.actual_end_child.nextSibling;t!==n.actual_end_child?(t.claim_order!==void 0||t.parentNode!==n)&&n.insertBefore(t,n.actual_end_child):n.actual_end_child=t.nextSibling}else(t.parentNode!==n||t.nextSibling!==null)&&n.appendChild(t)}function ln(n,t,e){m&&!e?T(n,t):(t.parentNode!==n||t.nextSibling!=e)&&n.insertBefore(t,e||null)}function cn(n){n.parentNode&&n.parentNode.removeChild(n)}function rn(n,t){for(let e=0;e<n.length;e+=1)n[e]&&n[e].d(t)}function q(n){return document.createElement(n)}function g(n){return document.createTextNode(n)}function un(){return g(" ")}function sn(){return g("")}function an(n,t,e,i){return n.addEventListener(t,e,i),()=>n.removeEventListener(t,e,i)}function on(n,t,e){e==null?n.removeAttribute(t):n.getAttribute(t)!==e&&n.setAttribute(t,e)}function fn(n){return n.dataset.svelteH}function _n(n){return n===""?null:+n}function dn(n){return Array.from(n.childNodes)}function D(n){n.claim_info===void 0&&(n.claim_info={last_index:0,total_claimed:0})}function N(n,t,e,i,l=!1){D(n);const s=(()=>{for(let c=n.claim_info.last_index;c<n.length;c++){const u=n[c];if(t(u)){const r=e(u);return r===void 0?n.splice(c,1):n[c]=r,l||(n.claim_info.last_index=c),u}}for(let c=n.claim_info.last_index-1;c>=0;c--){const u=n[c];if(t(u)){const r=e(u);return r===void 0?n.splice(c,1):n[c]=r,l?r===void 0&&n.claim_info.last_index--:n.claim_info.last_index=c,u}}return i()})();return s.claim_order=n.claim_info.total_claimed,n.claim_info.total_claimed+=1,s}function H(n,t,e,i){return N(n,l=>l.nodeName===t,l=>{const s=[];for(let c=0;c<l.attributes.length;c++){const u=l.attributes[c];e[u.name]||s.push(u.name)}s.forEach(c=>l.removeAttribute(c))},()=>i(t))}function hn(n,t,e){return H(n,t,e,q)}function z(n,t){return N(n,e=>e.nodeType===3,e=>{const i=""+t;if(e.data.startsWith(i)){if(e.data.length!==i.length)return e.splitText(i.length)}else e.data=i},()=>g(t),!0)}function mn(n){return z(n," ")}function pn(n,t){t=""+t,n.data!==t&&(n.data=t)}function bn(n,t){n.value=t??""}function yn(n,t,e,i){e==null?n.style.removeProperty(t):n.style.setProperty(t,e,i?"important":"")}function F(n,t,{bubbles:e=!1,cancelable:i=!1}={}){return new CustomEvent(n,{detail:t,bubbles:e,cancelable:i})}function xn(n,t){return new n(t)}let h;function p(n){h=n}function k(){if(!h)throw new Error("Function called outside component initialization");return h}function gn(n){k().$$.on_mount.push(n)}function kn(n){k().$$.after_update.push(n)}function vn(){const n=k();return(t,e,{cancelable:i=!1}={})=>{const l=n.$$.callbacks[t];if(l){const s=F(t,e,{cancelable:i});return l.slice().forEach(c=>{c.call(n,s)}),!s.defaultPrevented}return!0}}function En(n,t){const e=n.$$.callbacks[t.type];e&&e.slice().forEach(i=>i.call(this,t))}const d=[],E=[];let _=[];const y=[],A=Promise.resolve();let x=!1;function I(){x||(x=!0,A.then(G))}function wn(){return I(),A}function W(n){_.push(n)}function Nn(n){y.push(n)}const b=new Set;let f=0;function G(){if(f!==0)return;const n=h;do{try{for(;f<d.length;){const t=d[f];f++,p(t),J(t.$$)}}catch(t){throw d.length=0,f=0,t}for(p(null),d.length=0,f=0;E.length;)E.pop()();for(let t=0;t<_.length;t+=1){const e=_[t];b.has(e)||(b.add(e),e())}_.length=0}while(d.length);for(;y.length;)y.pop()();x=!1,b.clear(),p(n)}function J(n){if(n.fragment!==null){n.update(),P(n.before_update);const t=n.dirty;n.dirty=[-1],n.fragment&&n.fragment.p(n.ctx,t),n.after_update.forEach(W)}}function An(n){const t=[],e=[];_.forEach(i=>n.indexOf(i)===-1?t.push(i):e.push(i)),e.forEach(i=>i()),_=t}export{rn as A,an as B,vn as C,nn as D,Nn as E,En as F,bn as G,_n as H,P as I,fn as J,K,G as L,Q as M,U as N,W as O,An as P,h as Q,p as R,M as S,d as T,I as U,tn as V,en as W,un as a,kn as b,mn as c,cn as d,sn as e,q as f,hn as g,dn as h,ln as i,on as j,yn as k,g as l,z as m,pn as n,gn as o,E as p,xn as q,X as r,R as s,wn as t,Z as u,$ as v,Y as w,T as x,S as y,V as z};

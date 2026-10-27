var nt=globalThis,it=nt.ShadowRoot&&(nt.ShadyCSS===void 0||nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xt=Symbol(),Jt=new WeakMap,M=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==xt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(it&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Jt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Jt.set(t,e))}return e}toString(){return this.cssText}},Yt=n=>new M(typeof n=="string"?n:n+"",void 0,xt),U=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new M(t,n,xt)},Xt=(n,e)=>{if(it)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=nt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},kt=it?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return Yt(t)})(n):n;var{is:Ve,defineProperty:Be,getOwnPropertyDescriptor:Ge,getOwnPropertyNames:We,getOwnPropertySymbols:qe,getPrototypeOf:Ze}=Object,st=globalThis,Qt=st.trustedTypes,Je=Qt?Qt.emptyScript:"",Ye=st.reactiveElementPolyfillSupport,F=(n,e)=>n,$t={toAttribute(n,e){switch(e){case Boolean:n=n?Je:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},ee=(n,e)=>!Ve(n,e),te={attribute:!0,type:String,converter:$t,reflect:!1,useDefault:!1,hasChanged:ee};Symbol.metadata??=Symbol("metadata"),st.litPropertyMetadata??=new WeakMap;var w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=te){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Be(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=Ge(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let d=s?.call(this);r?.call(this,o),this.requestUpdate(e,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??te}static _$Ei(){if(this.hasOwnProperty(F("elementProperties")))return;let e=Ze(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(F("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(F("properties"))){let t=this.properties,i=[...We(t),...qe(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(kt(s))}else e!==void 0&&t.push(kt(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Xt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:$t).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:$t;this._$Em=s;let d=o.fromAttribute(t,r.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let o=this.constructor;if(s===!1&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??ee)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,d=this[s];o!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,r,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[F("elementProperties")]=new Map,w[F("finalized")]=new Map,Ye?.({ReactiveElement:w}),(st.reactiveElementVersions??=[]).push("2.1.2");var Ct=globalThis,ne=n=>n,rt=Ct.trustedTypes,ie=rt?rt.createPolicy("lit-html",{createHTML:n=>n}):void 0,de="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,ce="?"+S,Xe=`<${ce}>`,R=document,j=()=>R.createComment(""),K=n=>n===null||typeof n!="object"&&typeof n!="function",Rt=Array.isArray,Qe=n=>Rt(n)||typeof n?.[Symbol.iterator]=="function",vt=`[ 	
\f\r]`,H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,se=/-->/g,re=/>/g,T=RegExp(`>|${vt}(?:([^\\s"'>=/]+)(${vt}*=${vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),oe=/'/g,ae=/"/g,pe=/^(?:script|style|textarea|title)$/i,Dt=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),p=Dt(1),In=Dt(2),On=Dt(3),D=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),le=new WeakMap,C=R.createTreeWalker(R,129);function ue(n,e){if(!Rt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ie!==void 0?ie.createHTML(e):e}var tn=(n,e)=>{let t=n.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",o=H;for(let d=0;d<t;d++){let l=n[d],a,h,c=-1,m=0;for(;m<l.length&&(o.lastIndex=m,h=o.exec(l),h!==null);)m=o.lastIndex,o===H?h[1]==="!--"?o=se:h[1]!==void 0?o=re:h[2]!==void 0?(pe.test(h[2])&&(s=RegExp("</"+h[2],"g")),o=T):h[3]!==void 0&&(o=T):o===T?h[0]===">"?(o=s??H,c=-1):h[1]===void 0?c=-2:(c=o.lastIndex-h[2].length,a=h[1],o=h[3]===void 0?T:h[3]==='"'?ae:oe):o===ae||o===oe?o=T:o===se||o===re?o=H:(o=T,s=void 0);let g=o===T&&n[d+1].startsWith("/>")?" ":"";r+=o===H?l+Xe:c>=0?(i.push(a),l.slice(0,c)+de+l.slice(c)+S+g):l+S+(c===-2?d:g)}return[ue(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},V=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0,d=e.length-1,l=this.parts,[a,h]=tn(e,t);if(this.el=n.createElement(a,i),C.currentNode=this.el.content,t===2||t===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(s=C.nextNode())!==null&&l.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let c of s.getAttributeNames())if(c.endsWith(de)){let m=h[o++],g=s.getAttribute(c).split(S),b=/([.?@])?(.*)/.exec(m);l.push({type:1,index:r,name:b[2],strings:g,ctor:b[1]==="."?St:b[1]==="?"?At:b[1]==="@"?Et:O}),s.removeAttribute(c)}else c.startsWith(S)&&(l.push({type:6,index:r}),s.removeAttribute(c));if(pe.test(s.tagName)){let c=s.textContent.split(S),m=c.length-1;if(m>0){s.textContent=rt?rt.emptyScript:"";for(let g=0;g<m;g++)s.append(c[g],j()),C.nextNode(),l.push({type:2,index:++r});s.append(c[m],j())}}}else if(s.nodeType===8)if(s.data===ce)l.push({type:2,index:r});else{let c=-1;for(;(c=s.data.indexOf(S,c+1))!==-1;)l.push({type:7,index:r}),c+=S.length-1}r++}}static createElement(e,t){let i=R.createElement("template");return i.innerHTML=e,i}};function I(n,e,t=n,i){if(e===D)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=K(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=I(n,s._$AS(n,e.values),s,i)),e}var wt=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??R).importNode(t,!0);C.currentNode=s;let r=C.nextNode(),o=0,d=0,l=i[0];for(;l!==void 0;){if(o===l.index){let a;l.type===2?a=new B(r,r.nextSibling,this,e):l.type===1?a=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(a=new Tt(r,this,e)),this._$AV.push(a),l=i[++d]}o!==l?.index&&(r=C.nextNode(),o++)}return C.currentNode=R,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},B=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=I(this,e,t),K(e)?e===u||e==null||e===""?(this._$AH!==u&&this._$AR(),this._$AH=u):e!==this._$AH&&e!==D&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Qe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==u&&K(this._$AH)?this._$AA.nextSibling.data=e:this.T(R.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=V.createElement(ue(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new wt(s,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=le.get(e.strings);return t===void 0&&le.set(e.strings,t=new V(e)),t}k(e){Rt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new n(this.O(j()),this.O(j()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=ne(e).nextSibling;ne(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=u,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(e,t=this,i,s){let r=this.strings,o=!1;if(r===void 0)e=I(this,e,t,0),o=!K(e)||e!==this._$AH&&e!==D,o&&(this._$AH=e);else{let d=e,l,a;for(e=r[0],l=0;l<r.length-1;l++)a=I(this,d[i+l],t,l),a===D&&(a=this._$AH[l]),o||=!K(a)||a!==this._$AH[l],a===u?e=u:e!==u&&(e+=(a??"")+r[l+1]),this._$AH[l]=a}o&&!s&&this.j(e)}j(e){e===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},St=class extends O{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===u?void 0:e}},At=class extends O{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==u)}},Et=class extends O{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=I(this,e,t,0)??u)===D)return;let i=this._$AH,s=e===u&&i!==u||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==u&&(i===u||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Tt=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){I(this,e)}};var en=Ct.litHtmlPolyfillSupport;en?.(V,B),(Ct.litHtmlVersions??=[]).push("3.3.3");var he=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new B(e.insertBefore(j(),r),r,void 0,t??{})}return s._$AI(n),s};var Pt=globalThis,$=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=he(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}};$._$litElement$=!0,$.finalized=!0,Pt.litElementHydrateSupport?.({LitElement:$});var nn=Pt.litElementPolyfillSupport;nn?.({LitElement:$});(Pt.litElementVersions??=[]).push("4.2.2");var sn="\u2298 Ausgelassen",rn="\u2298 Skipped",ot="\u2757 Abweichung: {text}";var P="{text}",G=n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function at(n){return!n||n.split(P).length!==2||/[\r\n]/.test(n)?ot:n}function on(n){let[e,t]=at(n).split(P),i=G(e.trim()).replace(/\s+/g,"\\s*"),s=G(t.trim()).replace(/\s+/g,"\\s*");return new RegExp(`^\\s*${i}\\s*(.*?)\\s*${s}\\s*$`,"u")}var me=n=>n.replace(/\r\n?/g,`
`).split(`
`);function fe(n,e){return me(n).map(t=>t.trim()).filter(t=>t.length>0).join(e.separator)}function A(n,e,t){return!t||!e.separator?n:n.split(e.separator).join(`
`)}function It(n){return(n??"en").toLowerCase().startsWith("de")?sn:rn}function v(n){return n.split(P).length===2}function an(n,e){if(n===void 0)return e;let t=n.trim();return!t||/[\r\n]/.test(t)||t.split(P).length>2?e:t}function ge(n,e){let t=It(e);return an(n&&n.trim()?n:void 0,t)}function ln(n){let[e,t]=n.split(P),i=G(e.trim()).replace(/\s+/g,"\\s*"),s=G((t??"").trim()).replace(/\s+/g,"\\s*");return new RegExp(`^\\s*${i}\\s*(.*?)\\s*${s}\\s*$`,"u")}function dn(n){let e=G(n.trim()).replace(/\s+/g,"\\s*");return new RegExp(`^\\s*${e}\\s*$`,"u")}function cn(n,e){if(v(e.template)){let t=ln(e.template).exec(n);return t?t[1]:null}return dn(e.template).test(n)?"":null}function pn(n,e){if(!v(n.template))return n.template.trim();let t=fe(e,{template:n.template,separator:n.separator});return n.template.replace(P,()=>t)}function lt(n,e,t){let i=n??"",s=me(i),r=on(e.template),o=-1,d=null;for(let c=s.length-1;c>=0;c--){let m=r.exec(s[c]);if(m){d=m[1],o=c;break}}let l=-1,a=null;if(t)for(let c=s.length-1;c>=0;c--){if(c===o)continue;let m=cn(s[c],t);if(m!==null){a=m,l=c;break}}return o===-1&&l===-1?{base:i.replace(/\r\n?/g,`
`).trim(),annotation:null,skip:null}:{base:s.filter((c,m)=>m!==o&&m!==l).join(`
`).trim(),annotation:d,skip:a}}function E(n,e,t,i,s){let r=[],o=n.replace(/\r\n?/g,`
`).trim();if(o&&r.push(o),e!==null){let d=fe(e,i);d&&r.push(at(i.template).replace(P,()=>d))}return t!==null&&s&&r.push(pn(s,t)),r.join(`
`)}var _={annotation_icon:"mdi:alert-circle-outline",marker:"\u2757",format:ot,separator:" / ",auto_complete:!0,on_remove:"keep",multiline:!0,show_completed:!0,completed_section:!1,sort:"manual",group_by:"none",description:"always",show_due:!0,compact:!1,show_header:!0,skip:!1,skip_format:"",dishes_entity:"",dish_slot_pattern:"",replan:!0,dish_in_note:!0},dt=(n,e,t)=>e.includes(n)?n:t;function _e(n){return{type:n.type,entity:n.entity,title:n.title,annotation_label:n.annotation_label,annotation_icon:n.annotation_icon||_.annotation_icon,marker:n.marker??_.marker,format:at(n.format),separator:typeof n.separator=="string"&&n.separator.length>0?n.separator:_.separator,auto_complete:n.auto_complete??_.auto_complete,on_remove:dt(n.on_remove,["keep","reopen"],_.on_remove),multiline:n.multiline??_.multiline,show_completed:n.show_completed??_.show_completed,completed_section:n.completed_section??_.completed_section,sort:dt(n.sort,["manual","alpha","due","annotated_first"],_.sort),group_by:dt(n.group_by,["none","due_day"],_.group_by),description:dt(n.description,["always","collapsed","hidden"],_.description),show_due:n.show_due??_.show_due,compact:n.compact??_.compact,show_header:n.show_header??_.show_header,skip:n.skip??_.skip,skip_label:n.skip_label,skip_format:typeof n.skip_format=="string"?n.skip_format:_.skip_format,dishes_entity:typeof n.dishes_entity=="string"?n.dishes_entity.trim():_.dishes_entity,dish_slot_pattern:typeof n.dish_slot_pattern=="string"?n.dish_slot_pattern:_.dish_slot_pattern,replan:n.replan??_.replan,replan_label:n.replan_label,dish_in_note:n.dish_in_note??_.dish_in_note}}var pt="^\\S+\\s+\\S+\\s+\\d{1,2}:\\d{2}\\s+(.+)$";var xe=/^[A-Za-z0-9_.-]{1,64}$/,hn=/^\s*🔁\s*(?:Gewählt|Gewaehlt|Chosen)\s*:\s*(.*?)\s*\[([A-Za-z0-9_.-]{1,64})\]\s*$/u,mn=/^\s*↩\s*(?:Plan|Planned)\s*:\s*(.*?)\s*$/u,fn=/^\s*\[([A-Za-z0-9_.-]{1,64})\]\s*/,be=(n,e)=>typeof n=="string"&&n.trim()?n.trim().slice(0,e):void 0,ye=(n,e)=>(Array.isArray(n)?n:typeof n=="string"?[n]:[]).filter(t=>typeof t=="string"&&!!t.trim()).map(t=>t.trim().slice(0,e)),Ot=n=>{let e=typeof n=="string"?Number(n.replace(",",".")):n;return typeof e=="number"&&Number.isFinite(e)?e:void 0};function ke(n){let e=n?.gerichte??n?.dishes;if(!Array.isArray(e))return[];let t=[],i=new Set;for(let s of e){if(!s||typeof s!="object")continue;let r=s,o=typeof r.id=="string"?r.id.trim():"",d=be(r.name,120);if(!xe.test(o)||!d||i.has(o))continue;i.add(o);let l=Array.isArray(r.slots)?r.slots.filter(a=>typeof a=="string"&&!!a.trim()).map(a=>a.trim()):[];t.push({id:o,name:d,slots:l,kcal:Ot(r.kcal),eiweiss_g:Ot(r.eiweiss_g),geschaetzt:r.geschaetzt===!0,zeit_min:Ot(r.zeit_min),ort:ye(r.ort,40).join(", ").slice(0,80)||void 0,tage:ye(r.tage,20),kurz:be(r.kurz,300)})}return t}function $e(n){let e=n?.punkte,t=new Map;if(!e||typeof e!="object"||Array.isArray(e))return t;for(let[i,s]of Object.entries(e)){if(!s||typeof s!="object")continue;let r=s,o={};typeof r.gericht_id=="string"&&xe.test(r.gericht_id)&&(o.gericht_id=r.gericht_id),typeof r.tag=="string"&&r.tag.trim()&&(o.tag=r.tag.trim()),t.set(i,o)}return t}function zt(n,e,t){if(t?.gericht_id&&e.some(o=>o.id===t.gericht_id))return t.gericht_id;let i=n.replace(/\r\n?/g,`
`).split(`
`)[0]??"",s=i.indexOf(": "),r=ut(s>=0?i.slice(0,s):i);return r?e.find(o=>ut(o.name)===r)?.id??null:null}function ve(n,e){let t=n.map(i=>({dish:i,fits:!e||i.tage.length===0||i.tage.includes(e)}));return[...t.filter(i=>i.fits),...t.filter(i=>!i.fits)]}var ut=n=>n.normalize("NFC").replace(/\s+/g," ").trim().toLocaleLowerCase("de");function we(n,e){let t;try{t=new RegExp(e||pt,"u")}catch{t=new RegExp(pt,"u")}let i=t.exec(n);return(i?i[1]??i[0]:"").trim()||null}function Se(n,e){if(!e)return[];let t=ut(e);return n.filter(i=>i.slots.some(s=>ut(s)===t))}function ht(n,e){let t=(e??"en").toLowerCase().startsWith("de"),i=n.geschaetzt?t?"ca. ":"~":"",s=o=>t?String(o).replace(".",","):String(o),r=[];return n.kcal!==void 0&&r.push(`${i}${s(n.kcal)} kcal`),n.eiweiss_g!==void 0&&r.push(`${i}${s(n.eiweiss_g)} g ${t?"Eiwei\xDF":"protein"}`),n.zeit_min!==void 0&&r.push(`${s(n.zeit_min)} min`),n.ort&&r.push(n.ort),r.join(" \xB7 ")}var mt=n=>n.replace(/\r\n?/g,`
`).split(`
`);function z(n){let e=mt(n??""),t=null,i=null,s=[];for(let r of e){let o=hn.exec(r);if(o&&!t){t={id:o[2],name:o[1]};continue}let d=mn.exec(r);if(d&&i===null){i=d[1].split(" \xB6 ".trim()).map(l=>l.trim()).join(`
`).trim();continue}s.push(r)}return t?{choice:t,text:s.join(`
`).trim(),original:i}:{choice:null,text:(n??"").replace(/\r\n?/g,`
`).trim(),original:null}}function gn(n,e){let t=(e??"en").toLowerCase().startsWith("de"),i=n.kurz?`${n.name}: ${n.kurz}`:n.name,s=n.geschaetzt?t?"ca. ":"~":"",r=[];return n.eiweiss_g!==void 0&&r.push(`${s}${n.eiweiss_g} g ${t?"Eiwei\xDF":"protein"}`),n.kcal!==void 0&&r.push(`${s}${n.kcal} kcal`),n.zeit_min!==void 0&&r.push(`${n.zeit_min} min`),r.length?`${i}
${r.join(" \xB7 ")}`:i}var ct=n=>n.replace(/[\r\n\]\[]+/g," ").replace(/\s+/g," ").trim();function Ae(n,e,t){let i=(t??"en").toLowerCase().startsWith("de"),s=z(n),r=s.choice?s.original??"":s.text,o=[`\u{1F501} ${i?"Gew\xE4hlt":"Chosen"}: ${ct(e.name)} [${e.id}]`,gn(e,t)];return r&&o.push(`\u21A9 ${i?"Plan":"Planned"}: ${mt(r).map(d=>d.trim()).filter(Boolean).join(" \xB6 ")}`),o.join(`
`)}function Ee(n){let e=z(n);return e.choice?e.original??e.text:e.text}function ft(n){let e=fn.exec(n);return e?{ref:{id:e[1]},rest:n.slice(e[0].length)}:{ref:null,rest:n}}function Te(n,e,t=[],i=`
`){let s=i===`
`?mt(n):n.split(i),r=s,{ref:o,rest:d}=ft(s[0]??"");if(o){let a=d.trim(),h=t.find(c=>c.id===o.id);h&&a.startsWith(ct(h.name))&&(a=a.slice(ct(h.name).length).replace(/^\s*[-–:,;·]?\s*/,"")),r=[a,...s.slice(1)]}return[e?`[${e.id}] ${ct(e.name)}`:"",...r].map(a=>a.trim()).filter(Boolean).join(i)}function Ce(n){return mt(n).map((e,t)=>t===0?ft(e).rest:e).join(`
`)}var _n="todo-annotate-card:draft:v1";function Lt(n,e,t){return`${_n}:${encodeURIComponent(n)}:${encodeURIComponent(e)}:${t}`}function Re(n,e,t){try{return localStorage.getItem(Lt(n,e,t))}catch{return null}}function De(n,e,t,i){try{localStorage.setItem(Lt(n,e,t),i)}catch{}}function Nt(n,e,t){try{localStorage.removeItem(Lt(n,e,t))}catch{}}var Ut=n=>(n??"").trim();function Mt(n,e){return n.annotation===null?null:A(n.annotation,e.annotation,!0)}function bn(n,e){return n.skip===null||!e.skip?null:v(e.skip.template)?A(n.skip,{template:e.skip.template,separator:e.skip.separator},!0):""}function Z(n,e,t,i){let s=E(n.base,e,null,t.annotation,t.skip),r={uid:n.uid,description:s,clearDrafts:["annotation"]};return i?r.status=i:t.autoComplete&&n.status!=="completed"&&(r.status="completed"),r}function Ie(n,e){let t=E(n.base,null,bn(n,e),e.annotation,e.skip),i={uid:n.uid,description:t,clearDrafts:["annotation"]};return e.onRemove==="reopen"&&n.status==="completed"&&(i.status="needs_action"),i}function W(n,e,t){let i=E(n.base,null,e,t.annotation,t.skip);return{uid:n.uid,description:i,status:"completed",clearDrafts:["skip","annotation"]}}function Oe(n,e){let t=E(n.base,Mt(n,e),null,e.annotation,e.skip);return{uid:n.uid,description:t,clearDrafts:["skip"]}}function Pe(n,e,t){let i=E(n.base,t,null,e.annotation,e.skip);return{uid:n.uid,description:i,status:"needs_action",clearDrafts:t&&t.trim()?["skip","annotation"]:["skip"]}}function q(n,e,t){return n.text.trim()?n.kind==="annotation"?Z(e,n.text,t):t.skip?W(e,n.text,t):null:null}function Ft(n,e,t,i){let s=i.get(n.uid,e),r="",o=!0;return e==="annotation"?(o=n.annotation===null,r=n.annotation===null?"":A(n.annotation,t.annotation,t.multiline)):(o=n.skip===null,n.skip!==null&&t.skip&&v(t.skip.template)&&(r=A(n.skip,{template:t.skip.template,separator:t.skip.separator},t.multiline))),{uid:n.uid,kind:e,text:s!==null?s:r,isNew:o}}function yn(n,e){return e&&e.uid===n.uid&&e.kind==="annotation"&&e.text.trim()?e.text.trim():Ut(n.annotation)}function ze(n,e,t,i,s){switch(t.type){case"input":return n?{editor:{...n,text:t.text},updates:[],remember:{uid:n.uid,kind:n.kind,text:t.text}}:{editor:null,updates:[]};case"cancel":return n?{editor:null,updates:[],remember:{uid:n.uid,kind:n.kind,text:n.text}}:{editor:null,updates:[]};case"save":return xn(n,t.row,i,t.confirmed===!0);case"remove":return kn(n,t.row,i);case"annotate":return $n(n,e,t.row,i,s);case"done":return vn(n,e,t.row,i);case"skip":return wn(n,e,t.row,i,s,t.confirmed===!0);case"edit-skip":return Sn(n,e,t.row,i,s);default:return{editor:n,updates:[]}}}function xn(n,e,t,i){if(!n||n.uid!==e.uid)return{editor:n,updates:[]};if(n.kind==="annotation")return n.text.trim()?{editor:null,updates:[Z(e,n.text,t)]}:e.annotation!==null?{editor:null,updates:[Ie(e,t)]}:{editor:null,updates:[],forgetDraft:{uid:n.uid,kind:"annotation"}};if(!t.skip)return{editor:n,updates:[]};let s=Ut(e.annotation);return s&&!i?{editor:n,updates:[],confirmRemoveAnnotation:{text:s}}:{editor:null,updates:[W(e,n.text,t)]}}function kn(n,e,t){return!n||n.uid!==e.uid?{editor:n,updates:[]}:n.kind==="skip"?e.skip===null?{editor:null,updates:[],forgetDraft:{uid:e.uid,kind:"skip"}}:{editor:null,updates:[Oe(e,t)]}:e.annotation===null&&!n.text.trim()?{editor:null,updates:[],forgetDraft:{uid:e.uid,kind:"annotation"}}:{editor:null,updates:[Ie(e,t)]}}function $n(n,e,t,i,s){if(n&&n.uid===t.uid&&n.kind==="annotation"&&n)return n.text.trim()?{editor:null,updates:[Z(t,n.text,i)]}:{editor:null,updates:[],forgetDraft:{uid:t.uid,kind:"annotation"}};if(n&&n.text.trim()&&!e)return{editor:n,updates:[]};let o=[];if(n&&n.text.trim()&&e){let d=q(n,e,i);d&&o.push(d)}return{editor:Ft(t,"annotation",i,s),updates:o}}function vn(n,e,t,i){let s=t.status==="completed"?"needs_action":"completed",r=n&&n.uid===t.uid?n:null;if(r&&r.kind==="annotation"&&r.text.trim())return{editor:null,updates:[Z(t,r.text,i,s)]};if(r&&r.kind==="skip"&&s==="needs_action")return{editor:null,updates:[Pe(t,i,Mt(t,i))],remember:{uid:t.uid,kind:"skip",text:r.text}};if(r&&r.kind==="skip"&&r.text.trim())return{editor:null,updates:[W(t,r.text,i)]};if(n&&n.text.trim()&&n.uid!==t.uid&&!e)return{editor:n,updates:[]};let o=[],d=r&&!r.text.trim()?r:n&&n.uid!==t.uid?n:null;if(n&&n.uid!==t.uid&&n.text.trim()&&e){let l=q(n,e,i);l&&o.push(l),d=null}return s==="needs_action"&&t.skip!==null?o.push(Pe(t,i,Mt(t,i))):o.push({uid:t.uid,status:s,clearDrafts:[]}),{editor:d,updates:o}}function wn(n,e,t,i,s,r){if(!i.skip)return{editor:n,updates:[]};let o=n&&n.uid===t.uid&&n.kind==="skip"?n:null;if(o){if(v(i.skip.template)&&!o.text.trim())return{editor:null,updates:[],forgetDraft:{uid:t.uid,kind:"skip"}};let c=Ut(t.annotation);return c&&!r?{editor:n,updates:[],confirmRemoveAnnotation:{text:c}}:{editor:null,updates:[W(t,o.text,i)]}}if(t.skip!==null){if(n&&n.uid!==t.uid&&n.text.trim()&&!e)return{editor:n,updates:[]};let h=[],c=n&&n.uid!==t.uid?n:null;if(n&&n.uid===t.uid&&n.kind==="annotation"&&n.text.trim())return h.push(Z(t,n.text,i)),{editor:null,updates:h};if(n&&n.uid!==t.uid&&n.text.trim()&&e){let m=q(n,e,i);m&&h.push(m),c=null}return h.push(Oe(t,i)),{editor:c,updates:h}}let d=n&&n.uid===t.uid&&n.kind==="annotation"?{uid:t.uid,kind:"annotation",text:n.text}:void 0;if(v(i.skip.template))return{editor:Ft(t,"skip",i,s),updates:[],remember:d};let l=yn(t,n);if(l&&!r)return{editor:n,updates:[],confirmRemoveAnnotation:{text:l}};if(n&&n.uid!==t.uid&&n.text.trim()&&!e)return{editor:n,updates:[]};let a=[];if(n&&n.uid!==t.uid&&n.text.trim()&&e){let h=q(n,e,i);h&&a.push(h)}return a.push(W(t,"",i)),{editor:null,updates:a,remember:d}}function Sn(n,e,t,i,s){if(!i.skip)return{editor:n,updates:[]};if(n&&n.uid===t.uid&&n.kind==="skip")return{editor:n,updates:[]};if(n&&n.text.trim()&&!e)return{editor:n,updates:[]};let r=[];if(n&&n.text.trim()&&e){let o=q(n,e,i);o&&r.push(o)}return{editor:Ft(t,"skip",i,s),updates:r}}function Ne(n){if(!n)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(n))return n;let e=new Date(n);if(isNaN(e.getTime()))return"";let t=i=>String(i).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`}var Le=n=>{if(!n)return Number.POSITIVE_INFINITY;let e=/^\d{4}-\d{2}-\d{2}$/.test(n)?new Date(`${n}T00:00:00`).getTime():new Date(n).getTime();return isNaN(e)?Number.POSITIVE_INFINITY:e};function Me(n,e){let t={template:e.format,separator:e.separator},i=e.skip&&e.skip_format?{template:e.skip_format,separator:e.separator}:null,s=n.map(a=>({item:a,...lt(a.description,t,i)}));e.show_completed||(s=s.filter(a=>a.item.status!=="completed"));let r=new Map(n.map((a,h)=>[a.uid,h])),o={manual:(a,h)=>r.get(a.item.uid)-r.get(h.item.uid),alpha:(a,h)=>a.item.summary.localeCompare(h.item.summary),due:(a,h)=>Le(a.item.due)-Le(h.item.due)||r.get(a.item.uid)-r.get(h.item.uid),annotated_first:(a,h)=>+(h.annotation!==null)-+(a.annotation!==null)||r.get(a.item.uid)-r.get(h.item.uid)};s=[...s].sort(o[e.sort]);let d=[];e.completed_section&&(d=s.filter(a=>a.item.status==="completed"),s=s.filter(a=>a.item.status!=="completed"));let l=[];if(e.group_by==="due_day"){let a=new Map;for(let c of s){let m=Ne(c.item.due);a.has(m)||a.set(m,[]),a.get(m).push(c)}let h=[...a.keys()].sort((c,m)=>c===""?1:m===""?-1:c.localeCompare(m));for(let c of h)l.push({key:c||"nodate",kind:c?"day":"nodate",items:a.get(c)})}else s.length&&l.push({key:"all",kind:"all",items:s});return d.length&&l.push({key:"completed",kind:"completed",items:d}),l}var Ht={done:"Done",annotate:"Note",save:"Save",cancel:"Cancel",remove:"Remove {label}",edit:"Edit {label}",placeholder:"What was different?",unsaved:"Not saved yet",skipped:"Skipped",skip_placeholder:"Why was this skipped?",confirm_remove_note:"Remove the note \u201C{text}\u201D? This item will be marked skipped instead.",confirm_remove:"Remove note",show_details:"Show details",hide_details:"Hide details",completed:"Completed",no_items:"No items",no_entity:"Please choose a to-do list (todo.*) in the card settings.",not_found:"Entity not found: {entity}",unsupported:"This to-do list cannot edit item descriptions, so notes cannot be stored. Use e.g. a Local To-do list.",error:"Saving failed: {error}",due:"Due",no_date:"No date",e_entity:"To-do list",e_title:"Title",e_annotation_label:"Label of the second checkbox",e_annotation_icon:"Icon next to the second checkbox (when the legend is hidden)",e_marker:"Marker for annotated items",e_format:"Storage line in the description ({text} = note)",e_auto_complete:"Adding a note marks the item as done",e_on_remove:"When the note is removed",e_on_remove_keep:"Keep status",e_on_remove_reopen:"Mark as not done",e_multiline:"Multi-line input",e_separator:"Line separator in storage",e_show_completed:"Show completed items",e_completed_section:"Completed items in their own section",e_sort:"Sorting",e_sort_manual:"List order",e_sort_alpha:"Alphabetical",e_sort_due:"Due date",e_sort_annotated:"Annotated first",e_group_by:"Grouping",e_group_none:"None",e_group_day:"By due day",e_description:"Description of normal items",e_desc_always:"Always show",e_desc_collapsed:"Show on tap",e_desc_hidden:"Never show",e_show_due:"Show due date",e_compact:"Compact",e_show_header:"Show legend",e_skip:"Third checkbox: skipped",e_skip_label:"Label of the skipped checkbox",e_skip_format:"Storage line for skipped items ({text} = reason, optional)",replan:"Change dish",replan_title:"Choose a dish for {slot}",replan_filter:"Filter dishes",replan_none:"No dish matches.",replan_back:"Back to the plan",replan_current:"chosen",replan_planned:"planned",dish_other_day:"rather for: {days}",day_training:"training day",day_rest:"rest day",chosen:"Chosen: {name}",original_plan:"Originally planned: {text}",dish_pick:"Dish from the list \u2026",dish_pick_none:"No dish from the list",dish_group_slot:"Fits {slot}",dish_group_other:"Other dishes",dishes_missing:"Dish list not available ({entity}).",e_dishes_entity:"Dish catalog entity (attribute gerichte)",e_dish_slot_pattern:"Slot from the item name (regular expression, group 1)",e_replan:"Offer \u201CChange dish\u201D on open items",e_replan_label:"Label of the change-dish button",e_dish_in_note:"Offer the dish list in the note editor"},An={done:"Erledigt",annotate:"Anmerkung",save:"Speichern",cancel:"Abbrechen",remove:"{label} entfernen",edit:"{label} bearbeiten",placeholder:"Was war anders?",unsaved:"Noch nicht gespeichert",skipped:"Ausgelassen",skip_placeholder:"Warum ausgelassen?",confirm_remove_note:"Anmerkung \u201E{text}\u201C entfernen? Der Punkt wird stattdessen als ausgelassen markiert.",confirm_remove:"Anmerkung entfernen",show_details:"Details anzeigen",hide_details:"Details ausblenden",completed:"Erledigt",no_items:"Keine Eintr\xE4ge",no_entity:"Bitte in den Karteneinstellungen eine To-do-Liste (todo.*) w\xE4hlen.",not_found:"Entit\xE4t nicht gefunden: {entity}",unsupported:"Diese To-do-Liste kann keine Beschreibungen bearbeiten, Anmerkungen lassen sich daher nicht speichern. Nutze z. B. eine lokale To-do-Liste.",error:"Speichern fehlgeschlagen: {error}",due:"F\xE4llig",no_date:"Ohne Datum",e_entity:"To-do-Liste",e_title:"Titel",e_annotation_label:"Beschriftung der zweiten Checkbox",e_annotation_icon:"Symbol an der zweiten Checkbox (wenn die Legende aus ist)",e_marker:"Markierung angemerkter Punkte",e_format:"Speicherzeile in der Beschreibung ({text} = Anmerkung)",e_auto_complete:"Anmerken hakt den Punkt als erledigt ab",e_on_remove:"Wenn die Anmerkung entfernt wird",e_on_remove_keep:"Status beibehalten",e_on_remove_reopen:"Als nicht erledigt markieren",e_multiline:"Mehrzeilige Eingabe",e_separator:"Zeilentrenner beim Speichern",e_show_completed:"Erledigte Punkte anzeigen",e_completed_section:"Erledigte in eigenem Abschnitt",e_sort:"Sortierung",e_sort_manual:"Reihenfolge der Liste",e_sort_alpha:"Alphabetisch",e_sort_due:"F\xE4lligkeit",e_sort_annotated:"Angemerkte zuerst",e_group_by:"Gruppierung",e_group_none:"Keine",e_group_day:"Nach F\xE4lligkeitstag",e_description:"Beschreibung normaler Punkte",e_desc_always:"Immer anzeigen",e_desc_collapsed:"Beim Antippen",e_desc_hidden:"Nie anzeigen",e_show_due:"F\xE4lligkeit anzeigen",e_compact:"Kompakt",e_show_header:"Legende anzeigen",e_skip:"Dritte Checkbox: ausgelassen",e_skip_label:"Beschriftung der Ausgelassen-Checkbox",e_skip_format:"Speicherzeile f\xFCr ausgelassene Punkte ({text} = Grund, optional)",replan:"Umplanen",replan_title:"Gericht f\xFCr {slot} w\xE4hlen",replan_filter:"Gerichte filtern",replan_none:"Kein Gericht passt.",replan_back:"Zur\xFCck zum Plan",replan_current:"gew\xE4hlt",replan_planned:"laut Plan",dish_other_day:"eher f\xFCr: {days}",day_training:"Trainingstag",day_rest:"Ruhetag",chosen:"Gew\xE4hlt: {name}",original_plan:"Urspr\xFCnglich geplant: {text}",dish_pick:"Gericht aus der Liste \u2026",dish_pick_none:"Kein Gericht aus der Liste",dish_group_slot:"Passt zu {slot}",dish_group_other:"Andere Gerichte",dishes_missing:"Gerichteliste nicht verf\xFCgbar ({entity}).",e_dishes_entity:"Entit\xE4t mit dem Gerichte-Katalog (Attribut gerichte)",e_dish_slot_pattern:"Mahlzeit aus dem Punktnamen (regul\xE4rer Ausdruck, Gruppe 1)",e_replan:"\u201EUmplanen\u201C bei offenen Punkten anbieten",e_replan_label:"Beschriftung des Umplanen-Knopfs",e_dish_in_note:"Gerichteliste in der Anmerkung anbieten"},En={en:Ht,de:An};function gt(n){let e=En[(n??"en").split("-")[0].toLowerCase()]??Ht;return(t,i)=>{let s=e[t]??Ht[t]??t;if(i)for(let[r,o]of Object.entries(i))s=s.split(`{${r}}`).join(o);return s}}var jt={CREATE_TODO_ITEM:1,DELETE_TODO_ITEM:2,UPDATE_TODO_ITEM:4,MOVE_TODO_ITEM:8,SET_DUE_DATE_ON_ITEM:16,SET_DUE_DATETIME_ON_ITEM:32,SET_DESCRIPTION_ON_ITEM:64};var L=class L extends ${setConfig(e){this._config={...e}}get _t(){return gt(this.hass?.locale?.language??this.hass?.language)}_set(e,t){if(!this._config)return;let i={...this._config};t===""||t===void 0?delete i[e]:i[e]=t,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_field(e){let t=this._t,i=this._config,s=`f-${e.key}`,r=_[e.key];if(e.kind==="bool"){let d=i[e.key]??r??!1;return p`<label class="row bool" for=${s}>
        <span>${t(e.label)}</span>
        <input id=${s} type="checkbox" role="switch" .checked=${d} @change=${l=>this._set(e.key,l.target.checked)} />
      </label>`}if(e.kind==="select"){let d=i[e.key]??r;return p`<label class="row" for=${s}>
        <span class="lbl">${t(e.label)}</span>
        <select id=${s} @change=${l=>this._set(e.key,l.target.value)}>
          ${e.options.map(([l,a])=>p`<option value=${l} ?selected=${l===d}>${t(a)}</option>`)}
        </select>
      </label>`}let o=e.key==="skip_format"?It(this.hass?.locale?.language??this.hass?.language):e.placeholder??"";return p`<label class="row" for=${s}>
      <span class="lbl">${t(e.label)}</span>
      <input
        id=${s}
        type="text"
        .value=${i[e.key]??""}
        placeholder=${o}
        @change=${d=>this._set(e.key,d.target.value)}
      />
    </label>`}render(){if(!this._config)return u;let e=this._t,t=Object.keys(this.hass?.states??{}).filter(s=>s.startsWith("todo.")).sort(),i=this._config.entity??"";return p`
      <div class="editor">
        <label class="row" for="f-entity">
          <span class="lbl">${e("e_entity")}</span>
          <select id="f-entity" @change=${s=>this._set("entity",s.target.value)}>
            ${i&&!t.includes(i)?p`<option value=${i} selected>${i}</option>`:u}
            ${i?u:p`<option value="" selected disabled>—</option>`}
            ${t.map(s=>p`<option value=${s} ?selected=${s===i}>
                ${this.hass.states[s].attributes.friendly_name??s} (${s})
              </option>`)}
          </select>
        </label>
        ${L.SECTIONS.map(s=>p`<fieldset>${s.fields.map(r=>this._field(r))}</fieldset>`)}
      </div>
    `}};L.properties={hass:{attribute:!1},_config:{state:!0}},L.SECTIONS=[{fields:[{key:"title",kind:"text",label:"e_title"}]},{fields:[{key:"annotation_label",kind:"text",label:"e_annotation_label"},{key:"annotation_icon",kind:"text",label:"e_annotation_icon",placeholder:_.annotation_icon},{key:"marker",kind:"text",label:"e_marker",placeholder:_.marker},{key:"format",kind:"text",label:"e_format",placeholder:_.format},{key:"auto_complete",kind:"bool",label:"e_auto_complete"},{key:"on_remove",kind:"select",label:"e_on_remove",options:[["keep","e_on_remove_keep"],["reopen","e_on_remove_reopen"]]},{key:"multiline",kind:"bool",label:"e_multiline"},{key:"separator",kind:"text",label:"e_separator",placeholder:JSON.stringify(_.separator)}]},{fields:[{key:"show_completed",kind:"bool",label:"e_show_completed"},{key:"completed_section",kind:"bool",label:"e_completed_section"},{key:"sort",kind:"select",label:"e_sort",options:[["manual","e_sort_manual"],["alpha","e_sort_alpha"],["due","e_sort_due"],["annotated_first","e_sort_annotated"]]},{key:"group_by",kind:"select",label:"e_group_by",options:[["none","e_group_none"],["due_day","e_group_day"]]},{key:"description",kind:"select",label:"e_description",options:[["always","e_desc_always"],["collapsed","e_desc_collapsed"],["hidden","e_desc_hidden"]]},{key:"show_due",kind:"bool",label:"e_show_due"},{key:"show_header",kind:"bool",label:"e_show_header"},{key:"compact",kind:"bool",label:"e_compact"}]},{fields:[{key:"skip",kind:"bool",label:"e_skip"},{key:"skip_label",kind:"text",label:"e_skip_label"},{key:"skip_format",kind:"text",label:"e_skip_format"}]},{fields:[{key:"dishes_entity",kind:"text",label:"e_dishes_entity",placeholder:"sensor.ernaehrung_gerichte"},{key:"dish_slot_pattern",kind:"text",label:"e_dish_slot_pattern",placeholder:pt},{key:"replan",kind:"bool",label:"e_replan"},{key:"replan_label",kind:"text",label:"e_replan_label"},{key:"dish_in_note",kind:"bool",label:"e_dish_in_note"}]}],L.styles=U`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      color: var(--primary-text-color);
    }
    fieldset {
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      border-radius: 12px;
      margin: 0;
      padding: 4px 12px;
      display: flex;
      flex-direction: column;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 8px 0;
    }
    .row.bool {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      min-height: 32px;
    }
    .lbl {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    input[type="text"],
    select {
      font: inherit;
      font-size: 16px;
      color: var(--primary-text-color);
      background: var(--input-fill-color, var(--secondary-background-color, rgba(127, 127, 127, 0.08)));
      border: 1px solid var(--input-idle-line-color, var(--divider-color, rgba(127, 127, 127, 0.4)));
      border-radius: 8px;
      padding: 10px 12px;
      width: 100%;
      box-sizing: border-box;
    }
    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: var(--primary-color);
      flex: none;
    }
    input:focus-visible,
    select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 1px;
    }
  `;var Kt=L;customElements.get("todo-annotate-card-editor")||customElements.define("todo-annotate-card-editor",Kt);var Tn="1.2.1",Y="todo-annotate-card",J=class extends ${constructor(){super(...arguments);this._expanded=new Set;this._pickFilter="";this._busy=new Set}static getConfigElement(){return document.createElement(`${Y}-editor`)}static getStubConfig(t){return{entity:Object.keys(t?.states??{}).find(s=>s.startsWith("todo."))??""}}setConfig(t){if(!t||typeof t!="object")throw new Error("Invalid configuration");if(t.entity&&!String(t.entity).startsWith("todo."))throw new Error("entity must be a to-do list (todo.*)");let i=_e(t);this._config?.entity!==i.entity&&(this._items=void 0),this._config=i}getCardSize(){return 2+Math.min(this._items?.length??3,10)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}get _t(){return gt(this.hass?.locale?.language??this.hass?.language)}get _fmt(){let t=this._runtime();return{template:t?.format??"\u2757 Abweichung: {text}",separator:t?.separator??" / "}}_runtime(){if(!this._config)return;if(!this._config.skip)return this._config;let t=this.hass?.locale?.language??this.hass?.language;return{...this._config,skip_format:ge(this._config.skip_format,t)}}_skipFmt(t){return t.skip&&t.skip_format?{template:t.skip_format,separator:t.separator}:null}_policy(){let t=this._runtime();return{autoComplete:t.auto_complete,onRemove:t.on_remove,annotation:{template:t.format,separator:t.separator},skip:this._skipFmt(t),multiline:t.multiline}}get _lang(){return this.hass?.locale?.language??this.hass?.language}_dishes(){let t=this._config?.dishes_entity;if(!t)return[];let i=this.hass?.states[t]?.attributes;return(!this._dishCache||this._dishCache.attrs!==i)&&(this._dishCache={attrs:i,dishes:ke(i),hints:$e(i)}),this._dishCache.dishes}_hint(t){return this._dishes(),this._dishCache?.hints.get(t)}_slotDishes(t){let i=we(t.item.summary,this._config?.dish_slot_pattern);return{slot:i,dishes:Se(this._dishes(),i)}}async _choose(t,i){let s=this._runtime(),r=z(t.base);if(i&&!r.choice&&i.id===zt(r.text,this._dishes(),this._hint(t.item.summary))){this._togglePicker(t.item.uid);return}let o=i?Ae(t.base,i,this._lang):Ee(t.base),d=E(o,t.annotation,t.skip,this._fmt,this._skipFmt(s));await this._update(t.item,{description:d})&&(this._picker=void 0,this._pickFilter="")}_togglePicker(t){this._pickFilter="",this._picker=this._picker===t?void 0:t}_drafts(){let t=this._config?.entity??"";return{get:(i,s)=>Re(t,i,s)}}_rowOf(t){return{uid:t.item.uid,status:t.item.status,base:t.base,annotation:t.annotation,skip:t.skip}}_rowByUid(t){let i=this._runtime(),s=this._items?.find(o=>o.uid===t);if(!i||!s)return null;let r=lt(s.description,{template:i.format,separator:i.separator},this._skipFmt(i));return{uid:t,status:s.status,...r}}connectedCallback(){super.connectedCallback(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe()}updated(t){if((t.has("hass")||t.has("_config"))&&this._subscribe(),t.has("_edit")&&this._edit){let i=this.renderRoot.querySelector(".editor .field");i&&this.renderRoot.ownerDocument?.activeElement!==i&&!i.dataset.focused&&(i.dataset.focused="1",i.focus())}for(let i of this.renderRoot.querySelectorAll("input[data-pending]"))i.indeterminate=i.dataset.pending==="1"}_unsubscribe(){let t=this._unsub;this._unsub=void 0,this._subscribedTo=void 0,t?.then(i=>i()).catch(()=>{})}_subscribe(){let t=this._config?.entity;!this.hass||!t||!this.isConnected||!this.hass.states[t]||this._subscribedTo!==t&&(this._unsubscribe(),this._subscribedTo=t,this._unsub=this.hass.connection.subscribeMessage(i=>{this._items=i.items},{type:"todo/item/subscribe",entity_id:t}),this._unsub.catch(i=>{this._subscribedTo=void 0,this._error=this._t("error",{error:Ue(i)})}))}_supports(t){return(Number(this.hass?.states[this._config.entity]?.attributes.supported_features??0)&t)===t}async _update(t,i){this._busy=new Set(this._busy).add(t.uid),this._error=void 0;try{return await this.hass.callService("todo","update_item",{item:t.uid,...i},{entity_id:this._config.entity}),!0}catch(s){return this._error=this._t("error",{error:Ue(s)}),!1}finally{let s=new Set(this._busy);s.delete(t.uid),this._busy=s}}async _dispatch(t){let i=this._config;if(!i||!i.entity||this._busy.size&&t.type!=="input")return;t.type!=="input"&&(this._picker=void 0);let s=this._edit??null,r=ze(s,s?this._rowByUid(s.uid):null,t,this._policy(),this._drafts());if(r.confirmRemoveAnnotation&&(t.type==="skip"||t.type==="save")){this._confirm={uid:t.row.uid,text:r.confirmRemoveAnnotation.text,gesture:t};return}if(r.forgetDraft&&Nt(i.entity,r.forgetDraft.uid,r.forgetDraft.kind),r.remember&&De(i.entity,r.remember.uid,r.remember.kind,r.remember.text),r.updates.length===0){this._edit=r.editor??void 0,this._confirm=void 0;return}let o=this._edit;for(let d of r.updates){let l=this._items?.find(h=>h.uid===d.uid);if(!l)return;let a={};if(d.description!==void 0&&(a.description=d.description),d.status&&(a.status=d.status),!await this._update(l,a)){this._edit=o;return}}for(let d of r.updates)for(let l of d.clearDrafts)Nt(i.entity,d.uid,l);this._edit=r.editor??void 0,this._confirm=void 0}_toggleExpand(t){let i=new Set(this._expanded);i.has(t)?i.delete(t):i.add(t),this._expanded=i}_onEditorKey(t,i){i.key==="Escape"?(i.preventDefault(),this._dispatch({type:"cancel"})):i.key==="Enter"&&(!this._config.multiline||i.ctrlKey||i.metaKey)&&(i.preventDefault(),this._dispatch({type:"save",row:this._rowOf(t)}))}render(){if(!this._config||!this.hass)return u;let t=this._t,i=this._runtime(),s=i.entity?this.hass.states[i.entity]:void 0,r=i.title??s?.attributes.friendly_name,o=i.annotation_label||t("annotate"),d=i.skip_label||t("skipped"),l;if(!i.entity)l=p`<div class="message">${t("no_entity")}</div>`;else if(!s)l=p`<div class="message warning">${t("not_found",{entity:i.entity})}</div>`;else if(this._items===void 0)l=p`<div class="message muted" aria-busy="true">…</div>`;else{let c=this._supports(jt.UPDATE_TODO_ITEM),m=this._supports(jt.SET_DESCRIPTION_ON_ITEM),g=Me(this._items,i);l=p`
        ${m?u:p`<div class="message warning" role="note">${t("unsupported")}</div>`}
        ${i.dishes_entity&&!this.hass.states[i.dishes_entity]?p`<div class="message muted" role="note">${t("dishes_missing",{entity:i.dishes_entity})}</div>`:u}
        ${g.length===0?p`<div class="message muted">${t("no_items")}</div>`:p`
              ${i.show_header?p`<div class="legend" aria-hidden="true">
                    <span class="lg"><span class="sw done"></span>${t("done")}</span>
                    <span class="lg"><span class="sw ann"></span>${i.marker?p`<span class="lg-marker">${i.marker}</span>`:u}${o}</span>
                    ${i.skip?p`<span class="lg"><span class="sw skip"></span>${d}</span>`:u}
                  </div>`:u}
              ${g.map(b=>p`
                  <section class="group" aria-label=${this._groupLabel(b.kind,b.key)}>
                    ${b.kind!=="all"?p`<h3 class="group-title">${this._groupLabel(b.kind,b.key)}</h3>`:u}
                    <ul role="list">
                      ${b.items.map(x=>this._renderItem(x,o,d,c,m))}
                    </ul>
                  </section>
                `)}
            `}
      `}let a=!!i.dishes_entity&&i.replan,h=[i.compact?"compact":"",i.skip?"skip-on":"",a?"replan-on":""].filter(Boolean).join(" ");return p`
      <ha-card class=${h}>
        ${r?p`<h1 class="card-header">${r}</h1>`:u}
        ${this._error?p`<div class="message error" role="alert">${this._error}</div>`:u}
        <div class="content">${l}</div>
      </ha-card>
    `}_groupLabel(t,i){let s=this._t;if(t==="completed")return s("completed");if(t==="nodate")return s("no_date");if(t==="day"){let r=new Date(`${i}T12:00:00`);try{return new Intl.DateTimeFormat(this.hass?.locale?.language??this.hass?.language??"en",{weekday:"long",day:"numeric",month:"long"}).format(r)}catch{return i}}return""}_formatDue(t){let i=this.hass?.locale?.language??this.hass?.language??"en";try{if(/^\d{4}-\d{2}-\d{2}$/.test(t))return new Intl.DateTimeFormat(i,{weekday:"short",day:"numeric",month:"short"}).format(new Date(`${t}T12:00:00`));let s=new Date(t),r=this._config.group_by==="due_day"?{hour:"2-digit",minute:"2-digit"}:{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"};return new Intl.DateTimeFormat(i,r).format(s)}catch{return t}}_renderItem(t,i,s,r,o){let d=this._t,l=this._runtime(),a=t.item,h=a.status==="completed",c=t.annotation!==null,m=l.skip&&t.skip!==null,g=this._busy.has(a.uid),b=this._edit?.uid===a.uid,x=b&&this._edit?.kind==="annotation",f=b&&this._edit?.kind==="skip",y=this._expanded.has(a.uid),X=c||m,k=z(t.base),Q=k.text,tt=k.choice?k.original:null,He=(X||l.description==="collapsed")&&Q.length>0||!!tt,Vt=Q.length>0&&(X||l.description==="collapsed"?y:l.description==="always"),_t=!!l.dishes_entity&&l.replan,bt=_t?this._slotDishes(t):{slot:null,dishes:[]},Bt=_t&&!h&&!m&&r&&o&&(bt.dishes.length>0||!!k.choice),Gt=this._picker===a.uid&&Bt,Wt=l.replan_label||d("replan"),qt=`d-${Fe(a.uid)}`,yt=`p-${Fe(a.uid)}`,je=c?Ce(A(t.annotation,this._fmt,!0)):"",N=this._skipFmt(l),et=m&&t.skip&&N&&v(N.template)?A(t.skip,N,!0):"",Ke=this._confirm?.uid===a.uid,Zt=p`
      <span class="summary">
        ${m?p`<span class="marker skip-mark" aria-hidden="true">⊘</span>`:u}
        ${c&&!m&&l.marker?p`<span class="marker" aria-hidden="true">${l.marker}</span>`:u}
        <span class="text">${a.summary}</span>
        ${c?p`<span class="sr-only">(${i})</span>`:u}
        ${m?p`<span class="sr-only">(${s}${et?`: ${et}`:""})</span>`:u}
      </span>
      ${k.choice?p`<span class="choice"><span aria-hidden="true">🔁 </span>${d("chosen",{name:k.choice.name})}</span>`:u}
      ${m?p`<span class="skip-hint">${s}${et?`: ${et}`:""}</span>`:u}
      ${c?p`<span class="annotation">${je}</span>`:u}
      ${l.show_due&&a.due&&(l.group_by!=="due_day"||!/^\d{4}-\d{2}-\d{2}$/.test(a.due))?p`<span class="due">${this._formatDue(a.due)}</span>`:u}
    `;return p`
      <li class="item ${h?"done":""} ${c?"annotated":""} ${m?"skipped":""} ${g?"busy":""}" aria-busy=${g?"true":"false"}>
        <label class="box done" title=${d("done")}>
          <input
            type="checkbox"
            .checked=${h}
            ?disabled=${!r||g}
            aria-label=${`${d("done")}: ${a.summary}`}
            @change=${()=>{this._dispatch({type:"done",row:this._rowOf(t)})}}
          />
        </label>
        <label class="box ann" title=${x?d("unsaved"):i}>
          <input
            type="checkbox"
            data-pending=${x?"1":"0"}
            .checked=${c}
            .indeterminate=${x}
            ?disabled=${!r||!o||g}
            aria-label=${x?`${i}: ${a.summary}. ${d("unsaved")}`:`${i}: ${a.summary}`}
            aria-expanded=${x?"true":"false"}
            aria-describedby=${x?yt:u}
            @change=${()=>{this._dispatch({type:"annotate",row:this._rowOf(t)})}}
          />
          ${l.annotation_icon&&l.show_header===!1?p`<ha-icon class="ann-icon" .icon=${l.annotation_icon} aria-hidden="true"></ha-icon>`:u}
        </label>
        ${l.skip?p`<label class="box skip" title=${f?d("unsaved"):s}>
              <input
                type="checkbox"
                data-pending=${f?"1":"0"}
                .checked=${!!m}
                .indeterminate=${f}
                ?disabled=${!r||!o||g}
                aria-label=${f?`${s}: ${a.summary}. ${d("unsaved")}`:`${s}: ${a.summary}`}
                aria-expanded=${f?"true":"false"}
                aria-describedby=${f?yt:u}
                @change=${()=>{this._dispatch({type:"skip",row:this._rowOf(t)})}}
              />
            </label>`:u}
        <div class="body">
          ${He?p`<button
                class="main"
                type="button"
                aria-expanded=${y?"true":"false"}
                aria-controls=${qt}
                title=${d(y?"hide_details":"show_details")}
                @click=${()=>this._toggleExpand(a.uid)}
              >
                ${Zt}<span class="chev" aria-hidden="true">${y?"\u25B4":"\u25BE"}</span>
              </button>`:p`<div class="main">${Zt}</div>`}
          ${Vt||tt&&y?p`<div class="base" id=${qt}>${Vt?Q:u}${tt&&y?p`<div class="original">${d("original_plan",{text:tt})}</div>`:u}</div>`:u}
          ${c&&y&&!b&&r&&o?p`<div class="actions inline">
                <button type="button" class="link" @click=${()=>{this._dispatch({type:"annotate",row:this._rowOf(t)})}}>
                  ${d("edit",{label:i})}
                </button>
              </div>`:u}
          ${m&&y&&!b&&r&&o&&N&&v(N.template)?p`<div class="actions inline">
                <button type="button" class="link" @click=${()=>{this._dispatch({type:"edit-skip",row:this._rowOf(t)})}}>
                  ${d("edit",{label:s})}
                </button>
              </div>`:u}
          ${Ke?this._renderConfirm():u}
          ${Gt?this._renderPicker(t,bt.slot,bt.dishes,k.choice?.id??null):u}
          ${b?this._renderEditor(t,f?s:i,yt):u}
        </div>
        ${_t?Bt?p`<div class="box replan">
                <button
                  type="button"
                  class="replan-btn ${k.choice?"chosen":""}"
                  title=${Wt}
                  aria-label=${`${Wt}: ${a.summary}`}
                  aria-expanded=${Gt?"true":"false"}
                  ?disabled=${g||b}
                  @click=${()=>this._togglePicker(a.uid)}
                >⇄</button>
              </div>`:p`<div class="box replan" aria-hidden="true"></div>`:u}
      </li>
    `}_renderConfirm(){let t=this._t,i=this._confirm?.text??"",s=this._confirm?.gesture;return p`
      <div class="confirm" role="alertdialog" aria-label=${t("confirm_remove")}>
        <p>${t("confirm_remove_note",{text:i})}</p>
        <div class="actions">
          <span class="spacer"></span>
          <button type="button" class="btn" @click=${()=>this._confirm=void 0}>${t("cancel")}</button>
          <button
            type="button"
            class="btn danger"
            @click=${()=>{!s||s.type!=="skip"&&s.type!=="save"||this._dispatch({...s,confirmed:!0})}}
          >
            ${t("confirm_remove")}
          </button>
        </div>
      </div>
    `}_renderPicker(t,i,s,r){let o=this._t,d=this._busy.has(t.item.uid),l=this._pickFilter.trim().toLocaleLowerCase(),a=this._hint(t.item.summary),h=z(t.base),c=zt(h.choice?h.original??"":h.text,this._dishes(),a),m=ve(s,a?.tag),g=l?m.filter(f=>`${f.dish.name} ${f.dish.kurz??""} ${f.dish.ort??""}`.toLocaleLowerCase().includes(l)):m,b=f=>f==="training"?o("day_training"):f==="ruhe"||f==="rest"?o("day_rest"):f,x=o("replan_title",{slot:i??t.item.summary});return p`
      <div class="picker" role="group" aria-label=${`${x}: ${t.item.summary}`}>
        <p class="picker-title">${x}</p>
        ${s.length>6?p`<input
              class="field filter"
              type="search"
              .value=${this._pickFilter}
              placeholder=${o("replan_filter")}
              aria-label=${o("replan_filter")}
              @input=${f=>this._pickFilter=f.target.value}
            />`:u}
        <ul class="dishes" role="list">
          ${g.map(({dish:f,fits:y})=>p`<li>
              <button
                type="button"
                class="dish ${f.id===r?"current":""}"
                aria-pressed=${f.id===r?"true":"false"}
                ?disabled=${d}
                @click=${()=>{this._choose(t,f)}}
              >
                <span class="dish-name"
                  >${f.name}${f.id===r?p` <span class="dish-cur">· ${o("replan_current")}</span>`:f.id===c?p` <span class="dish-cur">· ${o("replan_planned")}</span>`:u}</span
                >
                ${y?u:p`<span class="dish-day">${o("dish_other_day",{days:f.tage.map(b).join(", ")})}</span>`}
                ${ht(f,this._lang)?p`<span class="dish-info">${ht(f,this._lang)}</span>`:u}
                ${f.kurz?p`<span class="dish-kurz">${f.kurz}</span>`:u}
              </button>
            </li>`)}
        </ul>
        ${g.length===0?p`<p class="message muted">${o("replan_none")}</p>`:u}
        <div class="actions">
          ${r?p`<button type="button" class="btn danger" ?disabled=${d} @click=${()=>{this._choose(t,null)}}>${o("replan_back")}</button>`:u}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${d} @click=${()=>this._togglePicker(t.item.uid)}>${o("cancel")}</button>
        </div>
      </div>
    `}_renderDishSelect(t){let i=this._runtime();if(!i.dishes_entity||!i.dish_in_note||this._edit?.kind!=="annotation")return u;let s=this._dishes();if(!s.length)return u;let r=this._t,{slot:o,dishes:d}=this._slotDishes(t),l=new Set(d.map(f=>f.id)),a=s.filter(f=>!l.has(f.id)),h=i.multiline?`
`:i.separator,c=this._edit.text,m=(i.multiline?c.split(`
`):c.split(i.separator))[0]??"",g=ft(m).ref?.id??"",b=f=>{let y=f.target,X=s.find(k=>k.id===y.value)??null;y.value===""&&!g||this._dispatch({type:"input",text:Te(this._edit?.text??"",X,s,h)})},x=f=>{let y=ht(f,this._lang);return p`<option value=${f.id} ?selected=${f.id===g}>${y?`${f.name} (${y})`:f.name}</option>`};return p`<select class="field dish-select" aria-label=${r("dish_pick")} @change=${b}>
      <option value="" ?selected=${!g}>${r(g?"dish_pick_none":"dish_pick")}</option>
      ${d.length?p`<optgroup label=${r("dish_group_slot",{slot:o??""})}>${d.map(x)}</optgroup>`:u}
      ${a.length?p`<optgroup label=${r("dish_group_other")}>${a.map(x)}</optgroup>`:u}
    </select>`}_renderEditor(t,i,s){let r=this._t,o=this._runtime(),d=this._busy.has(t.item.uid),l=this._edit?.kind??"annotation",a=r(l==="skip"?"skip_placeholder":"placeholder"),h=m=>{this._dispatch({type:"input",text:m.target.value})},c=d||l==="annotation"&&!this._edit.text.trim();return p`
      <div class="editor" role="group" aria-label=${`${i}: ${t.item.summary}`}>
        <p class="pending" id=${s} role="status">${r("unsaved")}</p>
        ${this._renderDishSelect(t)}
        ${o.multiline?p`<textarea
              class="field"
              rows="2"
              .value=${this._edit.text}
              placeholder=${a}
              aria-label=${i}
              ?disabled=${d}
              @input=${h}
              @keydown=${m=>this._onEditorKey(t,m)}
            ></textarea>`:p`<input
              class="field"
              type="text"
              .value=${this._edit.text}
              placeholder=${a}
              aria-label=${i}
              ?disabled=${d}
              @input=${h}
              @keydown=${m=>this._onEditorKey(t,m)}
            />`}
        <div class="actions">
          ${this._edit.isNew?u:p`<button type="button" class="btn danger" ?disabled=${d} @click=${()=>{this._dispatch({type:"remove",row:this._rowOf(t)})}}>${r("remove",{label:i})}</button>`}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${d} @click=${()=>{this._dispatch({type:"cancel"})}}>${r("cancel")}</button>
          <button type="button" class="btn primary" ?disabled=${c} @click=${()=>{this._dispatch({type:"save",row:this._rowOf(t)})}}>
            ${r("save")}
          </button>
        </div>
      </div>
    `}};J.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_edit:{state:!0},_expanded:{state:!0},_busy:{state:!0},_error:{state:!0},_confirm:{state:!0},_picker:{state:!0},_pickFilter:{state:!0}},J.styles=U`
    :host {
      --tac-marker-color: var(--warning-color, #ff9800);
      --tac-row-gap: 10px;
    }
    ha-card {
      overflow: hidden;
    }
    .card-header {
      margin: 0;
      padding: 16px 16px 4px;
      font-size: var(--ha-card-header-font-size, 1.5rem);
      font-weight: var(--ha-font-weight-normal, 400);
      color: var(--ha-card-header-color, var(--primary-text-color));
      line-height: 1.3;
    }
    .content {
      padding: 4px 8px 12px;
    }
    .message {
      padding: 12px 8px;
      color: var(--primary-text-color);
    }
    .message.muted {
      color: var(--secondary-text-color);
    }
    .message.warning {
      border-left: 4px solid var(--warning-color, #ff9800);
      background: color-mix(in srgb, var(--warning-color, #ff9800) 12%, transparent);
      border-radius: 4px;
      margin: 8px;
    }
    .message.error {
      border-left: 4px solid var(--error-color, #db4437);
      background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      border-radius: 4px;
      margin: 8px 16px 0;
    }
    .item {
      display: grid;
      grid-template-columns: 44px 44px 1fr;
      align-items: start;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      padding: 0 8px 4px 12px;
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .lg {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .sw {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      background: var(--primary-color);
    }
    .sw.ann {
      background: var(--tac-marker-color);
    }
    .sw.skip {
      background: var(--secondary-text-color);
    }
    .lg-marker {
      margin-right: -2px;
    }
    .group-title {
      margin: 12px 8px 2px;
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .item {
      border-radius: 8px;
      padding: 2px 0;
    }
    .item + .item {
      border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    }
    .item.busy {
      opacity: 0.6;
    }
    .box {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      min-width: 44px;
      cursor: pointer;
      position: relative;
    }
    .box input {
      width: 20px;
      height: 20px;
      margin: 0;
      cursor: pointer;
      accent-color: var(--primary-color);
    }
    .box.ann input {
      accent-color: var(--tac-marker-color);
    }
    .box.skip input {
      accent-color: var(--secondary-text-color);
    }
    .box input:disabled {
      cursor: default;
    }
    .ann-icon {
      --mdc-icon-size: 14px;
      position: absolute;
      right: 2px;
      top: 4px;
      color: var(--secondary-text-color);
    }
    .body {
      min-width: 0;
      padding: 0 8px 0 2px;
    }
    .main {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 2px 8px;
      width: 100%;
      min-height: 44px;
      box-sizing: border-box;
      padding: 11px 0;
      text-align: left;
      font: inherit;
      color: inherit;
      background: none;
      border: 0;
      border-radius: 6px;
    }
    button.main {
      cursor: pointer;
      padding-right: 22px;
      position: relative;
    }
    button.main:focus-visible,
    .btn:focus-visible,
    .link:focus-visible,
    .box input:focus-visible,
    .field:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .chev {
      position: absolute;
      right: 4px;
      top: 12px;
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
    .summary {
      flex: 1 1 100%;
      color: var(--primary-text-color);
      word-break: break-word;
    }
    .marker {
      color: var(--tac-marker-color);
      margin-right: 4px;
    }
    .item.done .text {
      color: var(--secondary-text-color);
      text-decoration: line-through;
      text-decoration-color: color-mix(in srgb, var(--secondary-text-color) 60%, transparent);
    }
    .item.done.annotated .text {
      text-decoration: none;
      color: var(--primary-text-color);
    }
    .item.skipped .text {
      color: var(--secondary-text-color);
      text-decoration: none;
    }
    .skip-mark {
      color: var(--secondary-text-color);
    }
    .skip-hint {
      flex: 1 1 100%;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      word-break: break-word;
    }
    .annotation {
      flex: 1 1 100%;
      color: var(--primary-text-color);
      font-weight: 500;
      white-space: pre-line;
      word-break: break-word;
    }
    .due {
      font-size: 0.8rem;
      color: var(--secondary-text-color);
    }
    .base {
      white-space: pre-line;
      word-break: break-word;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      padding: 0 0 10px;
      margin-top: -6px;
    }
    .item.annotated .base {
      border-left: 3px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      padding-left: 8px;
      margin-top: -4px;
    }
    .editor {
      padding: 2px 0 12px;
    }
    .pending {
      margin: 0 0 6px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--tac-marker-color);
    }
    .confirm {
      margin: 0 0 8px;
      padding: 8px 10px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--warning-color, #ff9800) 14%, transparent);
    }
    .confirm p {
      margin: 0;
      word-break: break-word;
    }
    .field {
      width: 100%;
      box-sizing: border-box;
      font: inherit;
      font-size: 16px; /* prevents iOS zoom on focus */
      color: var(--primary-text-color);
      background: var(--input-fill-color, var(--secondary-background-color, rgba(127, 127, 127, 0.08)));
      border: 1px solid var(--input-idle-line-color, var(--divider-color, rgba(127, 127, 127, 0.4)));
      border-radius: 8px;
      padding: 10px 12px;
      resize: vertical;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
      align-items: center;
    }
    .actions.inline {
      margin: -4px 0 8px;
    }
    .spacer {
      flex: 1;
    }
    .btn,
    .link {
      font: inherit;
      font-size: 0.9rem;
      font-weight: 500;
      min-height: 40px;
      padding: 0 14px;
      border-radius: 20px;
      cursor: pointer;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      background: transparent;
      color: var(--primary-color);
    }
    .btn.primary {
      background: var(--primary-color);
      border-color: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .btn.danger {
      color: var(--error-color, #db4437);
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: default;
    }
    .link {
      border: 0;
      padding: 0 4px;
      min-height: 32px;
    }
    .choice {
      flex: 1 1 100%;
      color: var(--primary-color);
      font-size: 0.9rem;
      font-weight: 500;
      word-break: break-word;
    }
    .original {
      margin-top: 6px;
      font-style: italic;
    }
    .box.replan {
      align-self: start;
    }
    .replan-btn {
      width: 36px;
      height: 36px;
      border-radius: 18px;
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
      background: transparent;
      color: var(--primary-color);
      font: inherit;
      font-size: 1.1rem;
      line-height: 1;
      cursor: pointer;
    }
    .replan-btn.chosen {
      background: color-mix(in srgb, var(--primary-color) 16%, transparent);
      border-color: var(--primary-color);
    }
    .replan-btn:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .replan-btn:focus-visible,
    .dish:focus-visible,
    .dish-select:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .picker {
      padding: 2px 0 12px;
      color: var(--primary-text-color);
    }
    .picker-title {
      margin: 0 0 6px;
      font-size: 0.85rem;
      font-weight: 500;
      /* Raw --secondary-text-color is only ~4.4:1 on the old input fill. Mix toward the surface text so small type stays AA. */
      color: color-mix(in srgb, var(--secondary-text-color) 85%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
    }
    .filter {
      margin-bottom: 6px;
    }
    .dishes li + li {
      margin-top: 6px;
    }
    .dish {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
      min-height: 44px;
      box-sizing: border-box;
      padding: 8px 12px;
      text-align: left;
      font: inherit;
      color: var(--primary-text-color);
      -webkit-text-fill-color: currentColor;
      /* Text tokens are for the card surface. --input-fill-color is a separate fill and made this text too light. */
      background: var(--card-background-color, var(--mdc-theme-surface, var(--ha-card-background)));
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
      border-radius: 10px;
      cursor: pointer;
    }
    .dish.current {
      border-color: var(--primary-color);
      box-shadow: inset 0 0 0 1px var(--primary-color);
    }
    .dish:disabled {
      opacity: 0.6;
      cursor: default;
    }
    .dish-name {
      font-weight: 500;
      color: var(--primary-text-color);
      -webkit-text-fill-color: currentColor;
    }
    .dish-cur {
      /* --primary-color is a brand fill (default light cyan) and fails as text on a light surface. */
      color: color-mix(in srgb, var(--primary-color) 50%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
      font-weight: 400;
    }
    .dish-info {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--secondary-text-color) 85%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
    }
    .dish-day {
      font-size: 0.8rem;
      color: color-mix(in srgb, var(--warning-color, #ff9800) 50%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
    }
    .dish-kurz {
      font-size: 0.85rem;
      color: color-mix(in srgb, var(--secondary-text-color) 85%, var(--primary-text-color));
      -webkit-text-fill-color: currentColor;
      word-break: break-word;
    }
    .dish-select {
      margin-bottom: 8px;
      padding: 8px 10px;
      font-size: 16px;
      color: var(--primary-text-color);
      -webkit-text-fill-color: currentColor;
      background: var(--card-background-color, var(--mdc-theme-surface, var(--ha-card-background)));
      color-scheme: inherit;
    }
    .dish-select option,
    .dish-select optgroup {
      color: var(--primary-text-color);
      background-color: var(--card-background-color, var(--mdc-theme-surface, var(--ha-card-background)));
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
    .compact .card-header {
      padding: 12px 12px 0;
      font-size: 1.2rem;
    }
    .compact .main {
      min-height: 36px;
      padding: 7px 0;
    }
    .compact .box {
      min-height: 36px;
    }
    .compact .item {
      grid-template-columns: 38px 38px 1fr;
    }
    .skip-on .item {
      grid-template-columns: 44px 44px 44px 1fr;
    }
    .compact.skip-on .item {
      grid-template-columns: 38px 38px 38px 1fr;
    }
    .replan-on .item {
      grid-template-columns: 44px 44px 1fr 44px;
    }
    .replan-on.skip-on .item {
      grid-template-columns: 44px 44px 44px 1fr 44px;
    }
    .compact.replan-on .item {
      grid-template-columns: 38px 38px 1fr 40px;
    }
    .compact.replan-on.skip-on .item {
      grid-template-columns: 38px 38px 38px 1fr 40px;
    }
  `;var Ue=n=>n&&typeof n=="object"&&"message"in n?String(n.message):String(n),Fe=n=>n.replace(/[^a-zA-Z0-9_-]/g,"_");customElements.get(Y)||customElements.define(Y,J);window.customCards=window.customCards||[];window.customCards.some(n=>n.type===Y)||window.customCards.push({type:Y,name:"Todo Annotate Card",description:"To-do list with a note checkbox, an optional skipped checkbox and an optional dish list.",preview:!0,documentationURL:"https://github.com/LuFuhrmann/todo-annotate-card"});console.info(`%c TODO-ANNOTATE-CARD %c ${Tn} `,"color:#fff;background:#03a9f4;font-weight:700","color:#03a9f4");export{Tn as CARD_VERSION,J as TodoAnnotateCard,Ne as dueDay};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/

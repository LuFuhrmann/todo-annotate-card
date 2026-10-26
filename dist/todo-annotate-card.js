var U=globalThis,H=U.ShadowRoot&&(U.ShadyCSS===void 0||U.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),ue=new WeakMap,C=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(H&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=ue.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&ue.set(t,e))}return e}toString(){return this.cssText}},me=n=>new C(typeof n=="string"?n:n+"",void 0,W),P=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,o,s)=>i+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+n[s+1],n[0]);return new C(t,n,W)},_e=(n,e)=>{if(H)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),o=U.litNonce;o!==void 0&&i.setAttribute("nonce",o),i.textContent=t.cssText,n.appendChild(i)}},q=H?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return me(t)})(n):n;var{is:Ve,defineProperty:je,getOwnPropertyDescriptor:Be,getOwnPropertyNames:Ke,getOwnPropertySymbols:We,getPrototypeOf:qe}=Object,F=globalThis,ge=F.trustedTypes,Ge=ge?ge.emptyScript:"",Je=F.reactiveElementPolyfillSupport,R=(n,e)=>n,G={toAttribute(n,e){switch(e){case Boolean:n=n?Ge:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},be=(n,e)=>!Ve(n,e),fe={attribute:!0,type:String,converter:G,reflect:!1,useDefault:!1,hasChanged:be};Symbol.metadata??=Symbol("metadata"),F.litPropertyMetadata??=new WeakMap;var b=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=fe){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),o=this.getPropertyDescriptor(e,i,t);o!==void 0&&je(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){let{get:o,set:s}=Be(this.prototype,e)??{get(){return this[t]},set(a){this[t]=a}};return{get:o,set(a){let l=o?.call(this);s?.call(this,a),this.requestUpdate(e,l,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??fe}static _$Ei(){if(this.hasOwnProperty(R("elementProperties")))return;let e=qe(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(R("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(R("properties"))){let t=this.properties,i=[...Ke(t),...We(t)];for(let o of i)this.createProperty(o,t[o])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,o]of t)this.elementProperties.set(i,o)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let o=this._$Eu(t,i);o!==void 0&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let o of i)t.unshift(q(o))}else e!==void 0&&t.push(q(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _e(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(o!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:G).toAttribute(t,i.type);this._$Em=e,s==null?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(e,t){let i=this.constructor,o=i._$Eh.get(e);if(o!==void 0&&this._$Em!==o){let s=i.getPropertyOptions(o),a=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:G;this._$Em=o;let l=a.fromAttribute(t,s.type);this[o]=l??this._$Ej?.get(o)??l,this._$Em=null}}requestUpdate(e,t,i,o=!1,s){if(e!==void 0){let a=this.constructor;if(o===!1&&(s=this[e]),i??=a.getPropertyOptions(e),!((i.hasChanged??be)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(a._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:s},a){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,a??t??this[e]),s!==!0||a!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),o===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[o,s]of this._$Ep)this[o]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[o,s]of i){let{wrapped:a}=s,l=this[o];a!==!0||this._$AL.has(o)||l===void 0||this.C(o,void 0,s,l)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[R("elementProperties")]=new Map,b[R("finalized")]=new Map,Je?.({ReactiveElement:b}),(F.reactiveElementVersions??=[]).push("2.1.2");var te=globalThis,ye=n=>n,V=te.trustedTypes,$e=V?V.createPolicy("lit-html",{createHTML:n=>n}):void 0,Ee="$lit$",y=`lit$${Math.random().toFixed(9).slice(2)}$`,Te="?"+y,Ye=`<${Te}>`,v=document,D=()=>v.createComment(""),O=n=>n===null||typeof n!="object"&&typeof n!="function",ie=Array.isArray,Ze=n=>ie(n)||typeof n?.[Symbol.iterator]=="function",J=`[ 	
\f\r]`,I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xe=/-->/g,ve=/>/g,$=RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),we=/'/g,Ae=/"/g,Se=/^(?:script|style|textarea|title)$/i,oe=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),c=oe(1),ht=oe(2),ut=oe(3),w=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),ke=new WeakMap,x=v.createTreeWalker(v,129);function Ce(n,e){if(!ie(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return $e!==void 0?$e.createHTML(e):e}var Qe=(n,e)=>{let t=n.length-1,i=[],o,s=e===2?"<svg>":e===3?"<math>":"",a=I;for(let l=0;l<t;l++){let r=n[l],u,p,d=-1,_=0;for(;_<r.length&&(a.lastIndex=_,p=a.exec(r),p!==null);)_=a.lastIndex,a===I?p[1]==="!--"?a=xe:p[1]!==void 0?a=ve:p[2]!==void 0?(Se.test(p[2])&&(o=RegExp("</"+p[2],"g")),a=$):p[3]!==void 0&&(a=$):a===$?p[0]===">"?(a=o??I,d=-1):p[1]===void 0?d=-2:(d=a.lastIndex-p[2].length,u=p[1],a=p[3]===void 0?$:p[3]==='"'?Ae:we):a===Ae||a===we?a=$:a===xe||a===ve?a=I:(a=$,o=void 0);let g=a===$&&n[l+1].startsWith("/>")?" ":"";s+=a===I?r+Ye:d>=0?(i.push(u),r.slice(0,d)+Ee+r.slice(d)+y+g):r+y+(d===-2?l:g)}return[Ce(n,s+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},M=class n{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let s=0,a=0,l=e.length-1,r=this.parts,[u,p]=Qe(e,t);if(this.el=n.createElement(u,i),x.currentNode=this.el.content,t===2||t===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(o=x.nextNode())!==null&&r.length<l;){if(o.nodeType===1){if(o.hasAttributes())for(let d of o.getAttributeNames())if(d.endsWith(Ee)){let _=p[a++],g=o.getAttribute(d).split(y),A=/([.?@])?(.*)/.exec(_);r.push({type:1,index:s,name:A[2],strings:g,ctor:A[1]==="."?Z:A[1]==="?"?Q:A[1]==="@"?X:E}),o.removeAttribute(d)}else d.startsWith(y)&&(r.push({type:6,index:s}),o.removeAttribute(d));if(Se.test(o.tagName)){let d=o.textContent.split(y),_=d.length-1;if(_>0){o.textContent=V?V.emptyScript:"";for(let g=0;g<_;g++)o.append(d[g],D()),x.nextNode(),r.push({type:2,index:++s});o.append(d[_],D())}}}else if(o.nodeType===8)if(o.data===Te)r.push({type:2,index:s});else{let d=-1;for(;(d=o.data.indexOf(y,d+1))!==-1;)r.push({type:7,index:s}),d+=y.length-1}s++}}static createElement(e,t){let i=v.createElement("template");return i.innerHTML=e,i}};function k(n,e,t=n,i){if(e===w)return e;let o=i!==void 0?t._$Co?.[i]:t._$Cl,s=O(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),s===void 0?o=void 0:(o=new s(n),o._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=o:t._$Cl=o),o!==void 0&&(e=k(n,o._$AS(n,e.values),o,i)),e}var Y=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??v).importNode(t,!0);x.currentNode=o;let s=x.nextNode(),a=0,l=0,r=i[0];for(;r!==void 0;){if(a===r.index){let u;r.type===2?u=new N(s,s.nextSibling,this,e):r.type===1?u=new r.ctor(s,r.name,r.strings,this,e):r.type===6&&(u=new ee(s,this,e)),this._$AV.push(u),r=i[++l]}a!==r?.index&&(s=x.nextNode(),a++)}return x.currentNode=v,o}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},N=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=k(this,e,t),O(e)?e===h||e==null||e===""?(this._$AH!==h&&this._$AR(),this._$AH=h):e!==this._$AH&&e!==w&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ze(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==h&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(v.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,o=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=M.createElement(Ce(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{let s=new Y(o,this),a=s.u(this.options);s.p(t),this.T(a),this._$AH=s}}_$AC(e){let t=ke.get(e.strings);return t===void 0&&ke.set(e.strings,t=new M(e)),t}k(e){ie(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,o=0;for(let s of e)o===t.length?t.push(i=new n(this.O(D()),this.O(D()),this,this.options)):i=t[o],i._$AI(s),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=ye(e).nextSibling;ye(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,s){this.type=1,this._$AH=h,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}_$AI(e,t=this,i,o){let s=this.strings,a=!1;if(s===void 0)e=k(this,e,t,0),a=!O(e)||e!==this._$AH&&e!==w,a&&(this._$AH=e);else{let l=e,r,u;for(e=s[0],r=0;r<s.length-1;r++)u=k(this,l[i+r],t,r),u===w&&(u=this._$AH[r]),a||=!O(u)||u!==this._$AH[r],u===h?e=h:e!==h&&(e+=(u??"")+s[r+1]),this._$AH[r]=u}a&&!o&&this.j(e)}j(e){e===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},Z=class extends E{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===h?void 0:e}},Q=class extends E{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==h)}},X=class extends E{constructor(e,t,i,o,s){super(e,t,i,o,s),this.type=5}_$AI(e,t=this){if((e=k(this,e,t,0)??h)===w)return;let i=this._$AH,o=e===h&&i!==h||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==h&&(i===h||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ee=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){k(this,e)}};var Xe=te.litHtmlPolyfillSupport;Xe?.(M,N),(te.litHtmlVersions??=[]).push("3.3.3");var Pe=(n,e,t)=>{let i=t?.renderBefore??e,o=i._$litPart$;if(o===void 0){let s=t?.renderBefore??null;i._$litPart$=o=new N(e.insertBefore(D(),s),s,void 0,t??{})}return o._$AI(n),o};var ne=globalThis,f=class extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Pe(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return w}};f._$litElement$=!0,f.finalized=!0,ne.litElementHydrateSupport?.({LitElement:f});var et=ne.litElementPolyfillSupport;et?.({LitElement:f});(ne.litElementVersions??=[]).push("4.2.2");var T="\u2757 Abweichung: {text}";var se="{text}",Re=n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function j(n){return!n||n.split(se).length!==2||/[\r\n]/.test(n)?T:n}function tt(n){let[e,t]=j(n).split(se),i=Re(e.trim()).replace(/\s+/g,"\\s*"),o=Re(t.trim()).replace(/\s+/g,"\\s*");return new RegExp(`^\\s*${i}\\s*(.*?)\\s*${o}\\s*$`,"u")}var Ie=n=>n.replace(/\r\n?/g,`
`).split(`
`);function De(n,e){let t=Ie(n??""),i=tt(e.template),o=null,s=-1;for(let l=t.length-1;l>=0;l--){let r=i.exec(t[l]);if(r){o=r[1],s=l;break}}return s===-1?{base:(n??"").replace(/\r\n?/g,`
`).trim(),annotation:null}:{base:t.filter((l,r)=>r!==s).join(`
`).trim(),annotation:o??""}}function it(n,e){return Ie(n).map(t=>t.trim()).filter(t=>t.length>0).join(e.separator)}function re(n,e,t){return!t||!e.separator?n:n.split(e.separator).join(`
`)}function ae(n,e,t){let i=n.replace(/\r\n?/g,`
`).trim(),o=e===null?"":it(e,t);if(!o)return i;let s=j(t.template).replace(se,()=>o);return i?`${i}
${s}`:s}var m={annotation_icon:"mdi:alert-circle-outline",marker:"\u2757",format:T,separator:" / ",auto_complete:!0,on_remove:"keep",multiline:!0,show_completed:!0,completed_section:!1,sort:"manual",group_by:"none",description:"always",show_due:!0,compact:!1,show_header:!0},B=(n,e,t)=>e.includes(n)?n:t;function Oe(n){return{type:n.type,entity:n.entity,title:n.title,annotation_label:n.annotation_label,annotation_icon:n.annotation_icon||m.annotation_icon,marker:n.marker??m.marker,format:j(n.format),separator:typeof n.separator=="string"&&n.separator.length>0?n.separator:m.separator,auto_complete:n.auto_complete??m.auto_complete,on_remove:B(n.on_remove,["keep","reopen"],m.on_remove),multiline:n.multiline??m.multiline,show_completed:n.show_completed??m.show_completed,completed_section:n.completed_section??m.completed_section,sort:B(n.sort,["manual","alpha","due","annotated_first"],m.sort),group_by:B(n.group_by,["none","due_day"],m.group_by),description:B(n.description,["always","collapsed","hidden"],m.description),show_due:n.show_due??m.show_due,compact:n.compact??m.compact,show_header:n.show_header??m.show_header}}function Ne(n){if(!n)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(n))return n;let e=new Date(n);if(isNaN(e.getTime()))return"";let t=i=>String(i).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`}var Me=n=>{if(!n)return Number.POSITIVE_INFINITY;let e=/^\d{4}-\d{2}-\d{2}$/.test(n)?new Date(`${n}T00:00:00`).getTime():new Date(n).getTime();return isNaN(e)?Number.POSITIVE_INFINITY:e};function Le(n,e){let t={template:e.format,separator:e.separator},i=n.map(r=>({item:r,...De(r.description,t)}));e.show_completed||(i=i.filter(r=>r.item.status!=="completed"));let o=new Map(n.map((r,u)=>[r.uid,u])),s={manual:(r,u)=>o.get(r.item.uid)-o.get(u.item.uid),alpha:(r,u)=>r.item.summary.localeCompare(u.item.summary),due:(r,u)=>Me(r.item.due)-Me(u.item.due)||o.get(r.item.uid)-o.get(u.item.uid),annotated_first:(r,u)=>+(u.annotation!==null)-+(r.annotation!==null)||o.get(r.item.uid)-o.get(u.item.uid)};i=[...i].sort(s[e.sort]);let a=[];e.completed_section&&(a=i.filter(r=>r.item.status==="completed"),i=i.filter(r=>r.item.status!=="completed"));let l=[];if(e.group_by==="due_day"){let r=new Map;for(let p of i){let d=Ne(p.item.due);r.has(d)||r.set(d,[]),r.get(d).push(p)}let u=[...r.keys()].sort((p,d)=>p===""?1:d===""?-1:p.localeCompare(d));for(let p of u)l.push({key:p||"nodate",kind:p?"day":"nodate",items:r.get(p)})}else i.length&&l.push({key:"all",kind:"all",items:i});return a.length&&l.push({key:"completed",kind:"completed",items:a}),l}var le={done:"Done",annotate:"Note",save:"Save",cancel:"Cancel",remove:"Remove {label}",edit:"Edit {label}",placeholder:"What was different?",show_details:"Show details",hide_details:"Hide details",completed:"Completed",no_items:"No items",no_entity:"Please choose a to-do list (todo.*) in the card settings.",not_found:"Entity not found: {entity}",unsupported:"This to-do list cannot edit item descriptions, so notes cannot be stored. Use e.g. a Local To-do list.",error:"Saving failed: {error}",due:"Due",no_date:"No date",e_entity:"To-do list",e_title:"Title",e_annotation_label:"Label of the second checkbox",e_annotation_icon:"Icon next to the second checkbox (when the legend is hidden)",e_marker:"Marker for annotated items",e_format:"Storage line in the description ({text} = note)",e_auto_complete:"Adding a note marks the item as done",e_on_remove:"When the note is removed",e_on_remove_keep:"Keep status",e_on_remove_reopen:"Mark as not done",e_multiline:"Multi-line input",e_separator:"Line separator in storage",e_show_completed:"Show completed items",e_completed_section:"Completed items in their own section",e_sort:"Sorting",e_sort_manual:"List order",e_sort_alpha:"Alphabetical",e_sort_due:"Due date",e_sort_annotated:"Annotated first",e_group_by:"Grouping",e_group_none:"None",e_group_day:"By due day",e_description:"Description of normal items",e_desc_always:"Always show",e_desc_collapsed:"Show on tap",e_desc_hidden:"Never show",e_show_due:"Show due date",e_compact:"Compact",e_show_header:"Show legend"},nt={done:"Erledigt",annotate:"Anmerkung",save:"Speichern",cancel:"Abbrechen",remove:"{label} entfernen",edit:"{label} bearbeiten",placeholder:"Was war anders?",show_details:"Details anzeigen",hide_details:"Details ausblenden",completed:"Erledigt",no_items:"Keine Eintr\xE4ge",no_entity:"Bitte in den Karteneinstellungen eine To-do-Liste (todo.*) w\xE4hlen.",not_found:"Entit\xE4t nicht gefunden: {entity}",unsupported:"Diese To-do-Liste kann keine Beschreibungen bearbeiten, Anmerkungen lassen sich daher nicht speichern. Nutze z. B. eine lokale To-do-Liste.",error:"Speichern fehlgeschlagen: {error}",due:"F\xE4llig",no_date:"Ohne Datum",e_entity:"To-do-Liste",e_title:"Titel",e_annotation_label:"Beschriftung der zweiten Checkbox",e_annotation_icon:"Symbol an der zweiten Checkbox (wenn die Legende aus ist)",e_marker:"Markierung angemerkter Punkte",e_format:"Speicherzeile in der Beschreibung ({text} = Anmerkung)",e_auto_complete:"Anmerken hakt den Punkt als erledigt ab",e_on_remove:"Wenn die Anmerkung entfernt wird",e_on_remove_keep:"Status beibehalten",e_on_remove_reopen:"Als nicht erledigt markieren",e_multiline:"Mehrzeilige Eingabe",e_separator:"Zeilentrenner beim Speichern",e_show_completed:"Erledigte Punkte anzeigen",e_completed_section:"Erledigte in eigenem Abschnitt",e_sort:"Sortierung",e_sort_manual:"Reihenfolge der Liste",e_sort_alpha:"Alphabetisch",e_sort_due:"F\xE4lligkeit",e_sort_annotated:"Angemerkte zuerst",e_group_by:"Gruppierung",e_group_none:"Keine",e_group_day:"Nach F\xE4lligkeitstag",e_description:"Beschreibung normaler Punkte",e_desc_always:"Immer anzeigen",e_desc_collapsed:"Beim Antippen",e_desc_hidden:"Nie anzeigen",e_show_due:"F\xE4lligkeit anzeigen",e_compact:"Kompakt",e_show_header:"Legende anzeigen"},st={en:le,de:nt};function K(n){let e=st[(n??"en").split("-")[0].toLowerCase()]??le;return(t,i)=>{let o=e[t]??le[t]??t;if(i)for(let[s,a]of Object.entries(i))o=o.split(`{${s}}`).join(a);return o}}var de={CREATE_TODO_ITEM:1,DELETE_TODO_ITEM:2,UPDATE_TODO_ITEM:4,MOVE_TODO_ITEM:8,SET_DUE_DATE_ON_ITEM:16,SET_DUE_DATETIME_ON_ITEM:32,SET_DESCRIPTION_ON_ITEM:64};var S=class S extends f{setConfig(e){this._config={...e}}get _t(){return K(this.hass?.locale?.language??this.hass?.language)}_set(e,t){if(!this._config)return;let i={...this._config};t===""||t===void 0?delete i[e]:i[e]=t,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_field(e){let t=this._t,i=this._config,o=`f-${e.key}`,s=m[e.key];if(e.kind==="bool"){let a=i[e.key]??s??!1;return c`<label class="row bool" for=${o}>
        <span>${t(e.label)}</span>
        <input id=${o} type="checkbox" role="switch" .checked=${a} @change=${l=>this._set(e.key,l.target.checked)} />
      </label>`}if(e.kind==="select"){let a=i[e.key]??s;return c`<label class="row" for=${o}>
        <span class="lbl">${t(e.label)}</span>
        <select id=${o} @change=${l=>this._set(e.key,l.target.value)}>
          ${e.options.map(([l,r])=>c`<option value=${l} ?selected=${l===a}>${t(r)}</option>`)}
        </select>
      </label>`}return c`<label class="row" for=${o}>
      <span class="lbl">${t(e.label)}</span>
      <input
        id=${o}
        type="text"
        .value=${i[e.key]??""}
        placeholder=${e.placeholder??""}
        @change=${a=>this._set(e.key,a.target.value)}
      />
    </label>`}render(){if(!this._config)return h;let e=this._t,t=Object.keys(this.hass?.states??{}).filter(o=>o.startsWith("todo.")).sort(),i=this._config.entity??"";return c`
      <div class="editor">
        <label class="row" for="f-entity">
          <span class="lbl">${e("e_entity")}</span>
          <select id="f-entity" @change=${o=>this._set("entity",o.target.value)}>
            ${i&&!t.includes(i)?c`<option value=${i} selected>${i}</option>`:h}
            ${i?h:c`<option value="" selected disabled>—</option>`}
            ${t.map(o=>c`<option value=${o} ?selected=${o===i}>
                ${this.hass.states[o].attributes.friendly_name??o} (${o})
              </option>`)}
          </select>
        </label>
        ${S.SECTIONS.map(o=>c`<fieldset>${o.fields.map(s=>this._field(s))}</fieldset>`)}
      </div>
    `}};S.properties={hass:{attribute:!1},_config:{state:!0}},S.SECTIONS=[{fields:[{key:"title",kind:"text",label:"e_title"}]},{fields:[{key:"annotation_label",kind:"text",label:"e_annotation_label"},{key:"annotation_icon",kind:"text",label:"e_annotation_icon",placeholder:m.annotation_icon},{key:"marker",kind:"text",label:"e_marker",placeholder:m.marker},{key:"format",kind:"text",label:"e_format",placeholder:m.format},{key:"auto_complete",kind:"bool",label:"e_auto_complete"},{key:"on_remove",kind:"select",label:"e_on_remove",options:[["keep","e_on_remove_keep"],["reopen","e_on_remove_reopen"]]},{key:"multiline",kind:"bool",label:"e_multiline"},{key:"separator",kind:"text",label:"e_separator",placeholder:JSON.stringify(m.separator)}]},{fields:[{key:"show_completed",kind:"bool",label:"e_show_completed"},{key:"completed_section",kind:"bool",label:"e_completed_section"},{key:"sort",kind:"select",label:"e_sort",options:[["manual","e_sort_manual"],["alpha","e_sort_alpha"],["due","e_sort_due"],["annotated_first","e_sort_annotated"]]},{key:"group_by",kind:"select",label:"e_group_by",options:[["none","e_group_none"],["due_day","e_group_day"]]},{key:"description",kind:"select",label:"e_description",options:[["always","e_desc_always"],["collapsed","e_desc_collapsed"],["hidden","e_desc_hidden"]]},{key:"show_due",kind:"bool",label:"e_show_due"},{key:"show_header",kind:"bool",label:"e_show_header"},{key:"compact",kind:"bool",label:"e_compact"}]}],S.styles=P`
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
  `;var ce=S;customElements.get("todo-annotate-card-editor")||customElements.define("todo-annotate-card-editor",ce);var rt="1.0.0",z="todo-annotate-card",L=class extends f{constructor(){super(...arguments);this._expanded=new Set;this._busy=new Set}static getConfigElement(){return document.createElement(`${z}-editor`)}static getStubConfig(t){return{entity:Object.keys(t?.states??{}).find(o=>o.startsWith("todo."))??""}}setConfig(t){if(!t||typeof t!="object")throw new Error("Invalid configuration");if(t.entity&&!String(t.entity).startsWith("todo."))throw new Error("entity must be a to-do list (todo.*)");let i=Oe(t);this._config?.entity!==i.entity&&(this._items=void 0),this._config=i}getCardSize(){return 2+Math.min(this._items?.length??3,10)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}get _t(){return K(this.hass?.locale?.language??this.hass?.language)}get _fmt(){return{template:this._config?.format??T,separator:this._config?.separator??" / "}}connectedCallback(){super.connectedCallback(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe()}updated(t){if((t.has("hass")||t.has("_config"))&&this._subscribe(),t.has("_edit")&&this._edit){let i=this.renderRoot.querySelector(".editor .field");i&&this.renderRoot.ownerDocument?.activeElement!==i&&!i.dataset.focused&&(i.dataset.focused="1",i.focus())}}_unsubscribe(){let t=this._unsub;this._unsub=void 0,this._subscribedTo=void 0,t?.then(i=>i()).catch(()=>{})}_subscribe(){let t=this._config?.entity;!this.hass||!t||!this.isConnected||!this.hass.states[t]||this._subscribedTo!==t&&(this._unsubscribe(),this._subscribedTo=t,this._unsub=this.hass.connection.subscribeMessage(i=>{this._items=i.items},{type:"todo/item/subscribe",entity_id:t}),this._unsub.catch(i=>{this._subscribedTo=void 0,this._error=this._t("error",{error:ze(i)})}))}_supports(t){return(Number(this.hass?.states[this._config.entity]?.attributes.supported_features??0)&t)===t}async _update(t,i){this._busy=new Set(this._busy).add(t.uid),this._error=void 0;try{return await this.hass.callService("todo","update_item",{item:t.uid,...i},{entity_id:this._config.entity}),!0}catch(o){return this._error=this._t("error",{error:ze(o)}),!1}finally{let o=new Set(this._busy);o.delete(t.uid),this._busy=o}}_toggleDone(t){this._update(t.item,{status:t.item.status==="completed"?"needs_action":"completed"})}_onAnnotateBox(t,i){if(i.target.checked=t.annotation!==null,this._edit?.uid===t.item.uid){this._edit=void 0;return}this._edit={uid:t.item.uid,text:t.annotation===null?"":re(t.annotation,this._fmt,this._config.multiline),isNew:t.annotation===null}}async _save(t){let i=this._edit?.text??"";if(!i.trim()){t.annotation!==null?await this._remove(t):this._edit=void 0;return}let o={description:ae(t.base,i,this._fmt)};this._config.auto_complete&&t.item.status!=="completed"&&(o.status="completed"),await this._update(t.item,o)&&(this._edit=void 0)}async _remove(t){let i={description:ae(t.base,null,this._fmt)};this._config.on_remove==="reopen"&&t.item.status==="completed"&&(i.status="needs_action"),await this._update(t.item,i)&&(this._edit=void 0)}_toggleExpand(t){let i=new Set(this._expanded);i.has(t)?i.delete(t):i.add(t),this._expanded=i}_onEditorKey(t,i){i.key==="Escape"?(i.preventDefault(),this._edit=void 0):i.key==="Enter"&&(!this._config.multiline||i.ctrlKey||i.metaKey)&&(i.preventDefault(),this._save(t))}render(){if(!this._config||!this.hass)return h;let t=this._t,i=this._config,o=i.entity?this.hass.states[i.entity]:void 0,s=i.title??o?.attributes.friendly_name,a=i.annotation_label||t("annotate"),l;if(!i.entity)l=c`<div class="message">${t("no_entity")}</div>`;else if(!o)l=c`<div class="message warning">${t("not_found",{entity:i.entity})}</div>`;else if(this._items===void 0)l=c`<div class="message muted" aria-busy="true">…</div>`;else{let r=this._supports(de.UPDATE_TODO_ITEM),u=this._supports(de.SET_DESCRIPTION_ON_ITEM),p=Le(this._items,i);l=c`
        ${u?h:c`<div class="message warning" role="note">${t("unsupported")}</div>`}
        ${p.length===0?c`<div class="message muted">${t("no_items")}</div>`:c`
              ${i.show_header?c`<div class="legend" aria-hidden="true">
                    <span class="lg"><span class="sw done"></span>${t("done")}</span>
                    <span class="lg"><span class="sw ann"></span>${i.marker?c`<span class="lg-marker">${i.marker}</span>`:h}${a}</span>
                  </div>`:h}
              ${p.map(d=>c`
                  <section class="group" aria-label=${this._groupLabel(d.kind,d.key)}>
                    ${d.kind!=="all"?c`<h3 class="group-title">${this._groupLabel(d.kind,d.key)}</h3>`:h}
                    <ul role="list">
                      ${d.items.map(_=>this._renderItem(_,a,r,u))}
                    </ul>
                  </section>
                `)}
            `}
      `}return c`
      <ha-card class=${i.compact?"compact":""}>
        ${s?c`<h1 class="card-header">${s}</h1>`:h}
        ${this._error?c`<div class="message error" role="alert">${this._error}</div>`:h}
        <div class="content">${l}</div>
      </ha-card>
    `}_groupLabel(t,i){let o=this._t;if(t==="completed")return o("completed");if(t==="nodate")return o("no_date");if(t==="day"){let s=new Date(`${i}T12:00:00`);try{return new Intl.DateTimeFormat(this.hass?.locale?.language??this.hass?.language??"en",{weekday:"long",day:"numeric",month:"long"}).format(s)}catch{return i}}return""}_formatDue(t){let i=this.hass?.locale?.language??this.hass?.language??"en";try{if(/^\d{4}-\d{2}-\d{2}$/.test(t))return new Intl.DateTimeFormat(i,{weekday:"short",day:"numeric",month:"short"}).format(new Date(`${t}T12:00:00`));let o=new Date(t),s=this._config.group_by==="due_day"?{hour:"2-digit",minute:"2-digit"}:{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"};return new Intl.DateTimeFormat(i,s).format(o)}catch{return t}}_renderItem(t,i,o,s){let a=this._t,l=this._config,r=t.item,u=r.status==="completed",p=t.annotation!==null,d=this._busy.has(r.uid),_=this._edit?.uid===r.uid,g=this._expanded.has(r.uid),A=(p||l.description==="collapsed")&&t.base.length>0,Ue=t.base.length>0&&(p||l.description==="collapsed"?g:l.description==="always"),pe=`d-${at(r.uid)}`,He=p?re(t.annotation,this._fmt,!0):"",he=c`
      <span class="summary">
        ${p&&l.marker?c`<span class="marker" aria-hidden="true">${l.marker}</span>`:h}
        <span class="text">${r.summary}</span>
        ${p?c`<span class="sr-only">(${i})</span>`:h}
      </span>
      ${p?c`<span class="annotation">${He}</span>`:h}
      ${l.show_due&&r.due&&(l.group_by!=="due_day"||!/^\d{4}-\d{2}-\d{2}$/.test(r.due))?c`<span class="due">${this._formatDue(r.due)}</span>`:h}
    `;return c`
      <li class="item ${u?"done":""} ${p?"annotated":""} ${d?"busy":""}" aria-busy=${d?"true":"false"}>
        <label class="box" title=${a("done")}>
          <input
            type="checkbox"
            .checked=${u}
            ?disabled=${!o||d}
            aria-label=${`${a("done")}: ${r.summary}`}
            @change=${()=>this._toggleDone(t)}
          />
        </label>
        <label class="box ann" title=${i}>
          <input
            type="checkbox"
            .checked=${p}
            ?disabled=${!o||!s||d}
            aria-label=${`${i}: ${r.summary}`}
            aria-expanded=${_?"true":"false"}
            @change=${Fe=>this._onAnnotateBox(t,Fe)}
          />
          ${l.annotation_icon&&l.show_header===!1?c`<ha-icon class="ann-icon" .icon=${l.annotation_icon} aria-hidden="true"></ha-icon>`:h}
        </label>
        <div class="body">
          ${A?c`<button
                class="main"
                type="button"
                aria-expanded=${g?"true":"false"}
                aria-controls=${pe}
                title=${a(g?"hide_details":"show_details")}
                @click=${()=>this._toggleExpand(r.uid)}
              >
                ${he}<span class="chev" aria-hidden="true">${g?"\u25B4":"\u25BE"}</span>
              </button>`:c`<div class="main">${he}</div>`}
          ${Ue?c`<div class="base" id=${pe}>${t.base}</div>`:h}
          ${p&&g&&!_&&o&&s?c`<div class="actions inline">
                <button type="button" class="link" @click=${()=>this._onAnnotateBox(t,{target:{checked:!0}})}>
                  ${a("edit",{label:i})}
                </button>
              </div>`:h}
          ${_?this._renderEditor(t,i):h}
        </div>
      </li>
    `}_renderEditor(t,i){let o=this._t,s=this._config,a=this._busy.has(t.item.uid),l=r=>{this._edit={...this._edit,text:r.target.value}};return c`
      <div class="editor" role="group" aria-label=${`${i}: ${t.item.summary}`}>
        ${s.multiline?c`<textarea
              class="field"
              rows="2"
              .value=${this._edit.text}
              placeholder=${o("placeholder")}
              aria-label=${i}
              ?disabled=${a}
              @input=${l}
              @keydown=${r=>this._onEditorKey(t,r)}
            ></textarea>`:c`<input
              class="field"
              type="text"
              .value=${this._edit.text}
              placeholder=${o("placeholder")}
              aria-label=${i}
              ?disabled=${a}
              @input=${l}
              @keydown=${r=>this._onEditorKey(t,r)}
            />`}
        <div class="actions">
          ${this._edit.isNew?h:c`<button type="button" class="btn danger" ?disabled=${a} @click=${()=>this._remove(t)}>${o("remove",{label:i})}</button>`}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${a} @click=${()=>this._edit=void 0}>${o("cancel")}</button>
          <button type="button" class="btn primary" ?disabled=${a||!this._edit.text.trim()} @click=${()=>this._save(t)}>
            ${o("save")}
          </button>
        </div>
      </div>
    `}};L.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_edit:{state:!0},_expanded:{state:!0},_busy:{state:!0},_error:{state:!0}},L.styles=P`
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
  `;var ze=n=>n&&typeof n=="object"&&"message"in n?String(n.message):String(n),at=n=>n.replace(/[^a-zA-Z0-9_-]/g,"_");customElements.get(z)||customElements.define(z,L);window.customCards=window.customCards||[];window.customCards.some(n=>n.type===z)||window.customCards.push({type:z,name:"Todo Annotate Card",description:"To-do list with a second checkbox to attach a note (e.g. a deviation) to an item.",preview:!0,documentationURL:"https://github.com/LuFuhrmann/todo-annotate-card"});console.info(`%c TODO-ANNOTATE-CARD %c ${rt} `,"color:#fff;background:#03a9f4;font-weight:700","color:#03a9f4");export{rt as CARD_VERSION,L as TodoAnnotateCard,Ne as dueDay};
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

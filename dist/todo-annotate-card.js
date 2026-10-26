var Z=globalThis,X=Z.ShadowRoot&&(Z.ShadyCSS===void 0||Z.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,at=Symbol(),Dt=new WeakMap,U=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==at)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(X&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=Dt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&Dt.set(t,e))}return e}toString(){return this.cssText}},It=n=>new U(typeof n=="string"?n:n+"",void 0,at),N=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,o)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[o+1],n[0]);return new U(t,n,at)},Ot=(n,e)=>{if(X)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=Z.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},lt=X?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return It(t)})(n):n;var{is:fe,defineProperty:ge,getOwnPropertyDescriptor:_e,getOwnPropertyNames:be,getOwnPropertySymbols:ke,getPrototypeOf:ye}=Object,Q=globalThis,Mt=Q.trustedTypes,xe=Mt?Mt.emptyScript:"",$e=Q.reactiveElementPolyfillSupport,z=(n,e)=>n,dt={toAttribute(n,e){switch(e){case Boolean:n=n?xe:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},Nt=(n,e)=>!fe(n,e),Ut={attribute:!0,type:String,converter:dt,reflect:!1,useDefault:!1,hasChanged:Nt};Symbol.metadata??=Symbol("metadata"),Q.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ut){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&ge(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:o}=_e(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:s,set(r){let d=s?.call(this);o?.call(this,r),this.requestUpdate(e,d,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ut}static _$Ei(){if(this.hasOwnProperty(z("elementProperties")))return;let e=ye(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(z("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(z("properties"))){let t=this.properties,i=[...be(t),...ke(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(lt(s))}else e!==void 0&&t.push(lt(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ot(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let o=(i.converter?.toAttribute!==void 0?i.converter:dt).toAttribute(t,i.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let o=i.getPropertyOptions(s),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:dt;this._$Em=s;let d=r.fromAttribute(t,o.type);this[s]=d??this._$Ej?.get(s)??d,this._$Em=null}}requestUpdate(e,t,i,s=!1,o){if(e!==void 0){let r=this.constructor;if(s===!1&&(o=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??Nt)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,o]of this._$Ep)this[s]=o;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,o]of i){let{wrapped:r}=o,d=this[s];r!==!0||this._$AL.has(s)||d===void 0||this.C(s,void 0,o,d)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[z("elementProperties")]=new Map,y[z("finalized")]=new Map,$e?.({ReactiveElement:y}),(Q.reactiveElementVersions??=[]).push("2.1.2");var gt=globalThis,zt=n=>n,tt=gt.trustedTypes,Lt=tt?tt.createPolicy("lit-html",{createHTML:n=>n}):void 0,Bt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,Wt="?"+x,ve=`<${Wt}>`,A=document,F=()=>A.createComment(""),H=n=>n===null||typeof n!="object"&&typeof n!="function",_t=Array.isArray,Se=n=>_t(n)||typeof n?.[Symbol.iterator]=="function",pt=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ft=/-->/g,Ht=/>/g,S=RegExp(`>|${pt}(?:([^\\s"'>=/]+)(${pt}*=${pt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Kt=/'/g,Vt=/"/g,Gt=/^(?:script|style|textarea|title)$/i,bt=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),m=bt(1),Qe=bt(2),tn=bt(3),E=Symbol.for("lit-noChange"),u=Symbol.for("lit-nothing"),jt=new WeakMap,w=A.createTreeWalker(A,129);function qt(n,e){if(!_t(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Lt!==void 0?Lt.createHTML(e):e}var we=(n,e)=>{let t=n.length-1,i=[],s,o=e===2?"<svg>":e===3?"<math>":"",r=L;for(let d=0;d<t;d++){let a=n[d],l,c,p=-1,h=0;for(;h<a.length&&(r.lastIndex=h,c=r.exec(a),c!==null);)h=r.lastIndex,r===L?c[1]==="!--"?r=Ft:c[1]!==void 0?r=Ht:c[2]!==void 0?(Gt.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=S):c[3]!==void 0&&(r=S):r===S?c[0]===">"?(r=s??L,p=-1):c[1]===void 0?p=-2:(p=r.lastIndex-c[2].length,l=c[1],r=c[3]===void 0?S:c[3]==='"'?Vt:Kt):r===Vt||r===Kt?r=S:r===Ft||r===Ht?r=L:(r=S,s=void 0);let g=r===S&&n[d+1].startsWith("/>")?" ":"";o+=r===L?a+ve:p>=0?(i.push(l),a.slice(0,p)+Bt+a.slice(p)+x+g):a+x+(p===-2?d:g)}return[qt(n,o+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},K=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let o=0,r=0,d=e.length-1,a=this.parts,[l,c]=we(e,t);if(this.el=n.createElement(l,i),w.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=w.nextNode())!==null&&a.length<d;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(Bt)){let h=c[r++],g=s.getAttribute(p).split(x),_=/([.?@])?(.*)/.exec(h);a.push({type:1,index:o,name:_[2],strings:g,ctor:_[1]==="."?ut:_[1]==="?"?ht:_[1]==="@"?mt:D}),s.removeAttribute(p)}else p.startsWith(x)&&(a.push({type:6,index:o}),s.removeAttribute(p));if(Gt.test(s.tagName)){let p=s.textContent.split(x),h=p.length-1;if(h>0){s.textContent=tt?tt.emptyScript:"";for(let g=0;g<h;g++)s.append(p[g],F()),w.nextNode(),a.push({type:2,index:++o});s.append(p[h],F())}}}else if(s.nodeType===8)if(s.data===Wt)a.push({type:2,index:o});else{let p=-1;for(;(p=s.data.indexOf(x,p+1))!==-1;)a.push({type:7,index:o}),p+=x.length-1}o++}}static createElement(e,t){let i=A.createElement("template");return i.innerHTML=e,i}};function P(n,e,t=n,i){if(e===E)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,o=H(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=P(n,s._$AS(n,e.values),s,i)),e}var ct=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??A).importNode(t,!0);w.currentNode=s;let o=w.nextNode(),r=0,d=0,a=i[0];for(;a!==void 0;){if(r===a.index){let l;a.type===2?l=new V(o,o.nextSibling,this,e):a.type===1?l=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(l=new ft(o,this,e)),this._$AV.push(l),a=i[++d]}r!==a?.index&&(o=w.nextNode(),r++)}return w.currentNode=A,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},V=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=u,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),H(e)?e===u||e==null||e===""?(this._$AH!==u&&this._$AR(),this._$AH=u):e!==this._$AH&&e!==E&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Se(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==u&&H(this._$AH)?this._$AA.nextSibling.data=e:this.T(A.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=K.createElement(qt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let o=new ct(s,this),r=o.u(this.options);o.p(t),this.T(r),this._$AH=o}}_$AC(e){let t=jt.get(e.strings);return t===void 0&&jt.set(e.strings,t=new K(e)),t}k(e){_t(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let o of e)s===t.length?t.push(i=new n(this.O(F()),this.O(F()),this,this.options)):i=t[s],i._$AI(o),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=zt(e).nextSibling;zt(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},D=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,o){this.type=1,this._$AH=u,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=u}_$AI(e,t=this,i,s){let o=this.strings,r=!1;if(o===void 0)e=P(this,e,t,0),r=!H(e)||e!==this._$AH&&e!==E,r&&(this._$AH=e);else{let d=e,a,l;for(e=o[0],a=0;a<o.length-1;a++)l=P(this,d[i+a],t,a),l===E&&(l=this._$AH[a]),r||=!H(l)||l!==this._$AH[a],l===u?e=u:e!==u&&(e+=(l??"")+o[a+1]),this._$AH[a]=l}r&&!s&&this.j(e)}j(e){e===u?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},ut=class extends D{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===u?void 0:e}},ht=class extends D{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==u)}},mt=class extends D{constructor(e,t,i,s,o){super(e,t,i,s,o),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??u)===E)return;let i=this._$AH,s=e===u&&i!==u||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==u&&(i===u||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ft=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var Ae=gt.litHtmlPolyfillSupport;Ae?.(K,V),(gt.litHtmlVersions??=[]).push("3.3.3");var Jt=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let o=t?.renderBefore??null;i._$litPart$=s=new V(e.insertBefore(F(),o),o,void 0,t??{})}return s._$AI(n),s};var kt=globalThis,b=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Jt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};b._$litElement$=!0,b.finalized=!0,kt.litElementHydrateSupport?.({LitElement:b});var Ee=kt.litElementPolyfillSupport;Ee?.({LitElement:b});(kt.litElementVersions??=[]).push("4.2.2");var Te="\u2298 Ausgelassen",Ce="\u2298 Skipped",et="\u2757 Abweichung: {text}";var T="{text}",j=n=>n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");function nt(n){return!n||n.split(T).length!==2||/[\r\n]/.test(n)?et:n}function Re(n){let[e,t]=nt(n).split(T),i=j(e.trim()).replace(/\s+/g,"\\s*"),s=j(t.trim()).replace(/\s+/g,"\\s*");return new RegExp(`^\\s*${i}\\s*(.*?)\\s*${s}\\s*$`,"u")}var Yt=n=>n.replace(/\r\n?/g,`
`).split(`
`);function Zt(n,e){return Yt(n).map(t=>t.trim()).filter(t=>t.length>0).join(e.separator)}function $(n,e,t){return!t||!e.separator?n:n.split(e.separator).join(`
`)}function yt(n){return(n??"en").toLowerCase().startsWith("de")?Te:Ce}function k(n){return n.split(T).length===2}function Pe(n,e){if(n===void 0)return e;let t=n.trim();return!t||/[\r\n]/.test(t)||t.split(T).length>2?e:t}function Xt(n,e){let t=yt(e);return Pe(n&&n.trim()?n:void 0,t)}function De(n){let[e,t]=n.split(T),i=j(e.trim()).replace(/\s+/g,"\\s*"),s=j((t??"").trim()).replace(/\s+/g,"\\s*");return new RegExp(`^\\s*${i}\\s*(.*?)\\s*${s}\\s*$`,"u")}function Ie(n){let e=j(n.trim()).replace(/\s+/g,"\\s*");return new RegExp(`^\\s*${e}\\s*$`,"u")}function Oe(n,e){if(k(e.template)){let t=De(e.template).exec(n);return t?t[1]:null}return Ie(e.template).test(n)?"":null}function Me(n,e){if(!k(n.template))return n.template.trim();let t=Zt(e,{template:n.template,separator:n.separator});return n.template.replace(T,()=>t)}function it(n,e,t){let i=n??"",s=Yt(i),o=Re(e.template),r=-1,d=null;for(let p=s.length-1;p>=0;p--){let h=o.exec(s[p]);if(h){d=h[1],r=p;break}}let a=-1,l=null;if(t)for(let p=s.length-1;p>=0;p--){if(p===r)continue;let h=Oe(s[p],t);if(h!==null){l=h,a=p;break}}return r===-1&&a===-1?{base:i.replace(/\r\n?/g,`
`).trim(),annotation:null,skip:null}:{base:s.filter((p,h)=>h!==r&&h!==a).join(`
`).trim(),annotation:d,skip:l}}function I(n,e,t,i,s){let o=[],r=n.replace(/\r\n?/g,`
`).trim();if(r&&o.push(r),e!==null){let d=Zt(e,i);d&&o.push(nt(i.template).replace(T,()=>d))}return t!==null&&s&&o.push(Me(s,t)),o.join(`
`)}var f={annotation_icon:"mdi:alert-circle-outline",marker:"\u2757",format:et,separator:" / ",auto_complete:!0,on_remove:"keep",multiline:!0,show_completed:!0,completed_section:!1,sort:"manual",group_by:"none",description:"always",show_due:!0,compact:!1,show_header:!0,skip:!1,skip_format:""},st=(n,e,t)=>e.includes(n)?n:t;function Qt(n){return{type:n.type,entity:n.entity,title:n.title,annotation_label:n.annotation_label,annotation_icon:n.annotation_icon||f.annotation_icon,marker:n.marker??f.marker,format:nt(n.format),separator:typeof n.separator=="string"&&n.separator.length>0?n.separator:f.separator,auto_complete:n.auto_complete??f.auto_complete,on_remove:st(n.on_remove,["keep","reopen"],f.on_remove),multiline:n.multiline??f.multiline,show_completed:n.show_completed??f.show_completed,completed_section:n.completed_section??f.completed_section,sort:st(n.sort,["manual","alpha","due","annotated_first"],f.sort),group_by:st(n.group_by,["none","due_day"],f.group_by),description:st(n.description,["always","collapsed","hidden"],f.description),show_due:n.show_due??f.show_due,compact:n.compact??f.compact,show_header:n.show_header??f.show_header,skip:n.skip??f.skip,skip_label:n.skip_label,skip_format:typeof n.skip_format=="string"?n.skip_format:f.skip_format}}var Ne="todo-annotate-card:draft:v1";function xt(n,e,t){return`${Ne}:${encodeURIComponent(n)}:${encodeURIComponent(e)}:${t}`}function te(n,e,t){try{return localStorage.getItem(xt(n,e,t))}catch{return null}}function ee(n,e,t,i){try{localStorage.setItem(xt(n,e,t),i)}catch{}}function $t(n,e,t){try{localStorage.removeItem(xt(n,e,t))}catch{}}var St=n=>(n??"").trim();function vt(n,e){return n.annotation===null?null:$(n.annotation,e.annotation,!0)}function ze(n,e){return n.skip===null||!e.skip?null:k(e.skip.template)?$(n.skip,{template:e.skip.template,separator:e.skip.separator},!0):""}function G(n,e,t,i){let s=I(n.base,e,null,t.annotation,t.skip),o={uid:n.uid,description:s,clearDrafts:["annotation"]};return i?o.status=i:t.autoComplete&&n.status!=="completed"&&(o.status="completed"),o}function ie(n,e){let t=I(n.base,null,ze(n,e),e.annotation,e.skip),i={uid:n.uid,description:t,clearDrafts:["annotation"]};return e.onRemove==="reopen"&&n.status==="completed"&&(i.status="needs_action"),i}function B(n,e,t){let i=I(n.base,null,e,t.annotation,t.skip);return{uid:n.uid,description:i,status:"completed",clearDrafts:["skip","annotation"]}}function se(n,e){let t=I(n.base,vt(n,e),null,e.annotation,e.skip);return{uid:n.uid,description:t,clearDrafts:["skip"]}}function ne(n,e,t){let i=I(n.base,t,null,e.annotation,e.skip);return{uid:n.uid,description:i,status:"needs_action",clearDrafts:t&&t.trim()?["skip","annotation"]:["skip"]}}function W(n,e,t){return n.text.trim()?n.kind==="annotation"?G(e,n.text,t):t.skip?B(e,n.text,t):null:null}function wt(n,e,t,i){let s=i.get(n.uid,e),o="",r=!0;return e==="annotation"?(r=n.annotation===null,o=n.annotation===null?"":$(n.annotation,t.annotation,t.multiline)):(r=n.skip===null,n.skip!==null&&t.skip&&k(t.skip.template)&&(o=$(n.skip,{template:t.skip.template,separator:t.skip.separator},t.multiline))),{uid:n.uid,kind:e,text:s!==null?s:o,isNew:r}}function Le(n,e){return e&&e.uid===n.uid&&e.kind==="annotation"&&e.text.trim()?e.text.trim():St(n.annotation)}function oe(n,e,t,i,s){switch(t.type){case"input":return n?{editor:{...n,text:t.text},updates:[],remember:{uid:n.uid,kind:n.kind,text:t.text}}:{editor:null,updates:[]};case"cancel":return n?{editor:null,updates:[],remember:{uid:n.uid,kind:n.kind,text:n.text}}:{editor:null,updates:[]};case"save":return Fe(n,t.row,i,t.confirmed===!0);case"remove":return He(n,t.row,i);case"annotate":return Ke(n,e,t.row,i,s);case"done":return Ve(n,e,t.row,i);case"skip":return je(n,e,t.row,i,s,t.confirmed===!0);case"edit-skip":return Be(n,e,t.row,i,s);default:return{editor:n,updates:[]}}}function Fe(n,e,t,i){if(!n||n.uid!==e.uid)return{editor:n,updates:[]};if(n.kind==="annotation")return n.text.trim()?{editor:null,updates:[G(e,n.text,t)]}:e.annotation!==null?{editor:null,updates:[ie(e,t)]}:{editor:null,updates:[],forgetDraft:{uid:n.uid,kind:"annotation"}};if(!t.skip)return{editor:n,updates:[]};let s=St(e.annotation);return s&&!i?{editor:n,updates:[],confirmRemoveAnnotation:{text:s}}:{editor:null,updates:[B(e,n.text,t)]}}function He(n,e,t){return!n||n.uid!==e.uid?{editor:n,updates:[]}:n.kind==="skip"?e.skip===null?{editor:null,updates:[],forgetDraft:{uid:e.uid,kind:"skip"}}:{editor:null,updates:[se(e,t)]}:e.annotation===null&&!n.text.trim()?{editor:null,updates:[],forgetDraft:{uid:e.uid,kind:"annotation"}}:{editor:null,updates:[ie(e,t)]}}function Ke(n,e,t,i,s){if(n&&n.uid===t.uid&&n.kind==="annotation"&&n)return n.text.trim()?{editor:null,updates:[G(t,n.text,i)]}:{editor:null,updates:[],forgetDraft:{uid:t.uid,kind:"annotation"}};if(n&&n.text.trim()&&!e)return{editor:n,updates:[]};let r=[];if(n&&n.text.trim()&&e){let d=W(n,e,i);d&&r.push(d)}return{editor:wt(t,"annotation",i,s),updates:r}}function Ve(n,e,t,i){let s=t.status==="completed"?"needs_action":"completed",o=n&&n.uid===t.uid?n:null;if(o&&o.kind==="annotation"&&o.text.trim())return{editor:null,updates:[G(t,o.text,i,s)]};if(o&&o.kind==="skip"&&s==="needs_action")return{editor:null,updates:[ne(t,i,vt(t,i))],remember:{uid:t.uid,kind:"skip",text:o.text}};if(o&&o.kind==="skip"&&o.text.trim())return{editor:null,updates:[B(t,o.text,i)]};if(n&&n.text.trim()&&n.uid!==t.uid&&!e)return{editor:n,updates:[]};let r=[],d=o&&!o.text.trim()?o:n&&n.uid!==t.uid?n:null;if(n&&n.uid!==t.uid&&n.text.trim()&&e){let a=W(n,e,i);a&&r.push(a),d=null}return s==="needs_action"&&t.skip!==null?r.push(ne(t,i,vt(t,i))):r.push({uid:t.uid,status:s,clearDrafts:[]}),{editor:d,updates:r}}function je(n,e,t,i,s,o){if(!i.skip)return{editor:n,updates:[]};let r=n&&n.uid===t.uid&&n.kind==="skip"?n:null;if(r){if(k(i.skip.template)&&!r.text.trim())return{editor:null,updates:[],forgetDraft:{uid:t.uid,kind:"skip"}};let p=St(t.annotation);return p&&!o?{editor:n,updates:[],confirmRemoveAnnotation:{text:p}}:{editor:null,updates:[B(t,r.text,i)]}}if(t.skip!==null){if(n&&n.uid!==t.uid&&n.text.trim()&&!e)return{editor:n,updates:[]};let c=[],p=n&&n.uid!==t.uid?n:null;if(n&&n.uid===t.uid&&n.kind==="annotation"&&n.text.trim())return c.push(G(t,n.text,i)),{editor:null,updates:c};if(n&&n.uid!==t.uid&&n.text.trim()&&e){let h=W(n,e,i);h&&c.push(h),p=null}return c.push(se(t,i)),{editor:p,updates:c}}let d=n&&n.uid===t.uid&&n.kind==="annotation"?{uid:t.uid,kind:"annotation",text:n.text}:void 0;if(k(i.skip.template))return{editor:wt(t,"skip",i,s),updates:[],remember:d};let a=Le(t,n);if(a&&!o)return{editor:n,updates:[],confirmRemoveAnnotation:{text:a}};if(n&&n.uid!==t.uid&&n.text.trim()&&!e)return{editor:n,updates:[]};let l=[];if(n&&n.uid!==t.uid&&n.text.trim()&&e){let c=W(n,e,i);c&&l.push(c)}return l.push(B(t,"",i)),{editor:null,updates:l,remember:d}}function Be(n,e,t,i,s){if(!i.skip)return{editor:n,updates:[]};if(n&&n.uid===t.uid&&n.kind==="skip")return{editor:n,updates:[]};if(n&&n.text.trim()&&!e)return{editor:n,updates:[]};let o=[];if(n&&n.text.trim()&&e){let r=W(n,e,i);r&&o.push(r)}return{editor:wt(t,"skip",i,s),updates:o}}function ae(n){if(!n)return"";if(/^\d{4}-\d{2}-\d{2}$/.test(n))return n;let e=new Date(n);if(isNaN(e.getTime()))return"";let t=i=>String(i).padStart(2,"0");return`${e.getFullYear()}-${t(e.getMonth()+1)}-${t(e.getDate())}`}var re=n=>{if(!n)return Number.POSITIVE_INFINITY;let e=/^\d{4}-\d{2}-\d{2}$/.test(n)?new Date(`${n}T00:00:00`).getTime():new Date(n).getTime();return isNaN(e)?Number.POSITIVE_INFINITY:e};function le(n,e){let t={template:e.format,separator:e.separator},i=e.skip&&e.skip_format?{template:e.skip_format,separator:e.separator}:null,s=n.map(l=>({item:l,...it(l.description,t,i)}));e.show_completed||(s=s.filter(l=>l.item.status!=="completed"));let o=new Map(n.map((l,c)=>[l.uid,c])),r={manual:(l,c)=>o.get(l.item.uid)-o.get(c.item.uid),alpha:(l,c)=>l.item.summary.localeCompare(c.item.summary),due:(l,c)=>re(l.item.due)-re(c.item.due)||o.get(l.item.uid)-o.get(c.item.uid),annotated_first:(l,c)=>+(c.annotation!==null)-+(l.annotation!==null)||o.get(l.item.uid)-o.get(c.item.uid)};s=[...s].sort(r[e.sort]);let d=[];e.completed_section&&(d=s.filter(l=>l.item.status==="completed"),s=s.filter(l=>l.item.status!=="completed"));let a=[];if(e.group_by==="due_day"){let l=new Map;for(let p of s){let h=ae(p.item.due);l.has(h)||l.set(h,[]),l.get(h).push(p)}let c=[...l.keys()].sort((p,h)=>p===""?1:h===""?-1:p.localeCompare(h));for(let p of c)a.push({key:p||"nodate",kind:p?"day":"nodate",items:l.get(p)})}else s.length&&a.push({key:"all",kind:"all",items:s});return d.length&&a.push({key:"completed",kind:"completed",items:d}),a}var At={done:"Done",annotate:"Note",save:"Save",cancel:"Cancel",remove:"Remove {label}",edit:"Edit {label}",placeholder:"What was different?",unsaved:"Not saved yet",skipped:"Skipped",skip_placeholder:"Why was this skipped?",confirm_remove_note:"Remove the note \u201C{text}\u201D? This item will be marked skipped instead.",confirm_remove:"Remove note",show_details:"Show details",hide_details:"Hide details",completed:"Completed",no_items:"No items",no_entity:"Please choose a to-do list (todo.*) in the card settings.",not_found:"Entity not found: {entity}",unsupported:"This to-do list cannot edit item descriptions, so notes cannot be stored. Use e.g. a Local To-do list.",error:"Saving failed: {error}",due:"Due",no_date:"No date",e_entity:"To-do list",e_title:"Title",e_annotation_label:"Label of the second checkbox",e_annotation_icon:"Icon next to the second checkbox (when the legend is hidden)",e_marker:"Marker for annotated items",e_format:"Storage line in the description ({text} = note)",e_auto_complete:"Adding a note marks the item as done",e_on_remove:"When the note is removed",e_on_remove_keep:"Keep status",e_on_remove_reopen:"Mark as not done",e_multiline:"Multi-line input",e_separator:"Line separator in storage",e_show_completed:"Show completed items",e_completed_section:"Completed items in their own section",e_sort:"Sorting",e_sort_manual:"List order",e_sort_alpha:"Alphabetical",e_sort_due:"Due date",e_sort_annotated:"Annotated first",e_group_by:"Grouping",e_group_none:"None",e_group_day:"By due day",e_description:"Description of normal items",e_desc_always:"Always show",e_desc_collapsed:"Show on tap",e_desc_hidden:"Never show",e_show_due:"Show due date",e_compact:"Compact",e_show_header:"Show legend",e_skip:"Third checkbox: skipped",e_skip_label:"Label of the skipped checkbox",e_skip_format:"Storage line for skipped items ({text} = reason, optional)"},We={done:"Erledigt",annotate:"Anmerkung",save:"Speichern",cancel:"Abbrechen",remove:"{label} entfernen",edit:"{label} bearbeiten",placeholder:"Was war anders?",unsaved:"Noch nicht gespeichert",skipped:"Ausgelassen",skip_placeholder:"Warum ausgelassen?",confirm_remove_note:"Anmerkung \u201E{text}\u201C entfernen? Der Punkt wird stattdessen als ausgelassen markiert.",confirm_remove:"Anmerkung entfernen",show_details:"Details anzeigen",hide_details:"Details ausblenden",completed:"Erledigt",no_items:"Keine Eintr\xE4ge",no_entity:"Bitte in den Karteneinstellungen eine To-do-Liste (todo.*) w\xE4hlen.",not_found:"Entit\xE4t nicht gefunden: {entity}",unsupported:"Diese To-do-Liste kann keine Beschreibungen bearbeiten, Anmerkungen lassen sich daher nicht speichern. Nutze z. B. eine lokale To-do-Liste.",error:"Speichern fehlgeschlagen: {error}",due:"F\xE4llig",no_date:"Ohne Datum",e_entity:"To-do-Liste",e_title:"Titel",e_annotation_label:"Beschriftung der zweiten Checkbox",e_annotation_icon:"Symbol an der zweiten Checkbox (wenn die Legende aus ist)",e_marker:"Markierung angemerkter Punkte",e_format:"Speicherzeile in der Beschreibung ({text} = Anmerkung)",e_auto_complete:"Anmerken hakt den Punkt als erledigt ab",e_on_remove:"Wenn die Anmerkung entfernt wird",e_on_remove_keep:"Status beibehalten",e_on_remove_reopen:"Als nicht erledigt markieren",e_multiline:"Mehrzeilige Eingabe",e_separator:"Zeilentrenner beim Speichern",e_show_completed:"Erledigte Punkte anzeigen",e_completed_section:"Erledigte in eigenem Abschnitt",e_sort:"Sortierung",e_sort_manual:"Reihenfolge der Liste",e_sort_alpha:"Alphabetisch",e_sort_due:"F\xE4lligkeit",e_sort_annotated:"Angemerkte zuerst",e_group_by:"Gruppierung",e_group_none:"Keine",e_group_day:"Nach F\xE4lligkeitstag",e_description:"Beschreibung normaler Punkte",e_desc_always:"Immer anzeigen",e_desc_collapsed:"Beim Antippen",e_desc_hidden:"Nie anzeigen",e_show_due:"F\xE4lligkeit anzeigen",e_compact:"Kompakt",e_show_header:"Legende anzeigen",e_skip:"Dritte Checkbox: ausgelassen",e_skip_label:"Beschriftung der Ausgelassen-Checkbox",e_skip_format:"Speicherzeile f\xFCr ausgelassene Punkte ({text} = Grund, optional)"},Ge={en:At,de:We};function ot(n){let e=Ge[(n??"en").split("-")[0].toLowerCase()]??At;return(t,i)=>{let s=e[t]??At[t]??t;if(i)for(let[o,r]of Object.entries(i))s=s.split(`{${o}}`).join(r);return s}}var Et={CREATE_TODO_ITEM:1,DELETE_TODO_ITEM:2,UPDATE_TODO_ITEM:4,MOVE_TODO_ITEM:8,SET_DUE_DATE_ON_ITEM:16,SET_DUE_DATETIME_ON_ITEM:32,SET_DESCRIPTION_ON_ITEM:64};var O=class O extends b{setConfig(e){this._config={...e}}get _t(){return ot(this.hass?.locale?.language??this.hass?.language)}_set(e,t){if(!this._config)return;let i={...this._config};t===""||t===void 0?delete i[e]:i[e]=t,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_field(e){let t=this._t,i=this._config,s=`f-${e.key}`,o=f[e.key];if(e.kind==="bool"){let d=i[e.key]??o??!1;return m`<label class="row bool" for=${s}>
        <span>${t(e.label)}</span>
        <input id=${s} type="checkbox" role="switch" .checked=${d} @change=${a=>this._set(e.key,a.target.checked)} />
      </label>`}if(e.kind==="select"){let d=i[e.key]??o;return m`<label class="row" for=${s}>
        <span class="lbl">${t(e.label)}</span>
        <select id=${s} @change=${a=>this._set(e.key,a.target.value)}>
          ${e.options.map(([a,l])=>m`<option value=${a} ?selected=${a===d}>${t(l)}</option>`)}
        </select>
      </label>`}let r=e.key==="skip_format"?yt(this.hass?.locale?.language??this.hass?.language):e.placeholder??"";return m`<label class="row" for=${s}>
      <span class="lbl">${t(e.label)}</span>
      <input
        id=${s}
        type="text"
        .value=${i[e.key]??""}
        placeholder=${r}
        @change=${d=>this._set(e.key,d.target.value)}
      />
    </label>`}render(){if(!this._config)return u;let e=this._t,t=Object.keys(this.hass?.states??{}).filter(s=>s.startsWith("todo.")).sort(),i=this._config.entity??"";return m`
      <div class="editor">
        <label class="row" for="f-entity">
          <span class="lbl">${e("e_entity")}</span>
          <select id="f-entity" @change=${s=>this._set("entity",s.target.value)}>
            ${i&&!t.includes(i)?m`<option value=${i} selected>${i}</option>`:u}
            ${i?u:m`<option value="" selected disabled>—</option>`}
            ${t.map(s=>m`<option value=${s} ?selected=${s===i}>
                ${this.hass.states[s].attributes.friendly_name??s} (${s})
              </option>`)}
          </select>
        </label>
        ${O.SECTIONS.map(s=>m`<fieldset>${s.fields.map(o=>this._field(o))}</fieldset>`)}
      </div>
    `}};O.properties={hass:{attribute:!1},_config:{state:!0}},O.SECTIONS=[{fields:[{key:"title",kind:"text",label:"e_title"}]},{fields:[{key:"annotation_label",kind:"text",label:"e_annotation_label"},{key:"annotation_icon",kind:"text",label:"e_annotation_icon",placeholder:f.annotation_icon},{key:"marker",kind:"text",label:"e_marker",placeholder:f.marker},{key:"format",kind:"text",label:"e_format",placeholder:f.format},{key:"auto_complete",kind:"bool",label:"e_auto_complete"},{key:"on_remove",kind:"select",label:"e_on_remove",options:[["keep","e_on_remove_keep"],["reopen","e_on_remove_reopen"]]},{key:"multiline",kind:"bool",label:"e_multiline"},{key:"separator",kind:"text",label:"e_separator",placeholder:JSON.stringify(f.separator)}]},{fields:[{key:"show_completed",kind:"bool",label:"e_show_completed"},{key:"completed_section",kind:"bool",label:"e_completed_section"},{key:"sort",kind:"select",label:"e_sort",options:[["manual","e_sort_manual"],["alpha","e_sort_alpha"],["due","e_sort_due"],["annotated_first","e_sort_annotated"]]},{key:"group_by",kind:"select",label:"e_group_by",options:[["none","e_group_none"],["due_day","e_group_day"]]},{key:"description",kind:"select",label:"e_description",options:[["always","e_desc_always"],["collapsed","e_desc_collapsed"],["hidden","e_desc_hidden"]]},{key:"show_due",kind:"bool",label:"e_show_due"},{key:"show_header",kind:"bool",label:"e_show_header"},{key:"compact",kind:"bool",label:"e_compact"}]},{fields:[{key:"skip",kind:"bool",label:"e_skip"},{key:"skip_label",kind:"text",label:"e_skip_label"},{key:"skip_format",kind:"text",label:"e_skip_format"}]}],O.styles=N`
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
  `;var Tt=O;customElements.get("todo-annotate-card-editor")||customElements.define("todo-annotate-card-editor",Tt);var qe="1.1.0",J="todo-annotate-card",q=class extends b{constructor(){super(...arguments);this._expanded=new Set;this._busy=new Set}static getConfigElement(){return document.createElement(`${J}-editor`)}static getStubConfig(t){return{entity:Object.keys(t?.states??{}).find(s=>s.startsWith("todo."))??""}}setConfig(t){if(!t||typeof t!="object")throw new Error("Invalid configuration");if(t.entity&&!String(t.entity).startsWith("todo."))throw new Error("entity must be a to-do list (todo.*)");let i=Qt(t);this._config?.entity!==i.entity&&(this._items=void 0),this._config=i}getCardSize(){return 2+Math.min(this._items?.length??3,10)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}get _t(){return ot(this.hass?.locale?.language??this.hass?.language)}get _fmt(){let t=this._runtime();return{template:t?.format??"\u2757 Abweichung: {text}",separator:t?.separator??" / "}}_runtime(){if(!this._config)return;if(!this._config.skip)return this._config;let t=this.hass?.locale?.language??this.hass?.language;return{...this._config,skip_format:Xt(this._config.skip_format,t)}}_skipFmt(t){return t.skip&&t.skip_format?{template:t.skip_format,separator:t.separator}:null}_policy(){let t=this._runtime();return{autoComplete:t.auto_complete,onRemove:t.on_remove,annotation:{template:t.format,separator:t.separator},skip:this._skipFmt(t),multiline:t.multiline}}_drafts(){let t=this._config?.entity??"";return{get:(i,s)=>te(t,i,s)}}_rowOf(t){return{uid:t.item.uid,status:t.item.status,base:t.base,annotation:t.annotation,skip:t.skip}}_rowByUid(t){let i=this._runtime(),s=this._items?.find(r=>r.uid===t);if(!i||!s)return null;let o=it(s.description,{template:i.format,separator:i.separator},this._skipFmt(i));return{uid:t,status:s.status,...o}}connectedCallback(){super.connectedCallback(),this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribe()}updated(t){if((t.has("hass")||t.has("_config"))&&this._subscribe(),t.has("_edit")&&this._edit){let i=this.renderRoot.querySelector(".editor .field");i&&this.renderRoot.ownerDocument?.activeElement!==i&&!i.dataset.focused&&(i.dataset.focused="1",i.focus())}for(let i of this.renderRoot.querySelectorAll("input[data-pending]"))i.indeterminate=i.dataset.pending==="1"}_unsubscribe(){let t=this._unsub;this._unsub=void 0,this._subscribedTo=void 0,t?.then(i=>i()).catch(()=>{})}_subscribe(){let t=this._config?.entity;!this.hass||!t||!this.isConnected||!this.hass.states[t]||this._subscribedTo!==t&&(this._unsubscribe(),this._subscribedTo=t,this._unsub=this.hass.connection.subscribeMessage(i=>{this._items=i.items},{type:"todo/item/subscribe",entity_id:t}),this._unsub.catch(i=>{this._subscribedTo=void 0,this._error=this._t("error",{error:de(i)})}))}_supports(t){return(Number(this.hass?.states[this._config.entity]?.attributes.supported_features??0)&t)===t}async _update(t,i){this._busy=new Set(this._busy).add(t.uid),this._error=void 0;try{return await this.hass.callService("todo","update_item",{item:t.uid,...i},{entity_id:this._config.entity}),!0}catch(s){return this._error=this._t("error",{error:de(s)}),!1}finally{let s=new Set(this._busy);s.delete(t.uid),this._busy=s}}async _dispatch(t){let i=this._config;if(!i||!i.entity||this._busy.size&&t.type!=="input")return;let s=this._edit??null,o=oe(s,s?this._rowByUid(s.uid):null,t,this._policy(),this._drafts());if(o.confirmRemoveAnnotation&&(t.type==="skip"||t.type==="save")){this._confirm={uid:t.row.uid,text:o.confirmRemoveAnnotation.text,gesture:t};return}if(o.forgetDraft&&$t(i.entity,o.forgetDraft.uid,o.forgetDraft.kind),o.remember&&ee(i.entity,o.remember.uid,o.remember.kind,o.remember.text),o.updates.length===0){this._edit=o.editor??void 0,this._confirm=void 0;return}let r=this._edit;for(let d of o.updates){let a=this._items?.find(c=>c.uid===d.uid);if(!a)return;let l={};if(d.description!==void 0&&(l.description=d.description),d.status&&(l.status=d.status),!await this._update(a,l)){this._edit=r;return}}for(let d of o.updates)for(let a of d.clearDrafts)$t(i.entity,d.uid,a);this._edit=o.editor??void 0,this._confirm=void 0}_toggleExpand(t){let i=new Set(this._expanded);i.has(t)?i.delete(t):i.add(t),this._expanded=i}_onEditorKey(t,i){i.key==="Escape"?(i.preventDefault(),this._dispatch({type:"cancel"})):i.key==="Enter"&&(!this._config.multiline||i.ctrlKey||i.metaKey)&&(i.preventDefault(),this._dispatch({type:"save",row:this._rowOf(t)}))}render(){if(!this._config||!this.hass)return u;let t=this._t,i=this._runtime(),s=i.entity?this.hass.states[i.entity]:void 0,o=i.title??s?.attributes.friendly_name,r=i.annotation_label||t("annotate"),d=i.skip_label||t("skipped"),a;if(!i.entity)a=m`<div class="message">${t("no_entity")}</div>`;else if(!s)a=m`<div class="message warning">${t("not_found",{entity:i.entity})}</div>`;else if(this._items===void 0)a=m`<div class="message muted" aria-busy="true">…</div>`;else{let c=this._supports(Et.UPDATE_TODO_ITEM),p=this._supports(Et.SET_DESCRIPTION_ON_ITEM),h=le(this._items,i);a=m`
        ${p?u:m`<div class="message warning" role="note">${t("unsupported")}</div>`}
        ${h.length===0?m`<div class="message muted">${t("no_items")}</div>`:m`
              ${i.show_header?m`<div class="legend" aria-hidden="true">
                    <span class="lg"><span class="sw done"></span>${t("done")}</span>
                    <span class="lg"><span class="sw ann"></span>${i.marker?m`<span class="lg-marker">${i.marker}</span>`:u}${r}</span>
                    ${i.skip?m`<span class="lg"><span class="sw skip"></span>${d}</span>`:u}
                  </div>`:u}
              ${h.map(g=>m`
                  <section class="group" aria-label=${this._groupLabel(g.kind,g.key)}>
                    ${g.kind!=="all"?m`<h3 class="group-title">${this._groupLabel(g.kind,g.key)}</h3>`:u}
                    <ul role="list">
                      ${g.items.map(_=>this._renderItem(_,r,d,c,p))}
                    </ul>
                  </section>
                `)}
            `}
      `}let l=[i.compact?"compact":"",i.skip?"skip-on":""].filter(Boolean).join(" ");return m`
      <ha-card class=${l}>
        ${o?m`<h1 class="card-header">${o}</h1>`:u}
        ${this._error?m`<div class="message error" role="alert">${this._error}</div>`:u}
        <div class="content">${a}</div>
      </ha-card>
    `}_groupLabel(t,i){let s=this._t;if(t==="completed")return s("completed");if(t==="nodate")return s("no_date");if(t==="day"){let o=new Date(`${i}T12:00:00`);try{return new Intl.DateTimeFormat(this.hass?.locale?.language??this.hass?.language??"en",{weekday:"long",day:"numeric",month:"long"}).format(o)}catch{return i}}return""}_formatDue(t){let i=this.hass?.locale?.language??this.hass?.language??"en";try{if(/^\d{4}-\d{2}-\d{2}$/.test(t))return new Intl.DateTimeFormat(i,{weekday:"short",day:"numeric",month:"short"}).format(new Date(`${t}T12:00:00`));let s=new Date(t),o=this._config.group_by==="due_day"?{hour:"2-digit",minute:"2-digit"}:{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"};return new Intl.DateTimeFormat(i,o).format(s)}catch{return t}}_renderItem(t,i,s,o,r){let d=this._t,a=this._runtime(),l=t.item,c=l.status==="completed",p=t.annotation!==null,h=a.skip&&t.skip!==null,g=this._busy.has(l.uid),_=this._edit?.uid===l.uid,C=_&&this._edit?.kind==="annotation",v=_&&this._edit?.kind==="skip",R=this._expanded.has(l.uid),Ct=p||h,ce=(Ct||a.description==="collapsed")&&t.base.length>0,ue=t.base.length>0&&(Ct||a.description==="collapsed"?R:a.description==="always"),Rt=`d-${pe(l.uid)}`,rt=`p-${pe(l.uid)}`,he=p?$(t.annotation,this._fmt,!0):"",M=this._skipFmt(a),Y=h&&t.skip&&M&&k(M.template)?$(t.skip,M,!0):"",me=this._confirm?.uid===l.uid,Pt=m`
      <span class="summary">
        ${h?m`<span class="marker skip-mark" aria-hidden="true">⊘</span>`:u}
        ${p&&!h&&a.marker?m`<span class="marker" aria-hidden="true">${a.marker}</span>`:u}
        <span class="text">${l.summary}</span>
        ${p?m`<span class="sr-only">(${i})</span>`:u}
        ${h?m`<span class="sr-only">(${s}${Y?`: ${Y}`:""})</span>`:u}
      </span>
      ${h?m`<span class="skip-hint">${s}${Y?`: ${Y}`:""}</span>`:u}
      ${p?m`<span class="annotation">${he}</span>`:u}
      ${a.show_due&&l.due&&(a.group_by!=="due_day"||!/^\d{4}-\d{2}-\d{2}$/.test(l.due))?m`<span class="due">${this._formatDue(l.due)}</span>`:u}
    `;return m`
      <li class="item ${c?"done":""} ${p?"annotated":""} ${h?"skipped":""} ${g?"busy":""}" aria-busy=${g?"true":"false"}>
        <label class="box done" title=${d("done")}>
          <input
            type="checkbox"
            .checked=${c}
            ?disabled=${!o||g}
            aria-label=${`${d("done")}: ${l.summary}`}
            @change=${()=>{this._dispatch({type:"done",row:this._rowOf(t)})}}
          />
        </label>
        <label class="box ann" title=${C?d("unsaved"):i}>
          <input
            type="checkbox"
            data-pending=${C?"1":"0"}
            .checked=${p}
            .indeterminate=${C}
            ?disabled=${!o||!r||g}
            aria-label=${C?`${i}: ${l.summary}. ${d("unsaved")}`:`${i}: ${l.summary}`}
            aria-expanded=${C?"true":"false"}
            aria-describedby=${C?rt:u}
            @change=${()=>{this._dispatch({type:"annotate",row:this._rowOf(t)})}}
          />
          ${a.annotation_icon&&a.show_header===!1?m`<ha-icon class="ann-icon" .icon=${a.annotation_icon} aria-hidden="true"></ha-icon>`:u}
        </label>
        ${a.skip?m`<label class="box skip" title=${v?d("unsaved"):s}>
              <input
                type="checkbox"
                data-pending=${v?"1":"0"}
                .checked=${!!h}
                .indeterminate=${v}
                ?disabled=${!o||!r||g}
                aria-label=${v?`${s}: ${l.summary}. ${d("unsaved")}`:`${s}: ${l.summary}`}
                aria-expanded=${v?"true":"false"}
                aria-describedby=${v?rt:u}
                @change=${()=>{this._dispatch({type:"skip",row:this._rowOf(t)})}}
              />
            </label>`:u}
        <div class="body">
          ${ce?m`<button
                class="main"
                type="button"
                aria-expanded=${R?"true":"false"}
                aria-controls=${Rt}
                title=${d(R?"hide_details":"show_details")}
                @click=${()=>this._toggleExpand(l.uid)}
              >
                ${Pt}<span class="chev" aria-hidden="true">${R?"\u25B4":"\u25BE"}</span>
              </button>`:m`<div class="main">${Pt}</div>`}
          ${ue?m`<div class="base" id=${Rt}>${t.base}</div>`:u}
          ${p&&R&&!_&&o&&r?m`<div class="actions inline">
                <button type="button" class="link" @click=${()=>{this._dispatch({type:"annotate",row:this._rowOf(t)})}}>
                  ${d("edit",{label:i})}
                </button>
              </div>`:u}
          ${h&&R&&!_&&o&&r&&M&&k(M.template)?m`<div class="actions inline">
                <button type="button" class="link" @click=${()=>{this._dispatch({type:"edit-skip",row:this._rowOf(t)})}}>
                  ${d("edit",{label:s})}
                </button>
              </div>`:u}
          ${me?this._renderConfirm():u}
          ${_?this._renderEditor(t,v?s:i,rt):u}
        </div>
      </li>
    `}_renderConfirm(){let t=this._t,i=this._confirm?.text??"",s=this._confirm?.gesture;return m`
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
    `}_renderEditor(t,i,s){let o=this._t,r=this._runtime(),d=this._busy.has(t.item.uid),a=this._edit?.kind??"annotation",l=o(a==="skip"?"skip_placeholder":"placeholder"),c=h=>{this._dispatch({type:"input",text:h.target.value})},p=d||a==="annotation"&&!this._edit.text.trim();return m`
      <div class="editor" role="group" aria-label=${`${i}: ${t.item.summary}`}>
        <p class="pending" id=${s} role="status">${o("unsaved")}</p>
        ${r.multiline?m`<textarea
              class="field"
              rows="2"
              .value=${this._edit.text}
              placeholder=${l}
              aria-label=${i}
              ?disabled=${d}
              @input=${c}
              @keydown=${h=>this._onEditorKey(t,h)}
            ></textarea>`:m`<input
              class="field"
              type="text"
              .value=${this._edit.text}
              placeholder=${l}
              aria-label=${i}
              ?disabled=${d}
              @input=${c}
              @keydown=${h=>this._onEditorKey(t,h)}
            />`}
        <div class="actions">
          ${this._edit.isNew?u:m`<button type="button" class="btn danger" ?disabled=${d} @click=${()=>{this._dispatch({type:"remove",row:this._rowOf(t)})}}>${o("remove",{label:i})}</button>`}
          <span class="spacer"></span>
          <button type="button" class="btn" ?disabled=${d} @click=${()=>{this._dispatch({type:"cancel"})}}>${o("cancel")}</button>
          <button type="button" class="btn primary" ?disabled=${p} @click=${()=>{this._dispatch({type:"save",row:this._rowOf(t)})}}>
            ${o("save")}
          </button>
        </div>
      </div>
    `}};q.properties={hass:{attribute:!1},_config:{state:!0},_items:{state:!0},_edit:{state:!0},_expanded:{state:!0},_busy:{state:!0},_error:{state:!0},_confirm:{state:!0}},q.styles=N`
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
  `;var de=n=>n&&typeof n=="object"&&"message"in n?String(n.message):String(n),pe=n=>n.replace(/[^a-zA-Z0-9_-]/g,"_");customElements.get(J)||customElements.define(J,q);window.customCards=window.customCards||[];window.customCards.some(n=>n.type===J)||window.customCards.push({type:J,name:"Todo Annotate Card",description:"To-do list with a note checkbox and an optional skipped checkbox.",preview:!0,documentationURL:"https://github.com/LuFuhrmann/todo-annotate-card"});console.info(`%c TODO-ANNOTATE-CARD %c ${qe} `,"color:#fff;background:#03a9f4;font-weight:700","color:#03a9f4");export{qe as CARD_VERSION,q as TodoAnnotateCard,ae as dueDay};
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

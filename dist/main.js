/* 綠門GO · Apple Human Interface & Spatial Glass Redesign
   Map logic, coordinates, basemap and CMS APIs remain 100% intact. */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ───────────── Custom Redrawn Apple SF-Inspired Vector Icons ───────────── */
const icons={
 search:'<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
 arrow:'<path d="M4.5 12h15m-6-6 6 6-6 6"/>',
 arrowUpRight:'<path d="M7 17 17 7M8.5 7H17v8.5"/>',
 menu:'<path d="M4 8.5h16M4 15.5h16"/>',
 close:'<path d="M6 6l12 12M18 6 6 18"/>',
 pin:'<path d="M12 21.5s-6.5-5.6-6.5-11.2a6.5 6.5 0 1 1 13 0c0 5.6-6.5 11.2-6.5 11.2Z"/><circle cx="12" cy="10.3" r="2.4" fill="currentColor" stroke="none"/>',
 clock:'<circle cx="12" cy="12" r="8.8"/><path d="M12 7.5v4.8l3.4 2"/>',
 map:'<path d="M3.5 6.2 9 3.8l6 2.4 5.5-2.4v14L15 20.2l-6-2.4-5.5 2.4v-14Z"/><path d="M9 3.8v14M15 6.2v14"/>',
 globe:'<circle cx="12" cy="12" r="8.8"/><path d="M3.4 12h17.2M12 3.2c-2.6 2.5-4 5.6-4 8.8s1.4 6.3 4 8.8c2.6-2.5 4-5.6 4-8.8s-1.4-6.3-4-8.8Z"/>',
 check:'<path d="m4.5 12.5 4.8 4.8L19.5 7"/>',
 book:'<path d="M3.5 5.5h5.2a3.3 3.3 0 0 1 3.3 3.3 3.3 3.3 0 0 1 3.3-3.3h5.2v12.8h-5.2a3.3 3.3 0 0 0-3.3 2 3.3 3.3 0 0 0-3.3-2H3.5V5.5Zm8.5 3.3v11.5"/>',
 people:'<circle cx="8.8" cy="8.2" r="2.8"/><circle cx="16.2" cy="9" r="2.2"/><path d="M3.2 19.2c0-2.9 2.5-5.2 5.6-5.2s5.6 2.3 5.6 5.2M14.8 14.5c2.4.2 4.3 2.1 4.4 4.7"/>',
 leaf:'<path d="M19.8 4.2C11.2 3.8 5 9 4.5 17.5c7.8.8 14.5-4.4 15.3-13.3ZM4.5 17.5 3 20.5M5 17c3.6-4.2 7.5-6.8 11.8-8.2"/>',
 plus:'<path d="M12 5.2v13.6M5.2 12h13.6"/>',
 minus:'<path d="M5.2 12h13.6"/>',
 phone:'<path d="M20.8 16.4v2.6a1.9 1.9 0 0 1-2.1 1.9A18.4 18.4 0 0 1 3.1 5.3 1.9 1.9 0 0 1 5 3.2h2.6a1.9 1.9 0 0 1 1.9 1.6c.1.9.4 1.8.7 2.6a1.9 1.9 0 0 1-.4 2l-1.2 1.2a14.9 14.9 0 0 0 5.8 5.8l1.2-1.2a1.9 1.9 0 0 1 2-.4c.8.3 1.7.6 2.6.7a1.9 1.9 0 0 1 1.6 1.9Z"/>',
 eat:'<path d="M5 3.8v4.8a2.8 2.8 0 0 0 5.6 0V3.8M7.8 3.8v16.4M18.5 3.8c-2.6 1.8-3.6 4.5-3.6 8.2h3.6v8.2"/>',
 shop:'<path d="M5.2 8.5h13.6l1.1 11.5H4.1L5.2 8.5Z"/><path d="M8.5 10.5V7.2a3.5 3.5 0 0 1 7 0v3.3"/>',
 repair:'<path d="M14.8 4.2a4.8 4.8 0 0 0-5.7 5.7l-5.2 5.2a2.5 2.5 0 0 0 3.6 3.6l5.2-5.2a4.8 4.8 0 0 0 5.7-5.7l-2.8 2.8-2.6-2.6 1.8-3.8Z"/>',
 explore:'<circle cx="12" cy="12" r="8.8"/><polygon points="15.4 8.6 13.4 13.4 8.6 15.4 10.6 10.6 15.4 8.6" fill="currentColor" stroke="currentColor" stroke-width="1.2"/>',
 list:'<path d="M8.5 6.5h11.5M8.5 12h11.5M8.5 17.5h11.5"/><circle cx="4.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4.5" cy="17.5" r="1.2" fill="currentColor" stroke="none"/>',
 filters:'<path d="M4 7h4m4 0h8M4 12h9m4 0h3M4 17h3m4 0h9"/><circle cx="10" cy="7" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="17" r="2"/>',
 route:'<circle cx="6" cy="18.5" r="2.3"/><circle cx="18" cy="5.5" r="2.3"/><path d="M8.3 18.5h7.2a3.2 3.2 0 0 0 0-6.4H8.5a3.2 3.2 0 0 1 0-6.4h7.2"/>',
 spark:'<path d="M12 2.8 14.2 9l6.2 2.2-6.2 2.2L12 19.6 9.8 13.4 3.6 11.2 9.8 9 12 2.8Z"/>',
 mail:'<rect x="3" y="5.2" width="18" height="13.6" rx="2.4"/><path d="m3.6 6.8 8.4 5.8 8.4-5.8"/>'
};
const I=(n,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.arrow}</svg>`;

const zh={nav:['首頁','地圖','主題路線','人物故事','參與投稿','關於我們'],explore:'探索地圖',read:'閱讀故事',more:'查看全部故事',places:'個地點',all:'全部',search:'搜尋地點、活動、文章或關鍵字',filters:['生活入口','生態標籤','地區'],routesTitle:'主題路線',routesIntro:'從日常出發，跟著地方和人的故事慢慢走。每條路線都是一次重新認識澳門的機會。',storiesTitle:'人物／地方故事',storiesIntro:'看見人，才看見地方的力量。這些是在澳門街巷裡，默默讓城市變得更好的人。',aboutTitle:'關於綠門GO',aboutBody:'我們以澳門的地方、人物與行動為起點，透過地圖讓更多人看見日常生活中的改變力量。每一個小小的選擇，都能讓城市更綠色、更宜居。'};
const en={nav:['Home','Map','Routes','Stories','Contribute','About'],explore:'Explore the map',read:'Read the story',more:'All stories',places:'places',all:'All',search:'Search places, activities, stories or keywords',filters:['Everyday entry','Ecology tags','Area'],routesTitle:'Routes',routesIntro:'Follow local places and people at a slower pace. Every route is a chance to meet Macau again.',storiesTitle:'People & place stories',storiesIntro:'See the people and you begin to see the power of place — the neighbours quietly making Macau better.',aboutTitle:'About Green GO',aboutBody:'We begin with Macau’s places, people and local action. This map helps more people notice the quiet changes already happening in everyday life. Every thoughtful choice can make the city greener and more liveable.'};
const fallbackSite={heroTitleZh:'從一個地方，\n遇見更好的日常。',heroTitleEn:'Begin with a place.\nMeet a better everyday life.',heroBodyZh:'帶入永續旅遊、融入生活、在地探索，走進更綠色、更關懷與更有韌性的日常。',heroBodyEn:'Travel slowly, live locally and discover a greener, kinder and more resilient Macau.',heroImage:'assets/flat-waterfront.webp',heroArticleId:'story-afa',searchPlaceholderZh:'搜尋地點、活動、文章或關鍵字',searchPlaceholderEn:'Search places, activities, stories or keywords',hotSearchesZh:['修補日常','澳門滋味','親近自然'],hotSearchesEn:['Repair culture','Local flavours','Urban nature'],catsTitleZh:'六種方式，走進綠色澳門',catsTitleEn:'Six ways into a greener Macau',catsBodyZh:'從吃一頓飯、修一雙鞋開始。選一個入口，地圖會帶你找到附近的好地方。',catsBodyEn:'Start with a meal or a mended shoe. Pick an entry point and the map will lead you to good places nearby.',categories:[],routesTitleZh:'跟著路線，慢慢走',routesTitleEn:'Slow routes through the city',routesBodyZh:'從日常出發，跟著地方和人的故事慢慢走。每條路線都是一次重新認識澳門的機會。',routesBodyEn:'Follow local places and people at a slower pace. Every route is a chance to meet Macau again.',featureTitleZh:'阿發修鞋店',featureTitleEn:'A Fa Shoe Repair',featureImage:'assets/flat-afa.webp',featureArticleId:'story-afa',aboutTitleZh:'關於綠門GO',aboutTitleEn:'About Green GO',aboutBodyZh:'我們以澳門的地方、人物與行動為起點，透過地圖讓更多人看見日常生活中的改變力量。每一個小小的選擇，都能讓城市更綠色、更宜居。',aboutBodyEn:'We begin with Macau’s places, people and local action. This map helps more people notice the quiet changes already happening in everyday life. Every thoughtful choice can make the city greener and more liveable.',aboutImage:'assets/flat-waterfront.webp',contactEmail:'G-GW@GREEN-GATEWAY.ORG',contactWebsite:'https://green-gateway.org',contactPhone:'+853 2859 1162',contactFax:'+853 2893 1085',contactAddressZh:'澳門崗頂前地4號',contactAddressEn:'Largo de Santo Agostinho 4 — Macau S.A.R',footerTaglineZh:'從澳門的地方與人物出發，探索更綠色的日常。',footerTaglineEn:'Start from Macau’s places and people, and discover a greener everyday life.',footerNoteZh:'一座城，很多種綠色生活。',footerNoteEn:'One city, many ways to live green.'};
const state={page:'home',id:'',lang:localStorage.getItem('gg-lang')==='en'?'en':'zh',places:[],articles:[],routes:[],site:fallbackSite,config:{},cat:'全部',area:'全部',query:'',view:'map',menu:false,mapFiltersOpen:false,step:1,booted:false,contribution:{type:'',name:'',area:'',address:'',tags:[],description:'',contact:'',image:'',uploadGrant:''}};
const app=$('#app');let map,markerLayer;const placeMarkers=new Map();let selectedPlaceId='';
const T=()=>state.lang==='en'?en:zh;
const tx=(zhText,enText)=>state.lang==='en'?enText:zhText;
const loc=(item,key,englishKey=`${key}_en`)=>state.lang==='en'?(item?.[englishKey]||item?.[key]||''):(item?.[key]||'');
const S=key=>state.site[`${key}${state.lang==='en'?'En':'Zh'}`]||state.site[`${key}Zh`]||'';
const imagePath=v=>v||'assets/flat-waterfront.webp';
const navKeys=['home','map','routes','stories','contribute','about'];
const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pad2=n=>String(n).padStart(2,'0');

/* Apple HIG System Palette for Categories */
const mapCategories={
 '食':{en:'Eat',color:'#FF9500',icon:'eat'},
 '買':{en:'Shop',color:'#FFCC00',icon:'shop'},
 '修':{en:'Repair',color:'#007AFF',icon:'repair'},
 '去':{en:'Explore',color:'#28CD41',icon:'explore'},
 '學':{en:'Learn',color:'#AF52DE',icon:'book'},
 '參與':{en:'Join',color:'#FF2D55',icon:'people'}
};
const mapLabel=value=>state.lang==='en'?(mapCategories[value]?.en||{'食物':'Food','減廢':'Waste reduction','水':'Water','自然與生物多樣性':'Biodiversity','社區':'Community','文化':'Culture','青年':'Youth','澳門半島':'Macau Peninsula','氹仔':'Taipa','路環':'Coloane'}[value]||value):value;
const defaultCategories=[{key:'食',titleZh:'食',titleEn:'Eat',subtitleZh:'品味在地風味',subtitleEn:'Taste local flavours',image:'assets/flat-cafe.webp'},{key:'買',titleZh:'買',titleEn:'Shop',subtitleZh:'發掘特色好物',subtitleEn:'Choose thoughtful goods',image:'assets/flat-shop.webp'},{key:'修',titleZh:'修',titleEn:'Repair',subtitleZh:'延續物件的生命',subtitleEn:'Give objects another life',image:'assets/flat-afa.webp'},{key:'去',titleZh:'去',titleEn:'Explore',subtitleZh:'探索澳門之美',subtitleEn:'Discover another Macau',image:'assets/flat-waterfront.webp'},{key:'學',titleZh:'學',titleEn:'Learn',subtitleZh:'從自然與社區學習',subtitleEn:'Learn from place and nature',image:'assets/flat-learn.webp'},{key:'參與',titleZh:'參與',titleEn:'Join',subtitleZh:'一起創造改變',subtitleEn:'Take part in local change',image:'assets/flat-youth.webp'}];

/* ───────────── Shell ───────────── */
function logo(){return `<a class="brand" href="#home" aria-label="綠門GO"><img src="assets/grg-logo.png" alt=""><span><strong>綠門GO</strong></span></a>`}
function header(){
 return `<header class="site-header"><div class="header-inner">${logo()}
 <nav id="primary-nav" class="main-nav ${state.menu?'open':''}" aria-label="${tx('主要導覽','Main navigation')}">
  ${navKeys.map((k,i)=>`<a href="#${k}" style="--i:${i}" class="${state.page===k?'active':''}" ${state.page===k?'aria-current="page"':''}><span class="nav-index">${pad2(i+1)}</span><span class="nav-label">${T().nav[i]}</span></a>`).join('')}
  <div class="nav-footer"><span>${tx('澳門生態地圖','A green map of Macau')}</span><span>© 綠門GO</span></div>
 </nav>
 <div class="header-tools">
  <button class="icon-button" data-action="search" aria-label="${tx('搜尋地圖','Search the map')}">${I('search',18)}</button>
  <button class="language" data-action="language" aria-label="${tx('Switch to English','切換至繁體中文')}"><span class="${state.lang==='zh'?'on':''}">繁</span><span class="${state.lang==='en'?'on':''}">EN</span></button>
  <a class="header-cta" href="#map">${I('map',16)}<span>${T().explore}</span></a>
  <button class="menu-button" data-action="menu" aria-label="${tx('開啟或關閉選單','Toggle navigation')}" aria-controls="primary-nav" aria-expanded="${state.menu}"><span></span><span></span></button>
 </div></div></header>`;
}
function footer(){
 return `<footer class="site-footer"><div class="container footer-grid">
  <div class="footer-brand">${logo()}<p>${esc(S('footerTagline'))}</p><a class="pill-link" href="#contribute">${tx('推薦一個好地方','Recommend a place')} ${I('arrowUpRight',16)}</a></div>
  <nav class="footer-col" aria-label="${tx('網站導覽','Site')}"><h3>${tx('探索','Explore')}</h3>${navKeys.slice(1,4).map((k,i)=>`<a href="#${k}">${T().nav[i+1]}</a>`).join('')}</nav>
  <nav class="footer-col" aria-label="${tx('參與','Get involved')}"><h3>${tx('參與','Get involved')}</h3>${navKeys.slice(4).map((k,i)=>`<a href="#${k}">${T().nav[i+4]}</a>`).join('')}<a href="${esc(state.site.contactWebsite||'https://green-gateway.org')}" target="_blank" rel="noopener noreferrer">${esc((state.site.contactWebsite||'GREEN-GATEWAY.ORG').replace(/^https?:\/\//i,'').toUpperCase())}</a></nav>
  <div class="footer-col"><h3>${tx('聯絡','Contact')}</h3><a href="mailto:${esc(state.site.contactEmail||'G-GW@GREEN-GATEWAY.ORG')}">${esc(state.site.contactEmail||'G-GW@GREEN-GATEWAY.ORG')}</a><a href="tel:${esc((state.site.contactPhone||'+85328591162').replace(/[^+0-9]/g,''))}">${esc(state.site.contactPhone||'+853 2859 1162')}</a><span>${esc(S('contactAddress'))}</span></div>
 </div>
 <div class="container footer-bottom"><small>Copyright © ${new Date().getFullYear()} 綠門GO Macau. All rights reserved.</small><small>${esc(S('footerNote'))}</small></div></footer>`;
}
function sectionHead(title,{intro='',href='',linkLabel='',light=false}={}){
 return `<div class="section-head ${light?'light':''}" data-reveal><div><h2>${title}</h2>${intro?`<p>${intro}</p>`:''}</div>${href?`<a class="pill-link ${light?'light':''}" href="${href}">${linkLabel} ${I('arrow',16)}</a>`:''}</div>`;
}
function layout(body,{showFooter=true,pageClass=''}={}){
 const oldStep=$('#contribution-form')?.dataset.step;
 document.body.dataset.page=state.page;
 app.innerHTML=`<div class="progress" aria-hidden="true"></div>${header()}${body}${showFooter?footer():''}<button class="back-to-top" data-action="back-to-top" aria-label="${tx('回到頂部','Back to top')}" title="${tx('回到頂部','Back to top')}">${I('arrow',20)}</button>`;
 onScroll();setupPageMotion();
 const form=$('#contribution-form');
 if(oldStep&&form&&oldStep!==form.dataset.step&&!reducedMotion())$('.form-stage',form)?.animate([{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'none'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
}

/* ───────────── Motion ───────────── */
let revealObserver,countObserver;
function setupPageMotion(){
 revealObserver?.disconnect();countObserver?.disconnect();
 const items=$$('[data-reveal]');
 if(reducedMotion()||!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('is-in'));$$('[data-count]').forEach(el=>el.textContent=el.dataset.count);return}
 revealObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-in');revealObserver.unobserve(entry.target)}},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 items.forEach(el=>revealObserver.observe(el));
 countObserver=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){countUp(entry.target);countObserver.unobserve(entry.target)}},{threshold:.4});
 $$('[data-count]').forEach(el=>countObserver.observe(el));
}
function countUp(el){
 const target=Number(el.dataset.count)||0,start=performance.now(),dur=1400;
 const tick=now=>{const t=Math.min(1,(now-start)/dur),eased=1-Math.pow(1-t,4);el.textContent=Math.round(target*eased);if(t<1)requestAnimationFrame(tick)};
 requestAnimationFrame(tick);
}
let ticking=false;
function onScroll(){
 const y=window.scrollY;
 $('.site-header')?.classList.toggle('is-scrolled',y>8);
 $('.back-to-top')?.classList.toggle('is-visible',y>500);
 const bar=$('.progress');
 if(bar){const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${state.page==='article'&&max>0?Math.min(1,y/max):0})`}
 if(reducedMotion())return;
 for(const el of $$('[data-parallax]')){
  const r=el.parentElement.getBoundingClientRect();
  if(r.bottom<0||r.top>innerHeight)continue;
  const offset=(r.top+r.height/2-innerHeight/2)*Number(el.dataset.parallax);
  el.style.transform=`translate3d(0,${offset.toFixed(1)}px,0)`;
 }
}
window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{onScroll();ticking=false})}},{passive:true});

/* ───────────── Home ───────────── */
function articleFor(id){return state.articles.find(a=>a.id===id)}
function goArticle(id){return `#article/${encodeURIComponent(id||'')}`}
function categoryCounts(){const c={};for(const p of state.places)c[p.cat]=(c[p.cat]||0)+1;return c}
function splitLines(text){return esc(text).split(/\n/).map((line,i)=>`<span class="line"><span style="--i:${i}">${line}</span></span>`).join('')}
function home(){
 const categories=state.site.categories?.length?state.site.categories:defaultCategories;
 const counts=categoryCounts();
 const hot=state.site[state.lang==='en'?'hotSearchesEn':'hotSearchesZh']||[];
 const featured=articleFor(state.site.featureArticleId);
 const routes=[...state.routes].sort((a,b)=>(b.img?1:0)-(a.img?1:0)).slice(0,3);
 const heroHref=articleFor(state.site.heroArticleId)?goArticle(state.site.heroArticleId):'#map';
 const pinned=state.places.filter(hasCoordinates).length;
 const tickerWords=Object.keys(mapCategories).flatMap(k=>{const c=categories.find(x=>x.key===k);return [[k,c?(state.lang==='en'?c.subtitleEn:c.subtitleZh):'']]});
 layout(`<main class="home-page">
 <section class="hero">
  <div class="container hero-grid">
   <div class="hero-copy">
    <h1 class="hero-title">${splitLines(S('heroTitle'))}</h1>
    <p class="hero-body">${esc(S('heroBody'))}</p>
    <form class="search-field hero-search" data-search-form role="search">
     <span class="search-icon">${I('search',20)}</span>
     <input name="q" aria-label="${T().search}" placeholder="${esc(state.site[state.lang==='en'?'searchPlaceholderEn':'searchPlaceholderZh']||T().search)}" autocomplete="off">
     <button class="search-submit"><span>${tx('搜尋','Search')}</span>${I('arrow',18)}</button>
    </form>
    <div class="hot"><span>${tx('熱門搜尋','Popular')}</span>${hot.map(x=>`<button type="button" data-quick="${esc(x)}">${esc(x)}</button>`).join('')}</div>
   </div>
   <div class="hero-visual">
    <a class="hero-frame" href="${heroHref}" aria-label="${tx('探索澳門','Explore Macau')}"><img data-parallax="-0.04" src="${esc(imagePath(state.site.heroImage))}" alt="" fetchpriority="high"><span class="hero-frame-label">${tx('探索澳門','Explore Macau')} ${I('arrowUpRight',15)}</span></a>
    <div class="hero-bento">
     <a class="hero-bento-stat" href="#map">
      <strong class="stat-num" data-count="${state.places.length}">0</strong>
      <div><span>${tx('個綠色好地方','Green Places')}</span><small>${tx(`${pinned} 個已在地圖定位`,`${pinned} pinned on map`)}</small></div>
     </a>
     <a class="hero-bento-story" href="${featured?goArticle(featured.id):'#stories'}">
      <img src="${esc(imagePath(state.site.featureImage))}" alt="">
      <div><small>${tx('精選故事','Featured Story')}</small><strong>${esc(S('featureTitle'))}</strong></div>
      <i>${I('arrowUpRight',15)}</i>
     </a>
    </div>
   </div>
  </div>
 </section>
 <section class="ticker" aria-hidden="true"><div class="ticker-track">${[0,1].map(()=>`<div class="ticker-group">${tickerWords.map(([k,sub])=>`<span class="ticker-item" style="--c:${mapPinArtwork[k][0]}"><i>${categoryArtwork(k,22)}</i><b>${esc(state.lang==='en'?mapCategories[k].en:k)}</b><em>${esc(sub)}</em></span>`).join('')}</div>`).join('')}</div></section>
 <section class="home-section cats" aria-labelledby="category-title">
  <div class="container">
   ${sectionHead(`<span id="category-title">${esc(S('catsTitle'))}</span>`,{intro:esc(S('catsBody')),href:'#map',linkLabel:T().explore})}
   <div class="cat-rail">${categories.map((c,i)=>`<a href="#map?cat=${encodeURIComponent(c.key)}" class="cat-card" data-reveal style="--i:${i};--c:${mapCategories[c.key]?.color||'#28CD41'};--c2:${mapPinArtwork[c.key]?.[0]||'#28CD41'}">
     <img src="${esc(imagePath(c.image))}" alt="" loading="lazy">
     <span class="cat-shade"></span>
     <span class="cat-top"><span class="cat-icon">${categoryArtwork(c.key,22)}</span><span class="cat-count">${counts[c.key]||0} ${T().places}</span></span>
     <span class="cat-body"><strong>${esc(state.lang==='en'?c.titleEn:c.titleZh)}</strong>${state.lang==='en'?'':`<small>${esc(c.titleEn||mapCategories[c.key]?.en||'')}</small>`}<em>${esc(state.lang==='en'?c.subtitleEn:c.subtitleZh)}</em></span>
     <span class="cat-go">${I('arrowUpRight',18)}</span>
    </a>`).join('')}</div>
  </div>
 </section>
 ${routes.length?`<section class="home-section routes-teaser"><div class="container">
  ${sectionHead(esc(S('routesTitle')),{intro:esc(S('routesBody')),href:'#routes',linkLabel:tx('全部路線','All routes')})}
  <div class="route-row">${routes.map((r,i)=>routeCard(r,i)).join('')}</div>
 </div></section>`:''}
 </main>`);
}
const macauLandPaths=[
 "M187.0,63.5 L196.5,95.9 L201.0,100.3 L201.7,112.4 L252.9,97.4 L252.0,94.1 L261.0,91.5 L304.1,130.8 L312.3,132.8 L315.7,138.6 L316.1,152.6 L321.5,155.2 L317.5,130.1 L333.6,122.3 L337.4,123.6 L342.0,118.7 L350.4,115.4 L353.9,117.3 L361.1,143.8 L364.7,146.0 L372.3,144.9 L362.9,113.7 L360.0,76.2 L364.2,64.1 L302.0,39.3 L299.5,40.7 L294.3,38.6 L294.8,32.5 L275.3,35.7 L255.4,33.1 L249.6,37.3 L239.4,57.4 L234.5,58.7 L217.7,54.8 L198.3,55.5 L187.0,63.5 Z",
 "M193.8,165.4 L204.2,167.8 L205.1,164.8 L209.4,168.8 L210.8,162.7 L213.8,162.6 L233.8,175.8 L246.6,166.9 L251.1,167.6 L250.2,156.2 L291.9,119.8 L261.0,91.5 L252.0,94.1 L252.9,97.4 L201.7,112.4 L202.5,129.0 L193.8,165.4 Z",
 "M250.2,156.2 L251.1,167.6 L258.1,172.7 L280.2,171.5 L295.4,175.5 L298.8,166.0 L304.9,163.7 L316.1,152.6 L315.7,138.6 L312.3,132.8 L305.7,131.9 L291.9,119.8 L250.2,156.2 Z",
 "M157.6,255.6 L163.8,261.0 L166.7,259.8 L177.9,265.9 L187.4,265.3 L190.1,259.4 L190.1,251.7 L198.1,247.1 L201.4,238.9 L212.2,235.7 L218.7,212.2 L234.8,194.8 L207.3,165.4 L205.1,164.8 L204.2,167.8 L193.8,165.4 L190.2,180.2 L163.6,219.3 L169.5,223.3 L163.3,232.2 L158.4,245.7 L157.6,255.6 Z",
 "M157.2,261.0 L164.8,294.8 L180.3,319.0 L373.8,285.0 L372.3,144.9 L364.7,146.0 L361.1,143.8 L353.9,117.3 L350.9,115.4 L342.0,118.7 L337.4,123.6 L333.6,122.3 L317.5,130.1 L321.5,155.2 L316.1,152.6 L304.9,163.7 L298.8,166.0 L295.4,175.5 L280.2,171.5 L258.1,172.7 L248.8,166.0 L233.8,175.8 L216.3,163.5 L210.8,162.7 L209.4,168.8 L234.8,194.8 L218.7,212.2 L212.2,235.7 L201.4,238.9 L198.1,247.1 L190.1,251.7 L190.1,259.4 L187.4,265.3 L177.9,265.9 L166.7,259.8 L163.8,261.0 L157.6,255.6 L157.2,261.0 Z",
 "M222.0,368.4 L228.1,401.1 L239.5,437.3 L265.1,458.4 L282.9,480.8 L285.3,478.3 L275.6,465.8 L277.8,464.0 L290.0,464.0 L290.1,484.1 L284.8,483.2 L299.9,505.7 L308.8,501.0 L305.7,499.1 L303.0,484.6 L295.8,470.4 L295.6,455.7 L336.2,471.2 L349.7,471.4 L370.7,465.6 L374.1,468.6 L377.1,467.2 L388.4,470.2 L400.8,467.5 L405.9,470.5 L420.0,462.9 L416.3,456.9 L444.7,443.6 L451.9,436.1 L529.7,488.0 L530.2,495.9 L535.2,500.6 L559.6,572.9 L565.9,576.4 L581.5,570.1 L582.4,563.6 L516.6,371.4 L510.4,368.7 L503.2,371.2 L500.2,376.5 L502.2,383.5 L465.0,396.3 L464.0,394.7 L464.1,392.7 L493.4,382.3 L488.6,367.5 L481.5,369.4 L479.3,367.4 L470.0,338.3 L476.2,358.6 L472.4,373.7 L468.5,378.6 L470.5,385.5 L463.2,388.3 L464.7,375.7 L461.4,377.5 L456.4,376.2 L462.0,359.8 L461.2,356.4 L453.8,354.5 L451.6,357.0 L448.7,374.7 L438.2,372.0 L439.8,366.0 L438.0,365.5 L436.4,371.5 L432.2,370.4 L433.1,360.4 L446.3,338.4 L445.5,335.2 L438.3,331.2 L444.0,335.4 L441.2,340.2 L436.3,338.0 L440.8,340.6 L438.0,344.9 L427.0,342.4 L422.6,358.1 L405.2,345.6 L378.2,336.0 L377.0,353.9 L379.7,357.1 L389.7,359.9 L385.8,374.3 L373.8,370.8 L353.4,371.2 L334.9,366.7 L331.1,363.2 L324.7,369.2 L300.4,367.4 L285.1,373.4 L281.2,371.5 L279.4,374.7 L248.2,378.9 L240.8,383.0 L233.5,379.7 L226.9,365.1 L222.0,368.4 Z",
 "M230.0,567.0 L233.6,641.7 L235.7,645.3 L263.4,664.4 L268.8,664.2 L274.0,562.8 L230.0,567.0 Z",
 "M254.5,530.7 L254.8,536.1 L260.9,535.8 L261.1,552.3 L266.0,553.2 L267.6,545.0 L267.1,548.8 L261.5,548.8 L261.1,542.1 L264.0,541.3 L262.7,515.3 L268.2,515.7 L269.9,521.6 L269.0,515.3 L259.4,515.1 L260.6,530.4 L254.5,530.7 Z",
 "M294.7,463.6 L303.0,484.6 L305.7,499.1 L308.8,501.0 L299.9,505.7 L300.8,602.7 L298.5,613.9 L343.7,601.9 L347.8,593.7 L367.1,594.4 L369.9,568.5 L399.0,567.8 L409.5,562.1 L420.9,550.5 L437.8,551.5 L447.2,548.9 L450.0,551.4 L453.4,549.4 L450.8,545.1 L458.0,528.4 L457.0,522.4 L464.4,527.8 L470.6,527.1 L486.3,516.2 L502.2,512.9 L507.8,520.7 L525.8,508.2 L519.5,497.5 L518.1,487.2 L456.0,445.6 L448.4,443.8 L446.0,445.8 L451.9,436.1 L444.7,443.6 L416.3,456.9 L420.0,462.9 L405.9,470.5 L400.8,467.5 L388.4,470.2 L377.1,467.2 L374.1,468.6 L370.7,465.6 L349.7,471.4 L336.2,471.2 L323.0,467.6 L297.2,455.4 L294.7,463.6 Z",
 "M284.5,709.2 L293.0,721.4 L311.0,729.5 L313.2,733.3 L320.1,734.9 L329.1,735.2 L333.3,730.2 L331.9,728.3 L342.4,723.3 L347.1,714.4 L356.3,710.9 L358.7,712.6 L359.3,719.7 L364.3,723.7 L373.6,719.1 L379.6,720.8 L382.8,718.0 L387.8,719.1 L383.2,720.6 L395.0,720.6 L396.6,718.9 L407.8,722.5 L416.2,721.4 L429.4,715.4 L436.7,708.3 L434.9,707.0 L436.1,697.8 L431.6,692.4 L415.9,693.7 L416.7,691.7 L412.6,691.7 L411.1,682.6 L418.7,657.7 L433.0,639.7 L443.8,633.5 L458.1,644.2 L473.4,646.1 L491.5,635.7 L496.7,624.6 L506.6,616.2 L513.0,618.5 L520.8,617.3 L521.5,621.4 L526.3,622.4 L531.7,621.2 L536.0,615.3 L534.4,613.7 L542.2,608.8 L546.9,609.2 L548.1,604.2 L544.9,603.7 L547.4,594.8 L543.8,594.6 L535.8,577.6 L536.2,572.2 L528.7,566.8 L520.1,578.6 L517.3,576.4 L519.8,572.4 L510.3,566.6 L505.5,573.2 L497.0,567.2 L490.8,570.1 L488.5,558.5 L484.0,568.2 L478.9,568.4 L474.4,564.8 L475.1,552.1 L472.1,547.0 L488.5,530.6 L491.7,522.6 L494.7,521.5 L494.3,516.9 L486.8,518.0 L463.4,533.9 L461.3,538.2 L454.1,543.2 L456.3,547.6 L450.0,551.4 L447.2,548.9 L437.8,551.5 L422.3,550.1 L409.5,562.1 L399.0,567.8 L369.9,568.5 L367.1,594.4 L347.8,593.7 L343.7,601.9 L298.5,613.9 L300.3,657.7 L290.0,663.6 L288.6,674.0 L285.5,674.8 L289.5,677.2 L290.2,675.4 L293.8,682.2 L288.1,684.1 L295.2,681.9 L295.5,684.6 L290.0,704.2 L284.5,709.2 Z"
];
function atlasSection(counts){
 const pts=state.places.filter(hasCoordinates);
 if(!pts.length)return '';
 const W=640,H=760,lat0=22.222,lat1=22.106,lng0=113.505,lng1=113.605;
 const kx=Math.cos(22.17*Math.PI/180);
 const scale=Math.min(W/((lng1-lng0)*kx),H/(lat0-lat1));
 const ox=(W-(lng1-lng0)*kx*scale)/2;
 const px=p=>ox+(p.lng-lng0)*kx*scale,py=p=>(lat0-p.lat)*scale;
 const grid=[];for(let x=40;x<W;x+=60)grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}"/>`);for(let y=40;y<H;y+=60)grid.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}"/>`);
 const areas=[['澳門半島',22.198,113.568],['氹仔',22.156,113.582],['路環',22.122,113.588]];
 const bridges=[
  [px({lng:113.5365}),py({lat:22.1820}),px({lng:113.5415}),py({lat:22.1655})],
  [px({lng:113.5465}),py({lat:22.1865}),px({lng:113.5505}),py({lat:22.1680})],
  [px({lng:113.5620}),py({lat:22.2015}),px({lng:113.5645}),py({lat:22.1670})]
 ];
 const dots=pts.map((p,i)=>`<a href="#map?place=${encodeURIComponent(p.id)}" class="atlas-dot" style="--c:${mapPinArtwork[p.cat]?.[0]||'#28CD41'};--d:${(i%40)*22}ms"><circle cx="${px(p).toFixed(1)}" cy="${py(p).toFixed(1)}" r="4.8"/><title>${esc(loc(p,'name','en'))}</title></a>`).join('');
 return `<section class="home-section atlas" aria-labelledby="atlas-title"><div class="container"><div class="atlas-card"><div class="atlas-grid">
  <div class="atlas-copy" data-reveal>
   <span class="section-index">02 · MACAU ATLAS</span>
   <h2 id="atlas-title">${tx('一張地圖，','One map,')}<br><em><span data-count="${state.places.length}">0</span> ${tx('個綠色好地方','green places')}</em></h2>
   <p>${tx('從澳門半島的老街到路環的海岸，每一個光點都是一間店、一位師傅、一片自然。點一下任意光點，直接在互動地圖中探索。','From old streets on the peninsula to the shores of Coloane, every node is a shop, a craftsperson or a patch of nature. Tap any point to explore.')}</p>
   <ul class="atlas-legend">${Object.entries(mapCategories).map(([k])=>`<li><a href="#map?cat=${encodeURIComponent(k)}" style="--c:${mapPinArtwork[k][0]}"><i class="legend-badge">${categoryArtwork(k,16)}</i><span>${esc(mapLabel(k))}</span><b>${counts[k]||0}</b></a></li>`).join('')}</ul>
   <a class="button" href="#map">${T().explore} ${I('arrow',18)}</a>
  </div>
  <div class="atlas-plate" data-reveal style="--i:1">
   <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${tx('澳門綠色地點分佈','Distribution of green places in Macau')}">
    <g class="atlas-grid-lines">${grid.join('')}</g>
    <g class="atlas-bridges">${bridges.map(([x1,y1,x2,y2])=>`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`).join('')}</g>
    <g class="atlas-land">${macauLandPaths.map(d=>`<path d="${d}"/>`).join('')}</g>
    ${areas.map(([n,la,ln])=>`<text class="atlas-area" x="${px({lng:ln}).toFixed(0)}" y="${py({lat:la}).toFixed(0)}">${esc(mapLabel(n))}</text>`).join('')}
    <g class="atlas-dots">${dots}</g>
    <g class="atlas-north" transform="translate(${W-54} 54)"><circle r="20"/><path d="M0 -11 L5 5 L0 1.5 L-5 5 Z"/><text y="34">N</text></g>
   </svg>
   <span class="atlas-coords"><i class="live-dot"></i> MACAU S.A.R. · 22.1987° N, 113.5439° E</span>
  </div>
 </div></div></div></section>`;
}
function ctaBand(){
 return `<section class="cta"><div class="container"><div class="cta-card" data-reveal>
  <div class="cta-glow" aria-hidden="true"></div>
  <div class="cta-copy"><p class="eyebrow"><span class="live-dot"></span>${tx('參與投稿 · CONTRIBUTE','CONTRIBUTE')}</p><h2>${tx('你心中，也有一個<br>澳門的好地方嗎？','Know a place in Macau<br>that deserves to be found?')}</h2><p>${tx('把你珍惜的店、地方、人物或行動分享出來。五個簡單步驟，讓更多人看見它。','Share a shop, place, person or action you care about. Five short steps, and more people can find it.')}</p></div>
  <a class="button" href="#contribute">${tx('推薦一個地方','Recommend a place')} ${I('arrow',18)}</a>
  <img class="cta-art" src="assets/flat-youth.webp" alt="" loading="lazy">
 </div></div></section>`;
}
function articleTone(a){return mapCategories[state.places.find(p=>p.id===a.place_id)?.cat]?.color||'#28CD41'}
function storyCard(a,i){
 return `<a class="story-card ${i===0?'is-lead':''}" data-reveal style="--i:${i};--story-color:${articleTone(a)}" href="${goArticle(a.id)}">
  <span class="story-media"><img src="${esc(imagePath(a.img))}" alt="" loading="lazy"></span>
  <span class="story-body"><small class="tag">${esc(loc(a,'category'))}</small><strong>${esc(loc(a,'title'))}</strong>${loc(a,'subtitle')&&loc(a,'subtitle')!==loc(a,'title')?`<em>${esc(loc(a,'subtitle'))}</em>`:''}<span class="text-link">${T().read} ${I('arrow',16)}</span></span>
 </a>`;
}
function routeCard(r,i){
 const first=state.places.find(p=>p.id===r.ids?.[0]);
 const img=r.img||state.places.find(p=>r.ids?.includes(p.id)&&p.img)?.img;
 return `<a class="route-card" data-reveal style="--i:${i};--story-color:${mapCategories[first?.cat]?.color||'#28CD41'}" href="#route/${encodeURIComponent(r.id)}">
  <span class="route-media"><img src="${esc(imagePath(img))}" alt="" loading="lazy"><span class="route-num">${pad2(i+1)}</span></span>
  <span class="route-body"><small class="tag">${esc(loc(r,'cat','cat_en'))}</small><strong>${esc(loc(r,'n','n_en'))}</strong><em>${esc(loc(r,'text','text_en'))}</em>
  <span class="route-meta"><span>${I('pin',15)} ${r.ids?.length||0} ${T().places}</span>${r.time?`<span>${I('clock',15)} ${esc(loc(r,'time','time_en'))}</span>`:''}<i>${I('arrow',16)}</i></span></span>
 </a>`;
}

/* ───────────── Map ───────────── */
const hasCoordinates=p=>Number.isFinite(p?.lat)&&Number.isFinite(p?.lng);
function filteredPlaces(){const q=state.query.toLowerCase();return state.places.filter(p=>(state.cat==='全部'||p.cat===state.cat)&&(state.area==='全部'||p.area===state.area)&&(!q||[p.name,p.en,p.address,p.desc,...(p.tags||[])].join(' ').toLowerCase().includes(q)))}
function chip(kind,value,label=value){const cat=kind==='cat'?mapCategories[value]:null;return `<button class="filter-chip ${cat?'category-chip':''} ${state[kind]===value?'active':''}" data-filter="${kind}" data-value="${esc(value)}" aria-pressed="${state[kind]===value}" ${cat?`style="--pin-color:${mapPinArtwork[value][0]}"`:''}>${cat?`<span class="category-artwork">${categoryArtwork(value,16)}</span>`:''}${esc(label)}</button>`}
function mapFilters(list){
 const missing=list.filter(p=>!hasCoordinates(p)).length,cats=['全部',...Object.keys(mapCategories)],areas=['全部','澳門半島','氹仔','路環'];
 const active=(state.cat!=='全部')+(state.area!=='全部')+(!!state.query);
 return `<div class="map-panel-head"><h1>${tx('探索地圖','Explore')}</h1><div class="view-tabs" role="group" aria-label="${tx('顯示方式','View')}"><button class="${state.view==='map'?'active':''}" data-view="map" aria-pressed="${state.view==='map'}">${I('map',16)} ${T().nav[1]}</button><button class="${state.view==='list'?'active':''}" data-view="list" aria-pressed="${state.view==='list'}">${I('list',16)} ${tx('列表','List')}</button></div></div>
 <form class="search-field map-search" data-map-search role="search"><span class="search-icon">${I('search',17)}</span><input name="q" value="${esc(state.query)}" aria-label="${T().search}" placeholder="${T().search}" autocomplete="off"><button aria-label="${tx('搜尋','Search')}">${I('arrow',16)}</button></form>
 <button class="map-filter-toggle" data-action="toggle-map-filters" aria-controls="map-filter-options" aria-expanded="${state.mapFiltersOpen}"><span>${tx('篩選條件','Filters')}${active?` <b>${active}</b>`:''}</span>${I(state.mapFiltersOpen?'close':'filters',18)}</button>
 <div id="map-filter-options" class="map-filter-options ${state.mapFiltersOpen?'is-open':''}">${[[cats,'cat',T().filters[0]],[areas,'area',T().filters[2]]].map(([a,k,title])=>`<div class="filter-group"><h3>${title}</h3><div>${a.map(v=>chip(k,v,v==='全部'?T().all:mapLabel(v))).join('')}</div></div>`).join('')}</div>
 <div class="map-result-summary"><p class="result-count" role="status" aria-live="polite"><b>${list.length}</b> ${T().places}${state.view==='map'&&missing?` <span>· ${tx(`${missing} 筆待定位`,`${missing} without pins`)}</span>`:''}</p>${active?`<button class="map-reset" data-action="reset-map">${tx('清除篩選','Clear')}</button>`:''}</div>`;
}
function mapLegend(){return `<div class="map-legend" aria-label="${tx('標點顏色分類','Map categories')}">${Object.entries(mapCategories).map(([key])=>`<span style="--category-color:${mapPinArtwork[key][0]}"><i class="category-icon">${categoryArtwork(key,15)}</i>${esc(mapLabel(key))}</span>`).join('')}</div>`}
function disposeMap(){if(map){map.remove();map=null}markerLayer=null;placeMarkers.clear()}
function mapSheetContent(list){
 const empty=tx('暫時沒有符合的地點。','No matching places.');
 return `${mapFilters(list)}<div class="map-sheet-results">${list.map(placeCard).join('')||`<p class="map-list-empty">${empty}</p>`}</div>`;
}
function initMapSheet(){
 const shell=$('.map-shell');
 const sheet=$('.map-filters',shell);
 const handle=$('.map-sheet-handle',shell);
 const content=$('#map-sheet-content',shell);
 let expanded=false,drag=null,ignoreClick=false;
 function settle(next){
  expanded=next;
  shell.classList.toggle('sheet-expanded',expanded);
  shell.classList.remove('sheet-dragging');
  shell.style.removeProperty('--sheet-drag-height');
  handle.setAttribute('aria-expanded',String(expanded));
  content.scrollTop=0;
 }
 shell._settleSheet=settle;
 handle.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0)return;
  ignoreClick=false;
  drag={id:event.pointerId,y:event.clientY,height:sheet.offsetHeight,moved:false};
  handle.setPointerCapture(event.pointerId);
 });
 handle.addEventListener('pointermove',event=>{
  if(drag?.id!==event.pointerId)return;
  const distance=drag.y-event.clientY;
  if(!drag.moved&&Math.abs(distance)<7)return;
  drag.moved=true;
  shell.classList.add('sheet-dragging');
  shell.style.setProperty('--sheet-drag-height',`${drag.height+distance}px`);
 });
 function endDrag(event){
  if(drag?.id!==event.pointerId)return;
  const distance=drag.y-event.clientY;
  ignoreClick=drag.moved;
  drag=null;
  settle(event.type==='pointerup'&&Math.abs(distance)>24?distance>0:expanded);
 }
 handle.addEventListener('pointerup',endDrag);
 handle.addEventListener('pointercancel',endDrag);
 handle.addEventListener('lostpointercapture',endDrag);
 handle.addEventListener('click',event=>{
  if(ignoreClick&&event.detail!==0){ignoreClick=false;return;}
  settle(!expanded);
 });
}
function mapPage({fit=false}={}){
 const list=filteredPlaces();
 if(map&&$('#leaflet-map')&&state.view==='map'){
  $('#map-sheet-content').innerHTML=mapSheetContent(list);$('.map-sheet-count').textContent=list.length;
  if(!reducedMotion())$$('.map-sheet-results .place-card').slice(0,8).forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:360,delay:i*30,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  updateMapMarkers(list);if(fit)fitMapResults(list);return;
 }
 disposeMap();
 layout(`<main class="map-page"><div class="map-shell ${state.view==='map'?'map-with-sheet':'map-list'}"><aside class="map-filters">${state.view==='map'?`<button type="button" class="map-sheet-handle" aria-expanded="false" aria-controls="map-sheet-content"><span class="map-sheet-grip" aria-hidden="true"></span><span>${tx('探索地點','Explore places')}</span><span class="map-sheet-count">${list.length}</span></button><div id="map-sheet-content">${mapSheetContent(list)}</div>`:mapFilters(list)}</aside><section class="map-stage ${state.view==='list'?'list-mode':''}">${state.view==='map'?`<div id="leaflet-map"></div>${mapLegend()}<aside class="map-place-panel" aria-label="${tx('地點資訊','Selected place')}" aria-hidden="true" inert></aside><div class="map-empty" ${list.length?'hidden':''}>${tx('暫時沒有符合的地點，試試其他分類。','No places match these filters. Try another category.')}</div>`:`<div class="place-list">${list.map(placeCard).join('')||`<p class="map-list-empty">${tx('暫時沒有符合的地點。','No matching places.')}</p>`}</div>`}</section></div></main>`,{showFooter:false});
 if(state.view==='map'){initMapSheet();initMap(list)}
}
function placePhoto(p,{className='',decorative=false}={}){
 const classAttr=className?` class="${className}"`:'';
 if(p.img)return `<img${classAttr}${decorative?' loading="lazy"':''} src="${esc(p.img)}" alt="${decorative?'':esc(loc(p,'name','en'))}">`;
 return `<span class="place-photo-missing ${className}">${categoryArtwork(p.cat,34)}<small>${tx('暫無實景照片','Photo coming soon')}</small></span>`;
}
function placeCard(p){return `<a class="place-card" href="#place/${encodeURIComponent(p.id)}" data-place-card="${esc(p.id)}" style="--pin-color:${mapPinArtwork[p.cat]?.[0]||'#28CD41'}">${placePhoto(p,{decorative:true})}<div><small><i class="dot"></i>${esc(mapLabel(p.cat))} · ${esc(mapLabel(p.area))}</small><h3>${esc(loc(p,'name','en'))}</h3><p>${esc(loc(p,'desc','desc_en'))}</p>${p.tags?.length?`<span class="card-tags">${p.tags.map(t=>`<i>${esc(mapLabel(t))}</i>`).join('')}</span>`:''}</div><span class="card-arrow">${I('arrow',16)}</span></a>`}
function mapPlaceContent(p){const c=mapCategories[p.cat]||mapCategories['去'];return `<button class="map-place-close" data-action="close-map-place" aria-label="${tx('關閉地點資訊','Close place details')}">${I('close',18)}</button><div class="map-place-content">${placePhoto(p,{className:'map-place-photo'})}<div class="map-place-body"><div class="map-place-meta"><span class="map-place-category" style="--category-color:${c.color}">${categoryArtwork(p.cat,15)} ${esc(mapLabel(p.cat))}</span><span>${esc(mapLabel(p.area))}</span></div><h2>${esc(loc(p,'name','en'))}</h2><p class="map-place-address">${I('pin',16)}<span>${esc(loc(p,'address','address_en'))}</span></p><p class="map-place-description">${esc(loc(p,'desc','desc_en'))}</p>${p.tags?.length?`<div class="map-place-tags">${p.tags.map(t=>`<span>${esc(mapLabel(t))}</span>`).join('')}</div>`:''}<a class="map-place-link" href="#place/${encodeURIComponent(p.id)}">${tx('認識這個地方','Discover this place')} ${I('arrow',17)}</a></div></div>`}
function sidePadding(){const compact=window.matchMedia('(max-width:760px)').matches;const side=$('.map-with-sheet .map-filters');return compact||!side?50:side.offsetWidth+side.offsetLeft+40}
function selectMapPlace(id,{pan=true,focus=false}={}){
 const p=state.places.find(p=>p.id===id),panel=$('.map-place-panel');if(!p||!panel)return;
 const changing=panel.classList.contains('is-open')&&selectedPlaceId!==id;selectedPlaceId=id;
 panel.innerHTML=mapPlaceContent(p);panel.inert=false;panel.setAttribute('aria-hidden','false');panel.classList.add('is-open');
 for(const [key,marker]of placeMarkers){const el=marker.getElement();el?.classList.toggle('is-selected',key===id);el?.setAttribute('aria-pressed',String(key===id));marker.setZIndexOffset(key===id?1000:0)}
 $$('[data-place-card]').forEach(el=>el.classList.toggle('is-current',el.dataset.placeCard===id));
 if(changing){const content=$('.map-place-content',panel);content.animate([{opacity:.2,transform:reducedMotion()?'none':'translateY(8px)'},{opacity:1,transform:'none'}],{duration:260,easing:'cubic-bezier(.22,1,.36,1)'})}
 if(pan&&map){const compact=window.matchMedia('(max-width:760px)').matches;map.panInside([p.lat,p.lng],{paddingTopLeft:[sidePadding(),50],paddingBottomRight:compact?[50,Math.min(panel.offsetHeight+24,Math.round(map.getSize().y*.68))]:[panel.offsetWidth+60,70],animate:!reducedMotion(),duration:.35})}
 if(focus)$('.map-place-close',panel)?.focus({preventScroll:true});
}
function closeMapPlace({restoreFocus=false}={}){const previous=selectedPlaceId;selectedPlaceId='';const panel=$('.map-place-panel');if(panel){panel.classList.remove('is-open');panel.inert=true;panel.setAttribute('aria-hidden','true')}for(const marker of placeMarkers.values()){marker.getElement()?.classList.remove('is-selected');marker.getElement()?.setAttribute('aria-pressed','false');marker.setZIndexOffset(0)}$$('[data-place-card]').forEach(el=>el.classList.remove('is-current'));if(restoreFocus)placeMarkers.get(previous)?.getElement()?.focus({preventScroll:true})}
function focusPlaceOnMap(id){
 const p=state.places.find(x=>x.id===id);if(!map||!hasCoordinates(p))return false;
 const shell=$('.map-shell');shell?._settleSheet?.(false);
 const target=Math.max(map.getZoom(),17);
 const done=()=>selectMapPlace(id,{pan:true});
 if(map.getZoom()===target&&map.getBounds().pad(-.2).contains([p.lat,p.lng]))done();
 else{map.once('moveend',done);map.flyTo([p.lat,p.lng],target,{animate:!reducedMotion(),duration:.8})}
 return true;
}

/* ───────────── Custom Redrawn Apple SF-Style Category Pictograms ───────────── */
const mapPinArtwork={
 '食':['#FF9500','<path fill="#FF9500" opacity=".2" d="M4.2 12.2h15.6a7.8 7.8 0 0 1-15.6 0Z"/><path fill="none" stroke="#D97000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 12h16a8 8 0 0 1-16 0ZM8.5 19.8h7"/><path fill="#28CD41" d="M12 10.6c-3.8 0-5.8-2-5.8-5.6 3.6 0 5.8 2 5.8 5.6Zm0 0c0-3.8 2.2-6 6-6.4 0 4-2.2 6.4-6 6.4Z"/>'],
 '買':['#E8A300','<path fill="#FFCC00" opacity=".24" d="M5.5 8.5h13l1.1 10.8H4.4L5.5 8.5Z"/><path fill="none" stroke="#B87D00" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M5.5 8.5h13l1.1 10.8H4.4L5.5 8.5ZM8.8 10.5V7.2a3.2 3.2 0 0 1 6.4 0v3.3"/><circle cx="12" cy="14" r="1.6" fill="#28CD41"/>'],
 '修':['#007AFF','<path fill="#007AFF" opacity=".18" d="M14.8 4.6a4.5 4.5 0 0 0-5.4 5.4l-4.8 4.8a2.2 2.2 0 0 0 3.2 3.2l4.8-4.8a4.5 4.5 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 1.8-3.4Z"/><path fill="none" stroke="#0062CC" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M14.8 4.6a4.5 4.5 0 0 0-5.4 5.4l-4.8 4.8a2.2 2.2 0 0 0 3.2 3.2l4.8-4.8a4.5 4.5 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4 1.8-3.4Z"/>'],
 '去':['#28CD41','<path fill="#28CD41" opacity=".2" d="M19.2 4.8C11 4.4 5.4 9.2 4.8 17.2c7.4.6 13.6-4.2 14.4-12.4Z"/><path fill="none" stroke="#199E30" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M19.2 4.8C11 4.4 5.4 9.2 4.8 17.2c7.4.6 13.6-4.2 14.4-12.4ZM4.8 17.2 3.4 20M5.2 16.8c3.4-3.8 7-6.2 11-7.6"/>'],
 '學':['#AF52DE','<path fill="#AF52DE" opacity=".18" d="M4 5.8h4.8a3.2 3.2 0 0 1 3.2 3.2 3.2 3.2 0 0 1 3.2-3.2H20v11.8h-4.8a3.2 3.2 0 0 0-3.2 1.8 3.2 3.2 0 0 0-3.2-1.8H4V5.8Z"/><path fill="none" stroke="#8938B8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 5.8h4.8a3.2 3.2 0 0 1 3.2 3.2 3.2 3.2 0 0 1 3.2-3.2H20v11.8h-4.8a3.2 3.2 0 0 0-3.2 1.8 3.2 3.2 0 0 0-3.2-1.8H4V5.8Zm8 3.2v10.4"/>'],
 '參與':['#FF2D55','<circle cx="8.8" cy="8.2" r="2.6" fill="#FF2D55" opacity=".22"/><circle cx="15.8" cy="8.8" r="2.2" fill="#FF2D55" opacity=".22"/><path fill="none" stroke="#D91B42" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M8.8 10.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Zm7 .4a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4ZM3.6 18.8c0-2.7 2.3-4.8 5.2-4.8s5.2 2.1 5.2 4.8M14.6 14.4c2.2.2 3.9 1.9 4 4.4"/>']
};
function categoryArtwork(category,size){
 const [,art]=mapPinArtwork[category]||mapPinArtwork['去'];
 return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${art}</svg>`;
}
function mapPinIcon(category,index=0){
 const [color]=mapPinArtwork[category]||mapPinArtwork['去'];
 const illustration=categoryArtwork(category,22);
 return `<span class="map-pin" style="--pin-color:${color};--d:${Math.min(index,40)*18}ms" aria-hidden="true">
  <svg class="map-pin-body" viewBox="0 0 30 38">
   <path fill="currentColor" d="M15 0a15 15 0 0 1 15 15c0 9-7.5 16-15 23C7.5 31 0 24 0 15A15 15 0 0 1 15 0Z"/>
   <path fill="#fff" opacity=".18" d="M15 1.2a13.8 13.8 0 0 0-13.8 13.8c0 2 .4 3.8 1.2 5.5A13.8 13.8 0 0 1 27.6 9.5 13.8 13.8 0 0 0 15 1.2Z"/>
  </svg>
  <span class="map-pin-turn">
   <span class="map-pin-face">${illustration}</span>
   <span class="map-pin-face map-pin-face-active">${illustration}</span>
  </span>
 </span>`;
}
function updateMapMarkers(list){
 if(!map||!markerLayer)return;markerLayer.clearLayers();placeMarkers.clear();
 const groups=[],zoom=map.getZoom();
 const groupRadius=zoom<15?80:zoom<17?64:44;
 for(const p of list.filter(hasCoordinates)){const point=map.latLngToContainerPoint([p.lat,p.lng]);const group=zoom<18?groups.find(g=>g.point.distanceTo(point)<groupRadius):null;if(group){group.items.push(p)}else groups.push({point,items:[p]})}
 let index=0;
 for(const group of groups){
  index++;
  if(group.items.length>1){
   const items=group.items,center=L.latLng(items.reduce((sum,p)=>sum+p.lat,0)/items.length,items.reduce((sum,p)=>sum+p.lng,0)/items.length),label=tx(`${items.length} 個地點，點擊放大查看`,`${items.length} places. Zoom in to explore.`);
   const size=items.length>50?54:items.length>15?46:items.length>5?40:34;
   const cluster=L.marker(center,{icon:L.divIcon({className:'map-cluster',html:`<span style="--d:${Math.min(index,40)*18}ms">${items.length}</span>`,iconSize:[size,size],iconAnchor:[size/2,size/2]}),title:label,alt:label}).addTo(markerLayer);
   const expand=()=>map.fitBounds(items.map(p=>[p.lat,p.lng]),{padding:[64,64],maxZoom:Math.min(18,map.getZoom()+3),animate:!reducedMotion()});
   cluster.on('click',expand);cluster.getElement().setAttribute('aria-label',label);cluster.getElement().addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();expand()}});continue;
  }
  const p=group.items[0],position=L.latLng(p.lat,p.lng);
  const marker=L.marker(position,{icon:L.divIcon({className:'map-category-marker',html:mapPinIcon(p.cat,index),iconSize:[36,46],iconAnchor:[18,46]}),alt:loc(p,'name','en'),riseOnHover:true}).addTo(markerLayer);marker.on('click',e=>selectMapPlace(p.id,{focus:!!e.originalEvent&&e.originalEvent.type==='keydown'}));const el=marker.getElement();el.setAttribute('aria-label',`${mapLabel(p.cat)} · ${loc(p,'name','en')}`);el.setAttribute('aria-pressed','false');el.dataset.placeId=p.id;el.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();selectMapPlace(p.id,{focus:true})}});placeMarkers.set(p.id,marker);
 }
 const empty=$('.map-empty');
 empty.hidden=list.some(hasCoordinates);
 empty.textContent=list.length?tx('這些地點的座標尚待確認，請切換至「列表」查看資料。','These places do not yet have map pins. Switch to List to see their details.'):tx('暫時沒有符合的地點，試試其他分類。','No places match these filters.');
 if(selectedPlaceId&&list.some(p=>p.id===selectedPlaceId))selectMapPlace(selectedPlaceId,{pan:false});else closeMapPlace();
}
function fitMapResults(list){
 const positions=list.filter(hasCoordinates).map(p=>[p.lat,p.lng]);
 if(positions.length)map.fitBounds(positions,{paddingTopLeft:[sidePadding(),45],paddingBottomRight:[45,45],maxZoom:17,animate:false});
}
function initMap(list){
 const el=$('#leaflet-map');if(!el||!window.L)return;
 map=L.map(el,{zoomControl:false,dragging:true,touchZoom:true,scrollWheelZoom:!window.matchMedia('(pointer:coarse), (max-width:760px)').matches,wheelDebounceTime:30,wheelPxPerZoomLevel:100,minZoom:3,maxZoom:19,zoomAnimation:!reducedMotion(),fadeAnimation:!reducedMotion()}).setView([22.178,113.548],13);
 const currentMap=map,key=state.config.maptilerKey;el.dataset.zoom=String(currentMap.getZoom());
 if(!reducedMotion()){el.classList.add('pins-intro');setTimeout(()=>el.classList.remove('pins-intro'),1800)}
 const sizeObserver=new ResizeObserver(()=>currentMap.invalidateSize({animate:false,debounceMoveend:true}));
 sizeObserver.observe(el);
 currentMap.once('unload',()=>sizeObserver.disconnect());
 const zoom=L.control.zoom({position:'bottomright',zoomInText:I('plus',20),zoomOutText:I('minus',20),zoomInTitle:tx('放大地圖','Zoom in'),zoomOutTitle:tx('縮小地圖','Zoom out')}).addTo(map);
 const controls=zoom.getContainer();
 controls.addEventListener('pointerdown',e=>{const button=e.target.closest('a');if(button&&!button.classList.contains('leaflet-disabled')){button.classList.add('is-pressed');clearTimeout(button.pressTimer);button.pressTimer=setTimeout(()=>button.classList.remove('is-pressed'),160)}});
 map.on('zoomstart',()=>el.classList.add('is-zooming'));
 map.on('zoomend',()=>{el.dataset.zoom=String(currentMap.getZoom());el.classList.remove('is-zooming');updateMapMarkers(filteredPlaces())});
 markerLayer=L.layerGroup().addTo(map);updateMapMarkers(list);
 const fallback=()=>{if(map!==currentMap)return;L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(currentMap)};
 if(window.maplibregl&&L.maplibreGL&&window.GreenGoMapStyle){
  GreenGoMapStyle.create(key,state.lang).then(style=>{
   if(map!==currentMap)return;
   const attribution=key?'© <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>':'<a href="https://openfreemap.org/" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://openmaptiles.org/" target="_blank" rel="noopener">OpenMapTiles</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>';
   const layer=L.maplibreGL({style,interactive:false,padding:.15,attributionControl:{customAttribution:attribution}}).addTo(currentMap);
   const vectorMap=layer.getMaplibreMap();
   vectorMap.once('load',()=>{if(map===currentMap)el.dataset.basemap='calm-vector'});
   vectorMap.once('error',()=>{if(map===currentMap&&!vectorMap.isStyleLoaded()){currentMap.removeLayer(layer);fallback()}});
  }).catch(fallback);
 }else fallback();
 if(state.mapPlace){const place=state.places.find(p=>p.id===state.mapPlace);if(hasCoordinates(place)){currentMap.setView([place.lat,place.lng],16,{animate:false});selectMapPlace(place.id,{pan:false})}state.mapPlace=''}else if(state.cat!=='全部'||state.area!=='全部'||state.query){fitMapResults(list)}
}

/* ───────────── Detail pages ───────────── */
function detailBack(href,label){return `<a class="back" href="${esc(href)}">${I('arrow',18)}<span>${esc(label)}</span></a>`}
function detailNav(href,label){return `<nav class="detail-nav container" aria-label="${tx('返回導覽','Back navigation')}">${detailBack(href,label)}</nav>`}
function placeWebsites(p,english){
 const links=String(p.website||'').split(/\s+/).flatMap(value=>{try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?[u]:[]}catch{return []}});
 return links.length?`<div><dt>${I('globe')}<span>${english?'Website':'網站'}</span></dt><dd>${links.map(u=>`<a href="${esc(u.href)}" target="_blank" rel="noopener noreferrer">${esc(u.hostname.replace(/^www\./,''))}</a>`).join('<br>')}</dd></div>`:'';
}
function placePage(){
 const p=state.places.find(x=>x.id===state.id);if(!p)return notFound();
 const route=state.routes.find(r=>r.id===state.fromRoute),english=state.lang==='en';
 const description=loc(p,'desc','desc_en'),story=loc(p,'story','story_en');
 const backHref=route?`#route/${encodeURIComponent(route.id)}`:'#map';
 const backLabel=route?(english?'Back to route':'返回主題路線'):(english?'Back to map':'返回地圖');
 const color=mapPinArtwork[p.cat]?.[0]||'#28CD41';
 const nearby=state.places.filter(x=>x.id!==p.id&&x.cat===p.cat&&x.area===p.area&&x.img).slice(0,3);
 layout(`<main class="detail-page place-detail" style="--c:${color}">${detailNav(backHref,backLabel)}
 <section class="container place-hero">
  <div class="place-media" data-reveal>${placePhoto(p)}<span class="place-badge">${categoryArtwork(p.cat,26)}</span></div>
  <div class="place-summary" data-reveal style="--i:1">
   <p class="detail-category"><span class="dot"></span>${esc(mapLabel(p.cat))}${p.area?` · ${esc(mapLabel(p.area))}`:''}</p>
   <h1>${esc(loc(p,'name','en'))}</h1>
   <p class="lead">${esc(description)}</p>
   ${p.tags?.length?`<div class="tags">${p.tags.map(t=>`<span>${esc(mapLabel(t))}</span>`).join('')}</div>`:''}
   <dl class="info-list"><div><dt>${I('pin')}<span>${english?'Address':'地址'}</span></dt><dd>${esc(loc(p,'address','address_en')||(english?'Not provided':'未提供'))}</dd></div>${p.hours?`<div><dt>${I('clock')}<span>${english?'Hours':'營業時間'}</span></dt><dd>${esc(loc(p,'hours','hours_en'))}</dd></div>`:''}${p.phone?`<div><dt>${I('phone')}<span>${english?'Phone':'電話'}</span></dt><dd><a href="tel:${esc(p.phone.replace(/[^+0-9]/g,''))}">${esc(p.phone)}</a></dd></div>`:''}${placeWebsites(p,english)}</dl>
   ${hasCoordinates(p)?`<a class="button" href="#map?place=${encodeURIComponent(p.id)}">${english?'View on map':'在地圖上查看'} ${I('map',18)}</a>`:`<p class="muted-note">${english?'Map location pending verification.':'地圖標點待確認。'}</p>`}
  </div>
 </section>
 ${story&&story!==description?`<section class="container reading-wrap"><article class="reading-body" data-reveal><h2>${english?'About this place':'認識這個地方'}</h2>${paragraphs(story)}</article></section>`:''}
 ${nearby.length?`<section class="container related-block"><div class="section-head" data-reveal><div><h2>${tx(`同區的${mapLabel(p.cat)}好去處`,`More places to ${mapLabel(p.cat).toLowerCase()} nearby`)}</h2></div></div><div class="related-grid">${nearby.map(placeCard).join('')}</div></section>`:''}
 <div class="container reading-actions">${detailBack(backHref,backLabel)}</div>
 </main>`);
}
function pageIntro(title,intro,count,art){
 return `<section class="page-intro"><div class="container page-intro-grid"><div><h1>${splitLines(title)}</h1><p class="page-intro-text">${intro}</p></div>${count!=null?`<div class="page-intro-count"><strong data-count="${count}">0</strong><span>${art}</span></div>`:''}</div></section>`;
}
function routesPage(){
 layout(`<main class="listing-page">${pageIntro(T().routesTitle,T().routesIntro,state.routes.length,tx('條路線','routes'))}
 <div class="container route-grid">${state.routes.length?'':`<p>${tx('目前沒有已發布的路線。','No routes yet.')}</p>`}${state.routes.map((r,i)=>routeCard(r,i)).join('')}</div></main>`);
}
function routePage(){
 const r=state.routes.find(x=>x.id===state.id);if(!r)return notFound();
 const stops=(r.ids||[]).map(id=>state.places.find(p=>p.id===id)).filter(Boolean),english=state.lang==='en';
 layout(`<main class="detail-page route-detail">${detailNav('#routes',english?'Back to routes':'返回主題路線')}
 <section class="container route-head">
  <div class="route-head-copy" data-reveal>
   <p class="detail-category"><span class="dot"></span>${esc(loc(r,'cat','cat_en'))}</p>
   <h1>${esc(loc(r,'n','n_en'))}</h1>
   <p class="lead">${esc(loc(r,'text','text_en'))}</p>
   <div class="route-facts"><span><b>${stops.length}</b>${T().places}</span>${r.time?`<span><b>${I('clock',20)}</b>${esc(loc(r,'time','time_en'))}</span>`:''}</div>
   <a class="button" href="#route-stops" data-action="route-stops">${english?'Start the route':'開始這條路線'} ${I('arrow',18)}</a>
  </div>
  <div class="route-head-media" data-reveal style="--i:1"><img data-parallax="-0.05" src="${esc(imagePath(r.img||stops.find(s=>s.img)?.img))}" alt="${esc(loc(r,'n','n_en'))}"></div>
 </section>
 <section class="container route-itinerary" aria-labelledby="itinerary-title">
  <div class="section-head" data-reveal><div><h2 id="itinerary-title">${english?'Along the route':'沿途地點'}</h2></div><span class="count-pill">${stops.length} ${T().places}</span></div>
  <ol class="route-stops" id="route-stops">${stops.map((p,i)=>`<li data-reveal style="--i:${i%3};--c:${mapPinArtwork[p.cat]?.[0]||'#28CD41'}"><span class="stop-marker"><b>${pad2(i+1)}</b></span><a class="stop-card" href="#place/${encodeURIComponent(p.id)}?route=${encodeURIComponent(r.id)}">${placePhoto(p,{decorative:true})}<div><small><i class="dot"></i>${esc(mapLabel(p.cat))} · ${esc(mapLabel(p.area))}</small><h3>${esc(loc(p,'name','en'))}</h3><p>${esc(loc(p,'desc','desc_en'))}</p><span class="text-link">${english?'View place':'認識地點'} ${I('arrow',16)}</span></div></a></li>`).join('')}</ol>
 </section>
 <div class="container reading-actions">${detailBack('#routes',english?'Back to routes':'返回主題路線')}</div>
 </main>`);
}
function storiesPage(){
 layout(`<main class="listing-page">${pageIntro(T().storiesTitle,T().storiesIntro,state.articles.length,tx('個故事','stories'))}
 <div class="container story-grid">${state.articles.length?'':`<p>${tx('目前沒有已發布的故事。','No stories yet.')}</p>`}${state.articles.map((a,i)=>storyCard(a,i)).join('')}</div></main>`);
}
const paragraphs=t=>String(t||'').split(/\n+/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('');
function articlePage(){
 const a=articleFor(state.id);if(!a)return notFound();
 const p=state.places.find(x=>x.id===a.place_id),english=state.lang==='en';
 const more=state.articles.filter(x=>x.id!==a.id).slice(0,2);
 layout(`<main class="article-page" style="--story-color:${articleTone(a)}">${detailNav('#stories',english?'Back to stories':'返回人物故事')}
 <header class="container article-heading" data-reveal><p class="detail-category"><span class="dot"></span>${esc(loc(a,'category'))}</p><h1>${esc(loc(a,'title'))}</h1>${loc(a,'subtitle')&&loc(a,'subtitle')!==loc(a,'title')?`<p class="article-deck">${esc(loc(a,'subtitle'))}</p>`:''}</header>
 <figure class="container article-cover" data-reveal style="--i:1"><div><img data-parallax="-0.05" src="${esc(imagePath(a.img||p?.img))}" alt="${esc(loc(a,'title'))}"></div></figure>
 <div class="container article-reading">
  <article class="reading-body drop-cap" data-reveal>${paragraphs(loc(a,'body','body_en')||loc(a,'subtitle','subtitle_en'))}</article>
  ${p?`<a class="related-place" data-reveal href="#place/${encodeURIComponent(p.id)}" style="--c:${mapPinArtwork[p.cat]?.[0]||'#28CD41'}"><span class="related-place-icon">${categoryArtwork(p.cat,26)}</span><span><small>${english?'Place in this story':'故事中的地點'}</small><strong>${esc(loc(p,'name','en'))}</strong></span>${I('arrow',20)}</a>`:''}
 </div>
 ${more.length?`<section class="container related-block"><div class="section-head" data-reveal><div><h2>${tx('繼續閱讀','Keep reading')}</h2></div><a class="pill-link" href="#stories">${T().more} ${I('arrow',16)}</a></div><div class="story-grid two">${more.map((x,i)=>storyCard(x,i+1)).join('')}</div></section>`:''}
 </main>`);
}

/* ───────────── Contribute ───────────── */
function contributionLabels(){return state.lang==='en'?{steps:['Basic details','Location','Tags','More details','Complete'],title:'Recommend a great place in Macau.',intro:'Submit the details below for review.',next:'Next',back:'Back',submit:'Submit recommendation',note:'Your recommendation will be reviewed by an administrator before it appears publicly.',types:[['Place / Shop','map'],['Organization','people'],['Activity','clock'],['Person / Story','book'],['Other','leaf']],tags:['Eat','Shop','Repair','Explore','Learn','Join']}:{steps:['基本資料','地點資訊','分類標籤','補充說明','完成'],title:'推薦一個澳門的好地方。',intro:'填寫資料並提交，管理員審核後會公開顯示。',next:'下一步',back:'上一步',submit:'提交推薦',note:'推薦會先交由管理員審核，確認資料後才會公開顯示。',types:[['地點／店舖','map'],['機構／團體','people'],['活動','clock'],['人物／故事','book'],['其他','leaf']],tags:['食','買','修','去','學','參與']}}
function contribute(){
 const l=contributionLabels();
 layout(`<main class="contribute-page"><div class="container contribute-shell">
 <header class="contribute-head" data-reveal>
  <h1>${esc(l.title)}</h1>
  <p class="contribute-lead">${esc(l.intro)}</p>
 </header>
 <ol class="stepper" style="--progress:${(state.step-1)/4}">${l.steps.map((name,i)=>`<li class="${state.step===i+1?'active':''} ${state.step>i+1?'done':''}"><span>${state.step>i+1?I('check',15):i+1}</span><small>${name}</small></li>`).join('')}</ol>
 <form id="contribution-form" data-step="${state.step}" class="contribution-form multi-step-form">
  <div class="form-stage">${contributionFields(l)}</div>
  <div class="form-actions">${state.step>1&&state.step<5?`<button type="button" class="button ghost" data-action="contribution-back">${I('arrow',17)} ${l.back}</button>`:'<span></span>'}${state.step<5?`<button type="submit" class="button">${state.step===4?l.submit:l.next} ${I('arrow',17)}</button>`:`<a class="button" href="#map">${T().explore} ${I('arrow',17)}</a>`}</div>
 </form>
 <p class="form-note">${l.note}</p>
 </div></main>`);
}
function contributionFields(l){const c=state.contribution,en=state.lang==='en';const typeValues=['地點／店舖','機構／團體','活動','人物／故事','其他'],tagValues=['食','買','修','去','學','參與'];
 if(state.step===1)return `<h2>${en?'What would you like to recommend?':'你想推薦甚麼？'}</h2><p>${en?'Choose the option that best describes it.':'選擇最貼近的類型，讓我們更了解這個地方的特色。'}</p><div class="type-grid">${l.types.map(([label,icon],index)=>`<label class="type-option"><input type="radio" name="type" aria-label="${esc(label)}" value="${esc(typeValues[index])}" ${c.type===typeValues[index]?'checked':''} required><span class="type-icon">${I(icon,26)}</span><strong>${esc(label)}</strong><i class="type-check">${I('check',14)}</i></label>`).join('')}</div>`;
 if(state.step===2)return `<h2>${en?'Where is it?':'它在哪裡？'}</h2><p>${en?'Add a name and approximate location so others can find it.':'提供名字與大概位置，就能讓更多人找到它。'}</p><div class="contribution-fields"><label>${en?'Name':'名稱'}<input name="name" value="${esc(c.name)}" placeholder="${en?'Example: Neighbourhood repair shop':'例如：街角修鞋店'}" required></label><label>${en?'Area':'地區'}<select name="area" required><option value="">${en?'Select an area':'選擇地區'}</option>${[['澳門半島','Macau Peninsula'],['氹仔','Taipa'],['路環','Coloane']].map(([zhName,enName])=>`<option value="${zhName}" ${c.area===zhName?'selected':''}>${en?enName:zhName}</option>`).join('')}</select></label><label class="wide">${en?'Address or activity location':'地址或活動地點'}<input name="address" value="${esc(c.address)}" placeholder="${en?'Street, building number or a recognisable landmark':'街道及門牌，或容易辨認的位置'}" required></label></div>`;
 if(state.step===3)return `<h2>${en?'Which categories fit this place?':'它屬於哪幾個生活入口分類？'}</h2><p>${en?'Select one or more categories.':'可選擇一個或多個標籤。'}</p><div class="checkbox-grid">${l.tags.map((t,index)=>`<label><input type="checkbox" name="tags" value="${esc(tagValues[index])}" ${c.tags.includes(tagValues[index])?'checked':''}><span>${categoryArtwork(tagValues[index],16)}${esc(t)}</span></label>`).join('')}</div>`;
 if(state.step===4)return `<h2>${en?'Tell us why you recommend it.':'說說你為甚麼想推薦它。'}</h2><p>${en?'Describe the place and why you recommend it.':'請介紹這個地方，以及推薦的原因。'}</p><div class="contribution-fields one-column"><label>${en?'Why recommend it?':'推薦理由'}<textarea name="description" rows="6" required>${esc(c.description)}</textarea></label><label class="file-field">${en?'Photo (optional)':'圖片（選填）'}<input name="image" type="file" accept="image/jpeg,image/png,image/webp"><small>${en?'JPG, PNG or WebP, up to 5 MB.':'JPG、PNG 或 WebP，最多 5 MB。'}</small></label><label>${en?'Contact details (optional)':'聯絡方式（選填）'}<input name="contact" value="${esc(c.contact)}" placeholder="${en?'Email or phone':'電郵或電話，方便日後聯繫'}"></label></div>`;
 return `<div class="form-success contribution-success"><span class="success-mark">${I('check',40)}</span><h2>${en?'Thank you for sharing.':'謝謝你的分享。'}</h2><p>${en?'Your recommendation has been sent for review.':'推薦已送達管理員，待核實後才會出現在地圖上。'}</p><button type="button" class="button ghost" data-action="contribution-new">${en?'Recommend another place':'再推薦一個地方'}</button></div>`}

/* ───────────── About ───────────── */
function about(){
 const english=state.lang==='en',s=state.site;
 const siteUrl=s.contactWebsite||'https://green-gateway.org';
 const contacts=[
  {label:english?'Email':'聯絡電郵',value:s.contactEmail||'G-GW@GREEN-GATEWAY.ORG',href:`mailto:${s.contactEmail||'G-GW@GREEN-GATEWAY.ORG'}`,icon:'mail'},
  {label:english?'Official website':'官方網站',value:siteUrl.replace(/^https?:\/\//i,'').toUpperCase(),href:siteUrl,external:true,icon:'globe'},
  {label:english?'Telephone':'聯絡電話',value:s.contactPhone||'+853 2859 1162',href:`tel:${(s.contactPhone||'+85328591162').replace(/[^+0-9]/g,'')}`,icon:'phone'},
  {label:english?'Fax':'聯絡傳真',value:s.contactFax||'+853 2893 1085',icon:'phone'},
  {label:english?'Address':'聯絡地址',value:S('contactAddress'),wide:true,icon:'pin'}
 ];
 layout(`<main class="about-page">
 <section class="about-hero"><div class="container about-grid">
  <div class="about-copy" data-reveal><h1>${splitLines(S('aboutTitle')||T().aboutTitle)}</h1><p class="lead">${esc(S('aboutBody')||T().aboutBody)}</p><a class="button" href="#map">${T().explore} ${I('arrow')}</a></div>
  <div class="about-media" data-reveal style="--i:1"><img data-parallax="-0.05" src="${esc(imagePath(s.aboutImage))}" alt="${english?'Illustration of the Macau waterfront':'澳門海濱插畫'}"></div>
 </div></section>
 <section class="container contact-section" aria-labelledby="contact-heading">
  ${sectionHead(`<span id="contact-heading">${english?'Contact us':'聯絡我們'}</span>`,{intro:english?'Get in touch to explore opportunities to work together.':'歡迎與我們聯絡，一起探索合作的可能。'})}
  <dl class="contact-details">${contacts.map((c,i)=>`<div class="contact-item ${c.wide?'contact-address':''}" data-reveal style="--i:${i%3}"><dt>${I(c.icon,18)}${c.label}</dt><dd>${c.href?`<a href="${c.href}" ${c.external?'target="_blank" rel="noopener noreferrer"':''}>${esc(c.value)}${c.external?I('arrowUpRight',18):''}</a>`:esc(c.value)}</dd></div>`).join('')}</dl>
 </section>
 </main>`);
}
function notFound(){layout(`<main class="not-found container"><h1>${tx('這條小路，<br>暫時走不通。','This path<br>leads nowhere yet.')}</h1><a class="button" href="#home">${T().nav[0]} ${I('arrow',18)}</a></main>`)}

/* ───────────── Router ───────────── */
function parseHash(){const raw=location.hash.slice(1)||'home';const [path,qs='']=raw.split('?');const [page,id='']=path.split('/');state.page=navKeys.includes(page)||['place','route','article'].includes(page)?page:'home';state.id=decodeURIComponent(id);const p=new URLSearchParams(qs);state.fromRoute=p.get('route')||'';state.mapPlace=p.get('place')||'';if(state.mapPlace){state.view='map';state.cat='全部';state.area='全部';state.query=''}if(state.page==='map'&&Object.hasOwn(mapCategories,p.get('cat'))){state.cat=p.get('cat');state.area='全部';state.query=''}}
function draw(){disposeMap();parseHash();({home,map:mapPage,place:placePage,routes:routesPage,route:routePage,stories:storiesPage,article:articlePage,contribute,about}[state.page]||home)();document.documentElement.lang=state.lang==='en'?'en':'zh-Hant';document.documentElement.classList.toggle('nav-open',false);scrollTo(0,0)}
function render(){
 if(state.booted&&document.startViewTransition&&!reducedMotion())document.startViewTransition(draw);
 else draw();
 state.booted=true;
}
async function fetchJSON(url,fallback){try{const r=await fetch(url);if(!r.ok)throw 0;return await r.json()}catch{return fallback}}
async function init(){const [places,articles,routes,site,config]=await Promise.all([fetchJSON('/api/places',[]),fetchJSON('/api/articles',[]),fetchJSON('/api/routes',[]),fetchJSON('/api/site',fallbackSite),fetchJSON('/api/config',{})]);Object.assign(state,{places,articles,routes,site:{...fallbackSite,...site},config});render();document.documentElement.classList.add('is-ready')}
function setMenu(open){state.menu=open;$('.main-nav')?.classList.toggle('open',open);document.documentElement.classList.toggle('nav-open',open);const button=$('.menu-button');button?.setAttribute('aria-expanded',String(open))}
addEventListener('hashchange',()=>{state.menu=false;render()});
document.addEventListener('input',e=>{if(e.target.closest('#contribution-form')){const f=new FormData(e.target.form);for(const key of ['type','name','area','address','description','contact'])if(f.has(key))state.contribution[key]=f.get(key);if(state.step===3)state.contribution.tags=f.getAll('tags')}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(state.menu){setMenu(false);$('.menu-button')?.focus()}else if(state.page==='map'&&selectedPlaceId)closeMapPlace({restoreFocus:true})}});
document.addEventListener('mouseover',e=>{const card=e.target.closest('[data-place-card]');const id=card?.dataset.placeCard||'';for(const [key,marker]of placeMarkers)marker.getElement()?.classList.toggle('is-hover',key===id)});
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-action]'),f=e.target.closest('[data-filter]'),v=e.target.closest('[data-view]'),q=e.target.closest('[data-quick]'),card=e.target.closest('.map-with-sheet [data-place-card]');
 if(card&&!e.metaKey&&!e.ctrlKey&&focusPlaceOnMap(card.dataset.placeCard)){e.preventDefault();return}
 const action=a?.dataset.action;
 if(action==='back-to-top')window.scrollTo({top:0,behavior:reducedMotion()?'instant':'smooth'});
 if(action==='route-stops'){e.preventDefault();$('#route-stops')?.scrollIntoView({behavior:reducedMotion()?'instant':'smooth',block:'start'})}
 if(action==='language'){state.lang=state.lang==='zh'?'en':'zh';localStorage.setItem('gg-lang',state.lang);render()}
 if(action==='toggle-map-filters'){state.mapFiltersOpen=!state.mapFiltersOpen;$('#map-filter-options')?.classList.toggle('is-open',state.mapFiltersOpen);a.setAttribute('aria-expanded',String(state.mapFiltersOpen));a.querySelector('svg').outerHTML=I(state.mapFiltersOpen?'close':'filters',18)}
 if(action==='close-map-place')closeMapPlace({restoreFocus:true});
 if(action==='reset-map'){state.cat='全部';state.area='全部';state.query='';mapPage({fit:true})}
 if(action==='menu')setMenu(!state.menu);
 if(action==='search'){const input=$('input[name=q]');if(input){input.focus();input.scrollIntoView({block:'center',behavior:reducedMotion()?'instant':'smooth'})}else{location.hash='map';setTimeout(()=>$('input[name=q]')?.focus(),400)}}
 if(action==='contribution-back'){state.step=Math.max(1,state.step-1);render()}
 if(action==='contribution-new'){state.step=1;state.contribution={type:'',name:'',area:'',address:'',tags:[],description:'',contact:'',image:'',uploadGrant:''};render()}
 if(f){state[f.dataset.filter]=f.dataset.value;mapPage({fit:true})}
 if(v){state.view=v.dataset.view;mapPage()}
 if(q){state.query=q.dataset.quick;location.hash='map'}
});
document.addEventListener('submit',async e=>{if(e.target.matches('[data-search-form],[data-map-search]')){e.preventDefault();state.query=new FormData(e.target).get('q')||'';location.hash='map';if(state.page==='map')mapPage({fit:true})}if(e.target.id==='contribution-form'){e.preventDefault();const form=e.target,f=new FormData(form);if(state.step===1)state.contribution.type=f.get('type')||'';if(state.step===2){state.contribution.name=f.get('name')||'';state.contribution.area=f.get('area')||'';state.contribution.address=f.get('address')||''}if(state.step===3){state.contribution.tags=f.getAll('tags');if(!state.contribution.tags.length)return alert(state.lang==='en'?'Please select at least one tag.':'請至少選擇一個標籤。')}if(state.step===4){state.contribution.description=f.get('description')||'';state.contribution.contact=f.get('contact')||'';const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent=state.lang==='en'?'Submitting…':'正在提交…';try{const file=f.get('image');if(file?.size){if(file.size>5000000)throw new Error(state.lang==='en'?'The image must be under 5 MB.':'圖片不能超過 5 MB');const upload=await fetch('/api/upload?type=submission',{method:'POST',headers:{'Content-Type':file.type},body:file}),uploaded=await upload.json();if(!upload.ok)throw new Error(uploaded.error||'圖片上傳失敗');state.contribution.image=uploaded.url;state.contribution.uploadGrant=uploaded.uploadGrant||''}const r=await fetch('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state.contribution)}),result=await r.json();if(!r.ok)throw new Error(result.error||'投稿未能送出');state.step=5;render()}catch(err){button.disabled=false;button.innerHTML=`${contributionLabels().submit} ${I('arrow',17)}`;alert(err.message)}return}state.step=Math.min(5,state.step+1);render()}});
init();

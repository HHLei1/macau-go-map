const plain=(value,max=2000)=>String(value??'').replace(/[<>]/g,'').trim().slice(0,max);
const image=value=>{const path=plain(value,500);return /^(assets\/[\w.-]+\.(?:png|jpg|jpeg|webp)|\/media\/[a-f0-9-]+\.(?:png|jpg|webp))$/i.test(path)?path:''};
const articleId=value=>/^[\w-]{1,100}$/.test(String(value??''))?String(value):'';

const defaultExperiences=()=>[
  {id:'exp-1',author:'@momo_macau',textZh:'週末跟著綠門GO地圖去望廈吃蔬食，本來只是想隨便找間安靜的小店吃頓午飯，沒想到老闆娘親自介紹每一道菜用的本地農場時蔬，還分享了他們減少廚餘和不使用即棄餐盒的做法。坐在窗邊看著老區街景，突然覺得澳門的慢生活其實一直都在，只是以前走得太快沒發現。',textEn:'Followed Green GO to Mong Ha for a plant-based lunch. The owner walked us through the local farm produce and their zero-waste kitchen habits—such a warm, unhurried afternoon.',image:'assets/flat-cafe.webp'},
  {id:'exp-2',author:'@jenny_c',textZh:'介面很乾淨，在手機上找氹仔的零包裝雜貨店超方便，點一下就能直接導航過去！',textEn:'Clean interface—found a zero-waste shop in Taipa and navigated straight there.',image:''},
  {id:'exp-3',author:'@coloane_breeze',textZh:'照著「城市裡還有自然嗎？」走了一趟龍環葡韻濕地，第一次在市區旁靜靜看到這麼多白鷺在紅樹林間覓食。',textEn:'Walked the Taipa wetland route and watched egrets right beside the city.',image:'assets/flat-coast.webp'},
  {id:'exp-4',author:'@ah_fai_walk',textZh:'以前總覺得皮鞋穿舊或鞋底開膠就該丟掉再買一雙，後來在地圖上看到亞婆井附近還有一位老師傅堅持手工補鞋。那天把穿了五年的牛津鞋拿過去，師傅仔細檢查縫線後花了半小時細心修補，還教我平常怎麼上油保養。拿回修好的鞋那一刻真的很有溫度，修補的不只是物件，也是這座城市惜物的人情味。',textEn:'Used to toss worn-out shoes until I found an old cobbler near Lilau Square on the map. He repaired my five-year-old pair in half an hour and taught me how to care for the leather.',image:''},
  {id:'exp-5',author:'@kit_cycling',textZh:'上週騎單車經過筷子基時後輪突然漏氣，急忙打開地圖搜尋「修」，果然找到轉角處的單車維修點。師傅十幾分鐘就幫我補好內胎，還順手調校了煞車鬆緊，收費公道又不用換掉整條輪胎，環保又省錢。',textEn:'Got a flat tyre near Fai Chi Kei and found a neighbourhood bike repair spot within minutes—patched and tuned in fifteen minutes without wasting a new tube.',image:'assets/flat-repairbike.webp'},
  {id:'exp-6',author:'@sara_reads',textZh:'很喜歡網站裡的人物故事專訪，本來只是想查幾個環保店舖的地址，結果一口氣把阿發師傅、社區菜園和青年行動的文章全讀完了。原來澳門的街巷裡藏著這麼多默默堅持永續生活的小人物，他們不喊口號，只是日復一日把一件小事做好。每次心情浮躁的時候讀一讀，都會覺得這座城市還有很多值得探索和守護的角落。',textEn:'Came for store addresses and ended up reading every single story. Behind Macau’s busy streets are quiet makers and neighbours keeping sustainability alive every day without fanfare.',image:''},
  {id:'exp-7',author:'@lucas_mo',textZh:'帶外地朋友用綠門GO逛下環街市和舊城區，比一般旅遊書更有生活感，朋友超喜歡。',textEn:'Showed visiting friends around Barra Market using Green GO—felt like the real Macau.',image:'assets/flat-market.webp'},
  {id:'exp-8',author:'@eco_student',textZh:'學校環保社團的週末考察路線就是參考這裡設計的！',textEn:'Our school eco-club designed our weekend walk straight from these curated routes!',image:''},
  {id:'exp-9',author:'@patane_oldstreet',textZh:'最近每天下班都會順路打開地圖看看附近有沒有沒去過的綠色小店，已經在「投稿／評價」推薦了一家沙梨頭的舊物選品店，希望之後能看到更多路環和離島的地點加入！',textEn:'I check the map after work for new neighbourhood spots and just submitted a vintage shop in Patane via Contribute / Review. Hoping to see more Coloane places soon!',image:''},
  {id:'exp-10',author:'@yoyo_taipa',textZh:'自備玻璃罐去買散裝乾貨和茶葉真的很有儀式感，老闆還會多送一小匙試飲的花茶。算下來一個月少用了幾十個塑膠袋，家裡的儲物櫃也變得整齊又治癒，會一直支持下去。',textEn:'Bringing my own jars for dry goods and loose-leaf tea feels great—cut dozens of plastic bags a month and my pantry has never looked tidier.',image:'assets/flat-shop.webp'}
];

export const defaultSite=()=>({
  heroEyebrowZh:'澳門 · 探索 · 體驗 · 人',
  heroEyebrowEn:'MACAU · EXPLORE · EXPERIENCE · PEOPLE',
  heroTitleZh:'從一個地方，\n遇見更好的日常。',
  heroTitleEn:'Begin with a place.\nMeet a better everyday life.',
  heroBodyZh:'帶入永續旅遊、融入生活、在地探索，走進更綠色、更關懷與更有韌性的日常。每一個人，都是一個地方。',
  heroBodyEn:'Travel slowly, live locally and discover the people shaping a greener, kinder and more resilient Macau.',
  heroImage:'assets/flat-waterfront.webp',
  heroArticleId:'story-afa',
  searchPlaceholderZh:'搜尋地點、活動、文章或關鍵字',
  searchPlaceholderEn:'Search places, activities, stories or keywords',
  hotSearchesZh:['修補日常','澳門滋味','親近自然'],
  hotSearchesEn:['Repair culture','Local flavours','Urban nature'],
  catsTitleZh:'六種方式，走進綠色澳門',
  catsTitleEn:'Six ways into a greener Macau',
  catsBodyZh:'從吃一頓飯、修一雙鞋開始。選一個入口，地圖會帶你找到附近的好地方。',
  catsBodyEn:'Start with a meal or a mended shoe. Pick an entry point and the map will lead you to good places nearby.',
  categories:[
    {key:'食',titleZh:'食',titleEn:'Eat',subtitleZh:'品味在地風味',subtitleEn:'Taste local flavours',image:'assets/flat-cafe.webp'},
    {key:'買',titleZh:'買',titleEn:'Shop',subtitleZh:'發掘特色好物',subtitleEn:'Choose thoughtful goods',image:'assets/flat-shop.webp'},
    {key:'修',titleZh:'修',titleEn:'Repair',subtitleZh:'延續物件的生命',subtitleEn:'Give objects another life',image:'assets/flat-afa.webp'},
    {key:'去',titleZh:'去',titleEn:'Explore',subtitleZh:'探索澳門之美',subtitleEn:'Discover another Macau',image:'assets/flat-waterfront.webp'},
    {key:'學',titleZh:'學',titleEn:'Learn',subtitleZh:'從自然與社區學習',subtitleEn:'Learn from place and nature',image:'assets/flat-learn.webp'},
    {key:'參與',titleZh:'參與',titleEn:'Join',subtitleZh:'一起創造改變',subtitleEn:'Take part in local change',image:'assets/flat-youth.webp'}
  ],
  routesTitleZh:'跟著路線，慢慢走',
  routesTitleEn:'Slow routes through the city',
  routesBodyZh:'從日常出發，跟著地方和人的故事慢慢走。每條路線都是一次重新認識澳門的機會。',
  routesBodyEn:'Follow local places and people at a slower pace. Every route is a chance to meet Macau again.',
  expTitleZh:'用戶體驗',
  expTitleEn:'Community Voices',
  expBodyZh:'聽聽在澳門生活與散步的人，怎麼用這張地圖遇見日常裡的綠意。',
  expBodyEn:'How neighbours and explorers use the map to find greener everyday moments in Macau.',
  experiences:defaultExperiences(),
  featureEyebrowZh:'一個地方 · 一段故事',
  featureEyebrowEn:'ONE PLACE · ONE STORY',
  featureTitleZh:'阿發修鞋店',
  featureTitleEn:'A Fa Shoe Repair',
  featureBodyZh:'修補的不只是鞋，也是這座城市的溫度。',
  featureBodyEn:'Repair preserves more than a pair of shoes. It keeps the city’s memories close.',
  featureImage:'assets/flat-afa.webp',
  featureSideImage:'assets/flat-waterfront.webp',
  featureArticleId:'story-afa',
  featureBadgeZh:'好的事，在這裡發生。',
  featureBadgeEn:'Good things happen here.',
  featureBadgeSubZh:'人 · 社區 · 自然',
  featureBadgeSubEn:'People · Community · Nature',
  storiesTitleZh:'把城市走成一段故事',
  storiesTitleEn:'Walk the city as a collection of stories',
  storiesBodyZh:'從不同角度認識澳門，發現生活中的綠意與可能。',
  storiesBodyEn:'Meet Macau from different angles and find greener possibilities in everyday life.',
  storyArticleIds:['story-garden','story-afa','story-youth'],
  aboutTitleZh:'關於綠門GO',
  aboutTitleEn:'About Green GO',
  aboutBodyZh:'我們以澳門的地方、人物與行動為起點，透過地圖讓更多人看見日常生活中的改變力量。每一個小小的選擇，都能讓城市更綠色、更宜居。',
  aboutBodyEn:'We begin with Macau’s places, people and local action. This map helps more people notice the quiet changes already happening in everyday life. Every thoughtful choice can make the city greener and more liveable.',
  aboutImage:'assets/flat-waterfront.webp',
  contactEmail:'G-GW@GREEN-GATEWAY.ORG',
  contactWebsite:'https://green-gateway.org',
  contactPhone:'+853 2859 1162',
  contactFax:'+853 2893 1085',
  contactAddressZh:'澳門崗頂前地4號',
  contactAddressEn:'Largo de Santo Agostinho 4 — Macau S.A.R',
  footerTaglineZh:'從澳門的地方與人物出發，探索更綠色的日常。',
  footerTaglineEn:'Start from Macau’s places and people, and discover a greener everyday life.',
  footerNoteZh:'一座城，很多種綠色生活。',
  footerNoteEn:'One city, many ways to live green.'
});

const textKeys=[
  'heroEyebrowZh','heroEyebrowEn','heroTitleZh','heroTitleEn','heroBodyZh','heroBodyEn',
  'searchPlaceholderZh','searchPlaceholderEn',
  'catsTitleZh','catsTitleEn','catsBodyZh','catsBodyEn',
  'routesTitleZh','routesTitleEn','routesBodyZh','routesBodyEn',
  'expTitleZh','expTitleEn','expBodyZh','expBodyEn',
  'featureEyebrowZh','featureEyebrowEn','featureTitleZh','featureTitleEn','featureBodyZh','featureBodyEn',
  'featureBadgeZh','featureBadgeEn','featureBadgeSubZh','featureBadgeSubEn',
  'storiesTitleZh','storiesTitleEn','storiesBodyZh','storiesBodyEn',
  'aboutTitleZh','aboutTitleEn','aboutBodyZh','aboutBodyEn',
  'contactEmail','contactWebsite','contactPhone','contactFax','contactAddressZh','contactAddressEn',
  'footerTaglineZh','footerTaglineEn','footerNoteZh','footerNoteEn'
];

export function normalizeSite(input={}){
  const base=defaultSite();
  const out={};
  for(const key of textKeys)out[key]=plain(input[key]??base[key],key.includes('Body')?4000:500);
  for(const key of ['heroImage','featureImage','featureSideImage','aboutImage'])out[key]=image(input[key])||base[key];
  for(const key of ['heroArticleId','featureArticleId'])out[key]=articleId(input[key])||base[key];
  out.hotSearchesZh=(Array.isArray(input.hotSearchesZh)?input.hotSearchesZh:base.hotSearchesZh).map(v=>plain(v,40)).filter(Boolean).slice(0,8);
  out.hotSearchesEn=(Array.isArray(input.hotSearchesEn)?input.hotSearchesEn:base.hotSearchesEn).map(v=>plain(v,40)).filter(Boolean).slice(0,8);
  const supplied=Array.isArray(input.categories)?input.categories:base.categories;
  const validKeys=new Set(['食','買','修','去','學','參與']);
  out.categories=supplied.slice(0,12).map((item,index)=>{
    const fallback=base.categories[index%base.categories.length];
    const k=validKeys.has(item?.key)?item.key:fallback.key;
    return{
      key:k,
      titleZh:plain(item?.titleZh??fallback.titleZh,40),
      titleEn:plain(item?.titleEn??fallback.titleEn,40),
      subtitleZh:plain(item?.subtitleZh??fallback.subtitleZh,100),
      subtitleEn:plain(item?.subtitleEn??fallback.subtitleEn,100),
      image:image(item?.image)||fallback.image
    };
  });
  const expSupplied=Array.isArray(input.experiences)?input.experiences:base.experiences;
  out.experiences=expSupplied.slice(0,20).map((item,index)=>({
    id:plain(item?.id||`exp-${index+1}`,60),
    author:plain(item?.author||'@visitor',60),
    textZh:plain(item?.textZh??'',400),
    textEn:plain(item?.textEn??'',400),
    image:image(item?.image)
  })).filter(x=>x.textZh||x.textEn);
  out.storyArticleIds=(Array.isArray(input.storyArticleIds)?input.storyArticleIds:base.storyArticleIds).map(articleId).filter(Boolean).slice(0,3);
  while(out.storyArticleIds.length<3)out.storyArticleIds.push(base.storyArticleIds[out.storyArticleIds.length]);
  return out;
}

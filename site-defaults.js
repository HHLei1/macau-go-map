const plain=(value,max=2000)=>String(value??'').replace(/[<>]/g,'').trim().slice(0,max);
const image=value=>{const path=plain(value,500);return /^(assets\/[\w.-]+\.(?:png|jpg|jpeg|webp)|\/media\/[a-f0-9-]+\.(?:png|jpg|webp))$/i.test(path)?path:''};
const articleId=value=>/^[\w-]{1,100}$/.test(String(value??''))?String(value):'';

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
  out.storyArticleIds=(Array.isArray(input.storyArticleIds)?input.storyArticleIds:base.storyArticleIds).map(articleId).filter(Boolean).slice(0,3);
  while(out.storyArticleIds.length<3)out.storyArticleIds.push(base.storyArticleIds[out.storyArticleIds.length]);
  return out;
}

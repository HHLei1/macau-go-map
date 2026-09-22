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
  heroImage:'assets/macau-waterfront.png',
  heroArticleId:'story-afa',
  searchPlaceholderZh:'搜尋地點、活動、文章或關鍵字',
  searchPlaceholderEn:'Search places, activities, stories or keywords',
  hotSearchesZh:['修補日常','澳門滋味','親近自然'],
  hotSearchesEn:['Repair culture','Local flavours','Urban nature'],
  categories:[
    {key:'食',titleZh:'食',titleEn:'Eat',subtitleZh:'品味在地風味',subtitleEn:'Taste local flavours',image:'assets/macau-waterfront.png'},
    {key:'買',titleZh:'買',titleEn:'Shop',subtitleZh:'發掘特色好物',subtitleEn:'Choose thoughtful goods',image:'assets/macau-waterfront.png'},
    {key:'修',titleZh:'修',titleEn:'Repair',subtitleZh:'延續物件的生命',subtitleEn:'Give objects another life',image:'assets/shoe-repair.png'},
    {key:'去',titleZh:'去',titleEn:'Explore',subtitleZh:'探索澳門之美',subtitleEn:'Discover another Macau',image:'assets/macau-waterfront.png'},
    {key:'學',titleZh:'學',titleEn:'Learn',subtitleZh:'從自然與社區學習',subtitleEn:'Learn from place and nature',image:'assets/macau-waterfront.png'},
    {key:'參與',titleZh:'參與',titleEn:'Join',subtitleZh:'一起創造改變',subtitleEn:'Take part in local change',image:'assets/shoe-repair.png'}
  ],
  featureEyebrowZh:'一個地方 · 一段故事',
  featureEyebrowEn:'ONE PLACE · ONE STORY',
  featureTitleZh:'阿發修鞋店',
  featureTitleEn:'A Fa Shoe Repair',
  featureBodyZh:'修補的不只是鞋，也是這座城市的溫度。在澳門的街巷中，有許多默默守護生活的雙手，他們用耐心與技藝，延續物件的生命，也延續了城市的記憶。',
  featureBodyEn:'Repair preserves more than a pair of shoes. In Macau’s neighbourhoods, patient hands extend the life of everyday objects and keep the city’s memories close.',
  featureImage:'assets/shoe-repair.png',
  featureSideImage:'assets/macau-waterfront.png',
  featureArticleId:'story-afa',
  featureBadgeZh:'好的事，在這裡發生。',
  featureBadgeEn:'Good things happen here.',
  featureBadgeSubZh:'人 · 社區 · 自然',
  featureBadgeSubEn:'People · Community · Nature',
  storiesTitleZh:'把城市走成一段故事',
  storiesTitleEn:'Walk the city as a collection of stories',
  storiesBodyZh:'從不同角度認識澳門，發現生活中的綠意與可能。',
  storiesBodyEn:'Meet Macau from different angles and find greener possibilities in everyday life.',
  storyArticleIds:['story-garden','story-afa','story-youth']
});

export function normalizeSite(input={}){
  const base=defaultSite();
  const out={};
  for(const key of ['heroEyebrowZh','heroEyebrowEn','heroTitleZh','heroTitleEn','heroBodyZh','heroBodyEn','searchPlaceholderZh','searchPlaceholderEn','featureEyebrowZh','featureEyebrowEn','featureTitleZh','featureTitleEn','featureBodyZh','featureBodyEn','featureBadgeZh','featureBadgeEn','featureBadgeSubZh','featureBadgeSubEn','storiesTitleZh','storiesTitleEn','storiesBodyZh','storiesBodyEn'])out[key]=plain(input[key]??base[key],key.includes('Body')?4000:500);
  for(const key of ['heroImage','featureImage','featureSideImage'])out[key]=image(input[key])||base[key];
  for(const key of ['heroArticleId','featureArticleId'])out[key]=articleId(input[key])||base[key];
  out.hotSearchesZh=(Array.isArray(input.hotSearchesZh)?input.hotSearchesZh:base.hotSearchesZh).map(v=>plain(v,40)).filter(Boolean).slice(0,5);
  out.hotSearchesEn=(Array.isArray(input.hotSearchesEn)?input.hotSearchesEn:base.hotSearchesEn).map(v=>plain(v,40)).filter(Boolean).slice(0,5);
  const supplied=Array.isArray(input.categories)?input.categories:[];
  out.categories=base.categories.map((fallback,index)=>{const item=supplied.find(v=>v?.key===fallback.key)||supplied[index]||{};return{key:fallback.key,titleZh:plain(item.titleZh??fallback.titleZh,40),titleEn:plain(item.titleEn??fallback.titleEn,40),subtitleZh:plain(item.subtitleZh??fallback.subtitleZh,100),subtitleEn:plain(item.subtitleEn??fallback.subtitleEn,100),image:image(item.image)||fallback.image}});
  out.storyArticleIds=(Array.isArray(input.storyArticleIds)?input.storyArticleIds:base.storyArticleIds).map(articleId).filter(Boolean).slice(0,3);
  while(out.storyArticleIds.length<3)out.storyArticleIds.push(base.storyArticleIds[out.storyArticleIds.length]);
  return out;
}

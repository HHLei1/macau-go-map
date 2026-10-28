-- Publish the approved illustrations without replacing editorial content,
-- coordinates, publication states, submissions, or administrator credentials.
UPDATE places
SET image = 'assets/flat-' || id || '.webp'
WHERE id IN ('afa','market','reuse','garden','bookshop','coast',
             'repairbike','shop','youth','coastcare','learn','cafe');

UPDATE articles
SET image = 'assets/flat-' || place_id || '.webp'
WHERE place_id IN ('afa','market','reuse','garden','bookshop','coast',
                   'repairbike','shop','youth','coastcare','learn','cafe');

UPDATE routes
SET image = CASE id
  WHEN 'food' THEN 'assets/flat-market.webp'
  WHEN 'daily' THEN 'assets/flat-reuse.webp'
  WHEN 'nature' THEN 'assets/flat-coast.webp'
END
WHERE id IN ('food','daily','nature');

UPDATE site_settings
SET content = json_set(content,
  '$.heroImage', 'assets/flat-waterfront.webp',
  '$.featureImage', 'assets/flat-afa.webp',
  '$.featureSideImage', 'assets/flat-waterfront.webp')
WHERE id = 1;

UPDATE site_settings
SET content = json_set(content, '$.categories', json((
  SELECT json_group_array(json_set(value, '$.image', CASE json_extract(value, '$.key')
    WHEN '食' THEN 'assets/flat-cafe.webp'
    WHEN '買' THEN 'assets/flat-shop.webp'
    WHEN '修' THEN 'assets/flat-afa.webp'
    WHEN '去' THEN 'assets/flat-waterfront.webp'
    WHEN '學' THEN 'assets/flat-learn.webp'
    WHEN '參與' THEN 'assets/flat-youth.webp'
    ELSE json_extract(value, '$.image') END))
  FROM json_each(site_settings.content, '$.categories')
)))
WHERE id = 1 AND json_type(content, '$.categories') = 'array';

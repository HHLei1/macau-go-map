UPDATE articles SET
  title_en = 'The Craftsman Repairing the City''s Memories',
  subtitle_en = '"Old things deserve a second life."',
  body_en = 'Every pair of shoes carries a story. Master A Fa carefully stitches worn soles back together, allowing familiar footsteps to keep moving through the city. His work extends the life of everyday objects while preserving the memories and warmth of the neighbourhood.',
  category_en = 'Waste Reduction'
WHERE id = 'story-afa' AND title_en = '';

UPDATE articles SET
  title_en = 'Growing Hope in a Small Community Garden',
  subtitle_en = '"The land teaches us to cherish what we have."',
  body_en = 'Residents sow, water and harvest together in a small patch of soil within the city. The garden provides fresh produce, but it also creates room for neighbours to meet, learn and share their everyday lives.',
  category_en = 'Community'
WHERE id = 'story-garden' AND title_en = '';

UPDATE articles SET
  title_en = 'Young People Taking Green Action',
  subtitle_en = '"Change can begin on campus."',
  body_en = 'Young people bring practical environmental ideas from school into the neighbourhood. Through workshops and community activities, they invite more residents to take part and turn small actions into lasting change.',
  category_en = 'Youth'
WHERE id = 'story-youth' AND title_en = '';

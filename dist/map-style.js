/* Calm street cartography. Keep geographic data separate from visual styling. */
window.GreenGoMapStyle = {
  async create(key, language) {
    let response = key
      ? await fetch(`https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(key)}`).catch(() => null)
      : null;
    if (!response || !response.ok) {
      response = await fetch('https://tiles.openfreemap.org/styles/positron');
    }
    if (!response.ok) throw new Error('Map style unavailable');
    const style = await response.json();
    const colors = {land:'#f3ece3', urban:'#ece5e3', building:'#e1dade', road:'#d6d3d9', edge:'#c9c5cc', minor:'#faf6ef', park:'#d0e4b3', water:'#92d2e7', text:'#65626b'};
    const labelSources = new Set(['transportation_name','water_name','waterway','place']);
    style.name = 'Green GO · Calm streets';
    style.layers = style.layers.filter(layer => {
      if (layer.type === 'fill-extrusion') return false;
      if (layer.type !== 'symbol') return !/hatching|dash|cablecar|ferry/i.test(layer.id);
      return labelSources.has(layer['source-layer']) && !/shield|junction|gondola|ferry/i.test(layer.id);
    }).map(layer => {
      const source = layer['source-layer'], id = layer.id.toLowerCase();
      layer.paint = {...layer.paint};
      layer.layout = {...layer.layout};
      if (layer.type === 'background') layer.paint['background-color'] = colors.land;
      if (layer.type === 'fill') {
        let fill = colors.land;
        if (source === 'water') fill = colors.water;
        else if (source === 'building') fill = colors.building;
        else if (source === 'park' || /grass|wood|forest|meadow|scrub|stadium|park/.test(id)) fill = colors.park;
        else if (source === 'landuse') fill = colors.urban;
        else if (source === 'transportation') fill = colors.minor;
        layer.paint['fill-color'] = fill;
        layer.paint['fill-opacity'] = source === 'building' ? .65 : 1;
        delete layer.paint['fill-pattern'];
        delete layer.paint['fill-outline-color'];
        if (source === 'building') layer.maxzoom = 24;
      }
      if (layer.type === 'line') {
        if (source === 'waterway') layer.paint['line-color'] = colors.water;
        else if (source === 'boundary') {layer.paint['line-color'] = '#c7c0c6';layer.paint['line-opacity'] = .45;}
        else if (source === 'transportation') {
          const outline = /outline|casing/.test(id);
          layer.paint['line-color'] = outline ? colors.edge : /minor|path|footway|pier/.test(id) ? colors.minor : colors.road;
          layer.paint['line-opacity'] = /rail|tunnel/.test(id) ? .45 : 1;
          delete layer.paint['line-pattern'];
        } else if (source === 'aeroway') layer.paint['line-color'] = colors.minor;
      }
      if (layer.type === 'symbol') {
        layer.layout['text-field'] = language === 'en'
          ? ['coalesce',['get','name:en'],['get','name']]
          : ['coalesce',['get','name:zh-Hant'],['get','name:zh'],['get','name']];
        layer.layout['text-font'] = ['Noto Sans Regular'];
        layer.layout['text-letter-spacing'] = 0;
        layer.layout['text-transform'] = 'none';
        layer.layout['text-allow-overlap'] = false;
        layer.layout['text-ignore-placement'] = false;
        layer.layout['text-padding'] = source === 'place' ? 12 : 5;
        delete layer.layout['icon-image'];
        delete layer.layout['icon-size'];
        layer.paint['text-color'] = source === 'water_name' || source === 'waterway' ? '#568ca0' : colors.text;
        layer.paint['text-halo-color'] = source === 'water_name' ? '#b9e1ed' : '#f5f0eb';
        layer.paint['text-halo-width'] = 1.3;
        layer.paint['text-halo-blur'] = .5;
        if (source === 'transportation_name') {
          layer.minzoom = Math.max(layer.minzoom || 0, 13);
          layer.layout['symbol-spacing'] = 360;
          layer.layout['text-size'] = ['interpolate',['linear'],['zoom'],13,11,16,14,19,17];
        }
      }
      return layer;
    });
    return style;
  }
};

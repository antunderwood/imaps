// JQtouch
var jQT = new $.jQTouch({
    icon: 'jqtouch.png',
    addGlossToIcon: false,
    startupScreen: 'jqt_startup.png',
    statusBar: 'black'
});

var osMap;
function init_map()
{
  osMap = new OpenSpace.Map('map');
  var lonlat = new OpenLayers.LonLat(-0.3879547119140625, 51.6934690476718);
  var gridProjection = new OpenSpace.GridProjection();
  var pos = gridProjection.getMapPointFromLonLat(lonlat);
  osMap.setCenter(pos, 8);

  var markers = new OpenLayers.Layer.Markers("Markers");
  osMap.addLayer(markers);

  var marker;
  marker = new OpenLayers.Marker(pos);
  markers.addMarker(marker);
}

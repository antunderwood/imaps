// JQtouch
var jQT = new $.jQTouch({
    icon: 'jqtouch.png',
    addGlossToIcon: false,
    startupScreen: 'jqt_startup.png',
    statusBar: 'black'
});
//Map
var osMap;
function init_map()
{
  osMap = new OpenSpace.Map('map');
  var lonlat = new OpenLayers.LonLat(-0.0007510185241699219, 51.47718666743929);
  var gridProjection = new OpenSpace.GridProjection();
  var pos = gridProjection.getMapPointFromLonLat(lonlat);
  osMap.setCenter(pos, 8);
}
//Location
function check_location(){
     function setDisplay(text) {
         $('.info').empty().append(text)
     }
     
     // We pass "updateLocation" a callback function,
     // to run once we have the coordinates.
     // We also set it to a variable, so we can know
     // right away if it's working or not
     var coords;
     var lookup = jQT.updateLocation(function(coords){
         
         if (coords) {
             setDisplay('setting map to current location');
             var lonlat = new OpenLayers.LonLat(coords.longitude, coords.latitude);
             var gridProjection = new OpenSpace.GridProjection();
             var pos = gridProjection.getMapPointFromLonLat(lonlat);
             osMap.setCenter(pos, 8);
             
             var markers = new OpenLayers.Layer.Markers("Markers");
             osMap.addLayer(markers);

             var marker;
             marker = new OpenLayers.Marker(pos);
             markers.addMarker(marker);
             $('.info').fadeOut(3000);
             
         } else {
             setDisplay('Device not capable of geo-location.');
             $('.info').fadeOut('slow');
         }
     });

     if (lookup) {
         setDisplay('Looking up location&hellip;');
         //if (TARGET_IPHONE_SIMULATOR){
         //  setDisplay('simulator');
         //}
     }
 }

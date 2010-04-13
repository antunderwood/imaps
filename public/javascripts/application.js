// JQtouch
var jQT = new $.jQTouch({
  icon: 'jqtouch.png',
  addGlossToIcon: false,
  startupScreen: 'jqt_startup.png',
  statusBar: 'black'
});
//Map
var osMap;
var openStreetMap;
var openCycleMap;
var coords;
var gridProjection;
var postcodeService;
var geocoder;
$(document).ready(function() {
  gridProjection = new OpenSpace.GridProjection();
  postcodeService = new OpenSpace.Postcode();
  geocoder = new google.maps.Geocoder();
  update_location();
  $('#osmap_pane').bind('pageAnimationEnd', function(event, info){
    if (info.direction == 'in'){
      if (! $("#osmap_OpenLayers_ViewPort").length){ // if os map not already initialised
        init_osmap();
      }
      centre_map_and_add_marker(coords, 'osmap');
      $('.info').fadeOut(6000);
    }
  });
  $('#open_streetmap_pane').bind('pageAnimationEnd', function(event, info){
    if (info.direction == 'in'){
      if (! $("#open_streetmap_OpenLayers_ViewPort").length){ // if os map not already initialised
        init_open_streetmap();
      }
      centre_map_and_add_marker(coords, 'open_streetmap');
      $('.info').fadeOut(6000);
    }
  });
  $('#open_cyclemap_pane').bind('pageAnimationEnd', function(event, info){
    if (info.direction == 'in'){
      if (! $("#open_cyclemap_OpenLayers_ViewPort").length){ // if os map not already initialised
        init_open_cyclemap();
      }
      centre_map_and_add_marker(coords, 'open_cyclemap');
      $('.info').fadeOut(6000);
    }
  });
  $('#search_pane').bind('pageAnimationStart', function(event, info){
    if (info.direction == 'in'){
      $('.info').hide();
    }
  });
});
function init_osmap()
{
  osMap = new OpenSpace.Map('osmap');
  var lonlat = new OpenLayers.LonLat(-0.0007510185241699219, 51.47718666743929);
  gridProjection = new OpenSpace.GridProjection();
  var pos = gridProjection.getMapPointFromLonLat(lonlat);
  osMap.setCenter(pos, 8);
}
function init_open_streetmap()
{
  openStreetMap = new OpenLayers.Map ("open_streetmap", {
    controls:[
    new OpenLayers.Control.Navigation(),
    new OpenLayers.Control.PanZoomBar(),
    new OpenLayers.Control.Attribution()],
    numZoomLevels: 19,
    units: 'm',
    projection: new OpenLayers.Projection("EPSG:900913"),
    displayProjection: new OpenLayers.Projection("EPSG:4326")
  } );
  layerStreetMap = new OpenLayers.Layer.OSM.Osmarender("Osmarender");
  openStreetMap.addLayer(layerStreetMap);
  if( ! openStreetMap.getCenter() ){
    var lonlat = new OpenLayers.LonLat(-0.0007510185241699219, 51.47718666743929).transform(new OpenLayers.Projection("EPSG:4326"), openStreetMap.getProjectionObject());
    openStreetMap.setCenter (lonlat, 15);
  }
}
function init_open_cyclemap()
{
  openCycleMap = new OpenLayers.Map ("open_cyclemap", {
    controls:[
    new OpenLayers.Control.Navigation(),
    new OpenLayers.Control.PanZoomBar(),
    new OpenLayers.Control.Attribution()],
    numZoomLevels: 19,
    units: 'm',
    projection: new OpenLayers.Projection("EPSG:900913"),
    displayProjection: new OpenLayers.Projection("EPSG:4326")
  } );
  layerCycleMap = new OpenLayers.Layer.OSM.CycleMap("CycleMap");
  openCycleMap.addLayer(layerCycleMap);
  if( ! openCycleMap.getCenter() ){
    var lonlat = new OpenLayers.LonLat(-0.0007510185241699219, 51.47718666743929).transform(new OpenLayers.Projection("EPSG:4326"), openCycleMap.getProjectionObject());
    openCycleMap.setCenter (lonlat, 15);
  }
}
//Location
function centre_map_and_add_marker(coords, map_type){
  if (map_type == 'osmap'){
    var lonlat = new OpenLayers.LonLat(coords.longitude, coords.latitude);
    var pos = gridProjection.getMapPointFromLonLat(lonlat);
    osMap.setCenter(pos, 8);

    var markers = new OpenLayers.Layer.Markers("Markers");
    osMap.addLayer(markers);
    
    var size = new OpenLayers.Size(33,45);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('../images/marker_red.png', size, offset);
    
    var marker;
    marker = new OpenLayers.Marker(pos, icon);
    markers.addMarker(marker);
  } else if (map_type == 'open_streetmap' || map_type == 'open_cyclemap'){
    if (map_type == 'open_streetmap'){
      var lonlat = new OpenLayers.LonLat(coords.longitude, coords.latitude).transform(new OpenLayers.Projection("EPSG:4326"), openStreetMap.getProjectionObject());
    } else if (map_type == 'open_cyclemap'){
      var lonlat = new OpenLayers.LonLat(coords.longitude, coords.latitude).transform(new OpenLayers.Projection("EPSG:4326"), openCycleMap.getProjectionObject());
    }

    layerMarkers = new OpenLayers.Layer.Markers("Markers");
    var size = new OpenLayers.Size(33,45);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('../images/marker_red.png', size, offset);
    layerMarkers.addMarker(new OpenLayers.Marker(lonlat, icon));

    if (map_type == 'open_streetmap'){
      openStreetMap.setCenter (lonlat, 15);
      openStreetMap.addLayer(layerMarkers);
    } else if (map_type == 'open_cyclemap'){
      openCycleMap.setCenter (lonlat, 15);
      openCycleMap.addLayer(layerMarkers);
    }
  }
}
function setDisplay(text) {
  $('.info').empty().append(text)
}
function update_location(){
  // We pass "updateLocation" a callback function,
  // to run once we have the coordinates.
  // We also set it to a variable, so we can know
  // right away if it's working or not
  var lookup = jQT.updateLocation(function(geolocation_coords){
    if (geolocation_coords) {
      coords = geolocation_coords
      setDisplay('setting map to current location');
    } else {
      coords = {longitude: -0.403597354888916 , latitude: 51.6591263146126}
      setDisplay('Device not capable of geo-location. Setting to Watford');
    }
  });
  if ($.browser.version == "531.21.10"){//iphone simulator
    coords = {longitude: -0.403597354888916 , latitude: 51.6591263146126}
  } else if (lookup){
    setDisplay('Looking up location&hellip;');
  }
}
function update_coords_after_search(longitude, latitude){
  $('#search_results').hide();
  setDisplay('Setting map to ' + $('#place').val());
  $('.info').fadeIn(2000);
  coords.longitude = longitude;
  coords.latitude = latitude;
}
function searchPostcode(postcode){
  postcodeService.getLonLat(postcode, onPostcodeResult);
  return false;
}
function onPostcodeResult(mapPoint){
  if (isNaN(mapPoint.getEasting()) || isNaN(mapPoint.getNorthing())){
    alert("Could not find a location for the postcode " + $('#postcode').val());
  } else {
    lonlat = gridProjection.getLonLatFromMapPoint(mapPoint);
    coords.longitude = lonlat.lon;
    coords.latitude = lonlat.lat;
    setDisplay('Setting map to ' + $('#postcode').val());
    $('.info').fadeIn(2000);
  }
}

function searchPlace(address)
{
  if (geocoder) {
    geocoder.geocode( { 'address': address + " United Kingdom"}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results.length == 1){
          var lonlat = results[0].geometry.location;
          coords.longitude = lonlat.lng();
          coords.latitude = lonlat.lat();
          setDisplay('Setting map to ' + $('#place').val());
          $('.info').fadeIn(2000);
        } else {
          var choices = new Array();
          for (var i=0; i < results.length; i++){
            // Extract result fields
            var address_components = results[i].address_components;
            var locality = "";
            var county = "";
            var country = "";
            for (var j=0; j < address_components.length; j++){
              if (address_components[j].types[0].match(/locality/)){
                locality = address_components[j].short_name;
              } else if (address_components[j].types[0].match(/administrative_area_level_2/)){
                county = address_components[j].short_name;
              }else if (address_components[j].types[0].match(/country/)){
                country = address_components[j].short_name;
              }
            }
            var name = "";
            if (locality != ""){
              name = name + locality + ", ";
            }
            if (county != ""){
              name = name + county + ", ";
            }
            if (country != "undefined"){
              name = name + country;
            }
            var location  = results[i].geometry.location
            choices.push({'name': name, 'longitude': location.lng(), 'latitude': location.lat() });
          }
          $('#search_results').show();
          search_results_text = $.map(choices, function(c){return "<li><span onclick='update_coords_after_search(" + c.longitude + "," + c.latitude + ")'>" + c.name + "</span></li>"}).join('');
          $('#search_results').html("<h1>Pick location</h1>" + search_results_text);
        }
      } else {
        alert("Could not find a location for the place " + $('#place').val());
      }
    });
  }
}

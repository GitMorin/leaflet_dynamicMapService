
var map = new L.Map('map').setView([ 41.774469, -88.150322 ], 14);

alert('from asset.js')

var layerControl = L.control.layers(null, null);
layerControl.addTo(map);

  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  	maxZoom: 19,
  	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  })
  .addTo(map);
  
  var overlays = {};
  // call service to check what layers exist
  
  let url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Water_Network/MapServer";
  //let url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Energy/Infrastructure/MapServer";
  let serviceUrl = url+'?f=pjson';
  //fetch('http://example.com/movies.json')
  fetch(serviceUrl, {method:"get"})
  .then(function(response) {
    return response.json();
  })
  .then(function(esriService) {
    console.log(esriService);
    esriService.layers.forEach(function(layer) {
      let layerName = layer.name.replace(/\s/g, "");
      let fullName = layer.name // return string
      //console.log(layerName)
      layerName = L.esri.dynamicMapLayer({
        url: url,
        layers: [layer.id]
      }).addTo(map);
      layerControl.addOverlay(layerName, fullName)
    })
  });

var service = L.esri.dynamicMapLayer({
    url: url,
    opacity: 0.7
  });

  var identifiedFeature;
  var pane = document.getElementById('feature-info-table');

  map.on('zoomend', function() {
    if (identifiedFeature){
      map.removeLayer(identifiedFeature);
    }
  });

  map.on('click', function (e) {
    // abstract identity function
    console.log(e)
    pane.innerHTML = 'Loading';
    if (identifiedFeature){
      map.removeLayer(identifiedFeature);
      console.log('has layer');
    }
    getFeatureInfo(e)
  });

function populateTable(data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      const markup = `
        <tr>
          <th>${key}</th>
          <td>${data[key]}</td>
        </tr>`
      pane.innerHTML += markup
    }
  }
};

function getFeatureInfo(e) {
  service.identify().on(map).at(e.latlng).run(function(error, featureCollection){
      // make sure at least one feature was identified.
      if (featureCollection.features.length > 0) {
        identifiedFeature = L.geoJSON(featureCollection.features[0], {
          style: {"color": "red"},
        }).addTo(map);
        pane.innerHTML = "<h4>Feature description</h4>";
        let keyValue = featureCollection.features[0].properties
        populateTable(keyValue);
      }
      else {
        pane.innerHTML = 'No features identified.';
      }
    });
}

// TODO: Add legend
// Revert the order the layers are added to the map to make sure points in on top
// Get feature info only for visible layers
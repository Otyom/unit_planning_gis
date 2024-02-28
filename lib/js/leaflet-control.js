
var map = L.map('map').setView([38.919817920096236, 35.37501399857139], 6);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
   
}).addTo(map);

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	
});

// var ilcelayer = L.geoJson(ilce,{
// style: {
//     color: "blue",
//     fillColor: "white",
//     fillOpacity: "0.8",
// },


// onEachFeature: function(feature, layer){
//     layer.bindPopup("ILCEADI: " + feature.properties.ILCEAD);
// },

// }).addTo(map);

var baseMaps = {
    
    
};

var overlaymap = {
    
    'Türkiye Topoloji': topo,
    'OSM': osm,
};

L.control.layers(baseMaps, overlaymap, {collapsed: false}).addTo(map);


//layer on/off checkbox 
$(".layer-card-cb").on("change", function () {
if ($(this).is(":checked")) {
    console.log("inside checked");
    ilcelayer.addTo(map);
}  else {
    map.removeLayer(ilcelayer);
        console.log("outside checked");
    }
});


//opacity control
$(".opacity").on("change", function (){
var val = $(this).val();
var opacity = val / 100;
console.log(val);

ilcelayer.setStyle({fillOpacity: opacity, opacity: opacity});
});



// var wmsLayer = L.tileLayer
// .wms('http://localhost:8080/geoserver/wms?', {
//     layers: 'b:ilcealan',
//     transparent: true,
//     format: "image/png",
// }).addTo(map);


function handleLayer(LayerName) {
    var layer = L.tileLayer.betterWms('http://localhost:8080/geoserver/wms?', {
        layers: LayerName,
        transparent: true,
        format: "image/png",
        zIndex: 1000,
     })

     return layer;

}

// handleLayer("c:ilce_nokta").addTo(map);
// handleLayer("c:il").addTo(map);
// handleLayer("b:ilcealan").addTo(map);

layersFromGeoserver.map((layer) => {
    $(".left-sidebar").append(
      layerCardGenerator(
        layer.layerTitle,
        layer.layerName,
        layer.defaultCheck,
        layer.thumbnailUrl,
        layer.description
      )
    );
  });



  //default layer on switch
  layersFromGeoserver.map((layer) => {
    if (layer.defaultCheck === "checked") {
        console.log(layer);
        handleLayer(layer.layerName).addTo(map);
        $('.legend').append(wmsLegendControl(layer.layerName, layer.layerTitle));
    }
  })

  // layer on/off switch
$(".layer-card-cb").on("change", function () {
    var layerName = $(this).attr("id");
    var layerTitle = $(this).attr("name");

    console.log({ layerName, layerTitle});


    if ($(this).is(":checked")){
       window[layerName] = handleLayer(layerName).addTo(map);

$(".legend").append(wmsLegendControl(layerName, layerTitle));

    } else {
        map.eachLayer(function (layer) {
            if (layer.options.layers === layerName) {
                map.removeLayer(layer);
            } 
            console.log(layerName);
            
        });
        var className = layerName.split(":")[1];
        $(`.legend .${className}`).remove();
    }
});


//layer opacity controller
$(".opacity").on("change", function () {
    var layerName=$(this).attr("code");

    var opacity = $(this).val()/100;

    console.log(layerName, opacity);

    map.eachLayer(function (layer) {
        if (layer.options.layers === layerName) {
            layer.setOpacity(opacity);
        }        
    })

   
});


//legend control function
function wmsLegendControl(layerName, layerTitle) {
    var className = layerName.split(":")[1];
    
    var url = `http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=${layerName}`;
    var legend = `<p class=${className} style= 'margion-top:10px; font-weight: bold'>${layerTitle}</p>`;
    legend += `<p><img class=${className} src=${url} /><br class=${className} /> </p>`;
   
    return legend;
   
}



//mouse cordinate
map.on("mousemove", function (e) {
    $(".map-coordinate").html(`enlem: ${e.latlng.lat}, boylam: ${e.latlng.lng}`);
   
});

// map scale
L.control.scale().addTo(map);


map.attributionControl.setPrefix(map.nesne);

// default map view
$(".default-view").on("click", function () {
    map.setView([39.317300373271024, 34.03564453125001], 6);

});

// view map full browser
function fullScreenToggler(){
 var doc = document,
  elm = document.getElementById("map");

 if (elm.requestFullscreen) {
    !doc.fullscreenElement ? elm.requestFullscreen() : doc.exitFullscreen();

 }else if (elm.mozRequestFullscreen) {
    !doc.fullscreenElement ? elm.mozRequestFullscreen() : doc.mozCancelFullscreen();
 }else if (elm.msRequestFullscreen) {
    !doc.fullscreenElement 
    ? elm.msRrequestFullscreen() 
    : doc.msexitFullscreen();

 }else if (elm.webkitRequestFullscreen) {
    !doc.fullscreenElement 
    ? elm.webkitRequestFullscreen() 
    : doc.ewebkitCancelFullscreen();

 }else{
    console.log("Fullscreen support not detected.");
 }
}
$(".full-screen").click(fullScreenToggler);

L.control.L.BrowserPrint.Mode.Landscape.addTo(map);

$(".print-map").click( function () {
    var printMode = L.BrowserPrint.Mode.Landscape();
    map.printControl.print(printMode);
});

$(".leaflet-control-browser-print").css({
    display: "none",
});


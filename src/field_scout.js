var map = L.map('map', {
			center: [45.25, -73.6159],
			zoom: 12,
});
var config = {
	share_id: "25cd48ad09afb313",  // Edit this
	popup_properties: ["Sommaire météo", "Date", "Heure", "Champ", "Varieté(s):", "Majorité", "Moyenne densité", "Moyenne % de plants porteurs", "Remarques:", "Photos"],  // Optional - An array of properties to show in a Leaflet popup
	popup_dens : ["Emplacement", "Densité", "Remarques:"]
	};

function photoGallery(photos) {
	var photoArray = [];
	$.each(photos.split(","), function(index, photo) {
		photoArray.push({href: "https://web.fulcrumapp.com/shares/" + config.share_id + "/photos/" + photo});
	});
	$.fancybox(photoArray, {
		"type": "image",
		"showNavArrows": true,
		"padding": 0,
		"scrolling": "no",
		beforeShow: function () {
			this.title = "Photo " + (this.index + 1) + " of " + this.group.length + (this.title ? " - " + this.title : "");
		},
		helpers: {
			overlay: {
				css: {
					"overflow": "hidden"
				}
			}
		}
	});
	return false;
}
      /* Mapquest Basemap Layers */
	var basemaps = {
		Google: L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}')
	};
      /* Overlay Layers */
var rapports = L.geoJSON(null, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {
			title: feature.properties["Date"],
			riseOnHover: true
		});
	},
	onEachFeature: function (feature, layer) {
		if (config.popup_properties) {
			var props = feature.properties;
			var attributes = [];
			$.each(config.popup_properties, function (index, prop) {
				if (prop in props) {
					/* Photos */
					if (prop === "Photos") {
						if (props[prop]) {
							props[prop] = "<a href='#' onclick='photoGallery(\"" + props[prop] + "\"); return false;'>View Photos</a>";
						}
					}
					/* Handle potential other values */
					/* La la la la la */
					
					attributes.push("<strong>" + prop + "</strong>: " + props[prop]);
				}
			});
			layer.bindPopup(attributes.join("<br>"));
		}
	}
});

var densite = L.geoJSON(null, {
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
			title: feature.properties["Emplacement"],
			riseOnHover: true
		});
	},
	onEachFeature: function (feature, layer) {
		if (config.popup_dens) {
			var props = feature.properties;
			var attributes1 = [];
			$.each(config.popup_dens, function (index, prop) {
				if (prop in props) {
					/* Photos */
					if (prop === "Photos") {
						if (props[prop]) {
							props[prop] = "<a href='#' onclick='photoGallery(\"" + props[prop] + "\"); return false;'>View Photos</a>";
						}
					}
					/* Handle potential other values */
					/* La la la la la */
					
					attributes1.push("<strong>" + prop + "</strong>: " + props[prop]);
				}
			});
			layer.bindPopup(attributes1.join("<br>"));
		}
	}
});

$.getJSON("https://web.fulcrumapp.com/shares/" + config.share_id + ".geojson?human_friendly=true&skip_system_columns=true&callback=?", function (data) {
	rapports.addData(data);
});/*.complete(function () {
	map.fitBounds(rapports.getBounds());
})*/
$.getJSON("https://web.fulcrumapp.com/shares/" + config.share_id + ".geojson?child=test_de_densit&human_friendly=true&skip_system_columns=true&callback=?", function (data) {
	densite.addData(data);
});

      var overlays = {
        "Rapports": rapports,
		"Pointe Control" : densite
      };
	  L.control.layers(basemaps, overlays).addTo(map);
	  
		overlays.Rapports.addTo(map);
		basemaps.Google.addTo(map);
		
      /* Larger screens get expanded layer control */
      if (document.body.clientWidth <= 767) {
        var isCollapsed = true;
      } else {
        var isCollapsed = false;
      }
/*      var layerControl = L.control.layers(baseLayers, overlays, {
        collapsed: isCollapsed
      }).addTo(map); */
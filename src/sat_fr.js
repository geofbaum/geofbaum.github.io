		var currentTime = new Date();
		currentTime.setUTCMinutes(0, 0, 0);
		
		var map = L.map("map", {
			center: [43.8, -77.8],
			zoom: 7,
			timeDimension: true,
			timeDimensionControl: true,
			timeDimensionOptions: {
				timeInterval: "PT3H/" + currentTime.toISOString(),
				period: "PT15M",
				currentTime: currentTime.getTime(),
			},
			timeDimensionControlOptions: {
				autoPlay: false,
				loopButton: true,
				playReverseButton: true,
				playerOptions: {
					buffer: 10,
					transitionTime: 250,
				},
				timeZones: ['Local'],				
			},
			
		});
		var basemaps = {
			Google: L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}')
		};

		var wmsUrl = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WMSServer?"
		var swir = L.nonTiledLayer.wms(wmsUrl, {
			layers: '13',
			format: 'image/png',
			transparent: true,
			opactiy: 0.3,
			//crs: L.CRS.EPSG4326,
			attribution: 'NOAA NowCOAST'
		});
		
		var lwir = L.nonTiledLayer.wms(wmsUrl, {
			layers: '17',
			format: 'image/png',
			transparent: true,
			opactiy: 0.3,
			//crs: L.CRS.EPSG4326,
			attribution: 'NOAA NowCOAST'
		});
		
		var wv = L.nonTiledLayer.wms(wmsUrl, {
			layers: '21',
			format: 'image/png',
			transparent: true,
			opactiy: 0.3,
			//crs: L.CRS.EPSG4326,
			attribution: 'NOAA NowCOAST'
		});
		
		var vis = L.nonTiledLayer.wms(wmsUrl, {
			layers: '25',
			format: 'image/png',
			transparent: true,
			opactiy: 0.3,
			//crs: L.CRS.EPSG4326,
			attribution: 'NOAA NowCOAST'
		});
		
		var proxy = './proxy.php';
		
		// Create and add a TimeDimension Layer to the map
		var tdswir = L.timeDimension.layer.wms(swir, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		var tdlwir = L.timeDimension.layer.wms(lwir, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		var tdwv = L.timeDimension.layer.wms(wv, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		var tdvis = L.timeDimension.layer.wms(vis, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
	

		// add SWIR Legend
		var legend1 = L.control({position: 'bottomright'});
		legend1.onAdd = function(map) {
			var src1 = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=13"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src1 + '" alt="legend">';
			return div;
		};
		
		
		// add LWIR Legend
		var legend2 = L.control({position: 'bottomright'});
		legend2.onAdd = function(map) {
			var src2 = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=17"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src2 + '" alt="legend">';
			return div;
		};
		
		// add WV Legend
		var legend3 = L.control({position: 'bottomright'});
		legend3.onAdd = function(map) {
			var src3 = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=21"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src3 + '" alt="legend">';
			return div;
		};
		
		// add Vis Legend
		var legend4 = L.control({position: 'bottomright'});
		legend4.onAdd = function(map) {
			var src4 = "https://nowcoast.noaa.gov/arcgis/services/nowcoast/sat_meteo_imagery_time/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=25"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src4 + '" alt="legend">';
			return div;
		};
		
		//legend4.addTo(map);
		
		var goes = {
			'Infrarouge à ondes courtes': tdswir,
			'Infrarouge à ondes longes': tdlwir,
			"Vapeur d'eau": tdwv,
			'Visible': tdvis
		};
		
		L.control.layers(basemaps, goes).addTo(map);
		
		//goes.Shortwave Infrared.addTo(map);
		basemaps.Google.addTo(map);
		
		// Remove Legends
		map.on('overlayremove', function (eventLayer) {
			if (eventLayer.name === 'Infrarouge à ondes courtes') {
				this.removeControl(legend1);
			} else if (eventLayer.name === 'Infrarouge à ondes longes') {
				this.removeControl(legend2);
			} else if (eventLayer.name === "Vapeur d'eau") {
				this.removeControl(legend3);
			} else {
				this.removeControl(legend4);
			}
		});
		map.on('overlayadd', function (eventLayer) {
		// Add Legends
			if (eventLayer.name === 'Infrarouge à ondes courtes') {
				legend1.addTo(this);
			} else if (eventLayer.name === 'Infrarouge à ondes longes') { 
				legend2.addTo(this);
			} else if (eventLayer.name === "Vapeur d'eau") {
				legend3.addTo(this);
			} else {
				legend4.addTo(this);
			}
		});

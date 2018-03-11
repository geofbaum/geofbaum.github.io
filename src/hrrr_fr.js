		var currentTime = new Date();
		currentTime.setUTCMinutes(0, 0, 0);
		var endDate = new Date(currentTime.getTime());
		L.TimeDimension.Util.addTimeDuration(endDate, "PT18H", true);
	
		var map = L.map('map', {
			center: [45.25, -73.6159],
			zoom: 9,
			timeDimension: true,
			timeDimensionControl: true,
			timeDimensionOptions: {
				//times: "PT8H/"+"P2D/"+"PT1H"
				timeInterval: currentTime.toISOString() + "/PT18H",
				period: "PT1H",
				currentTime: currentTime.getTime(),
			},
			timeDimensionControlOptions: {
				styleNS: "leaflet-control-timecontrol",
				position: "bottomleft",
				autoPlay: false,
				loopButton: true,
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
		
		var temperatureLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'Temperature_height_above_ground',
			transparent: true,
			opacity: '0.75',
			format: 'image/png',
			styles: 'boxfill/ferret'
			});
			
		var dewpointLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'Dewpoint_temperature_height_above_ground',
			opacity: '0.5',
			styles: 'boxfill/alg2'
			});
		
		var windLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'wind @ Specified height level above ground',
			transparent: true,
			format: 'image/png',
			styles: 'fancyvec/rainbow'
			});
		
		var precipLayer = L.tileLayer.wms('http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?', {
			layers: 'Total_precipitation_surface_1_Hour_Accumulation',
			opacity: '0.75',
			format: 'image/png',
			styles: 'boxfill/ferret'
			});
			
		var proxy = 'proxy.php';
			
		var tdTemp = L.timeDimension.layer.wms(temperatureLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		var tdDew = L.timeDimension.layer.wms(dewpointLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		var tdWind = L.timeDimension.layer.wms(windLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		var tdPrecip = L.timeDimension.layer.wms(precipLayer, {
			wmsVersion: "1.3.0",
			proxy: proxy,
		});
		
		// add Temp Legend
		var legend1 = L.control({position: 'bottomright'});
		legend1.onAdd = function(map) {
			var src1 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=Temperature_height_above_ground&PALETTE=ferret"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src1 + '" alt="legend">';
			return div;
		};
		
		// add Dewpoint Legend
		var legend2 = L.control({position: 'bottomright'});
		legend2.onAdd = function(map) {
			var src2 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=Dewpoint_temperature_height_above_ground&PALETTE=alg2"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src2 + '" alt="legend">';
			return div;
		};
		
		// add Wind Legend
		var legend3 = L.control({position: 'bottomright'});
		legend3.onAdd = function(map) {
			var src3 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=wind @ Specified height level above ground&PALETTE=rainbow"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src3 + '" alt="legend">';
			return div;
		};
		
		// add Precip Legend
		var legend4 = L.control({position: 'bottomright'});
		legend4.onAdd = function(map) {
			var src4 = "http://thredds-jetstream.unidata.ucar.edu/thredds/wms/grib/NCEP/HRRR/CONUS_2p5km/Best?REQUEST=GetLegendGraphic&LAYER=Total_precipitation_surface_1_Hour_Accumulation&PALETTE=ferret"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src4 + '" alt="legend">';
			return div;
		};
		
		legend1.addTo(map);
		
		var hrrr = {
			'Température': tdTemp,
			
			'Point de rosée': tdDew,
			
			'Flèches de vent': tdWind,
			
			'Quantité de précipitations': tdPrecip

			};

		L.control.layers(basemaps, hrrr).addTo(map);
		
		hrrr.Température.addTo(map);
		basemaps.Google.addTo(map);
		
		// Remove Legends
		map.on('overlayremove', function (eventLayer) {
			if (eventLayer.name === 'Température') {
				this.removeControl(legend1);
			} else if (eventLayer.name === 'Point de rosée') {
				this.removeControl(legend2);
			} else if (eventLayer.name === 'Flèches de vent') {
				this.removeControl(legend3);
			} else {
				this.removeControl(legend4);
			}
		});
		map.on('overlayadd', function (eventLayer) {
		// Add Legends
			if (eventLayer.name === 'Température') {
				legend1.addTo(this);
			} else if (eventLayer.name === 'Point de rosée') { 
				legend2.addTo(this);
			} else if (eventLayer.name === 'Flèches de vent') {
				legend3.addTo(this);
			} else {
				legend4.addTo(this);
			}
		});

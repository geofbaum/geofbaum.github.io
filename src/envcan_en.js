		var currentTime = new Date();
		currentTime.setUTCMinutes(0, 0, 0);
		var endDate = new Date(currentTime.getTime());
		L.TimeDimension.Util.addTimeDuration(endDate, "P1D", true);
	
		var map = L.map('map', {
			center: [45.25, -73.6159],
			zoom: 9,
			timeDimension: true,
			timeDimensionControl: true,
			timeDimensionOptions: {
				//timeInterval: currentTime.toISOString() + "/P1D",
				//period: "PT1H",
				//currentTime: currentTime.getTime(),
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

		
		var temperatureLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities', {
			layers: 'HRDPS.CONTINENTAL_TT',
			opacity: '0.5',
			attribution: '<a href="http://dd.weatheroffice.gc.ca/doc/LICENCE_GENERAL.txt">Data Source: Environment and Climate Change Canada</a>'
			});

		var windLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities', {
			layers: 'HRDPS.CONTINENTAL_UU',
			//opacity: '0.9',
			transparent: true,
			format: 'image/png',
			attribution: '<a href="http://dd.weatheroffice.gc.ca/doc/LICENCE_GENERAL.txt">Data Source: Environment and Climate Change Canada</a>'
			});
			
		var precipLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities', {
			layers: 'HRDPS.CONTINENTAL_PR',
			opacity: '0.6',
			transparent: true,
			format: 'image/png',
			attribution: '<a href="http://dd.weatheroffice.gc.ca/doc/LICENCE_GENERAL.txt">Data Source: Environment and Climate Change Canada</a>'
			});
			
		var dewpointLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities', {
			layers: 'HRDPS.CONTINENTAL_TD',
			opacity: '0.75',
			transparent: true,
			format: 'image/png',
			attribution: '<a href="http://dd.weatheroffice.gc.ca/doc/LICENCE_GENERAL.txt">Data Source: Environment and Climate Change Canada</a>'
			});
			
		var radarLayer = L.tileLayer.wms('http://geo.weather.gc.ca/geomet/?lang=E&service=WMS&request=GetCapabilities', {
			layers: 'RADAR_RDBS',
			transparent: true,
			format: 'image/png'
			});
			
		var markers = [{
			name: 'Mas',
			position: [45.177046, -73.614294],
		}, {
			name: 'Leclair',
			position: [45.149207, -73.622507]
		}, {
			name: 'JML',
			position: [45.197038, -73.639380],
		}, {
			name: 'Village',
			position: [45.236798, -73.574530]
		}, {
			name: 'Hamelin',
			position: [45.230818, -73.55349],
		}];	

	    //var proxy = 'proxy.php';
		
		var hrrrTemperatureTimeLayer = L.timeDimension.layer.wms.timeseries(temperatureLayer, {
			//proxy: proxy,
			updateTimeDimension: true,
			//updateTimeDimensionMode: "replace",
			//requestTimeFromCapabilities: true,
			markers: markers,
			name: "Surface Temperature",
			units: "\xBA C"//,
			//enableNewMarkers: true
		}); 
			
		var tdTemp = L.timeDimension.layer.wms(temperatureLayer, {
			wmsVersion: "1.3.0",
			//proxy: proxy,
			markers: markers,
			name: "Surface Temperature",
			//units: "\xBA C",			
		});
		
		var tdDew = L.timeDimension.layer.wms(dewpointLayer, {
			wmsVersion: "1.3.0",
			//proxy: proxy,
		});
		
		var tdWind = L.timeDimension.layer.wms(windLayer, {
			wmsVersion: "1.3.0",
			//proxy: proxy,
		});
		
		var tdPrecip = L.timeDimension.layer.wms(precipLayer, {
			wmsVersion: "1.3.0",
			//proxy: proxy,
		});
		
		
		// add Temp Legend
		var legend1 = L.control({position: 'bottomright'});
		legend1.onAdd = function(map) {
			var src1 = "http://geo.weather.gc.ca/geomet?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=HRDPS.CONTINENTAL_TT&format=image/png&STYLE=TEMPSUMMER"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src1 + '" alt="legend">';
			return div;
		};
		
		
		// add Wind Legend
		var legend2 = L.control({position: 'bottomright'});
		legend2.onAdd = function(map) {
			var src2 = "http://geo.weather.gc.ca/geomet?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=HRDPS.CONTINENTAL_UU&format=image/png&STYLE=WINDARROWKMH"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src2 + '" alt="legend">';
			return div;
		};
		
		// add dewpoint Legend
		var legend3 = L.control({position: 'bottomright'});
		legend3.onAdd = function(map) {
			var src3 = "http://geo.weather.gc.ca/geomet?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=HRDPS.CONTINENTAL_TD&format=image/png&STYLE=DEWPOINT"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src3 + '" alt="legend">';
			return div;
		};
		
		// add Precip Legend
		var legend4 = L.control({position: 'bottomright'});
		legend4.onAdd = function(map) {
			var src4 = "http://geo.weather.gc.ca/geomet?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=HRDPS.CONTINENTAL_PR&format=image/png&STYLE=PRECIPMM"
			var div = L.DomUtil.create('div', 'info legend');
			div.innerHTML +=
				'<img src="' + src4 + '" alt="legend">';
			return div;
		};
		
		legend1.addTo(map);
		
		var envcan = {
			'Temperature': tdTemp,
			'Dewpoint': tdDew,
			'Cumulative Precipitation (mm)': tdPrecip,
			'Windspeed Arrows in km/h': tdWind,
		};
			
		L.control.layers(basemaps, envcan).addTo(map);
		
		envcan.Temperature.addTo(map);
		basemaps.Google.addTo(map);

		// Remove Legends
		map.on('overlayremove', function (eventLayer) {
			if (eventLayer.name === 'Temperature') {
				this.removeControl(legend1);
			} else if (eventLayer.name === 'Dewpoint') {
				this.removeControl(legend3);
			} else if (eventLayer.name === 'Windspeed Arrows in km/h') {
				this.removeControl(legend2);
			} else {
				this.removeControl(legend4);
			}
		});
		map.on('overlayadd', function (eventLayer) {
		// Add Legends
			if (eventLayer.name === 'Temperature') {
				legend1.addTo(this);
			} else if (eventLayer.name === 'Dewpoint') { 
				legend3.addTo(this);
			} else if (eventLayer.name === 'Windspeed Arrows in km/h') {
				legend2.addTo(this);
			} else {
				legend4.addTo(this);
			}
		});
		
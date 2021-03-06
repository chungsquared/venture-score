$(document).ready(function(){
	//calls initialize to render map on page load
	initialize();

	/***************** autocomplete feature for location search ******************/
	var current_location;
	var input = document.getElementById('pac-input'); //$('#pac-input').val()
	autocomplete = new google.maps.places.Autocomplete(input)
	autocomplete.bindTo('bounds', map);
	infowindow = new google.maps.InfoWindow();
	marker = new google.maps.Marker({
		map: map,
		draggable: false,
		anchorPoint: new google.maps.Point(0, -29)
	});

	autocomplete.addListener('place_changed', function() {
		infowindow.close();
		marker.setVisible(false);
		var place = autocomplete.getPlace();
		var latitude = place.geometry.location.lat()
		var longitude = place.geometry.location.lng()

		current_location = place.geometry.location
		console.log(current_location)
	    if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
	    }
	    // If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(13);  // Why 13? Because it looks good.
		}
		marker.setIcon(/** @type {google.maps.Icon} */({
			url: "assets/home.png", 
			// origin: new google.maps.Point(0, 0),
			// anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(20, 20)
		}));
	    marker.setPosition(place.geometry.location);
	    marker.setVisible(true);
	    var address = '';
	    if (place.address_components) {
	      address = [
	        (place.address_components[0] && place.address_components[0].short_name || ''),
	        (place.address_components[1] && place.address_components[1].short_name || ''),
	        (place.address_components[2] && place.address_components[2].short_name || '')
	      ].join(' ');
	    }
		// infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address + '<br>' + '<strong>' +  "Latitude: " + '</strong>' + latitude + '<strong>' +  "  Longitude:  " + '</strong>' +longitude)
	 //    infowindow.open(map, marker);
	})
	/**************** Autocomplete feature end ******************/

	/**************** Initiates algorithm ******************/
	$(  "#interest" ).on("click",function(){
		//Check if user entered a location first
		if(current_location){
			//grabs rankings of each category
			var ranking = create_search_array();
			//sends each category to be searched
			getResults(ranking,current_location);
			// infowindow.open(map, marker);
		}else{
			alert("Please enter a location first!")
		}

	});

});


/* Declare variables for google map objects */
var map;
var service;
var geocorder;
var matrix;
var marker;
var autocomplete;
var infowindow

//initializes map
function initialize(){
	var mapOptions = {
		center: {lat: 40.524, lng: -97.884},
		zoom: 4,
		scrollwheel: false,
		icon: "assets/home.png"
	}
	//Creating instances of various Map objects
	map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions)
	service = new google.maps.places.PlacesService(map);
	geocoder = new google.maps.Geocoder();
	matrix = new google.maps.DistanceMatrixService();

	//map style settings
	map.set('styles', [{
        "stylers": [
            {"hue": "#ff1a00"},
            {"invert_lightness": true},
            {"saturation": -100},
            {"lightness": 33},
            {"gamma": 0.5}
	    ]},
	    {
	        "featureType": "water",
	        "elementType": "geometry",
	        "stylers": [{"color": "#2D333C"}]
	    }
	]);
}





	// //filters results for the nearbySearch
	// function filter(results,callback){
	// 	if(results.distance<=10000){
	// 		return results;
	// 	}
	// }





	// function category_graph(totals){
	// 	var data_obj = {
	//         chart: {
	//             type: 'column'
	//         },
	//         title: {
	//             text: 'Category Breakdown'
	//         },
	 
	//         xAxis: {
	//             // categories: [],
	//             crosshair: true
	//         },
	//         yAxis: {
	//             min: 0,
	//             title: {
	//                 text: 'Score'
	//             }
	//         },
	//         tooltip: {
	//             headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
	//             pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
	//                 '<td style="padding:0"><b>{point.y:.1f} points</b></td></tr>',
	//             footerFormat: '</table>',
	//             shared: true,
	//             useHTML: true
	//         },
	//         plotOptions: {
	//             column: {
	//                 pointPadding: 0.2,
	//                 borderWidth: 0
	//             }
	//         },
	//         series: []
	//     }
	//     for(category in totals){
	//     	data_obj.series.push({
	//     		name: category,
	//     		data: [totals[category][0]]
	//     	});
	//     	// data_obj.xAxis["categories"].push(category)
	//     };
	// 	$(function () {
	// 	    $('#container').highcharts(data_obj);
	// 	});
	// }

	// function getExperiences(lng, lat) {
	//     markers = [];

	// 	$.ajax({
	// 	  url: '/xola',
	// 	  data: {lng: lng, lat: lat},
	// 	  success: function(experiences) {
		  	
	// 	    for (var i = 0; i < experiences.data.length; i++) {
	// 	      var experience = experiences.data[i]
	// 	      var latlng = new google.maps.LatLng(experience.geo.lat, experience.geo.lng);

	// 	      var pin = new google.maps.Marker({
	// 	        map: map,
	// 	        icon: "http://s23.postimg.org/ggk8xl1o7/pin.png",
	// 	        position: latlng,
	// 	        draggable: false,
	// 	        animation: google.maps.Animation.DROP
	// 	      });

	// 	      markers.push(pin);
	// 	    }
	// 	  }
	// 	});
	// }

	// function distanceVal(distance){
	// 	var value = 0
	// 	if (distance < 482){
	// 		value = 5
	// 	}
	// 	else if (distance < 1209){
	// 		value = 4.5
	// 	}
	// 	else if (distance < 1814){
	// 		value = 4
	// 	}
	// 	else if (distance < 2401){
	// 		value = 3.5
	// 	}
	// 	else{
	// 		value = 3
	// 	};
	
	// 	return value;	
	// }


	



	// function showScore(score){

	// 	console.log(score);
	// 	infowindow.open(map, marker);
	// 	infowindow.setContent("<div id='container-rpm'></div>")
	// 	infowindow.setContent(score)
		// var boxText = document.createElement("div");
  //       boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: black; padding: 5px;";
	 //    boxText.innerHTML = "<p>"+score+"</p>";

		// var myOptions = {
		// 	content: boxText,
		// 	disableAutoPan: false,
		// 	maxWidth: 0,
		// 	pixelOffset: new google.maps.Size(-140, 0),
		// 	zIndex: null,
		// 	boxStyle: { 
		// 	  // background: "url('tipbox.gif') no-repeat"
		// 	  opacity: 0.95,
		// 	  width: "100px",
		// 	  height:"100px",
		// 	  overflow:"scroll"
		// 	 },
		// 	closeBoxMargin: "0px 0px 0px 0px",
		// 	// closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
		// 	infoBoxClearance: new google.maps.Size(1, 1),
		// 	isHidden: false,
		// 	pane: "floatPane",
		// 	enableEventPropagation: false,
		// };

		// var ib = new InfoBox(myOptions);
		// ib.open(map, marker);
		

		 // The RPM gauge
	   //  $(function () {

		  //   var gaugeOptions = {

		  //       chart: {
		  //           type: 'solidgauge'
		  //       },

		  //       title: null,

		  //       pane: {
		  //           center: ['50%', '85%'],
		  //           size: '100%',
		  //           startAngle: -90,
		  //           endAngle: 90,
		  //           background: {
		  //               backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
		  //               innerRadius: '60%',
		  //               outerRadius: '100%',
		  //               shape: 'arc',
		  //               background: 'null'
		  //           }
		  //       },

		  //       tooltip: {
		  //           enabled: false
		  //       },

		  //       // the value axis55BF3B
		  //       yAxis: {
		  //           stops: [
		  //               [0.1, '#DF5353'], // green
		  //               [0.5, '#DDDF0D'], // yellow
		  //               [0.9, '#55BF3B'] // red
		  //           ],
		  //           lineWidth: 0,
		  //           minorTickInterval: null,
		  //           tickPixelInterval: 400,
		  //           tickWidth: 0,
		  //           title: {
		  //               y: -70
		  //           },
		  //           labels: {
		  //               y: 0
		  //           }
		  //       },

		  //       plotOptions: {
		  //           solidgauge: {
		  //               dataLabels: {
		  //                   y: 5,
		  //                   borderWidth: 0,
		  //                   useHTML: true,
		  //                   animation: false
		  //               }
		  //           }
		  //       }
		  //   };

		  //   // The speed gauge
		  //   $('#container-speed').highcharts(Highcharts.merge(gaugeOptions, {
		  //       yAxis: {
		  //           min: 0,
		  //           max: 200,
		  //           title: {
		  //               text: 'Speed'
		  //           }
		  //       },

		  //       credits: {
		  //           enabled: false
		  //       },

		  //       series: [{
		  //           name: 'Speed',
		  //           data: [80],
		  //           dataLabels: {
		  //               format: '<div style="text-align:center"><span style="font-size:25px;color:' +
		  //                   ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span><br/>' +
		  //                      '<span style="font-size:12px;color:silver">km/h</span></div>'
		  //           },
		  //           tooltip: {
		  //               valueSuffix: ' km/h'
		  //           }
		  //       }]

	   //  }));

	   //  // The RPM gauge
	   //  $('#container-rpm').highcharts(Highcharts.merge(gaugeOptions, {
	   //      yAxis: {
	   //          min: 0,
	   //          max: 100,
	   //          title: {
	   //              text: 'VentureScore'
	   //          }
	   //      },

	   //      series: [{
	   //          name: 'RPM',
	   //          data: [score],
	   //          dataLabels: {
	   //              format: '<div style="text-align:center"><span style="font-size:25px;color:' +
	   //                  ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
	   //                     '<span style="font-size:12px;color:silver">/100</span></div>'
	   //          },
	   //          tooltip: {
	   //              valueSuffix: ' revolutions/min'
	   //          }
	   //      }]

    // }));

    // Bring life to the dials
 //    setInterval(function () {
 //        // Speed
 //        var chart = $('#container-speed').highcharts(),
 //            point,
 //            newVal,
 //            inc;

 //        if (chart) {
 //            point = chart.series[0].points[0];
           
 //            newVal = point.y;

 //            if (newVal < 0 || newVal > 200) {
 //                newVal = point.y - inc;
 //            }

 //            point.update(newVal);
 //        }

 //        // RPM
 //        chart = $('#container-rpm').highcharts();
 //        if (chart) {
 //            point = chart.series[0].points[0];
           
 //            newVal = point.y;

 //            if (newVal < 0 || newVal > 5) {
 //                newVal = point.y;
 //            }

 //            point.update(newVal);
 //        }
 //    }, 2000);

	// })

// };



// //button to display hotel/lodging markers	
// $('#hotel').on('click',function(){
// 	console.log('we in')
// 	var search = {
// 		bounds: map.getBounds(),
// 		types:['lodging'],
// 	}
// 	// var sample = [{lat:37.792395,lng:-122.410504,type:"hotel"},{lat:37.7852279,lng:-122.40438899999998,type:"hotel"},{lat:37.787993,lng:-122.40194099999997,type:"bnb"},{lat:37.785628,lng:-122.41038500000002,type:"hotel"},{lat:37.7819923,lng:-122.4047607,type:"bnb"},{lat:37.787802,lng:-122.40881200000001,type:"bnb"},{lat:37.7925548,lng:-122.40079750000001,type:"bnb"},{lat:37.7947643,lng:-122.40052249999997},{lat:37.78685,lng:-122.411269},{lat:37.7883145,lng:-122.41046640000002,type:"bnb"},{lat:37.79152910000001,lng:-122.4095767,type:"hotel"},{lat:37.79512319999999,lng:-122.40434160000001},{lat:37.794372,lng:-122.39584300000001},{lat:37.79150449999999,lng:-122.4120312},{lat:37.78913,lng:-122.40724999999998,type:"hotel"},{lat:37.7915269,lng:-122.4104304,type:"bnb"},{lat:37.7905229,lng:-122.40494590000003,type:"hotel"},{lat:37.7872514,lng:-122.42551700000001,type:"hotel"},{lat:37.787231,lng:-122.426512,type:"hotel"},{lat:37.7923013,lng:-122.40906689999997,type:"bnb"}];

// 	var sample = [{lat:37.769462,lng:-122.426809,type:"hotel"},{lat:37.779294,lng:-122.426909,type:"hotel"},{lat:37.773030,lng:-122.423849,type:"bnb"},{lat:37.767757,lng:-122.429016,type:"bnb"},{lat:37.766408,lng:-122.423298,type:"bnb"},{lat:37.765219,lng:-122.416476,type:"hotel"},{lat:37.775012,lng:-122.409955,type:"bnb"},{lat:37.777748,lng:-122.408852,type:"hotel"},{lat:37.77832,lng:-122.412965,type:"bnb"},{lat:37.774042,lng:-122.41453,type:"bnb"},{lat:37.777128,lng:-122.412722,type:"bnb"},{lat:37.772726,lng:-122.421533,type:"hotel"},{lat:37.774931,lng:-122.431102,type:"bnb"},{lat:37.766348,lng:-122.426597,type:"bnb"},{lat:37.765161,lng:-122.432090,type:"hotel"},{lat:37.763116,lng:-122.424079,type:"bnb"}]

// 	for(var i = 0;i<sample.length;i++){
// 		if(sample[i].type == "hotel"){
// 			console.log("in if")
// 			var icon = {
// 				url: "assets/hotel.png", 
// 				origin: new google.maps.Point(0, 0),
// 				anchor: new google.maps.Point(17, 34),
// 				scaledSize: new google.maps.Size(20, 20)
// 			}
// 			var marker = new google.maps.Marker({
// 				map:map,
// 				position: new google.maps.LatLng(sample[i].lat,sample[i].lng),
// 				animation: google.maps.Animation.DROP,
// 				icon: icon,
// 				type:"hotel"
// 			})
// 		}
// 		else if(sample[i].type == "bnb"){
// 			var icon = {
// 				url: "assets/bnb.png", 
// 				origin: new google.maps.Point(0, 0),
// 				anchor: new google.maps.Point(17, 34),
// 				scaledSize: new google.maps.Size(20, 20)
// 			}
// 			var marker = new google.maps.Marker({
// 				map:map,
// 				position: new google.maps.LatLng(sample[i].lat,sample[i].lng),
// 				animation: google.maps.Animation.DROP,
// 				icon: icon,
// 				type:"bnb"
// 			})
// 		}
// 		  //create new bounds object
// 	  var bounds = new google.maps.LatLngBounds();
// 	  //iterates through all coordinates to extend bounds
// 	  for(var j = 0;j<sample.length;j++){
// 	  	var latLng = new google.maps.LatLng(sample[j].lat,sample[j].lng)
// 	    bounds.extend(latLng);
// 	  };
// 	  //recenters map around bounds
// 	  map.fitBounds(bounds);

	    
	
	// google.maps.event.addListener(marker, 'click', function() {
		
	// 	var boxText = document.createElement("div");
        
	// 	if(this.type == "bnb"){
	// 		boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: black; padding: 5px;";
	// 	    boxText.innerHTML = "<img class='info_img' id='img_4' src='assets/bnb-4.png'>";
	// 	}else{
	// 		boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: black; padding: 5px;";
	// 	    boxText.innerHTML = "<img class='info_img' id='img_5' src='assets/hotel-1.png'>";
	// 	}
	// 	var myOptions = {
	// 		content: boxText,
	// 		disableAutoPan: false,
	// 		maxWidth: 0,
	// 		pixelOffset: new google.maps.Size(-140, 0),
	// 		zIndex: null,
	// 		boxStyle: { 
	// 		  // background: "url('tipbox.gif') no-repeat"
	// 		  opacity: 0.95,
	// 		  width: "500px",
	// 		  height:"500px",
	// 		  overflow:"scroll"
	// 		 },
	// 		closeBoxMargin: "0px 0px 0px 0px",
	// 		// closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
	// 		infoBoxClearance: new google.maps.Size(1, 1),
	// 		isHidden: false,
	// 		pane: "floatPane",
	// 		enableEventPropagation: false,
	// 	};

	// 	var ib = new InfoBox(myOptions);
	// 		ib.open(map, marker);
	// 	})
	// }



	//use nearby search to hard code nearby lodging
	// service.nearbySearch(search,function (results,status){
	// 	for(var k = 0;k<results.length;k++){
	// 		console.log(results[k].geometry.location.lat()+","+results[k].geometry.location.lng())
		
	// 	}
	// 	if(status === google.maps.places.PlacesServiceStatus.OK){

	// 		//itereate thorugh results and run getDistance fxn on it
	// 		for (var i = 0; i < results.length; i++) {
	// 			getDistance([results[i]],current_location,function (arr){
					
	// 				for(var j=0;j<arr.length;j++){
	// 					var filterTest = filter(arr[j])
	// 					if(filterTest){
	// 						// getResults(ranking,filterTest.geometry.location)

	// 						var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
	// 						var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
	// 						var markerIcon = MARKER_PATH + markerLetter + '.png';
	// 						markers[j] = new google.maps.Marker({
	// 							map:map,
	// 							position: arr[j].geometry.location,
	// 							animation: google.maps.Animation.DROP,
	// 							icon: "/assets/mapicons/number_1.png"
	// 						})
	// 						markers[j].placeResult = arr[j];
	// 					}
	// 				}
				
	// 				// console.log(arr)
					
	// 			},[results[i]]);
	// 		}
	// 		// If the user clicks a hotel marker, show the details of that hotel
	// 		// in an info window.
			
	// 		// console.log(markers)
	// 		// console.log(results)
	// 		// google.maps.event.addListener(markers[i], 'click', showInfoWindow);
	// 		// setTimeout(dropMarker(i), i * 100);
	// 		// addResult(results[i], i);
			
	// 	}
 //    });
	

// 	// map.maptypes.set('map_style', styledMap);
// 	//prevents map from scrolling down unless clicked first.
// 	 map.addListener('click', function()
// 	   { 
// 	  	  if(map) map.setOptions({ scrollwheel: true }); 
// 	   });
// 	 map.addListener('mouseout', function()
// 	  	{ 
// 	  	  if(map) map.setOptions({ scrollwheel: false });
// 	    })

// }
// //returns an object that ranks all of the categories. this will be used for searching gmaps db
// function create_search_array(){
// 	var myVals = [];
// 	var count = 1
// 	$( '.interest_text' ).each(function(){
// 	  	myVals.push({
// 	  		category: $(this).attr('name'),
// 	  		rank: count,
// 	  	});
// 	  	count ++;
// 	});
// 	return myVals
// }



//  //Takes array of objects which contains coordinates and names of searched locations
//  //Origin a gMaps LatLng obj of the location being scored
//  //nearbySearch paramater allows us to be able to call the function for both the score query AND the hardcoded lodging query
// function getDistance(arr,origin,callback,nearbySearch){
// 	var destinationArr = [];
// 	//Iterate through coordinates array and create a new LatLng obj for each value. This
// 	//is to prepare for gMaps matrix search that will calculate distance and travel time
// 	if(nearbySearch){
// 		for(var i = 0; i<nearbySearch.length;i++){
// 			destinationArr.push(new google.maps.LatLng(nearbySearch[i].geometry.location.lat(),nearbySearch[i].geometry.location.lng()));
// 		}
// 	}
// 	else{
// 		for(var i = 0; i<arr.length;i++){
// 			destinationArr.push(new google.maps.LatLng(arr[i].lat,arr[i].lng));
// 		};
// 	}

// 	//gMaps Method to Calculate distance between 2 coordinates
// 	matrix.getDistanceMatrix({
// 		origins: [origin],
// 		destinations: destinationArr,
// 		unitSystem: google.maps.UnitSystem.IMPERIAL,
// 		travelMode: google.maps.TravelMode.WALKING,
// 	},function(response,status){
// 		if (status == google.maps.DistanceMatrixStatus.OK) {
// 			//there is only one origin point so we hard code the first element into var results
// 		    var results = response.rows[0].elements;
// 		    //next we iterate through the destination results and store all distance values into
// 		    //the original hash that was inputed into this function
// 	        for (var j = 0; j < results.length; j++) {
// 	        	// console.log(results[j].distance)
// 				arr[j]['distance'] = results[j].distance.value
// 		    }
// 		    console.log(results)
// 		    callback(arr)
// 		}
// 		else{
// 			errorStatus(status);
// 		};	

// 	})	

// };
// })




//Call back to handle errors during search
function errorStatus(status){
  switch(status){
    case "ERROR": alert("There was a problem contacting Google Servers");
      break;
    case "INVALID_REQUEST": alert("This request was not valid");
      break;
    case "OVER_QUERY_LIMIT": alert("This webpage has gone over its request quota");
      break;
    case "NOT_FOUND": alert("This location could not be found in the database");
      break;
    case "REQUEST_DENIED": alert("The webpage is not allowed to use the PlacesService");
      break;
    case "UNKNOWN_ERROR": alert("The request could not be processed due to a server error. The request may succeed if you try again");
      break;
    case "ZERO_RESULTS": alert("No result was found for this request. Please try again");
      break;
    default: alert("There was an issue with your request. Please try again.")
  };
};





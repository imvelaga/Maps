	 myMap.controller('mapController', function($scope,NgMap,MapService) {
	 $scope.flag=true;
	 $scope.waypointsList = [];
     $scope.locationsList = [{},{}];
     $scope.dragControlListeners ={};
	 var index = 1;
	 var mp = this;
	 NgMap.getMap().then(function(map) {
     mp.map = map;
     });
	 
	 $scope.mapEvent = function(event){
		var lat=event.latLng.lat();
		var lon=event.latLng.lng();
		alert(lat+ ", " +lon );
	 }
	 
	 $scope.waypoint = function(event){
		 // alert('om sai ram');
		 var marker = new google.maps.Marker({
			position: event.latLng,
			map: map
		 });
		 
		 var infowindow = new google.maps.InfoWindow();
		 infowindow.open(map,marker);
	 }
	 
	 $scope.addDestination = function(event){
		 var address;
		 var latLng = event.latLng;
		 var geocoder = new google.maps.Geocoder();		
		  geocoder.geocode({ 'latLng': latLng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
							console.log(results[1].formatted_address); // details
																		// address
							 address  = results[1].formatted_address;
                        } else {
                            console.log('Location not found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
			// if($scope.locationsList[0].location !== undefined &&
			// $scope.locationsList[0].location !== null &&
			// $scope.locationsList[$scope.locationsList.length-1].location !==
			// undefined &&
			// $scope.locationsList[$scope.locationsList.length-1].location !==
			// undefined){
			// console.log("3");
			// var lastRow =
			// angular.copy($scope.locationsList[$scope.locationsList.length -
			// 1]);
			// $scope.locationsList.push({});
			// $scope.locationsList[$scope.locationsList.length - 1] = lastRow;
			// $scope.locationsList[$scope.locationsList.length - 2] = {};
			// }
			// console.log("1");
			addLocationFromMap(address,latLng);
				
				
	}
	
	function addLocationFromMap(mapAddress,mapLocation){
		console.log("2");
		newLocation = {address: mapAddress,  location : mapLocation}
		if($scope.locationsList[0].location == undefined){			
			$scope.locationsList[0]= newLocation;
			alert('Please provide destination')
		}else if($scope.locationsList[1].location  == undefined){			
			$scope.locationsList[1]= newLocation;		
		}else{
			$scope.locationsList.push(newLocation);
		}
		// $scope.locationsList[index].location= loc;
		// $scope.locationsList[index - 1].address = address;
		// index = index+1;
		parseWayPoints();
	}
	
	 
	 $scope.addressChanged = function(element) {
		 console.log("called");
		 console.log("addressChanged");
		 console.log($scope.locationsList[index - 1].address+" "+index);
		 $scope.locationsList[index - 1].location = this.getPlace().geometry.location;
		 index=index+1;
		 parseWayPoints();
     }
	 
	 $scope.markerChanged = function() {
		console.log("markerChanged");
        var result = this.getDirections();
		console.log(result);
        var routes = result.routes[0];
		console.log(routes);
        var legs = routes.legs;
		console.log(legs);
        var leg = legs[0];
		console.log(leg);
        $scope.locationsList[0].address = leg.start_address;
        $scope.locationsList[0].location = leg.start_location;

        angular.forEach(legs, function(legVal, key) {
			console.log(legVal.start_address+" - "+legVal.start_location+" - "+key);
             if (key !== 0) {
				leg = legVal;
                $scope.locationsList[key].address = leg.start_address;
                $scope.locationsList[key].location = leg.start_location;
             }

        })
		
		console.log(leg.end_address+" - "+leg.end_location)		
		$scope.locationsList[$scope.locationsList.length - 1].address = leg.end_address;
        $scope.locationsList[$scope.locationsList.length - 1].location = leg.end_location;

        parseWayPoints();

	}
	
	$scope.canUserRemoveLocation = function(){
		console.log("canUserRemoveLocation");
        if($scope.locationsList.length>=3){
			return true;
        }
            return false;
    }
	
	 
	$scope.canUserAddWaypoint = function() {
		console.log("canUserAddWaypoint");
        if($scope.locationsList[0].location !== undefined && $scope.locationsList[0].location !== null &&
			$scope.locationsList[$scope.locationsList.length-1].location !== undefined && $scope.locationsList[$scope.locationsList.length-1].location !== undefined) {
            return true;
        }
            return false;
    }
	
	$scope.removeLocation = function(row){
		console.log("removeLocation");
        $scope.locationsList = $scope.locationsList.filter(function(item, index){
			console.log(item+" - "+index);
			console.log(item.$$hashKey+" - "+row.$$hashKey);
			return item.$$hashKey !== row.$$hashKey
        });
        parseWayPoints();
    }
	
	$scope.addWayPoint = function() {
		console.log("addWayPoint");
        var lastRow = angular.copy($scope.locationsList[$scope.locationsList.length - 1]);
        $scope.locationsList.push({});
        $scope.locationsList[$scope.locationsList.length - 1] = lastRow;
        $scope.locationsList[$scope.locationsList.length - 2] = {};
    }
	

	function parseWayPoints(){
		console.log("parseWayPoints");
        var wayPoints = angular.copy($scope.locationsList).slice(1, -1);
        var parsedWayPoints = [];
        angular.forEach(wayPoints, function(value, key) {
			console.log(value+" "+key);
			parsedWayPoints.push({
				location: value.location
			});
        });
        $scope.waypointsList = parsedWayPoints;
     }
     
	 var infowindow = new google.maps.InfoWindow();
	 var infowindowContent = document.getElementById('infowindow-content');
	 infowindow.setContent(infowindowContent);
	 
	 console.log("Good to go...");
	 
	 $scope.onlyMap = function(){
		$scope.flag= false;
	 };
	 $scope.wigdetShow = function(){
		$scope.flag = true;
	 };
	
	 //added by Shankar to save locations
	 $scope.locationsListJSON = {'testRouteCoordinate': [],'testRouteDepartCode':'','testRouteKeyword':'','testRouteMapgraph':'','testRouteName':'','testRouteState':''};
	 $scope.saveLocations = function (){
		 $scope.testRouteCoordinateArray = [];
		 angular.forEach($scope.locationsList, function(value, key) {
			 mapLocation = {'latitudes' : value.location.lat(), 'longitudes':value.location.lng()};
			 $scope.testRouteCoordinateArray.push(mapLocation);
		 });
		 $scope.locationsListJSON.testRouteCoordinate = $scope.testRouteCoordinateArray;
		 MapService.SaveLocations($scope.locationsListJSON);
	 }
	 
	 }); 
	 
	 /*
		 * myMap.directive("ngAddressAutocomplete", function () { return {
		 * restrict: 'AE', link: function (scope, element, attrs) { var
		 * autocomplete = new google.maps.places.Autocomplete(element[0]);
		 * autocomplete.addListener('place_changed', function(){}); } } });
		 */
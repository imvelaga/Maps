myMap.service('MapService', function($window) {
	
/*Created by UmaShankar Velaga*/ 
	
	var scope = angular.element($("#body")).scope();

	return ({
		SaveLocations : SaveLocations
	});

	function SaveLocations(data) {
		$.ajax({
			type : "POST",
			url : "",
			data : "data=" + JSON.stringify(data),
			datatype : "json",
			success : function(response) {

			}
		});
	}

});
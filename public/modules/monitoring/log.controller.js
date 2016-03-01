'use strict';

angular.module('Monitoring')

.controller('LogController', function ($scope,$http) {
	$http.get(baseUrl+'/mahasiswa/prodi/1')
		.success(function(data) {
			$scope.Mahasiswa = data;
		});
	$scope.submitLog = function() {
		// console.log($scope.formData);
		var rfid = $scope.rfid;
		var ruangan = $scope.ruangan;
		// var tanggal = $scope.tanggal;
		$http.get(baseUrl+'/action/log?rfid='+rfid+'&ruangan='+ruangan)
			.success(function(data) {
				$scope.Log = data;
				// console.log(data);
			});
	}
});
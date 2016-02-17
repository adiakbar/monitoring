angular.module('Penjadwalan')

.controller('PraktikumTambahanController',function ($scope,$http) {
	/* Deklarasi variable scope show hide box*/
	$scope.showBoxDetail = false;
	$scope.showCover = false;
	$scope.showFormPraktikum = false;
	$scope.showBoxPraktikum = true;

	/* Mendapatkan Data Praktikum */
	$http.get(baseUrl+'/praktikumtambahan/prodi/1')
		.success(function(data) {
			$scope.Praktikum = data;
			for(var key in data) {
				$scope.Praktikum[key].tanggal = moment(data[key].tanggal).format("dddd, LL");
			}
		});

	/* Munculkan Form Add Praktikum */
	$scope.formAddPraktikum = function() {
		$scope.showFormPraktikum = true;
		$scope.showCover = true;
		$scope.formAction = "add";
	}

	/* Edit Form Praktikum */
	$scope.formEditPraktikum = function(id) {
		$scope.showFormPraktikum = true;
		$scope.showCover = true;
		$http.get(baseUrl+'/praktikumtambahan/id/'+id)
			.success(function(data) {
				$scope.formData = data;
				$scope.formAction = "edit";
			});
	}

	/* INSERT Praktikum */
	$scope.insertPraktikum = function() {
		$scope.formData.mulai_scan = moment($scope.formData.mulai, 'HH:mm').subtract(15,'minutes').format('HH:mm');
		$http.post(baseUrl+'/praktikumtambahan/prodi/1',$scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.showFormPraktikum = false;
				$scope.showCover = false;
				$http.get(baseUrl+'/praktikumtambahan/prodi/1')
					.success(function(data) {
						$scope.Praktikum = data;
					});
			});
	}

	/* UPDATE Praktikum */
	$scope.updatePraktikum = function(id) {
		$scope.formData.mulai_scan = moment($scope.formData.mulai, 'HH:mm').subtract(15,'minutes').format('HH:mm');
		$http.put(baseUrl+'/praktikumtambahan/id/'+id,$scope.formData)
			.success(function(data) {
				$scope.formData = {};
				$scope.showFormPraktikum = false;
				$scope.showCover = false;
				$http.get(baseUrl+'/praktikumtambahan/prodi/1')
					.success(function(data) {
						$scope.Praktikum = data;
					});
			});
	}

	/* Close Form Praktikum */
	$scope.closeFormPraktikum = function() {
		$scope.showFormPraktikum = false;
		$scope.showCover = false;
		$scope.formData = {};
	}

	/* Delete Praktikum */
	$scope.deletePraktikum = function(id) {
		$http.delete(baseUrl+'/praktikumtambahan/id/'+id)
			.success(function(data){
				$http.get(baseUrl+'/praktikumtambahan/prodi/1')
					.success(function(data){
						$scope.Praktikum = data;
					});
			});
	}

	/* Mendapatkan Data Detail Praktikum */
	$scope.detailPraktikum = function(id) {
		$scope.showBoxDetail = true;
		$scope.showBoxPraktikum = false;
		$http.get(baseUrl+'/detailpraktikum/praktikum/id/'+id)
			.success(function(data) {
				$scope.Mahasiswa = data;
				console.log(data);
			});
		$http.get(baseUrl+'/praktikumtambahan/id/'+id)
			.success(function(data) {
				$scope.praktikum = data;
			});
	}

	/* Add To Praktikum */
	$scope.addToPraktikum = function(idPraktikum,idMahasiswa) {
		var formData = {
			praktikum_id : idPraktikum,
			mahasiswa_id : idMahasiswa
		};
		$http.post(baseUrl+'/detailpraktikum',formData)
			.success(function(data) {
				$http.get(baseUrl+'/detailpraktikum/praktikum/id/'+idPraktikum)
					.success(function(data) {
						$scope.Mahasiswa = data;
					});
			});
	}

	/* Cancel From Praktikum */
	$scope.cancelFromPraktikum = function(idPraktikum,idMahasiswa) {
		$http.delete(baseUrl+'/detailpraktikum/'+idPraktikum+'/'+idMahasiswa)
			.success(function(data) {
				$http.get(baseUrl+'/detailpraktikum/praktikum/id/'+idPraktikum)
					.success(function(data) {
						$scope.Mahasiswa = data;
					});
			});
	};

	/* Keluar dari Detail Praktikum */
	$scope.closeDetailPraktikum = function() {
		$scope.showBoxPraktikum = true;
		$scope.showBoxDetail = false;
	}
});
'use strict';

angular.module('Monitoring')

.factory('socket',function() {
	var socket = io.connect('http://localhost:3030');
	return socket;
})

.controller('HomeMonitoring', function ($scope,$http,socket,$timeout) {
	/* Deklarasi Objek Laboratorium A */
	$scope.labA = [{
		komputer: 'Komputer 1',
		kondisi: 'off'
	},
	{
		komputer: 'Komputer 2',
		kondisi: 'off'
	},{
		komputer: 'Komputer 3',
		kondisi : 'off'
	}];

	/* Deklarasi Objek Laboratorium A */
	$scope.labB = [{
		komputer: 'Komputer 1',
		kondisi: 'off'
	},{
		komputer: 'komputer 2',
		kondisi: 'off'
	},{
		komputer: 'komputer 3',
		kondisi: 'off'
	}];

	/* Deklarasi Scope Grafik */



  /* Deklarasi Scope Time */
  var tanggal = moment().format("YYYY-MM-DD");
  var jam 		= moment().format("H:mm:ss");
  var hari 		= moment().format("dddd");
  $scope.bulan = moment().format("MMMM");

  // MINTA AJARKAN EDI BIAR NDAK GINI Kodingnya
  $http.get(baseUrl+'/action/cek-jadwal?jam='+jam+'&tanggal='+tanggal+'&hari='+hari+'&ruangan=Laboratorium A')
		.success(function(data){
			$scope.ketA = data;
		});
	$http.get(baseUrl+'/action/cek-jadwal?jam='+jam+'&tanggal='+tanggal+'&hari='+hari+'&ruangan=Laboratorium B')
		.success(function(data){
			$scope.ketB = data;
		});

	var cekIndex = function(kodeLab,kodePc) {
		console.log(kodeLab+' '+kodePc);
		var indexLab = 0;
		var indexPc = 0;
		switch (kodeLab) {
			case "Laboratorium A":
				indexLab = 0;
				break;
			case "Laboratorium B":
				indexLab = 1;
				break;
		}
		switch (kodePc) {
			case "Komputer 1":
				indexPc = 0;
				break;
			case "Komputer 2":
				indexPc = 1;
				break;
			case "Komputer 3":
				indexPc = 2;
				break;
		}
		return {indexLab:indexLab,indexPc:indexPc};
	}

  // KONDISI SAAT HALAMAN PERTAMA KALI RELOAD
  $http.get(baseUrl+'/action/status')
  	.success(function(allData) {
  		var data = allData.data;
  		for(var key in data) {
  			// KONDISI LABORATORIUM A (INI JUGA PERBAIKI KODINGNYA)
  			if(data[key].ruangan == 'Laboratorium A' && data[key].komputer == 'Komputer 1') {
  				$scope.labA[0] = data[key];
  				$scope.labA[0].waktu = moment(data[key].mulai,'HH::mm:ss').fromNow();
  			} else if(data[key].ruangan == 'Laboratorium A' && data[key].komputer == 'Komputer 2') {
  				$scope.labA[1] = data[key];
					$scope.labA[1].waktu = moment(data[key].mulai,'HH:mm:ss').fromNow();
  			} else if(data[key].ruangan == 'Laboratorium A' && data[key].komputer == 'Komputer 3') {
  				$scope.labA[2] = data[key];
					$scope.labA[2].waktu = moment(data[key].mulai,'HH:mm:ss').fromNow();

  			// KONDISI LABORATORIUM B
  			} else if(data[key].ruangan == 'Laboratorium B' && data[key].komputer == 'Komputer 1') {
  				$scope.labB[0] = data[key];
  				$scope.labB[0].waktu = moment(data[key].mulai,'HH:mm:ss').fromNow();
  			} else if(data[key].ruangan == 'Laboratorium B' && data[key].komputer == 'Komputer 2') {
  				$scope.labB[1] = data[key];
  				$scope.labB[1].waktu = moment(data[key].mulai,'HH:mm:ss').fromNow();
  			} else if(data[key].ruangan == 'Laboratorium B' && data[key].komputer == 'Komputer 3') {
  				$scope.labB[2] = data[key];
  				$scope.labB[2].waktu = moment(data[key].mulai,'HH:mm:ss').fromNow();
  			}
  		}
  		// console.log(allData.dataJml);
  		var dataJml = allData.dataJml;
  		var arr_data = [];
  		arr_data[0] = [0, 0, 0];
  		arr_data[1] = [0, 0, 0];
  		for(var key in dataJml) {
  			var index = cekIndex(dataJml[key].ruangan,dataJml[key].komputer);
  			arr_data[index.indexLab][index.indexPc] = dataJml[key].jumlah_pemakaian;
  		}
  		$scope.chartData = {
		 		labels: ['Komputer 1', 'Komputer 2' ,'Komputer 3'],
		 		series: ['Laboratorium A', 'Laboratorium B'],
		 		data: arr_data
		 	}
  	});

	// KONDISI SAAT PYTHON SOCKET CLIENT MENGIRIM DATA BARU
	socket.on('refresh_add',function(data) {
		$timeout(function() {
			$scope.$apply(function() {
				// KONDISI LABORATORIUM A (INI JUGA PERBAIKI KODINGNYA)
				if(data.ruangan == 'Laboratorium A' && data.komputer == 'Komputer 1') {
					$scope.labA[0] = data;
				} else if(data.ruangan == 'Laboratorium A' && data.komputer == 'Komputer 2') {
					$scope.labA[1] = data;
				} else if(data.ruangan == 'Laboratorium A' && data.komputer == 'Komputer 3') {
					$scope.labA[2] = data;

					// KONDISI LABORATORIUM B
				} else if(data.ruangan == 'Laboratorium B' && data.komputer == 'Komputer 1') {
					$scope.labB[0] = data;
				} else if(data.ruangan == 'Laboratorium B' && data.komputer == 'Komputer 2') {
					$scope.labB[1] = data;
				} else if(data.ruangan == 'Laboratorium B' && data.komputer == 'Komputer 3') {
					$scope.labB[2] = data;
				}
				// $scope.chartData.data = [
				// 										 			[3, 6, 13],
				// 										    	[4, 2, 6]
				// 										 		];
				var old_val = $scope.chartData.data[data.kd_ruangan][data.kd_komputer];
				var new_val = old_val + 1;
				var arr_data = $scope.chartData.data[data.kd_ruangan];
				arr_data[data.kd_komputer] = new_val;
				$scope.chartData.data[data.kd_ruangan] = arr_data;
			});
		},100);

		console.log(data);
		// Update Database Untuk Memasukkan kondisi ON pada table Log
		// $http.post(baseUrl+'/action/status',data);

	});

	// KONDISI SAAT PYTHON SOCKET CLIENT MENGUPDATE DATA
	socket.on('refresh_update',function(data) {
		$timeout(function() {
			$scope.$apply(function() {
				// KONDISI LABORATORIUM A (INI JUGA PERBAIKI KODINGNYA)
				if(data.ruangan == 'Laboratorium A' && data.komputer == 'Komputer 1') {
					$scope.labA[0] = data;
				} else if(data.ruangan == 'Laboratorium A' && data.komputer == 'Komputer 2') {
					$scope.labA[1] = data;
				} else if(data.ruangan == 'Laboratorium A' && data.komputer == 'Komputer 3') {
					$scope.labA[2] = data;

					// KONDISI LABORATORIUM B
				} else if(data.ruangan == 'Laboratorium B' && data.komputer == 'Komputer 1') {
					$scope.labB[0] = data;
				} else if(data.ruangan == 'Laboratorium B' && data.komputer == 'Komputer 2') {
					$scope.labB[1] = data;
				} else if(data.ruangan == 'Laboratorium B' && data.komputer == 'Komputer 3') {
					$scope.labB[2] = data;
				}
			});
		},100);
		// Update Database Untuk Memasukkan kondisi ON pada table Log
		$http.put(baseUrl+'/action/status',data);
	});



});
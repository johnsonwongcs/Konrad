app.controller('gameDetailsCtrl', gameDetailsCtrl);

function gameDetailsCtrl(MLBService, $routeParams,$http) {
	this.index = $routeParams.index;
	this.MLBService = MLBService;
	this.$http = $http;
	MLBService.getData(this.index);
 	

}

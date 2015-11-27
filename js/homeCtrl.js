app.controller('homeCtrl', homeCtrl);

function homeCtrl(MLBService) {
	this.MLBService = MLBService;

}

homeCtrl.prototype.getDate = function() {
	this.MLBService.getDate();
}
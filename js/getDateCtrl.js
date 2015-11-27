app.controller('getDateCtrl', getDateCtrl);

function getDateCtrl(MLBService,$q,$http) {
  this.MLBService = MLBService;
  this.MLBService.game = [];
  this.MLBService.getDate();
};


app.controller('getDateCtrl', getDateCtrl);

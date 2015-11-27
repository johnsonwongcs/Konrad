app.service('MLBService', MLBService);

function MLBService($q,$http,$location) {
  this.$http = $http;
  this.$location = $location;
  this.game = [];
  this.year = '2014';
  this.month = '07';
  this.day = '15';
  this.boxscore = [];
  this.innings = [];
}

MLBService.prototype.getDate = function() {
  var url = 'http://gd2.mlb.com/components/game/mlb/year_'+this.year+'/month_'+this.month+'/day_'+this.day+'/master_scoreboard.json';
  var self = this;
  this.game = [];
  var path = this.$location.path("/games");
  this.$http({
    method: 'GET',
    url: url
  })
    .then(function successCallback(response) {
        if (Array.isArray(response.data.data.games.game)) {
          self.game = response.data.data.games.game;
        }
        else {
          self.game.push(response.data.data.games.game);
        }
        console.log(self.game);
      }, function errorCallback(response) {
        console.log(response);
      })
};

MLBService.prototype.getData = function(index) {
    var self = this;
    console.log(index);
    console.log(self.game[index]);
    this.innings = this.game[index].linescore.inning;
    console.log(this.innings);
    this.$http({
    method: 'POST',
    url: 'http://www.mlb.com/gdcross'+self.game[index].game_data_directory+'/boxscore.json'
  })
    .then(function successCallback(response) {
        self.boxscore = response.data.data.boxscore;
        console.log(self.boxscore.pitching);
      }, function errorCallback(response) {
        console.log(response);
      })
};
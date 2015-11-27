app.service('MLBService', MLBService);

function MLBService($q,$http,$location) {
  this.$http = $http;
  this.$location = $location;
  this.year = '2014';
  this.month = '03';
  this.day = '29';
  this.boxscore = [];
  this.innings = [];
  this.favorite = "Blue Jays"
  this.count = 0;
  this.err = true;
}

MLBService.prototype.getDate = function() {
  var url = 'http://gd2.mlb.com/components/game/mlb/year_'+this.year+'/month_'+this.month+'/day_'+this.day+'/master_scoreboard.json';
  var self = this;

  this.gamesData = [];
  this.games = [];
  this.$http({
    method: 'GET',
    url: url
  })
    .then(function(response) {
        var path = self.$location.path("/games");
        if (Array.isArray(response.data.data.games.game)) {
          self.gamesData = response.data.data.games.game;
        }
        else {
          self.gamesData.push(response.data.data.games.game);
        }
        console.log(self.gamesData);
        for (var i=0;i<self.gamesData.length;i++) {
          var tempObject = {};
          tempObject.away = self.gamesData[i].away_team_name;
          tempObject.home = self.gamesData[i].home_team_name;
          tempObject.url = self.gamesData[i].game_data_directory;
          tempObject.status = self.gamesData[i].status.status;
          if (self.gamesData[i].linescore) {
            tempObject.linescore = self.gamesData[i].linescore;
            if ((self.gamesData[i].linescore.r.away - self.gamesData[i].linescore.r.home)>0) {
              tempObject.winner = "away";
            }
            else if ((self.gamesData[i].linescore.r.away - self.gamesData[i].linescore.r.home)<0) {
              tempObject.winner = "home";
            }
            else {
              tempObject.winner = "";
            }
          }
          
          if (tempObject.away == self.favorite || tempObject.home == self.favorite) {
            self.games.splice(0,0,tempObject);
          } 
          else {
            self.games.push(tempObject);
          }
        };
      }, function (response) {
        self.err = false;
      })
};

MLBService.prototype.getData = function(index) {
    var self = this;
    console.log(index);
    console.log(self.games[index]);
    this.innings = this.games[index].linescore.inning;
    console.log(this.innings);
    this.$http({
    method: 'POST',
    url: 'http://www.mlb.com/gdcross'+self.games[index].url+'/boxscore.json'
  })
    .then(function successCallback(response) {
        self.boxscore = response.data.data.boxscore;
        console.log(self.boxscore.pitching);
      }, function errorCallback(response) {
        console.log(response);
      })
};
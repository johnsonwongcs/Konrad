app.service('MLBService', MLBService);

function MLBService($q,$http,$location,$cookies) {
  this.$http = $http;
  this.$location = $location;
  this.$cookies = $cookies;
  this.year = '2014';
  this.month = '03';
  this.day = '29';
  this.boxscore = [];
  this.linescore = [];
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
          console.log(response.data.data.games);
        }
        else {
          self.gamesData.push(response.data.data.games.game);
        }
        for (var i=0;i<self.gamesData.length;i++) {
          var tempObject = {};
          tempObject.away = self.gamesData[i].away_team_name;
          tempObject.awayAbbrev = self.gamesData[i].away_name_abbrev;
          tempObject.home = self.gamesData[i].home_team_name;
          tempObject.homeAbbrev = self.gamesData[i].home_name_abbrev;
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
          self.$cookies.putObject('games', self.games);
          console.log(self.$cookies.getObject('games'));
        };
      }, function (response) {
        self.err = false;
      })
};

MLBService.prototype.getData = function(index) {
    var self = this;
    this.game = this.games[index];
    this.linescore = this.games[index].linescore;
    this.$http({
    method: 'POST',
    url: 'http://www.mlb.com/gdcross'+self.games[index].url+'/boxscore.json'
  })
    .then(function successCallback(response) {
        self.boxscore = response.data.data.boxscore;
        self.$cookies.putObject('boxscore', self.boxscore);
        console.log(self.$cookies.getObject('boxscore'));
        console.log(response.data.data);
      }, function errorCallback(response) {
        console.log(response);
      })
};
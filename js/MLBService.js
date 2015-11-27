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

  this.count++;
  console.log('count = '+this.count);

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
            console.log(tempObject);
            self.games.splice(0,0,tempObject);
          } 
          else {
            console.log(tempObject);
            self.games.push(tempObject);
          }
        };
        console.log(self.games);
      }, function (response) {
        self.err = false;
        console.log(self.err);
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
    url: 'http://www.mlb.com/gdcross'+self.game[index].url+'/boxscore.json'
  })
    .then(function successCallback(response) {
        self.boxscore = response.data.data.boxscore;
        console.log(self.boxscore.pitching);
      }, function errorCallback(response) {
        console.log(response);
      })
};
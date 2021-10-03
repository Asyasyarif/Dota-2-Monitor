const port = 8081
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require("socket.io")(http);

var d2gsi = require('dota2-gsi');
var dota2 = new d2gsi();
var clients = [];
var heroes = {}; // Dict to map console object name -> Actual hero name
var items = {}; // Dict to map console object name -> Actual item name
var abilities = {}; // Dict to map console object name -> Actual ability name
var itemsJSON = require("./data/items");
var heroesJSON = require("./data/heroes");
var abilitiesJSON = require("./data/abilities");
app.use(express.static('public'));


let heroTalents = [];
let hasHero = false;
let heroName = '';
let displayTalents = false;

io.on("connection", (socket) => {
  //Socket is a Link to the Client 
  console.log("New Client is Connected!");
  io.emit("/", "Hello and Welcome to the Server");
  //Here the client is connected and we can exchanged 
});


var i = 0;
dota2.events.on('newclient', function(client) {
  client.on('newdata', function (rawdata) {
    // console.log(rawdata);
  });
  let data = "New client connection, IP address: " + client.ip + ", Name: " + client.gamestate.player.name
  io.emit("/", data);
  console.log(data);

  if (client.auth && client.auth.token) {
    let auth  = "Auth token: " + client.auth.token
    console.log(auth);
  } else {
    console.log("No Auth token");
  }

  // MAP
  client.on("map:game_state", function (state){
    console.log("GAME STATE "  + state);
    //DOTA_GAMERULES_STATE_STRATEGY_TIME
    //DOTA_GAMERULES_STATE_TEAM_SHOWCASE
    //DOTA_GAMERULES_STATE_PRE_GAME
    //DOTA_GAMERULES_STATE_GAME_IN_PROGRESS
    //DOTA_GAMERULES_STATE_POST_GAME
  });

  client.on('map:daytime', function(daytime) {
    console.log("day " + daytime);
  });

  client.on('map:clock_time', function(time) {
    let inttime = parseInt(time, 10);
    // console.log("Now time is " + inttime);
  });

  client.on('map:game_time', function(time) {
    let inttime = parseInt(time, 10);
    // console.log("Now time is " + inttime);
  });

  client.on('map:matchid', function(matchid){
    console.log("match id "+ matchid);
  })

  client.on('map:ward_purchase_cooldown', function(radiant_ward) {
      console.log("Radiant ward rad " + radiant_ward);
      io.emit("/", "Radiant ward rad " + radiant_ward);
  });

  client.on("map:paused", function(isPauesed){
    console.log("is Game Paused " + isPauesed);
  });

  client.on("map:win_team", function(winTeam){
    console.log("The winner  " + winTeam);
    io.emit("/", "The winner  " + winTeam);
  });


  // PLAYER
  client.on('player:steamid', function(steamid) {
      console.log("Steam id " + steamid);
  });

  client.on('player:activity', function(activity) {
      if (activity == 'playing') console.log("Game started!");
      io.emit("/", "Game started!");
  });
  
  client.on('player:kills', function(kills) {
     console.log("Kills " + kills);
     io.emit("/", "Kills " + kills);
  });

  client.on('player:deaths', function(deaths) {
     console.log("Deaths " + deaths);
     io.emit("/", "Deaths " + deaths);
  });
  
  client.on('player:assists', function(assists) {
     console.log("Assists " + assists);
     io.emit("/", "Assists " + assists);
  });

  client.on('player:last_hits', function(hit) {
    console.log("Last hit " + hit);
    io.emit("/", "Last hit " + hit);
  });

  client.on('player:denies', function(denies) {
    console.log("Denies " + denies);
    io.emit("/", "Denies " + denies);
  });

  client.on('player:kill_streak', function(kill_streak) {
    console.log("Kill streak " + kill_streak);
    io.emit("/", "Kill streak " + kill_streak);
  });

  client.on('player:kill_list', function(kill_list) {
    console.log("Kill list " + kill_list);
    io.emit("/", "Kill list " + kill_list);
  });

  client.on('player:team_name', function(team_name) {
    console.log("Team name " + team_name);
    io.emit("/", "Team name " + team_name);
  });

  client.on('player:gold', function(gold) {
    console.log("Player gold " + gold);
    io.emit("/", "Player gold " + gold);
  });

  client.on('player:gold_reliable', function(gold_reliable) {
    console.log("Player gold reliable " + gold_reliable);
    io.emit("/", "Player gold reliable " + gold_reliable);
  });

  client.on('player:gold_unreliable', function(gold_unreliable) {
    console.log("Player gold unreliable " + gold_unreliable);
  });

  client.on('player:gold_from_hero_kills', function(gold_from_hero_kills) {
    console.log("Player gold from hero kills " + gold_from_hero_kills);
    io.emit("/", "Player gold from hero kills " + gold_from_hero_kills);
  });

  client.on('player:gold_from_creep_kills', function(gold_from_creep_kills) {
    console.log("Player gold from creep kills " + gold_from_creep_kills);
  });

  client.on('player:gold_from_income', function(gold_from_income) {
    console.log("Player gold from income " + gold_from_income);
    io.emit("/", "Player gold from income " + gold_from_income);
  });

  client.on('player:gold_from_shared', function(gold_from_shared) {
    console.log("Player gold from shared " + gold_from_shared);
    io.emit("/", "Player gold from shared " + gold_from_shared);
  });

  client.on('player:gpm', function(gpm) {
    console.log("Player GPM " + gpm);
    io.emit("/", "Player GPM " + gpm);
  });

  client.on('player:xpm', function(xpm) {
    console.log("Player XPM " + xpm);
    io.emit("/", "Player XPM " + xpm);
  });


  // hero
  client.on('hero:name', function(name) {
    var hero = heroes[name];
    console.log("Hero name is " + hero);
    io.emit("/", "Hero name is " + hero);
  });
  
  client.on('hero:level', function(level) {
    console.log("Now level " + level);
    io.emit("/", "Now level " + level);
  });

  client.on('hero:xp', function(xp) {
    console.log("Now XP " + xp);
    io.emit("/", "Now XP " + xp);
  });

  client.on('hero:alive', function(alive) {
    console.log("is Hero Alive " + alive);
    io.emit("/", "is Hero Alive " + alive);
  });

  client.on('hero:respawn_seconds', function(respawn_seconds) {
    console.log("Hero respawn_seconds " + respawn_seconds);
    io.emit("/", "Hero respawn_seconds " + respawn_seconds);
  });

  client.on('hero:aghanims_scepter', function(aghanims_scepter) {
      console.log("is have Aghs " + aghanims_scepter);
      io.emit("/", "is have Aghs " + aghanims_scepter);
  });

  client.on('hero:buyback_cost', function(buyback_cost) {
      console.log("BB cost " + buyback_cost);
  });

  client.on('hero:buyback_cooldown', function(buyback_cooldown) {
      console.log("BB CD " + buyback_cooldown);
  });

  client.on('hero:health', function(health) {
      console.log("Hero health " + health);
      io.emit("/", "Hero health " + health);
  });

  client.on('hero:max_health', function(max_health) {
      console.log("Hero max health " + max_health);
      io.emit("/", "Hero max health " + max_health);
  });

  client.on('hero:health_percent', function(health_percent) {
      console.log("Hero percent health " + health_percent);
      io.emit("/", "Hero percent health " + health_percent);
  });

  client.on('hero:mana', function(mana) {
    console.log("Hero mana " + mana);
    io.emit("/", "Hero mana " + mana);
  });

  client.on('hero:max_mana', function(max_mana) {
    console.log("Hero max mana " + max_mana);
    io.emit("/", "Hero max mana " + max_mana);
  });

  client.on('hero:mana_percent', function(mana_percent) {
    console.log("Hero max percent mana " + mana_percent);
    io.emit("/", "Hero max percent mana " + mana_percent);
  });

  client.on('hero:silenced', function(silenced) {
    console.log("Hero is silenced " + silenced);
    io.emit("/", "Hero is silenced " + silenced);
  });

  client.on('hero:stunned', function(stunned) {
    console.log("Hero is stunned " + stunned);
    io.emit("/", "Hero is stunned " + stunned);
  });

  client.on('hero:disarmed', function(disarmed) {
    console.log("Hero is disarmed " + disarmed);
    io.emit("/", "Hero is disarmed " + disarmed);
  });

  client.on('hero:magicimmune', function(magicimmune) {
    console.log("Hero is magicimmune " + magicimmune);
    io.emit("/", "Hero is magicimmune " + magicimmune);
  });

  client.on('hero:hexed', function(hexed) {
    console.log("Hero is hexed " + hexed);
    io.emit("/", "Hero is hexed " + hexed);
  });

  client.on('hero:muted', function(muted) {
    console.log("Hero is muted " + muted);
    io.emit("/", "Hero is muted " + muted);
  });

  client.on('hero:break', function(breaks) {
    console.log("Hero is break " + breaks);
    io.emit("/", "Hero is break " + breaks);
  });

  client.on('hero:aghanims_shard', function(aghanims_shard) {
    console.log("Hero aghanims shard " + aghanims_shard);
    io.emit("/", "Hero aghanims shard " + aghanims_shard);
  });

  client.on('hero:aghanims_shard', function(aghanims_shard) {
    console.log("Hero aghanims shard " + aghanims_shard);
    io.emit("/", "Hero aghanims shard " + aghanims_shard);
  });

  client.on('hero:smoked', function(smoked) {
    console.log("Hero smoked " + smoked);
    io.emit("/", "Hero smoked " + smoked);
  });

  client.on('hero:has_debuff', function(has_debuff) {
    console.log("Hero smoked " + has_debuff);
    io.emit("/", "Hero smoked " + has_debuff);
  });

  client.on('hero:talent_1', function(talent_1) {
    console.log("Hero talent 1 " + talent_1);
    io.emit("/", "Hero talent " + talent_1);
  });

  client.on('hero:talent_2', function(talent_2) {
    console.log("Hero talent 2 " + talent_2);
    io.emit("/", "Hero talent 2 " + talent_2);
  });

  client.on('hero:talent_3', function(talent_3) {
    console.log("Hero talent 3 " + talent_3);
    io.emit("/", "Hero talent 3" + talent_3);
  });

  client.on('hero:talent_4', function(talent_4) {
    console.log("Hero talent 4 " + talent_4);
    io.emit("/", "Hero talent 4" + talent_4);
  });

  client.on('hero:talent_5', function(talent_5) {
    console.log("Hero talent 5 " + talent_5);
    io.emit("/", "Hero talent 5" + talent_5);
  });

  client.on('hero:talent_6', function(talent_6) {
    console.log("Hero talent 6 " + talent_6);
    io.emit("/", "Hero talent 6" + talent_6);
  });

  client.on('hero:talent_7', function(talent_7) {
    console.log("Hero talent 7 " + talent_7);
    io.emit("/", "Hero talent 7" + talent_7); 
  });

  client.on('hero:talent_8', function(talent_8) {
    console.log("Hero talent 8 " + talent_8);
  });


  client.on('player:team2:player3:gold', function(team) {
    console.log("Tesssam " + team);
  });

  client.on('hero:team2:player3:health', function(team) {
    console.log("Hero " + team);
  });



  // client.on('provider:name', function(name) {
  //     console.log("Provider name " + name);
  // });



  client.on('abilities:ability0:can_cast', function(can_cast) {
      if (can_cast) console.log("Ability0 off cooldown!");
  });
})


http.listen(port, function(){
	var itemsArray = itemsJSON.items[0];
  var heroesArray = heroesJSON.heroes[0];
  var abilitiesArray = abilitiesJSON.abilities[0];
	
	for (var item in itemsArray) {
        items[item] = itemsArray[item];
    }

    for (var hero in heroesArray) {
        heroes[hero] = heroesArray[hero];
    }

    for (var ability in abilitiesArray) {
        abilities[ability] = abilitiesArray[ability];
    }
	
	 console.log("Ready to send events to clients on port 8081");
});
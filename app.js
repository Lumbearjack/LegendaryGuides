var legendaryApp = {};

legendaryApp.key = "23cef05e-21d7-464d-bc92-6294665c2f53";
baseApiUrl = "https://global.api.pvp.net";

var firebase = require("firebase");

legendaryApp.init = function(){
legendaryApp.getChamps();
}
legendaryApp.getChamps = function(){
	var champAjax = $.ajax({
		url:baseApiUrl+'/api/lol/static-data/na/v1.2/champion',
		method:'GET',
		dataType: 'json',
		data:{
			api_key: legendaryApp.key,
			champData: 'all'
		}
	});
	$.when(champAjax).done(function(response){
		var rawArray = [];
		for (champ in response.data) {
			rawArray.push(response.data[champ]);
		}
		var blah = rawArray.map(function(item){
			return item;
		}).sort(function(a,b){
			return a.name - b.name
		})
		var alphArray = _.sortBy(rawArray, "name");
		legendaryApp.champsArray = alphArray;
		legendaryApp.showChampList();
		legendaryApp.events();
	})
};
legendaryApp.showChampList = function(){
	$('#search').val('');

	legendaryApp.champsArray.forEach(function(champ){
		var arrayIndex = champ;
		var sprite = champ.image.full;
		var id = champ.id;
		var key = champ.key;
		var name = champ.name;
		var title = champ.title;
		var image = champ.skins[0].num;
		var spriteEl = $(`<img class="champSprite content" alt="${name}">`).attr("src","http://ddragon.leagueoflegends.com/cdn/7.4.3/img/champion/"+sprite);
		var nameEl = $('<h1 class="champName">').text(name);
		var titleEl = $('<h3 class="champTitle">').text(title);
		var headerEl = $('<div class="champHeader">').append(nameEl, titleEl);
		var imageEl = $('<img class="champBlock">').css("background-image","url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+name+"_"+image+".jpg)")
		var innerWrapper = $(`<div class="innerWrapper listIconRatio animated">`).append(spriteEl);
		var champItem = $(`<div class="champItem">`).attr({"id":id, "data-name":name,key}).append(innerWrapper);

		// ).attr({"data-test-1": num1, "data-test-2": num2});
		$('#champGrid').append(champItem.fadeIn('slow'));
	})
};
legendaryApp.showChampPage = function(){
	$('#search').val('');
	$('#champPage').empty();
	$('#champList').fadeOut('fast');
	let check = 0;
	legendaryApp.fighter.forEach(function(champ){
		// Usable Champ Info
		var sprite = champ.image.full;
		var id = champ.id;
		var key = champ.key;
		var name = champ.name;
		var title = champ.title;
		var bgImage = champ.skins[0].num;
		//stats
		var attackVal = Math.round(champ.stats.attackdamage);
		var aspeedVal = ((0.625 / (1 + champ.stats.attackspeedoffset))*100).toFixed(2);//number of attacks per second +0.625
		var hpVal = Math.round(champ.stats.hp);
		var movespeedVal = champ.stats.movespeed;
		//HTML Creation
		// set sprite icon
		var spriteEl = $('<img class="champSprite content">').attr("src","http://ddragon.leagueoflegends.com/cdn/7.4.3/img/champion/"+sprite);
		//set name in h1
		var nameEl = $('<h1 class="champName">').text(name);
		// set title
		var titleEl = $('<h3 class="champTitle">').text(title);
		//display stats
		var statAttackEl = $('<div class="stat ">').html(`DAMAGE<p class="attack">${attackVal}</p>`);
		var statAspeedEl = $('<div class="stat ">').html(`SPEED<p class="aspeed">${aspeedVal}</p>`);
		var statHpEl = $('<div class="stat ">').html(`HEALTH<p class="hp">${hpVal}</p>`);
		var statmovespeedEl = $('<div class="stat ">').html(`DODGE<p class="movespeed">${movespeedVal}</p>`);
		var headerTextEl = $('<div class="champHeaderText">').append(nameEl, titleEl);
		var headerEl = $('<div class="headerBlock">').append(spriteEl,headerTextEl);
		var contentEl = $('<div class="champStats">').append(statAttackEl,statHpEl,statAspeedEl,statmovespeedEl);
		var champBlock = $('<div class="champBlock animated flipInX">').append(headerEl,contentEl).css("background-image","url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+key+"_"+bgImage+".jpg)");
		var champPage = $('#champPage').append(champBlock);
		$('#champPage').append(champBlock);
		$('#champPage').fadeIn('fast');
	})
};
legendaryApp.openList = function(){
	$('header').on('click', function(){
		console.log('click')
		$('#search').val('');
		$('#champList > *').animate({opacity: 1 }, 'fast')
		$('#champList').slideDown('fast');
		$('#champPage').fadeOut('fast');
		$('.champItem').removeClass("fighter-selected infinite");
		legendaryApp.fighter = [];		
	});

	$('#clear').on('click', function(){
		$('#search').val('');
		$('#champList > *').animate({opacity: 1 }, 'fast')
		$('#champList').slideDown('fast');
		$('#champPage').fadeOut('fast');
		$('.champItem').removeClass("fighter-selected bounce infinite");
		legendaryApp.fighter = [];
	});
};
legendaryApp.clickListItem = function(){
	legendaryApp.fighter = [];
	$('.champItem').on('click' ,function(){
		$('#search').val('');
			if (legendaryApp.fighter.length < 1){
				//If array has less than two entries, add the clicked champion
				var getID = $(this).attr("id");
				var champsArray = legendaryApp.champsArray;
				var filteredItem = champsArray.filter(function(item){
					return item.id === parseInt(getID)
				})
				legendaryApp.fighter.push(filteredItem[0]);
			}else{
				let prevFighter = legendaryApp.fighter.shift();
				let uncheckedFighter = $('#champList').find('#' +prevFighter.id);
				var getID = $(this).attr("id");
				var champsArray = legendaryApp.champsArray;
				var filteredItem = champsArray.filter(function(item){
					return item.id === parseInt(getID)
				})
				legendaryApp.fighter.push(filteredItem[0]);
			}
		$('#search').val('');
		legendaryApp.showChampPage();
	});
};
legendaryApp.filterList = function(){
	//
	$('.champItem').on('click' ,function(){
       var searchText = $(this).val().toLowerCase();
       
       $('#champList .champItem').each(function(){
       	var currentLiText = $(this).attr('data-name').toLowerCase();
       	showCurrentLi = currentLiText.indexOf(searchText) !== -1;
           $(this).toggle(showCurrentLi);
       });
   });
	$('#search').keyup(function(){
       var searchText = $(this).val().toLowerCase();
       
       $('#champList .champItem').each(function(){
       	var currentLiText = $(this).attr('data-name').toLowerCase();
       	showCurrentLi = currentLiText.indexOf(searchText) !== -1;
           $(this).toggle(showCurrentLi);
       });
   });
}
legendaryApp.events =  function(){
	legendaryApp.clickListItem();
	legendaryApp.openList();
	legendaryApp.filterList();
};
$(function(){
	legendaryApp.init();
});

var legendaryApp = {};
legendaryApp.searchArray = [];

legendaryApp.key = "23cef05e-21d7-464d-bc92-6294665c2f53";
baseApiUrl = "https://global.api.pvp.net";

legendaryApp.init = function(){
	// var config = {
	// 	apiKey: "AIzaSyCExiGLRJ0of3VA-GEAbtVfgC5hugpqZeA",
	// 	authDomain: "legendaryguides-23852.firebaseapp.com",
	// 	databaseURL: "https://legendaryguides-23852.firebaseio.com",
	// 	projectId: "legendaryguides-23852",
	// 	storageBucket: "legendaryguides-23852.appspot.com",
	// 	messagingSenderId: "706560566518"
	// };
	// firebase.initializeApp(config);
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
		var randoChamp = legendaryApp.getRando(alphArray);
		var key = randoChamp.key;
		var bgImage = randoChamp.skins[0].num;
		$('.bgOverlay').css("background-image","linear-gradient(rgba(30,47,47,0),rgba(30,47,47,0.2),rgba(30,47,47,1)), url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+key+"_"+bgImage+".jpg)");

		// var chronoArray = _.sortBy(rawArray, "id");
		// console.log(chronoArray);
		// legendaryApp.champsArray = chronoArray;
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
		
		// var image = champ.skins[0].num;
		var tags = champ.tags;
		var spriteEl = $(`<img class="champSprite content" alt="${name}">`).attr("src","http://ddragon.leagueoflegends.com/cdn/7.7.1/img/champion/"+sprite);
		var nameEl = $('<h1 class="champName">').text(name);
		var titleEl = $('<h3 class="champTitle">').text(title);
		var headerEl = $('<div class="champHeader">').append(nameEl, titleEl);
		var innerWrapper = $(`<div class="innerWrapper listIconRatio animated">`).append(spriteEl);
		var champItem = $(`<div class="champItem">`).attr({"id":id, "data-name":name,key,tags}).append(innerWrapper, nameEl);

		$('#champGrid').append(champItem).fadeIn('slow');
	})
};
legendaryApp.showChampPage = function(){
	$('#search').val('');
	$('#champPage').empty();
	$('#champList').slideUp('fast');
	let check = 0;
	legendaryApp.fighter.forEach(function(champ){
		// Usable Champ Info
		var sprite = champ.image.full;
		var id = champ.id;
		var key = champ.key;
		var name = champ.name;
		var title = champ.title;
		var bgImage = champ.skins[0].num;
		let lore = champ.lore;
		let passive = champ.passive;
		let abilities = champ.spells;
		var skins = champ.skins;
		console.log(champ);
		//stats
		var attackVal = Math.round(champ.stats.attackdamage);
		var aspeedVal = ((0.625 / (1 + champ.stats.attackspeedoffset))*100).toFixed(2);//number of attacks per second +0.625
		var hpVal = Math.round(champ.stats.hp);
		var movespeedVal = champ.stats.movespeed;
		//HTML Creation
		// set sprite icon
		var spriteEl = $('<img class="champSprite content">').attr("src","http://ddragon.leagueoflegends.com/cdn/7.7.1/img/champion/"+sprite);
		//set name in h1
		var nameEl = $('<h1 class="champName">').text(name);
		// set title
		var titleEl = $('<h2 class="champTitle">').text(title);
		//display spells
		let loreEl = $('<p class="lore">').text(lore);
		let passiveIconEl = $(`<img  class="abilityIcon" src="http://ddragon.leagueoflegends.com/cdn/7.7.1/img/passive/${passive.image.full}" alt="${passive.name}">`);
		let passiveNameEl = $(`<p  class="abilityName">${passive.name}</p>`);
		let passiveDescEl = $(`<p  class="abilityDesc">${passive.sanitizedDescription}</p>`);
		let spellBlockEl = $('<div class="spell">').append(passiveIconEl,passiveNameEl,passiveDescEl);
		let spellsContainerEl = $('<div class="spells">').append(spellBlockEl);

		var statAspeedEl = $('<div class="stat ">').html(`SPEED<p class="aspeed">${aspeedVal}</p>`);
		var statHpEl = $('<div class="stat ">').html(`HEALTH<p class="hp">${hpVal}</p>`);
		var statmovespeedEl = $('<div class="stat ">').html(`DODGE<p class="movespeed">${movespeedVal}</p>`);
		var headerTextEl = $('<div class="champHeaderText">').append(nameEl, titleEl);
		var headerEl = $('<div class="headerBlock">').append(spriteEl,headerTextEl);
		var contentEl = $('<div class="champStats">').append(spellsContainerEl);
		var champBlock = $('<div class="champBlock">').append(headerEl,contentEl);
		var champPage = $('#champPage').append(champBlock);
		
		abilities.forEach((ability) => {
			console.log(ability.name);
			let abilityIconEl = $(`<img class="abilityIcon"src="http://ddragon.leagueoflegends.com/cdn/7.7.1/img/spell/${ability.image.full}">`);
			let abilityNameEl = $(`<p class="abilityName">${ability.name}</p>`);
			let abilityDescEl = $(`<p class="abilityDesc">${ability.sanitizedDescription}</p>`);
			let abilityBlockEl = $('<div class="spell">').append(abilityIconEl,abilityNameEl,abilityDescEl);
			// let spellsContainerEl = $('<div class="spells">').append(abilityBlockEl);
			$('.spells').append(abilityBlockEl);
		});
		var statAttackEl = $('<div class="stat ">').html(`DAMAGE<p class="attack">${attackVal}</p>`);
		var masteryItemEl = $('<div class="masteryBlock--item">').append();
		var masteryBlockEl = $('<div class="masteryBlock">').append();
		$('.bgOverlay').css("background-image","linear-gradient(rgba(30,47,47,0),rgba(30,47,47,0.2),rgba(30,47,47,1)), url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+key+"_"+bgImage+".jpg)");
		$('#champPage').append(champBlock);
		$('#champPage').fadeIn('fast');
		legendaryApp.cycleSplash(key,bgImage, skins);
	})
};
legendaryApp.openList = function(){
	$('#logo, #search').on('click', function(){
		$('#search').val('');
		$('#champList > *').animate({opacity: 1 }, 'fast')
		$('#champList').slideDown('fast');
		$('#champPage').fadeOut('fast');
		legendaryApp.fighter = [];		
	});

	$('#clear').on('click', function(){
		$('#search').val('');
		$('#champList > *').animate({opacity: 1 }, 'fast')
		$('#champList').slideDown('fast');
		$('#champPage').fadeOut('fast');
		legendaryApp.fighter = [];
	});
};
legendaryApp.clickListItem = function(){
	legendaryApp.fighter = [];
	$('.champItem').on('click' ,function(){
		$('#search').val('');
			if (legendaryApp.fighter.length < 1){
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

	$('#logo, #x').on('click', function(){
		legendaryApp.searchArray = [];
		// var searchText = $(this).val("");
		$('input').prop('checked', false);
		$('#champList .champItem').each(function(){
			 $(this).toggle(true);
		});
	});
	$('#search').on('active', function(){
		let searchText = $(this).val("");   
		$('#champList .champItem').each(function(){
			 $(this).toggle(true);
		});
	});
	$('.tabs label').on('click', function(e){
		// var searchText = $(this).attr("id");  
		// $('#champList .champItem').each(function(){
		// 	$('input').prop('checked', false);
		// 	var currentLiText = $(this).attr('tags').toLowerCase();
		// 	showCurrentLi = currentLiText.indexOf(searchText) !== -1;
		// 	$(this).toggle(showCurrentLi);
		// });

		let thisID = $(this).attr("id");
		let thisTab = $(`.tabs .tab#${thisID}`);
		if (thisTab[0].checked === true && thisTab[0].id !== "x" ){
			let thisIndex = legendaryApp.searchArray.indexOf(thisID);
			legendaryApp.searchArray.splice(thisIndex, 1);
		} else {
			legendaryApp.searchArray.push(thisID);
		}
		$('#champList .champItem').each(function() {
			const champ = $(this);
			const tags = champ.attr('tags').toLowerCase().split(',');
			const isRole = !tags.reduce(
				(wasRole, tag) => legendaryApp.searchArray.includes(tag) ? wasRole -1 : wasRole
			, legendaryApp.searchArray.length);
			champ.toggle(isRole);
		});
	});
	$('#search').keyup(function(){
		let searchTextRaw = $(this).val().toLowerCase();
		searchTextSpaceless = searchTextRaw.replace(/\s+/g, '');
		searchText = searchTextSpaceless.replace(/[^\w\s]|_/g, '');
		$('#champList .champItem').each(function(){
				let currentLiKey = $(this).attr('key').toLowerCase();
				showCurrentLi = currentLiKey.indexOf(searchText) !== -1;
				$(this).toggle(showCurrentLi);
		});
		// if ($('#search').val() === ""){
		// 	$('input').prop('checked', false);
		// 	$('#champList .champItem').each(function(){
		// 		 $(this).toggle(true);
		// 	});
		// }
	});
}
legendaryApp.cycleSplash = (name, number) => {
	$('#champPage .champSprite').on('click', () => {
		

		function checkImage (src, good, bad) {
		    let img = new Image();
		    img.onload = good; 
		    img.onerror = bad;
		    img. src = src;
		}
		number++;
		checkImage( "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+name+"_"+number+".jpg",
			function(){
				$('.bgOverlay').css("background-image","linear-gradient(rgba(30,47,47,0),rgba(30,47,47,0.2),rgba(30,47,47,1)), url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+name+"_"+number+".jpg)");
			},
			function(){
				number = 0;
				$('.bgOverlay').css("background-image","linear-gradient(rgba(30,47,47,0),rgba(30,47,47,0.2),rgba(30,47,47,1)), url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+name+"_"+number+".jpg)");
			}
		);
	})
}

legendaryApp.getRando =	function getRandomArrayElement(array) {
	let randoNum = Math.floor(Math.random()*array.length);
	return array[randoNum];
}
legendaryApp.events =  function(){
	legendaryApp.clickListItem();
	legendaryApp.openList();
	legendaryApp.filterList();
};
$(function(){
	legendaryApp.init();
});

'use strict'
// cat data model

function createCats(nb) {
	
	var cats=[];
	
	for(var i=0; i<nb; i++){
		var cat = {
			num: i,
			startStation:{},
			currentStation:{},
			isFounded: false,
			isTrapped: false
		}
		cats.push(cat);
	}
	
	return cats;
}


exports.createCats = createCats;

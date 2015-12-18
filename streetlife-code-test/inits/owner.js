'use strict'
// owner data model

function createOwners (nb){
	
	var owners=[];
	
	for(var i=0; i < nb; i++){
		
		var owner={
			num:i,
			startStation:{},
			currentStation:{},
			traveledStations:[],
			isFound: false,
			isTrapped: false
		}
		
		owners.push(owner);
	}
	
	
	return owners;
	
}

exports.createOwners= createOwners;
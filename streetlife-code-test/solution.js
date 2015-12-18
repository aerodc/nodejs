'use strict'

var initdata= require("./inits/init-data");
var _ = require("lodash");

var maxMovs= 100000;

// read number of owner and cat from command line
var nb = Number(process.argv[2]);


// init all global data
var stationMap = initdata.init.makeStationMap().stationMap;

var cats_owners = initdata.init.makeCatsAndOwners(nb, stationMap);

var cats=cats_owners.cats;

var owners=cats_owners.owners;

// the main searching process

var counterMov=0;
var catsFoundedNB=0;
for (var k = 0; k < maxMovs; k++) {

	if (isAllCatsFound()) {
		break;
	} else {
		for (var h = 0; h < nb; h++) {

			if (!owners[h].isFound && !owners[h].isTrapped && owners[h].currentStation.id === cats[h].currentStation.id) {
				owners[h].isFound = true;
				cats[h].isFounded = true;
				catsFoundedNB++;
				closeStation(owners[h].currentStation);
				console.log("Owner " +h+ " found cat " + h + "  - " + owners[h].currentStation.name + " is now closed.");
				output("Owner " +h+ " found cat " + h + "  - " + owners[h].currentStation.name + " is now closed.");
			} else {
				if (!owners[h].isFound && !owners[h].isTrapped) {
					if (!cats[h].isTrapped)
						catMove(cats[h]);
					ownerMove(owners[h]);
					counterMov++;
				}

			}
		}

	}
}

console.log("Total number of cats: "+nb);
output("Total number of cats: "+nb);
console.log("Number of cats found: "+catsFoundedNB);
output("Number of cats found: "+catsFoundedNB);
console.log("Average number of movements required to find a cat: "+counterMov/catsFoundedNB);
output("Average number of movements required to find a cat: "+counterMov/catsFoundedNB);





// cat move to next station randomly

function catMove(cat){

	if(!cat.isFounded && !cat.isTrapped){
		
		updateNextStations(cat.currentStation);
		
		var base=cat.currentStation.next.length;
		
		if (base == 0)
			cat.isTrapped = true;
		else {
			var rc = Math.floor((Math.random() * base));
			cat.currentStation = getStationById(cat.currentStation.next[rc]);

		}
	}
	
	
}

// owner move to next station

function ownerMove(owner){
	
	owner.traveledStations.push(owner.currentStation.id);
	
	updateNextStations(owner.currentStation);
	
	updateOwnerNextStations(owner);
	
	
}


// owner's next move strategy
function updateOwnerNextStations(owner){
	
	// 1: remove the stations travelled
	if(!owner.isFound && !owner.isTrapped){
		for(var i=0; i< owner.traveledStations.length;i++){
			owner.currentStation.next= _.remove(owner.currentStation.next, function(n) {
  				return n ==owner.traveledStations[i];
			});	
		}
	
		if(owner.currentStation.next.length==0)
			owner.trapped=true;
		else{	
	// 2. choose the next station which has the most connections to avoid be trapped quickly
			var maxConnections=0;
			var nextStationId;
			
			for(var j=0; j< owner.currentStation.next.length;j++){
				var maxTmp=getMaxConnectios(owner.currentStation.next[j]);
				if(maxTmp > maxConnections){
					nextStationId=j;
					maxConnections=maxTmp;
				}
			}
			
			owner.currentStation=getStationById(nextStationId);
		}
	} 
	
}


function getMaxConnectios(id){
	
	var st = getStationById(id);
	
	return st.next.length;
}


function updateNextStations(station){
	
	var index1=_.findIndex(stationMap, function(chr) {
  			return chr.id == station.id;
	})
	
	station.next=stationMap[index1].next;
}

function closeStation(station){
	
	getStationById(station.id).closed=true;
	
	// remove this Station from others' next array
	for(var i=0; i< station.next.length;i++){
		
		var index1=_.findIndex(stationMap, function(chr) {
  			return chr.id == station.next[i];
		})
		
		stationMap[index1].next= _.remove(stationMap[index1].next, function(n) {
  			return n ==station.id;
		});		
	}
}


function checkStationClosed(id){
	
	
	if(getStationById(id).closed){
		return true;
	}else{
		return false;
	}	
	
}

function getStationById(id){
	
	var index1=_.findIndex(stationMap, function(chr) {
  		return chr.id == id;
	})
	
	return stationMap[index1];
	
}

function isAllCatsFound(){
	
	var res=true;
	for(var i=0; i<nb; i++){
		if(!cats[i].isFounded){
			res=false;
			break;
		}
	}
	
	return res;
}

function output(input){
	var fs = require('fs');
	fs.appendFile("./output.txt", input+"\r\n", function(err) {
    if(err) {
        return console.log(err);
    }
});
	
}
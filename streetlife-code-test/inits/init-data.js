'use strict'
var fs = require("fs");

var Cat = require("./cat");

var Owner = require("./owner");

var _ = require("lodash");


// read given data files 
var stationNames = JSON.parse(fs.readFileSync('./resources/tfl_stations.json', 'utf8'));

var nbStations = stationNames.length;

var stationConnections = JSON.parse(fs.readFileSync('./resources/tfl_connections.json', 'utf8'));


// make stationMap using two dimensional array
function makeStationMap (){
	
	var stationMap=[];
	
	var result = {}
	
	for(var i=0; i<nbStations; i++){
		var station = {};
		station.id= stationNames[i][0];
		station.name=stationNames[i][1];
		station.closed=false;
		station.next=[];
		for(var j=0; j<stationConnections.length; j++){
			if(stationConnections[j][0]===station.id){
				station.next.push(stationConnections[j][1]);
			}
			if(stationConnections[j][1]===station.id){
				station.next.push(stationConnections[j][0]);
			}
		}
		stationMap.push(station);
	}
	
	
	result={
		stationNames:stationNames,
		stationMap:stationMap
	}
	
	return result;
	
}


// make cats and owners
function makeCatsAndOwners(nb, stationMap){
	
	var result={}
	
	result.cats=Cat.createCats(nb);
	result.owners=Owner.createOwners(nb);
	
	// generate random starting points
	for(var i=0; i<nb; i++){
		
		while(true){
			var r1=Math.floor((Math.random() * nbStations) +1);
			var r2=Math.floor((Math.random() * nbStations) +1);
			var index1=_.findIndex(stationMap, function(chr) {
  					return Number(chr.id) == r1;
			});
			var index2=_.findIndex(stationMap, function(chr) {
  					return Number(chr.id) == r2;
			});
			
			if((r1!=r2) && (index1>=0)&&(index2>=0)){
				result.cats[i].startStation=stationMap[index1];
				result.cats[i].currentStation=stationMap[index1];
				
				result.owners[i].startStation=stationMap[index2];
				result.owners[i].currentStation=stationMap[index2];
				break;
			}
		}
		
	}
	
	return result;
}



exports.init ={
	makeStationMap: makeStationMap,
	makeCatsAndOwners: makeCatsAndOwners
}
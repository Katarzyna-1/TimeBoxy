const fill = document.querySelector('.basefill');
const empties = document.querySelectorAll('.empty');
const trashArea = document.getElementById('trash-delete');

trashArea.addEventListener('dragover', dragOver);
trashArea.addEventListener('dragenter', dragEnter);
trashArea.addEventListener('dragleave', dragLeave);
trashArea.addEventListener('drop', dragDropDelete);

//Fill listeners - nadsluchiwanie przyjścia wypełnienia
fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);


function convertDateIntoString(timeBoxDate) {
	const month = timeBoxDate.getMonth() + 1;
	const day = timeBoxDate.getDate().toString();
	
	const monthToAdd = month.toString().length === 1? '0' + month : month;
	const dayToAdd = day.length === 1? '0' + day : day;
	return timeBoxDate.getFullYear() + '-' + monthToAdd + '-' + dayToAdd;
}

function fillEmptyBox(timeBox) {
	for(let index = 0; index < empties.length; index++) {
		if(empties[index].id === timeBox.uiBoxId){
			const newTimeBox = fill.cloneNode(true);
			newTimeBox.setAttribute('backend-id', timeBox.id); 
			empties[index].append(newTimeBox);
		}
	}

} 

function parseResponse(responseText) {
	const response = JSON.parse(responseText);

	for(let index = 0; index < response.length; index++) {
		const timeRecord = response[index];

		for(let index2 = 0; index2 < timeRecord.timeBoxes.length; index2++) {

			fillEmptyBox(timeRecord.timeBoxes[index2]);
		}
	}
}

function pullSaveBoxesData() {
	const currentDate = new Date();
	const dayInTheWeek = currentDate.getDay();
	const requestObject = {};
	let endDate;
	if(dayInTheWeek === 7) {
		endDate = currentDate;
	} else {
		let diff = 7 - dayInTheWeek;
		endDate = new Date();
		endDate.setDate(currentDate.getDate() + diff);

	}
	let startDate;

	if(dayInTheWeek === 1) {
		startDate = currentDate;
	} else {
		let diff = dayInTheWeek - 1;
		startDate = new Date();
		startDate.setDate(currentDate.getDate() - diff - 1);
	
	}
	
	
	requestObject.endDate = convertDateIntoString(endDate);
	requestObject.startDate = convertDateIntoString(startDate);
	requestObject.userId = 1;
	
	const requestObjectJson = JSON.stringify(requestObject);
	const xmlHttpRequest = new XMLHttpRequest();
	const url = "https://evening-wave-26268.herokuapp.com/api/timeTable/getTimeRecordsForATimePeriod";
	
	xmlHttpRequest.onreadystatechange = function() {
	 	if (this.readyState == 4 && this.status == 302) {
	      		parseResponse(this.responseText);
	    }
	};

	xmlHttpRequest.open("POST",url,true);
	xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
	
	xmlHttpRequest.send(requestObjectJson);

}

document.getElementById('table').onload = pullSaveBoxesData();

//Loop through empties and call drag events
for (const empty of empties) {
	empty.addEventListener('dragover', dragOver);
	empty.addEventListener('dragenter', dragEnter);
	empty.addEventListener('dragleave', dragLeave);
	empty.addEventListener('drop', dragDrop);
	empty.addEventListener('dragstart',dragStart);
}




function convertBoxValuesIntoDate(timeBoxDayTimeArr) {
	const timeBoxWeekDay = timeBoxDayTimeArr[0];
	const todayDate = new Date();
	const todayWeekDay = todayDate.getDay();
	const timeBoxDate = todayDate;
	if(todayWeekDay !== timeBoxWeekDay) {
		const difference = timeBoxWeekDay - todayWeekDay; 
		timeBoxDate.setDate(todayDate.getDate() + difference);
	}
	return timeBoxDate; 
}

function convertBoxValuesIntoStringTime(timeBoxDayTimeArr) {
	const timeBoxDate = convertBoxValuesIntoDate(timeBoxDayTimeArr);
	const timeBoxHour = timeBoxDayTimeArr[1];
	const timeBoxMinutes =timeBoxDayTimeArr[2] === 'a' ? '00' : '30';
	
	return convertDateIntoString(timeBoxDate) + 'T' + timeBoxHour + ':' +
	timeBoxMinutes  + ':' + '00.000Z';
}

function sendTimeBoxRequestToBackend(timeBoxDateAndTime, timeBoxDate, id) {
	const requestObject = {};
	const timeCategory = {};
	timeCategory.colour = 'red';
	timeCategory.name = 'praca';
	timeCategory.status = 'praca';
	timeCategory.userId = 1;
	const newTimeBox = {};
	newTimeBox.startTime = timeBoxDateAndTime;
	newTimeBox.endTime = timeBoxDateAndTime;
	newTimeBox.status = 'praca';
	newTimeBox.timeCategory = timeCategory;
	newTimeBox.userId = 1;
	newTimeBox.minutes = 30;
	newTimeBox.value = 'praca';
	newTimeBox.uiBoxId = id;
	
	requestObject.date = timeBoxDate;
	requestObject.userId = 1;
	requestObject.timeBoxes = [];
	requestObject.timeBoxes.push(newTimeBox); 
	
	const requestObjectJson = JSON.stringify(requestObject);
	const xmlHttpRequest = new XMLHttpRequest();
	const url = "https://evening-wave-26268.herokuapp.com/api/timeTable/addTimeRecords";

	xmlHttpRequest.open("POST",url,true);
	xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
	
	xmlHttpRequest.send(requestObjectJson);
	
}

// Drag and drop functions

function dragStart(e) {
	this.className += ' hold';
	if(this.childElementCount > 0) {
		e.dataTransfer.setData("text", this.children[0].getAttribute('backend-id'));	
	}
 	
	console.log('dragStart');
	}


function dragEnd () {
	this.className += ' fill';
	console.log('dragEnd');
	}

function dragOver (e) {
	e.preventDefault();
	console.log('dragOver');
	}

function dragEnter(e) {
e.preventDefault();
this.className += ' hovered';
console.log('dragEnter');
	}

function dragLeave() {
	this.className =' empty';
	console.log('dragLeave');
	}

function dragDrop(){
	if(!this.childElementCount && this.id) {
		this.className = ' fill';
		const newTimeBox = fill.cloneNode(true);
		this.append(newTimeBox);
		const timeBoxDayTimeArr = this.id.split('_');
		if(timeBoxDayTimeArr && timeBoxDayTimeArr.length) {
			const timeBoxDateInString = convertBoxValuesIntoStringTime(timeBoxDayTimeArr);
			const soleTimeBoxDate = convertDateIntoString(convertBoxValuesIntoDate(timeBoxDayTimeArr));
			sendTimeBoxRequestToBackend(timeBoxDateInString, soleTimeBoxDate, this.id); 
		}
		console.log('dragDrop');
		}
	}


// Deleting from the Timetable

	function dragDropDelete(e) {
		if (!this.childElementCount && this.id) {

		}
  		var data = e.dataTransfer.getData("text");
		console.log('id ' + e.dataTransfer.getData('text/plain'));
		console.log('dragDelete ');
	}



// Lid open function

function lidOpen(){

}


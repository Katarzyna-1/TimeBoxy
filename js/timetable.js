const fill = document.querySelector('.basefill');
const empties = document.querySelectorAll('.empty');

//Fill listeners - nadsluchiwanie przyjścia wypełnienia
fill.addEventListener('dragstart', dragStart);
fill.addEventListener('dragend', dragEnd);

//Loop through empties and call drag events
for (const empty of empties) {
	empty.addEventListener('dragover', dragOver);
	empty.addEventListener('dragenter', dragEnter);
	empty.addEventListener('dragleave', dragLeave);
	empty.addEventListener('drop', dragDrop);
}


function convertDateIntoString(timeBoxDate) {
	return timeBoxDate.getFullYear() + '-' + timeBoxDate.getMonth() + '-' + timeBoxDate.getDate();
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

function sendTimeBoxRequestToBackend(timeBoxDateAndTime, timeBoxDate) {
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
	
	requestObject.date = timeBoxDate;
	requestObject.userId = 1;
	requestObject.timeBoxes = [];
	requestObject.timeBoxes.push(newTimeBox); 
	
	const requestObjectJson = JSON.stringify(requestObject);
	const xmlHttpRequest = new XMLHttpRequest();
	const url = "https://evening-wave-26268.herokuapp.com/api/timeTable/addTimeRecords";

	xmlHttpRequest.open("POST",url,true);
	xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
	//	xmlHttpRequest.onreadystatechange = function(){
	//	if(this.readyState == 4 && this.status == 201) {
	//		alert("SUKCES");
	//	};
	//	if(this.readyState == 4 && this.status != 201) {
	//		alert("Fail " + this.responseText);
	//	}
	//};
	
	xmlHttpRequest.send(requestObjectJson);
	
}

// Funkcje przeciągania
function dragStart() {
	this.className += ' hold';
	//setTimeout( () => (this.className = 'invisible'), 0);
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
			sendTimeBoxRequestToBackend(timeBoxDateInString, soleTimeBoxDate); 
		}
		console.log('dragDrop');
		}
	}
	

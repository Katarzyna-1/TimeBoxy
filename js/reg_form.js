const separateStringIntoChars = (value) => {
	const characters = [];
	for(let index = 0; index < value.length; index++){
		characters.push(value[index]);
	}
	return characters;

}

const sendRegisterUserRequest = (name, surname, login, password) => {
	const requestObject = {};
	requestObject.name = name;
	requestObject.surname = surname;
	requestObject.login = login;
	requestObject.password = password;
	const requestObjectJson = JSON.stringify(requestObject);
	const xmlHttpRequest = new XMLHttpRequest();
	const url = "https://evening-wave-26268.herokuapp.com/api/user/add";

	xmlHttpRequest.open("POST",url,true);
	xmlHttpRequest.setRequestHeader("Content-Type", "application/json");
		xmlHttpRequest.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 201) {
		};
		if(this.readyState == 4 && this.status != 201) {
			alert("Fail " + this.responseText);
		}
	};
	
	xmlHttpRequest.send(requestObjectJson);
	
};

const registerUser = () => {
	const name = document.getElementsByName('name')[0].value;
	const surname = document.getElementsByName('surname')[0].value;
	const login = document.getElementsByName('login')[0].value;
	const password = document.getElementsByName('password')[0].value;
	const passwordAsChars = separateStringIntoChars(password);
	sendRegisterUserRequest(name, surname, login, passwordAsChars);
};


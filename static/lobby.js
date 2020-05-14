document.addEventListener('DOMContentLoaded', () => {

	if (localStorage.getItem('channel') !== "" or localStorage.getItem('channel') !== "null" ){
		channel=localStorage.getItem('channel')
		window.location.href = `../channel/${channel}`
	}
	// document.querySelector('#subheader').innerHTML=localStorage.getItem('channel')

	// By default, submit button is disabled
	document.querySelector('#submit').disabled = true;

	// Enable button only if there is text in the input field
	document.querySelector('#new_channel_name').onkeyup = () => {
		if (document.querySelector('#new_channel_name').value.length > 0){
			document.querySelector('#submit').disabled = false;
		}
		else{
			document.querySelector('#submit').disabled = true;
		}
	};			

});
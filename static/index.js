document.addEventListener('DOMContentLoaded', () => {

	var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

	const channel=document.querySelector('#channel_name').innerHTML;
	localStorage.setItem('channel',channel)

	// By default, submit button is disabled
	document.querySelector('#submit').disabled = true;

	// Enable button only if there is text in the input field
	document.querySelector('#message').onkeyup = () => {
		if (document.querySelector('#message').value.length > 0){
			document.querySelector('#submit').disabled = false;
		}
		else{
			document.querySelector('#submit').disabled = true;
		}   	
	};

	//change color of text
	// document.querySelector('#color-change').onchange = function() {

 //        var x = document.getElementsByClassName("mines")
 //        for (i=0;i<x.length;i++){
 //        	x[i].style.color = this.value;
 //        }
 //    }

	socket.on('connect', () => {
		// document.onload=()=>{
		var name=document.querySelector('#user_name').innerHTML
		const channel=document.querySelector('#channel_name').innerHTML;
		socket.emit('joined',name,channel);
		// }
	
	

		// When a new message is submitted
		document.querySelector('#new_msg').onsubmit = () => {
			const single_msg=document.querySelector('#message').value;
			const channel=document.querySelector('#channel_name').innerHTML;
			const msgcolor=document.querySelector('#color-change').value;
			socket.emit('submit msg', single_msg, channel,msgcolor);
			// Clear input field
			document.querySelector('#message').value = '';
			document.querySelector('#submit').disabled = true;	
			// Stop form from submitting
			return false;				
		}
		// When you change text color
		document.querySelector('#color-change').onchange = function() {
			var name=document.querySelector('#user_name').innerHTML;
			socket.emit('change color',this.value,name)
		}

		//When you go back to lobby
		document.querySelector('#back_to_lobby').onclick = () => {
			var name=document.querySelector('#user_name').innerHTML;
			const channel=document.querySelector('#channel_name').innerHTML;
			socket.emit('user left',name,channel)
		}
		// //When you logout
		// document.querySelector('#logout_button').onclick = () => {
		// 	var name=document.querySelector('#user_name').innerHTML;
		// 	socket.emit('user left',name)
		// }
	})
	socket.on('updated msgs',data =>{
		// Create new item for list
		const li = document.createElement('div');
		const channel=document.querySelector('#channel_name').innerHTML;
		var msginfo=data.lastmsg
		if (data.currchannel===channel){
			if(msginfo.user===document.querySelector('#user_name').innerHTML){
				li.innerHTML = `${msginfo.msg} | ${msginfo.time} | ${msginfo.user}`;
				li.className = "mines";			
				li.style.textAlign = "right";
				li.style.color=data.msgcolor;

			}
			else{
				li.innerHTML = `${msginfo.user} | ${msginfo.time} | ${msginfo.msg}`;
				li.className = "notmines";
				li.style.textAlign = "left";	
				li.style.color=data.msgcolor;
			}
		}


		// Add new item to task list
		document.querySelector('#chatbox').appendChild(li);
	})

	socket.on('update color',data =>{
		var x = document.getElementById("chatbox").querySelectorAll("div");
		var searchName=(data.name)
		for ( i = 0; i < x.length; i++) {
			if (x[i].innerHTML.includes(searchName)){
				x[i].style.color=(data.color)
			}
		}

	})
		
	socket.on('update users',data =>{
		var name=document.querySelector('#user_name').innerHTML;
		const parent = document.getElementById("userslogged");
		const channel=document.querySelector('#channel_name').innerHTML;
		var userlist=data.inchannel;
		if (data.currchannel===channel){
			while (parent.firstChild) {
	    		parent.firstChild.remove();
				}
			for ( j = 0; j < userlist.length; j++) {
				const li = document.createElement('div');
				li.innerHTML=""
				li.innerHTML=userlist[j]
				document.querySelector('#userslogged').appendChild(li);				
			}
		}
	})

	socket.on('pop user',data =>{
		var x = document.getElementById("userslogged").querySelectorAll("div");
		var name=document.querySelector('#user_name').innerHTML;
		const channel=document.querySelector('#channel_name').innerHTML;
		var userpop=data.userpop
		if (data.currchannel===channel){
			for ( i = 0; i < x.length; i++) {
				if (x[i].innerHTML===userpop){
					document.querySelector("#userslogged").removeChild(x[i]);
				}
			}
		}
	})

	document.querySelector('#back_to_lobby').onclick = () => {		
		localStorage.setItem('channel',"")
	}

});
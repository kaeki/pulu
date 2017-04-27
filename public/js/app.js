
const fetchUser = () => {
	const url = app.url+'/api/user';
	fetch(url, {
		method: 'GET',
		mode: 'no-cors',
		credentials: 'include',
	}).then((response) => {
		return response.json();
	}).then((json) => {
		app.setUser(json);
	}).catch((err) => {
		console.log(err);
	});
};

const roomModals = {
	init: function() {
		document.querySelector('#addRoomBtn')
		.addEventListener('click', (evt) => {
			this.addRoom();
		});
		document.querySelector('#createRoomBtn')
		.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.createRoom();
		});
	},
	addRoom: function() {
		const roomId = document.querySelector('#roomIdInput').value;
		if(roomId.length == 0) {
			alert('Please give an id for room');
		} else {
			const url = app.url+'/api/addroom/'+roomId;
			console.log(url);
			fetch(url, {
				method: 'POST',
				body: {},
				mode: 'no-cors',
				credentials: 'include',
			}).then((response) => {
				return response.json();
			}).then((json) => {
				if (json.status == 'error') {
					alert(json.message);
				} else {
					app.init();
				}
			}).catch((err) => {
				console.log(err);
			});
		}
	},
	createRoom: function() {
		const roomName = document.querySelector('#roomNameInput').value;
		if(roomName.length == 0) {
			alert('Please give a name for your new and mighty room.');
		} else {
			const url = app.url+'/api/createroom/'+roomName;
			console.log(url);
			fetch(url, {
				method: 'POST',
				body: {},
				mode: 'no-cors',
				credentials: 'include',
			}).then((response) => {
				return response.json();
			}).then((json) => {
				console.log(json);
				app.init();
			}).catch((err) => {
				console.log(err);
			});
		}
	},
};

const sidebarView = {
	init: function() {
		this.roomsTable = document.querySelector('#roomsTable');
	},
	render: function(rooms) {
		const table = this.roomsTable;
		table.innerHTML = '';
		console.log(rooms);
		if (rooms.length == 0) {
			table.innerHTML = `<tr>
				<th scope="row">0</th>
				<td>No rooms yet ;__;</td>
				</tr>`;
		} else {
			let i = 0;
			rooms.forEach((room) => {
				i++;
				const row = document.createElement('tr');
				const temp = `<th scope="row"">${i}</th>
					<td>#${room.name}</td>`;
				row.innerHTML = temp;
				row.addEventListener('click', (evt) => {
					return chat.connect(room);
				});
				table.appendChild(row);
			});
		}
	},
};
const chat = {
	init: function() {
		this.messages = document.querySelector('#messages');
		this.socket = io.connect('http://localhost:5000');
		this.socket.on('message', (msg) => {
			const timeStamp = new Date(msg.time).toLocaleTimeString('FI');
			const newMessage = `<div class="card><div class="card-block>
				<p>${timeStamp} - <strong>${msg.user}:</strong> ${msg.text}</p>
				</div></div>`;
			messages.innerHTML += newMessage;
		});
		this.socket.on('connect', () => {
			console.log('socket.io connected');
		});
		this.socket.on('disconnect', () => {
			console.log('socket.io disconnected');
		});
		document.querySelector('#sendMessageForm')
			.addEventListener('submit', (evt) => {
				evt.preventDefault();
				chat.sendMessage();
				evt.target.reset();
		});
		this.title = document.querySelector('#roomTitle');
		this.id = document.querySelector('#roomId');
	},
	connect: function(room) {
		this.title.innerHTML = '#'+room.name;
		this.id.innerHTML = '- '+room._id;
		this.messages.innerHTML = '';
		this.socket.emit('room', room._id);
	},
	sendMessage: function sendMsg() {
		console.log('send message');
		const newMessage = document.querySelector('#newMessage').value;
		const msg = {
			time: Date.now(),
			user: app.getUser().name,
			text: newMessage,
			json: 'json',
		};
		this.socket.emit('message', msg);
	},
};

const app = {
	url: 'http://localhost:5000',
	init: function() {
		chat.init();
		roomModals.init();
		sidebarView.init();
		fetchUser();
	},
	setUser: function(user) {
		console.log(user);
		this.user = user;
		sidebarView.render(user.rooms);
	},
	getUser: function() {
		return this.user;
	},
};

app.init();






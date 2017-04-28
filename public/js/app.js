
const fetchUser = () => {
	const url = '/api/user';
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
			const url = '/api/addroom/'+roomId;
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
			const url = '/api/createroom/'+roomName;
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
		this.roomsList = document.querySelector('#roomsList');
		this.tabs = document.querySelector('#messageTabs');
		this.title = document.querySelector('#roomTitle');
		this.id = document.querySelector('#roomId');
	},
	render: function(rooms) {
		const self = this;
		self.roomsList.innerHTML = '';
		console.log(rooms);
		if (rooms.length == 0) {
			self.roomsList.innerHTML = `
				<li>Add/Create rooms and start chatting</li>`;
		} else {
			for(let i = 0; i < rooms.length; i++) {
				const li = self.createListEntry(rooms[i], (i == 0));
				self.roomsList.appendChild(li);
				const tab = self.createChatTab(rooms[i], (i==0));
				self.tabs.innerHTML += tab;
				chat.connect(rooms[i]);
			}
		}
	},
	createListEntry: function(room, first) {
		const self = this;
		const li = document.createElement('li');
		li.setAttribute('class', 'nav-item');
		const temp = `<a class="nav-link" 
			data-toggle="tab" 
			href="#${room.name}" 
			role="tab">${room.name}</a>
		</li>`;
		li.innerHTML = temp;
		if(first) {
			li.querySelector('a').setAttribute('class', 'nav-link active');
		}
		li.addEventListener('click', (evt) => {
			self.title.innerHTML = room.name;
			self.id.innerHTML = room._id;
		});
		return li;
	},
	createChatTab: function(room, first) {
		const self = this;
		if(first) {
			self.title.innerHTML = room.name;
			self.id.innerHTML = room._id;
			return `<div class="tab-pane active" 
			id="${room.name}" role="tabpanel"></div>`;
		} else {
			return `<div class="tab-pane" 
			id="${room.name}" role="tabpanel"></div>`;
		}
	},
};

const chat = {
	init: function() {
		this.messages = document.querySelector('#messages');
		this.msgContainer = document.querySelector('#msgContainer');
		this.socket = io.connect('/');
		this.socket.on('message', (msg) => {
			const timeStamp = new Date(msg.time).toLocaleTimeString('FI');
			const newMessage = `<div class="card><div class="card-block>
				<p>${timeStamp} - <strong>${msg.user}:</strong> ${msg.text}</p>
				</div></div>`;
			document.querySelector('#'+msg.room).innerHTML += newMessage;
			this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
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
	},
	connect: function(room) {
		this.socket.emit('room', room._id);
	},
	sendMessage: function sendMsg() {
		console.log('send message');
		const newMessage = document.querySelector('#newMessage').value;
		const roomName = document.querySelector('#roomTitle').innerText;
		const roomId = document.querySelector('#roomId').innerText;
		const msg = {
			roomId: roomId,
			room: roomName,
			time: Date.now(),
			user: app.getUser().name,
			text: newMessage,
			json: 'json',
		};
		this.socket.emit('message', msg);
	},
};

const app = {
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






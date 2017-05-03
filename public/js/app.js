// GET USER DATA
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

// ROOM CREATING AND ADDING
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
					app.addRoom(json);
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
			fetch(url, {
				method: 'POST',
				body: {},
				mode: 'no-cors',
				credentials: 'include',
			}).then((response) => {
				return response.json();
			}).then((json) => {
				console.log(json);
				app.addRoom(json);
			}).catch((err) => {
				console.log(err);
			});
		}
	},
};

// SIDEBAR VIEWS FOR ROOMS AND USERS
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
				if (i == 0) {
					console.log(rooms[i]._id);
					app.currentRoom= rooms[i]._id;
				}
				const li = self.createListEntry(rooms[i], (i == 0));
				self.roomsList.appendChild(li);
				const tab = self.createChatTab(rooms[i], (i==0));
				self.tabs.innerHTML += tab;
				chat.connect(rooms[i]);
			}
			usersSideBar.init();
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
			app.currentRoom = room._id;
			usersSideBar.init();
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

const usersSideBar = {
	init: function() {
		this.list = document.querySelector('#usersList');
		this.list.innerHTML = '';
		const id = app.currentRoom;
		const url = '/api/room/'+id+'/users';
		fetch(url, {
			method: 'GET',
			mode: 'no-cors',
			credentials: 'include',
		}).then((response) => {
			return response.json();
		}).then((json) => {
			usersSideBar.render(json.users);
		}).catch((err) => {
			console.log(err);
		});
	},
	render: function(users) {
		users.forEach((user) => {
			const item = usersSideBar.createListEntry(user);
			usersSideBar.list.appendChild(item);
		});
	},
	createListEntry: function(user) {
		const li = document.createElement('li');
		li.innerHTML = user.username;
		if(user.online) {
			li.setAttribute('class', 'user-online');
		} else {
			li.setAttribute('class', 'user-offline');
		}
		return li;
	},
};

// CHAT RELATED ThINGS
const chat = {
	init: function() {
		this.messages = document.querySelector('#messages');
		this.msgContainer = document.querySelector('#msgContainer');
		this.socket = io.connect('/');
		this.socket.on('message', (msg) => {
			const newMessage = `<div class="card><div class="card-block>
				<p><strong>${msg.user}:</strong> ${msg.text}</p>
				</div></div>`;
			document.querySelector('#'+msg.room).innerHTML += newMessage;
			this.msgContainer.scrollTop = this.msgContainer.scrollHeight;
		});
		this.socket.on('connect', () => {
			console.log('socket.io connected');
		});
		this.socket.on('disconnect', () => {
			fetch('/logout', {
				method: 'GET',
				mode: 'no-cors',
			});
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

// VIDEO CHAT
const videoChat = {
	init: function() {
		this.local = document.querySelector('#local');
		this.container = document.querySelector('#videoContainer');
		this.title = document.querySelector('#videoChatTitle');
		document.querySelector('#startVideoBtn').addEventListener(
			'click', (evt) => {
				videoChat.start();
		});
		document.querySelector('#hangupBtn').addEventListener(
			'click', () => {
				videoChat.stop();
			}
		);
		this.rtc = new SimpleWebRTC({
			url: '/',
			localVideoEl: 'local',
			remoteVideosEl: '',
			autoRequestMedia: true,
		});
		videoChat.grid();
	},
	grid: function() {
		$('#videoContainer').sortable({
			stop: function(event, ui) {
				const video = ui.item.find('video').get(0);
				video.play();
			},
		});
		$('#videoContainer').disableSelection();
		$('.resizable-video')
			.resizable({
				grid: [40, 30],
				aspectRatio: 4 / 3,
				maxWidth: 640,
				maxHeight: 480,
			});
	},
	start: function() {
		console.log('start');
		$('#startVideoBtn').hide();
		$('#hangupBtn').show();
		$('#videoChat').show();
		const room = document.querySelector('#roomId').value;
		this.title.innerHTML = document.querySelector('#roomTitle').innerHTML;
		videoChat.connect(this.rtc, room);
	},
	stop: function() {
		console.log('stop');
		$('#startVideoBtn').show();
		$('#hangupBtn').hide();
		$('#videoChat').hide();
		this.rtc.stopLocalVideo();
		this.rtc.leaveRoom();
	},
	connect: function(room) {
		console.log('connect');
		this.rtc.joinRoom(room);
		this.rtc.on('videoAdded', (video, peer) => {
			videoChat.add(video, peer);
		});
		this.rtc.on('videoRemoved', function(video, peer) {
			videoChat.remove(video, peer);
		});
	},
	add: function(video, peer) {
		console.log('video added', peer);
		const container = document.createElement('div');
		container.setAttribute('class', 'resizable-video');
		container.setAttribute('id', 'container_' + webrtc.getDomId(peer));
		container.appendChild(video);
		// suppress contextmenu
		video.oncontextmenu = function() {
			return false;
		};
		this.container.appendChild(container);
	},
	remove: function(video, peer) {
		console.log('video removed ', peer);
		const videoEl = document.getElementById(
			peer ? 'container_'+webrtc.getDomId(peer) : 'local'
		);
		if (this.container && videoEl) {
			this.container.removeChild(videoEl);
		}
	},
};

// "CONTROLLER"
const app = {
	currentRoom: '',
	init: function() {
		$('#videoChat').hide();
		$('#hangupBtn').hide();
		chat.init();
		videoChat.init();
		roomModals.init();
		sidebarView.init();
		fetchUser();
	},
	setUser: function(user) {
		console.log(user);
		this.user = user;
		sidebarView.render(user.rooms);
	},
	addRoom: function(room) {
		this.user.rooms.push(room);
		sidebarView.render(this.user.rooms);
	},
	getUser: function() {
		return this.user;
	},
};

app.init();

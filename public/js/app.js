
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
			this.createRoom();
		});
	},
	addRoom: function() {
		const roomId = document.querySelector('#roomIdInput').value;
		console.log(roomId);
	},
	createRoom: function() {
		const roomName = document.querySelector('#roomNameInput').value;
		console.log(roomName);
	},
};

const sidebarView = {
	init: function() {
		this.roomsTable = document.querySelector('#roomsTable');
	},
	render: function(rooms) {
		const table = this.roomsTable;
		table.innerHTML = '';
		if (rooms.length == 0) {
			table.innerHTML = `<tr>
				<th scope="row">0</th>
				<td>No rooms yet ;__;</td>
				</tr>`;
		} else {
			let i = 0;
			rooms.foreach((room) => {
				i++;
				const row = document.createElement('tr');
				const temp = `<th scope="row"">${i}</th>
					<td>#${room.name}</td>`;
				row.innerHTML = temp;
				row.addEventListener('click', (evt) => {
					return chat.connect(room._id);
				});
				table.appendChild(row);
			});
		}
	},
};

const app = {
	url: 'http://localhost:5000',
	init: function() {
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

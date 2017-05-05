// VIDEO CHAT
const videoChat = {
	init: function() {
		this.local = document.querySelector('#local');
		this.container = document.querySelector('#videoContainer');
		this.title = document.querySelector('#videoChatTitle');
        $('#localMute').hide();
		document.querySelector('#startVideoBtn').addEventListener(
			'click', (evt) => {
				videoChat.start();
		});
		document.querySelector('#hangupBtn').addEventListener(
			'click', () => {
				videoChat.stop();
			}
		);
        document.querySelector('#localUnmute').addEventListener(
			'click', () => {
				videoChat.rtc.unmute();
                $('#localUnmute').hide();
                $('#localMute').show();
			}
		);
        document.querySelector('#localMute').addEventListener(
			'click', () => {
				videoChat.rtc.mute();
                $('#localMute').hide();
                $('#localUnmute').show();
			}
		);
		videoChat.grid();
	},
	grid: function() {
		$('#videoContainer').sortable({
			stop: function(event, ui) {
				const video = ui.item.find('video').get(0);
				video.play();
			},
		});
		$('.resizable-video')
			.resizable({
				grid: [64, 48],
				aspectRatio: 4 / 3,
				maxWidth: 960,
				maxHeight: 640,
			});
	},
	start: function() {
		console.log('start');
		$('#startVideoDiv').hide();
		$('#videoChatControls').show();
		$('#videoChat').show();
		const room = document.querySelector('#roomId').innerHTML;
		this.title.innerHTML = document.querySelector('#roomTitle').innerHTML;
		videoChat.connect(room);
	},
	stop: function() {
		console.log('stop');
		$('#startVideoDiv').show();
		$('#videoChatControls').hide();
		$('#videoChat').hide();
		this.rtc.stopLocalVideo();
		this.rtc.leaveRoom();
		this.rtc.connection.disconnect();
	},
	connect: function(room) {
		console.log('connect');
		this.rtc = new SimpleWebRTC({
			url: ':3000',
			localVideoEl: 'local',
			remoteVideosEl: '',
			nick: app.getUser().name,
			autoRequestMedia: true,
		});
		$('#localVideoTitle').text(app.getUser().name);
		this.rtc.joinRoom(room);
		this.rtcInit();
	},
	rtcInit: function() {
		this.rtc.on('videoAdded', (video, peer) => {
			videoChat.add(video, peer);
		});
		this.rtc.on('videoRemoved', function(video, peer) {
			videoChat.remove(video, peer);
		});
        this.rtc.on('audioOn', () => {
            console.log('local audio on');
        });
        this.rtc.on('audioOff', () => {
            console.log('local audio off');
        });
        this.rtc.on('volumeChange', function(volume, treshold) {
            showVolume(document.getElementById('localVolume'), volume);
        });
        this.rtc.on('remoteVolumeChange', function(peer, volume) {
            showVolume(document.getElementById('volume_' + peer.id), volume);
        });
	},
	add: function(video, peer) {
		console.log('video added', peer);
		const container = document.createElement('li');
		container.setAttribute('class', 'ui-state-default resizable-video');
		container.setAttribute('id', 'container_' + this.rtc.getDomId(peer));
		container.appendChild(video);

		// suppress contextmenu
		video.oncontextmenu = function() {
			return false;
		};
		this.container.appendChild(container);
        this.addLabel(container, peer);
        this.addVolumeMeter(container, peer);
		this.grid();
	},
	addLabel: function(elem, peer) {
		const label = document.createElement('p');
		const name = document.createElement('span');
		name.innerText = peer.nick;
		label.appendChild(name);
		elem.appendChild(label);
	},
    addVolumeMeter: function(elem, peer) {
        const vol = document.createElement('meter');
        vol.id = 'volume_' + peer.id;
        vol.className = 'volume';
        vol.min = -45;
        vol.max = -20;
        vol.low = -40;
        vol.high = -25;
        elem.appendChild(vol);
    },
    showVolume: function(el, volume) {
        console.log('showVolume', volume, el);
        if (!el) return;
        if (volume < -45) volume = -45; // -45 to -20 is
        if (volume > -20) volume = -20; // a good range
        el.value = volume;
    },
	remove: function(video, peer) {
		console.log('video removed ', peer);
		const videoEl = document.getElementById(
			peer ? 'container_'+this.rtc.getDomId(peer) : 'local'
		);
		if (this.container && videoEl) {
			this.container.removeChild(videoEl);
		}
	},
};

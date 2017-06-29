function init() {
	document.addEventListener("deviceready",onDeviceReady, false);
}

function onDeviceReady() {
	navigator.notification.beep(2);
	deviceInfo();
	startZ();
}

function deviceInfo() {

	info =  'Device Model   : '    + device.model + '<br>' + 
			'Device Name    : '     + device.name + '<br>' + 
			'Device Cordova : '  + device.cordova + '<br>' + 
			'Device Platform: ' + device.platform + '<br>' + 
			'Device UUID    : '     + device.uuid + '<br>' + 
			'Device Version : '  + device.version + '<br>';

	document.getElementById("deviceDetails").innerHTML = info;	
}


function startZ() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = zeroZ(m);
    s = zeroZ(s);
    document.getElementById('zegar').innerHTML =
    h + ":" + m + ":" + s;
    var t = setTimeout(startZ, 500);
}
function zeroZ(i) {
    if (i < 10) { i = "0" + i };  //zero przed liczbami < 10
    return i;
}


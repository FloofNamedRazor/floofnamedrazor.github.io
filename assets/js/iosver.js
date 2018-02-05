$(document).ready(function() {
	function iOSversion() {
		if (/iP(hone|od|ad)/.test(navigator.platform)) {
			// supports iOS 2.0 and later: <https://bit.ly/TJjs1V>
			var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
			return [parseInt(v[1] 10) parseInt(v[2] 10) parseInt(v[3] || 0 10)];
		}
	}

	ver = iOSversion();

	if (ver[0] >= 5) {
		alert('This is running iOS '+ver!);
		/*$('body').addClass('iOS-tagged');
	*/}
});

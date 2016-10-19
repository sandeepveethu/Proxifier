document.addEventListener('DOMContentLoaded',function(){
	var p1=document.getElementById('proxy1');
	var p2=document.getElementById('proxy2');
	var ps=document.getElementById('proxy-sys');

	checkActiveProxy();
	
	p1.addEventListener('click',setProxy);	
	p2.addEventListener('click',setProxy);
	
	ps.addEventListener('click',function() {
		var config = {
			mode: 'system'
		}
		chrome.proxy.settings.set({value:config,scope:'regular'});
		getColor('#4479BA');
		setColor(this.id,this.innerText);
		proxyChangedNotify();

	});

	//getting working proxies
	var prx_arr = getProxy();
	
	p1.innerText = prx_arr[0];
	p2.innerText = prx_arr[1];

});

function setProxy() {
	var data = (this.innerText).split(':');
	var addr = data[0];
	var prt = parseInt(data[1]);
	
	var config = {
		mode: 'fixed_servers',
		rules: {
			singleProxy:{
				scheme: 'http',
				port: prt,
				host: addr
			},
			bypassList: ['172.*.*.*','202.*.*.*','*.iitg.ernet.in']
		}
	};
	

	getColor('#4479BA'); //reverting color of last set proxy
	setColor(this.id,this.innerText); //changing color of set proxy to green

	chrome.proxy.settings.set(
		{value:config,scope:'regular'},
		function() {
			console.log('proxy changed');
			proxyChangedNotify();
			document.getElementById("curr-proxy").style.display = "none";
	});
}


function getProxy() {
	var proxyArray = [];
	var req = new XMLHttpRequest();
	req.addEventListener('load',function() {
		var doc = document.implementation.createHTMLDocument('');
		doc.documentElement.innerHTML = req.responseText;
		var data = ((doc.getElementsByTagName('body'))[0].innerText).split('\n');
		proxyArray.push((data[36].split(' '))[1]);
		proxyArray.push((data[39].split(' '))[1]);
	});
	req.open('GET','http://172.16.114.121/PROXY_CHECKER/',false); //synchronous request
	req.send(null);
	return proxyArray;
}


function setColor(pid,proxy) {
	chrome.storage.local.set({'setproxyid':pid,'setproxy':proxy},function(){
		document.getElementById(pid).style.background = 'green';
	});
}

function getColor(clr) {
	chrome.storage.local.get(['setproxyid'],function(items){
		document.getElementById(items['setproxyid']).style.background = clr;
	});
}

function proxyChangedNotify() {
	var opt = {
		type: "basic",
		title: "Proxifier",
		message: "Proxy Changed!",
		iconUrl: "icons/icon48.png"
	}
	chrome.notifications.create('proxychanged-msg',opt,function(msg){
		setTimeout(function(){
			chrome.notifications.clear(msg);
		},1000);
	});
}

function checkActiveProxy() {
	chrome.storage.local.get(['setproxyid','setproxy'],function(items) {
		var	pid = items['setproxyid'];
		var val = items['setproxy'];
		if(document.getElementById(pid).innerText!=val) {
			document.getElementById("curr-proxy").style.display = "block";
		}
		else {
			document.getElementById("curr-proxy").style.display = "none";
			getColor('green');
		}
	});
}
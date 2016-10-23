document.addEventListener('DOMContentLoaded',function(){
	var p1=document.getElementById('proxy1');
	var p2=document.getElementById('proxy2');
	var ps=document.getElementById('proxy-sys');
	
	p1.addEventListener('click',setProxy);	
	p2.addEventListener('click',setProxy);
	
	ps.addEventListener('click',function() {
		var config = {
			mode: 'system'
		}
		chrome.proxy.settings.set({value:config,scope:'regular'});
		getColor('#4479BA');
		setColor(this.id,this.innerText);
		checkActiveProxy();
		proxyChangedNotify();
	});

	getProxy();
	//setInterval(getProxy,5000);
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
	checkActiveProxy();

	var req = new XMLHttpRequest();
	
	req.timeout = 2000;
	
	req.addEventListener('load',function() {
		document.getElementById("error").style.display = 'none';		
		var doc = document.implementation.createHTMLDocument('');
		doc.documentElement.innerHTML = req.responseText;
		var data = ((doc.getElementsByTagName('body'))[0].innerText).split('\n');
		document.getElementById("proxy1").innerText = (data[36].split(' '))[1]; 
		document.getElementById("proxy2").innerText = (data[39].split(' '))[1];
		checkActiveProxy();
	});
	
	req.addEventListener('error',function() {
		document.getElementById("error").style.display = 'block';
	})
	
	req.open('GET','http://172.16.114.121/PROXY_CHECKER/');
	req.send(null);
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
	chrome.storage.local.get(['setproxy'],function(items) {
		var val = items['setproxy'];
		var p1txt = document.getElementById('proxy1').innerText;
		var p2txt = document.getElementById('proxy2').innerText;
		var pstxt = document.getElementById('proxy-sys').innerText;

		if(p1txt!=val && p2txt!=val && pstxt!=val) {
			document.getElementById("curr-proxy").style.display = "block";
		}
		else {
			document.getElementById("curr-proxy").style.display = "none";
			getColor('green');
		}
	});
}
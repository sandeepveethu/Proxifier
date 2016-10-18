document.addEventListener('DOMContentLoaded',function(){
	var p1=document.getElementById('proxy1');
	var p2=document.getElementById('proxy2');
	var ps=document.getElementById('proxy-sys');

	getcolor('green');
	
	p1.addEventListener('click',setproxy);	
	p2.addEventListener('click',setproxy);
	
	ps.addEventListener('click',function() {
		var config = {
			mode: 'system'
		}
		chrome.proxy.settings.set({value:config,scope:'regular'});
		getcolor('#4479BA');
		setcolor(this.id);

	});

	var prx_arr = getproxy();

	p1.innerText = prx_arr[0];
	p2.innerText = prx_arr[1];
});

function setproxy() {
	var data = (this.innerText).split(':');
	var addr = data[0];
	var prt = parseInt(data[1]);
	
	var config = {
		mode: 'ixed_servers',
		rules: {
			singleProxy:{
				scheme: 'http',
				port: prt,
				host: addr
			},
			bypassList: ['172.*.*.*','202.*.*.*','*.iitg.ernet.in']
		}
	};
	

	getcolor('#4479BA'); //reverting color of last set proxy
	setcolor(this.id); //changing color of set proxy to green

	chrome.proxy.settings.set(
		{value:config,scope:'regular'},
		function() {
			console.log('proxy changed');
	});
}


function getproxy() {
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


function setcolor(pid) {
	chrome.storage.local.set({'setproxyid':pid},function(){
		document.getElementById(pid).style.background = 'green';
	});
}

function getcolor(clr) {
	chrome.storage.local.get(['setproxyid'],function(items){
		document.getElementById(items['setproxyid']).style.background = clr;
	});
}
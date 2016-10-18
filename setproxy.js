document.addEventListener('DOMContentLoaded',function(){
	var p1=document.getElementById('proxy1');
	var p2=document.getElementById('proxy2');
	var ps=document.getElementById('proxy-sys');


	p1.addEventListener('click',setproxy);	
	p2.addEventListener('click',setproxy);
	ps.addEventListener('click',function() {
		var config = {
			mode: "system"
		}
		chrome.proxy.settings.set({value:config,scope:'regular'});
	});


	var prx_arr = getproxy();

	p1.innerText = prx_arr[0];
	p2.innerText = prx_arr[1];

});

function setproxy() {

}

function setproxy() {
	var data = (this.innerText).split(":");
	var addr = data[0];
	var prt = parseInt(data[1]);
	
	var config = {
		mode: "fixed_servers",
		rules: {
			singleProxy:{
				scheme: 'http',
				port: prt,
				host: addr
			}
		}
	};
	chrome.proxy.settings.set(
		{value:config,scope:'regular'},
		function() {
			console.log("proxy changed");
	});
}


function getproxy() {
	var proxyArray = [];
	var req = new XMLHttpRequest();
	req.addEventListener('load',function() {
		var doc = document.implementation.createHTMLDocument("");
		doc.documentElement.innerHTML = req.responseText;
		var data = ((doc.getElementsByTagName('body'))[0].innerText).split("\n");
		proxyArray.push((data[36].split(" "))[1]);
		proxyArray.push((data[39].split(" "))[1]);
	});
	req.open('GET','http://172.16.114.121/PROXY_CHECKER/',false);
	req.send(null);
	return proxyArray;
}
$(document).ready(function(){
	improvements();
});
var improvements = function(){
	inject(function(){
		if (!window.JSON){
			var s = document.createElement("script");
			s.src = "https://cdnjs.cloudflare.com/ajax/libs/json3/3.3.2/json3.min.js";
			s.type = "text/javascript";
			document.head.append(s);
		}
		var acm_sectColours = {
			"LTE":{},
			"UMTS":{},
			"GSM":{}
		};
		var acm_pickColours = function(earfcn){
			console.info("Colour for :",earfcn);
			var base = ["C70039","581845","FFC300","6C3483","229954","2874A6","117A65","18BC9C","e83e8c"];
			
			// Pick random colour from list as default
			if (typeof window.acm_sectColours[window.netType][earfcn] !== "string"){
				window.acm_sectColours[window.netType][earfcn] = base[Math.floor(Math.random()*base.length)];
				acm_saveColourData();
			}
			
			return window.acm_sectColours[window.netType][earfcn];
		};
		var acm_initialiseColourData = function(){
			if (typeof Storage !== "function" || typeof localStorage !== "object"){
				return;
			}
			var d = localStorage.getItem("colordata-v01");
			if (d === null || d.length <= 2) {
				acm_saveColourData();
				return;
			}
			window.acm_sectColours = JSON.parse(d);
			window.MD5 = acm_pickColours;
		};
		var acm_saveColourData = function(){
			if (typeof window.acm_sectColours !== "object") {
				window.acm_sectColours = {
					"LTE":{},
					"UMTS":{},
					"GSM":{}
				};
			}
			localStorage.setItem("colordata-v01",JSON.stringify(window.acm_sectColours));
		};
		var acm_randomiseColourData = function(){
			if (!confirm("This will randomise all current values. Are you sure you wish to do this?")) return;
			function randHexCol(){
				for (var i = 0,r = "",c = "ABCDEF0123456789";i<6;i++)
					r += c.charAt(Math.floor(Math.random()*c.length));
				return r;
			};
			if (typeof window.acm_sectColours !== "object") {
				window.acm_sectColours = {
					"LTE":{},
					"UMTS":{},
					"GSM":{}
				};
				console.warn("Reset col-list")
			}
			var k = Object.keys(window.acm_sectColours);
			for (var i = 0;i<k.length;i++){
				var r = Object.keys(window.acm_sectColours[k[i]]);
				if (r.length === 0) continue;
				for (var j = 0;j<r.length;j++){
					window.acm_sectColours[k[i]][r[j]] = randHexCol();
				}
			}
			acm_saveColourData();
			acm_refreshColourDataList();
		};
		var acm_initialiseColourSelector = function(){			
			$("<table/>",{"class":"table table-sm"}).append(
				$("<thead/>").append(
					$("<tr/>",{"class":"collapsedSection"}).append(
						$("<td/>").text("Colour Picker")
					)
				),
				$("<tbody/>",{"style":"text-align:center"}).append(
					$("<button/>").text("Refresh List").on("click enter",acm_refreshColourDataList),
					$("<button/>").text("Randomise Colours").on("click enter",acm_randomiseColourData),
					$("<div/>",{"id":"earfcn_colpick_list"}),$("<br/>")
				)
			).insertAfter("#accountTable");
			acm_refreshColourDataList();
		};
		var acm_refreshColourDataList = function(){
			var x = $("#earfcn_colpick_list");
			x.empty();
			if (typeof window.acm_sectColours !== "object") {
				window.acm_sectColours = {
					"LTE":{},
					"UMTS":{},
					"GSM":{}
				};
			}
			var txt = {
				"LTE":"EARFCNs",
				"UMTS":"UARFCNs",
				"GSM":"ARFCNs"
			}
			var k = Object.keys(window.acm_sectColours);
			for (var i = 0;i<k.length;i++){
				var r = Object.keys(window.acm_sectColours[k[i]]);
				if (r.length === 0) continue;
				
				var el = $("<div/>",{
					"style":"width:100%;padding:2%;margin:2px 0 0 0;text-align:center;float:left;"
				}).append(
					$("<div/>",{"style":"width:100%;font-size:1.3rem"}).html("&nbsp;" + txt[k[i]])
				);
				
				for (var j = 0;j<r.length;j++){
					el.append(
						$("<div/>",{"style":"width:25%;float:left;"}).append(
							$("<span/>",{"style":"1.1rem"}).text(r[j]),
							$("<input/>",{
								"type":"color",
								"style":"width:100%",
								"value":"#" + window.acm_sectColours[k[i]][r[j]],
								"data-earfcn":r[j],
								"data-rat":k[i]
							}).on("change",function(){
								console.log("Set",$(this).data("earfcn"),"to",$(this).val());
								window.acm_sectColours[$(this).data("rat")][$(this).data("earfcn")] = $(this).val().substr(1,6);
								acm_saveColourData();
							})
						)
					)
				}
				x.append(el);
			}
		}

		if(window.location.pathname === "/map"){
			$("#tabs-1").find("br").remove();
			$("#notesText").html("Awesome CellMapper by <a href='https://absolutedouble.co.uk'>AbsoluteDouble</a>");
			$("#toast").text("[AwesomeCM]: Loaded!").fadeIn(200).delay(2000).slideUp(450);
			$("nav.navbar").css("background","#1a1a1a !important");
			acm_initialiseColourData();
			acm_initialiseColourSelector();
		}
	},null);
};
var inject = function(code,func){
	var s = document.createElement("script");
	code = code || '';
	s.type = "text/javascript";
	s.textContent = "(" + code + ")("+func+");";
	document.documentElement.appendChild(s);
};
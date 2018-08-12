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
		var acm_sectColours = {};
		var acm_pickColours = function(earfcn){
			console.info("Colour for :",earfcn);
			var base = ["C70039","581845","FFC300","6C3483","229954","2874A6","117A65"];
			
			// Pick random colour from list as default
			if (typeof window.acm_sectColours[earfcn] !== "string"){
				window.acm_sectColours[earfcn] = base[Math.floor(Math.random()*base.length)];
				acm_saveColourData();
			}
			
			return window.acm_sectColours[earfcn];
		};
		var acm_initialiseColourData = function(){
			if (typeof Storage !== "function" || typeof localStorage !== "object"){
				return;
			}
			var d = localStorage.getItem("colordata");
			if (d === null) {
				acm_saveColourData();
				return;
			}
			window.acm_sectColours = JSON.parse(d);
			window.MD5 = acm_pickColours;
		};
		var acm_saveColourData = function(){
			localStorage.setItem("colordata",JSON.stringify(window.acm_sectColours));
		};
		var acm_initialiseColourSelector = function(){
			$("#tabs-1").prepend(
				$("<table/>",{"class":"table table-sm"}).append(
					$("<thead/>").append(
						$("<tr/>",{"class":"collapsedSection"}).append(
							$("<td/>").text("Colour Picker")
						)
					),
					$("<tbody/>").append(
						$("<button/>").text("Refresh List").on("click enter",acm_refreshColourDataList),
						$("<div/>",{"id":"earfcn_colpick_list"}),$("<br/>")
					)
				)
			);
			acm_refreshColourDataList();
		};
		var acm_refreshColourDataList = function(){
			var x = $("#earfcn_colpick_list");
			x.empty();
			var k = Object.keys(window.acm_sectColours);
			for (var i = 0;i<k.length;i++){
				x.append(
					$("<div/>",{"style":"width:20%;float:left;"}).append(
						$("<span/>").text(k[i]),
						$("<input/>",{
							"type":"color",
							"value":"#" + window.acm_sectColours[k[i]],
							"data-earfcn":k[i]
						}).on("change",function(){
							console.log("Set",$(this).data("earfcn"),"to",$(this).val());
							window.acm_sectColours[$(this).data("earfcn")] = $(this).val().substr(1,6);
							acm_saveColourData();
						})
					)
				)
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
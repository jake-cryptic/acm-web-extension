$(document).ready(function(){
	improvements();
});
var improvements = function(){
	inject(function(){
		var assignObserve = function(){
			console.log("Assigned Observer");
			$("#toast").text("[AwesomeCM]: Done!").slideUp(450);
			$("#tabs-2").find("table").css("background-color","rgba(0,0,0,0.4").each(function(e){
				if (this.id !== ""){
					console.log("[AwesomeCM]: MutationAssign:",this.id);
					var tblobserver = new MutationObserver(function(mutations) {
						mutations.forEach(function(mutationRecord) {
							if (mutationRecord.attributeName === "style"){
								var sCol = $(mutationRecord.target).css("background-color");
								if (sCol === "rgb(230, 230, 230)"){
									$(mutationRecord.target).css("background-color","rgba(170,170,170,0.35)");
								} else if (sCol === "rgb(255, 255, 255)"){
									$(mutationRecord.target).css("background-color","rgba(0,0,0,0.4)");
								}
							}
						});    
					});

					tblobserver.observe(document.getElementById(this.id), { attributes: true, childList: true, attributeFilter : ['style'] });
				}
			});
		};

		var assignOverallObserve = function(){
			var observer = new MutationObserver(function(mutations) {
				$("#toast").slideDown(250).text("[AwesomeCM]: Working..");
				setTimeout(assignObserve,2500);
			});

			var target = document.getElementById('tabs-2');
			observer.observe(target, { childList:true });
		};
		
		if(window.location.pathname === "/map"){
			$("#tabs-1").find("br").remove();
			$("#notesText").html("Awesome CellMapper by <a href='https://absolutedouble.co.uk'>AbsoluteDouble</a>");
			$("#toast").text("[AwesomeCM]: Loaded!").fadeIn(200).delay(2000).slideUp(450);
			$("nav.navbar").css("background","#1a1a1a !important");
			assignOverallObserve();
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
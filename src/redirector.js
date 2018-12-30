var settings = {
	cacheSettings:{
		firstParty:true,
		thirdParty:true,
		apiRequests:false
	},
	blockPiwik:false
};

var assets = {
	fakePiwik:'cm_assets/__fakepiwik.js',
	
	firstParty:{
		// Site Files
		'/manifest.json':'cm_assets/first/cm_manifest.json',
		'/css/bootstrap-style.css':'cm_assets/first/bootstrap-style.css',
		'/js/markerwithlabel_1.2.1.js':'cm_assets/first/markerwithlabel_1.2.1.js',
		'/js/markerclusterer_compiled.js':'cm_assets/first/markerclusterer_compiled.js',
		'/js/jquery.cookie.js':'cm_assets/first/jquery.cookie.js',
		'/js/oms.min.js':'cm_assets/first/oms.min.js',
		'/js/chosen.jquery.min.js':'cm_assets/first/chosen.jquery.min.js',
		'/images/logo.png':'cm_assets/first/logo.png',
		'/images/feed-icon-14x14.png':'cm_assets/first/feed-icon-14x14.png',
		'/pw/piwik.js':'cm_assets/first/piwik.js'
	},
	thirdParty:{
		// Redirect this to google...
		//'https://www.google.com/recaptcha/api.js':'https://www.google.com/recaptcha/api.js',
		
		// All internal redirects
		'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js':'cm_assets/third/jquery.min.js',
		'https://fonts.googleapis.com/css?family=Lato:400,700,400italic':'cm_assets/third/css.css',
		'https://fonts.gstatic.com/s/lato/v14/S6u8w4BMUTPHjxsAUi-qJCY.woff2':'cm_assets/third/S6u8w4BMUTPHjxsAUi-qJCY.woff2',
		'https://fonts.gstatic.com/s/lato/v14/S6u8w4BMUTPHjxsAXC-q.woff2':'cm_assets/third/S6u8w4BMUTPHjxsAXC-q.woff2',
		'https://fonts.gstatic.com/s/lato/v14/S6u9w4BMUTPHh6UVSwaPGR_p.woff2':'cm_assets/third/S6u9w4BMUTPHh6UVSwaPGR_p.woff2',
		'https://fonts.gstatic.com/s/lato/v14/S6u9w4BMUTPHh6UVSwiPGQ.woff2':'cm_assets/third/S6u9w4BMUTPHh6UVSwiPGQ.woff2',
		'https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjx4wXg.woff2':'cm_assets/third/S6uyw4BMUTPHjx4wXg.woff2',
		'https://fonts.gstatic.com/s/lato/v14/S6uyw4BMUTPHjxAwXjeu.woff2':'cm_assets/third/S6uyw4BMUTPHjxAwXjeu.woff2',
		
		
		'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js':'cm_assets/third/jquery-ui.min.js',
		'https://code.jquery.com/ui/1.12.1/themes/smoothness/jquery-ui.css':'cm_assets/third/jquery-ui.css',
		
		'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js':'cm_assets/third/popper.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.0/js/bootstrap.min.js':'cm_assets/third/bootstrap.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/4.4.0/bootbox.min.js':'cm_assets/third/bootbox.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.0/js/bootstrap-select.min.js':'cm_assets/third/bootstrap-select.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.1/moment-with-locales.min.js':'cm_assets/third/moment-with-locales.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/js/bootstrap-datetimepicker.min.js':'cm_assets/third/bootstrap-datetimepicker.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css':'cm_assets/third/cookieconsent.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js':'cm_assets/third/cookieconsent.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.0/css/bootstrap-select.min.css':'cm_assets/third/bootstrap-select.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datetimepicker/4.17.47/css/bootstrap-datetimepicker.min.css':'cm_assets/third/bootstrap-datetimepicker.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/bootswatch/4.1.0/flatly/bootstrap.min.css':'cm_assets/third/bootstrap.min.css',
		
		'https://haubek.github.io/dist/css/component-chosen.min.css':'cm_assets/third/component-chosen.min.css'//,
		
		//'https://use.fontawesome.com/releases/v5.0.10/css/all.css':'cm_assets/third/all.css',
	}
};

var webListener = function(){
	chrome.webRequest.onBeforeRequest.addListener(
		function(details) {
			if (details.frameId < 0) return;
			if (!details.url) return;
			if (details.url.includes("extension-ignore")) return;
			if (details.url.includes("webfonts")) return;
			
			var url = new URL(details.url);
			
			if (url.href.includes("cellmapper.net/pw/")){
				if (settings.blockPiwik !== true) return;
				return {redirectUrl: chrome.extension.getURL(assets.fakePiwik)};
			}
			
			if (url.host.includes("cellmapper.net")){
				
				if (settings.cacheSettings.firstParty !== true) return;
				var keys = Object.keys(assets.firstParty);
				for (var i = 0;i<keys.length;i++){
					if (url.pathname === keys[i]){
						return {redirectUrl: chrome.extension.getURL(assets.firstParty[keys[i]])};
					}
				}
				console.log(url);
				
			} else {
				
				if (!details.initiator) return;
				var init = new URL(details.initiator);
				if (!init.host.includes("cellmapper.net")) return;
				
				if (settings.cacheSettings.thirdParty !== true) return;
				
				var keys = Object.keys(assets.thirdParty);
				for (var i = 0;i<keys.length;i++){
					if (url.href === keys[i]){
						return {redirectUrl: chrome.extension.getURL(assets.thirdParty[keys[i]])};
					}
				}
				console.log(url);
				
			}
			return;
			//return {redirectUrl: chrome.extension.getURL("cm_serviceworker.js")};
		},
		{
			urls: ["*://*/*"],
			types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
		},
		["blocking"]
	);
};

try{
	webListener();
} catch(e){
	alert("Awesome CellMapper Exception.");
}
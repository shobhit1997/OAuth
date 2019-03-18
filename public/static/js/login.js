$(document).ready(function () {

	$("body").css({
		'overflow-y':'hidden'
	})
	$(".loader-container").fadeIn();
	$(window).load(function  () {
		$(".loader-container").delay(1000).fadeOut();
		setTimeout(function(){
			$("body").css({
				'overflow-y':'scroll'
			})
		},1000)
		
	});
});

jQuery('#login-form').on('submit',function(e){
e.preventDefault();
var url = new URL(window.location.href);
var q = url.searchParams.get("q");
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      window.location.href=JSON.parse(this.responseText).redirectURL;
    }
  };
  xhttp.open("POST", window.location.origin+"/oauth/login", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("token", q);
  var jsonObj={
  	username : jQuery("#username").val(),
  	password : jQuery("#password").val()
  };
  xhttp.send(JSON.stringify(jsonObj));
});
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
		
	})
  if(localStorage.getItem('x-auth')!=null){
    window.location.href="/myprojects";
  }
});

jQuery('#login-form').on('submit',function(e){
e.preventDefault();
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var x_auth = xhttp.getResponseHeader('x-auth');
      localStorage.setItem('x-auth',x_auth);
      window.location.href='/myprojects';
    }
  };
  xhttp.open("POST", window.location.origin+"/api/user/login/infoconnect", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  var jsonObj={
  	username : jQuery("#username").val(),
  	password : jQuery("#password").val()
  };
  xhttp.send(JSON.stringify(jsonObj));
});
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
      verifyProject();
		},1000)
		
	});
  
});

jQuery('#login-form').on('submit',function(e){
e.preventDefault();
var search = window.location.search;
// var q = url.searchParams.get("q");
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      window.location.href=JSON.parse(this.responseText).redirectURL;
    }
  };
  xhttp.open("POST", window.location.origin+"/oauth/login"+search, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  // xhttp.setRequestHeader("token", q);
  var jsonObj={
  	username : jQuery("#username").val(),
  	password : jQuery("#password").val()
  };
  xhttp.send(JSON.stringify(jsonObj));
});

function verifyProject(){
  var search = window.location.search;
  // var projectID = url.searchParams.get("projectID");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    console.log(this.status);
    if (this.readyState == 4 && this.status == 200) {
      var jsonData=JSON.parse(this.responseText);
      document.getElementById("projectName").innerHTML=`${jsonData.name} wants to access your details`;
    }
  };
  xhttp.open("GET", window.location.origin+"/oauth/verifyProject"+search, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send();
}
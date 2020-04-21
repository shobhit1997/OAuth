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
   if(localStorage.getItem('x-auth')===null){
    window.location.href="/";
  }
});

jQuery('#project-form').on('submit',function(e){
e.preventDefault();
 var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
      var json=JSON.parse(this.responseText);
      prompt("Copy to clipboard: Ctrl+C, Enter", "{projectID : "+json.projectID+",projectSecret : "+json.projectSecret+"}");
      // alert("ProjectID :  "+json.projectID+"\nProjectSecret : "+json.projectSecret);
    }
    else if (this.readyState == 4 && this.status == 406) {
      alert('Retry with different name');
    }
  };
  xhttp.open("POST", window.location.origin+"/api/project", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  var jsonObj={
  	name : jQuery("#projectname").val(),
  	redirectURLs : [jQuery("#redirecturl").val()]
  };
  xhttp.send(JSON.stringify(jsonObj));
});
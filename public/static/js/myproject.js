var projectUrlsMap={};
var projectIDMap={};
var projectSecretMap={};
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
      renderProject();
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
      // console.log(this.responseText);
      var json=JSON.parse(this.responseText);
      projectUrlsMap[jQuery("#projects").val()].push(jQuery("#new_url").val())
      $('#redirecturls').append(`<li class="input-style"> 
                                       ${jQuery("#new_url").val()} 
                                  </li>`);
    }
    else if (this.readyState == 4 && this.status == 406) {
      alert('Retry with different name');
    }
  };
  xhttp.open("POST", window.location.origin+"/api/project/addRedirectUrl", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  var jsonObj={
  	projectID : projectIDMap[jQuery("#projects").val()],
  	redirectURL : jQuery("#new_url").val()
  };
  // console.log(jsonObj);
  xhttp.send(JSON.stringify(jsonObj));
});



function renderProject(){
  var search = window.location.search;
  // var projectID = url.searchParams.get("projectID");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    console.log(this.status);
    if (this.readyState == 4 && this.status == 200) {
      var jsonData=JSON.parse(this.responseText);
      for(i=0;i<jsonData.length;i++){
        $('#projects').append(`<option value="${jsonData[i]._id}"> 
                                       ${jsonData[i].name} 
                                  </option>`);
        projectUrlsMap[jsonData[i]._id]=jsonData[i].redirectURLs
        projectIDMap[jsonData[i]._id]=jsonData[i].projectID
        projectSecretMap[jsonData[i]._id]=jsonData[i].projectSecret

      }
      var urls=jsonData[0].redirectURLs;
      $('#projectID').val(projectIDMap[jsonData[0]._id]);
      $('#projectSecret').val(projectSecretMap[jsonData[0]._id]);
      for(i=0;i<urls.length;i++){
        $('#redirecturls').append(`<li class="input-style"> 
                                       ${urls[i]} 
                                  </li>`);
      }
      // document.getElementById("projectName").innerHTML=`${jsonData.name} wants to access your details`;
    }
  };
  xhttp.open("GET", window.location.origin+"/api/project", true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.setRequestHeader("x-auth", localStorage.getItem('x-auth'));
  xhttp.send();
}

$('#projects').on('change', function() {
    $('#redirecturls').empty()
    var urls=projectUrlsMap[this.value]
    $('#projectID').val(projectIDMap[this.value]);
    $('#projectSecret').val(projectSecretMap[this.value]);
    for(i=0;i<urls.length;i++){
        $('#redirecturls').append(`<li class="input-style"> 
                                       ${urls[i]} 
                                  </li>`);
      }
});
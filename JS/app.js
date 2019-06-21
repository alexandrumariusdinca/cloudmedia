document.documentElement.className += " js-enabled";
var isIE = $('html').hasClass('ie'),
	isIE8 = $('html').hasClass('ie8'),
	isIE9 = $('html').hasClass('ie9');

/*------------------------------------------------------------------------------------------------------------------
ON DOCUMENT READY
-------------------------------------------------------------------------------------------------------------------*/
$(document).ready(function () {

		//  ==== Function Call ========= //
		uploadFiles();
		downloadFiles();


		$("[type=file]").on("change", function(){
				  // Name of file and placeholder
				  var file = this.files[0].name;
				  var dflt = $(this).attr("placeholder");
				  if($(this).val()!=""){
				    $(this).next().text(file);
				  } else {
				    $(this).next().text(dflt);
				  }
			});

			//download button dialog open

			var dwButton = document.getElementById('download-link');
			var cDialog = document.getElementById('close-dialog');

			dwButton.addEventListener('click', function ()
			{

					$('#dialog').toggleClass('open')

			}, false);

			cDialog.addEventListener('click', function ()
			{

					$('#dialog').removeClass('open')

			}, false);

});


/*------------------------------------------------------------------------------------------------------------------
WINDOW LOAD FUNCTIONS
-------------------------------------------------------------------------------------------------------------------*/
$(window).on('load',function() {


});

/*------------------------------------------------------------------------------------------------------------------
WINDOW LOAD AND RESIZE FUNCTIONS
-------------------------------------------------------------------------------------------------------------------*/
$(window).on('load resize',function() {


});

/*------------------------------------------------------------------------------------------------------------------
WINDOW RESIZE FUNCTIONS
-------------------------------------------------------------------------------------------------------------------*/
$(window).on('resize',function() {


});

/*------------------------------------------------------------------------------------------------------------------
REUSABLE FUNCTIONS
-------------------------------------------------------------------------------------------------------------------*/
function uploadFiles()
{
		var fileChooser = document.getElementById('file-chooser');
		var button = document.getElementById('upload-button');
		var results = document.getElementById('results');

		button.addEventListener('click', function () {

				var file = fileChooser.files[0];

				if (file) {
						AWS.config.update({
								"accessKeyId": "your_id_here",
								"secretAccessKey": "your_access_key_here",
								"region": "eu-west-1"
						});

						var s3 = new AWS.S3();

						var params = {
								Bucket: 'alex-transcode-test/videos',
								Key: file.name,
								ContentType: file.type,
								Body: file,
								ACL: 'public-read'
						};

						s3.putObject(params, function (err, res) {
								if (err) {
									Swal.fire({
										type: 'error',
										title: 'Oops...',
										text: 'Eroare de incarcare',
										footer: err
									})
								} else {
									Swal.fire(
										'Bun!',
										'Fisierele au fost incarcate cu succes',
										'success'
									)
								}
						});

				} else {
					Swal.fire({
						type: 'error',
						title: '',
						text: 'Nimic de urcat'
					})
				}


		}, false);



}

function downloadFiles()
{
			// variabile
		 var downloadButton = document.getElementById("download-button");
		 var s3 = new AWS.S3();

		 downloadButton.addEventListener('click', function(){

				 // parcurgere

					AWS.config.update(
					  {
					    accessKeyId: "your_id_here",
					    secretAccessKey: "your_access_key_here",
					  }
					);

					var s3 = new AWS.S3();

					var params = {
						  Bucket: "alex-test-output"
					 };

						s3.listObjects(params, function(err, data){

						  var bucketContents = data.Contents;

						    for (var i = 0; i < bucketContents.length; i++){

						      var urlParams = {Bucket: 'alex-test-output', Key: bucketContents[i].Key};

						        s3.getSignedUrl('getObject',urlParams, function(err, url){
						          console.log('Link-urile către fișierele generate sunt:', url);
											alert('Link-ul a fost preluat cu succes!');

											// play the video
											var htmls = '<video width="600" height="600" id="video" autoplay="" loop="" webkit-playsinline="" style="display:none">' +
										                '<source src="'+ url +'" type="video/mp4"></source>' +
										                '</video>';

										     $("#3d-video-holder").html(htmls);

												 var dialog_html = '<a href="'+ url +'" class="vlink">Video Link</a>';
												 $("#dialog-links").html(dialog_html);

						        });
						    }

						});

	 	});

}

console.log("9860");
var user;
user = "9860";
var socket = io('https://devavaya.ddns.net:80');
socket.emit('reg', user);
$('input#audio-txt').val("http://freesound.org/data/previews/275/275072_4486188-lq.mp3");
socket.on('tts', function(data) {
  console.log(data);
  $('#destino-txt').val(data.sender);
  $('textarea#debug-txt').val(data.message);
});


socket.on('data', function(data) {
  console.log(data);
  console.log(data.message);
  var array1 = data.message;

  array1.forEach(function(element) {
    console.log(element);
    var o = new Option("option text", "value");
    /// jquerify the DOM object 'o' so we can use the html method
    $(o).html(element);
    $("#destiones-multiple").append(o);
  });

});


var settings = {
  "async": true,
  "crossDomain": true,
  "url": "https://translation.googleapis.com/language/translate/v2/languages?key=AIzaSyDx8TusPEiEp3_3VLACgwwb974Z_mWBRDk&target=es",
  "method": "GET"
}

$.ajax(settings).done(function(response) {
  var data = response.data.languages;
  var json = JSON.parse(JSON.stringify(data).split('"language":').join('"id":'));
  var json = JSON.parse(JSON.stringify(json).split('"name":').join('"text":'));
  console.log(json);
  $(".js-example-basic-single").select2({
    data: json
  })

});

$("#alert-btn").click(function() {
  var destino = $('input#destino-txt').val();
  var url = $('input#audio-txt').val();
  $('#destiones-multiple :selected').each(function(i, sel) {
    console.log("Enviando Alerta de Audio");
    console.log(destino + " " + url);
    socket.emit('alert', {
      to: $(sel).text(),
      message: url
    });
  });
});


$("#tts-btn").click(function() {
  var idiomatts = $('.js-example-basic-single').select2('data')['0'].id;
  var destino = $('input#destino-txt').val();
  var textotts = $('input#tts-txt').val();
  $('#destiones-multiple :selected').each(function(i, sel) {
    socket.emit('p2p', {
      to: $(sel).text(),
      message: textotts,
      extra: idiomatts
    });
  });

});



$("#tts-btn2").click(function() {
  var destino = $('input#destino-txt').val();
  var textotts = $('input#tts-txt2').val();
  $('#destiones-multiple :selected').each(function(i, sel) {
    socket.emit('tts', {
      to: $(sel).text(),
      message: textotts,
      sender: user
    });
  });


});

console.log("9860");
var user;
user = "9860";
var socket = io('https://devavaya.ddns.net:80');
socket.emit('reg', user);
$('input#img-txt').val("http://www.rcdecolighting.com/sites/55c63efee8cb91caa5000002/content_entry55e445b341d9ac48ed0000f0/55eff9c1d6c2f2024d001fc9/files/Westin_logo_rgb.jpg");
//Combo Imagenes predef
$('select#predef-logo').on('change', function() {
  console.log(this.value);
  $('input#img-txt').val(this.value);
});


//combo AUdio ES Predef
$('select#predef-audio-es').on('change', function() {
  console.log(this.value);
  $('input#audio-txt').val(this.value);
});

//combo Audio PT Predef
$('select#predef-audio-pt').on('change', function() {
  console.log(this.value);
  $('input#audio-txt').val(this.value);
});

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


$("#img-btn").click(function() {
  var destino = $('input#destino-txt').val();
  var textotts = $('input#img-txt').val();
  $('#destiones-multiple :selected').each(function(i, sel) {
    socket.emit('image', {
      to: $(sel).text(),
      message: textotts,
      sender: user
    });
  });


});

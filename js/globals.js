'use strict';

var global_latitude  = 0;
var global_longitude = 0;
var global_mapslink = false;
var global_imagedata = false;

function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    global_latitude  = position.coords.latitude.toString().substring(0,6);
    global_longitude = position.coords.longitude.toString().substring(0,6);
    global_mapslink = "https://www.google.co.nz/maps/@" + position.coords.latitude + "," + position.coords.longitude + ",17z";


    output.innerHTML = '<p>Latitude is ' + global_latitude + '° <br>Longitude is ' + global_longitude + '°</p>';
    var img = new Image();
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + "," + position.coords.longitude + "&zoom=13&size=300x300&sensor=false";

    output.appendChild(img);
  };

  function error(err) {
    console.log(err);
    output.innerHTML = "Unable to retrieve your location";
  };

  output.innerHTML = "<p>Searching for your location...</p>";

  navigator.geolocation.getCurrentPosition(success, error);
}

// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
  // Grab elements, create settings, etc.
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video"),
    videoObj = { "video": true },
    errBack = function(error) {
      console.log("Video capture error: ", error);
    };

  // Put video listeners into place
  if(navigator.getUserMedia) { // Standard
    navigator.getUserMedia(videoObj, function(stream) {
      video.src = stream;
      video.play();
    }, errBack);
  } else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
    navigator.webkitGetUserMedia(videoObj, function(stream){
      video.src = window.webkitURL.createObjectURL(stream);
      video.play();
    }, errBack);
  }
  else if(navigator.mozGetUserMedia) { // Firefox-prefixed
    navigator.mozGetUserMedia(videoObj, function(stream){
      video.src = window.URL.createObjectURL(stream);
      video.play();
    }, errBack);
  }

  var videoWidth, videoHeight;
  var getVideoSize = function() {
    videoWidth = video.videoWidth;
    videoHeight = video.videoHeight;
    video.removeEventListener('playing', getVideoSize, false);
  };

  video.addEventListener('playing', getVideoSize, false);

  document.getElementById("snap").addEventListener("click", function() {
    context.canvas.width = videoWidth;
    context.canvas.height = videoHeight;
    context.drawImage(video, 0, 0, videoWidth, videoHeight);
  });

  document.getElementById("savephoto").addEventListener("click", function() {
    global_imagedata = canvas.toDataURL();
    vibratePhone([1000,1000])
  });

}, false);

var vibratePhone = function(vibes) {
  console.log("I'm vibing");
  navigator.vibrate(vibes);
};

navigator.serviceWorker.register('service-worker.js');

function showNotification(title, body) {
  console.log('ran showNotifications');
  Notification.requestPermission(function(result) {
    console.log('requested permission', result);
    if (result === 'granted') {
      console.log('granted notification');
      console.log(navigator.serviceWorker.ready);
      navigator.serviceWorker.ready.then(function(registration) {
        console.log('serviceWorker ready', registration);
        registration.showNotification(title, {
          body: body,
          icon: 'icons/android-chrome-192x192.png',
          vibrate: [200, 100, 200],
          tag: 'todo app'
        });
      })
    }
  });
}

function getNotifications() {
  navigator.serviceWorker.ready.then(function(registration) {
    console.log('ready');
    registration.getNotifications(options).then(function(notifications) {
      console.log(notifications);
    })
  });
}
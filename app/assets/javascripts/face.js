var access_token
var language = "ja";
var format = "audio/mp3";
var option = "MinSize"
var moveSize = 10;

$(document).ready(function() {
  setAccessToken();
  setBind();
});

function setBind(){
  $("#speak").bind("click", function() {
    var face_img = new Image();
    face_img.src = "obama.jpg";
    var face = new Face();
    face.setImage(face_img);
    face.setPosition(157, 557, 298, 570, 674);
    face.speak();

    $("#operation_view").css("display", "none");
    $("#face_view").css("display", "inline");
  });
}

/**
 * アクセストークンを設定する。
 */
 function setAccessToken(){
   $.ajax({
    url: "face/access_token"
  }).done(function(data, status, xhr) {
    console.log("getted accessToken!!")
    access_token = data;
  });
}

(function(){
  function Face() {
    if (!(this instanceof Face)) {
      return new Face();
    }
    // インスタンス変数
    this.img;
    this.m3_x;
    this.m3_y;
    this.m7_x;
    this.m7_y;
    this.f6_y;
    this.audio;
  }
  (function(){
    var old_sentence;
    var continueMouthFlg = true;

    this.setImage = function(img) {
      this.img = img;
    }

    this.setPosition = function(m3_x, m3_y, m7_x, m7_y, f6_y) {
      this.m3_x = m3_x;
      this.m3_y = m3_y;
      this.m7_x = m7_x;
      this.m7_y = m7_y;
      this.f6_y = f6_y;
    }

    this.drawFace = function() {
      this.img.style.position ="absolute";
      this.img.style.zIndex ="0";
      $("#face_view").append(this.img);

      var self = this;
      this.img.onload = function() {
        $("#mouth_bg").attr({width: self.img.width + "px", height: self.img.height + "px"});
        $("#moving_mouth").attr({width: self.img.width + "px", height: self.img.height + "px"});
        self.drawMouthBackGround();
        self.drawMovingMouth();
      }
    }

    this.drawMouthBackGround = function() {
      var canvas = $("#mouth_bg").get(0);
      var context = canvas.getContext("2d");
      this.clipMouthShape(context);
      context.fill();
    }

    this.drawMovingMouth = function() {
      var canvas = $("#moving_mouth").get(0);
      var context = canvas.getContext("2d");
      this.clipMouthShape(context);
      context.drawImage(this.img, 0, 0);        

      continueMouthFlg = true;
      moveMouth($(canvas));
    }

    this.clipMouthShape = function(context) {
      context.beginPath();
      context.moveTo(this.m3_x, this.m3_y);
      context.lineTo(this.m7_x, this.m7_y);
      context.lineTo(this.m7_x, this.f6_y);
      context.lineTo(this.m3_x, this.f6_y);
      context.closePath();
      context.clip();
    }

    this.playAudio = function() {
      var sentence = $('#sentence').val();

      // 文字列に変更がなければ、もう一度再生
      if(this.audio && sentence == old_sentence) {
        this.audio.play();
        console.log("old_audio_play");
      } else{
        sendSpeakWebApi(sentence);
        console.log("new_audio_play");
      } 
    }

    /** speakのコールバック処理 */
    this.playAudioCallback = function (response){
      console.log("playAudioCallback_start!!");

      this.audio = new Audio(response);
      this.audio.addEventListener('ended', function(){stopMouth()});
      this.audio.play();
      console.log("playAudioCallback_end!!");
    } 

    this.speak = function() {
      this.drawFace();
      this.playAudio();
    }

    function sendSpeakWebApi(sentence) {
      console.log("sendSpeakWebApi_start!!");

      var s = document.createElement("script");
      s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Speak?oncomplete=Face.prototype.playAudioCallback&appId=Bearer" + " " + encodeURIComponent(access_token) + "&text=" + encodeURIComponent(sentence) + "&language=" + language + "&format=" + format;
      document.getElementsByTagName("head")[0].appendChild(s);

      console.log("sendSpeakWebApi_end!!");
    }

    function moveMouth(obj) {
      moveSize = moveSize == 10 ? 0 : 10;
      obj
      .delay(10)
      .animate({top : moveSize}, {duration : 300, complete : function() {if(continueMouthFlg) moveMouth(obj)}});
    }

    function stopMouth(){
      continueMouthFlg = false;
    }

  }).call(Face.prototype);
  this.Face = Face;
})();


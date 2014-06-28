var access_token
var language = "ja";
var format = "audio/mp3";
var option = "MinSize"
var moveSize = 10;

$(document).ready(function() {
  setBind();
  setAccessToken();
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
    access_token = data;
  });
}

(function(){
  function Face() {
  }
  (function(){
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

    this.setVoice = function(mp3) {
      this.mp3 = mp3;
    }

    this.drawFace = function() {
      this.img.style.position ="absolute";
      this.img.style.zIndex ="0";
      $("#face_view").append(this.img);

      var self = this;
      this.img.onload = function() {
        $("#mouth_bg").attr({width: self.img.width + "px", height: self.img.height + "px"});
        $("#moving_mouth").attr({width: self.img.width + "px", height: self.img.height + "px"});
        self.drawMovingMouth();
        self.drawMouthBackGround();
      }
    }

    this.drawMouthBackGround = function() {
      var canvas = $("#mouth_bg").get(0);
      var context = canvas.getContext("2d");
      context.beginPath();
      context.moveTo(this.m3_x, this.m3_y);
      context.lineTo(this.m7_x, this.m7_y);
      context.lineTo(this.m7_x, this.f6_y);
      context.lineTo(this.m3_x, this.f6_y);
      context.closePath();
      context.clip();
      context.fill();
    }

    this.drawMovingMouth = function() {
      var canvas = $("#moving_mouth").get(0);
      var context = canvas.getContext("2d");
      context.beginPath();
      context.moveTo(this.m3_x, this.m3_y);
      context.lineTo(this.m7_x, this.m7_y);
      context.lineTo(this.m7_x, this.f6_y);
      context.lineTo(this.m3_x, this.f6_y);
      context.closePath();
      context.clip();
      context.drawImage(this.img, 0, 0);        

      moveMouth($(canvas));
    }

    this.playAudio = function() {
        // TODO: 音声を乗っけて、終わったら口パクを止める
    }

    this.speak = function() {
      this.drawFace();
      this.playAudio();
    }

    function moveMouth(obj) {
      moveSize = moveSize == 10 ? 0 : 10;
      obj
      .delay(10)
      .animate({top : moveSize}, {duration : 300, complete : function() {moveMouth(obj)}});
    }
  }).call(Face.prototype);
  this.Face = Face;
})();

// Face.prototype = {
//   speak : function(sentence){
//     window.speakcallback = function (response) {console.log(response); }
//     var s = document.createElement("script");
//     s.src = "http://api.microsofttranslator.com/V2/Ajax.svc/Speak?oncomplete=speakcallback&appId=Bearer" + " " + encodeURIComponent(access_token) + "&text=" + encodeURIComponent(sentence) + "&language=" + language + "&format=" + format;
//     document.getElementsByTagName("head")[0].appendChild(s);
//   }
// }

/** speakのコールバック処理 */
function speakcallback(response){
  console.log(response)
} 
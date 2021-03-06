var access_token
var language = "ja";
var format = "audio/mp3";
var option = "MinSize"
var moveSize = 8;

$(document).ready(function() {
  if (!isPc()) {
    $('#non_suport_modal').modal('show');
    return;
  }
  setAccessToken();
  setBind();
});

function setBind(){
  $("#speak").bind("click", function() {
    face.speak();
    $("#operation_view").css("display", "none");
    scrollTo(0, 0);
    $("#face_view").css("display", "inline");
  });

  $("#prayback").bind("click", function() {
    face.drawMovingMouth();
    face.playAudio();
  });

  $("#home").bind("click", function() {
    location.href = "/";
  });

  $("#take_picture_front").bind("click", function() {
    $("#take_picture_back").click();
  });

  $("#take_picture_back").bind("change", function() {
    $("#send").click();
  });

  $("#sentence").bind("keyup", function() {
    face.checkSpeak();
  });
}

function upload(form){
  $form = $('#upload-form');
  fd = new FormData($form[0]);
  $.ajax(
      'face/parse',
      {
      type: 'post',
      processData: false,
      contentType: false,
      data: fd,
      dataType: "json",
      success: function(data) {

        if (data.errCode　== 1) {
          $('#size_error_modal').modal('show');
          return
        } else if (data.errCode　== 2) {
          $('#low_accuracy_error_modal').modal('show');
          return
        }

        console.log(data);
        face.setPosition(data.m3_x, data.m3_y, data.m7_x, data.m7_y, data.f6_y);
        var file = document.getElementById("take_picture_back").files[0];
        var reader = new FileReader();
        reader.onload = function() {
          var taken_img = new Image();
          taken_img.src = reader.result;
          face.setImage(taken_img);
          face.checkSpeak();
          $("#picture_ok").css("display", "inline");
        }
        reader.readAsDataURL(file);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          $('#unknown_error_modal').modal('show');
      }
  });
  return false;
}

function isPc() {
  var ua = navigator.userAgent.toUpperCase();
  if ( ua.indexOf( "ANDROID" )  > -1 || ua.indexOf( "IPHONE" ) > -1 || ua.indexOf( "IPAD" ) > -1 || ua.indexOf( "IPOD" )  > -1 ) {
    return false;
  }else {
    return true;
  }
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
    if (!(this instanceof Face)) {
      return new Face();
    }
    // インスタンス変数
    this.img = null;
    this.m3_x;
    this.m3_y;
    this.m7_x;
    this.m7_y;
    this.f6_y;
    this.audio;
  }
  (function(){
    var old_sentence;
    var isSpeaking = true;

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

    this.checkSpeak = function() {
      if (this.img != null && $("#sentence").val() != "") {
        $("#speak").removeAttr("disabled");
      } else {
        $("#speak").attr({"disabled": "disabled"});
      }
    }

    this.drawFace = function() {
      this.img.style.position ="absolute";
      this.img.style.zIndex ="0";
      this.img.id = "selected_img";
      $("#face_view").append(this.img);
      $("#mouth_bg").attr({width: this.img.width + "px", height: this.img.height + "px"});
      $("#moving_mouth").attr({width: this.img.width + "px", height: this.img.height + "px"});
      this.drawMouthBackGround();
      this.drawMovingMouth();
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
      isSpeaking = true;
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
      moveSize = moveSize == 8 ? 0 : 8;
      if (!isSpeaking && moveSize == 8) {
        return;
      }
      obj
      .delay(10)
      .animate({top : moveSize}, {duration : 190, complete : function() {moveMouth(obj)}});
    }

    function stopMouth(){
      isSpeaking = false;
    }

  }).call(Face.prototype);
  this.Face = Face;
})();

var face = new Face();

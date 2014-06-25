$(document).ready(function() {

    function Face() {
    }

    Face.prototype = {
      setImage : function(img) {
        this.img = img;
      },
      setPosition : function(m3_x, m3_y, m7_x, m7_y, f6_y) {
        this.m3_x = m3_x;
        this.m3_y = m3_y;
        this.m7_x = m7_x;
        this.m7_y = m7_y;
        this.f6_y = f6_y;
      },
      setVoice : function(mp3) {
        this.mp3 = mp3;
      },
      drawBase : function() {
        this.img.style.position ="absolute";
        this.img.style.zIndex ="0";
        $("#face_view").append(this.img);
      },
      drawMouthBackGround : function() {
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
      },
      drawMovingMouth : function() {
        var canvas = $("#moving_mouth").get(0);
        var context = canvas.getContext("2d");
        context.beginPath();
        context.moveTo(this.m3_x, this.m3_y);
        context.lineTo(this.m7_x, this.m7_y);
        context.lineTo(this.m7_x, this.f6_y);
        context.lineTo(this.m3_x, this.f6_y);
        context.closePath();
        context.clip();

        img.onload = function() {
            context.drawImage(img, 0, 0);
        }

        moveMouth($(canvas));
      },
      playAudio : function() {
        // TODO: 音声を乗っけて、終わったら口パクを止める
      },
      speak : function() {
        // TODO: drawBase、drawMouthBackGround、drawMovingMouth、playAudioをカプセル化してここで呼びたい
      }
    }

    var moveSize = 10;

    function moveMouth(obj) {
      moveSize = moveSize == 10 ? 0 : 10;
      obj
        .delay(10)
        .animate({top : moveSize}, {duration : 300, complete : function() {moveMouth(obj)}});
    }

    var img = new Image();
    img.src = "obama.jpg";
    var face = new Face();
    face.setImage(img);
    face.setPosition(157, 557, 298, 570, 674);
    face.drawBase();
    face.drawMovingMouth();
    face.drawMouthBackGround();

    // TODO: 動的にCANVASのサイズを変えたい
    // img.onload = function() {
    //   console.log(img.width);
    //   console.log(img.height);
    //   $("#mouth_bg").get(0).style.width = img.width + "px";
    //   $("#mouth_bg").get(0).style.height = img.height + "px";
    //   $("#moving_mouth").get(0).style.width = img.width + "px";
    //   $("#moving_mouth").get(0).style.height = img.height + "px";
    // }

    $("#speak").bind("click", function() {
      $("#operation_view").css("display", "none");
      $("#face_view").css("display", "inline");
    });
});
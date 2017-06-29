var isPlaying = false;
function init() {
    document.addEventListener("deviceready",onDeviceReady, false);
}
 
function onDeviceReady() {
    navigator.notification.beep(2);
}
 
function _timer(callback)
{
    var time = 0;     //  czas domyślny
    var mode = 1;     //    Tryb: stoper/minutnik
    var status = 0;    //    działa/zatrzymany
    var timer_id;    //    do funkcji setInterval
   
    // odliczanie startuje z 1 sekundowym interwałem timer.start(1000)
    this.start = function () {
        //interval = (typeof(interval) !== 'undefined') ? interval : 1000;
 
        if (status == 0) {
            status = 1;
            timer_id = setInterval(function () {
                switch (mode) {
                    default:
                        if (time) {
                            time -= 4;
                            generateTime();
                            if (typeof (callback) === 'function') callback(time);
                        }
                        break;
 
                    case 1:
                        if (time < 86400000) {
                            time += 4;
                            generateTime();
                            if (typeof (callback) === 'function') callback(time);
                        }
                        break;
                }
            }, 0.01);
        }
    }
 
   
    //  stop timer.stop()
    this.stop =  function()
    {
        if(status == 1)
        {
            status = 0;
            clearInterval(timer_id);
        }
    }
   
    // reset timer.reset(0)
    this.reset =  function(sec)
    {
        sec = (typeof(sec) !== 'undefined') ? sec : 0;
        time = sec;
        generateTime(time);
    }
   
    // tryb - stoper mode(1) minutnik mode(0)
    this.mode = function(tmode)
    {
        mode = tmode;
    }
 
    // ustawianie czasu
 
    this.setTime = function()
    {
        var regExp = new RegExp(/([0-9]{2}):([0-9]{2}):([0-9]{2})/)
        var newTime = regExp.exec($(':input.timeSetter').val())
        if(newTime){
            var seconds = newTime[3]
            var minutes = newTime[2]
            var hours = newTime[1]
            time = hours*3600000+minutes*60000+seconds*1000;
            generateTime();
        }
    }
 
   
    // obecna wartość
    this.getTime = function()
    {
        return time;
    }
   
    // obecny tryb
    this.getMode = function()
    {
        return mode;
    }
   
    // obecny status
    this.getStatus
    {
        return status;
    }
   
 
    // zmienia do formatu godzina:minuta:sekunda
    function generateTime()
    {
        var milisecond = time % 1000;
        var second = Math.floor(time / 1000) % 60;
        var minute = Math.floor(time / 60000) % 60;
        var hour = Math.floor(time / 3600000) % 60;

        
        if (milisecond < 10) {
            milisecond = '00' + milisecond;
        }
        else if (milisecond < 100) {
            milisecond = '0' + milisecond;
        }
       
        second = (second < 10) ? '0'+second : second;
        minute = (minute < 10) ? '0'+minute : minute;
        hour = (hour < 10) ? '0' + hour : hour;
 
       
 
        $('div.timer span.milisecond').html(milisecond);
        $('div.timer span.second').html(second);
        $('div.timer span.minute').html(minute);
        $('div.timer span.hour').html(hour);
    }
}
 
// użycie
var timer;
 
$(document).ready(function(e)
{
    timer = new _timer
    (
        function(time)
        {
            if(time == 0)
            {
                timer.stop();
                alert('time out');
            }
        }
    );
    timer.reset(0);
    timer.mode(1);
});
 
// zero przed liczbami < 10
function display_time(n){
    return n > 9 ? "" + n: "0" + n;
}
 
$(document).ready(function() {
 
  var working = true;
 
  var break_time = $("#break_time").html();
  var work_time = $("#work_time").html();
 
  var started = false;
 
  var completed = 0;
  var progress = 0;
 
 
  var mins = 0;
  var seconds = 0;
   
 
 
  $(function() {
    if (started) {
      setInterval(updateTime, 1000);
    }
   });
   
  // start
  $("#start_timer").click(function() {
 
    working = true;
    if (!started) {
      setInterval(updateTime,1000);
      started = true;
    }
 
    completed = 0;
    progress = 0;
 
   
    mins = 0;
    seconds = 0;
   
   
  })
 
  // aktualizacja
  function updateTime() {
      a = getWorkAudio();
      b = getBreakAudio();
    if (working) {
             
 
       completed += 1;
      if (completed > work_time*60) {
        working = false;
        progress = 0;
        completed = 0;
 
        }
      progress = (completed / parseFloat(work_time)) * (100/60);
     
     
      // wyświetlanie
      var total_seconds = work_time*60;
      var time_remaining = total_seconds - completed;
      mins = Math.floor(time_remaining/60);
      seconds = time_remaining - mins*60;
     
        a.pause();
        a.currentTime =0
        b.pause();
        b.currentTime =0
 
      audioWork(working, time_remaining, completed, a, b, total_seconds);
 
     
       
      $("#time_left").html(mins + ":" + display_time(seconds));
      $("#work_progress").attr('aria-valuenow', progress).css('width', progress + "%");
     
    }
    else {
 
      completed += 1;
      if (completed > break_time*60) {
        working = true;
        progress = 0;
        completed = 0;
 
      }
      progress = (completed / parseFloat(break_time))*(100/60);
     
     
      var total_seconds = break_time*60;
      var time_remaining = total_seconds - completed;
      mins = Math.floor(time_remaining/60);
      seconds = time_remaining - mins*60;
     
        a.pause();
        a.currentTime =0
        b.pause();
        b.currentTime =0
     
      audioBreak(working, time_remaining, completed, a, b, total_seconds);
 
     
      $("#time_left").html(mins + ":" + display_time(seconds))
      $("#break_progress").attr('aria-valuenow', progress).css('width', progress + "%");
     
    }
  }
 
  // odejmowanie od przerwy
  $("#subtract_break").click(function() {
    if (break_time > 1) {
      break_time = parseInt(break_time) - 1;
      $("#break_time").html(break_time);
    }
  });
 
  // dodawanie do przerwy
  $("#add_break").click(function() {
    break_time = parseInt(break_time) + 1;
    $("#break_time").html(break_time);
  });
 
  // odejmowanie od ćwiczeń
  $("#subtract_work").click(function() {
    if (work_time > 1) {
      work_time = parseInt(work_time) - 1;
      $("#work_time").html(work_time);
    }
  });
 
  // dodawanie do ćwiczeń
  $("#add_work").click(function() {
    work_time = parseInt(work_time) + 1;
    $("#work_time").html(work_time);
  });
 
    // refresh
$("#stop_timer").click(function() {
    location.reload();
  });
   
   
})
 
 
//budzik
setInterval(function() {
    var date = new Date();
    var minutensy = date.getMinutes();
    
if(minutensy > 10){
    minutensy = minutensy;
} else {
    minutensy = "0" + minutensy;
}

    var cuttime =  date.getHours() + ":" + minutensy;
    $('#clock-wrapper').html(cuttime);
 
   
  $("#btntosetalrm").click(function(){
     var alRmTime = $(".getalarmtime").val();  
     if(alRmTime){
     $('.aumkar').html(alRmTime);
     $(".alrm-main").css("display","none");
     $(".when-alrm-ring").css("display","block");
     }
       
     else{
     return false;
     }
     });
          var awesome = $(".aumkar").html();  
 
 
var audioElement = document.getElementsByTagName('audio')[0];
var inputElement = document.getElementsByTagName('input')[0];
 
$('input').keyup(function () {
    if (event.keyCode == 13) {
        loadAndPlay(inputElement.value);
       
    }
});
 
function loadAndPlay(src) {
   
    if (isPlaying == false){
    isPlaying = true;
    audioElement.pause();
    audioElement.src = src;
    audioElement.load();
    audioElement.play();
    }
}
 
 
 
    if(awesome == cuttime){  
    loadAndPlay(inputElement.value); 
}  

    // refresh
$("#stop_budzik").click(function() {
    location.reload();
  });

}, 500);
 
 
 
//audio
   function audioWork(working, time_left, progress, a, b, work_time){
       if (progress == 1){
        b.pause();
        b.currentTime =0;
        a.play();  
        setTimeout(function() { a.pause(); }, work_time * 1000);
       }
};
 
   function audioBreak(working, time_left, progress, a, b, break_time){
       if (progress == 1){
        a.pause();
        a.currentTime =0
        b.play();  
        setTimeout(function() { b.pause(); }, break_time * 1000);
       }
};
 
    function getWorkAudio(){
      localStorage.setItem("WA","file:///projekt/www/audio/1.mp3");
      document.getElementById("workAudio").innerHTML = localStorage.getItem("WA");
      var e = document.getElementById("workAudio");
      var strUser1 = e.options[e.selectedIndex].text;
      var a = new Audio(strUser1);
      return a;
    }
 
    function getBreakAudio(){
       localStorage.setItem("BA","file:///projekt/www/audio/2.mp3");
       document.getElementById("breakAudio").innerHTML = localStorage.getItem("BA");
       var f = document.getElementById("breakAudio");
       var strUser2 = f.options[f.selectedIndex].text;
       var b = new Audio(strUser2);
       return b;
    }
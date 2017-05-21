var simon = {
  clickTime: false,
  started: false,
  strict: false,
  position: 0,
  timer: null,
  timerArr: [],
  sequence: [],
  playerSequence: [],

  //playX functions play the sound and make the light color effect
  play1: function() {
    var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
    audio.play();
    $('.red').css('background-color', '#F22');
    window.setTimeout(function() {
        $('.red').css('background-color', '#B22');
      },
      500);
  },
  play2: function() {
    var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
    audio.play();
    $('.blue').css('background-color', '#44F');
    window.setTimeout(function() {
        $('.blue').css('background-color', '#44B');
      },
      500);
  },
  play3: function() {
    var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
    audio.play();
    $('.yellow').css('background-color', '#FF3');
    window.setTimeout(function() {
        $('.yellow').css('background-color', '#DD3');
      },
      500);
  },
  play4: function() {
    var audio = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
    audio.play();
    $('.green').css('background-color', '#3F3');
    window.setTimeout(function() {
        $('.green').css('background-color', '#3C3');
      },
      500);
  },

  //function to generate a new element to the sequence
  addToSequence: function() {
    var rand = Math.floor(Math.random() * 4) + 1;
    simon.sequence.push(rand);
  },

  playSequence: function() {
    var length = simon.sequence.length;
//     test for win and reset if yes
    if (length>20) {
      $('.simon').html('Victory!');
      setTimeout(function(){
        simon.sequence = [];
        simon.addToSequence();
        simon.playSequence();
        $('.simon').html('Simon');
      }, 4000);
      return;
    }
    $('#count').html(length);

//     play the sequence, disallow clicking while playing
    simon.clickTime = false;
    for (var i = 0; i < length; i++) {
      var which = "play" + simon.sequence[i];
      var a = 1000 * (i+1);
      simon.timerArr[i] = setTimeout(simon[which], a);
    }

// allow clicking when everything has finished playing
    var a = 1000*simon.sequence.length;
    simon.timerArr[length] = setTimeout(function(){
      simon.position = 0;
      simon.clickTime = true;
      simon.checkInput();
    }, a);
  },

  evaluate: function () {
    clearTimeout(simon.timer);
//     check if the player pressed correctly
    if (simon.playerSequence[simon.position] === simon.sequence[simon.position]){
      if (simon.position === simon.sequence.length-1){
        simon.addToSequence();
        simon.playSequence();
        simon.playerSequence = [];
      } else {
        simon.checkInput();
        simon.position++;
      }
    }

    else {
      if (simon.strict){
        simon.sequence = [];
        simon.addToSequence();
      }
      simon.badClick();
      simon.playerSequence = [];
      simon.playSequence();
    }
  },

  checkInput: function(){
    // give player a limited time to click something
    simon.timer = setTimeout(function(){
      if (simon.strict){
        simon.sequence = [];
        simon.addToSequence();
      }
      simon.bad();
      simon.playerSequence = [];
      simon.playSequence();
    }, 3000);
  },

  bad: function(){
    //blackout when user doesn't click fast enough
    $('.red').css('background-color', '#222');
    $('.blue').css('background-color', '#222');
    $('.yellow').css('background-color', '#222');
    $('.green').css('background-color', '#222');
    window.setTimeout(function() {
        $('.red').css('background-color', '#B22');
        $('.blue').css('background-color', '#44B');
        $('.yellow').css('background-color', '#DD3');
        $('.green').css('background-color', '#3C3');
      },
      500);
  },

  badClick: function(){
//     blink and sound on misclick
    simon.play1();
    simon.play2();
    simon.play3();
    simon.play4();
  }

};

$(document).ready(function() {


  $('#strict').click(function() {
    simon.strict = !simon.strict;
    if (simon.strict) {
      $(this).css('border-style', 'inset');
      $(this).css('background-color', '#ff00ff');
    } else {
      $(this).css('border-style', 'outset');
      $(this).css('background-color', '#cc00cc');
    }
  });


  $('.red').click(function() {
    if (!simon.started) return;
    if (simon.clickTime) {
      simon.play1();
      simon.playerSequence.push(1);
      simon.evaluate();
    }
  });

  $('.blue').click(function() {
    if (!simon.started) return;
    if (simon.clickTime) {
      simon.play2();
      simon.playerSequence.push(2);
      simon.evaluate();
    }
  });

  $('.yellow').click(function() {
    if (!simon.started) return;
    if (simon.clickTime) {
      simon.play3();
      simon.playerSequence.push(3);
      simon.evaluate();
    }
  });

  $('.green').click(function() {
    if (!simon.started) return;
    if (simon.clickTime) {
      simon.play4();
      simon.playerSequence.push(4);
      simon.evaluate();
    }
  });

  $('#start').click(function() {
    if (!simon.started) {
      simon.started = true;
      simon.addToSequence();
      simon.playSequence();
      $('#info').html('Reset');
    }
    else {
//   cancel all timers, the ones on plays, the ones checking for noinput
      for (var i = 0;i<=simon.sequence.length;i++){
        clearTimeout(simon.timerArr[i]);
      }
      clearTimeout(simon.timer);
      simon.sequence = [];
      simon.playerSequence = [];
      simon.addToSequence();
      simon.playSequence();
    }
  });

  $('#off').click(function click() {
    for (var i = 0;i<=simon.sequence.length;i++){
          clearTimeout(simon.timerArr[i]);
    }
    clearTimeout(simon.timer);
    simon.sequence = [];
    simon.playerSequence = [];
    simon.started = false;
    simon.clickTime = false;
    $('#count').html('-');
    $('#info').html('Start');

  });

});

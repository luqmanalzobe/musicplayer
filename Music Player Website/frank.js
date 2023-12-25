document.addEventListener("DOMContentLoaded", function () {
    var audioPlayer = document.getElementById("audioPlayer");
    var playPauseImages = document.querySelectorAll(".play-pause-img");
    var progressBars = document.querySelectorAll(".progress-bar");
    var timePlayedIndicators = document.querySelectorAll(".time-played");
    var timeLeftIndicators = document.querySelectorAll(".time-left");
    var isDragging = false;
    var playerBar = document.querySelector(".player-bar");
    var backwardBtn = document.getElementById("backwardBtn");
    var forwardBtn = document.getElementById("forwardBtn");
    var volumeSlider = document.getElementById("volumeSlider");
  
    function updateProgressBar() {
      var progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBars.forEach(function (progressBar) {
        progressBar.querySelector(".progress").style.width = progress + "%";
      });
  
      var timePlayed = formatTime(audioPlayer.currentTime);
      var timeLeft = formatTime(audioPlayer.duration - audioPlayer.currentTime);
      timePlayedIndicators.forEach(function (indicator) {
        indicator.textContent = timePlayed;
      });
      timeLeftIndicators.forEach(function (indicator) {
        indicator.textContent = timeLeft;
      });
    }
  
    function formatTime(seconds) {
      var minutes = Math.floor(seconds / 60);
      var remainingSeconds = Math.floor(seconds % 60);
      return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + remainingSeconds;
    }
  
    function updatePlayPauseImageState() {
      var playPauseButtons = document.querySelectorAll(".play-pause-img");
  
      playPauseButtons.forEach(function (button) {
        var playPauseBtn = button.querySelector('.play-overlay');
        var pauseBtn = button.querySelector('.pause-overlay');
  
        if (audioPlayer.paused) {
          playPauseBtn.style.display = "block";
          pauseBtn.style.display = "none";
        } else {
          playPauseBtn.style.display = "none";
          pauseBtn.style.display = "block";
        }
      });
    }
  
    audioPlayer.addEventListener("timeupdate", updateProgressBar);
  
    playPauseImages.forEach(function (image) {
      image.addEventListener("click", function () {
        if (audioPlayer.paused) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
        updatePlayPauseImageState();
      });
    });
  
    progressBars.forEach(function (progressBar) {
      progressBar.addEventListener("mousedown", function (e) {
        isDragging = true;
        handleProgressBarClick(e);
      });
  
      document.addEventListener("mousemove", function (e) {
        if (isDragging) {
          handleProgressBarClick(e);
        }
      });
  
      document.addEventListener("mouseup", function () {
        isDragging = false;
      });
    });
  
    function handleProgressBarClick(e) {
      progressBars.forEach(function (progressBar) {
        var rect = progressBar.getBoundingClientRect();
        var offsetX = e.clientX - rect.left;
        var percentage = (offsetX / rect.width) * 100;
        var duration = (percentage / 100) * audioPlayer.duration;
        audioPlayer.currentTime = duration;
        updateProgressBar();
      });
    }
  
    backwardBtn.addEventListener("click", function () {
      var currentSongIndex = Array.from(songs).findIndex(song => song.classList.contains("playing"));
      var previousSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      var audioSrc = songs[previousSongIndex].getAttribute("data-audio");
      audioPlayer.src = audioSrc;
      audioPlayer.play();
      updatePlayPauseImageState();
      songs.forEach(function (s) {
        s.classList.remove("playing");
      });
      songs[previousSongIndex].classList.add("playing");
    });
  
    forwardBtn.addEventListener("click", function () {
      var currentSongIndex = Array.from(songs).findIndex(song => song.classList.contains("playing"));
      var nextSongIndex = (currentSongIndex + 1) % songs.length;
      var audioSrc = songs[nextSongIndex].getAttribute("data-audio");
      audioPlayer.src = audioSrc;
      audioPlayer.play();
      updatePlayPauseImageState();
      songs.forEach(function (s) {
        s.classList.remove("playing");
      });
      songs[nextSongIndex].classList.add("playing");
    });
  
    volumeSlider.addEventListener("input", function () {
      audioPlayer.volume = volumeSlider.value;
    });
  
    audioPlayer.addEventListener("play", function () {
      playerBar.style.display = "flex";
    });
  
    audioPlayer.addEventListener("pause", function () {
      if (audioPlayer.currentTime === audioPlayer.duration) {
        playerBar.style.display = "none";
      }
    });
  
    audioPlayer.addEventListener("ended", function () {
      playerBar.style.display = "none";
    });
  
    var songs = document.querySelectorAll(".song");
  
    songs.forEach(function (song) {
      song.addEventListener("click", function () {
        var audioSrc = song.getAttribute("data-audio");
        audioPlayer.src = audioSrc;
        audioPlayer.play();
        playerBar.style.display = "flex";
        updatePlayPauseImageState();
        songs.forEach(function (s) {
          s.classList.remove("playing");
        });
        song.classList.add("playing");
      });
    });
  });
  
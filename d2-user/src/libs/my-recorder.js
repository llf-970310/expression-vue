import $ from 'jquery'

let questionType;
let questionLimitTime;
let questionNum = 0;
let readTip = "距离准备结束还剩：";
let answerTip = "距离回答结束还剩：";
let waitTip = "秒后开始作答";
let countDownInUse = [];
let isLastQuestion;

let nowLockIndex;

let canAudioUse = true;
let audio_context;
let recorder;

// 先在前端保证每题只传一次
let isUpload = {};

let reTryCount = [0, 0, 0, 0], maxRetry = 10;

// 成功使用音频的回调
function startUserMedia(stream) {
  let input = audio_context.createMediaStreamSource(stream);
  console.log('Media stream created.');

  recorder = new Recorder(input, {
    onAudioProcess: onAudioProcess
  });
  console.log('Recorder initialised.');
}

// 当资源已加载时被触发
export function initAudio() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    // AudioContext可以控制它所包含的节点的创建，以及音频处理、解码操作的执行。
    // 做任何事情之前都要先创建AudioContext对象，因为一切都发生在这个环境之中。
    audio_context = new AudioContext;
    console.log('Audio context set up.');
    console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    if (!navigator.getUserMedia) {
      canAudioUse = false;
      browserError();
      return canAudioUse;
    }
  } catch (e) {
    canAudioUse = false;
    browserError();
    return canAudioUse;
  }

  try {
    // 提醒用户需要使用音频输入设备
    navigator.getUserMedia({audio: true},
      startUserMedia,
      function (e) {
        console.log('No live audio input: ' + e);
      });
  } catch (e) {
    canAudioUse = false;
    browserError();
  }

}

/**
 * 检查 recorder 是否已经被已经初始化
 */
export function checkRecorderReady() {
  return canAudioUse === true && audio_context !== undefined && recorder !== undefined
}

export function startRecording() {
  // 开始录音
  console.log('---------cur recorder---------')
  console.log(recorder)
  audio_context.resume().then(() => {
    recorder && recorder.record();
    console.log("start recording...");
  });

  // 修改页面样式
  $("#start-record").css("display", "none");
  $("#end-record").css("display", "").removeClass("layui-btn-disabled").attr('disabled', false);
  $("#answer-part").css("display", "");
  $("#wait-part").css("display", "none");

  let mic, fil, sound, answer;
  if (questionType > 1) {
    mic = "#microphone-2";
    fil = "#answer-countdown-2";
    sound = "#sound-2-";
    answer = "answer-2";
  } else {
    mic = "#microphone";
    fil = "#answer-countdown";
    sound = "#sound-";
    answer = "answer";
  }
  $(mic).css("color", "#333333");
  for (let i = 1; i < 10; i++) {
    $(sound + i).css("color", "#cdcdcd")
  }
  countDownInUse.push(true);
  nowLockIndex++;
}

function endRecording() {
  console.log("=======end recording========");
  // TODO ？？？
  if (isUpload[questionNum]) {
    console.log(isUpload);
    console.log("end recording: repeat; " + questionNum);
    return;
  }
  // 结束录音
  recorder && recorder.stop();
  console.log("end recording.");

  // 修改样式
  $("#end-record").addClass("layui-btn-disabled").attr('disabled', true);
  $("#microphone").css("color", "white");
  for (let i = 1; i < 10; i++) {
    $("#sound-" + i).css("color", "white")
  }
  $("#microphone-2").css("color", "white");
  for (let i = 1; i < 10; i++) {
    $("#sound-2-" + i).css("color", "white")
  }

  clearTimer();
  // 先存下这题的题号
  let nowQuestionNum = questionNum;
  let lastQuestion = isLastQuestion;
  console.log("question number: " + nowQuestionNum);
  if (!lastQuestion) {
    getNextQuestion();
  } else {
    layer.load(1);
  }
  // 上传音频
  if (!isUpload[nowQuestionNum]) {
    recorder.exportWAV((blob) => uploadVideo(blob, nowQuestionNum, lastQuestion));
    recorder.clear();
    isUpload[nowQuestionNum] = true;
  }
}

function uploadVideo(blob, nowQuestionNum, lastQuestion) {
  // 首先向后端拿到上传url
  console.log("question number inner: " + nowQuestionNum);
  console.log("blob: " + blob);
  $.post("/api/get-upload-url", {
    "nowQuestionNum": nowQuestionNum
  }).done(function (data) {
    let url = data["url"];
    let fd = new FormData();
    fd.append("video", blob);
    fd.append("nowQuestionNum", nowQuestionNum);
    $.ajax({
      url: url,
      type: 'post',
      processData: false,
      contentType: false,
      data: fd,
      success: function () {
        $.post("/api/upload-success", {"nowQuestionNum": nowQuestionNum}).done(function (data) {
          console.log(data);
          if (lastQuestion) {
            //layer.closeAll('loading');
            window.onbeforeunload = null;
            window.location.href = '/user/result'
          }
        }).fail(e => {
          if (reTryCount[1] < maxRetry) {
            console.log("innerRetry");
            reTry(([blob, nowQuestionNum, lastQuestion]) => uploadVideo(blob, nowQuestionNum, lastQuestion), [blob, nowQuestionNum, lastQuestion], 1);
          } else {
            errorTip(e);
            console.log("upload success fail callback");
            if (lastQuestion) {
              //layer.closeAll('loading');
              window.onbeforeunload = null;
              window.location.href = '/user/result'
            }
          }
        });
      },
      error: e => {
        if (reTryCount[2] < maxRetry) {
          console.log("outRetry");
          reTry(([blob, nowQuestionNum, lastQuestion]) => uploadVideo(blob, nowQuestionNum, lastQuestion), [blob, nowQuestionNum, lastQuestion], 2);
        } else {
          errorTip(e);
        }
      }
    })
  }).fail(e => {
    if (reTryCount[3] < maxRetry) {
      console.log("outRetry");
      reTry(([blob, nowQuestionNum, lastQuestion]) => uploadVideo(blob, nowQuestionNum, lastQuestion), [blob, nowQuestionNum, lastQuestion], 3);
    } else {
      errorTip(e);
    }
  });
}

function onAudioProcess(data) {
  let avg = 0;
  let max_data = 0;
  for (let i = 0; i < data.length; i++) {
    let temp = Math.abs(data[i]);
    avg += temp;
    max_data = Math.max(max_data, temp)
  }
  avg /= data.length;
  let sound = avg * 80;
  // console.log(sound);
  let soundId = questionType > 1 ? "#sound-2-" : "#sound-";
  for (let i = 1; i < 10; i++) {
    if (i < sound) {
      $(soundId + i).css("color", "rgb(95, 169, 249)");
    } else {
      $(soundId + i).css("color", "#cdcdcd");
    }
  }
}

function errorTip(e) {
  try {
    let response = JSON.parse(e.responseText);
    console.log(typeof response);
    if (response['needDisplay']) {
      layer.msg(response['tip']);
    } else {
      layer.msg("服务器出错了");
    }
  } catch (e) {
    layer.msg("服务器出错了");
  }
}

function reTry(func, arg, index) {
  reTryCount[index]++;
  console.log(func);
  console.log(arg);
  console.log(reTryCount);
  setTimeout(() => func(arg), 500);
}

function browserError() {
  // layer.open({
  //   title: ['提示信息', 'font-size:16px;'],
  //   type: 1,
  //   content: "<div style='padding: 30px 20px; font-size: 16px'>您的浏览器暂不支持录音，请更换到最新版本的chrome浏览器。</div>",
  //   btn: '我知道了',
  //   yes: function () {
  //     window.onbeforeunload = null;
  //     window.location.href = '/user';
  //   },
  //   closeBtn: 0,
  //   resize: false,
  //   scrollbar: false,
  //   move: false,
  // });

  console.log('browser error')
}
import {uploadSoundToBOS} from '@/api/sys.bos'

let canAudioUse = true;
let audio_context;
let recorder;

/**
 * 当资源已加载时被触发
 */
export function initAudio(onProcessFunc) {
  try {
    // webkit shim
    console.log('ttttthis')
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    // AudioContext可以控制它所包含的节点的创建，以及音频处理、解码操作的执行。
    // 做任何事情之前都要先创建AudioContext对象，因为一切都发生在这个环境之中。
    audio_context = new AudioContext;
    // console.log('Audio context set up.');
    // console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
    if (!navigator.mediaDevices.getUserMedia) {
      canAudioUse = false;
      browserError();
      return canAudioUse;
    }
  } catch (e) {
    canAudioUse = false;
    console.log('ttttthat')
    browserError();
    return canAudioUse;
  }

  try {
    // 提醒用户需要使用音频输入设备
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(function(stream) {
        let input = audio_context.createMediaStreamSource(stream);
        // console.log('Media stream created.');

        recorder = new Recorder(input, {
          onAudioProcess: onProcessFunc
        });
        // console.log('Recorder initialised.');
      })
      .catch(function(err) {
        // console.log('No live audio input: ' + err);
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

/**
 * 开始录音
 */
export function startRecording() {
  // 开始录音
  // console.log('=========cur recorder=========')
  // console.log(recorder)
  audio_context.resume().then(() => {
    recorder && recorder.record();
    // console.log("start recording...");
  });
}

/**
 * 结束录音
 */
export function endRecording() {
  // 结束录音
  recorder && recorder.stop();
  // console.log("end recording...");
}

/**
 * 上传录音文件
 * @param location 录音上传的位置
 * @param path 录音上传的路径
 * @param onUploaded 录音上传结束后的回调函数
 */
export function uploadRecording(location, path, onUploaded) {
  recorder.exportWAV((blob) => {
    // console.log(blob)
    if (location === 'BOS') {
      uploadSoundToBOS(path, blob, onUploaded)
      recorder.clear()
    }
  });
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

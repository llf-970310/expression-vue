import {BosClient, MimeType} from '@baiducloud/sdk'

const config = {
  credentials: {
    ak: '62d41797b866439b88a516fc4c8e28df',       //您的AK
    sk: '7b181acf3d5448e9b36e9e9eced6e3c8'        //您的SK
  },
  endpoint: 'https://su.bcebos.com'
};
const bucketName = 'ise-expression-bos'

let client = new BosClient(config);

/**
 * 将音频上传到百度云 BOS
 * @param path 上传路径
 * @param blob 音频文件
 */
export function uploadSoundToBOS(path, blob) {
  // console.log(blob)

  listBOSObject('before')

  // client.putObjectFromString(bucketName, 'string/test.txt', 'hello world test').then(res => {
  //   console.log(res)
  //   listBOSObject('after')
  // }).catch(err => {
  //   console.log(err)
  // });

  let ext = path.split(/\./g).pop();
  let mimeType = MimeType.guess(ext);
  if (/^text\//.test(mimeType)) {
    // 因为 Firefox 兼容性的一个问题，如果上传的文件是 text/* 类型，Firefox 会自动添加 charset=utf-8
    // 因此我们给 options 设置 Content-Type 的时候，需要手工加上 charset=utf-8，
    // 否则会导致浏览器计算的签名跟服务器计算的签名不一致，导致上传失败。
    mimeType += '; charset=UTF-8';
  }
  console.log('mimeType: ' + mimeType)
  let options = {
    'Content-Type': mimeType
  };

  blobToDataURL(blob, function (dataUrl) {
    // console.log('original dataUrl');
    // console.log(dataUrl);
    // downloadCurrentWav(dataUrl)

    // 去除 data:content/type;base64 部分
    dataUrl = dataUrl.slice(22)
    // console.log('only base64');
    // console.log(dataUrl);

    // console.log(blobDataUrl)
    client.putObjectFromDataUrl(bucketName, path, dataUrl, options).then(res => {
      // console.log(res)
      listBOSObject('after')
    }).catch(err => {
      console.log(err)
    });
  });
}

/**
 * blob to dataURL
 */
function blobToDataURL(blob, callback) {
  let a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  }
  a.readAsDataURL(blob);
}

/**
 * 下载当前的音频文件
 * @param wavDataUrl 要下载的 wav 文件对应的 dataUrl
 */
function downloadCurrentWav(wavDataUrl) {
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = wavDataUrl;
  link.setAttribute('download', path);
  document.body.appendChild(link);
  link.click();
}

/**
 * 列出 BOS 中的对象
 * @param condition 打印的提示
 */
function listBOSObject(condition) {
  client.listObjects(bucketName).then((res) => {
    console.log(condition)
    console.log(res)
    let contents = res.body.contents;
    console.log(contents.length)
    // for (var i = 0, l = contents.length; i < l; i++) {
    //   console.log(contents[i].key);
    // }
  }).catch(function (error) {
    // 查询失败
    console.log(error);
  });
}

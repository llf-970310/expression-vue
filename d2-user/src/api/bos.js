import {BosClient} from '@baiducloud/sdk'

const config = {
  credentials: {
    ak: '62d41797b866439b88a516fc4c8e28df',       //您的AK
    sk: '7b181acf3d5448e9b36e9e9eced6e3c8'        //您的SK
  },
  endpoint: 'su.bcebos.com'
};

let client = new BosClient(config);

/**
 * 将音频上传到百度云 BOS
 * @param path 上传路径
 */
export function uploadSoundToBOS(path) {

  client.listObjects('ise-expression-bos')
    .then((res) => {
      console.log('success')
      console.log(res)
      // let contents = res.body.contents;
      // for (var i = 0, l = contents.length; i < l; i++) {
      //   console.log(contents[i].key);
      // }
    })
    .catch(function (error) {
      // 查询失败
      console.log(error);
    });
}

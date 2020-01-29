import axios from 'axios';
import { getRandomInteger } from '.';

// get fake post comments
export const getPostComments = async id => {
  return axios({
    method: 'post',
    url: 'https://app.fakejson.com/q',
    data: {
      token: process.env.FAKE_JSON_TOKEN,
      data: {
        time: 'dateTime',
        nickname: 'personNickname',
        content: 'stringShort|2,2',
        _repeat: getRandomInteger(1, 5),
      },
    },
  })
    .then(res => res.data)
    .catch(e => []);
};

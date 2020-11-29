import {SERVER_DOMAIN} from '../common/common';
import RNFetchBlob from 'rn-fetch-blob';

export const uploadImage = async (uri, gender) => {
  const data = await RNFetchBlob.fs.readFile(uri, 'base64');
  const res = await fetch(SERVER_DOMAIN + 'image/detect/', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      base64: data,
      gender: gender,
    }),
  });
  const json = await res.json();
  return json;
};

export const selectAnimalLabel = async (label) => {
  const res = await fetch(SERVER_DOMAIN + `image/getImage?label=${label}`, {
    method: 'GET',
    mode: 'cors',
  });

  const json = await res.json();
  const images = [];
  // json.images.forEach((val, idx) => {
  //   images.push({
  //     id: val.id,
  //     image: 'data:image/jpeg;base64,' + val.base64,
  //   });
  //   console.log(images[idx].image.substring(0, 50));
  // });
  // const data = await RNFetchBlob.fs.readFile(uri, 'base64');
  // console.log(json);
  return json;
};

export default uploadImage;

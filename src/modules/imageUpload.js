import { SERVER_DOMAIN } from '../common/common'
import RNFetchBlob from 'rn-fetch-blob'

const uploadImage = async (uri, gender) => {
    const data = await RNFetchBlob.fs.readFile(uri, 'base64')
    const res = await fetch(SERVER_DOMAIN + 'image/', {
        method:'POST',
        mode: 'cors',
        headers: {
          'Content-type' : 'application/json'
        },
        body: JSON.stringify({
          base64: data,
          gender: gender
        })
    })
    const json = await res.json();
    return json
};

export default uploadImage;
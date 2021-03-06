import {SERVER_DOMAIN} from '../common/common';

export const getUserInfo = async (token, email) => {
  const res = await fetch(SERVER_DOMAIN + `user/search?email=${email}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  }
  const info = await res.json();
  return info;
};

export const getInformation = async (token, type = null, userlist = null) => {
  const res = await fetch(
    type != null
      ? SERVER_DOMAIN + 'etcInformation/profile' + '?' + `${type}=${userlist}`
      : SERVER_DOMAIN + 'etcInformation/profile/',
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  }
  const list = await res.json();
  return list;
};

export const getMbtiList = async () => {
  const res = await fetch(SERVER_DOMAIN + 'etcInformation/mbti/', {
    method: 'GET',
    mode: 'cors',
  });
  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  }
  const list = await res.json();
  return list;
};

export const getMbtiDestination = async (mbti) => {
  const res = await fetch(SERVER_DOMAIN + `etcInformation/mbti/${mbti}/`, {
    method: 'GET',
    mode: 'cors',
  });
  if (JSON.error) {
    console.log(JSON.detail);
    return false;
  }
  const description = await res.json();
  return description;
};

export const getCompatibility = async (token, param, type, value) => {
  const res = await fetch(
    SERVER_DOMAIN +
      'etcInformation/compatibility/' +
      param +
      '?' +
      `${type}=${value}`,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        Authorization: `Token ${token}`,
      },
    },
  );
  const list = await res.json();
  return list;
};

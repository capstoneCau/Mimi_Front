import {SERVER_DOMAIN} from '../common/common';

export const getInformation = async (token, param) => {
  const res = await fetch(SERVER_DOMAIN + 'etcInformation/' + param + '?', {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  const list = await res.json();
  console.log(list);
  return list;
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

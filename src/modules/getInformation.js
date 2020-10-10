const SERVER_DOMAIN = 'https://mimi-server-akuui.run.goorm.io/api/v1/user/';

export const getInformation = async (param) => {
  const res = await fetch(SERVER_DOMAIN + param + '/');
  const list = await res.json();

  return list;
};

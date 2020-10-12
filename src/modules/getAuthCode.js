
const SERVER_DOMAIN = 'https://mimi-server-akuui.run.goorm.io/mail/';


export const getAuthCode = async (address) => {
  const res = await fetch(SERVER_DOMAIN, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify({address: address}), // body data type must match "Content-Type" header
  });
  const token = await res.json();
  return token.token;
};

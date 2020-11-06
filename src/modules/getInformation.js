import {SERVER_DOMAIN} from '../common/common'

export const getInformation = async (param) => {
  const res = await fetch(SERVER_DOMAIN + 'etcInformation/' + param + '/');
  const list = await res.json();
  return list;
};

export const getCompatibility = async (param) => {
  const res = await fetch(SERVER_DOMAIN + 'etcInformation/compatibility/' + param + '/');
  const list = await res.json();
  return list;
}
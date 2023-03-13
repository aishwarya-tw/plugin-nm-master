const axios = require('axios');
const { API_DEFAULT_TIMEOUT } = require('../utils/constants');
const { Manager } = require('@twilio/flex-ui');

async function createServer(timeout = API_DEFAULT_TIMEOUT) {
  // This token can expire, so make sure to retrieve it on each call
  const manager = Manager.getInstance();
  const { token } = manager.store.getState().flex.session.ssoTokenPayload;

  const { awsEndpoint } = manager.serviceConfiguration.attributes.NMG;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token
  };

  return axios.create({
    baseURL: awsEndpoint,
    headers,
    timeout
  });
}

async function mapCreateResponse(url, data, params, timeout) {
  const server = await createServer(timeout);
  const response = await server.post(url, data, { params });
  return response.data;
}

async function mapReadResponse(url, params, timeout) {
  const server = await createServer(timeout);
  const response = await server.get(url, { params });
  return response.data;
}

async function mapUpdateResponse(url, data, params, timeout) {
  const server = await createServer(timeout);
  const response = await server.put(url, data, { params });
  return response.data;
}

async function mapDestroyResponse(url, params, timeout) {
  const server = await createServer(timeout);
  const response = await server.delete(url, { params });
  return response.data;
}

export default endpoint => {
  const url = `/${endpoint}`;
  return {
    create: (data, params, timeout) =>
      mapCreateResponse(url, data, params, timeout),
    read: (params, timeout) => mapReadResponse(url, params, timeout),
    update: (data, params, timeout) =>
      mapUpdateResponse(url, data, params, timeout),
    destroy: (params, timeout) => mapDestroyResponse(url, params, timeout)
  };
};

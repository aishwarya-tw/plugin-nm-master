import Resource from '../utils/resource';

const maskingResource = Resource('masking-handler');

export const maskingHandler = (message, channelSid) => {
  const pattern = /\b(?:\d[ -]*?){15,16}\b/g;
  const body = message.body;
  const shouldMaskText = pattern.test(body);

  if (shouldMaskText) {
    const masked = body.replace(pattern, '************');

    maskingResource
      .create({ body: masked, messageSid: message.sid, channelSid: channelSid })
      .then(console.log(`Succesfully masked message`))
      .catch(error => {
        console.log(error);
      });
  }
};

export default (flex, manager, payload) => {
  maskingHandler(payload.message, payload.channelSid);
};

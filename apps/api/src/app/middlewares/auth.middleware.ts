import { OpenEndpoints } from '../utils/open-endpoint.helper';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';

export const Authenticate = (req, res, next) => {
  let isEndpointOpen = false;
  for (let index = 0; index < OpenEndpoints.length; index++) {
    const openEndpoint = OpenEndpoints[index];
    if (
      req.url.indexOf('/api/v') === -1 ||
      req.url.indexOf(openEndpoint) >= 0
    ) {
      isEndpointOpen = true;
      break;
    }
  }
  if (isEndpointOpen) {
    next();
  } else {
    const headerValue = req.headers.authorization;
    if (headerValue && headerValue.length) {
      const token = headerValue.replace('Bearer ', '');
      const publicKey = readFileSync(__dirname + '/assets/public.pem');
      jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
          res.status(401).send({
            message: 'UnAuthorized'
          });
        } else {
          req.me = decoded;
          next();
        }
      });
    } else {
      res.status(401).send({
        message: 'UnAuthorized'
      });
    }
  }
};

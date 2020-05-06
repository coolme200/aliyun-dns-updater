'use strict';

const urllib = require('urllib');
const querystring = require('querystring');
const crypto = require('crypto');
const debug = require('debug')('updater');

// the ip update last time.
let lastIp = null;

class Updater {

  constructor(options) {
    options = options || {};
    this.url = 'http://alidns.aliyuncs.com?';
    this.AccessKeyId = options.AccessKeyId;
    this.AccessKeySecret = options.AccessKeySecret;
    this.RecordId = options.RecordId;
  }

  * getIp() {
    const result = yield urllib.requestThunk('http://www.net.cn/static/customercare/yourip.asp', {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'nodejs',
      }
    });
    const ip = result.data.toString().match(/\d+\.\d+\.\d+\.\d+/)[0];
    return ip;
  }

  buildQuery(params) {
    let q = '';
    if (params) {
      const keys = Object.keys(params);
      keys.sort();
      const _p = {};
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];
        _p[key] = params[key];
      }
      q = querystring.stringify(_p);
    }
    return q;
  }

  percentEncode(value) {
    if (!value) {
      return null;
    }
    return encodeURIComponent(value)
      .replace(/\+/g, '%20')
      .replace(/\*/g, '%2A')
      .replace(/%7E/g, '~');
  }

  sha1(str, secret) {
    return crypto.createHmac('sha1', secret)
      .update(str)
      .digest()
      .toString('base64');
  }

  * start() {
    const ip = yield this.getIp();
    if (ip === lastIp) {
      console.log(new Date().toUTCString(), 'The domain record is duplicated, task break.');
      return;
    }
    lastIp = ip;
    const param = {
      Action: 'UpdateDomainRecord',
      RecordId: this.RecordId,
      RR: 'nas',
      Type: 'A',
      Value: ip,
      TTL: '600',
      Line: 'default',
      Format: 'JSON',
      Version: '2015-01-09',
      AccessKeyId: this.AccessKeyId,
      SignatureMethod: 'HMAC-SHA1',
      Timestamp: new Date().toISOString().replace(/\.\d+/, ''),
      SignatureVersion: '1.0',
      SignatureNonce: Date.now(),
    };

    let CanonicalizedQueryString = this.buildQuery(param);

    const StringToSign=  'GET&%2F&' + this.percentEncode(CanonicalizedQueryString);

    debug('StringToSign', StringToSign);

    param.Signature = this.sha1(StringToSign, this.AccessKeySecret + '&');
    const requestUrl = this.url + this.buildQuery(param);

    debug('requestUrl', requestUrl);

    const rs = yield urllib.requestThunk(requestUrl);
    console.log(new Date().toUTCString(), rs && rs.data.toString() || 'update empty result.');
  }

}

module.exports = Updater;

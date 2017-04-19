'use strict';

const co = require('co');
const fs = require('fs');
const path = require('path');
const cron = require('cron');
const Updater = require('./updater');
const program = require('commander');
var CronJob = require('cron').CronJob;

program
  .option('-c, --config [config]', 'appoint the `*.json` config file path')
  .parse(process.argv);

if (!program.config) {
  throw Error('appoint the `*.json` config file path');
}

const conf = require(program.config);

const job = function() {
  co(function* () {
    const er = new Updater({
      RecordId: conf.RecordId,
      AccessKeyId: conf.AccessKeyId,
      AccessKeySecret: conf.AccessKeySecret,
    });
    yield er.start();
  }).then(() => {
    console.log(new Date().toUTCString(), 'dns ip update complete.');
  }).catch(err => {
    console.log(err.stack);
  });
};

new CronJob('0 */2 * * * *', function() {
  job();
}, null, true);

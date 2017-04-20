# aliyun-dns-updater


1. install

```
$ npm install aliyun-dns-updater --save
```


2. edit conf ${HOME}/aliyunDnsUpdaterConf.json

```
{
  "RecordId": "dns RecordId in https://netcn.console.aliyun.com/core/domain/list",
  "AccessKeyId": "your AccessKeyId",
  "AccessKeySecret": "your AccessKeySecret"
}

```

3. start

```
$ nohup node ${basedir}/dns.js -c aliyunDnsUpdaterConf.json > aliyun-dns-updater.log 2>&1 &
```
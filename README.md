# aliyun-dns-updater


1. edit conf ${HOME}/aliyunDnsUpdaterConf.json

```
{
  "RecordId": "1",
  "AccessKeyId": "",
  "AccessKeySecret": ""
}

```

2. start

```
nohup node dns.js -c aliyunDnsUpdaterConf.json > aliyun-dns-updater.log 2>&1 &
```
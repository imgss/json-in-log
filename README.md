# json-in-log README

解析log中的json字符串，并在小窗中显示,去[下载](https://marketplace.visualstudio.com/items?itemName=imgss.json-in-log)
## Features

一个log中的json有时候很长：

```log
2020-05-31 04:56:55:204 [verbose] cmd "heartbeat" with payload: {"cmd":"heartbeat","id":17815201001}
```
这个插件可以在你 hover 到 json字符 上时，在小窗显示格式化后的 json

![example](./img/example.gif)

## File associations
To make VS Code treat other file extensions than the default .log as log files, add the following to the user settings:

```json
"files.associations": {
    "*.log.*": "log"
},
```

The example above associates extensions such as .log.1 and .log.2 with the Log File highlighter extension.

## Changelog

v0.1.2

- 支持在配置中设置`forceWordWrap`来强制在json中对`\n`进行换行

**Enjoy!**


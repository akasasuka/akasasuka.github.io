//import { Marked } from 'marked';
const { marked } = require('marked')

/**
 * @param {{content:string,timestamp:number}[]} atData
 */
module.exports = (atData) => {
  for (const item of atData) {
    // 关于 marked 的可选参数以及代码高亮可以查看官网: https://marked.js.org/using_advanced#highlight
    // 或自己上网搜索解决
    item.content = marked(item.content)
  }
}


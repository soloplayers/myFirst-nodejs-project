// 直接上谷歌搜索，一个是home目录，一个是home变量（万一用户自己在环境变量中设置了home目录为D盘呢）
const home = process.env.HOME || require('os').homedir();

/* 在windows上，路径是用\打印出来。而Linux或macOS则是/,怎么统一呢？nodejs提供了path全局变量解决这一问题 */
const path = require('path');

const fs = require('fs');

const dbPath = path.join(home,'.todo');

const db = {
	read (path = dbPath) {
		return new Promise(((resolve, reject) => {
			fs.readFile(dbPath, {flag: 'a+'}, (error1, data) => {
				if (error1) {
					//报错即失败返回reject
					return reject(error1);
				}
				/* list作为中间桥梁，存储数据后再写入文件~/.todo中 */
				let list;
				try {
					list = JSON.parse(data.toString());
				} catch (error2) {
					list = [];
				}
				//成功返回resolve
				resolve(list);
			});
		}));

	},
	write (list, path = dbPath) {
		return new Promise((resolve, reject) => {
			fs.writeFile(path, JSON.stringify(list), (error) => {
				if (error) {
					return reject();
				}
				resolve();
			});
		});
	},

};
module.exports = db;
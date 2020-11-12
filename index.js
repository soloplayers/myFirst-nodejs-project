const db = require('./db');
const inquirer = require('inquirer');
function askForCreateTask(list){
	inquirer
		.prompt(
			{
				type: 'input',
				name: 'title',
				message: 'please input your new title\n',
			}).then((answer) => {
		list.push({
			title: answer.title,
			done: false
		});
		db.write(list);
	});
}
function askForAction(list,index){
	inquirer
		.prompt(
			{
				type: 'list',
				name: 'action',
				message: 'please choose the followings',
				choices: [
					{name: 'finished', value: 'markDone'},
					{name: 'unFinished', value: 'markUnDone'},
					{name: 'remove', value: 'markRemove'},
					{name: 'change the title', value: 'markChange'},
					{name: 'exit', value: '-1'}
				]
			}).then((answer2) => {
		switch (answer2.action) {
			case 'markDone':
				list[index].done = true;
				db.write(list);
				break;
			case 'markUnDone':
				list[index].done = false;
				db.write(list);
				break;
			case 'markRemove':
				list.splice(index, 1);
				db.write(list);
				break;
			case 'markChange':
				inquirer.prompt({
					type: 'input',
					name: 'title',
					message: 'set a new title and input your new title\n',
					default: list[index].title,
				}).then((answer) => {
					list[index].title = answer.title;
					db.write(list);
				});
				break;
		}
	});
}
function printLists(list){
	inquirer
		.prompt(
			{
				type: 'list',
				name: 'index',
				message: 'please choose the followings',
				/* 在choices的数组中，自己创建的最好用负数表示，这样不会和数组的非负整数下标重合 */
				choices: [{name: '+ create a new task', value: '-1'}, ...list.map((task, index) => {
					return {name: `${task.done ? '[ √ ]' : '[ _ ]'} ${index + 1} --- ${task.title}`, value: index.toString()};
				}), {name: 'exit', value: '-2'}]
			})
		.then((answer) => {
			//	注意，我们在上面将index变成了字符串，现在需要将字符串变回数字
			const index = parseInt(answer.index);

			//	这里对用户操作后返回的index判断后再进行相应操作
			if (index >= 0) {
				//	说明用户选择了list里面的某个任务。进入任务后再次询问用户要进行什么样的操作
				// askForAction
				askForAction(list,index);
			}
			else if (index === -1) {
				// 创建一个新的任务
				// create a new task
				askForCreateTask(list);
			}
		});
}
module.exports = {
	/* 逻辑
	 * 1、先读取文件
	 * 2、再向文件添加东西
	 * 3、存储文件
	 *  */
	async add (title) {
		const list = await db.read();
		list.push({title, done: false});
		await db.write(list);
	},
	async clear () {
		await db.write([]);	//直接将list写成空的数据
	},
	async showAll () {
		/* 打印出列表，用户肯定想在列表上操作，
		 *-------------------------------------
		 * |																		|
		 * | 操作列表的库：inquirer(直接上谷歌搜索)	|
		 * |																		|
		 * ------------------------------------
		 *  */
		const list = await db.read();
		printLists(list);
	}
};
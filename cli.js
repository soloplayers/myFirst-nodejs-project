#!/usr/bin/env node
const program = require('commander');
const api=require('./index');

program
	.option('-x, --xxx', 'what the x')
program
	.command('add')
	.description('add a task')
	.action((...args)=>{
		const words=args.slice(0,args.length-1).join(' ');
		api.add(words).then(() => {console.log('任务创建完成！')},()=>{console.log('任务创建失败！');});
	})
program
	.command('clear')
	.description('clear all had created tasks')
	.action(()=>{
		api.clear().then(() => {console.log('清除任务列表完成！')},()=>{console.log('清除任务列表失败！');});
	})
program.parse(process.argv);
/*
* process.argv是打印出用户输入的参数，如运行：node cli.js -- 打印一下内容
*[ 'D:\\nodejs\\nodejs\\node.exe',
 'D:\\学习\\Web前端\\饥人谷\\课程\\Nodejs\\nodejs-project\\cli.js' ]
 * */
if(process.argv.length===2){
	// 长度为2，说明用户直接输入类似node cli.js的命令
	void api.showAll()
}
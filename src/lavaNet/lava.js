const { exec } = require('child_process');

const MAX = 2;
let count = 0;

const id=setInterval(() => {
    count++;
    if (count >= MAX) {
        clearInterval(id);
    }
    exec('node src/lavaNet/lavaRun.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`执行错误: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}, 5000);  // 每5秒执行一次

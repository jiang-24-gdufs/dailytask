const { exec } = require('child_process');

const MAX = 50000;
let count = 0;

const id=setInterval(() => {
    count++;
    console.error(`执行第: ${count} 次, 最大次数: ${MAX - 1}`);
    if (count >= MAX) {
        clearInterval(id);
        console.error(`执行结束: ${count} 次`);
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

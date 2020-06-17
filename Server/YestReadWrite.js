const fs = require('fs');
const express = require('express');
const app = express();

app.use('/', (req, res) => {
    // **modify your existing code here**
    fs.readFile('/home/rsx14/IdeaProjects/PIR/Blockchain_info.txt', (e, data) => {
        if (e) throw e;
        console.log(data.toString());
    });
    fs.writeFile('testing.txt',"HelloWorld");
});

app.listen(5555);
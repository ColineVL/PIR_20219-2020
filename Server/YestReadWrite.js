const fs = require('fs');
const express = require('express');
const app = express();
const readwrite = require('./js/ReadWriteModule');

app.use('/public', express.static(__dirname + '/public'))

    // **modify your existing code here**
    .get('', async (req, res) => {
        var DiffieSchema = { // Schema for storing Diffie-H keys
            public_key:  "", // User ethereum public key
            refId: "", // Id of the reference for which this applies
        };
        const info = Object.create(DiffieSchema)
        info.refId ="1212"
        info.public_key = "aaaa"
       // const res1 = await readwrite.Read('/home/rsx14/IdeaProjects/PIR/Blockchain_info.txt').toString()
        //console.log(res1);
        console.log(info)
        await readwrite.Write('testing.txt',JSON.stringify(info));
        info.refId ="11111"
        info.public_key = "bbbb"
        await readwrite.Write('testing2.txt',JSON.stringify(info));
        console.log(info)

    })

.listen(5555);
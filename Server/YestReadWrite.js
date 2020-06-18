const fs = require('fs');
const express = require('express');
const app = express();
const readwrite = require('./js/ReadWriteModule');

app.use('/public', express.static(__dirname + '/public'))

    // **modify your existing code here**
    .get('', async (req, res) => {
       //  var DiffieSchema = { // Schema for storing Diffie-H keys
       //      public_key:  "", // User ethereum public key
       //      refId: "", // Id of the reference for which this applies
       //  };
       //  const info = Object.create(DiffieSchema)
       //  info.refId ="1212"
       //  info.public_key = "aaaa"
       // // const res1 = await readwrite.Read('/home/rsx14/IdeaProjects/PIR/Blockchain_info.txt').toString()
       //  //console.log(res1);
       //  console.log(info)
       //  await readwrite.Write('testing.txt',JSON.stringify(info));
       //  info.refId ="11111"
       //  info.public_key = "bbbb"
       //  await readwrite.Write('testing2.txt',JSON.stringify(info));
       //  console.log(info)

        let path = "/home/rsx14/IdeaProjects/PIR/Server/0_0xFE3B557E8Fb62b89F4916B721be55cEb828dBd73.txt";
        res = await fs.readFileSync(path, function (err, data) {
            // console.log(JSON.parse(data).PrivDH)
        });
        console.log(res)
        console.log("#########################################################")
        let ob = JSON.parse(res)
        console.log(ob)
        console.log(typeof ob)
    })

.listen(5555);
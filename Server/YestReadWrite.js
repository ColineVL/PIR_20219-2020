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

        let path = "/home/rsx14/IdeaProjects/PIR/Server/Database/RefSeller45_0x627306090abaB3A6e1400e9345bC60c78a8BEf57.txt";
        res = await fs.readFileSync(path, function (err, data) {
            // console.log(JSON.parse(data).PrivDH)
        });
        console.log(res)
        console.log("#########################################################")
        let ob = JSON.parse(res)
        console.log(ob)
        console.log(ob.hash);
        console.log(new Buffer.from(ob.hash,'hex'))


            // let res = await fs.readFileSync(path,function(err,data) {})
            // let res_obj = JSON.parse(res);
            // const Ref = Object.create(Reference_SellerSchema);
            //
            // Ref.hash = new Buffer.from(res_obj.hash.data,'hex');
            // Ref.K2 = new Buffer.from(res_obj.K2.data,'hex');
    })

.listen(5555);
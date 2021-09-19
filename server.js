const express=require('express');
const https=require('https');
const bodyParser=require('body-parser');
const request=require('request');

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

//firstly make a javascript object 

app.post("/",function(req,res){
    var objectdata={
        members:[
            {
                email_address: req.body.email,
                status:"subscribed",
                merge_fields:{
                    FNAME:req.body.firstName,
                    LNAME:req.body.lastName
                }
            }
        ]
    }
    var sendData=JSON.stringify(objectdata);
    var url="https://us5.api.mailchimp.com/3.0/lists/9556be0c7c"

    var options={
        method:'POST',
        auth:'ayushman1:af220866b2f71467462b3ca8f1cf9001-us5'
    }

    const inrequest=https.request(url,options,function(response){
        var stat=response.statusCode;
        if(stat==200)
        {
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });
    inrequest.write(sendData);
    inrequest.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000);  //either use the port allotted by heroku or use 3000 server port locally
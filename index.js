const { error } = require("console");
const express = require("express");
const fs = require("fs"); //fs= file system module
const path = require("path"); //line 2,3 for read and write
const app = express();
const port = 5000;

//Middleware
app.use(express.json());

app.get("/", (req,res) => {
    console.log("data done");
    res.send("Welcome here");
});

app.get("/api/data", (req,res)=>{
    const filePath = path.join(__dirname, "data", "sampleData.json");
    // console.log(filePath);
    fs.readFile(filePath,'utf-8',(err,data)=>{
        if(err){
            return res.send("Failed to read data");
        }

        const jsonData = JSON.parse(data);
        res.send(jsonData);
    });
    
});


app.post("/api/data", (req,res)=>{
    const userData = req.body;
    const filePath = path.join(__dirname, "data", "sampleData.json");

    //read data
        fs.readFile(filePath, 'utf-8', (err,data)=>{
            if(err){
                return res.send({
                    message:"Failed",
                });
            }

            const jsonData = JSON.parse(data);
            userData.id = jsonData.length > 0 ? jsonData[jsonData.length - 1].id + 1 : 1;  // to make the id dynamic
            jsonData.push(userData);
            
            
            //write data //stringify used to parse the data into json
            fs.writeFile(filePath,JSON.stringify (jsonData,  null, 2),(err)=>{
            if(err){
                return res.json({ error: "Failed to write" });
            }
            res.status(201).json({
                message: "Done",
                data: userData,
            });
         }); 
            // console.log(userData);
    });

    // console.log(userData);
    // res.send(userData);
});


app.delete("/api/data/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const filePath = path.join(__dirname, "data", "sampleData.json");

    fs.readFile(filePath,'utf-8',(err,data)=>{
        if(err){
            return res.send({
                message: "Failed",
            });

            
        }

        let jsonData = JSON.parse(data);

            const itemIndex = jsonData.findIndex(item => item.id === id); // to find the index

            if(itemIndex === -1){
                return res.send("Item not Found");
            }

            jsonData.splice(itemIndex, 1);

            fs.writeFile(filePath,JSON.stringify(jsonData,null,2),(err)=>{
                res.send({
                    message: "Item Deleted",
                });
            });
    });
});


app.put("/api/data/:id", (req,res)=>{
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const filePath = path.join(__dirname, "data", "sampleData.json");

    fs.readFile(filePath, 'utf-8', (err,data)=>{
        let jsonData = JSON.parse(data);
        const itemIndex = jsonData.findIndex(item => item.id === id); //find the index
        if(itemIndex === -1){
            return res.send("Item not Found");
        }

        jsonData[itemIndex]={ ...jsonData[itemIndex], ...updatedData };

        fs.writeFile(filePath,JSON.stringify(jsonData,null,2),(err)=>{
            res.send({
                message: "Updated",
            });
        });
    });
});

app.listen(port, ()=>{
    // console.log("server running on", port);
    console.log(`server is running on http://localhost:${port}`)
    
});
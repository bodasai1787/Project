limport express from "express";
const port = 3000;
const app = express();

// call back is triggered whenever there is get request on the "/" listening endpoint
app.get("/",(req, res)=>{
    res.send("Hello World!");
})

app.listen(port, ()=>{
    console.log(`Server is up and running on ${port }.`);
})
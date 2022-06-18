//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const toDoSchema = mongoose.Schema({
  name: String
});

const Task = mongoose.model("task",toDoSchema);

const task1 = new Task({name: "Buy Food"});
const task2 = new Task({name: "Cook Food"});
const task3 = new Task({name: "Eat Food"});





app.get("/", function(req, res) {

  Task.find(function(err,result){
    if(err){
      console.log(err);
    }
    else{

      if(result.length===0){
        Task.insertMany([task1,task2,task3],function(err){
          if(err){
            console.log(err);
          }
          else{
            console.log("Default items inserted");
          }
        });
        res.redirect("/");
      }

      else{
        const day = date.getDate();
        // const items = [];
        // result.forEach(function(task){
        //   items.push(task.name);
        // })

        res.render("list", {listTitle: day, newListItems: result});
      }
    }
  })



});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {

    const newItem = new Task({name: item});
    newItem.save();
    res.redirect("/");
  }
});

app.post("/delete",async function(req,res){
  const checked_id = req.body.checkbox;
  await Task.deleteOne({_id:checked_id});
  res.redirect("/");
})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

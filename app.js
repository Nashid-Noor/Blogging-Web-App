var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    methodOverride = require("method-override");

//connecting to mongodb
mongoose.connect('mongodb://localhost/blog_app');

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use('/public',express.static("public"));
app.use(methodOverride("_method"));
//-----------/

// Model Schema//
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body :String,
    created : {type: Date, default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

//-------------/

//Restful Routes 

//Index Route
app.get('/',(req,res)=>{
    res.redirect('/blogs');
    
});

app.get('/blogs', (req, res) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log("Error")
        } else {
            res.render('index', { blogs: blogs })
        }
    });
});

//------

// Form post 
app.get("/blogs/new",(req,res)=>{
    res.render("new")
});
//--

// After submit the form
app.post("/blogs",(req,res)=>{
    Blog.create(req.body.blog,(err,newBlog)=>{
        if (err){
            console.log(err);
            res.render('new');
        }else{
            res.redirect('/blogs');
        }
    });

});

// Show page 

app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if (err){
            res.redirect("/blogs")
        }else{
            res.render("show",{blog:foundBlog})
        }
    });
});

//edit page

app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundBlog});
        }
    });
});

//Update route

app.put("/blogs/:id",(req,res)=>{
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
        if (err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    });

});

//Delete route

app.delete("/blogs/:id",(req,res)=>{

    Blog.findByIdAndRemove(req.params.id,(err) => {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});






//--------/
app.listen(3000,function(){
    console.log('server started ')
});
//--------/
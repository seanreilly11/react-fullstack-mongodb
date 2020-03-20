const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');//to hash and compare password in an encrypted method
const config = require('./config.json');
const User = require('./models/users.js')
const Product = require('./models/products.js');

const port = 5000;

//connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASS}@${config.MONGO_CLUSTER}.mongodb.net/shop?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log("Database connected"))
.catch((err) => console.log(`Database connection error: ${err.message}`));

// check connection
const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', function(){console.log("We are connected to MongoDB")});

app.use((req,res,next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

//including body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());

app.get('/', (req, res) => res.send('Hello World!'));

//register user
app.post('/register', (req,res)=>{
    User.findOne({username:req.body.username},(err,result) =>{
        if(result){
            res.send("Username already taken. Please try another one")
        }
        else{
            // const salt = bcrypt.genSaltSync(10);
            // console.log(req.body.password);
            const hash = bcryptjs.hashSync(req.body.password);
            const user = new User({
                _id : new mongoose.Types.ObjectId,
                username : req.body.username,
                email : req.body.email,
                password : hash
            });

            user.save().then(result =>{
                res.send(result);
            }).catch(err => res.send(err));
        }
    });
});

//show users
app.get('/users',(req,res)=>{
    User.find().then(result =>{
        res.send(result)
    })
})

//login user
app.post('/login', (req,res)=>{
    User.findOne({username:req.body.username}, (err, result)=>{
        if(result){
            if(bcryptjs.compareSync(req.body.password, result.password)){
                res.send(result)
            }
            else{
                res.send("Not authorised. Incorrect password")
            }
        }
        else{
            res.send("User not found")
        }
    })
})

// show products
app.get('/dbProducts',(req,res)=>{
   Product.find().then(result =>{
    res.send(result)
})
})

//Add products
app.post('/addProduct', (req,res)=>{
    //checking if user is found in the db already
    Product.findOne({name:req.body.name},(err,productResult)=>{
        if (productResult){
          res.send('product added already');
      } else{
        const dbProduct = new Product({
         _id : new mongoose.Types.ObjectId,
         name : req.body.name,
         price : req.body.price,
         user_id : req.body.userId
     });
       //save to database and notify the user accordingly
       dbProduct.save().then(result =>{
         res.send(result);
     }).catch(err => res.send(err));
   }
})
});

// delete a product
app.delete('/deleteProduct/:id', (req,res)=>{
    const idParam = req.params.id;
    Product.findOne({_id:idParam}, (err, result)=>{
        if(result){
            Product.deleteOne({_id:idParam}, err =>{
                res.send("Product deleted")
            });
        }
        else{
            res.send("Can't delete product. Not found")
        }
    }).catch(err => res.send(err));
});

// update Product
app.patch('/updateProduct/:id', (req,res)=>{
    const idParam = req.params.id;
    Product.findById(idParam, (err,result)=>{
        const updatedProduct = {
            name : req.body.name,
            price : req.body.price,
            imageUrl : req.body.imageUrl
        };
        Product.updateOne({_id:idParam}, updatedProduct).then(result=>{
            res.send(result);
        }).catch(err=> res.send(err));
    }).catch(err=>res.send("Not found"))
})

app.listen(port, () => console.log(`App listening on port ${port}!`))
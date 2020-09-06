//express server
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//database
const mongoose = require("mongoose");

//authentication
const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require("cookie-parser");

const app = express();

//models
const listings = require('./db/listings');
const User = require('./db/users');

mongoose.connect(
    "mongodb://localhost:27017/tradingboard",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) => {
        if(error) console.log(error);
        console.log("connection successful");
    }
);

//startup middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000", // <-- location of the react app were connecting to
        credentials: true,
    })
);

app.use(
    session({
        secret: "secretcode", //change to .env when deploy
        resave: true,
        saveUninitialized: true,
    })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);
//------------------ END OF MIDDLEWARE---------------------

//request all listings
app.get('/listings', (req, res) => {
    listings.find().then((listings) => {
        res.json(listings);
    });
});

//request all user's listings
app.get('/user/listings', checkAuthenticated, (req, res) => {
    // const myListings = []
    // req.user.listings.map(async id => {
    //     if(id) {
    //         console.log(id);
    //         listings.findOne({ _id : id }).then((doc) => {
    //             console.log("this",doc);
    //             myListings.push(doc);
    //         }).catch(e => {console.log(e)})
    //     }
    // })
    // res.json(myListings)  
    const myListings = req.user.listings; 
    console.log("all ids: " , myListings);
    listings.find().where('_id').in(myListings).exec(function(err,records){
        console.log(records);
        res.json(records);
    });
});
  
//post listing to database
app.post('/listings', checkAuthenticated, (req, res) => {
    //console.log(req.body);
    listings.find({}).then(async () => {
        const newList = new listings({
            username: req.body.username,
            subject: req.body.subject,
            description: req.body.description,
            imageURL: req.body.imageURL,
            created: new Date()
        });
        await listings.create(newList).then(listing => {
            User.updateOne({"_id": req.session.passport.user}, 
                {$push: { listings : [listing._id] } }
            
                ).then((user)=> {
                //console.log(user);
            })
            //console.log (listing);
        });
        
        res.send("New Listing created")
    });
    
});  

// Register
app.post('/signup', (req, res) => {
    //console.log(req.body);
    User.findOne({ email : req.body.email }).then( async (doc) => {
        if (doc) {
            res.send({errormsg:["Email already registered"]});
        } else if (!doc) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const newUser = new User({
                username: req.body.username, 
                email: req.body.email, 
                password: hashedPassword,
                listings: [],
                created: new Date()
            });
            await User.create(newUser);
            res.send({pushed:["Succesfully registered. Please login"]});
        }
    }).catch (e => {console.log(e)});
});

//Login
app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) {
          res.status(400).send({errormsg:["Incorrect information"]});
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send({pushed:["Successfully Authenticated"]});
          //console.log(user);
        });
      }
    })(req, res, next);
  });

//logout
app.get('/logout', function(req, res){
    req.logout();
    res.send("user")
});

//get user
app.get("/user", checkAuthenticated, (req, res) => {
    res.send(req.user); // The req.user stores the entire user that has been authenticated inside of it.
});


//homepage
app.get('/', (req, res) => {
  res.json({
    listing: 'full stack trading board! 🎉'
  });
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(400).send("Please login");
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        res.send("Already Login");
    }
    res.next();
}

//start the server
const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

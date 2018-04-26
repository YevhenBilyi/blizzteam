require('dotenv').config();
const express=require('express');
const session=require('express-session');
const passport=require('passport');
const Auth0Strategy=require('passport-auth0');
const massive=require('massive');
const bodyParser=require('body-parser');
const cors=require('cors');
const S3=require('./S3');
const controller=require('./controller/controller');

const app=express();

const {
    SERVER_PORT,
    CONNECTION_STRING,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    SESSION_SECRET
}=process.env;

app.use(bodyParser.json({limit: '10mb'}));
app.use(cors());

massive(CONNECTION_STRING).then(db=>{
    app.set('db', db)
})
app.use(session({
    secret:SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))
//

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Auth0Strategy({
    domain:DOMAIN,
    clientID:CLIENT_ID,
    clientSecret:CLIENT_SECRET,
    callbackURL:CALLBACK_URL,
    scope:'openid profile'
    },
    function(accessToken, refreshToken, extraParams, profile, done){
    //db calls
    const db=app.get('db');
    const {picture,id}=profile
    db.find_user([ id]).then( users=>{
        if(users[0]){
            return done(null, users[0].id)
        } else {
            db.create_user([picture,id]).then(createdUser=>{
                return done(null, createdUser[0].id)
            })
        }
    } )

}))

passport.serializeUser( (id, done)=>{
    //putting info in session
    return done(null, id)
})

passport.deserializeUser( (id, done)=>{
    app.get('db').find_session_user([id]).then(user=>{
        console.log(user[0])
        done(null, user[0]);
    })
})

app.get('/auth', passport.authenticate('auth0'))
app.get('/auth/callback', passport.authenticate('auth0',{
    successRedirect: 'http://localhost:3000/#/profile',
    failureRedirect: 'http://localhost:3000'
}))

app.get('/auth/me', (req,res)=>req.user ? res.status(200).send(req.user): res.status(401).send('Nice try sucka'))
app.get('/logout', function(req,res){
    req.logOut();
    res.redirect('http://localhost:3000')
})

app.put('/api/user', controller.updateUser)

S3(app);


app.listen(SERVER_PORT,()=>console.log('Listening on port:'+SERVER_PORT))

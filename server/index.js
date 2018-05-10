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
const socket=require('socket.io')
const cron=require('node-cron');

const app=express();

// deleting all the messages every day at midnight
cron.schedule('0 0 * * *', function(){
    const db=app.get('db');
    db.delete_messages()
  });
const {
    SERVER_PORT,
    CONNECTION_STRING,
    DOMAIN,
    CLIENT_ID,
    CLIENT_SECRET,
    CALLBACK_URL,
    SESSION_SECRET,
    SUCCESS_REDIRECT,
    FAILURE_REDIRECT
}=process.env;

app.use( express.static( `${__dirname}/../build` ) );

app.use(bodyParser.json({limit: '10mb'}));
app.use(cors());

massive(CONNECTION_STRING).then(db=>{
    console.log("Massive up and running")
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
            db.update_status_user([true, users[0].id])
            return done(null, users[0].id)
        } else {
            db.create_user([picture,id]).then(createdUser=>{
                db.update_status_user([true, createdUser[0].id])
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
        // console.log(user[0])
        done(null, user[0]);
    })
})

app.get('/auth', passport.authenticate('auth0'))
app.get('/auth/callback', passport.authenticate('auth0',{
    successRedirect: SUCCESS_REDIRECT,
    failureRedirect: FAILURE_REDIRECT
}))

app.get('/auth/me', (req,res)=>req.user ? res.status(200).send(req.user): res.status(401).send('Nice try sucka'))
app.get('/logout', function(req,res){
    app.get('db').update_status_user([false,req.user.id]).then(()=>{
    req.logOut();
    res.redirect(FAILURE_REDIRECT)
    })
    

})

app.put('/api/user', controller.updateUser)
app.get('/api/getalldata', controller.getAllData)

//getting all the users
app.get('/api/users', controller.getAllUsers)

//getting all the channels

app.get('/api/channels', controller.getAllChannels)

//creating new channel
app.post('/api/channel', controller.createChannel)

//storing the message
app.post('/api/message',controller.storeMessage)
app.get('/api/messages/:id', controller.getChannelMessages)

//liking/ disliking messages
app.put('/api/like', controller.likeMessage)

//adding/deleting user to channel
app.put('/api/channels/add', controller.putUserToChannel)
app.put('/api/channels/remove', controller.removeUserFromChannel)


S3(app);


const io=socket(app.listen(SERVER_PORT,()=>console.log('Listening on port:'+SERVER_PORT)));

io.on('connection', socket => {
    console.log('User Connected');
    socket.on('join room', data => {
      console.log('Room joined', data.room)
      socket.join(data.room);
      io.to(data.room).emit('room joined');
    })
    socket.on('message sent', data => {
        console.log(data)
      io.emit(`${data.room} dispatched`, data.message);
    })
  
    socket.on('disconnect', () => {
      console.log('User Disconnected');
    })
  });

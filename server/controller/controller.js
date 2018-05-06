module.exports={
    //updating by session id the user info
    updateUser:(req, res, next)=>{
        const db=req.app.get('db');
        const{ server, battleTag, mmr, tier,hero}=req.body
        console.log("MY IDDDDD IS", req.user.id)
        db.update_user([server,battleTag, mmr, tier, hero, req.user.id])
        .then(()=>res.status(200).send())
        .catch(err=>res.status(500).send(err))
    },
    //getting all data on session id user
    getAllData:(req, res, next)=>{
        const db=req.app.get('db');
        db.get_all_data([req.user.id])
        .then(data=>res.status(200).send(data))
        .catch(err=>res.status(500).send(err))
    },
    //storing message by the tier
    storeMessage:(req,res,next)=>{
        const db=req.app.get('db');
        const{message,message_time,channel_id}= req.body;
        
        console.log("ID IS", req.user.id)
        db.store_message([req.user.id,message,message_time,channel_id])
        .then(()=>res.status(200).send())
        .catch(err=>res.status(500).send(err))
    },
    //getting all the messages by the tier number
    getChannelMessages:(req, res, next)=>{
        const db=req.app.get('db');
        const{id}=req.params;
        db.get_channel_messages(id)
        .then(messages=>res.status(200).send(messages))
        .catch(err=>res.status(500).send(err))
    },
    //getting array of all users
    getAllUsers:(req, res, next)=>{
        const db=req.app.get('db');
        db.get_all_users()
        .then(users=>res.status(200).send(users))
        .catch(err=>res.status(500).send(err))
    },
    //getting all array of all the channels
    getAllChannels:(req, res, next)=>{
        const db=req.app.get('db');
        db.get_all_channels()
        .then(channels=>res.status(200).send(channels))
        .catch(err=>res.status(500).send(err))
    },
    //creating new channel with 2 users ids
    createChannel:(req, res, next)=>{
        const db=req.app.get('db');
        const {user1, user2}= req.body;

        db.create_channel([user1,user2])
        .then(channel=>res.status(200).send(channel))
        .catch(err=>res.status(500).send(err))
    }

}
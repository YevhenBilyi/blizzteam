module.exports={
    updateUser:(req, res, next)=>{
        const db=req.app.get('db');
        const{ server, battleTag, mmr, tier,hero}=req.body
        db.update_user([server,battleTag, mmr, tier, hero, req.user.id])
        .then(()=>res.status(200).send())
        .catch(err=>res.status(500).send(err))
    }
}
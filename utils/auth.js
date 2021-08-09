const db = require('../DB/database')

exports.isAuthenticated = async (req,res,next)=>{
  const userid = req.headers.userid
  const data = await db.findUser(userid)
  if (!data){
    return res.status(404).send({
      message : 'Authentication Failed',
      redirect : '/login',
      success : false
    })
  }
  next()
  
}
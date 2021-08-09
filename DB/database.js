// const users = require('/public/db.json')
// const fs = require('fs')

const mongoose =require('mongoose')
const Users = require('./Users')

exports.findUser = async (userid)=>{
  
 
  const userData = await Users.findOne({userid : userid}).exec()
  console.log(userData)
  // console.log(userData)
  if(!userData){
     return false
  }
 
  return {switch : userData.switch}
}

exports.updateUserSwitch = async (userid,pin,state)=>{
  await Users.findOne({ userid: userid }, function (err, user){
    if(err || !user) return {success : false}
    for(let i in user.switch){
      if(user.switch[i].pin === pin){
         user.switch[i].state = state
         break
      }
    }
  user.save();
});
return {success : 'true'}
}

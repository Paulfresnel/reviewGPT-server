const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const User = require('../models/User.model')
const Review = require('../models/Review.model')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


router.post('/review', async (req,res)=>{
    console.log("prompt", req.body.prompt)
    console.log("category", req.body.category)
    let {category, promptNotes, language, placeName, userId} = req.body
    let promptBuiltIn= 'Name:' + ' ' +placeName + '.' + ' ' + promptNotes +'.'+` Write in ${language}`
    const builtPrompt = `Write a ${category} review based on these notes: ${promptBuiltIn}. Use synonyms and rich text, to humazine your answer. Don't repeat words.`
    const userFound = await User.findById(userId)
  console.log("user Found: " + userFound)
  if(userFound.credits > 0){
    const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: builtPrompt,
  temperature: 0.5,
  max_tokens: 70,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
});
    console.log(response.data)
    let totalTokensConsumed = response.data.usage.total_tokens
    console.log('tokens used: ',totalTokensConsumed)
  const reviewCreated = await Review.create({language:language, placeName:placeName, promptNotes:promptNotes, gptResponse: response.data.choices[0].text, category: category })
    User.findByIdAndUpdate(userId,  { $push: { reviews: reviewCreated._id }, credits: userFound.credits - totalTokensConsumed }, {new:true})
      .then(userUpdated=>{
        console.log(userUpdated)
        res.json({promptResponse: response.data, userUpdated: userUpdated})
      })


  }
  else if(userFound.credits<0){
    res.json({errorMessage: 'You do not have enough credits to generate a review! Please buy some or wait until your monthly free refill'})
  }

    

})


router.get('/user/:userId', (req,res)=>{
  const {userId} = req.params
  User.findById(userId).populate('reviews')
    .then(response=>{
      console.log(response)
      let {name, _id, credits, reviews, userStatus} = response
      res.json({user: name, _id, credits, reviews, userStatus})
      
    })
})

module.exports = router;

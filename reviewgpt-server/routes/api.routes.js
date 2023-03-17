const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


router.post('/review', async (req,res)=>{
    console.log("prompt", req.body.prompt)
    console.log("category", req.body.category)
    let {category, prompt} = req.body

    const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: `Write a ${category} review based on these notes: ${prompt}`,
  temperature: 0.5,
  max_tokens: 64,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
});
    console.log(response.data)
    res.json(response.data)
})

module.exports = router;

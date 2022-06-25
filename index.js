const express = require('express');
const g = require('graphql-request');
const fetch = require('node-fetch');
const cors = require('cors');

// Configure Environment
require('dotenv').config();

const app = express();

const url = 'https://gitlab.com/api/graphql';

const TOKEN = process.env.MYAPIKEY;
console.log("token" , TOKEN)
// Create the graphQL client
const graphQLClient = new g.GraphQLClient(url, {
      headers: {
        authorization: `Bearer ${TOKEN}`,
      },
    });


app.get('/last', async(req, res, next) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `token ${process.env.MYAPIKEY}`
        },
        body: JSON.stringify({
          query: `query last_projects($n: Int = 5) {
            projects(last: $n) {
            nodes {
            name
            starCount
            }
            }
            }`
        })
      });
      
      if (response && response.ok) {
        var sum = 0;
        var obj = {};
        const data = await response.json();
        // Start working with the data
      
        console.log("data",data.data.projects.nodes)
        const arr= data.data.projects.nodes;
        
        arr.map((item)=>{
            sum+=item.starCount;
            var key = item.name;
            obj[key] = item.starCount;
                   })
        console.log("ob",obj)
        console.log("somme", sum);
        res.send(obj)
      }
});
      


app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${process.env.PORT}`);
});
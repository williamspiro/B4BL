const axios = require('axios');

exports.main = ({ accountId, body, params }, sendResponse) => {

  const API_HUBDB_BASE = 'https://api.hubspot.com/cms/v3/hubdb/tables/donations'
  const UPDATE_TABLE_API_URI = API_HUBDB_BASE + '/rows?hapikey=' + process.env.API_KEY
  const PUBLISH_TABLE_API_URI = API_HUBDB_BASE + '/draft/push-live?hapikey=' + process.env.API_KEY
  let name = body.name
  let amount = body.amount
  let requestBody = {
    "values": {
      "name": name,
      "amount": amount
    }
  }
  axios.post(UPDATE_TABLE_API_URI, requestBody)
    .then(function (response) {
      console.log("HubDB table updated");
      console.log(response.data);
      console.log(response.status);
      
      // Publish HubDB Table
      axios.post(PUBLISH_TABLE_API_URI, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(function (response) {
          console.log("HubDB table publish worked");
          console.log(response.statusText);
          console.log(response.status);
      })
        .catch(function (error) {
          console.log("HubDB table publish failed");
          console.log(error.response.data);
          console.log(error.response.status);
      });

    sendResponse({
      statusCode: 200,
      body: {
        message: "Donation recieved",
      },
    });
  })
    .catch(function (error) {
      console.log("Failed to update HubDB table");
      console.log(error.response.data);
      console.log(error.response.status);
      sendResponse({
        statusCode: 500,
        body: {
          message: "error",
        },
      });
  });

};









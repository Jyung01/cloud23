const https = require("https");
let apikey = "";

let url = `https://unipass.customs.go.kr:38010/ext/rest/trifFxrtInfoQry/retrieveTrifFxrtInfo?crkyCn=${apikey}` +
    `&qryYymmDd=${getToday()}&imexTp=2`;

console.log(url);



exports.handler = async (event) => {
    const resultObj = await new Promise((res, reject) => {
    https.get(url, (response) => {
      var result = "";
      response.on("data", function (chunk) {
        result += chunk;
      });

      response.on("end", function () {
        
        const body = result;
        res(body);
      });
    });
  });
    
    return resultObj;
};

function getToday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + month + day;
}
const axios = require('axios');
const convert = require('xml-js');
const AWS = require('aws-sdk');

exports.handler = async (event) => {
  try {
    const response = await axios.get('https://9e408rzl79.execute-api.ap-northeast-2.amazonaws.com/jydeploy1');

    // xmlString 사용
    const jsonResponse = convert.xml2json(response.data);
    console.log(jsonResponse);
    
    // USD 값 가져오기
    const getUSD = data => {
    let USD = 0;
  
      data.elements[0].elements.forEach(e => {
        if (e.elements?.length > 2) {
          if (e.elements[3].elements[0].text === 'USD') {
            USD = e.elements[2].elements[0].text;
          }
        }
      });
  
      return USD;
    };
    
    // date 값 가져오기
    const getDate = data => {
    let date = 0;
  
      data.elements[0].elements.forEach(e => {
        if (e.elements?.length > 2) {
          if (e.elements[3].elements[0].text === 'USD') {
            date = e.elements[4].elements[0].text;
          }
        }
      });
  
      return date;
    };
    
    
    const USD = await getUSD(JSON.parse(jsonResponse));
    console.log(USD);
    
    const date = await getDate(JSON.parse(jsonResponse));
    console.log(date)
    
    // id 값에 저장할 실행시간
    const nowdate = await getToday()
    console.log(nowdate)
    
    // AWS SDK를 사용하여 DynamoDB 객체 생성
    const dynamoDB = new AWS.DynamoDB.DocumentClient();
    
    // DynamoDB에 변수 저장
    const params = {
    TableName: 'extable',  // 저장할 테이블 이름
    Item: {
      id: nowdate,  // 변수를 식별할 고유한 키
      usd: USD,  // 환율 값
      date: date  // 환율 정보 날짜
    }
    };
    
    try {
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      body: 'Variable stored in DynamoDB'
    };
    } catch (error) {
      return {
        statusCode: 500,
        body: 'Error storing variable in DynamoDB: ' + error.message
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

function getToday(){
    var now = new Date();
    var year = now.getFullYear();
    var month = ("0" + (1 + now.getMonth())).slice(-2);
    var day = ("0" + now.getDate()).slice(-2);
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    return year + month + day + hours + minutes + seconds;
}

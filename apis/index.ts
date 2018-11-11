
export type PingApi = {} & {
    getConnectToken: () => Promise<void | Response>
    testIp: () => Promise<Response>
    pingGetDto: () => Promise<void | Response>
    pingGetStrings: () => Promise<void | Response>
    testConnection: () => Promise<void | Response>
    querySocrata: (url:string, query:string) => Promise<void | Response>
  }

export type GetIpResult = {} & {
  ip: string
}

const testIp = (): Promise<Response> => {
    const url = "http://ip.jsontest.com/"
    return fetch(url, {        
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached        
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        // body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses response to JSON
    .catch(error => {
      // console.error("Error fetching " + url)
      // console.error(`Fetch Error =\n`, error)      
    });
};

const pingGetStrings = (): Promise<void | Response> => {
  const url = "http://localhost/api/ping"
  return fetch(url, {        
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached        
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then(response => {
    // tslint:disable-next-line:no-console
    console.log("Status: " + response.type)
   return response ? response.json() : "no response"
  }) // parses response to JSON
  .catch(error => {
    // tslint:disable-next-line:no-console
    console.error("Error fetching " + url)
    // tslint:disable-next-line:no-console
    console.error(`Fetch Error =\n`, error)      
  });
};

const pingGetDto = (): Promise<void | Response> => {
  const url = "http://localhost/api/pingDto"
  return fetch(url, {        
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached        
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then(response => {
    // tslint:disable-next-line:no-console
    console.log("Status: " + response.type)
   return response ? response.json() : "no response"
  }) // parses response to JSON
  .catch(error => {
    // tslint:disable-next-line:no-console
    console.error("Error fetching " + url)
    // tslint:disable-next-line:no-console
    console.error(`Fetch Error =\n`, error)      
  });
};






const testConnection = (): Promise<void | Response> => {
  const url = "http://localhost:5000/api/values"
  return fetch(url, {        
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached        
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then(response => {
    // tslint:disable-next-line:no-console
    console.log("Status: " + response.type)
   return response ? response.json() : "no response"
  }) // parses response to JSON
  .catch(error => {
    // tslint:disable-next-line:no-console
    console.error("Error fetching " + url)
    // tslint:disable-next-line:no-console
    console.error(`Fetch Error =\n`, error)      
  });
};

const querySocrata = (url:string, soql:string): Promise<void | Response> => {
  // const url = "http://localhost:5000/api/values"
  const url1 = url + "?$query="+ encodeURIComponent(soql)
  return fetch(url1, {        
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached        
      // credentials: "same-origin", // include, same-origin, *omit
      // headers: {
      //   "Access-Control-Allow-Origin": "*",
      //   "Content-Type": "application/json; charset=utf-8",
      //     // "Content-Type": "application/x-www-form-urlencoded",
      // },
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      // body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  .then(response => {
    // tslint:disable-next-line:no-console
    console.log("Status: " + response.type)
   return response ? response.json() : "no response"
  }) // parses response to JSON
  .catch(error => {
    // tslint:disable-next-line:no-console
    console.error("Error fetching " + url)
    // tslint:disable-next-line:no-console
    console.error(`Fetch Error =\n`, error)      
  });
};

const data =
{
  "client_id": "client",
  "client_secret": "secret",
  "grant_type": "client_credentials",
  "scopes": "api1"
}

const jsonToQueryString = (json:any):string => 
  Object.keys(json)
        .map((key:string):string => 
            encodeURIComponent(key) + '=' + encodeURIComponent(json[key]))
        .join('&');

const getConnectToken = (): Promise<void | Response> => {
  const url = "http://localhost/connect/token"
  return fetch(url, {        
      body: jsonToQueryString(data), // body data type must match "Content-Type" header
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      method: "POST", // *GET, POST, PUT, DELETE, etc.
  })
  .then(response => {
    // tslint:disable-next-line:no-console
    console.log("Status: " + response.type)
   return response ? response.json() : "no response"
  }) // parses response to JSON
  .catch(error => {
    // tslint:disable-next-line:no-console
    console.error("Error fetching " + url)
    // tslint:disable-next-line:no-console
    console.error(`Fetch Error =\n`, error)      
  });
};


export const pingApi: PingApi = {
  getConnectToken,
  pingGetDto,
  pingGetStrings,
  querySocrata,
  testConnection,
  testIp  
}



// function GetToken() {
//   $.ajax({
//       type: 'POST',
//       url: '/connect/token',
//       crossDomain: true,
//       timeout: 2000,
//       data: {
//           "client_id": "client",
//           "grant_type": "client_credentials",
//           "client_secret": "secret",
//           "scopes": "api1"
//       }
//   })
//   .done(function (data) {
//       console.log("Got token: " + data.access_token);

//       const tokenDiv = document.createElement("div")
//       $(tokenDiv).html("Got token: " + data.access_token)
//       $("#messages").append(tokenDiv)

//       CallService(data.access_token);
//   });
// }







// function CallService(token) {
//   $.ajax({
//       type: 'GET',
//       url: '/api/values',
//       crossDomain: true,
//       timeout: 2000,
//       beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + token) }
//   })
//   .done(function (data) {
//       console.log(data);

//       const valuesDiv = document.createElement("div")
//       $(valuesDiv).html(data)
//       $("#messages").append(valuesDiv)
//   });
// }

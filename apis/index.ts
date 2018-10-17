
export type Api = {} & {
    testIp: () => Promise<Response>
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


export const api: Api = {
  querySocrata,
  testConnection,
  testIp  
}

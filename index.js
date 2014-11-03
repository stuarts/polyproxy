const httpProxy = require('http-proxy'),
      http = require('http');

const serverPorts = {
        greg: '8000',
        stuart: '8001'
      },
      hostParser = /(\w+?)\.dev\.ottw\.net:8080/;

const proxy = httpProxy.createProxyServer({});

const server = http.createServer(function(req, res) {
  const host = req.headers.host,
        regExpParseOfHost = hostParser.exec(host);

  var user, port;

  if(regExpParseOfHost !== null) {
    user = regExpParseOfHost[1],
    port = serverPorts[user];
  } else {
    user = 'greg';
    port = serverPorts[user];
  }

  if(port === undefined || port === null) {
    // if the user portion of the host was incorrect or missing, just send the
    // request to greg's server.
    user = 'greg'
    port = serverPorts[user];
  }

  console.log('Proxy:', host, req.url, 'to', user, ":", port);
  proxy.web(req, res, {
    target: {
      host: 'localhost',
      port: serverPorts[user]
    }
  });
});

server.listen(80);


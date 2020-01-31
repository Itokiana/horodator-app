// console.log(require('getmac').default())

require('http').createServer(function(request, response) {

  var body = ''
  request.on('data', function(data) {
    body += data
    let k = JSON.parse(body)
    console.log(body)
  })
  request.on('end', function() {
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.end('post received')
  })

}).listen(9001)
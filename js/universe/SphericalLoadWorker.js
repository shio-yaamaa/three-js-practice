self.addEventListener('message', function(e) {
  console.log(JSON.parse(e.data).object.add);

  // Send a message back
  //self.postMessage(e.data);
}, false);
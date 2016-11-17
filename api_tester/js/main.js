function createGame() {
  return new Promise(function(resolve,reject) {
    $.get('http://localhost:3001/api/creategame').then(function(data){
      console.log(data);
      resolve(data.id);
    });
  });
}


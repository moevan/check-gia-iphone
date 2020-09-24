(async ()=>{ 

let func = async function(){
   
  return false;
  
}

let condition = true;
while (condition) {
  (async () => {
//   console.log("condition is true");
  condition = await func();
  console.log(condition);
   
  
  })();
}
})();
const puppeteer = require('puppeteer');


(async function(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://cdpn.io/vanillajskkk/fullpage/RwaEBWV");
    let frame = await page.mainFrame().childFrames()[0];

    
  
    
    const button = await frame.$("#button");
    const buttonContent = await button.evaluate(el=>el.outerHTML);
    console.log(buttonContent);
     
    let p = await frame.$("#p");
   

   await   frame.click("#button");
    // await frame.waitFor(5000);
    await frame.waitForFunction(async ()=>{
        console.log(p);
        // content = await p.evaluate(el => el.textContent);
        // console.log(content)  ;
        return true;
   
        // p = await p.evaluate(el => el.textContent);
        // return p!==''
      
    })
  

console.log(p);
})();

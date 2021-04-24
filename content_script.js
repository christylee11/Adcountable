// Put all the javascript code here, that you want to execute after page load.
console.log("started content injection");
// window.onload = () => {

let font = document.createElement('div');
font.innerHTML = '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">'
document.body.appendChild(font);

function makeHttpObject() {
  try {
    return new XMLHttpRequest();
  } catch (error) {}
  try {
    return new ActiveXObject("Msxml2.XMLHTTP");
  } catch (error) {}
  try {
    return new ActiveXObject("Microsoft.XMLHTTP");
  } catch (error) {}

  throw new Error("Could not create HTTP request object.");
}

function classifyAd(iframe) {
  // const isGoogleAd = /((http(s)?:\/\/googleads.*)*)/g;`
  if (iframe.src.includes("doubleclick") || iframe.src.includes("googlesyndication")) {
    return "google"
  }
  return undefined
}

const DB = {
  "google": [
    "<b>Google</b> advised mental health care when workers complained about racism and sexism"
  ]
}

function overlay(iframe, adProvider) {
  let cover = document.createElement('div');
   cover.setAttribute('style', `
   position: relative;
   display: flex;
   justify-items: center;
   align-items: center;
   width:100%;
   height:100%;
   background:#000;
   `);
  let text = document.createElement('h2');
  text.setAttribute('style', `
   color: white;
   text-decoration: none;
   text-align: center;
   padding: 10px;
   width:100%;
   font-family: 'Merriweather', serif; 
   font-size: 20px;
   `);
  let button = document.createElement("button");
    button.innerHTML = "See original ad";
    cover.appendChild(button);
    button.addEventListener("click", function() {
      cover.style.display = "none"
      iframe.style.display = "block"
    });

  text.innerHTML = DB[adProvider][0]
  cover.appendChild(text)
  iframe.parentElement.appendChild(cover)
  // prevent replacement
  iframe.parentElement.setAttribute("id","")
  iframe.setAttribute("id","")
  iframe.style.display = "none"
}

setTimeout(() => {
  console.log("timeout happened");
  let iframes = document.querySelectorAll("iframe");
  console.log("found", iframes.length, "iframes");
  // console.log("this:", googleAd, googleAd.src)
  window.test = iframes;
  iframes.forEach((iframe) => {
    console.log("there are", iframes.length, "hmm")
    console.log(iframe.src)
    let adProvider = classifyAd(iframe)
    if (adProvider != undefined) {
      console.log("ad by",adProvider,"found")
      overlay(iframe, adProvider)
    }
    /* ---------------------------------------------------------------------------------
    current to do: get the request below to work lol
    basic request format: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
    error it's getting rn: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin
    ---------------------------------------------------------------------------------*/
    // let request = makeHttpObject();

    // console.log("sending request for!!", url);
    // request.open("GET", "https://cors-anywhere.herokuapp.com/" + url, true);
    // request.send(null);
    // // request.onreadystatechange = function() {
    // request.onload = function() {
    //   console.log("flag1");
    //   if (request.readyState == 4) {
    //     //    console.log(request.response);
    //     console.log("result:", request.responseText);
    //   }
    // };
  });
}, 6000);


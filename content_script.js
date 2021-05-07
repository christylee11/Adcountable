/* ------------------------------------------------------
 * file description: content script for all websites outside of Facebook
 * ----------------------------------------------------*/

console.log("started content injection");

/* ------------------------------------------------------
 * Define Merriweather font
 * ----------------------------------------------------*/

var font = document.createElement("div");
font.innerHTML =
  '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">';
document.body.appendChild(font);

/* ------------------------------------------------------
 * Helper function for creating an HTTP object
 * ----------------------------------------------------*/
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

/* ------------------------------------------------------
 * Helper function for classifying ads
 * ----------------------------------------------------*/
function classifyAd(iframe) {
  // const isGoogleAd = /((http(s)?:\/\/googleads.*)*)/g;`
  if (
    iframe.src.includes("doubleclick") ||
    iframe.src.includes("googlesyndication")
  ) {
    return "google";
  }
  return undefined;
}

/* ------------------------------------------------------
 * Temporary database object
 * todo: replace this with access to our actual database
 * ----------------------------------------------------*/
const DB = {
  google: [
    "<b>Google</b> advised mental health care when workers complained about racism and sexism"
  ]
};

/* ------------------------------------------------------
 * Helper function for overlaying ad area with our cover
 * todo: transfer styling over to a css file to clean up this function
 * ----------------------------------------------------*/
function overlay(iframe, adProvider) {
  // overall cover
  let cover = document.createElement("div");
  cover.setAttribute(
    "style",
    `
   position: relative;
   display: flex;
   justify-items: center;
   align-items: center;
   width:100%;
   height:100%;
   background:#000;
   `
  );
  // cover message text
  let text = document.createElement("h2");
  text.setAttribute(
    "style",
    `
   color: white;
   text-decoration: none;
   text-align: center;
   padding: 10px;
   width:100%;
   font-family: 'Merriweather', serif; 
   font-size: 20px;
   `
  );
  // button to see original ad
  let button_div = document.createElement("div");
  cover.appendChild(button_div);
  let button = document.createElement("button");
  button.innerHTML = "See original ad";
  button_div.appendChild(button);
  button.setAttribute("class", `ad_button`);
  button.style.fontFamily = "Merriweather, serif";
  button.addEventListener("click", function() {
    cover.style.display = "none";
    iframe.style.display = "block";
  });
  // button that links to our website
  let learn_more_div = document.createElement("div");
  cover.appendChild(learn_more_div);
  let learn_more = document.createElement("button");
  learn_more.innerHTML = "Learn more";
  learn_more.setAttribute("class", `ad_button`);
  learn_more.style.fontFamily = "Merriweather, serif";
  learn_more_div.appendChild(learn_more);
  learn_more.addEventListener("click", function() {
    window.location.href = "https://adcountable.herokuapp.com/";
  });
  // set the message by referencing database
  // todo: change indexing to actual company name after grabbing the name
  text.innerHTML = DB[adProvider][0];
  cover.appendChild(text);
  iframe.parentElement.appendChild(cover);
  // prevent replacement
  iframe.parentElement.setAttribute("id", "");
  iframe.setAttribute("id", "");
  iframe.style.display = "none";
}

/* ------------------------------------------------------
 * Currently a 6 second timeout to allow ad to fully load into DOM before we interact with it
 * Loop through iframe objects in order to find ads
 * ----------------------------------------------------*/
setTimeout(() => {
  console.log("timeout happened");
  let iframes = document.querySelectorAll("iframe");
  console.log("found", iframes.length, "iframes");
  window.test = iframes;
  iframes.forEach(iframe => {
    console.log("there are", iframes.length, "hmm");
    console.log(iframe.src);
    let adProvider = classifyAd(iframe);
    if (adProvider != undefined) {
      console.log("ad by", adProvider, "found");
      overlay(iframe, adProvider);
    }
    /* ---------------------------------------------------------------------------------
    todo: find company name from the ad
    below method for accessing contents of iframe does not work
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

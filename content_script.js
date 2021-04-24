// Put all the javascript code here, that you want to execute after page load.
console.log("started content injection");
// window.onload = () => {

function createOverlayObject(ad) {
  // the example i used with NYT in the console
  // var ad = document.getElementById("google_ads_iframe_/29390238/nyt/homepage_0__container__");

  // it might work better if we get the bounding rect around the parent element instead of the iframe itself?
  var rect = ad.getBoundingClientRect();

  // set the overlaying element's position
  var overlayElement = document.createElement("div");
  overlayElement.style.position = "absolute";
  overlayElement.style.zIndex = "999";
  overlayElement.style.top = rect.top + "px";
  overlayElement.style.left = rect.top + "px";
  overlayElement.style.width = rect.right - rect.left + "px";
  overlayElement.style.height = rect.bottom - rect.top + "px";

  // add the overlaying element as a "sibling" to the ad iframe
  parent = ad.parentElement;
  parent.appendChild(overlayElement);

  // this pink is just a temporary color choice lol
  overlayElement.style.backgroundColor = "pink";

  // test adding simple text and simple button
  var text = document.createTextNode(
    "test a message from us here about the advertising company and whatnot!"
  );
  overlayElement.appendChild(text);
  br = document.createElement("br");
  overlayElement.appendChild(br);
  overlayElement.appendChild(br);
  var button = document.createElement("button");
  button.innerHTML = "See original ad";
  overlayElement.appendChild(button);
  button.addEventListener("click", function() {
    overlayElement.style.background = none;
  });
}

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

setTimeout(() => {
  console.log("timeout happened");
  const regex = "/((http(s)?://googleads.*)&p=*)/g";
  let googleAds = document.querySelectorAll("iframe");
  console.log("found", googleAds.length, "iframes");
  // console.log("this:", googleAd, googleAd.src)
  for (let googleAd of googleAds) {
    let url = googleAd.src;
    if (
      !url.match(regex) &&
      (googleAd.id == "" || !googleAd.id.includes("google_ads"))
    ) {
      console.log(url, "no match");
      continue;
    }
    console.log(url, "match");

    /* ---------------------------------------------------------------------------------
    current to do: get the request below to work lol
    basic request format: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send
    error it's getting rn: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin
    ---------------------------------------------------------------------------------*/

    let request = makeHttpObject();

    console.log("sending request for!!", url);
    request.open("GET", "https://cors-proxy.htmldriven.com/?url=" + url, true);
    request.send(null);
    // request.onreadystatechange = function() {
    request.onload = function() {
      console.log("flag1");
      if (request.readyState == 4) {
        //    console.log(request.response);
        console.log("result:", request.responseText);
      }
    };
  }
}, 10000);

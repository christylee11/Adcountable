// Put all the javascript code here, that you want to execute after page load.
console.log("started content injection");
// window.onload = () => {

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

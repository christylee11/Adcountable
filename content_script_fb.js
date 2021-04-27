// Put all the javascript code here, that you want to execute after page load.
console.log("started content injection");

var font = document.createElement("div");
font.innerHTML =
  '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">';
document.body.appendChild(font);

const DB_fb = {
  shein: ["<b>SHEIN</b> sold a Swastika necklace."]
};

function overlay(iframe, adProvider) {
  dims = iframe.getBoundingClientRect();
  let cover = document.createElement("div");
  let iframe_child = iframe.firstChild;
  cover.setAttribute(
    "style",
    `
   position: relative;
   justify-items: center;
   align-items: center;
   background:#000;
   z-index:2000;
   border-radius:10px;
   width:` +
    dims.width +
    "px;height:" +
    dims.height +
    "px;top:" +
    0 + // changed top and left to 0 bc relative placement in a scrolling feed
      "px;left:" +
      0 +
      "px"
  );

  // create text within the cover
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
  // create button within the cover
  let button = document.createElement("button");
  button.innerHTML = "See original ad";
  cover.appendChild(button);
  button.addEventListener("click", function() {
    iframe_child.style.display = "block";
    cover.style.display = "none";
  });

  text.innerHTML = DB_fb[adProvider][0];
  cover.appendChild(text);
  cover.setAttribute("id", "cover!!!");

  // hide everything in the ad and add in our cover
  iframe_child.style.display = "none";
  iframe.insertBefore(cover, iframe.firstChild);

  iframe.setAttribute(
    "style",
    `
   width:` +
      dims.width +
      "px;height:" +
      dims.height
  );

  // // prevent replacement
  // // iframe.parentElement.setAttribute("id", "");
  // iframe.setAttribute("id", "");
  // iframe.style.display = "none";
}

setTimeout(() => {
  console.log("timeout happened");

  // find the "sponsored" element that's included on every ad unit with an href="/ads/..."
  let ads = document.querySelectorAll('[href*="/ads"]');
  // let ads = document.querySelectorAll('[aria-label*="Sponsored"]'); // alternative route to finding ads
  console.log("# ADS!!!: ", ads.length);

  // then loop through its parents until you reach a data pagelet element, which is the overall unit in the feed
  ads.forEach(ad => {
    console.log("ad: ", ad.href);
    let unit = ad.closest("[data-pagelet]"); // find the overall post in the feed
    let title_h4 = unit.querySelectorAll("h4")[0]; // find the name of the company, always listed in <h4> header
    let span = title_h4.querySelectorAll("span")[0];
    let company = span.textContent;
    console.log(company);
    overlay(unit, "shein"); // temporary to have content
    // overlay(unit, company) // UNCOMMENT THIS FOR ACTUAL DB INQUIRY
  });
}, 10000);

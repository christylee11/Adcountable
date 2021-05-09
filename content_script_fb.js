/* ------------------------------------------------------
 * file description: content script specifically for Facebook
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
 * Create the Database object. 
 * 
 * Note: Currently we are not making a connection to the
 * actual DB since: (1) it doesn't contain enough data and
 * (2) there were some issues related to accessing a DB
 * from the frontend. You can see "content_script_fb_DB.js"
 * to see an example of how this connection could be made.
 * ----------------------------------------------------*/
const DB_fb = {
  Facebook: [
    "<b>Ad by Facebook</b> <br/><br/> Black employees alleged racial discrimination at Facebook in a legal complaint."
  ],
  Google: [
    "<b>Ad by Google</b> <br/><br/> Google advised mental health care when workers complained about racism and sexism."
  ]
};

/* ------------------------------------------------------
 * Helper function for overlaying ad area with our cover
 * todo: finish transfering styling over to style_fb.css
 * ----------------------------------------------------*/
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
   box-shadow:1px 1px lightgray;
   z-index:2000;
   border-radius:10px;
   margin-bottom:15px;
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
  text.setAttribute("class", `ad_text`);
  // create horizontal line
  let line = document.createElement("hr");
  cover.appendChild(line);
  line.style.color = "white";
  line.style.size = "30";
  // create button to hide cover
  let button = document.createElement("button");
  button.textContent = "See Original Ad";
  cover.appendChild(button);
  button.addEventListener("click", function() {
    iframe_child.style.display = "block";
    cover.style.display = "none";
  });
  button.setAttribute("class", `ad_button`);
  button.style.fontFamily = "Merriweather, serif";
  // fix this button positioning later by putting them side by side in a div and centerng the div
  button.style.left = "18%";

  // create button linked to website
  let button_website = document.createElement("button");
  button_website.textContent = "Learn More";
  cover.appendChild(button_website);
  button_website.addEventListener("click", function() {
    window.open("http://adcountable.herokuapp.com/shein");
  });
  button_website.setAttribute("class", `ad_button`);
  button_website.style.fontFamily = "Merriweather, serif";
  button_website.style.left = "60%";

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
}

/* ------------------------------------------------------
 * Currently a 10 second timeout to allow ad to fully load into DOM before we interact with it
 * Note: Facebook's DOM is very finicky to interact with, often doesn't register elements for
 * developer until you interact with it in some way (e.g. inspect an element)
 * ----------------------------------------------------*/
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
    overlay(unit, "Facebook"); // temporary to have default content
  });
}, 10000);
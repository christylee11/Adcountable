// Put all the javascript code here, that you want to execute after page load.
console.log("started content injection");

var font = document.createElement("div");
font.innerHTML =
  '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">';
document.body.appendChild(font);

const DB_fb = {
  shein: [
    "<b>Ad by SHEIN</b> <br/><br/> Shein operates factories in countries that legally allow the employ of children as young as 14 years-old."
  ]
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
  // button_website.href = "http://adcountable.herokuapp.com/shein";
  // button_website.target = "_blank";
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

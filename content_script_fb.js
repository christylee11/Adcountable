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
  cover.setAttribute(
    "style",
    `
   position: absolute;
   justify-items: center;
   align-items: center;
   background:#000;
   z-index:1000;
   width:` +
      dims.width +
      "px;height:" +
      dims.height +
      "px;top:" +
      dims.top +
      "px;left:" +
      dims.left +
      "px"
  );
  // console.log(dims.width);
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
  let button = document.createElement("button");
  button.innerHTML = "See original ad";
  cover.appendChild(button);
  button.addEventListener("click", function() {
    cover.style.display = "none";
    iframe.style.display = "block";
  });

  text.innerHTML = DB_fb[adProvider][0];
  cover.appendChild(text);
  cover.setAttribute("id", "cover!!!");
  iframe.appendChild(cover);
  // prevent replacement
  iframe.parentElement.setAttribute("id", "");
  iframe.setAttribute("id", "");
  iframe.style.display = "none";
}

setTimeout(() => {
  console.log("timeout happened");
  // brute-force method: look for <div data-pagelet="FeedUnit_1"> (usually an ad)
  // let div = document.querySelectorAll("[data-pagelet='FeedUnit_1']");
  // div.forEach(ad => {
  //   console.log(ad);
  //   overlay(ad, "shein");
  // });

  // ALTERNATIVE (to find the ads on page):
  // find the "sponsored" element that's included on every ad unit
  let ads = document.querySelectorAll('[href*="/ads"]');
  console.log("# ADS!!!: ", ads.length);
  // let ads = document.querySelectorAll('[aria-label*="Sponsored"]'); // alternative route to finding ads
  // then loop through its parents until you reach a data pagelet element, which is the overall unit
  ads.forEach(ad => {
    console.log("ad: ", ad);
    let unit = ad.closest("[data-pagelet]");
    overlay(unit, "shein");
  });
}, 10000);

// below is code from https://stackoverflow.com/questions/23753953/detect-js-events-like-facebook-message-fast
// might work better to identify the ads on the page with FB's weird DOM issues, but if you do too much
// within the foreach loop, the browser gets overloaded
// (function() {
//   "use strict";

//   const nodeRemoval = (mutationList, observer) => {
//       mutationList.forEach(mutation => {
//         if (mutation.addedNodes && mutation.addedNodes.length) {
//           mutation.target
//             .querySelectorAll('[aria-label="Sponsored"]')
//             .forEach(adLink => {
//               // var unit = adLink.closest("[data-pagelet]");
//               overlay(adLink, "shein");
//               // unit.style.backgroundColor = "red";
//               console.log("flag");
//             });
//         }
//       });
//     },
//     targetNode = document.querySelector("body"),
//     options = {
//       childList: true,
//       attributes: false,
//       subtree: true
//     },
//     observer = new MutationObserver(nodeRemoval);

//   observer.observe(targetNode, options);
// })();

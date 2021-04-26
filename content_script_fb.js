// Put all the javascript code here, that you want to execute after page load.
console.log("started content injection");

let font = document.createElement("div");
font.innerHTML =
  '<link rel="preconnect" href="https://fonts.gstatic.com"><link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&display=swap" rel="stylesheet">';
document.body.appendChild(font);

const DB = {
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

  text.innerHTML = DB[adProvider][0];
  cover.appendChild(text);
  cover.setAttribute("id", "cover!!!");
  iframe.appendChild(cover);
  // prevent replacement
  // iframe.parentElement.setAttribute("id","")
  iframe.setAttribute("id", "");
  // iframe.style.display = "none"
}

setTimeout(() => {
  console.log("timeout happened");
  // look for <div data-pagelet="FeedUnit_1"> (usually an ad)
  let div = document.querySelectorAll("[data-pagelet='FeedUnit_1']");
  div.forEach(ad => {
    console.log(ad);
    overlay(ad, "shein");
  });
}, 6000);

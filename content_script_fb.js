init()

/* ------------------------------------------------------
* Function to connect to DB and get all data
* ----------------------------------------------------*/
function init() {
  const DATABASE_URL = "postgres://pxtlvjnqfejkce:c9d600fc3c059444fe63a6ce504b313e90156f2a00d4e502b66ec11508e43d37@ec2-54-205-183-19.compute-1.amazonaws.com:5432/dat47gvmrj2lok"
    const { Client } = require("pg");

    const client = new Client({
        connectionString: DATABASE_URL,
        ssl: {
        rejectUnauthorized: false,
        },
    });

    client.connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack))

    client.query('SELECT * FROM db1', (err, res) => {
        if (err) throw err

        var data = res.rows; // DB'in icindeki seyleri buraya koymak istiyorum ama olmuyo
        
        client.end();
        console.log('disconnected')  
        
        // Start the main content script after data is ready
        main(data)
    })
}

function main(data) {
  /* ------------------------------------------------------
  * Create the database object
  * ----------------------------------------------------*/
  var DB = {};

  data.forEach(row => {
        if (row.ad_provider !== "") {
            comp = row.ad_provider
        }
        else {
            comp = row.company
        }

        if (!(comp in DB)) {
          DB[comp] = [
            "<b>Ad by "+comp+"</b> <br/><br/> "+row.info
            ]
        }
        else {
            DB[comp].push("<b>Ad by "+comp+"</b> <br/><br/> "+row.info)
        } 
  })

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

    text.innerHTML = DB[adProvider][0];
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
      if (company in DB) {
        overlay(unit, company);
      } else {
        overlay(unit, "Facebook"); // temporary to have default content
      }
    });
  }, 10000);
}
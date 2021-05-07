# Adcountable
A Firefox browser extension which covers a page's ads with a snippet of information about the ethics of the company behind the ad. Aims to encourage accountability and flip the power structure behind user and advertiser by providing the user with the option to engage with the ad and/or take action in response to our message.

## Important Links
Our website: http://adcountable.herokuapp.com/

Our website Github repo: https://github.com/aliekingurgen/adcountable-website

## Current Progress
At the moment, our implementation handles two cases: ads run by Google Ads on any website, and ads run on Facebook.com. Here is a quick rundown of what is done in each case.

### Facebook Ads
1. Identifies any ads currently loaded on the Facebook newsfeed
2. Identifies the company being advertised
3. Covers the ad with a message about the company being advertised if it is in our database
4. Provides buttons to see the original ad and to link to our website for more information

### Google Ads
1. Identifies the Google Ads on a given page
2. Covers the Google Ad with a default message
3. Provides buttons to see the original ad and to link to our website for more information

## Future Goals and How to Contribute
There is still much that can be done! For Google Ads, the primary goal at the moment is identifying which company is being advertised. Because of the privacy restrictions around working with iframe elements, we are not able to access this information at the moment. For the database, we welcome any contributions (from company press releases, news articles, etc.) regarding corporate misactions and discriminatory practices. Of course, there is always additional styling which can be done as well :)

For general Firefox extension development, we recommend installing web-ext. Please see the Contact Us section below if you have any questions.

## Contact Us
Hi! We are a team of students currently enrolled in SOC414/COS415: Can We Build Anti-racist Technologies? at Princeton University. We can be contacted at the following email addresses:
Gagik Amaryan '22: gagik@princeton.edu
Ilene E '21: ilenee@princeton.edu
Ekin Gurgen '21: agurgen@princeton.edu
Christy Lee '21: christyl@princeton.edu
Carina Lewandowski '21: carinal@princeton.edu
Katie Miller '21: ktmiller@princeton.edu

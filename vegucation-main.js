/* Vegucation
 * By Sam Ringel, Rachel Shim, and Luke Ellert-Beck
 *
 * Chrome extension to help children grow into learners with the power of vegetables
 */

/* Runs replaceImages on all new html */
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      if (mutation.addedNodes[i].nodeType == 1) {
        replaceImages(mutation.addedNodes[i]);
      }
      replaceText(mutation.addedNodes[i]);
    }
  })
});


//Server related, will be used in future
/*var eC = chrome.storage.local.get("enrolled", function(data) {return data; });
if (eC != undefined) {
  var url = chrome.tabs.getCurrent(function (tab) {return tab.url;})
	var date = new Date();
	var h = date.getHours();
	var m = date.getMinutes();
  var shouldBrocc = false;
	for (var t = 0; t < enrolledClasses.length; t++) {
    if (shouldBrocc) break;
		if (eC[t].get("startTime").substr(0,2) >= h && eC[t].get("startTime").substr(2) >= m) {
			if (eC[t].get("endTime").substr(0,2) <= h && eC[t].get("endTime").substr(2) <= m) {
        shouldBrocc = !eC[t].get("isBlacklist");
        for (var i = 0; i < eC[t].get("list").length; i++) {

        }
			}
		}
	}

  if (shouldBrocc) {
    replaceText(document.body);
    replaceImages(document);
    observer.observe(document.body, {childList: true, subtree: true});
  }
}*/

var whitelist = ["khanacademy.org", "wikipedia.org", "brainpop.com", "mail.yahoo.com", "commonapp.org", "epa.gov\/asbestos"];
var url = window.location.href;
var isWhitelisted = false;
for (var i = 0; i < whitelist.length; i++) {
	if (url.includes(whitelist[i])) {
		isWhitelisted=true;
		break;
	}
}

if (!isWhitelisted) {
	replaceText(document.body);
	replaceImages(document);
	observer.observe(document.body, {childList: true, subtree: true});
}

/* Finds images in html [node], and replaces their sources with broccoli.jpg */
function replaceImages(node) {
	var images = document.getElementsByTagName("img");

	for (var i = 0; i < images.length; i++) {
		images[i].setAttribute("src", chrome.extension.getURL('/broccoli.jpg'));
	}
}

/* Finds all text nodes in [node], and replaces each word with 'broccoli' */
function replaceText(node) {
	var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

	while(node = walker.nextNode()) {
		if (node.parentNode.nodeName !== "SCRIPT") {
			var strArray = node.nodeValue.split(" ");

			for (var i = 0; i < strArray.length; i++) {
				strArray[i] = textToBrocc(strArray[i]);
			}
			node.nodeValue = strArray.join(' ');
		}
	}
}

/* Returns string [text], replaced with the word 'broccoli'. Capitalization and special
 * characters are preserved
 */
function textToBrocc(text) {
	if (text.length == 0) { return ""; }

	//If this string consists of an apostrophe followed by a letter, it is preserved
	if (text.length == 2 && text[0] == '\'' && 
		((text[1].charCodeAt(0) >= 65  && text[1].charCodeAt(0) <= 90) || 
			(text[1].charCodeAt(0) >= 97 && text[1].charCodeAt(0) <= 122))) {
		return text;
	}

	var toS = [];
	var j = 0;

	var currCharVal = text[j].charCodeAt(0);
	//Preserves characters until a letter is reached
	while (!(currCharVal >= 65  && currCharVal <= 90) && !(currCharVal >= 97 && currCharVal <= 122)) {
		j++;
		if (j < text.length) {
			currCharVal = text[j].charCodeAt(0);
		} else {
			break;
		}
	}
	toS.push(text.substr(0,j));

	if (j < text.length) {
		var isCap = false;
		currCharVal = text[j].charCodeAt(0);

		//Checks capitalization of first letter
		if (currCharVal >= 65  && currCharVal <= 90) {
			toS.push("B");
			isCap = true;
		} else {
			toS.push("b");
		}

		j++;
		if (j < text.length) {
			var currCharVal = text[j].charCodeAt(0);
			//Runs while every next character is a letter, and checks whether they are all capitalized
			while ((currCharVal >= 65  && currCharVal <= 90) || (currCharVal >= 97 && currCharVal <= 122)) {
				if (isCap && currCharVal >= 97 && currCharVal <= 122) {
					isCap = false;
				}
				j++;
				if (j < text.length) {
					currCharVal = text[j].charCodeAt(0);
				} else {
					break;
				}
			}
			toS.push(isCap ? "ROCCOLI" : "roccoli");
		} else {
			toS.push("roccoli");
		}

		//Recursively calls textToBrocc() if letters are followed by other character types
		if (j !== text.length) {
			toS.push(textToBrocc(text.substr(j)));
		}
	}
	return toS.join('');
}

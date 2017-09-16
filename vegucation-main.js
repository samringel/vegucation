/* Vegucation
 * By Sam Ringel, Rachel Shim, and Luke Ellert-Beck
 *
 * Chrome extension to help children grow into learners with the power of vegetables
 */

replaceText(document.body);
replaceImages(document);

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

observer.observe(document.body, {childList: true, subtree: true});

/* Finds images in html [node], and replaces their sources with broccoli.jpg */
function replaceImages(node) {
	var images = document.getElementsByTagName("img");

	for (var i = 0; i < images.length; i++) {
		images[i].setAttribute("src", chrome.extension.getURL('/broccoli.jpg'));
	}
}

/* Replaces all text on page with the word 'broccoli'
 *
 * TreeWalker idea credit to Anurag on StackOverflow
 * https://stackoverflow.com/questions/2579666/getelementsbytagname-equivalent-for-textnodes
 */
function replaceText(node) {
    var walker = document.createTreeWalker(
        node, 
        NodeFilter.SHOW_TEXT, 
        null, 
        false
    );

    while(node = walker.nextNode()) {
    	if (node.parentNode.nodeName !== "SCRIPT") {
	        var strArray = node.nodeValue.split(" ");

	        for (var i = 0; i < strArray.length; i++) {
	        	var s = "";

	        	//Checks to see if string has characters
	        	if (/[a-z]/i.test(strArray[i])) {

	        		//Checks campitalization of first letter
	        		if (/[A-Z]/.test(strArray[i].substr(0,1))) {
	        			s += "B";
	        		} else {
	        			s += "b";
	        		}
	        		s += "roccoli";

	        		//Checks if the last character is punctuation
	        		if (/[.,\/#!$%\^&\*;:{}=\-_`~()]/g.test(strArray[i].substr(strArray[i].length - 1))) {
		        		s += strArray[i].substr(strArray[i].length - 1);
		        	}
		        	strArray[i] = s;
	        	}
	        }
	        node.nodeValue = strArray.join(' ');
	    }
    }
}
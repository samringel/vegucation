/* Vegucation
 * By Sam Ringel, Rachel Shim, and Luke Ellert-Beck
 *
 * Chrome extension to help children grow into learners with the power of vegetables
 */

replaceImages(document);

/* Runs replaceImages on all new html */
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; i++) {
      if (mutation.addedNodes[i].nodeType == 1) {
        replaceImages(mutation.addedNodes[i]);
      }
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
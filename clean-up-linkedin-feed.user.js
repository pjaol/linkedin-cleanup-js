// ==UserScript==
// @name         Clean Up Linkedin Posts
// @namespace    https://thevgergroup.com/
// @version      1.0
// @description  Remove posts containing "Suggested" from the feed
// @author       Patrick O'Leary
// @match        https://www.linkedin.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/pjaol/linkedin-cleanup-js/main/clean-up-feed.js
// @downloadURL  https://raw.githubusercontent.com/pjaol/linkedin-cleanup-js/main/clean-up-feed.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide suggested posts
    function hideSuggestedPosts() {
        // Select all divs that have a data-id attribute starting with "urn:li:activity:"
        const feedItems = document.querySelectorAll('div[data-id^="urn:li:activity:"]');

        feedItems.forEach(function(feedItem) {
            // Check if any grandchild contains a span with the text "Suggested"
            const spanElement = feedItem.querySelector('span');
            if (spanElement && spanElement.textContent.trim() === 'Suggested') {
                // Instead of removing, hide the item by setting the display to none
                feedItem.style.display = 'none';
            }
        });
    }

    // Run the function initially
    hideSuggestedPosts();

    // Run the function when new posts are loaded (using a MutationObserver)
    const observer = new MutationObserver(hideSuggestedPosts);
    observer.observe(document.body, { childList: true, subtree: true });

})();

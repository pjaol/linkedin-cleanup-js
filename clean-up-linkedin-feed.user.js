// ==UserScript==
// @name         Clean Up Linkedin Posts
// @namespace    https://thevgergroup.com/
// @version      1.1
// @description  Remove posts containing "Suggested" from the feed
// @author       Patrick O'Leary
// @match        https://www.linkedin.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/pjaol/linkedin-cleanup-js/main/clean-up-feed.js
// @downloadURL  https://raw.githubusercontent.com/pjaol/linkedin-cleanup-js/main/clean-up-feed.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of selectors for different templates
    const selectors = [
        'div[data-id^="urn:li:activity:"]', // First template selector
        'article[data-activity-urn^="urn:li:activity:"]' // Second template selector
    ];

    // Object to map different languages to the word "Suggested"
    const suggestedTranslations = {
        'en': 'Suggested',// English
        'es': 'Sugerido',// Spanish
        'fr': 'Suggéré',// French
        'de': 'Vorgeschlagen',// German
        'it': 'Suggerito',// Italian
        'pt': 'Sugerido',// Portuguese
        // Add more translations as needed
    };

    // Function to determine the user's language or use English as default
    function getUserLanguage() {
        const lang = navigator.language || navigator.userLanguage; // Get browser language
        const shortLang = lang.split('-')[0]; // Extract language code
        return suggestedTranslations[shortLang] ? shortLang : 'en'; // Fallback to English if language not found
    }

    // Get the correct translation based on the user's language
    const userLanguage = getUserLanguage();
    const suggestedText = suggestedTranslations[userLanguage];

    // Function to hide suggested posts
    function hideSuggestedPosts() {
        // Loop through each selector in the array
        selectors.forEach(function(selector) {
            const feedItems = document.querySelectorAll(selector);

            feedItems.forEach(function(feedItem) {
                // Check for different elements where "Suggested" might appear
                const spanElement = feedItem.querySelector('span, p'); // Check for both span and p elements
                if (spanElement && spanElement.textContent.trim() === suggestedText) {
                    // Hide the item by setting display to none
                    feedItem.style.display = 'none';
                }
            });
        });
    }

    // Run the function initially
    hideSuggestedPosts();

    // Run the function when new posts are loaded (using a MutationObserver)
    const observer = new MutationObserver(hideSuggestedPosts);
    observer.observe(document.body, { childList: true, subtree: true });

})();


// ==UserScript==
// @name         Clean Up Linkedin Posts
// @namespace    https://thevgergroup.com/
// @version      1.2
// @description  Remove posts containing "Suggested" or "Promoted" from the feed
// @author       Patrick O'Leary
// @match        https://www.linkedin.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/pjaol/linkedin-cleanup-js/main/clean-up-feed.js
// @downloadURL  https://raw.githubusercontent.com/pjaol/linkedin-cleanup-js/main/clean-up-feed.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of selectors for different LinkedIn post templates
    const selectors = [
        'div[data-id^="urn:li:activity:"]',
        'article[data-activity-urn^="urn:li:activity:"]'
    ];

    // Object to map different languages to "Suggested"
    const suggestedTranslations = {
        en: 'Suggested',
        es: 'Sugerido',
        fr: 'Suggéré',
        de: 'Vorgeschlagen',
        it: 'Suggerito',
        pt: 'Sugerido',
        // etc...
    };

    // Object to map different languages to "Promoted"
    const promotedTranslations = {
        en: 'Promoted',
        es: 'Patrocinado',
        fr: 'Sponsorisé',
        de: 'Gesponsert',
        it: 'Sponsorizzato',
        pt: 'Patrocinado',
        // etc...
    };

    // Function to determine the user's language or fallback to English
    function getUserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        const shortLang = lang.split('-')[0];
        // fallback to 'en' if not recognized
        return shortLang in suggestedTranslations ? shortLang : 'en';
    }

    const userLanguage = getUserLanguage();
    const suggestedText = suggestedTranslations[userLanguage];
    const promotedText = promotedTranslations[userLanguage];

    // Function to hide posts
    function hideBlockedPosts() {
        selectors.forEach(function(selector) {
            const feedItems = document.querySelectorAll(selector);

            feedItems.forEach(function(feedItem) {
                // Check for any elements that might contain the text
                const textElements = feedItem.querySelectorAll('span, p, div');

                // If any of these matches our "Suggested" or "Promoted" text exactly, hide it
                for (let el of textElements) {
                    // Trim and compare
                    const text = el.textContent.trim();
                    if (text === suggestedText || text === promotedText) {
                        feedItem.style.display = 'none';
                        break; // no need to check the rest
                    }
                }
            });
        });
    }

    // Run initially
    hideBlockedPosts();

    // Observe for changes (infinite scrolling, etc.)
    const observer = new MutationObserver(hideBlockedPosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();

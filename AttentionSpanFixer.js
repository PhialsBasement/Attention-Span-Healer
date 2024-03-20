// ==UserScript==
// @name         Attention Span Fixer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hides the YouTube recommended videos sidebar for 25% of the video duration
// @match        https://www.youtube.com/
// @grant        none
// @author       Phial
// ==/UserScript==
(function() {
    'use strict';

    function hideRecommended() {
        var sidebar = document.querySelector('ytd-item-section-renderer[section-identifier="sid-wn-chips"]');
        if (sidebar) {
            sidebar.style.visibility = 'hidden';
        }
    }

    function showRecommended() {
        var sidebar = document.querySelector('ytd-item-section-renderer[section-identifier="sid-wn-chips"]');
        if (sidebar) {
            sidebar.style.visibility = 'visible';
        }
    }

    function getVideoDuration() {
        var durationElement = document.querySelector('.ytp-time-duration');
        if (durationElement) {
            var durationParts = durationElement.textContent.split(':');
            var minutes = parseInt(durationParts[0]) || 0;
            var seconds = parseInt(durationParts[1]) || 0;
            return minutes * 60 + seconds;
        }
        return 0;
    }

    function startHidingRecommended() {
        var duration = getVideoDuration();
        if (duration > 0) {
            var hideTime = duration * 0.25 * 1000; // Convert to milliseconds
            hideRecommended();
            setTimeout(showRecommended, hideTime);
        }
    }

    function handleUrlChange() {
        // Wait for the video duration element to be available
        var checkExist = setInterval(function() {
            if (getVideoDuration() > 0 && document.querySelector('ytd-item-section-renderer[section-identifier="sid-wn-chips"]')) {
                clearInterval(checkExist);
                startHidingRecommended();
            }
        }, 100);
    }

    // Run the hiding logic on initial page load
    handleUrlChange();

    // Listen for URL changes
    var lastUrl = location.href;
    new MutationObserver(function() {
        var url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handleUrlChange();
        }
    }).observe(document, {subtree: true, childList: true});
})();
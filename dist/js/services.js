/*
 * Service tiles: toggle the details on click, tap, Enter or Space.
 * Hover and keyboard focus are handled in services.css; this covers touch
 * screens, which have no hover, and keeps aria-expanded accurate.
 */
(function () {
    'use strict';

    var tiles = document.querySelectorAll('.services-section .service-tile');

    function setOpen(tile, open) {
        tile.classList.toggle('is-open', open);
        tile.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    // Peek once per tile as it scrolls into view, staggered so tiles that
    // arrive together take turns. Skipped when the visitor asks for less motion
    // or the browser cannot report visibility.
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion && 'IntersectionObserver' in window) {
        var queue = 0;
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var tile = entry.target;
                observer.unobserve(tile);
                var delay = 300 + queue * 350;
                queue += 1;
                setTimeout(function () {
                    queue = Math.max(0, queue - 1);
                    if (tile.classList.contains('is-open') || tile.matches(':hover')) return;
                    tile.classList.add('is-peeking');
                    setTimeout(function () {
                        tile.classList.remove('is-peeking');
                    }, 1400);
                }, delay);
            });
        }, { threshold: 0.75 });
        tiles.forEach(function (tile) {
            observer.observe(tile);
        });
    }

    tiles.forEach(function (tile) {
        tile.addEventListener('click', function (event) {
            // Let a scroll or text selection inside open details stay open.
            if (event.target.closest('.service-copy') && tile.classList.contains('is-open')) {
                return;
            }
            tile.classList.remove('is-peeking');
            var open = !tile.classList.contains('is-open');
            tiles.forEach(function (other) {
                if (other !== tile) setOpen(other, false);
            });
            setOpen(tile, open);
        });

        tile.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setOpen(tile, !tile.classList.contains('is-open'));
            } else if (event.key === 'Escape') {
                setOpen(tile, false);
            }
        });
    });
})();

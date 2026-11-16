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

    tiles.forEach(function (tile) {
        tile.addEventListener('click', function (event) {
            // Let a scroll or text selection inside open details stay open.
            if (event.target.closest('.service-copy') && tile.classList.contains('is-open')) {
                return;
            }
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

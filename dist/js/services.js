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

    // Closing a tile under the mouse would leave hover showing the details,
    // so a click-close also suppresses the hover reveal until the pointer leaves.
    function close(tile) {
        setOpen(tile, false);
        tile.classList.add('is-dismissed');
    }

    tiles.forEach(function (tile) {
        // A click or tap anywhere on the tile opens it, and anywhere again closes it.
        tile.addEventListener('click', function () {
            // Finishing a text selection inside the details is not a request to close.
            var selection = window.getSelection && window.getSelection();
            if (selection && !selection.isCollapsed && tile.contains(selection.anchorNode)) return;
            if (tile.classList.contains('is-open')) {
                close(tile);
                return;
            }
            tiles.forEach(function (other) {
                if (other !== tile) setOpen(other, false);
            });
            tile.classList.remove('is-dismissed');
            setOpen(tile, true);
        });

        tile.addEventListener('mouseleave', function () {
            tile.classList.remove('is-dismissed');
        });

        tile.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setOpen(tile, !tile.classList.contains('is-open'));
            } else if (event.key === 'Escape') {
                close(tile);
            }
        });
    });
})();

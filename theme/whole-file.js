// The whole file behind a block written in parts (EPIC-24).
//
// bower puts a hidden, empty `<span class="bower-whole-file">` after each
// part fence's header, carrying the file as it stands after the step
// (`data-code`), its language (`data-lang`), and the lines this fence shows
// (`data-lines`, e.g. "3-7" or "1-2,9-9"). This script adds a "whole file"
// button to that header. Hovering the button opens the file in a popup with
// this part's lines in bold; clicking pins it open; Escape or a click
// elsewhere closes it. Without this script the span shows nothing.
(function () {
    "use strict";

    // "3-7,9-9" -> [[3, 7], [9, 9]]
    function parseRanges(spec) {
        return (spec || "").split(",").map(function (r) {
            var ab = r.split("-").map(Number);
            return [ab[0], ab[1]];
        }).filter(function (r) { return r[0] > 0 && r[1] >= r[0]; });
    }

    function inRanges(line, ranges) {
        return ranges.some(function (r) { return line >= r[0] && line <= r[1]; });
    }

    // Wrap every piece of text on a marked line in <b>, after highlighting.
    // Highlight spans may cross lines, so this walks text nodes rather than
    // splitting the HTML on newlines.
    function bolden(code, ranges) {
        var walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
        var nodes = [];
        while (walker.nextNode()) { nodes.push(walker.currentNode); }
        var line = 1;
        nodes.forEach(function (node) {
            var pieces = node.nodeValue.split("\n");
            var frag = document.createDocumentFragment();
            pieces.forEach(function (piece, i) {
                if (i > 0) {
                    frag.appendChild(document.createTextNode("\n"));
                    line += 1;
                }
                if (piece === "") { return; }
                if (inRanges(line, ranges)) {
                    var b = document.createElement("b");
                    b.className = "bower-part-line";
                    b.textContent = piece;
                    frag.appendChild(b);
                } else {
                    // Dimmed, so the bold part stands out in any theme.
                    var span = document.createElement("span");
                    span.className = "bower-other-line";
                    span.textContent = piece;
                    frag.appendChild(span);
                }
            });
            node.parentNode.replaceChild(frag, node);
        });
    }

    function buildPopup(data) {
        var popup = document.createElement("div");
        popup.className = "bower-whole-file-popup";
        popup.setAttribute("role", "dialog");
        popup.setAttribute("aria-label", "Whole file: " + data.dataset.file);

        var title = document.createElement("div");
        title.className = "bower-whole-file-title";
        title.textContent = data.dataset.file;
        popup.appendChild(title);

        var pre = document.createElement("pre");
        var code = document.createElement("code");
        if (data.dataset.lang) { code.className = "language-" + data.dataset.lang; }
        code.textContent = data.dataset.code;
        pre.appendChild(code);
        popup.appendChild(pre);

        // mdBook's highlight.js is a global; a book without it still gets bold.
        if (window.hljs && data.dataset.lang) {
            try {
                (window.hljs.highlightElement || window.hljs.highlightBlock).call(window.hljs, code);
            } catch (e) { /* plain text is still readable */ }
        }
        code.classList.add("hljs");
        bolden(code, parseRanges(data.dataset.lines));
        return popup;
    }

    function attach(data) {
        var header = data.previousElementSibling;
        if (!header || !header.classList.contains("step-meta")) { return; }
        var anchor = header.querySelector("sub") || header;

        var button = document.createElement("button");
        button.type = "button";
        button.className = "bower-whole-file-button";
        button.textContent = "whole file";
        button.title = "Show the whole file, this part in bold";
        button.setAttribute("aria-expanded", "false");
        anchor.appendChild(document.createTextNode(" · "));
        anchor.appendChild(button);

        // The popup lives inside the header so it is positioned against it.
        header.classList.add("bower-whole-file-host");
        var popup = null;
        var pinned = false;
        var hideTimer = null;

        function show() {
            clearTimeout(hideTimer);
            if (!popup) {
                popup = buildPopup(data);
                popup.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
                popup.addEventListener("mouseleave", scheduleHide);
                header.appendChild(popup);
            }
            if (popup.hidden === false && popup.isConnected && popup.dataset.open) { return; }
            popup.hidden = false;
            popup.dataset.open = "1";
            button.setAttribute("aria-expanded", "true");
            // Bring this part's first line into view, a couple of lines down.
            var first = popup.querySelector(".bower-part-line");
            var pre = popup.querySelector("pre");
            if (first && pre) {
                var lineHeight = parseFloat(getComputedStyle(pre).lineHeight) || 18;
                pre.scrollTop = Math.max(0, first.offsetTop - pre.offsetTop - 2 * lineHeight);
            }
        }

        function hide() {
            if (!popup) { return; }
            popup.hidden = true;
            delete popup.dataset.open;
            pinned = false;
            button.setAttribute("aria-expanded", "false");
        }

        function scheduleHide() {
            if (pinned) { return; }
            clearTimeout(hideTimer);
            hideTimer = setTimeout(hide, 250);
        }

        button.addEventListener("mouseenter", show);
        button.addEventListener("mouseleave", scheduleHide);
        button.addEventListener("focus", show);
        button.addEventListener("blur", scheduleHide);
        button.addEventListener("click", function (e) {
            e.stopPropagation();
            if (pinned) { hide(); } else { show(); pinned = true; }
        });
        document.addEventListener("click", function (e) {
            if (pinned && popup && !popup.contains(e.target)) { hide(); }
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { hide(); }
        });
    }

    function init() {
        document.querySelectorAll("span.bower-whole-file").forEach(attach);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

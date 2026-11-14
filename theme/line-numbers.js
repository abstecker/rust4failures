// Line numbers on a fence marked `linenos`, e.g. ```rust,linenos
//
// mdBook turns each extra word of a fence's info string into a class on its
// <code>, so the block above renders as <code class="language-rust linenos">.
// This script puts a gutter of numbers beside each such block. It runs after
// book.js has highlighted the code, and it leaves the code element alone, so
// copying the block copies the code without the numbers. A fence without the
// word is untouched; without this script the word does nothing.
(function () {
    "use strict";

    function number(code) {
        var pre = code.parentElement;
        if (!pre || pre.tagName !== "PRE" || pre.querySelector(".bower-linenos")) { return; }

        // A trailing newline ends the last line; it does not start a new one.
        var text = code.textContent.replace(/\n$/, "");
        var count = text.split("\n").length;
        var numbers = [];
        for (var i = 1; i <= count; i += 1) { numbers.push(String(i)); }

        var gutter = document.createElement("span");
        gutter.className = "bower-linenos";
        gutter.setAttribute("aria-hidden", "true");
        gutter.textContent = numbers.join("\n");

        // Line the numbers up with the code's first line, whatever padding
        // the highlight theme gives it.
        var style = getComputedStyle(code);
        gutter.style.paddingTop = style.paddingTop;
        gutter.style.paddingBottom = style.paddingBottom;
        gutter.style.fontSize = style.fontSize;
        gutter.style.lineHeight = style.lineHeight;

        pre.classList.add("bower-linenos-host");
        pre.insertBefore(gutter, code);
    }

    function init() {
        document.querySelectorAll("pre > code.linenos").forEach(number);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

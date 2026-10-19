// The table (EPIC-19): turn the prelude's picture of the table into the table.
//
// The image is the embed. This script only adds to it, and gives up silently —
// script off, file://, import refused — leaving the picture that paper gets.
// Nothing here loads the engine: <pk-table> fetches its wasm when Deal is
// pressed, and until then the page has made one small request more.
(function () {
  "use strict";
  // Lineup seed: the eight bots in the picture are the eight a reader plays.
  // (The deck is pkcore's own shuffle; no seed pins the cards.) mdBook carries
  // no attributes on an image, so it is a constant here, not `{ data-seed }`.
  const SEED = "42";
  const root = typeof path_to_root === "string" ? path_to_root : "";
  // Absolute, against the page: import() refuses a bare "play/…" and, from a
  // classic script, would resolve against this file's URL, not the page's.
  const abs = (p) => new URL(root + p, document.baseURI).href;
  const imgs = document.querySelectorAll('img[src*="play/table.png"]');
  if (!imgs.length) return;
  const ready = import(abs("play/pkarena/pk-table.js"));
  for (const img of imgs) {
    const el = document.createElement("pk-table");
    el.setAttribute("base", abs("play/pkarena/"));
    el.setAttribute("seed", SEED);
    img.replaceWith(el);
    el.append(img);
    ready.catch(() => el.replaceWith(img));
  }
})();

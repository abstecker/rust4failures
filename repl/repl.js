// The REPL control (EPIC-25): a prompt over the chapter's own `Session`,
// compiled to wasm. Bower writes this file beside the modules it builds.
//
// The transcript in the page is checked by `bower verify`. This script replays
// its inputs into a fresh `Session`, so the state the reader continues from is
// the state the transcript shows, then adds a prompt under it. Whatever fails
// here — no module on `file://`, no wasm, script off — the transcript stays.
//
// A panic in `Session` reaches here as an exception, and leaves the module in
// a state nothing should call again. The prompt says what happened, in the
// log where the reader is looking, and closes until the page is reloaded.

const STYLE = `
.bower-repl { border: 1px solid var(--quote-border, #ccc); border-radius: 4px; margin: 1em 0; }
.bower-repl-log { margin: 0; max-height: 20em; overflow: auto; white-space: pre-wrap; }
.bower-repl form { display: flex; gap: 0.5em; align-items: baseline; padding: 0.4em 0.8em;
  border-top: 1px solid var(--quote-border, #ccc); font-family: var(--mono-font, monospace); }
.bower-repl form:focus-within { outline: 2px solid var(--links, #4183c4); outline-offset: -2px; }
.bower-repl input { flex: 1; min-width: 0; font: inherit; color: inherit;
  background: transparent; border: none; outline: none; }
.bower-repl input:disabled { font-style: italic; opacity: 0.7; }
`;

/** The prompt when the control names none: the kernel's `ReplCell::PROMPT`. */
const PROMPT = ">";

/** The input on `line`, if it is one: `prompt` alone, or `prompt `, then the text. */
function inputOf(line, prompt) {
  if (line === prompt) return "";
  if (line.startsWith(prompt + " ")) return line.slice(prompt.length + 1);
  return null;
}

function append(log, text) {
  const now = log.textContent;
  log.textContent = now + (now === "" || now.endsWith("\n") ? "" : "\n") + text;
  log.scrollTop = log.scrollHeight;
}

/**
 * `session.eval(text)`, or a `{ panic }` holding what went wrong. A Rust panic
 * in wasm throws only `unreachable`; the panic's own words go to
 * `console.error`, when the crate installs `console_error_panic_hook`, so they
 * are caught there as well and still printed.
 */
function evaluate(session, text) {
  const said = [];
  const error = console.error;
  console.error = (...args) => {
    said.push(args.join(" "));
    error.apply(console, args);
  };
  try {
    return { reply: session.eval(text) };
  } catch (e) {
    const words = said.join("\n").split("\n\nStack:")[0].trim();
    // Without the hook there is only the exception: `unreachable`, for a panic.
    return { panic: words || `panicked: ${(e && e.message) || e}` };
  } finally {
    console.error = error;
  }
}

/** Close the prompt for good, saying why. */
function stop(input) {
  input.disabled = true;
  input.value = "";
  input.placeholder = "the session has stopped; reload the page to start again";
}

async function mount(el) {
  const log = el.querySelector(".bower-repl-log");
  const prompt = el.dataset.prompt || PROMPT;
  let session;
  try {
    const mod = await import(new URL(el.dataset.module, document.baseURI).href);
    await mod.default();
    session = new mod.Session();
  } catch {
    return; // The transcript is the control.
  }
  for (const line of log.textContent.split("\n")) {
    const text = inputOf(line, prompt);
    if (text === null) continue;
    const said = evaluate(session, text);
    if (said.panic !== undefined) {
      // The page's own transcript does not replay: verify would have caught
      // it, so the module is not the one the transcript was checked against.
      append(log, `(the page could not replay this session: ${said.panic})`);
      return;
    }
  }

  const form = document.createElement("form");
  const label = document.createElement("label");
  label.textContent = prompt;
  const input = document.createElement("input");
  input.type = "text";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("autocapitalize", "off");
  input.setAttribute("aria-label", "Type a line and press Enter");
  label.htmlFor = input.id = `bower-repl-${Math.random().toString(36).slice(2)}`;
  form.append(label, input);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (input.disabled) return;
    const text = input.value;
    input.value = "";
    const said = evaluate(session, text);
    const echo = text === "" ? prompt : `${prompt} ${text}`;
    if (said.panic === undefined) {
      append(log, echo + "\n" + said.reply);
    } else {
      append(log, `${echo}\n${said.panic}`);
      stop(input);
    }
  });
  el.append(form);
}

if (!document.getElementById("bower-repl-style")) {
  const style = document.createElement("style");
  style.id = "bower-repl-style";
  style.textContent = STYLE;
  document.head.append(style);
}
document.querySelectorAll(".bower-repl").forEach(mount);

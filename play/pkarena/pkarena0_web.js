/**
 * Current adaptive-bots preference (see `set_adaptive`). Lets the UI restore
 * the Settings toggle to its true state on load.
 * @returns {boolean}
 */
export function adaptive_enabled() {
    const ret = wasm.adaptive_enabled();
    return ret !== 0;
}

/**
 * Current difficulty tier (see `set_difficulty`). Lets the UI restore the
 * Settings selector to its true state on load.
 * @returns {string}
 */
export function difficulty_level() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.difficulty_level();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Return all completed hand histories for this session as a YAML string.
 *
 * Returns an empty collection YAML if no hands have completed yet.
 * @returns {string}
 */
export function get_session_yaml() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.get_session_yaml();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Return the current game state as JSON without advancing anything.
 * @returns {string}
 */
export function get_state() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.get_state();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Apply a human action and advance bots until the human's next turn.
 *
 * Input is a JSON string: `{ "action": "Bet", "amount": 300 }`.
 * While the current phase is `HandComplete`, any call to this function
 * advances to the next hand instead of applying an action.
 * @param {string} action_json
 * @returns {string}
 */
export function human_action(action_json) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(action_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.human_action(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Initialise an all-bot Arena session with 9 bots (no human player).
 *
 * All seats are filled by bots; `step_bot()` will never pause for human input.
 * Returns a `GameState` JSON string.
 * @param {number} rand_seed
 * @returns {string}
 */
export function init_bot_game(rand_seed) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.init_bot_game(rand_seed);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Initialise a new session with 9 players (seat 0 = human, seats 1-8 = bots).
 *
 * Seeds the RNG from `rand_seed`, deals the first hand, and advances bots
 * until it is the human's turn. Returns a `GameState` JSON string.
 * @param {number} rand_seed
 * @returns {string}
 */
export function init_game(rand_seed) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.init_game(rand_seed);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

export function main() {
    wasm.main();
}

/**
 * Advance from a completed hand to the next one.
 *
 * Calls `end_hand`, removes busted players, moves the button, and deals a
 * fresh hand. Returns `GameState` JSON.
 * @returns {string}
 */
export function next_hand() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.next_hand();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Parse a YAML string (HandCollection or single HandHistory) and return a JSON
 * summary of each hand suitable for populating the replay viewer's hand picker.
 *
 * On parse error, returns an `error_state` JSON with the error message.
 * @param {string} yaml
 * @returns {string}
 */
export function parse_hand_collection(yaml) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(yaml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.parse_hand_collection(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * Compute a snapshot of the given hand at the given step, returned as JSON.
 *
 * `step` is clamped into `[0, total_steps - 1]`.  Step 0 is the state right
 * after blinds are posted; subsequent steps apply each voluntary action and
 * each street deal in sequence.
 * @param {string} yaml
 * @param {number} hand_index
 * @param {number} step
 * @returns {string}
 */
export function replay_snapshot(yaml, hand_index, step) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(yaml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.replay_snapshot(ptr0, len0, hand_index, step);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * EPIC-47 Phase 3: enable/disable adaptive (exploitative) bots.
 *
 * When enabled, each bot's decider is wrapped in `ExploitativeDecider` at the
 * start of the next hand-lineup build, so it deviates from its baseline
 * profile based on the largest opponent's observed stats. The change is read
 * when the lineup is constructed, so it takes effect on the next `init_game`
 * / `init_bot_game` (New Game / Start Arena), not mid-session.
 * @param {boolean} enabled
 */
export function set_adaptive(enabled) {
    wasm.set_adaptive(enabled);
}

/**
 * Update forced bets. If a hand is in progress the change is deferred until
 * the hand ends — this keeps mid-hand `min_raise()` validation stable and
 * guarantees the recorded `stakes` match the actual posts in hand history.
 * Returns updated GameState JSON.
 * @param {number} small_blind
 * @param {number} big_blind
 * @returns {string}
 */
export function set_blinds(small_blind, big_blind) {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.set_blinds(small_blind, big_blind);
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * EPIC-49 Phase 3: select the difficulty tier (`"weak"` / `"standard"` /
 * `"strong"`) for the next lineup build. Like `set_adaptive`, the value is
 * read when a lineup is constructed, so it applies on the next New Game /
 * Start Arena. Unknown levels are rejected with a console warning and the
 * current tier is kept. Returns `true` when the level was accepted.
 * @param {string} level
 * @returns {boolean}
 */
export function set_difficulty(level) {
    const ptr0 = passStringToWasm0(level, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.set_difficulty(ptr0, len0);
    return ret !== 0;
}

/**
 * Run exactly one bot action and return a JSON description of what happened.
 *
 * Returns `{"done":true}` when it is the human's turn or the hand is over.
 * Returns `{"done":false,"seat":N,"name":"…","action_label":"bets $300"}` otherwise.
 * JS calls this in a loop with a 1-second pause between calls to animate play.
 * @returns {string}
 */
export function step_bot() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.step_bot();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * Undo the last applied action within the current hand.
 *
 * Restores the game to the state it was in immediately before the most recent
 * `human_action` call that mutated session state. Returns the restored
 * `GameState` JSON. If there is nothing to undo, returns the current state
 * unchanged (no error). History is cleared at each `next_hand()` boundary, so
 * rewinding across a completed hand is not supported here.
 *
 * Bots that acted after the undone action are replayed deterministically from
 * the restored `RNG` on the next `step_bot` loop, because `BotDecider` is
 * stateless (`decide_seeded(&self, …)`).
 * @returns {string}
 */
export function undo_action() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.undo_action();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * @returns {string}
 */
export function version() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.version();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_6b64449b9b9ed33c: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_getRandomValues_3f44b700395062e5: function() { return handleError(function (arg0, arg1) {
            globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments); },
        __wbg_getRandomValues_ef12552bf5acd2fe: function() { return handleError(function (arg0, arg1) {
            globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
        }, arguments); },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_warn_3cc416af27dbdc02: function(arg0) {
            console.warn(arg0);
        },
        __wbindgen_cast_0000000000000001: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./pkarena0_web_bg.js": import0,
    };
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('pkarena0_web_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };

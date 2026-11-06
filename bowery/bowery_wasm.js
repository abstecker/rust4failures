/**
 * One element's table, for JavaScript.
 *
 * # Examples
 *
 * ```
 * use bowery::wasm::BoweryTable;
 *
 * let table = BoweryTable::new("
 * mode: play
 * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
 * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
 * ").unwrap();
 * assert!(table.state().contains(r#""mode":"play""#));
 * ```
 */
export class BoweryTable {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BoweryTableFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_bowerytable_free(ptr, 0);
    }
    /**
     * The reader acts: `{"action":"raise","amount":600}`.
     *
     * # Errors
     *
     * The JSON does not read, or the game refuses the action.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { button: 0, stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * assert!(table.act(r#"{"action":"call"}"#).is_ok());
     * ```
     * @param {string} action_json
     */
    act(action_json) {
        const ptr0 = passStringToWasm0(action_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.bowerytable_act(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * One step: `"acted"`, `"dealt"`, `"waiting"` or `"over"`.
     *
     * # Errors
     *
     * The engine failed.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { button: 0, stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * assert_eq!("waiting", table.advance().unwrap());
     * ```
     * @returns {string}
     */
    advance() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.bowerytable_advance(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Back to the record at the takeover moment.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * table.back_to_record();
     * assert!(table.state().contains(r#""record":"none""#));
     * ```
     */
    back_to_record() {
        wasm.bowerytable_back_to_record(this.__wbg_ptr);
    }
    /**
     * Reads, checks and builds a table from a YAML config.
     *
     * # Errors
     *
     * The config's problems as a JSON string (see
     * [`crate::element::Table::problems_json`]).
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ");
     * assert!(table.is_ok());
     * ```
     * @param {string} config_yaml
     */
    constructor(config_yaml) {
        const ptr0 = passStringToWasm0(config_yaml, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.bowerytable_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0];
        BoweryTableFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Play: deals the next hand.
     *
     * # Errors
     *
     * Not play mode, the hand is not over, or the table is broken.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { button: 0, stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * table.act(r#"{"action":"fold"}"#).unwrap();
     * while table.advance().unwrap() != "over" {}
     * assert!(table.next_hand().is_ok());
     * ```
     */
    next_hand() {
        const ret = wasm.bowerytable_next_hand(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Moves to moment `index`, from 0; past the end, to the last.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * table.seek(0);
     * assert!(table.state().contains(r#""moment":1"#));
     * ```
     * @param {number} index
     */
    seek(index) {
        wasm.bowerytable_seek(this.__wbg_ptr, index);
    }
    /**
     * Draws in `layout` from now on: `ring`, `spotlight` or `ledger`.
     *
     * # Errors
     *
     * Any other name.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * assert!(table.set_layout("ledger").is_ok());
     * ```
     * @param {string} layout
     */
    set_layout(layout) {
        const ptr0 = passStringToWasm0(layout, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.bowerytable_set_layout(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Turns the win percents on or off; they show only in the `all` view.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * view: all
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * table.set_odds(true); // play starts with the odds off
     * assert!(table.state().contains(r#""odds":true"#));
     * ```
     * @param {boolean} on
     */
    set_odds(on) {
        wasm.bowerytable_set_odds(this.__wbg_ptr, on);
    }
    /**
     * Draws in `view` from now on: `all` or `seat`.
     *
     * # Errors
     *
     * Any other name.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * assert!(table.set_view("all").is_ok());
     * ```
     * @param {string} view
     */
    set_view(view) {
        const ptr0 = passStringToWasm0(view, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.bowerytable_set_view(this.__wbg_ptr, ptr0, len0);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Play: a new game seeded with `seed`.
     *
     * # Errors
     *
     * Not play mode.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * assert!(table.shuffle(9).is_ok());
     * ```
     * @param {number} seed
     */
    shuffle(seed) {
        const ret = wasm.bowerytable_shuffle(this.__wbg_ptr, seed);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * The controls' state as JSON (see [`crate::element::State`]).
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * assert!(table.state().contains(r#""moment":1"#));
     * ```
     * @returns {string}
     */
    state() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.bowerytable_state(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The table on screen as SVG, `width` pixels wide, dark or light.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let table = BoweryTable::new("
     * mode: play
     * table: { stakes: { small_blind: 1.0, big_blind: 2.0 } }
     * players: [ { seat: 0, stack: 200 }, { seat: 1, stack: 200, bot: abc } ]
     * ").unwrap();
     * assert!(table.svg(400, true).contains(r#"width="400""#));
     * ```
     * @param {number} width
     * @param {boolean} dark
     * @returns {string}
     */
    svg(width, dark) {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.bowerytable_svg(this.__wbg_ptr, width, dark);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The reader takes `seat` (interactive).
     *
     * # Errors
     *
     * The game's reason, as a string.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * let mut table = BoweryTable::new("
     * mode: interactive
     * hand:
     *   hand: { id: ex, game: holdem }
     *   table: { seats: 2, button: 0, stakes: { small_blind: 1.0, big_blind: 2.0 } }
     *   players: [ { seat: 0, name: A, stack: 100.0 }, { seat: 1, name: B, stack: 100.0 } ]
     *   streets: { preflop: { actions: [ { seat: 0, action: fold } ] } }
     * ").unwrap();
     * assert!(table.take_seat(0).is_ok());
     * ```
     * @param {number} seat
     */
    take_seat(seat) {
        const ret = wasm.bowerytable_take_seat(this.__wbg_ptr, seat);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * This crate's version.
     *
     * # Examples
     *
     * ```
     * use bowery::wasm::BoweryTable;
     *
     * assert_eq!(env!("CARGO_PKG_VERSION"), BoweryTable::version());
     * ```
     * @returns {string}
     */
    static version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.bowerytable_version();
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}
if (Symbol.dispose) BoweryTable.prototype[Symbol.dispose] = BoweryTable.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_41e9ee4f547fc59a: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_generic_0000000000000001: function(arg0, arg1) {
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
        "./bowery_wasm_bg.js": import0,
    };
}

const BoweryTableFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_bowerytable_free(ptr, 1));

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
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

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
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

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (!module.ok) {
            throw new Error(`failed to fetch Wasm: ${module.status} ${module.statusText} fetching '${module.url}'`);
        }

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = expectedResponseType(module.type);

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
        module_or_path = new URL('bowery_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };

/* eslint-disable */
function __awaiter(t, n, d, s) {
    return new(d = d || Promise)(function(r, e) {
        function a(t) {
            try {
                i(s.next(t))
            } catch (t) {
                e(t)
            }
        }

        function h(t) {
            try {
                i(s.throw(t))
            } catch (t) {
                e(t)
            }
        }

        function i(t) {
            var e;
            t.done ? r(t.value) : ((e = t.value) instanceof d ? e : new d(function(t) {
                t(e)
            })).then(a, h)
        }
        i((s = s.apply(t, n || [])).next())
    })
}
const util = {
    encodeUtf8: null,
    decodeUtf8: null,
    fillString: null,
    userLogger: null,
    encodeUtf8: function(t) {
        return unescape(encodeURIComponent(t))
    },
    decodeUtf8: function(t) {
        return decodeURIComponent(escape(t))
    },
    fillString: function(t, e) {
        let r = "";
        for (; 0 < e;) {
            1 & e && (r += t);
            0 < (e >>>= 1) && (t += t);
        }
        return r
    }
};
class ByteBuffer {
    constructor(t = "") {
        this.data = t;
        this.read = 0;
    }
    static fromArrayBuffer(t) {
        const r = new Uint8Array(t);
        try {
            let e = [];
            return r.map(t => e.push(String.fromCharCode(t))), new ByteBuffer(e.join(""))
        } catch (t) {
            for (let t = 0; t < r.length; ++t);
            throw t
        }
        return new ByteBuffer("123")
    }
    length() {
        return this.data.length - this.read
    }
    isEmpty() {
        return this.length() <= 0
    }
    putByte(t) {
        return this.data += String.fromCharCode(t), this
    }
    fillWithByte(t, e) {
        let r = String.fromCharCode(t),
            a = this.data;
        for (; 0 < e;) {
            1 & e && (a += r); 
            0 < (e >>>= 1) && (r += r);
        }
        return this.data = a, this
    }
    putBytes(t) {
        return this.data += t, this
    }
    putString(t) {
        return this.data += util.encodeUtf8(t), this
    }
    putInt16(t) {
        return this.data += String.fromCharCode(t >> 8 & 255) + String.fromCharCode(255 & t), this
    }
    putInt24(t) {
        return this.data += String.fromCharCode(t >> 16 & 255) + String.fromCharCode(t >> 8 & 255) + String.fromCharCode(255 & t), this
    }
    putInt32(t) {
        return this.data += String.fromCharCode(t >> 24 & 255) + String.fromCharCode(t >> 16 & 255) + String.fromCharCode(t >> 8 & 255) + String.fromCharCode(255 & t), this
    }
    putInt16Le(t) {
        return this.data += String.fromCharCode(255 & t) + String.fromCharCode(t >> 8 & 255), this
    }
    putInt24Le(t) {
        return this.data += String.fromCharCode(255 & t) + String.fromCharCode(t >> 8 & 255) + String.fromCharCode(t >> 16 & 255), this
    }
    putInt32Le(t) {
        return this.data += String.fromCharCode(255 & t) + String.fromCharCode(t >> 8 & 255) + String.fromCharCode(t >> 16 & 255) + String.fromCharCode(t >> 24 & 255), this
    }
    putInt(t, e) {
        for (; e -= 8, this.data += String.fromCharCode(t >> e & 255), 0 < e;);
        return this
    }
    putSignedInt(t, e) {
        return t < 0 && (t += 2 << e - 1), this.putInt(t, e)
    }
    putBuffer(t) {
        return this.data += t.getBytes(), this
    }
    getByte() {
        return this.data.charCodeAt(this.read++)
    }
    getInt16function() {
        var t = this.data.charCodeAt(this.read) << 8 ^ this.data.charCodeAt(this.read + 1);
        return this.read += 2, t
    }
    getInt24() {
        var t = this.data.charCodeAt(this.read) << 16 ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2);
        return this.read += 3, t
    }
    getInt32() {
        var t = this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3);
        return this.read += 4, t
    }
    getInt16Le() {
        var t = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8;
        return this.read += 2, t
    }
    getInt24Le() {
        var t = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16;
        return this.read += 3, t
    }
    getInt32Le() {
        var t = this.data.charCodeAt(this.read) ^ this.data.charCodeAt(this.read + 1) << 8 ^ this.data.charCodeAt(this.read + 2) << 16 ^ this.data.charCodeAt(this.read + 3) << 24;
        return this.read += 4, t
    }
    getInt(t) {
        let e = 0;
        for (; e = (e << 8) + this.data.charCodeAt(this.read++), 0 < (t -= 8););
        return e
    }
    getSignedInt(t) {
        let e = this.getInt(t);
        t = 2 << t - 2;
        return e >= t && (e -= t << 1), e
    }
    getBytes(t) {
        let e;
        return t ? (t = Math.min(this.length(), t), e = this.data.slice(this.read, this.read + t), this.read += t) : 0 === t ? e = "" : (e = 0 === this.read ? this.data : this.data.slice(this.read), this.clear()), e
    }
    bytes(t) {
        return void 0 === t ? this.data.slice(this.read) : this.data.slice(this.read, this.read + t)
    }
    at(t) {
        return this.data.charCodeAt(this.read + t)
    }
    setAt(t, e) {
        return this.data = this.data.substr(0, this.read + t) + String.fromCharCode(e) + this.data.substr(this.read + t + 1), this
    }
    last() {
        return this.data.charCodeAt(this.data.length - 1)
    }
    copy() {
        const t = new ByteBuffer(this.data);
        return t.read = this.read, t
    }
    compact() {
        return 0 < this.read && (this.data = this.data.slice(this.read), this.read = 0), this
    }
    clear() {
        return this.data = "", this.read = 0, this
    }
    truncate(t) {
        t = Math.max(0, this.length() - t);
        return this.data = this.data.substr(this.read, t), this.read = 0, this
    }
    toHex() {
        let e = "";
        for (let t = this.read; t < this.data.length; ++t) {
            const r = this.data.charCodeAt(t);
            r < 16 && (e += "0");
            e += r.toString(16);
        }
        return e
    }
    toString() {
        return util.decodeUtf8(this.bytes())
    }
}
const sha256 = {};
let _padding = null,
    _initialized = !1,
    _k = new Array(64);
const _init = function() {
        _padding = String.fromCharCode(128);
        _padding += util.fillString(String.fromCharCode(0), 64);
        _k = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
        _initialized = !0;
    },
    _update = function(t, e, r) {
        let a, h, i, n, d, s, o, u, c, f, g, C, l, p, m, A = r.length();
        for (; 64 <= A;) {
            for (o = 0; o < 16; ++o) e[o] = r.getInt32();
            for (; o < 64; ++o) {
                a = ((a = e[o - 2]) >>> 17 | a << 15) ^ (a >>> 19 | a << 13) ^ a >>> 10;
                h = ((h = e[o - 15]) >>> 7 | h << 25) ^ (h >>> 18 | h << 14) ^ h >>> 3;
                e[o] = a + e[o - 7] + h + e[o - 16] & 4294967295;
            }
            for (u = t.h0, c = t.h1, f = t.h2, g = t.h3, C = t.h4, l = t.h5, p = t.h6, m = t.h7, o = 0; o < 64; ++o) {
                n = (C >>> 6 | C << 26) ^ (C >>> 11 | C << 21) ^ (C >>> 25 | C << 7);
                d = p ^ C & (l ^ p); 
                i = (u >>> 2 | u << 30) ^ (u >>> 13 | u << 19) ^ (u >>> 22 | u << 10); 
                s = u & c | f & (u ^ c); 
                a = m + n + d + _k[o] + e[o]; 
                h = i + s; 
                m = p; 
                p = l; 
                l = C; 
                C = g + a & 4294967295; 
                g = f; 
                f = c; 
                c = u; 
                u = a + h & 4294967295;
            }
            t.h0 = t.h0 + u & 4294967295; 
            t.h1 = t.h1 + c & 4294967295; 
            t.h2 = t.h2 + f & 4294967295; 
            t.h3 = t.h3 + g & 4294967295; 
            t.h4 = t.h4 + C & 4294967295; 
            t.h5 = t.h5 + l & 4294967295; 
            t.h6 = t.h6 + p & 4294967295; 
            t.h7 = t.h7 + m & 4294967295; 
            A -= 64;
        }
    },
    _base64 = (sha256.create = function() {
        _initialized || _init();
        let a = null,
            h = new ByteBuffer;
        const i = new Array(64),
            n = {
                algorithm: "sha256",
                blockLength: 64,
                digestLength: 32,
                messageLength: 0,
                start: null,
                update: null,
                digest: null,
                start: function() {
                    return n.messageLength = 0, h = new ByteBuffer, a = {
                        h0: 1779033703,
                        h1: 3144134277,
                        h2: 1013904242,
                        h3: 2773480762,
                        h4: 1359893119,
                        h5: 2600822924,
                        h6: 528734635,
                        h7: 1541459225
                    }, n
                }
            };
        return n.start(), n.update = function(t, e) {
            return "utf8" === e && (t = util.encodeUtf8(t)), n.messageLength += t.length, h.putBytes(t), _update(a, i, h), (2048 < h.read || 0 === h.length()) && h.compact(), n
        }, n.digest = function() {
            var t = n.messageLength;
            const e = new ByteBuffer;
            e.putBytes(h.bytes()); 
            e.putBytes(_padding.substr(0, 64 - (t + 8) % 64)); 
            e.putInt32(t >>> 29 & 255); 
            e.putInt32(t << 3 & 4294967295);
            t = {
                h0: a.h0,
                h1: a.h1,
                h2: a.h2,
                h3: a.h3,
                h4: a.h4,
                h5: a.h5,
                h6: a.h6,
                h7: a.h7
            };
            _update(t, i, e);
            const r = new ByteBuffer;
            return r.putInt32(t.h0), r.putInt32(t.h1), r.putInt32(t.h2), r.putInt32(t.h3), r.putInt32(t.h4), r.putInt32(t.h5), r.putInt32(t.h6), r.putInt32(t.h7), r
        }, n
    }, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"),
    _base64Idx = [62, -1, 62, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

function encode64(t) {
    let e = "";
    var r, a, h, i = "";
    let n = 0;
    for (; n < t.length;) {
        r = t.charCodeAt(n++); 
        a = t.charCodeAt(n++); 
        h = t.charCodeAt(n++); 
        e = (e += _base64.charAt(r >> 2)) + _base64.charAt((3 & r) << 4 | a >> 4); 
        isNaN(a) || (e = (e += _base64.charAt((15 & a) << 2 | h >> 6)) + (isNaN(h) ? "" : _base64.charAt(63 & h)));
    }
    return i += e
}

function decode64(t) {
    var e, r, a, h, i = (t = t.replace(/[^A-Za-z0-9\-_=]/g, "")).length % 4;
    2 == i ? t += "==" : 3 == i && (t += "=");
    let n = "",
        d = 0;
    for (; d < t.length;) {
        e = _base64Idx[t.charCodeAt(d++) - 43]; 
        r = _base64Idx[t.charCodeAt(d++) - 43]; 
        a = _base64Idx[t.charCodeAt(d++) - 43]; 
        h = _base64Idx[t.charCodeAt(d++) - 43]; 
        n += String.fromCharCode(e << 2 | r >> 4); 
        64 !== a && (n += String.fromCharCode((15 & r) << 4 | a >> 2)); 
        64 !== h && (n += String.fromCharCode((3 & a) << 6 | h));
    }
    return n
}
const URLBase64NoPadding = encode64;

function hash(t, e) {
    let r = sha256.create(),
        a = t;
    for (let t = 0; t < e; ++t) {
        r.start(); 
        r.update(a); 
        a = r.digest().bytes();
    }
    return a
}

function createUserBaseCredential(t, e) {
    t = hash(t, e.ubci);
    return t
}

function createUserCredentialWithUP(t, e) {
    t = hash(t, e.ubci + e.hubci); 
    t = hash(t + e.sc, e.fi);
    return t
}

function createUserCredentialWithUBC(t, e) {
    t = hash(t, e.hubci); 
    t = hash(t + e.sc, e.fi);
    return t
}
URLBase64NoPadding.encode = encode64; 
URLBase64NoPadding.decode = decode64;
class guardrail_client {
    constructor(t) {
        this.config = JSON.parse(URLBase64NoPadding.decode(t))
    }
    newUser(r) {
        return __awaiter(this, void 0, void 0, function*() {
            var t = createUserBaseCredential(r, this.config),
                e = createUserCredentialWithUBC(t, this.config);
            return JSON.stringify({
                ubc: URLBase64NoPadding.encode(t),
                uc: URLBase64NoPadding.encode(e)
            })
        })
    }
    changeUser(r, a) {
        return __awaiter(this, void 0, void 0, function*() {
            var t = JSON.parse(yield this.newUser(a)),
                e = yield this.authUser(r);
            return {
                nubc: t.ubc,
                nuc: t.uc,
                ouc: e
            }
        })
    }
    authUser(e) {
        return __awaiter(this, void 0, void 0, function*() {
            var t = createUserCredentialWithUP(e, this.config);
            return URLBase64NoPadding.encode(t)
        })
    }
}
export {
    guardrail_client as
    default
};
//# sourceMappingURL=guardrail_client.js.map
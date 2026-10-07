export function initCosmic(canvas) {
	var CFG = {
		curves: 40,
		segments: 280,
		twist: 2.1,
		cap: 1.4,
		camDist: 6.6,
		fitWide: 1.9,
		fitTall: 1.55,
		maxDpr: 2,
		lineWidth: 1.1,
		glowPx: 7,
		spin: 0.045,
		ringDrift: 0.07,
		tilt: 0.34,
		roll: -0.2,
		stars: 360,
		speed: 0.3,
		pulses: 2,
		arms: 3,
	};
	var RINGS = [
		{ r: 1.46, tilt: 1.15, yaw: 0.0, speed: 0.16, pulses: 1 },
		{ r: 1.46, tilt: 1.15, yaw: 2.0944, speed: 0.16, pulses: 1 },
		{ r: 1.46, tilt: 1.15, yaw: 4.1888, speed: 0.16, pulses: 1 },
		{ r: 1.82, tilt: 0.0, yaw: 0.0, speed: 0.11, pulses: 2 },
	];

	function hex(h) {
		return [
			parseInt(h.substr(1, 2), 16) * 0.0039216,
			parseInt(h.substr(3, 2), 16) * 0.0039216,
			parseInt(h.substr(5, 2), 16) * 0.0039216,
		];
	}
	var PAL = {
		dark: {
			edge: hex('#000000'),
			center: hex('#000000'),
			c0: hex('#8b7dff'),
			c1: hex('#5fd4ff'),
			c2: hex('#f4f7ff'),
			star: hex('#cfd9ff'),
			alpha: [0.24, 0.78, 0.55, 1.0],
			starAmt: 0.6,
		},
		light: {
			edge: hex('#f5f5f5'),
			center: hex('#fafaff'),
			c0: hex('#4b3fd0'),
			c1: hex('#0e7ea8'),
			c2: hex('#0b1033'),
			star: hex('#2b3160'),
			alpha: [0.26, 0.62, 0.1, 0.0],
			starAmt: 0.28,
		},
	};
	function mixv(a, b, t) {
		var o = [];
		for (var i = 0; i < a.length; i++) o.push(a[i] + (b[i] - a[i]) * t);
		return o;
	}

	function mul(a, b) {
		var o = new Float32Array(16);
		for (var c = 0; c < 4; c++) {
			for (var r = 0; r < 4; r++) {
				var s = 0;
				for (var k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
				o[c * 4 + r] = s;
			}
		}
		return o;
	}
	function rotX(a) {
		var c = Math.cos(a),
			s = Math.sin(a);
		return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
	}
	function rotY(a) {
		var c = Math.cos(a),
			s = Math.sin(a);
		return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
	}
	function rotZ(a) {
		var c = Math.cos(a),
			s = Math.sin(a);
		return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	}

	function rng(seed) {
		return function () {
			seed = (seed + 0x6d2b79f5) | 0;
			var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) * 2.3283064e-10;
		};
	}

	var device = null,
		ctx = null,
		fmt = '',
		P = {},
		G = {},
		raf = 0,
		last = 0,
		t0 = 0;
	var time = 0,
		spin = 0,
		ringYaw = 0,
		themeT = 0,
		themeTarget = 0,
		themeFrom = 0,
		themeStart = 0,
		themeDur = 0,
		themeEase = null;
	var W = 1,
		H = 1,
		dpr = 1,
		proj = null,
		lastCW = 0,
		lastCH = 0,
		resizePending = false;
	var projBg = null,
		ox = 0,
		oy = 0,
		scl = 1,
		slotKey = '';
	var slot = document.querySelector('[data-cosmic-slot]');
	var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

	/* uniform 結構在 WGSL 中的位元組大小（含尾端對齊到 16）。
	   線條有 5 組（曲線 1 組加 4 個環），各自放在 uniform buffer 的不同位移，
	   這樣同一個 render pass 內的每次 draw 才能讀到各自的參數。 */
	var LINE_SIZE = 336,
		STAR_SIZE = 240,
		BG_SIZE = 48,
		LINE_SLOTS = 1 + RINGS.length;
	var lineFloats = 0,
		lineData = null,
		starData = new Float32Array(STAR_SIZE / 4),
		bgData = new Float32Array(BG_SIZE / 4);

	var BLEND = {
		color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
		alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
	};

	var WGSL = {
		line: [
			'struct LineU {',
			'  proj: mat4x4f,',
			'  view: mat4x4f,',
			'  model: mat4x4f,',
			'  c0: vec4f,',
			'  c1: vec4f,',
			'  c2: vec4f,',
			'  alpha: vec4f,',
			'  ring: vec4f,',
			'  res: vec2f,',
			'  width: f32,',
			'  camDist: f32,',
			'  twist: f32,',
			'  cap: f32,',
			'  time: f32,',
			'  mode: f32,',
			'  speed: f32,',
			'  pulses: f32,',
			'  arms: f32,',
			'  count: f32,',
			'  glowPx: f32,',
			'  reveal: f32,',
			'}',
			'',
			'@group(0) @binding(0) var<uniform> U: LineU;',
			'',
			'struct VOut {',
			'  @builtin(position) pos: vec4f,',
			'  @location(0) vSide: f32,',
			'  @location(1) vT: f32,',
			'  @location(2) vId: f32,',
			'  @location(3) vDepth: f32,',
			'  @location(4) vHw: f32,',
			'  @location(5) vHwe: f32,',
			'}',
			'',
			'const PI = 3.14159265359;',
			'',
			'fn isCurve() -> f32 {',
			'  return 1.0 - step(0.5, U.mode);',
			'}',
			'',
			'fn pulse(t: f32, id: f32) -> f32 {',
			'  let off = mix(U.ring.w, id / U.count * U.arms, isCurve());',
			'  let u = fract((U.time * U.speed - t) * U.pulses + off);',
			'  return pow(1.0 - u, 4.5);',
			'}',
			'',
			'fn curvePos(t: f32, id: f32) -> vec3f {',
			'  let phi = (t - 0.5) * 2.0 * U.cap;',
			'  let lam = id / U.count * 2.0 * PI + U.twist * (1.0 - cos(phi));',
			'  return vec3f(cos(phi) * cos(lam), sin(phi), cos(phi) * sin(lam));',
			'}',
			'',
			'fn ringPos(t: f32) -> vec3f {',
			'  let th = t * 2.0 * PI;',
			'  var p = U.ring.x * vec3f(sin(th), 0.0, cos(th));',
			'  let ca = cos(U.ring.y);',
			'  let sa = sin(U.ring.y);',
			'  p = vec3f(p.x, p.y * ca - p.z * sa, p.y * sa + p.z * ca);',
			'  let cy = cos(U.ring.z);',
			'  let sy = sin(U.ring.z);',
			'  return vec3f(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);',
			'}',
			'',
			'fn pos(t: f32, id: f32) -> vec3f {',
			'  return mix(ringPos(t), curvePos(t, id), isCurve());',
			'}',
			'',
			'@vertex',
			'fn vs(@location(0) aT: f32, @location(1) aSide: f32, @location(2) aId: f32) -> VOut {',
			'  let e = 0.0015;',
			'  let k = isCurve();',
			'  let t0 = mix(aT - e, clamp(aT - e, 0.0, 1.0), k);',
			'  let t1 = mix(aT + e, clamp(aT + e, 0.0, 1.0), k);',
			'  let mv = U.view * U.model;',
			'  let v = mv * vec4f(pos(aT, aId), 1.0);',
			'  let c = U.proj * v;',
			'  let c0 = U.proj * mv * vec4f(pos(t0, aId), 1.0);',
			'  let c1 = U.proj * mv * vec4f(pos(t1, aId), 1.0);',
			'  var d = (c1.xy / c1.w - c0.xy / c0.w) * 0.5 * U.res;',
			'  d = d / max(length(d), 0.0001);',
			'  let n = vec2f(-d.y, d.x);',
			'  let I = pulse(aT, aId);',
			'  let hw = 0.5 * U.width * (1.0 + 0.9 * I);',
			'  let hwe = hw + 1.0 + U.glowPx * I;',
			'  let rad = mix(U.ring.x, 1.0, k);',
			'  var o: VOut;',
			'  o.pos = vec4f(c.xy + n * aSide * hwe * 2.0 / U.res * c.w, c.z, c.w);',
			'  o.vDepth = 1.0 - smoothstep(U.camDist - rad, U.camDist + rad, -v.z);',
			'  o.vSide = aSide;',
			'  o.vT = aT;',
			'  o.vId = aId;',
			'  o.vHw = hw;',
			'  o.vHwe = hwe;',
			'  return o;',
			'}',
			'',
			'@fragment',
			'fn fs(f: VOut) -> @location(0) vec4f {',
			'  let I = pulse(f.vT, f.vId);',
			'  let dpx = abs(f.vSide) * f.vHwe;',
			'  let core = clamp(f.vHw - dpx + 0.5, 0.0, 1.0);',
			'  let glow = I * I * exp(-dpx * dpx / (U.glowPx * U.glowPx * 0.6 + 0.001));',
			'  let k = isCurve();',
			'  let fe = mix(1.0, smoothstep(0.0, 0.12, f.vT) * (1.0 - smoothstep(0.88, 1.0, f.vT)), k);',
			'  let g = mix(0.5 + 0.5 * cos(6.2831853 * f.vT), smoothstep(0.0, 1.0, f.vT), k);',
			'  let rv = mix(smoothstep(0.4, 1.0, U.reveal), 1.0 - smoothstep(U.reveal - 0.2, U.reveal, abs(f.vT - 0.5) * 2.0), k);',
			'  var a = (core * (U.alpha.x + I * U.alpha.y) + glow * U.alpha.z) * fe * mix(0.1, 1.0, f.vDepth) * rv;',
			'  a = clamp(a, 0.0, 1.0);',
			'  let col = mix(mix(U.c0.xyz, U.c1.xyz, g), U.c2.xyz, I);',
			'  return vec4f(col * a, a * (1.0 - U.alpha.w));',
			'}',
		].join('\n'),
		/* WebGPU 沒有 point sprite，星點改用 instanced 的四邊形，邊長與原本的 gl_PointSize 相同。 */
		star: [
			'struct StarU {',
			'  proj: mat4x4f,',
			'  view: mat4x4f,',
			'  model: mat4x4f,',
			'  col: vec4f,',
			'  res: vec2f,',
			'  time: f32,',
			'  px: f32,',
			'  amt: f32,',
			'  add: f32,',
			'}',
			'',
			'@group(0) @binding(0) var<uniform> S: StarU;',
			'',
			'struct SOut {',
			'  @builtin(position) pos: vec4f,',
			'  @location(0) vA: f32,',
			'  @location(1) uv: vec2f,',
			'}',
			'',
			'@vertex',
			'fn vs(@builtin(vertex_index) vi: u32, @location(0) aPos: vec3f, @location(1) aSeed: vec2f) -> SOut {',
			'  var corners = array<vec2f, 4>(vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0), vec2f(1.0, 1.0));',
			'  let cr = corners[vi];',
			'  let c = S.proj * S.view * S.model * vec4f(aPos, 1.0);',
			'  let size = S.px * (1.0 + aSeed.x * 1.6);',
			'  var o: SOut;',
			'  o.pos = vec4f(c.xy + cr * size / S.res * c.w, c.z, c.w);',
			'  if (abs(c.x) > c.w || abs(c.y) > c.w) {',
			'    o.pos = vec4f(2.0, 2.0, 2.0, 1.0);',
			'  }',
			'  o.vA = 0.3 + 0.7 * (0.5 + 0.5 * sin(S.time * (0.5 + aSeed.x) + aSeed.y * 6.2831853));',
			'  o.uv = cr;',
			'  return o;',
			'}',
			'',
			'@fragment',
			'fn fs(f: SOut) -> @location(0) vec4f {',
			'  let d = length(f.uv);',
			'  let a = (1.0 - smoothstep(0.3, 1.0, d)) * f.vA * S.amt;',
			'  return vec4f(S.col.xyz * a, a * (1.0 - S.add));',
			'}',
		].join('\n'),
		bg: [
			'struct BgU {',
			'  edge: vec4f,',
			'  center: vec4f,',
			'  ctr: vec2f,',
			'  size: f32,',
			'  h: f32,',
			'}',
			'',
			'@group(0) @binding(0) var<uniform> B: BgU;',
			'',
			'@vertex',
			'fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4f {',
			'  var v = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));',
			'  return vec4f(v[vi], 0.0, 1.0);',
			'}',
			'',
			'@fragment',
			'fn fs(@builtin(position) fc: vec4f) -> @location(0) vec4f {',
			'  let frag = vec2f(fc.x, B.h - fc.y);',
			'  let q = (frag - B.ctr) / B.size;',
			'  let c = mix(B.edge.xyz, B.center.xyz, exp(-dot(q, q) * 2.2));',
			'  let n = fract(sin(dot(frag, vec2f(12.9898, 78.233))) * 43758.5453);',
			'  return vec4f(c + (n - 0.5) * 0.0039, 1.0);',
			'}',
		].join('\n'),
	};

	async function shader(code) {
		var m = device.createShaderModule({ code: code });
		var info = await m.getCompilationInfo();
		var ok = true;
		info.messages.forEach(function (x) {
			if (x.type === 'error') {
				ok = false;
				console.warn('line ' + x.lineNum + ': ' + x.message);
			}
		});
		return ok ? m : null;
	}

	function pipeline(mod, buffers, topology, blend) {
		return device.createRenderPipeline({
			layout: 'auto',
			vertex: { module: mod, entryPoint: 'vs', buffers: buffers },
			fragment: {
				module: mod,
				entryPoint: 'fs',
				targets: [blend ? { format: fmt, blend: BLEND } : { format: fmt }],
			},
			primitive: { topology: topology },
		});
	}

	function buffer(data, usage) {
		var b = device.createBuffer({
			size: Math.ceil(data.byteLength / 4) * 4,
			usage: usage | GPUBufferUsage.COPY_DST,
		});
		device.queue.writeBuffer(b, 0, data);
		return b;
	}

	function uniformBuffer(size) {
		return device.createBuffer({ size: size, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
	}

	function strip(lines, segs) {
		var v = new Float32Array(lines * (segs + 1) * 6);
		var idx = new Uint16Array(lines * segs * 6);
		var vi = 0,
			ii = 0,
			base = 0;
		for (var l = 0; l < lines; l++) {
			for (var s = 0; s <= segs; s++) {
				var t = s / segs;
				v[vi++] = t;
				v[vi++] = -1;
				v[vi++] = l;
				v[vi++] = t;
				v[vi++] = 1;
				v[vi++] = l;
				if (s < segs) {
					var a = base + s * 2;
					idx[ii++] = a;
					idx[ii++] = a + 1;
					idx[ii++] = a + 2;
					idx[ii++] = a + 1;
					idx[ii++] = a + 3;
					idx[ii++] = a + 2;
				}
			}
			base += (segs + 1) * 2;
		}
		return {
			vbo: buffer(v, GPUBufferUsage.VERTEX),
			ibo: buffer(idx, GPUBufferUsage.INDEX),
			count: idx.length,
		};
	}

	function stars(n) {
		var r = rng(7),
			v = new Float32Array(n * 5);
		for (var i = 0; i < n; i++) {
			var z = r() * 2 - 1,
				a = r() * 6.2831853,
				s = Math.sqrt(1 - z * z);
			var rad = 2.8 + Math.pow(r(), 1.4) * 5.5;
			v[i * 5] = s * Math.cos(a) * rad;
			v[i * 5 + 1] = z * rad;
			v[i * 5 + 2] = s * Math.sin(a) * rad;
			v[i * 5 + 3] = r();
			v[i * 5 + 4] = r();
		}
		return { vbo: buffer(v, GPUBufferUsage.VERTEX), count: n };
	}

	async function init() {
		if (!navigator.gpu) return false;
		var adapter = await navigator.gpu.requestAdapter();
		if (!adapter) return false;
		var dev = await adapter.requestDevice();
		device = dev;
		dev.lost.then(function (info) {
			if (dev !== device) return;
			cancelAnimationFrame(raf);
			if (info.reason === 'destroyed') return;
			init()
				.then(function (ok) {
					if (ok) {
						proj = null;
						resize();
						start();
					}
				})
				.catch(function (e) {
					console.warn(e);
				});
		});
		ctx = ctx || canvas.getContext('webgpu');
		if (!ctx) return false;
		fmt = navigator.gpu.getPreferredCanvasFormat();
		ctx.configure({ device: device, format: fmt, alphaMode: 'opaque' });

		var mods = await Promise.all([shader(WGSL.line), shader(WGSL.star), shader(WGSL.bg)]);
		if (!mods[0] || !mods[1] || !mods[2]) return false;

		device.pushErrorScope('validation');

		P.line = pipeline(
			mods[0],
			[
				{
					arrayStride: 12,
					attributes: [
						{ shaderLocation: 0, offset: 0, format: 'float32' },
						{ shaderLocation: 1, offset: 4, format: 'float32' },
						{ shaderLocation: 2, offset: 8, format: 'float32' },
					],
				},
			],
			'triangle-list',
			true,
		);
		P.star = pipeline(
			mods[1],
			[
				{
					arrayStride: 20,
					stepMode: 'instance',
					attributes: [
						{ shaderLocation: 0, offset: 0, format: 'float32x3' },
						{ shaderLocation: 1, offset: 12, format: 'float32x2' },
					],
				},
			],
			'triangle-strip',
			true,
		);
		P.bg = pipeline(mods[2], [], 'triangle-list', false);

		var align = device.limits.minUniformBufferOffsetAlignment;
		var stride = Math.ceil(LINE_SIZE / align) * align;
		lineFloats = stride / 4;
		lineData = new Float32Array(lineFloats * LINE_SLOTS);

		G.lineBuf = uniformBuffer(stride * LINE_SLOTS);
		G.starBuf = uniformBuffer(STAR_SIZE);
		G.bgBuf = uniformBuffer(BG_SIZE);
		G.lineBind = [];
		for (var i = 0; i < LINE_SLOTS; i++) {
			G.lineBind.push(
				device.createBindGroup({
					layout: P.line.getBindGroupLayout(0),
					entries: [{ binding: 0, resource: { buffer: G.lineBuf, offset: i * stride, size: LINE_SIZE } }],
				}),
			);
		}
		G.starBind = device.createBindGroup({
			layout: P.star.getBindGroupLayout(0),
			entries: [{ binding: 0, resource: { buffer: G.starBuf, size: STAR_SIZE } }],
		});
		G.bgBind = device.createBindGroup({
			layout: P.bg.getBindGroupLayout(0),
			entries: [{ binding: 0, resource: { buffer: G.bgBuf, size: BG_SIZE } }],
		});

		G.curves = strip(CFG.curves, CFG.segments);
		G.ring = strip(1, 360);
		G.stars = stars(CFG.stars);

		var err = await device.popErrorScope();
		if (err) {
			console.warn(err.message);
			return false;
		}
		return true;
	}

	/* 球體的落點：讀取版面中的 slot，把場景用偏軸投影移到 slot 中心並縮放到能放進去。
	   沒有 slot 時維持原本置中的構圖。 */
	function place(cw, ch) {
		ox = 0;
		oy = 0;
		scl = 1;
		if (!slot) return;
		var r = slot.getBoundingClientRect();
		if (r.width < 8 || r.height < 8) return;
		var natural = cw / ch >= 1 ? (RINGS[3].r / CFG.fitWide) * ch : (RINGS[3].r / CFG.fitTall) * cw;
		scl = Math.max(0.3, Math.min(1, Math.min(r.width, r.height) / natural));
		ox = ((r.left + r.width / 2) / cw) * 2 - 1;
		oy = 1 - ((r.top + r.height / 2) / ch) * 2;
	}

	/* WebGPU 的裁切空間深度範圍是 [0, 1]（WebGL 是 [-1, 1]），所以第三列的 z 項跟著改。 */
	function frustum(aspect, tanHalf, sx, sy) {
		var f = 1 / tanHalf,
			n = 0.1,
			fr = 40;
		return new Float32Array([
			f / aspect,
			0,
			0,
			0,
			0,
			f,
			0,
			0,
			-sx,
			-sy,
			fr / (n - fr),
			-1,
			0,
			0,
			(fr * n) / (n - fr),
			0,
		]);
	}

	function resize() {
		var cw = canvas.clientWidth || window.innerWidth;
		var ch = canvas.clientHeight || window.innerHeight;
		var key = '';
		if (slot) {
			var sr = slot.getBoundingClientRect();
			key = [sr.left, sr.top, sr.width, sr.height].map(Math.round).join(',');
		}
		if (proj && key === slotKey && cw === lastCW && Math.abs(ch - lastCH) < 140) return;
		slotKey = key;
		lastCW = cw;
		lastCH = ch;
		dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
		W = Math.max(2, Math.round(cw * dpr));
		H = Math.max(2, Math.round(ch * dpr));
		canvas.width = W;
		canvas.height = H;
		place(cw, ch);
		var aspect = W / H;
		var tanHalf = aspect >= 1 ? CFG.fitWide / CFG.camDist : CFG.fitTall / aspect / CFG.camDist;
		proj = frustum(aspect, tanHalf / scl, ox, oy);
		projBg = frustum(aspect, tanHalf, 0, 0);
	}

	function draw(reveal) {
		var T = themeT,
			L = PAL.light,
			D = PAL.dark;
		var view = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -CFG.camDist, 1]);
		var tilt = mul(rotZ(CFG.roll), rotX(CFG.tilt));
		var base = tilt;
		var alpha = mixv(L.alpha, D.alpha, T);
		var c0 = mixv(L.c0, D.c0, T),
			c1 = mixv(L.c1, D.c1, T),
			c2 = mixv(L.c2, D.c2, T);
		var q = device.queue;

		bgData.set(mixv(L.edge, D.edge, T), 0);
		bgData.set(mixv(L.center, D.center, T), 4);
		bgData[8] = (ox * 0.5 + 0.5) * W;
		bgData[9] = (oy * 0.5 + 0.5) * H;
		bgData[10] = Math.min(W, H) * scl;
		bgData[11] = H;
		q.writeBuffer(G.bgBuf, 0, bgData);

		starData.set(projBg, 0);
		starData.set(view, 16);
		starData.set(mul(base, rotY(spin * 0.5)), 32);
		starData.set(mixv(L.star, D.star, T), 48);
		starData[52] = W;
		starData[53] = H;
		starData[54] = time;
		starData[55] = dpr;
		starData[56] = (L.starAmt + (D.starAmt - L.starAmt) * T) * Math.min(1, reveal);
		starData[57] = alpha[3];
		q.writeBuffer(G.starBuf, 0, starData);

		var curveModel = mul(base, rotY(spin));
		var ringAlpha = [alpha[0] * 0.7, alpha[1] * 0.8, alpha[2], alpha[3]];
		for (var s = 0; s < LINE_SLOTS; s++) {
			var o = s * lineFloats;
			var isRing = s > 0;
			var R = isRing ? RINGS[s - 1] : null;
			lineData.set(proj, o);
			lineData.set(view, o + 16);
			lineData.set(isRing ? base : curveModel, o + 32);
			lineData.set(c0, o + 48);
			lineData.set(c1, o + 52);
			lineData.set(c2, o + 56);
			lineData.set(isRing ? ringAlpha : alpha, o + 60);
			lineData.set(isRing ? [R.r, R.tilt, R.tilt > 0 ? R.yaw + ringYaw : 0, 0] : [0, 0, 0, 0], o + 64);
			lineData[o + 68] = W;
			lineData[o + 69] = H;
			lineData[o + 70] = isRing ? CFG.lineWidth * 0.85 * dpr : CFG.lineWidth * dpr;
			lineData[o + 71] = CFG.camDist;
			lineData[o + 72] = CFG.twist;
			lineData[o + 73] = CFG.cap;
			lineData[o + 74] = time;
			lineData[o + 75] = isRing ? 1 : 0;
			lineData[o + 76] = isRing ? R.speed : CFG.speed;
			lineData[o + 77] = isRing ? R.pulses : CFG.pulses;
			lineData[o + 78] = CFG.arms;
			lineData[o + 79] = isRing ? 1 : CFG.curves;
			lineData[o + 80] = CFG.glowPx * dpr;
			lineData[o + 81] = reveal;
		}
		q.writeBuffer(G.lineBuf, 0, lineData);

		var enc = device.createCommandEncoder();
		var pass = enc.beginRenderPass({
			colorAttachments: [
				{
					view: ctx.getCurrentTexture().createView(),
					clearValue: { r: 0, g: 0, b: 0, a: 1 },
					loadOp: 'clear',
					storeOp: 'store',
				},
			],
		});

		pass.setPipeline(P.bg);
		pass.setBindGroup(0, G.bgBind);
		pass.draw(3);

		pass.setPipeline(P.star);
		pass.setBindGroup(0, G.starBind);
		pass.setVertexBuffer(0, G.stars.vbo);
		pass.draw(4, G.stars.count);

		pass.setPipeline(P.line);
		pass.setBindGroup(0, G.lineBind[0]);
		pass.setVertexBuffer(0, G.curves.vbo);
		pass.setIndexBuffer(G.curves.ibo, 'uint16');
		pass.drawIndexed(G.curves.count);

		pass.setVertexBuffer(0, G.ring.vbo);
		pass.setIndexBuffer(G.ring.ibo, 'uint16');
		for (var i = 0; i < RINGS.length; i++) {
			pass.setBindGroup(0, G.lineBind[1 + i]);
			pass.drawIndexed(G.ring.count);
		}

		pass.end();
		q.submit([enc.finish()]);
	}

	function frame(now) {
		raf = requestAnimationFrame(frame);
		var dt = Math.min((now - last) * 0.001, 0.05);
		last = now;
		var ts = reduced ? 0.3 : 1;
		time += dt * ts;
		spin += dt * ts * CFG.spin;
		ringYaw += dt * ts * CFG.ringDrift;
		if (themeT !== themeTarget) {
			var p = themeDur > 0 ? Math.max(0, Math.min(1, (now - themeStart) / themeDur)) : 1;
			themeT = p >= 1 ? themeTarget : themeFrom + (themeTarget - themeFrom) * themeEase(p);
		}
		var e = Math.min(1, (now - t0) * 0.00038);
		var reveal = reduced ? 1.25 : (1 - Math.pow(1 - e, 3)) * 1.25;
		if (resizePending) {
			resizePending = false;
			resize();
		}
		draw(reveal);
		canvas.style.opacity = '1';
	}

	function start() {
		cancelAnimationFrame(raf);
		last = t0 = performance.now();
		raf = requestAnimationFrame(frame);
	}

	function isDark() {
		return document.documentElement.getAttribute('data-theme') === 'dark';
	}

	/* 讀取網站 CSS 的 transition 設定，讓 canvas 的明暗切換與頁面同步。
	   依序檢查舞台元素、body、html，取第一個有時長的。 */
	function bezier(x1, y1, x2, y2) {
		function ax(t) {
			return 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t;
		}
		function ay(t) {
			return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
		}
		return function (x) {
			var lo = 0,
				hi = 1,
				t = x;
			for (var i = 0; i < 24; i++) {
				t = (lo + hi) / 2;
				if (ax(t) < x) lo = t;
				else hi = t;
			}
			return ay(t);
		};
	}
	var EASE_KEYWORDS = {
		linear: [0, 0, 1, 1],
		ease: [0.25, 0.1, 0.25, 1],
		'ease-in': [0.42, 0, 1, 1],
		'ease-out': [0, 0, 0.58, 1],
		'ease-in-out': [0.42, 0, 0.58, 1],
	};
	function parseEase(str) {
		var m = /cubic-bezier\(([^)]+)\)/.exec(str || '');
		if (m) {
			var v = m[1].split(',').map(parseFloat);
			if (v.length === 4 && v.every(isFinite)) return bezier(v[0], v[1], v[2], v[3]);
		}
		var kw = EASE_KEYWORDS[(str || '').split(',')[0].trim()];
		kw = kw || [0.4, 0, 0.2, 1];
		return bezier(kw[0], kw[1], kw[2], kw[3]);
	}
	function parseTime(str) {
		var max = 0;
		(str || '').split(',').forEach(function (t) {
			var n = parseFloat(t);
			if (!isFinite(n)) return;
			max = Math.max(max, /ms\s*$/.test(t) ? n : n * 1000);
		});
		return max;
	}
	function readTransition() {
		var els = [canvas.parentNode, document.body, document.documentElement];
		for (var i = 0; i < els.length; i++) {
			if (!els[i]) continue;
			var cs = getComputedStyle(els[i]);
			var d = parseTime(cs.transitionDuration);
			if (d > 0) return { duration: d, ease: parseEase(cs.transitionTimingFunction) };
		}
		return { duration: 150, ease: parseEase('') };
	}
	function setTheme(v) {
		if (v === themeTarget) return;
		var tr = readTransition();
		themeFrom = themeT;
		themeTarget = v;
		themeStart = performance.now();
		themeDur = tr.duration;
		themeEase = tr.ease;
	}
	themeTarget = themeT = isDark() ? 1 : 0;
	new MutationObserver(function () {
		setTheme(isDark() ? 1 : 0);
	}).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	window.addEventListener('appearance-changed', function (e) {
		setTheme(e.detail && e.detail.appearance === 'dark' ? 1 : 0);
	});

	document.addEventListener('visibilitychange', function () {
		last = performance.now();
	});

	function queueResize() {
		resizePending = true;
	}

	/* WebGPU 的裝置初始化是非同步的，所以在這裡等 init 完成後才開始 resize 與動畫。 */
	init()
		.then(function (ok) {
			if (!ok) return;
			resize();
			if (window.ResizeObserver) {
				var ro = new ResizeObserver(queueResize);
				ro.observe(canvas);
				if (slot) ro.observe(slot);
			} else window.addEventListener('resize', queueResize);
			start();
		})
		.catch(function (e) {
			console.warn(e);
		});
}

const target = document.getElementById('cosmic-lines');
if (target) initCosmic(target);

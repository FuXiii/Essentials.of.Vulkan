

var Module = Module;

// Redefine these in a --pre-js to override behavior. If you would like to
// remove out() or err() altogether, you can no-op it out to function() {},
// and build with --closure 1 to get Closure optimize out all the uses
// altogether.

var out = (text) => console.log(text);
var err = (text) => console.error(text);

// Override this function in a --pre-js file to get a signal for when
// compilation is ready. In that callback, call the function run() to start
// the program.
function ready() {
  run();
}

// See https://caniuse.com/mdn-javascript_builtins_object_assign

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)

// {{PRE_JSES}}




/** @param {string|number=} what */
function abort(what) {
  throw what;
}

// include: runtime_strings.js


// runtime_strings.js: String related runtime functions that are part of both
// MINIMAL_RUNTIME and regular runtime.

var UTF8Decoder = new TextDecoder('utf8');

/**
 * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
 * array that contains uint8 values, returns a copy of that string as a
 * Javascript String object.
 * heapOrArray is either a regular array, or a JavaScript typed array view.
 * @param {number} idx
 * @param {number=} maxBytesToRead
 * @return {string}
 */
function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
  var endIdx = idx + maxBytesToRead;
  var endPtr = idx;
  // TextDecoder needs to know the byte length in advance, it doesn't stop on
  // null terminator by itself.  Also, use the length info to avoid running tiny
  // strings through TextDecoder, since .subarray() allocates garbage.
  // (As a tiny code save trick, compare endPtr against endIdx using a negation,
  // so that undefined means Infinity)
  while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;

  return UTF8Decoder.decode(heapOrArray.buffer ? heapOrArray.subarray(idx, endPtr) : new Uint8Array(heapOrArray.slice(idx, endPtr)));
}

/**
 * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
 * emscripten HEAP, returns a copy of that string as a Javascript String object.
 *
 * @param {number} ptr
 * @param {number=} maxBytesToRead - An optional length that specifies the
 *   maximum number of bytes to read. You can omit this parameter to scan the
 *   string until the first \0 byte. If maxBytesToRead is passed, and the string
 *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
 *   string will cut short at that byte index (i.e. maxBytesToRead will not
 *   produce a string of exact length [ptr, ptr+maxBytesToRead[) N.B. mixing
 *   frequent uses of UTF8ToString() with and without maxBytesToRead may throw
 *   JS JIT optimizations off, so it is worth to consider consistently using one
 * @return {string}
 */
function UTF8ToString(ptr, maxBytesToRead) {
  if (!ptr) return '';
  var maxPtr = ptr + maxBytesToRead;
  for (var end = ptr; !(end >= maxPtr) && HEAPU8[end];) ++end;
  return UTF8Decoder.decode(HEAPU8.subarray(ptr, end));
}

/**
 * Copies the given Javascript String object 'str' to the given byte array at
 * address 'outIdx', encoded in UTF8 form and null-terminated. The copy will
 * require at most str.length*4+1 bytes of space in the HEAP.  Use the function
 * lengthBytesUTF8 to compute the exact number of bytes (excluding null
 * terminator) that this function will write.
 *
 * @param {string} str - The Javascript string to copy.
 * @param {ArrayBufferView|Array<number>} heap - The array to copy to. Each
 *                                               index in this array is assumed
 *                                               to be one 8-byte element.
 * @param {number} outIdx - The starting offset in the array to begin the copying.
 * @param {number} maxBytesToWrite - The maximum number of bytes this function
 *                                   can write to the array.  This count should
 *                                   include the null terminator, i.e. if
 *                                   maxBytesToWrite=1, only the null terminator
 *                                   will be written and nothing else.
 *                                   maxBytesToWrite=0 does not write any bytes
 *                                   to the output, not even the null
 *                                   terminator.
 * @return {number} The number of bytes written, EXCLUDING the null terminator.
 */
function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
  // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
  // undefined and false each don't write out any bytes.
  if (!(maxBytesToWrite > 0))
    return 0;

  var startIdx = outIdx;
  var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
    // and https://www.ietf.org/rfc/rfc2279.txt
    // and https://tools.ietf.org/html/rfc3629
    var u = str.charCodeAt(i); // possibly a lead surrogate
    if (u >= 0xD800 && u <= 0xDFFF) {
      var u1 = str.charCodeAt(++i);
      u = 0x10000 + ((u & 0x3FF) << 10) | (u1 & 0x3FF);
    }
    if (u <= 0x7F) {
      if (outIdx >= endIdx) break;
      heap[outIdx++] = u;
    } else if (u <= 0x7FF) {
      if (outIdx + 1 >= endIdx) break;
      heap[outIdx++] = 0xC0 | (u >> 6);
      heap[outIdx++] = 0x80 | (u & 63);
    } else if (u <= 0xFFFF) {
      if (outIdx + 2 >= endIdx) break;
      heap[outIdx++] = 0xE0 | (u >> 12);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    } else {
      if (outIdx + 3 >= endIdx) break;
      heap[outIdx++] = 0xF0 | (u >> 18);
      heap[outIdx++] = 0x80 | ((u >> 12) & 63);
      heap[outIdx++] = 0x80 | ((u >> 6) & 63);
      heap[outIdx++] = 0x80 | (u & 63);
    }
  }
  // Null-terminate the pointer to the buffer.
  heap[outIdx] = 0;
  return outIdx - startIdx;
}

/**
 * Copies the given Javascript String object 'str' to the emscripten HEAP at
 * address 'outPtr', null-terminated and encoded in UTF8 form. The copy will
 * require at most str.length*4+1 bytes of space in the HEAP.
 * Use the function lengthBytesUTF8 to compute the exact number of bytes
 * (excluding null terminator) that this function will write.
 *
 * @return {number} The number of bytes written, EXCLUDING the null terminator.
 */
function stringToUTF8(str, outPtr, maxBytesToWrite) {
  return stringToUTF8Array(str, HEAPU8,outPtr, maxBytesToWrite);
}

/**
 * Returns the number of bytes the given Javascript string takes if encoded as a
 * UTF8 byte array, EXCLUDING the null terminator byte.
 *
 * @param {string} str - JavaScript string to operator on
 * @return {number} Length, in bytes, of the UTF8 encoded string.
 */
function lengthBytesUTF8(str) {
  var len = 0;
  for (var i = 0; i < str.length; ++i) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
    // unit, not a Unicode code point of the character! So decode
    // UTF16->UTF32->UTF8.
    // See http://unicode.org/faq/utf_bom.html#utf16-3
    var c = str.charCodeAt(i); // possibly a lead surrogate
    if (c <= 0x7F) {
      len++;
    } else if (c <= 0x7FF) {
      len += 2;
    } else if (c >= 0xD800 && c <= 0xDFFF) {
      len += 4; ++i;
    } else {
      len += 3;
    }
  }
  return len;
}

// end include: runtime_strings.js
var HEAP8, HEAP16, HEAP32, HEAPU8, HEAPU16, HEAPU32, HEAPF32, HEAPF64,
  wasmMemory, buffer, wasmTable;

function updateGlobalBufferAndViews(b) {
  buffer = b;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
}

// include: runtime_stack_check.js


// end include: runtime_stack_check.js
// include: runtime_assertions.js


// end include: runtime_assertions.js
// include: runtime_math.js


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/imul

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc

// end include: runtime_math.js
// include: memoryprofiler.js


// end include: memoryprofiler.js
// include: runtime_debug.js


// end include: runtime_debug.js
// === Body ===

var ASM_CONSTS = {
  
};
function glue_preint() { var entry = __glue_main_; if (entry) { navigator["gpu"]; if (navigator["gpu"]) { navigator["gpu"]["requestAdapter"]().then( function(adapter) { adapter["requestDevice"]().then(function(device) { Module["preinitializedWebGPUDevice"] = device; entry(); }); }, function() { console.error("No WebGPU adapter; not starting"); }); } else { console.error("No support for WebGPU; not starting"); } } else { console.error("Entry point not found; unable to start"); } }




  var wasmTableMirror = [];
  function getWasmTableEntry(funcPtr) {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length) wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    }
  function _emscripten_request_animation_frame_loop(cb, userData) {
      function tick(timeStamp) {
        if (getWasmTableEntry(cb)(timeStamp, userData)) {
          requestAnimationFrame(tick);
        }
      }
      return requestAnimationFrame(tick);
    }

  function getHeapMax() {
      return HEAPU8.length;
    }
  function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      return false; // malloc will report failure
    }

  var WebGPU = {initManagers:function() {
        if (WebGPU.mgrDevice) return;
  
        /** @constructor */
        function Manager() {
          this.objects = {};
          this.nextId = 1;
          this.create = function(object, wrapper /* = {} */) {
            wrapper = wrapper || {};
  
            var id = this.nextId++;
            
            wrapper.refcount = 1;
            wrapper.object = object;
            this.objects[id] = wrapper;
            return id;
          };
          this.get = function(id) {
            if (!id) return undefined;
            var o = this.objects[id];
            
            return o.object;
          };
          this.reference = function(id) {
            var o = this.objects[id];
            
            o.refcount++;
          };
          this.release = function(id) {
            var o = this.objects[id];
            
            
            o.refcount--;
            if (o.refcount <= 0) {
              delete this.objects[id];
            }
          };
        }
  
        WebGPU.mgrSurface = WebGPU.mgrSurface || new Manager();
        WebGPU.mgrSwapChain = WebGPU.mgrSwapChain || new Manager();
  
        WebGPU.mgrAdapter = WebGPU.mgrAdapter || new Manager();
        // TODO: Release() the device's default queue when the device is freed.
        WebGPU.mgrDevice = WebGPU.mgrDevice || new Manager();
        WebGPU.mgrQueue = WebGPU.mgrQueue || new Manager();
  
        WebGPU.mgrCommandBuffer = WebGPU.mgrCommandBuffer || new Manager();
        WebGPU.mgrCommandEncoder = WebGPU.mgrCommandEncoder || new Manager();
        WebGPU.mgrRenderPassEncoder = WebGPU.mgrRenderPassEncoder || new Manager();
        WebGPU.mgrComputePassEncoder = WebGPU.mgrComputePassEncoder || new Manager();
  
        WebGPU.mgrBindGroup = WebGPU.mgrBindGroup || new Manager();
        WebGPU.mgrBuffer = WebGPU.mgrBuffer || new Manager();
        WebGPU.mgrSampler = WebGPU.mgrSampler || new Manager();
        WebGPU.mgrTexture = WebGPU.mgrTexture || new Manager();
        WebGPU.mgrTextureView = WebGPU.mgrTextureView || new Manager();
        WebGPU.mgrQuerySet = WebGPU.mgrQuerySet || new Manager();
  
        WebGPU.mgrBindGroupLayout = WebGPU.mgrBindGroupLayout || new Manager();
        WebGPU.mgrPipelineLayout = WebGPU.mgrPipelineLayout || new Manager();
        WebGPU.mgrRenderPipeline = WebGPU.mgrRenderPipeline || new Manager();
        WebGPU.mgrComputePipeline = WebGPU.mgrComputePipeline || new Manager();
        WebGPU.mgrShaderModule = WebGPU.mgrShaderModule || new Manager();
  
        WebGPU.mgrRenderBundleEncoder = WebGPU.mgrRenderBundleEncoder || new Manager();
        WebGPU.mgrRenderBundle = WebGPU.mgrRenderBundle || new Manager();
      },makeColor:function(ptr) {
        return {
          "r": HEAPF64[((ptr)>>3)],
          "g": HEAPF64[(((ptr)+(8))>>3)],
          "b": HEAPF64[(((ptr)+(16))>>3)],
          "a": HEAPF64[(((ptr)+(24))>>3)],
        };
      },makeExtent3D:function(ptr) {
        return {
          "width": HEAPU32[((ptr)>>2)],
          "height": HEAPU32[(((ptr)+(4))>>2)],
          "depthOrArrayLayers": HEAPU32[(((ptr)+(8))>>2)],
        };
      },makeOrigin3D:function(ptr) {
        return {
          "x": HEAPU32[((ptr)>>2)],
          "y": HEAPU32[(((ptr)+(4))>>2)],
          "z": HEAPU32[(((ptr)+(8))>>2)],
        };
      },makeImageCopyTexture:function(ptr) {
        
        return {
          "texture": WebGPU.mgrTexture.get(
            HEAPU32[(((ptr)+(4))>>2)]),
          "mipLevel": HEAPU32[(((ptr)+(8))>>2)],
          "origin": WebGPU.makeOrigin3D(ptr + 12),
          "aspect": WebGPU.TextureAspect[HEAPU32[(((ptr)+(24))>>2)]],
        };
      },makeTextureDataLayout:function(ptr) {
        
        var bytesPerRow = HEAPU32[(((ptr)+(16))>>2)];
        var rowsPerImage = HEAPU32[(((ptr)+(20))>>2)];
        return {
          "offset": HEAPU32[((((ptr + 4))+(8))>>2)] * 0x100000000 + HEAPU32[(((ptr)+(8))>>2)],
          "bytesPerRow": bytesPerRow === 4294967295 ? undefined : bytesPerRow,
          "rowsPerImage": rowsPerImage === 4294967295 ? undefined : rowsPerImage,
        };
      },makeImageCopyBuffer:function(ptr) {
        
        var layoutPtr = ptr + 8;
        var bufferCopyView = WebGPU.makeTextureDataLayout(layoutPtr);
        bufferCopyView["buffer"] = WebGPU.mgrBuffer.get(
          HEAPU32[(((ptr)+(32))>>2)]);
        return bufferCopyView;
      },makePipelineConstants:function(constantCount, constantsPtr) {
        if (!constantCount) return;
        var constants = {};
        for (var i = 0; i < constantCount; ++i) {
          var entryPtr = constantsPtr + 16 * i;
          var key = UTF8ToString(HEAPU32[(((entryPtr)+(4))>>2)]);
          constants[key] = HEAPF64[(((entryPtr)+(8))>>3)];
        }
        return constants;
      },makeProgrammableStageDescriptor:function(ptr) {
        if (!ptr) return undefined;
        
        return {
          "module": WebGPU.mgrShaderModule.get(
            HEAPU32[(((ptr)+(4))>>2)]),
          "entryPoint": UTF8ToString(
            HEAPU32[(((ptr)+(8))>>2)]),
          "constants": WebGPU.makePipelineConstants(
            HEAPU32[(((ptr)+(12))>>2)],
            HEAPU32[(((ptr)+(16))>>2)]),
        };
      },DeviceLostReason:{undefined:0,destroyed:1},PreferredFormat:{rgba8unorm:18,bgra8unorm:23},AddressMode:["repeat","mirror-repeat","clamp-to-edge"],BlendFactor:["zero","one","src","one-minus-src","src-alpha","one-minus-src-alpha","dst","one-minus-dst","dst-alpha","one-minus-dst-alpha","src-alpha-saturated","constant","one-minus-constant"],BlendOperation:["add","subtract","reverse-subtract","min","max"],BufferBindingType:[,"uniform","storage","read-only-storage"],CompareFunction:[,"never","less","less-equal","greater","greater-equal","equal","not-equal","always"],CompilationInfoRequestStatus:["success","error","device-lost","unknown"],ComputePassTimestampLocation:["beginning","end"],CullMode:["none","front","back"],ErrorFilter:["validation","out-of-memory"],FeatureName:[,"depth-clip-control","depth32float-stencil8","timestamp-query","pipeline-statistics-query","texture-compression-bc","texture-compression-etc2","texture-compression-astc","indirect-first-instance"],FilterMode:["nearest","linear"],FrontFace:["ccw","cw"],IndexFormat:[,"uint16","uint32"],LoadOp:[,"clear","load"],PipelineStatisticName:["vertex-shader-invocations","clipper-invocations","clipper-primitives-out","fragment-shader-invocations","compute-shader-invocations"],PowerPreference:[,"low-power","high-performance"],PrimitiveTopology:["point-list","line-list","line-strip","triangle-list","triangle-strip"],QueryType:["occlusion","pipeline-statistics","timestamp"],RenderPassTimestampLocation:["beginning","end"],SamplerBindingType:[,"filtering","non-filtering","comparison"],StencilOperation:["keep","zero","replace","invert","increment-clamp","decrement-clamp","increment-wrap","decrement-wrap"],StorageTextureAccess:[,"write-only"],StoreOp:[,"store","discard"],TextureAspect:["all","stencil-only","depth-only"],TextureComponentType:["float","sint","uint","depth-comparison"],TextureDimension:["1d","2d","3d"],TextureFormat:[,"r8unorm","r8snorm","r8uint","r8sint","r16uint","r16sint","r16float","rg8unorm","rg8snorm","rg8uint","rg8sint","r32float","r32uint","r32sint","rg16uint","rg16sint","rg16float","rgba8unorm","rgba8unorm-srgb","rgba8snorm","rgba8uint","rgba8sint","bgra8unorm","bgra8unorm-srgb","rgb10a2unorm","rg11b10ufloat","rgb9e5ufloat","rg32float","rg32uint","rg32sint","rgba16uint","rgba16sint","rgba16float","rgba32float","rgba32uint","rgba32sint","stencil8","depth16unorm","depth24plus","depth24plus-stencil8","depth32float","depth32float-stencil8","bc1-rgba-unorm","bc1-rgba-unorm-srgb","bc2-rgba-unorm","bc2-rgba-unorm-srgb","bc3-rgba-unorm","bc3-rgba-unorm-srgb","bc4-r-unorm","bc4-r-snorm","bc5-rg-unorm","bc5-rg-snorm","bc6h-rgb-ufloat","bc6h-rgb-float","bc7-rgba-unorm","bc7-rgba-unorm-srgb","etc2-rgb8unorm","etc2-rgb8unorm-srgb","etc2-rgb8a1unorm","etc2-rgb8a1unorm-srgb","etc2-rgba8unorm","etc2-rgba8unorm-srgb","eac-r11unorm","eac-r11snorm","eac-rg11unorm","eac-rg11snorm","astc-4x4-unorm","astc-4x4-unorm-srgb","astc-5x4-unorm","astc-5x4-unorm-srgb","astc-5x5-unorm","astc-5x5-unorm-srgb","astc-6x5-unorm","astc-6x5-unorm-srgb","astc-6x6-unorm","astc-6x6-unorm-srgb","astc-8x5-unorm","astc-8x5-unorm-srgb","astc-8x6-unorm","astc-8x6-unorm-srgb","astc-8x8-unorm","astc-8x8-unorm-srgb","astc-10x5-unorm","astc-10x5-unorm-srgb","astc-10x6-unorm","astc-10x6-unorm-srgb","astc-10x8-unorm","astc-10x8-unorm-srgb","astc-10x10-unorm","astc-10x10-unorm-srgb","astc-12x10-unorm","astc-12x10-unorm-srgb","astc-12x12-unorm","astc-12x12-unorm-srgb"],TextureSampleType:[,"float","unfilterable-float","depth","sint","uint"],TextureViewDimension:[,"1d","2d","2d-array","cube","cube-array","3d"],VertexFormat:[,"uint8x2","uint8x4","sint8x2","sint8x4","unorm8x2","unorm8x4","snorm8x2","snorm8x4","uint16x2","uint16x4","sint16x2","sint16x4","unorm16x2","unorm16x4","snorm16x2","snorm16x4","float16x2","float16x4","float32","float32x2","float32x3","float32x4","uint32","uint32x2","uint32x3","uint32x4","sint32","sint32x2","sint32x3","sint32x4"],VertexStepMode:["vertex","instance",],FeatureNameString2Enum:{undefined:"0",'depth-clip-control':"1",'depth32float-stencil8':"2",'timestamp-query':"3",'pipeline-statistics-query':"4",'texture-compression-bc':"5",'texture-compression-etc2':"6",'texture-compression-astc':"7",'indirect-first-instance':"8"}};
  function _emscripten_webgpu_get_device() {
      if (WebGPU.preinitializedDeviceId === undefined) {
        var device = Module['preinitializedWebGPUDevice'];
        var deviceWrapper = { queueId: WebGPU.mgrQueue.create(device["queue"]) };
        WebGPU.preinitializedDeviceId = WebGPU.mgrDevice.create(device, deviceWrapper);
      }
      WebGPU.mgrDevice.reference(WebGPU.preinitializedDeviceId);
      return WebGPU.preinitializedDeviceId;
    }

  function _wgpuBindGroupLayoutRelease(id) {
    WebGPU.mgrBindGroupLayout.release(id);
  }

  function _wgpuCommandBufferRelease(id) {
    WebGPU.mgrCommandBuffer.release(id);
  }

  function _wgpuCommandEncoderBeginRenderPass(encoderId, descriptor) {
      
  
      function makeColorAttachment(caPtr) {
        var viewPtr = HEAPU32[((caPtr)>>2)];
        if (viewPtr === 0) {
          // view could be undefined.
          return undefined;
        }
  
        var loadOpInt = HEAPU32[(((caPtr)+(8))>>2)];
  
        var storeOpInt = HEAPU32[(((caPtr)+(12))>>2)];
  
        var clearValue = WebGPU.makeColor(caPtr + 16);
  
        return {
          "view": WebGPU.mgrTextureView.get(viewPtr),
          "resolveTarget": WebGPU.mgrTextureView.get(
            HEAPU32[(((caPtr)+(4))>>2)]),
          "clearValue": clearValue,
          "loadOp":  WebGPU.LoadOp[loadOpInt],
          "storeOp": WebGPU.StoreOp[storeOpInt],
        };
      }
  
      function makeColorAttachments(count, caPtr) {
        var attachments = [];
        for (var i = 0; i < count; ++i) {
          attachments.push(makeColorAttachment(caPtr + 48 * i));
        }
        return attachments;
      }
  
      function makeDepthStencilAttachment(dsaPtr) {
        if (dsaPtr === 0) return undefined;
  
        return {
          "view": WebGPU.mgrTextureView.get(
            HEAPU32[((dsaPtr)>>2)]),
          "depthClearValue": HEAPF32[(((dsaPtr)+(12))>>2)],
          "depthLoadOp": WebGPU.LoadOp[
            HEAPU32[(((dsaPtr)+(4))>>2)]],
          "depthStoreOp": WebGPU.StoreOp[
            HEAPU32[(((dsaPtr)+(8))>>2)]],
          "depthReadOnly": (HEAP8[(((dsaPtr)+(16))>>0)] !== 0),
          "stencilClearValue": HEAPU32[(((dsaPtr)+(28))>>2)],
          "stencilLoadOp": WebGPU.LoadOp[
            HEAPU32[(((dsaPtr)+(20))>>2)]],
          "stencilStoreOp": WebGPU.StoreOp[
            HEAPU32[(((dsaPtr)+(24))>>2)]],
          "stencilReadOnly": (HEAP8[(((dsaPtr)+(32))>>0)] !== 0),
        };
      }
  
      function makeRenderPassTimestampWrite(twPtr) {
        return {
          "querySet": WebGPU.mgrQuerySet.get(
            HEAPU32[((twPtr)>>2)]),
          "queryIndex": HEAPU32[(((twPtr)+(4))>>2)],
          "location": WebGPU.RenderPassTimestampLocation[
            HEAPU32[(((twPtr)+(8))>>2)]],
        };
      }
  
      function makeRenderPassTimestampWrites(count, twPtr) {
        var timestampWrites = [];
        for (var i = 0; i < count; ++i) {
          timestampWrites.push(makeRenderPassTimestampWrite(twPtr + 12 * i));
        }
        return timestampWrites;
      }
  
      function makeRenderPassDescriptor(descriptor) {
        
        var nextInChainPtr = HEAPU32[((descriptor)>>2)];
        
        var maxDrawCount = undefined;
        if (nextInChainPtr !== 0) {
          var sType = HEAPU32[(((nextInChainPtr)+(4))>>2)];
          var renderPassDescriptorMaxDrawCount = nextInChainPtr;
          
          maxDrawCount = HEAPU32[((((renderPassDescriptorMaxDrawCount + 4))+(8))>>2)] * 0x100000000 + HEAPU32[(((renderPassDescriptorMaxDrawCount)+(8))>>2)];
        }
  
        var desc = {
          "label": undefined,
          "colorAttachments": makeColorAttachments(
            HEAPU32[(((descriptor)+(8))>>2)],
            HEAPU32[(((descriptor)+(12))>>2)]),
          "depthStencilAttachment": makeDepthStencilAttachment(
            HEAPU32[(((descriptor)+(16))>>2)]),
          "occlusionQuerySet": WebGPU.mgrQuerySet.get(
            HEAPU32[(((descriptor)+(20))>>2)]),
          "maxDrawCount": maxDrawCount,
        };
        var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
        if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
  
        var timestampWriteCount = HEAPU32[(((descriptor)+(24))>>2)];
        if (timestampWriteCount) {
          desc["timestampWrites"] = makeRenderPassTimestampWrites(
            timestampWriteCount,
            HEAPU32[(((descriptor)+(28))>>2)]);
        }
  
        return desc;
      }
  
      var desc = makeRenderPassDescriptor(descriptor);
  
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      return WebGPU.mgrRenderPassEncoder.create(commandEncoder["beginRenderPass"](desc));
    }

  function _wgpuCommandEncoderFinish(encoderId) {
      var commandEncoder = WebGPU.mgrCommandEncoder.get(encoderId);
      return WebGPU.mgrCommandBuffer.create(commandEncoder["finish"]());
    }

  function _wgpuCommandEncoderRelease(id) {
    WebGPU.mgrCommandEncoder.release(id);
  }

  function _wgpuCreateInstance() {
    }

  function _wgpuDeviceCreateBindGroup(deviceId, descriptor) {
      
  
      function makeEntry(entryPtr) {
        
  
        var bufferId = HEAPU32[(((entryPtr)+(8))>>2)];
        var samplerId = HEAPU32[(((entryPtr)+(32))>>2)];
        var textureViewId = HEAPU32[(((entryPtr)+(36))>>2)];
  
        var binding = HEAPU32[(((entryPtr)+(4))>>2)];
  
        if (bufferId) {
          var size_low = HEAPU32[(((entryPtr)+(24))>>2)];
          var size_high = HEAPU32[(((entryPtr)+(28))>>2)];
          var size = ((size_high === -1 && size_low === -1) ? undefined :           (size_high * 0x100000000 + size_low)
  );
  
          return {
            "binding": binding,
            "resource": {
              "buffer": WebGPU.mgrBuffer.get(bufferId),
              "offset": HEAPU32[((((entryPtr + 4))+(16))>>2)] * 0x100000000 + HEAPU32[(((entryPtr)+(16))>>2)],
              "size": size,
            },
          };
        } else if (samplerId) {
          return {
            "binding": binding,
            "resource": WebGPU.mgrSampler.get(samplerId),
          };
        } else {
          return {
            "binding": binding,
            "resource": WebGPU.mgrTextureView.get(textureViewId),
          };
        }
      }
  
      function makeEntries(count, entriesPtrs) {
        var entries = [];
        for (var i = 0; i < count; ++i) {
          entries.push(makeEntry(entriesPtrs +
              40 * i));
        }
        return entries;
      }
  
      var desc = {
        "label": undefined,
        "layout": WebGPU.mgrBindGroupLayout.get(
          HEAPU32[(((descriptor)+(8))>>2)]),
        "entries": makeEntries(
          HEAPU32[(((descriptor)+(12))>>2)],
          HEAPU32[(((descriptor)+(16))>>2)]
        ),
      };
      var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
      if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrBindGroup.create(device["createBindGroup"](desc));
    }

  function _wgpuDeviceCreateBindGroupLayout(deviceId, descriptor) {
      
  
      function makeBufferEntry(entryPtr) {
        
  
        var typeInt =
          HEAPU32[(((entryPtr)+(4))>>2)];
        if (!typeInt) return undefined;
  
        return {
          "type": WebGPU.BufferBindingType[typeInt],
          "hasDynamicOffset":
            (HEAP8[(((entryPtr)+(8))>>0)] !== 0),
          "minBindingSize":
            HEAPU32[((((entryPtr + 4))+(16))>>2)] * 0x100000000 + HEAPU32[(((entryPtr)+(16))>>2)],
        };
      }
  
      function makeSamplerEntry(entryPtr) {
        
  
        var typeInt =
          HEAPU32[(((entryPtr)+(4))>>2)];
        if (!typeInt) return undefined;
  
        return {
          "type": WebGPU.SamplerBindingType[typeInt],
        };
      }
  
      function makeTextureEntry(entryPtr) {
        
  
        var sampleTypeInt =
          HEAPU32[(((entryPtr)+(4))>>2)];
        if (!sampleTypeInt) return undefined;
  
        return {
          "sampleType": WebGPU.TextureSampleType[sampleTypeInt],
          "viewDimension": WebGPU.TextureViewDimension[
            HEAPU32[(((entryPtr)+(8))>>2)]],
          "multisampled":
            (HEAP8[(((entryPtr)+(12))>>0)] !== 0),
        };
      }
  
      function makeStorageTextureEntry(entryPtr) {
        
  
        var accessInt =
          HEAPU32[(((entryPtr)+(4))>>2)]
        if (!accessInt) return undefined;
  
        return {
          "access": WebGPU.StorageTextureAccess[accessInt],
          "format": WebGPU.TextureFormat[
            HEAPU32[(((entryPtr)+(8))>>2)]],
          "viewDimension": WebGPU.TextureViewDimension[
            HEAPU32[(((entryPtr)+(12))>>2)]],
        };
      }
  
      function makeEntry(entryPtr) {
        
  
        return {
          "binding":
            HEAPU32[(((entryPtr)+(4))>>2)],
          "visibility":
            HEAPU32[(((entryPtr)+(8))>>2)],
          "buffer": makeBufferEntry(entryPtr + 16),
          "sampler": makeSamplerEntry(entryPtr + 40),
          "texture": makeTextureEntry(entryPtr + 48),
          "storageTexture": makeStorageTextureEntry(entryPtr + 64),
        };
      }
  
      function makeEntries(count, entriesPtrs) {
        var entries = [];
        for (var i = 0; i < count; ++i) {
          entries.push(makeEntry(entriesPtrs +
              80 * i));
        }
        return entries;
      }
  
      var desc = {
        "entries": makeEntries(
          HEAPU32[(((descriptor)+(8))>>2)],
          HEAPU32[(((descriptor)+(12))>>2)]
        ),
      };
      var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
      if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrBindGroupLayout.create(device["createBindGroupLayout"](desc));
    }

  function _wgpuDeviceCreateBuffer(deviceId, descriptor) {
      
  
      var mappedAtCreation = (HEAP8[(((descriptor)+(24))>>0)] !== 0);
  
      var desc = {
        "label": undefined,
        "usage": HEAPU32[(((descriptor)+(8))>>2)],
        "size": HEAPU32[((((descriptor + 4))+(16))>>2)] * 0x100000000 + HEAPU32[(((descriptor)+(16))>>2)],
        "mappedAtCreation": mappedAtCreation,
      };
      var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
      if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
  
      var device = WebGPU.mgrDevice.get(deviceId);
      var bufferWrapper = {};
      var id = WebGPU.mgrBuffer.create(device["createBuffer"](desc), bufferWrapper);
      if (mappedAtCreation) {
        bufferWrapper.mapMode = 2;
        bufferWrapper.onUnmap = [];
      }
      return id;
    }

  function _wgpuDeviceCreateCommandEncoder(deviceId, descriptor) {
      var desc;
      if (descriptor) {
        
        desc = {
          "label": undefined,
        };
        var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
        if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
      }
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrCommandEncoder.create(device["createCommandEncoder"](desc));
    }

  function _wgpuDeviceCreatePipelineLayout(deviceId, descriptor) {
      
      var bglCount = HEAPU32[(((descriptor)+(8))>>2)];
      var bglPtr = HEAPU32[(((descriptor)+(12))>>2)];
      var bgls = [];
      for (var i = 0; i < bglCount; ++i) {
        bgls.push(WebGPU.mgrBindGroupLayout.get(
          HEAPU32[(((bglPtr)+(4 * i))>>2)]));
      }
      var desc = {
        "label": undefined,
        "bindGroupLayouts": bgls,
      };
      var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
      if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrPipelineLayout.create(device["createPipelineLayout"](desc));
    }

  function _wgpuDeviceCreateRenderPipeline(deviceId, descriptor) {
      
  
      function makePrimitiveState(rsPtr) {
        if (!rsPtr) return undefined;
        
        return {
          "topology": WebGPU.PrimitiveTopology[
            HEAPU32[(((rsPtr)+(4))>>2)]],
          "stripIndexFormat": WebGPU.IndexFormat[
            HEAPU32[(((rsPtr)+(8))>>2)]],
          "frontFace": WebGPU.FrontFace[
            HEAPU32[(((rsPtr)+(12))>>2)]],
          "cullMode": WebGPU.CullMode[
            HEAPU32[(((rsPtr)+(16))>>2)]],
        };
      }
  
      function makeBlendComponent(bdPtr) {
        if (!bdPtr) return undefined;
        return {
          "operation": WebGPU.BlendOperation[
            HEAPU32[((bdPtr)>>2)]],
          "srcFactor": WebGPU.BlendFactor[
            HEAPU32[(((bdPtr)+(4))>>2)]],
          "dstFactor": WebGPU.BlendFactor[
            HEAPU32[(((bdPtr)+(8))>>2)]],
        };
      }
  
      function makeBlendState(bsPtr) {
        if (!bsPtr) return undefined;
        
        return {
          "alpha": makeBlendComponent(bsPtr + 12),
          "color": makeBlendComponent(bsPtr + 0),
        };
      }
  
      function makeColorState(csPtr) {
        
        var formatInt = HEAPU32[(((csPtr)+(4))>>2)];
        return formatInt === 0 ? undefined : {
          "format": WebGPU.TextureFormat[formatInt],
          "blend": makeBlendState(HEAPU32[(((csPtr)+(8))>>2)]),
          "writeMask": HEAPU32[(((csPtr)+(12))>>2)],
        };
      }
  
      function makeColorStates(count, csArrayPtr) {
        var states = [];
        for (var i = 0; i < count; ++i) {
          states.push(makeColorState(csArrayPtr + 16 * i));
        }
        return states;
      }
  
      function makeStencilStateFace(ssfPtr) {
        
        return {
          "compare": WebGPU.CompareFunction[
            HEAPU32[((ssfPtr)>>2)]],
          "failOp": WebGPU.StencilOperation[
            HEAPU32[(((ssfPtr)+(4))>>2)]],
          "depthFailOp": WebGPU.StencilOperation[
            HEAPU32[(((ssfPtr)+(8))>>2)]],
          "passOp": WebGPU.StencilOperation[
            HEAPU32[(((ssfPtr)+(12))>>2)]],
        };
      }
  
      function makeDepthStencilState(dssPtr) {
        if (!dssPtr) return undefined;
  
        
        return {
          "format": WebGPU.TextureFormat[
            HEAPU32[(((dssPtr)+(4))>>2)]],
          "depthWriteEnabled": (HEAP8[(((dssPtr)+(8))>>0)] !== 0),
          "depthCompare": WebGPU.CompareFunction[
            HEAPU32[(((dssPtr)+(12))>>2)]],
          "stencilFront": makeStencilStateFace(dssPtr + 16),
          "stencilBack": makeStencilStateFace(dssPtr + 32),
          "stencilReadMask": HEAPU32[(((dssPtr)+(48))>>2)],
          "stencilWriteMask": HEAPU32[(((dssPtr)+(52))>>2)],
          "depthBias": HEAPU32[(((dssPtr)+(56))>>2)],
          "depthBiasSlopeScale": HEAPF32[(((dssPtr)+(60))>>2)],
          "depthBiasClamp": HEAPF32[(((dssPtr)+(64))>>2)],
        };
      }
  
      function makeVertexAttribute(vaPtr) {
        
        return {
          "format": WebGPU.VertexFormat[
            HEAPU32[((vaPtr)>>2)]],
          "offset": HEAPU32[((((vaPtr + 4))+(8))>>2)] * 0x100000000 + HEAPU32[(((vaPtr)+(8))>>2)],
          "shaderLocation": HEAPU32[(((vaPtr)+(16))>>2)],
        };
      }
  
      function makeVertexAttributes(count, vaArrayPtr) {
        var vas = [];
        for (var i = 0; i < count; ++i) {
          vas.push(makeVertexAttribute(vaArrayPtr + i * 24));
        }
        return vas;
      }
  
      function makeVertexBuffer(vbPtr) {
        if (!vbPtr) return undefined;
        var stepModeInt = HEAPU32[(((vbPtr)+(8))>>2)];
        return stepModeInt === 2 ? null : {
          "arrayStride": HEAPU32[(((vbPtr + 4))>>2)] * 0x100000000 + HEAPU32[((vbPtr)>>2)],
          "stepMode": WebGPU.VertexStepMode[stepModeInt],
          "attributes": makeVertexAttributes(
            HEAPU32[(((vbPtr)+(12))>>2)],
            HEAPU32[(((vbPtr)+(16))>>2)]),
        };
      }
  
      function makeVertexBuffers(count, vbArrayPtr) {
        if (!count) return undefined;
  
        var vbs = [];
        for (var i = 0; i < count; ++i) {
          vbs.push(makeVertexBuffer(vbArrayPtr + i * 24));
        }
        return vbs;
      }
  
      function makeVertexState(viPtr) {
        if (!viPtr) return undefined;
        
        return {
          "module": WebGPU.mgrShaderModule.get(
            HEAPU32[(((viPtr)+(4))>>2)]),
          "entryPoint": UTF8ToString(
            HEAPU32[(((viPtr)+(8))>>2)]),
          "constants": WebGPU.makePipelineConstants(
            HEAPU32[(((viPtr)+(12))>>2)],
            HEAPU32[(((viPtr)+(16))>>2)]),
          "buffers": makeVertexBuffers(
            HEAPU32[(((viPtr)+(20))>>2)],
            HEAPU32[(((viPtr)+(24))>>2)]),
        };
      }
  
      function makeMultisampleState(msPtr) {
        if (!msPtr) return undefined;
        
        return {
          "count": HEAPU32[(((msPtr)+(4))>>2)],
          "mask": HEAPU32[(((msPtr)+(8))>>2)],
          "alphaToCoverageEnabled": (HEAP8[(((msPtr)+(12))>>0)] !== 0),
        };
      }
  
      function makeFragmentState(fsPtr) {
        if (!fsPtr) return undefined;
        
        return {
          "module": WebGPU.mgrShaderModule.get(
            HEAPU32[(((fsPtr)+(4))>>2)]),
          "entryPoint": UTF8ToString(
            HEAPU32[(((fsPtr)+(8))>>2)]),
          "constants": WebGPU.makePipelineConstants(
            HEAPU32[(((fsPtr)+(12))>>2)],
            HEAPU32[(((fsPtr)+(16))>>2)]),
          "targets": makeColorStates(
            HEAPU32[(((fsPtr)+(20))>>2)],
            HEAPU32[(((fsPtr)+(24))>>2)]),
        };
      }
  
      var desc = {
        "label": undefined,
        "layout": WebGPU.mgrPipelineLayout.get(
          HEAPU32[(((descriptor)+(8))>>2)]),
        "vertex": makeVertexState(
          descriptor + 12),
        "primitive": makePrimitiveState(
          descriptor + 40),
        "depthStencil": makeDepthStencilState(
          HEAPU32[(((descriptor)+(60))>>2)]),
        "multisample": makeMultisampleState(
          descriptor + 64),
        "fragment": makeFragmentState(
          HEAPU32[(((descriptor)+(80))>>2)]),
      };
      var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
      if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrRenderPipeline.create(device["createRenderPipeline"](desc));
    }

  function _wgpuDeviceCreateShaderModule(deviceId, descriptor) {
      
      var nextInChainPtr = HEAPU32[((descriptor)>>2)];
      var sType = HEAPU32[(((nextInChainPtr)+(4))>>2)];
  
      var desc = {
        "label": undefined,
        "code": "",
      };
      var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
      if (labelPtr) desc["label"] = UTF8ToString(labelPtr);
  
      switch (sType) {
        case 5: {
          var count = HEAPU32[(((nextInChainPtr)+(8))>>2)];
          var start = HEAPU32[(((nextInChainPtr)+(12))>>2)];
          desc["code"] = HEAPU32.subarray(start >> 2, (start >> 2) + count);
          break;
        }
        case 6: {
          var sourcePtr = HEAPU32[(((nextInChainPtr)+(8))>>2)];
          if (sourcePtr) {
            desc["code"] = UTF8ToString(sourcePtr);
          }
          break;
        }
      }
  
      var device = WebGPU.mgrDevice.get(deviceId);
      return WebGPU.mgrShaderModule.create(device["createShaderModule"](desc));
    }

  function _wgpuDeviceCreateSwapChain(deviceId, surfaceId, descriptor) {
      
      var device = WebGPU.mgrDevice.get(deviceId);
      var context = WebGPU.mgrSurface.get(surfaceId);
  
      var canvasSize = [
          HEAPU32[(((descriptor)+(16))>>2)],
          HEAPU32[(((descriptor)+(20))>>2)]
      ];
  
      if (canvasSize[0] !== 0) {
          context["canvas"]["width"] = canvasSize[0];
      }
  
      if (canvasSize[1] !== 0) {
          context["canvas"]["height"] = canvasSize[1];
      }
  
      var configuration = {
        "device": device,
        "format": WebGPU.TextureFormat[
          HEAPU32[(((descriptor)+(12))>>2)]],
        "usage": HEAPU32[(((descriptor)+(8))>>2)],
        "alphaMode": "opaque",
      };
      context["configure"](configuration);
  
      return WebGPU.mgrSwapChain.create(context);
    }

  function _wgpuDeviceGetQueue(deviceId) {
      var queueId = WebGPU.mgrDevice.objects[deviceId].queueId;
      // Returns a new reference to the existing queue.
      WebGPU.mgrQueue.reference(queueId);
      return queueId;
    }

  function maybeCStringToJsString(cString) {
      // "cString > 2" checks if the input is a number, and isn't of the special
      // values we accept here, EMSCRIPTEN_EVENT_TARGET_* (which map to 0, 1, 2).
      // In other words, if cString > 2 then it's a pointer to a valid place in
      // memory, and points to a C string.
      return cString > 2 ? UTF8ToString(cString) : cString;
    }
  
  var specialHTMLTargets = [0, document, window];
  function findEventTarget(target) {
      target = maybeCStringToJsString(target);
      var domElement = specialHTMLTargets[target] || document.querySelector(target);
      return domElement;
    }
  function findCanvasEventTarget(target) { return findEventTarget(target); }
  function _wgpuInstanceCreateSurface(instanceId, descriptor) {
      
      
      var nextInChainPtr = HEAPU32[((descriptor)>>2)];
      var descriptorFromCanvasHTMLSelector = nextInChainPtr;
  
      
      var selectorPtr = HEAPU32[(((descriptorFromCanvasHTMLSelector)+(8))>>2)];
      
      var canvas = findCanvasEventTarget(selectorPtr);
      var context = canvas.getContext('webgpu');
      if (!context) return 0;
  
      var labelPtr = HEAPU32[(((descriptor)+(4))>>2)];
      if (labelPtr) context.surfaceLabelWebGPU = UTF8ToString(labelPtr);
  
      return WebGPU.mgrSurface.create(context);
    }

  function _wgpuPipelineLayoutRelease(id) {
    WebGPU.mgrPipelineLayout.release(id);
  }

  function _wgpuQueueSubmit(queueId, commandCount, commands) {
      var queue = WebGPU.mgrQueue.get(queueId);
      var cmds = Array.from(HEAP32.subarray(commands >> 2, (commands >> 2) + commandCount),
        function(id) { return WebGPU.mgrCommandBuffer.get(id); });
      queue["submit"](cmds);
    }

  function _wgpuQueueWriteBuffer(queueId,
        bufferId, bufferOffset_low, bufferOffset_high, data, size) {
      
  
      var queue = WebGPU.mgrQueue.get(queueId);
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      var bufferOffset = (bufferOffset_high * 0x100000000 + bufferOffset_low)
  ;
      // There is a size limitation for ArrayBufferView. Work around by passing in a subarray
      // instead of the whole heap. crbug.com/1201109
      var subarray = HEAPU8.subarray(data, data + size);
      queue["writeBuffer"](buffer, bufferOffset, subarray, 0, size);
    }

  function _wgpuRenderPassEncoderDrawIndexed(passId, indexCount, instanceCount, firstIndex, baseVertex, firstInstance) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass["drawIndexed"](indexCount, instanceCount, firstIndex, baseVertex, firstInstance);
    }

  function _wgpuRenderPassEncoderEnd(passId) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      pass["end"]();
    }

  function _wgpuRenderPassEncoderRelease(id) {
    WebGPU.mgrRenderPassEncoder.release(id);
  }

  function _wgpuRenderPassEncoderSetBindGroup(passId, groupIndex, groupId, dynamicOffsetCount, dynamicOffsetsPtr) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var group = WebGPU.mgrBindGroup.get(groupId);
      if (dynamicOffsetCount == 0) {
        pass["setBindGroup"](groupIndex, group);
      } else {
        var offsets = [];
        for (var i = 0; i < dynamicOffsetCount; i++, dynamicOffsetsPtr += 4) {
          offsets.push(HEAPU32[((dynamicOffsetsPtr)>>2)]);
        }
        pass["setBindGroup"](groupIndex, group, offsets);
      }
    }

  function _wgpuRenderPassEncoderSetIndexBuffer(passId, bufferId, format, offset_low, offset_high, size_low, size_high) {
      
      
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      var offset = (offset_high * 0x100000000 + offset_low)
  ;
      var size = ((size_high === -1 && size_low === -1) ? undefined :           (size_high * 0x100000000 + size_low)
  );
      pass["setIndexBuffer"](buffer, WebGPU.IndexFormat[format], offset, size);
    }

  function _wgpuRenderPassEncoderSetPipeline(passId, pipelineId) {
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var pipeline = WebGPU.mgrRenderPipeline.get(pipelineId);
      pass["setPipeline"](pipeline);
    }

  function _wgpuRenderPassEncoderSetVertexBuffer(passId, slot, bufferId, offset_low, offset_high, size_low, size_high) {
      
      
      var pass = WebGPU.mgrRenderPassEncoder.get(passId);
      var buffer = WebGPU.mgrBuffer.get(bufferId);
      var offset = (offset_high * 0x100000000 + offset_low)
  ;
      var size = ((size_high === -1 && size_low === -1) ? undefined :           (size_high * 0x100000000 + size_low)
  );
      pass["setVertexBuffer"](slot, buffer, offset, size);
    }

  function _wgpuShaderModuleRelease(id) {
    WebGPU.mgrShaderModule.release(id);
  }

  function _wgpuSwapChainGetCurrentTextureView(swapChainId) {
      var context = WebGPU.mgrSwapChain.get(swapChainId);
      return WebGPU.mgrTextureView.create(context["getCurrentTexture"]()["createView"]());
    }

  function _wgpuTextureViewRelease(id) {
    WebGPU.mgrTextureView.release(id);
  }

  function allocateUTF8OnStack(str) {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8Array(str, HEAP8, ret, size);
      return ret;
    }
WebGPU.initManagers();;
var asmLibraryArg = {
  "emscripten_request_animation_frame_loop": _emscripten_request_animation_frame_loop,
  "emscripten_resize_heap": _emscripten_resize_heap,
  "emscripten_webgpu_get_device": _emscripten_webgpu_get_device,
  "glue_preint": glue_preint,
  "wgpuBindGroupLayoutRelease": _wgpuBindGroupLayoutRelease,
  "wgpuCommandBufferRelease": _wgpuCommandBufferRelease,
  "wgpuCommandEncoderBeginRenderPass": _wgpuCommandEncoderBeginRenderPass,
  "wgpuCommandEncoderFinish": _wgpuCommandEncoderFinish,
  "wgpuCommandEncoderRelease": _wgpuCommandEncoderRelease,
  "wgpuCreateInstance": _wgpuCreateInstance,
  "wgpuDeviceCreateBindGroup": _wgpuDeviceCreateBindGroup,
  "wgpuDeviceCreateBindGroupLayout": _wgpuDeviceCreateBindGroupLayout,
  "wgpuDeviceCreateBuffer": _wgpuDeviceCreateBuffer,
  "wgpuDeviceCreateCommandEncoder": _wgpuDeviceCreateCommandEncoder,
  "wgpuDeviceCreatePipelineLayout": _wgpuDeviceCreatePipelineLayout,
  "wgpuDeviceCreateRenderPipeline": _wgpuDeviceCreateRenderPipeline,
  "wgpuDeviceCreateShaderModule": _wgpuDeviceCreateShaderModule,
  "wgpuDeviceCreateSwapChain": _wgpuDeviceCreateSwapChain,
  "wgpuDeviceGetQueue": _wgpuDeviceGetQueue,
  "wgpuInstanceCreateSurface": _wgpuInstanceCreateSurface,
  "wgpuPipelineLayoutRelease": _wgpuPipelineLayoutRelease,
  "wgpuQueueSubmit": _wgpuQueueSubmit,
  "wgpuQueueWriteBuffer": _wgpuQueueWriteBuffer,
  "wgpuRenderPassEncoderDrawIndexed": _wgpuRenderPassEncoderDrawIndexed,
  "wgpuRenderPassEncoderEnd": _wgpuRenderPassEncoderEnd,
  "wgpuRenderPassEncoderRelease": _wgpuRenderPassEncoderRelease,
  "wgpuRenderPassEncoderSetBindGroup": _wgpuRenderPassEncoderSetBindGroup,
  "wgpuRenderPassEncoderSetIndexBuffer": _wgpuRenderPassEncoderSetIndexBuffer,
  "wgpuRenderPassEncoderSetPipeline": _wgpuRenderPassEncoderSetPipeline,
  "wgpuRenderPassEncoderSetVertexBuffer": _wgpuRenderPassEncoderSetVertexBuffer,
  "wgpuShaderModuleRelease": _wgpuShaderModuleRelease,
  "wgpuSwapChainGetCurrentTextureView": _wgpuSwapChainGetCurrentTextureView,
  "wgpuTextureViewRelease": _wgpuTextureViewRelease
};
var ___start_em_js = 66472;
var ___stop_em_js = 66940;



// === Auto-generated postamble setup entry stuff ===



function run() {

  

  var ret = _main();

}

function initRuntime(asm) {

  asm['__wasm_call_ctors']();

  
}

// Initialize wasm (asynchronous)

var imports = {
  'env': asmLibraryArg
  , 'wasi_snapshot_preview1': asmLibraryArg
};

// In non-fastcomp non-asm.js builds, grab wasm exports to outer scope
// for emscripten_get_exported_function() to be able to access them.

var __glue_main_,
 _main,
 _malloc,
 _free,
 stackSave,
 stackRestore,
 stackAlloc;

WebAssembly.instantiate(Module['wasm'], imports).then(function(output) {

  // If not using the emscripten_get_exported_function() API or embind, keep the
  // 'asm' exports variable in local scope to this instantiate function to save
  // code size.  (otherwise access it without to export it to outer scope)
  var
  // WebAssembly instantiation API gotcha: if Module['wasm'] above was a typed
  // array, then the output object will have an output.instance and
  // output.module objects. But if Module['wasm'] is an already compiled
  // WebAssembly module, then output is the WebAssembly instance itself.
  // Depending on the build mode, Module['wasm'] can mean a different thing.
  asm = output.instance.exports;

  __glue_main_ = asm["_glue_main_"];
  _main = asm["__main_argc_argv"];
  _malloc = asm["malloc"];
  _free = asm["free"];
  stackSave = asm["stackSave"];
  stackRestore = asm["stackRestore"];
  stackAlloc = asm["stackAlloc"];

  wasmTable = asm['__indirect_function_table'];

  wasmMemory = asm['memory'];
  updateGlobalBufferAndViews(wasmMemory.buffer);

  initRuntime(asm);
  ready();
}

);






备忘录
=========

``vkGetPhysicalDeviceMemoryProperties``

* 必须有一个内存类型同时包含 HOST_VISIBLE 和 HOST_COHERENT
* 必须有一个内存类型包含 DEVICE_LOCAL

---

``VkMemoryHeapFlagBits`` 除了 ``Vulkan 1.0`` 的 ``DEVICE_LOCAL`` 外，还有一个 ``MULTI_INSTANCE`` ，表示：一个逻辑设备 ``VkDevice`` 代表多个物理设备，每一个物理设备的堆内存都会有一个这个 ``instance`` ，默认情况下，在这样的其中一个设备内存堆上分配，将会在每一个设备堆上都进行相同的操作。

---

memory_properties

    * VK_MEMORY_PROPERTY_HOST_CACHED_BIT 缓存是存在 ``host`` 端的，非缓存内存访问比缓存内存慢。缓存内存速度 > 费缓存。然而非缓存内存 ``总是`` ``host coherent`` （同步）的
    * VK_MEMORY_PROPERTY_LAZILY_BIT 表示只有 物理设备 可以访问该内存。拥有了该类型的内存 ``不可能`` 被 ``host`` 端访问了（HOST_VISIBLE、HOST_COHERENT 和 HOST_CACHED不可能出现了）。
    * VK_MEMORY_PROPERTY_PROTECTED_BIT 表示只有 物理设备 可以访问该内存，并且只有 保护队列 可操作该内存。拥有了该类型的内存 ``不可能`` 被 ``host`` 端访问了（HOST_VISIBLE、HOST_COHERENT 和 HOST_CACHED不可能出现了）。

---

BufferView

.. code:: c++

    // Provided by VK_VERSION_1_0
    typedef struct VkBufferViewCreateInfo {
        VkStructureType            sType;
        const void*                pNext;
        VkBufferViewCreateFlags    flags;
        VkBuffer                   buffer;
        VkFormat                   format;
        VkDeviceSize               offset;
        VkDeviceSize               range;
    } VkBufferViewCreateInfo;

``VkBuffer`` 必须创建于 ``VK_BUFFER_USAGE_UNIFORM_TEXEL_BUFFER_BIT`` 和 ``VK_BUFFER_USAGE_STORAGE_TEXEL_BUFFER_BIT`` 最少是这两个中的一个，要么就两个都是。

``buffer`` 包含 ``VK_BUFFER_USAGE_UNIFORM_TEXEL_BUFFER_BIT`` 创建的话， ``format`` 的 ``feature`` 必须包含 ``VK_FORMAT_FEATURE_UNIFORM_TEXEL_BUFFER_BIT`` ( ``vkGetPhysicalDeviceFormatProperties(...) VkFormatProperties::bufferFeatures`` )
``buffer`` 包含 ``VK_BUFFER_USAGE_STORAGE_TEXEL_BUFFER_BIT`` 创建的话， ``format`` 的 ``feature`` 必须包含 ``VK_FORMAT_FEATURE_STORAGE_TEXEL_BUFFER_BIT`` ( ``vkGetPhysicalDeviceFormatProperties(...) VkFormatProperties::bufferFeatures`` )

* 如果 ``buffer`` 不是 ``稀疏`` 资源的话，则他需要完全连续的绑定到一个单一的 ``VkDeviceMemory`` 对象上。
* 如果 ``texelBufferAlignment`` 特性没有激活的话， ``offset`` 必须是 ``VkPhysicalDeviceLimits::minTexelBufferOffsetAlignment`` 的倍数。
* 如果 ``texelBufferAlignment`` 特性激活，并且 ``buffer`` 中包含 ``VK_BUFFER_USAGE_STORAGE_TEXEL_BUFFER_BIT`` 的话， 
``offset`` 必须是 ``VkPhysicalDeviceLimits::storageTexelBufferOffsetAlignmentBytes`` 或 在 ``VkPhysicalDeviceTexelBufferAlignmentProperties::storageTexelBufferOffsetSingleTexelAlignment`` 为 ``VK_TRUE`` 的条件下，
格式要求的 ``texel`` 大小中的较小值。如果 ``texel`` 的大小是 ``3 byte`` 倍数，则使用格式中单组件（通道？）的大小？

* 如果 ``texelBufferAlignment`` 特性激活，并且 ``buffer`` 中包含 ``VK_BUFFER_USAGE_UNIFORM_TEXEL_BUFFER_BIT`` 的话， 
``offset`` 必须是 ``VkPhysicalDeviceLimits::uniformTexelBufferOffsetAlignmentBytes`` 或 在 ``VkPhysicalDeviceTexelBufferAlignmentProperties::uniformTexelBufferOffsetSingleTexelAlignment`` 为 ``VK_TRUE`` 的条件下，
格式要求的 ``texel`` 大小中的较小值。如果 ``texel`` 的大小是 ``3 byte`` 倍数，则使用格式中单组件（通道？）的大小？

BufferView 文档阅读完毕

.. code-block:: glsl

    // Texture Buffer(Uniform Texel Buffers)
    layout(set=m, binding=n) uniform textureBuffer myUniformTexelBuffer;

    // Texture Buffer(Storage Texel Buffers)
    layout(set=m, binding=n, r32f) uniform imageBuffer myStorageTexelBuffer;

---

VkImageCreateInfo::arrayLayers

``RTX 3070`` 显卡中 ``VkPhysicalDeviceLimits::maxImageArrayLayers`` 为 ``2048`` （标准要求最小为 ``256`` ，如果满足 ``Roadmap 2022`` 则最小为 ``2048``）

* ``arrayLayers`` 必须要大于 ``0`` （不能为 ``0`` ）
* ``arrayLayers`` 必须小于等于 ``imageCreateMaxArrayLayers``
* 如果 ``imageType`` 是 ``3D`` ， ``arrayLayers`` 必须是 ``1``

如果 ``tiling`` 是 ``LINEAR`` 的话，有如下要求：

* ``imageType`` 是 ``2D``
* ``format`` 不能是 ``depth/stencil`` 格式
* ``mipLevel`` 是 ``1``
* ``arrayLayers`` 是 ``1``
* ``samples`` 是 ``COUNT_1_BIT``
* ``usage`` 只能是 ``TRANSFER_SRC_BIT`` 和/或 ``TRANSFER_DST_BIT``

如果格式是 ``Y'CBCR`` ，有如下要求：

* ``imageType`` 是 ``2D``
* ``mipLevel`` 是 ``1``
* ``arrayLayers`` 是 ``1`` ，要么就是 ``VkImageFormatProperties::maxArrayLayers``
* ``samples`` 是 ``COUNT_1_BIT``

如果 ``flags`` 包含 ``VK_IMAGE_CREATE_SPLIT_INSTANCE_BIND_REGIONS_BIT`` ，有如下要求：

* ``mipLevels`` 必须是 ``1``
* ``arrayLayers`` 必须是 ``1``
* ``imageType`` 必须是 ``VK_IMAGE_TYPE_2D``
* ``imageCreateMaybeLinear`` 必须是 ``VK_FALSE``

---

VkPhysicalDeviceLiits::maxFramebufferWidth
VkPhysicalDeviceLiits::maxFramebufferHeight

---

# VkImageView

View 的 usage 是继承自 Image 的：

* 如果 View 设置了 ``VkImageViewUsageCreateInfo`` 的话（pNext），可以覆写该 View 的 usage ，但必须是 image 的 usage 的子集。
* 如果 image 是 depth-stencil 格式，并且使用 ``VkImageStencilUsageCreateInfo`` 创建的 image，View 的 usage 是依据 ``subresource.aspectMask`` 确定：
    * 如果 ``aspectMask`` 只包含 ``VK_IMAGE_ASPECT_STENCILE_BIT`` ，这意味着 usage 使用 ``VkImageStencilUsageCreateInfo::stencilUsage`` 的配置
    * 如果 ``aspectMask`` 只包含 ``VK_IMAGE_ASPECT_DEPTH_BIT`` ，这意味着 usage 使用 ``VkImageCreateInfo::usage`` 的配置
    * 如果 ``aspectMask`` 中上述两个都包含，这意味着 usage 使用 ``VkImageCreateInfo::usage`` 和 ``VkImageStencilUsageCreateInfo::stencilUsage`` 

如果 image 创建的时候指定了 ``VK_IMAGE_CREATE_MUTABLE_FORMAT_BIT`` ，并且 ``format`` 不是 ``multi-planar`` 的话， view 的 format 可以和 image 的 format 不同，
此外如果 image 没有使用 ``VK_IMAGE_CREATE_BLOCK_TEXEL_VIEW_COMPATIBLE_BIT`` 创建的话，view 的 format 可以和 image 的 format 不同，但需要 ``兼容`` 。

* ``VK_IMAGE_CREATE_BLOCK_TEXEL_VIEW_COMPATIBLE_BIT`` 表示 image 使用的压缩格式，并且该压缩格式可在 View 端进行解压缩

相互兼容格式的 View 将会在 纹素坐标-内存地址 之间具有相同的映射，这仅仅是二进制解释样式发生了改变。

如果 image 使用 ``VK_IMAGE_CREATE_BLOCK_TEXEL_VIEW_COMPATIBLE_BIT`` 创建的话， View 的 format 必须与 image 的 format 相兼容，要么 view 的 format 必须是压缩格式，且必须是 size-comatible （大小相兼容的）。在这种情况下，
获取到的 view 的 texel 维度 = 四舍五入((选择的 mip 等级 / 压缩的 texel 块大小))

## VkImageView ComponentMap

如果 view 用于 storage image/ input attachment / framebuffer attachment 和与 Y'CbCr 采样器相结合的 View，必须使用 一致性排列 （identify swizzle，也就是 ``VkComponentSwizzle::VK_COMPONENT_SWIZZLE_IDENTITY``）。
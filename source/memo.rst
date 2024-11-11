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
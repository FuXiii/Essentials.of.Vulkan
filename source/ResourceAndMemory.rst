资源与内存
================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档
   * 2024/5/11 更新该文档
   * 2024/5/13 更新该文档
   * 2024/5/13 增加 ``获取支持的设备内存`` 章节。
   * 2024/5/13 增加 ``vkGetBufferMemoryRequirements`` 章节。
   * 2024/5/13 增加 ``vkGetImageMemoryRequirements`` 章节。
   * 2024/5/13 增加 ``VkMemoryRequirements`` 章节。
   * 2024/5/17 更新 ``VkMemoryRequirements`` 章节。
   * 2024/5/18 更新 ``VkMemoryRequirements`` 章节。

在 `资源 <./Resource.html>`_ 章节中我们知道一个资源仅仅是一个 ``虚拟资源句柄`` ，其本质上并没有相应的内存实体用于存储数据。所以在创建完资源后，需要分配内存并与资源进行绑定，用于之后的数据读写。

根据不同资源的不同配置，相应支持资源的内存策略不尽相同，比如：

* 当创建图片指定 ``VkImageCreateInfo::tiling`` 为 ``VkImageTiling::VK_IMAGE_TILING_OPTIMAL`` 的话，一般期望是在 ``Device`` 端的本地内存 （ ``VkMemoryPropertyFlagBits::VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT`` ） 上进行内存分配并绑定。
* 当创建图片指定 ``VkImageCreateInfo::tiling`` 为 ``VkImageTiling::VK_IMAGE_TILING_LINEAR`` 的话，一般期望是在 ``Host`` 端的内存 （ ``VkMemoryPropertyFlagBits::VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT`` ） 上进行内存分配并绑定。

为了能够获取支持资源的内存信息， ``Vulkan`` 为我们提供了如下查询接口：

* :bdg-secondary:`vkGetBufferMemoryRequirements(...)` 获取支持该缓存资源的内存信息。
* :bdg-secondary:`vkGetImageMemoryRequirements(...)` 获取支持该图片资源的内存信息。

获取支持的设备内存
##################

其中 ``vkGetBufferMemoryRequirements(...)`` 和 ``vkGetImageMemoryRequirements(...)`` 定义如下：

vkGetBufferMemoryRequirements
*********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetBufferMemoryRequirements(
       VkDevice                                    device,
       VkBuffer                                    buffer,
       VkMemoryRequirements*                       pMemoryRequirements);

* :bdg-secondary:`device` 对应的逻辑设备。
* :bdg-secondary:`buffer` 目标缓存。
* :bdg-secondary:`pMemoryRequirements` 支持该缓存资源的内存信息。

vkGetImageMemoryRequirements
*********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetImageMemoryRequirements(
       VkDevice                                    device,
       VkImage                                     image,
       VkMemoryRequirements*                       pMemoryRequirements);

* :bdg-secondary:`device` 对应的逻辑设备。
* :bdg-secondary:`image` 目标图片。
* :bdg-secondary:`pMemoryRequirements` 支持该图片资源的内存信息。

无论是获取缓存支持的内存信息，还是图片的，其都会将资源支持的设备内存信息写入类型为 ``pMemoryRequirements`` 成员中，其类型为 ``VkMemoryRequirements`` ，定义如下：

VkMemoryRequirements
*********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkMemoryRequirements {
       VkDeviceSize    size;
       VkDeviceSize    alignment;
       uint32_t        memoryTypeBits;
   } VkMemoryRequirements;

* :bdg-secondary:`size` 资源需要分配的设备内存大小。单位为 ``字节`` 。
* :bdg-secondary:`alignment` 为该资源绑定的设备内存起始地址 :bdg-danger:`必须` 进行内存对齐位数。单位为 ``字节`` 。
* :bdg-secondary:`memoryTypeBits` 支持的设备内存索引位域。

其中 ``memoryTypeBits`` 成员变量是最重要的设备内存信息。该参数为一个 ``uint32_t`` 类型变量，也就是一个 ``32`` 位的整形。

在 `设备内存 <./Memory.html#id6>`_ 章节的 `VkPhysicalDeviceMemoryProperties </Memory.html#vkphysicaldevicememoryproperties>`_ 中给出了其定义，如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkPhysicalDeviceMemoryProperties {
       uint32_t        memoryTypeCount;
       VkMemoryType    memoryTypes[VK_MAX_MEMORY_TYPES];
       uint32_t        memoryHeapCount;
       VkMemoryHeap    memoryHeaps[VK_MAX_MEMORY_HEAPS];
   } VkPhysicalDeviceMemoryProperties;

再此之前反复强调过 ``VkPhysicalDeviceMemoryProperties::memoryTypes`` 数组索引值非常重要，是因为 ``VkMemoryRequirements::memoryTypeBits`` 与 ``VkPhysicalDeviceMemoryProperties::memoryTypes`` 有对应关系。其对应关系如下：

.. admonition:: 对应关系
   :class: important

   ``VkMemoryRequirements::memoryTypeBits`` 中的 ``32`` 个位，如果对应第 ``i`` 位为 ``1`` 说明 ``VkPhysicalDeviceMemoryProperties::memoryTypes[i]`` 对应的设备内存支持用于相应的资源。

   .. admonition:: VK_MAX_MEMORY_TYPES
      :class: note

      由于 ``VK_MAX_MEMORY_TYPES`` 为 ``32`` ，其定义如下：

      .. code:: c++

         #define VK_MAX_MEMORY_TYPES 32U

      所以一个 ``32`` 位的 ``VkMemoryRequirements::memoryTypeBits`` 完全可以覆盖到所有的 ``VkPhysicalDeviceMemoryProperties::memoryTypes`` 对应索引中。

..
   bool memory_type_from_properties(struct sample_info &info, uint32_t typeBits, VkFlags requirements_mask, uint32_t *typeIndex) 
   {
    // Search memtypes to find first index with those properties
    for (uint32_t i = 0; i < info.memory_properties.memoryTypeCount; i++) {
        if ((typeBits & 1) == 1) {
            // Type is available, does it match user properties?
            if ((info.memory_properties.memoryTypes[i].propertyFlags & requirements_mask) == requirements_mask) {
                *typeIndex = i;
                return true;
            }
        }
        typeBits >>= 1;
    }
    // No memory types matched, return failure
    return false;
   }

   pass = memory_type_from_properties(info, mem_reqs.memoryTypeBits,
                                      VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT | VK_MEMORY_PROPERTY_HOST_COHERENT_BIT,
                                      &alloc_info.memoryTypeIndex);

.. 
   memoryTypeBits
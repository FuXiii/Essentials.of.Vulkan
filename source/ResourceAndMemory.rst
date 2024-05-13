资源与内存
================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档
   * 2024/5/11 更新该文档
   * 2024/5/13 更新该文档
   * 2024/5/13 增加 ``获取支持的内存`` 章节。
   * 2024/5/13 增加 ``vkGetBufferMemoryRequirements`` 章节。
   * 2024/5/13 增加 ``vkGetImageMemoryRequirements`` 章节。

在 `资源 <./Resource.html>`_ 章节中我们知道一个资源仅仅是一个 ``虚拟资源句柄`` ，其本质上并没有相应的内存实体用于存储数据。所以在创建完资源后，需要分配内存并进行绑定，用于之后的数据读写。

根据不同资源的不同配置，相应支持资源的内存策略不尽相同，比如：

* 当创建图片指定 ``VkImageCreateInfo::tiling`` 为 ``VkImageTiling::VK_IMAGE_TILING_OPTIMAL`` 的话，一般期望是在 ``Device`` 端的本地内存 （ ``VkMemoryPropertyFlagBits::VK_MEMORY_PROPERTY_DEVICE_LOCAL_BIT`` ） 上进行内存分配并绑定。
* 当创建图片指定 ``VkImageCreateInfo::tiling`` 为 ``VkImageTiling::VK_IMAGE_TILING_LINEAR`` 的话，一般期望是在 ``Host`` 端的内存 （ ``VkMemoryPropertyFlagBits::VK_MEMORY_PROPERTY_HOST_VISIBLE_BIT`` ） 上进行内存分配并绑定。

为了能够获取资源支持的内存信息， ``Vulkan`` 为我们提供了如下查询接口：

* :bdg-secondary:`vkGetBufferMemoryRequirements(...)` 获取支持该缓存资源的内存信息。
* :bdg-secondary:`vkGetImageMemoryRequirements(...)` 获取支持该图片资源的内存信息。

获取支持的内存
##############

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

.. 
   memoryTypeBits
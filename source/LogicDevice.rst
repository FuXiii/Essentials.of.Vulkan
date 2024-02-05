逻辑设备
===========

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/2/5 更新该文档。
   * 2024/2/5 增加 ``创建逻辑设备`` 章节。
   * 2024/2/5 增加 ``vkCreateDevice`` 章节。
   * 2024/2/5 增加 ``VkDeviceCreateInfo`` 章节。

在 `物理设备 <./PhysicalDevice.html>`_ 章节中我们已经知道，可以获取系统中支持 ``Vulkan`` 的多个物理设备 ``VkPhysicalDevice`` 。我们需要确定使用哪一个或哪几个物理设备作为目标设备为我们所用，为此 ``Vulkan`` 将物理设备抽象成逻辑设备 ``VkDevice`` 。

当确定了逻辑设备之后，我们就可以在该设备上进行资源的创建，分配，操作，销毁和回收等各种各样的操作。

创建逻辑设备
#############

我们可以通过 ``vkCreateDevice(...)`` 函数创建逻辑设备。其定义如下：

vkCreateDevice
***************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkCreateDevice(
       VkPhysicalDevice                            physicalDevice,
       const VkDeviceCreateInfo*                   pCreateInfo,
       const VkAllocationCallbacks*                pAllocator,
       VkDevice*                                   pDevice);

* :bdg-secondary:`physicalDevice` 指定在哪一个物理设备上创建逻辑设备。
* :bdg-secondary:`pCreateInfo` 创建逻辑设备的配置信息。
* :bdg-secondary:`pAllocator` 内存分配器。为 ``nullptr`` 表示使用内部默认分配器，否则为自定义分配器。
* :bdg-secondary:`pDevice` 创建逻辑设备的结果。

其中 ``VkDeviceCreateInfo`` 定义如下：

VkDeviceCreateInfo
***************************

.. code:: c++

   // Provided by VK_VERSION_1_0
   typedef struct VkDeviceCreateInfo {
       VkStructureType                    sType;
       const void*                        pNext;
       VkDeviceCreateFlags                flags;
       uint32_t                           queueCreateInfoCount;
       const VkDeviceQueueCreateInfo*     pQueueCreateInfos;
       uint32_t                           enabledLayerCount;
       const char* const*                 ppEnabledLayerNames;
       uint32_t                           enabledExtensionCount;
       const char* const*                 ppEnabledExtensionNames;
       const VkPhysicalDeviceFeatures*    pEnabledFeatures;
   } VkDeviceCreateInfo;

* :bdg-secondary:`sType` 是该结构体的类型枚举值， :bdg-danger:`必须` 是 ``VkStructureType::VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`flags` 目前没用上，为将来做准备。
* :bdg-secondary:`queueCreateInfoCount` 指定 ``pQueueCreateInfos`` 数组元素个数。
* :bdg-secondary:`pQueueCreateInfos` 指定 ``VkDeviceQueueCreateInfo`` 数组。用于配置要创建的设备队列信息。
* :bdg-secondary:`enabledLayerCount` 指定 ``ppEnabledLayerNames`` 数组元素个数。该成员已被 :bdg-danger:`遗弃` 并 :bdg-danger:`忽略` 。
* :bdg-secondary:`ppEnabledLayerNames` 指定要开启的验证层。该成员已被 :bdg-danger:`遗弃` 并 :bdg-danger:`忽略` 。
* :bdg-secondary:`enabledExtensionCount` 指定 ``ppEnabledExtensionNames`` 数组中元素个数。
* :bdg-secondary:`ppEnabledExtensionNames` 指定要开启的扩展。该数组数量必须大于等于 ``enabledExtensionCount`` 。
* :bdg-secondary:`pEnabledFeatures` 配置要开启的特性。



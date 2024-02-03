设备队列
============

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/2/3 更新该文档。
   * 2024/2/3 增加 ``vkGetPhysicalDeviceQueueFamilyProperties`` 章节。
   * 2024/2/3 增加 ``VkQueueFamilyProperties`` 章节。

在 ``Vulkan`` 标准中，物理设备在其内部为我们开放了一系列的 ``工作队列`` （设备队列），不同系列的工作队列会接收并执行不同的指令，并且会根据这些 ``工作队列`` 的特长（功能）进行分组（族）。可分为以下 ``5`` 种：

* :bdg-secondary:`图形` 主要用于图形渲染，执行各种渲染绘制指令。
* :bdg-secondary:`计算` 主要用于执行并行计算（计算着色器），执行各种计算指令。
* :bdg-secondary:`转移` 主要用于执行资源的布局转移并支持在不同队列中进行转移，执行各种转移指令。
* :bdg-secondary:`稀疏绑定` 主要用于稀疏内存的管理。
* :bdg-secondary:`受保护` 主要用于受保护的内存的管理。

.. admonition:: 重要
   :class: important

   一般 :bdg-danger:`率先` 需要 ``图形`` 功能的队列。有如下几点原因：

   * 需要使用该队列进行图形渲染
   * 如果队列支持 ``图形`` 功能，则该队列默认也支持 ``计算`` 和 ``转移`` 功能。

我们可以通过 ``vkGetPhysicalDeviceQueueFamilyProperties(...)`` 函数获取设备队列（族）信息，其定义如下：

vkGetPhysicalDeviceQueueFamilyProperties
##############################################

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetPhysicalDeviceQueueFamilyProperties(
       VkPhysicalDevice                            physicalDevice,
       uint32_t*                                   pQueueFamilyPropertyCount,
       VkQueueFamilyProperties*                    pQueueFamilyProperties);

* :bdg-secondary:`physicalDevice` 物理设备。
* :bdg-secondary:`pQueueFamilyPropertyCount` 表示 ``pQueueFamilyProperties`` 中的元素个数。
* :bdg-secondary:`pQueueFamilyProperties` 如果为 ``nunllptr`` ，将会向 ``pQueueFamilyPropertyCount`` 中写入 ``physicalDevice`` 中对外开放的设备队列数量。否则将会写入 ``pQueueFamilyPropertyCount`` 个设备队列族信息数据。

为了获取设备队列信息，我们需要调用两次该函数，这与之前其他获取信息函数类似，不在过多赘述。

.. code:: c++

   VkPhysicalDevice physical_device = 之前获取的物理设备;

   uint32_t queue_family_property_count = 0;
   vkGetPhysicalDeviceQueueFamilyProperties(physical_device, &queue_family_property_count, nullptr);

   std::vector<VkQueueFamilyProperties> queue_family_properties(queue_family_property_count);
   vkGetPhysicalDeviceQueueFamilyProperties(physical_device, &queue_family_property_count, queue_family_properties.data());

该函数将物理设备的一系列设备队列（族）信息写入了 ``VkQueueFamilyProperties`` 类型数组当中，该类型定义如下：

VkQueueFamilyProperties
##############################################

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkQueueFamilyProperties {
       VkQueueFlags    queueFlags;
       uint32_t        queueCount;
       uint32_t        timestampValidBits;
       VkExtent3D      minImageTransferGranularity;
   } VkQueueFamilyProperties;

* :bdg-secondary:`queueFlags` 。
* :bdg-secondary:`queueCount` 。
* :bdg-secondary:`timestampValidBits` 。
* :bdg-secondary:`minImageTransferGranularity` 。

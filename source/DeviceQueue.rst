设备队列
============

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/2/3 更新该文档。
   * 2024/2/3 增加 ``vkGetPhysicalDeviceQueueFamilyProperties`` 章节。
   * 2024/2/3 增加 ``VkQueueFamilyProperties`` 章节。
   * 2024/2/4 更新 ``VkQueueFamilyProperties`` 章节。

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

* :bdg-secondary:`queueFlags` 为队列族位域，用于描述该队列族支持的功能。
* :bdg-secondary:`queueCount` 该队列族中的队列数量。最起码有 ``1`` 个， :bdg-danger:`不会` 返回 ``0`` 。
* :bdg-secondary:`timestampValidBits` 时间戳中有效的位数，有效的位数范围为 ``36`` 到 ``64`` 位，如果为 ``0`` 说明不支持时间戳。超出有效范围的位保证为 ``0`` 。
* :bdg-secondary:`minImageTransferGranularity` 在该族队列上进行图片转移操作时支持的最小转移粒度（大小）。

``Vulkan`` 将设备队列按照队列族的方式组织，组织方式有如下特点：

* 一个队列族可以支持一到多个功能。
* 一个队列族中包含一个或多个队列。
* 同一个队列族中的所有队列支持相同的功能。
* 队列族之间可以有相同的功能，但队列族之间两两不能有完全相同的功能集。

其中 ``VkQueueFlags`` 可用的值定义在 ``VkQueueFlagBits`` 中，其定义如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef enum VkQueueFlagBits {
       VK_QUEUE_GRAPHICS_BIT = 0x00000001,
       VK_QUEUE_COMPUTE_BIT = 0x00000002,
       VK_QUEUE_TRANSFER_BIT = 0x00000004,
       VK_QUEUE_SPARSE_BINDING_BIT = 0x00000008,
     // 由 VK_VERSION_1_1 提供
       VK_QUEUE_PROTECTED_BIT = 0x00000010,
   } VkQueueFlagBits;

* :bdg-secondary:`VK_QUEUE_GRAPHICS_BIT` 支持 ``图形`` 功能。
* :bdg-secondary:`VK_QUEUE_COMPUTE_BIT` 支持 ``计算`` 功能。
* :bdg-secondary:`VK_QUEUE_TRANSFER_BIT` 支持 ``转移`` 功能。
* :bdg-secondary:`VK_QUEUE_SPARSE_BINDING_BIT` 支持 ``稀疏绑定`` 功能。
* :bdg-secondary:`VK_QUEUE_PROTECTED_BIT` 支持 ``受保护`` 功能。

示例
###############

.. code:: c++

   VkPhysicalDevice physical_device = 之前获取到的物理设备句柄;

   uint32_t queue_family_count = 0;
   vkGetPhysicalDeviceQueueFamilyProperties(physical_device, &queue_family_count, nullptr);

   std::vector<VkQueueFamilyProperties> queue_familys(queue_family_count);
   vkGetPhysicalDeviceQueueFamilyProperties(physical_device, &queue_family_count, queue_familys.data());

   uint32_t uint32_max = std::numeric_limits<uint32_t>::max();
   uint32_t support_graphics_queue_family_index = UINT32_MAX;
   for(uint32_t index = 0; index < queue_family_count ; index++)
   {
      if((queue_familys[index].queueFlags & VkQueueFlagBits::VK_QUEUE_GRAPHICS_BIT) == VkQueueFlagBits::VK_QUEUE_GRAPHICS_BIT)
      {
         // 寻找支持图形的队列族
         support_graphics_queue_family_index = index;
         break;
      }
   }

   if(support_graphics_queue_family_index == UINT32_MAX)
   {
      throw std::runtime_error("没找到支持图形的队列族");
   }

.. admonition:: support_graphics_queue_family_index
   :class: important

   需要获取存储对应设备队列族在 ``VkQueueFamilyProperties`` 数组中的索引值，这会在之后创建  `逻辑设备 <./LogicDevice.html>`_ 时指定设备队列时要用到。
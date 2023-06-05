Vulkan KHR 光线追踪标准
===========================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2023/6/5 创建该文章
   * 2023/6/5 增加 ``VK_KHR_acceleration_structure`` 章节
   * 2023/6/5 增加 ``查看是否支持加速结构特性`` 章节
   * 2023/6/5 增加 ``激活加速结构特性`` 章节
   * 2023/6/5 增加 ``创建加速结构`` 章节

在 ``Vulkan API`` 中有5个与光追相关的扩展

* `VK_KHR_acceleration_structure <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_acceleration_structure.html>`_
* `VK_KHR_ray_tracing_pipeline <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_ray_tracing_pipeline.html>`_
* `VK_KHR_ray_query <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_ray_query.html>`_
* `VK_KHR_pipeline_library <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_pipeline_library.html>`_
* `VK_KHR_deferred_host_operations <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_deferred_host_operations.html>`_

按照扩展的顺序研究研究。

VK_KHR_acceleration_structure
###################################

该扩展属于 :bdg-info:`设备扩展`。

:bdg-primary:`依赖如下`

* Vulkan 1.1
* `VK_EXT_descriptor_indexing <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_EXT_descriptor_indexing>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.2中被纳入核心` :bdg-primary:`依赖如下`
        * `VK_KHR_get_physical_device_properties2 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_get_physical_device_properties2>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`
        * `VK_KHR_maintenance3 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_maintenance3>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心` :bdg-primary:`依赖如下`
              * `VK_KHR_get_physical_device_properties2 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_get_physical_device_properties2>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`

* `VK_KHR_buffer_device_address <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_buffer_device_address>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.2中被纳入核心` :bdg-primary:`依赖如下`
        * `VK_KHR_get_physical_device_properties2 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_get_physical_device_properties2>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`
        * `VK_KHR_device_group <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_device_group>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心` :bdg-primary:`依赖如下`
              * `VK_KHR_device_group_creation <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_device_group_creation>`_ :bdg-info:`设备扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`
* `VK_KHR_deferred_host_operations <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_deferred_host_operations>`_ :bdg-info:`设备扩展`

新添加的对象类型（句柄）：

  * `VkAccelerationStructureKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap12.html#VkAccelerationStructureKHR>`_

新添加的函数：

  * `vkBuildAccelerationStructuresKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkBuildAccelerationStructuresKHR>`_
  * `vkCmdBuildAccelerationStructuresIndirectKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCmdBuildAccelerationStructuresIndirectKHR>`_
  * `vkCmdBuildAccelerationStructuresKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCmdBuildAccelerationStructuresKHR>`_
  * `vkCmdCopyAccelerationStructureKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCmdCopyAccelerationStructureKHR>`_
  * `vkCmdCopyAccelerationStructureToMemoryKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCmdCopyAccelerationStructureToMemoryKHR>`_
  * `vkCmdCopyMemoryToAccelerationStructureKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCmdCopyMemoryToAccelerationStructureKHR>`_
  * `vkCmdWriteAccelerationStructuresPropertiesKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCmdWriteAccelerationStructuresPropertiesKHR>`_
  * `vkCopyAccelerationStructureKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCopyAccelerationStructureKHR>`_
  * `vkCopyAccelerationStructureToMemoryKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCopyAccelerationStructureToMemoryKHR>`_
  * `vkCopyMemoryToAccelerationStructureKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkCopyMemoryToAccelerationStructureKHR>`_
  * `vkCreateAccelerationStructureKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap12.html#vkCreateAccelerationStructureKHR>`_
  * `vkDestroyAccelerationStructureKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap12.html#vkDestroyAccelerationStructureKHR>`_
  * `vkGetAccelerationStructureBuildSizesKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap12.html#vkGetAccelerationStructureBuildSizesKHR>`_
  * `vkGetAccelerationStructureDeviceAddressKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap12.html#vkGetAccelerationStructureDeviceAddressKHR>`_
  * `vkGetDeviceAccelerationStructureCompatibilityKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkGetDeviceAccelerationStructureCompatibilityKHR>`_
  * `vkWriteAccelerationStructuresPropertiesKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap37.html#vkWriteAccelerationStructuresPropertiesKHR>`_

查看是否支持加速结构特性
************************

如果使用 ``Vulkan 1.1`` 标准，可以通过调用 ``vkGetPhysicalDeviceFeatures2`` 获取加速结构特性相关信息。

.. code:: c++

    // 由 Vulkan 1.1 提供
    void vkGetPhysicalDeviceFeatures2(
    VkPhysicalDevice                            physicalDevice,
    VkPhysicalDeviceFeatures2*                  pFeatures);

如果激活了 ``VK_KHR_get_physical_device_properties2`` 扩展，可以通过 ``vkGetPhysicalDeviceFeatures2KHR`` 获取。

.. code:: c++

    // 由 VK_KHR_get_physical_device_properties2 提供
    void vkGetPhysicalDeviceFeatures2KHR(
        VkPhysicalDevice                            physicalDevice,
        VkPhysicalDeviceFeatures2*                  pFeatures);

对于获取设备是否支持加速结构特性，是通过将 ``VkPhysicalDeviceAccelerationStructureFeaturesKHR`` 的指针包含在 ``VkPhysicalDeviceFeatures2::pNext`` 指针链中。

.. code:: c++

    // 由 Vulkan 1.1 提供
    typedef struct VkPhysicalDeviceFeatures2 {
        VkStructureType             sType;
        void*                       pNext;
        VkPhysicalDeviceFeatures    features;
    } VkPhysicalDeviceFeatures2;

.. code:: c++

    // 由 VK_KHR_acceleration_structure 提供
    typedef struct VkPhysicalDeviceAccelerationStructureFeaturesKHR {
        VkStructureType    sType;
        void*              pNext;
        VkBool32           accelerationStructure;
        VkBool32           accelerationStructureCaptureReplay;
        VkBool32           accelerationStructureIndirectBuild;
        VkBool32           accelerationStructureHostCommands;
        VkBool32           descriptorBindingAccelerationStructureUpdateAfterBind;
    } VkPhysicalDeviceAccelerationStructureFeaturesKHR;

* :bdg-secondary:`accelerationStructure` 描述设备是否支持加速结构特性
* :bdg-secondary:`accelerationStructureCaptureReplay` 描述设备是否支持保存和重复使用加速结构的设备地址。比如用于追踪捕获和回放。
* :bdg-secondary:`accelerationStructureIndirectBuild` 描述设备是否支持间接加速结构构建指令。比如 ``vkCmdBuildAccelerationStructuresIndirectKHR`` 。
* :bdg-secondary:`accelerationStructureHostCommands` 描述设备是否支持 ``Host`` 端（ ``CPU`` ）的加速结构相关指令函数。比如 ``vkBuildAccelerationStructuresKHR`` ， ``vkCopyAccelerationStructureKHR`` ， ``vkCopyAccelerationStructureToMemoryKHR`` ， ``vkCopyMemoryToAccelerationStructureKHR`` ， ``vkWriteAccelerationStructuresPropertiesKHR`` 。
* :bdg-secondary:`descriptorBindingAccelerationStructureUpdateAfterBind` 描述设备是否支持在描述符集中已经绑定加速结构之后对加速结构进行更新。如果该特性不支持， ``VK_DESCRIPTOR_BINDING_UPDATE_AFTER_BIND_BIT`` 将不能与 ``VK_DESCRIPTOR_TYPE_ACCELERATION_STRUCTURE_KHR`` 一起使用。

例程
--------------------

.. code:: c++

    VkPhysicalDevice vk_physical_device = some_vk_physical_device;

    VkPhysicalDeviceAccelerationStructureFeaturesKHR vk_physical_device_acceleration_structure_features_khr = {};
    vk_physical_device_acceleration_structure_features_khr.sType = VkStructureType::VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_ACCELERATION_STRUCTURE_FEATURES_KHR;
    vk_physical_device_acceleration_structure_features_khr.pNext = nullptr;
    vk_physical_device_acceleration_structure_features_khr.accelerationStructure = VK_FALSE;
    vk_physical_device_acceleration_structure_features_khr.accelerationStructureCaptureReplay = VK_FALSE;
    vk_physical_device_acceleration_structure_features_khr.accelerationStructureIndirectBuild = VK_FALSE;
    vk_physical_device_acceleration_structure_features_khr.accelerationStructureHostCommands = VK_FALSE;
    vk_physical_device_acceleration_structure_features_khr.descriptorBindingAccelerationStructureUpdateAfterBind = VK_FALSE;

    VkPhysicalDeviceProperties2 vk_physical_device_properties_2 = {};
    vk_physical_device_properties_2.sType = VkStructureType::VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PROPERTIES_2;
    vk_physical_device_properties_2.pNext = &vk_physical_device_acceleration_structure_features_khr;
    vk_physical_device_properties_2.properties = {};
    
    vkGetPhysicalDeviceProperties2(vk_physical_device, &vk_physical_device_properties_2);

激活加速结构特性
**********************

创建加速结构
**********************

通过调用 ``vkCreateAccelerationStructureKHR`` 创建加速结构

.. code:: c++

    // 由 VK_KHR_acceleration_structure 提供
    VkResult vkCreateAccelerationStructureKHR(
        VkDevice                                    device,
        const VkAccelerationStructureCreateInfoKHR* pCreateInfo,
        const VkAllocationCallbacks*                pAllocator,
        VkAccelerationStructureKHR*                 pAccelerationStructure);

* :bdg-secondary:`device` 用于创建加速结构的逻辑设备句柄
* :bdg-secondary:`pCreateInfo` 加速结构的构建信息
* :bdg-secondary:`pAllocator` 分配器
* :bdg-secondary:`pAccelerationStructure` 创建的目标加速结构句柄

加速结构仅仅用于创建一个具有特定形状的物体。可以构建进入加速结构的几何数量和类型是通过 ``VkAccelerationStructureCreateInfoKHR`` 来指定。

之后往加速结构内部填入数据和绑定内存是通过调用 ``vkCmdBuildAccelerationStructuresKHR`` 、 ``vkBuildAccelerationStructuresKHR`` 、 ``vkCmdCopyAccelerationStructureKHR`` 和 ``vkCopyAccelerationStructureKHR`` 函数实现的。

在将缓存输入构建加速结构指令构建加速结构时，如何构建加速结构是设备自己内部实现。

.. admonition:: 前提条件
    :class: note

    sa
Vulkan KHR 光线追踪标准
===========================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2023/6/5 创建该文档
   * 2023/6/5 增加 ``VK_KHR_acceleration_structure`` 章节
   * 2023/6/5 增加 ``查看是否支持加速结构特性`` 章节
   * 2023/6/5 增加 ``激活加速结构特性`` 章节
   * 2023/6/5 增加 ``创建加速结构`` 章节
   * 2023/6/6 更新 ``激活加速结构特性`` 章节
   * 2023/6/6 更新 ``创建加速结构`` 章节
   * 2023/6/7 增加 ``获取加速结构的构建大小`` 章节
   * 2023/6/7 更新 ``VK_KHR_acceleration_structure`` 章节，增加 ``加速结构的创建和构建`` 注意项
   * 2023/6/7 增加 ``销毁加速结构`` 章节
   * 2023/6/8 增加 ``有关本文档结构`` 的说明
   * 2023/6/8 增加 ``有关本文档结构`` 的说明
   * 2023/6/8 将 ``获取加速结构的构建大小`` 章节插入到 ``创建加速结构`` 之前
   * 2023/6/8 更新 ``获取加速结构的构建大小`` 章节
   * 2023/6/8 增加 ``加速结构`` 章节
   * 2023/6/8 增加 ``几何体`` 章节
   * 2023/6/8 增加 ``顶层加速结构`` 章节
   * 2023/6/8 增加 ``底层加速结构`` 章节
   * 2023/6/8 增加 ``无效的图元和实体`` 章节
   * 2023/6/8 增加 ``构建加速结构`` 章节
   * 2023/6/9 更新 ``构建加速结构`` 章节
   * 2023/6/10 更新 ``构建加速结构`` 章节
   * 2023/6/11 更新 ``构建加速结构`` 章节
   * 2023/6/11 增加 ``拷贝加速结构`` 章节
   * 2023/6/11 增加 ``vkCmdBuildAccelerationStructuresKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureBuildGeometryInfoKHR`` 章节
   * 2023/6/11 增加 ``VkBuildAccelerationStructureModeKHR`` 章节
   * 2023/6/11 增加 ``VkDeviceOrHostAddressKHR`` 章节
   * 2023/6/11 增加 ``VkDeviceOrHostAddressConstKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureGeometryKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureGeometryDataKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureGeometryTrianglesDataKHR`` 章节
   * 2023/6/11 增加 ``VkTransformMatrixKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureGeometryAabbsDataKHR`` 章节
   * 2023/6/11 增加 ``VkAabbPositionsKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureGeometryInstancesDataKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureInstanceKHR`` 章节
   * 2023/6/11 增加 ``VkGeometryInstanceFlagBitsKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureBuildRangeInfoKHR`` 章节
   * 2023/6/11 增加 ``vkGetAccelerationStructureBuildSizesKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureBuildSizesInfoKHR`` 章节
   * 2023/6/11 增加 ``vkCreateAccelerationStructureKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureCreateInfoKHR`` 章节
   * 2023/6/11 增加 ``vkGetAccelerationStructureDeviceAddressKHR`` 章节
   * 2023/6/11 增加 ``VkAccelerationStructureDeviceAddressInfoKHR`` 章节
   * 2023/6/11 增加 ``vkDestroyAccelerationStructureKHR`` 章节
   * 2023/6/12 更新 ``VkAccelerationStructureBuildGeometryInfoKHR`` 章节
   * 2023/6/12 调整 ``获取加速结构的构建大小`` 章节顺序
   * 2023/6/12 调整 ``创建加速结构`` 章节顺序
   * 2023/6/12 创建 ``加速结构的描述`` 章节，并将如下章节调整到当前章节中：

        * ``VkAccelerationStructureBuildGeometryInfoKHR``
        * ``VkBuildAccelerationStructureModeKHR``
        * ``VkDeviceOrHostAddressKHR``
        * ``VkDeviceOrHostAddressConstKHR``
        * ``VkAccelerationStructureGeometryKHR``
        * ``VkAccelerationStructureGeometryDataKHR``
        * ``VkAccelerationStructureGeometryTrianglesDataKHR``
        * ``VkTransformMatrixKHR``
        * ``VkAccelerationStructureGeometryAabbsDataKHR``
        * ``VkAabbPositionsKHR``
        * ``VkAccelerationStructureGeometryInstancesDataKHR``
        * ``VkAccelerationStructureInstanceKHR``
        * ``VkGeometryInstanceFlagBitsKHR``

   * 2023/6/12 增加 ``VkAccelerationStructureTypeKHR`` 章节
   * 2023/6/12 增加 ``VkBuildAccelerationStructureFlagBitsKHR`` 章节
   * 2023/6/13 增加 ``VkGeometryTypeKHR`` 章节
   * 2023/6/13 增加 ``VkGeometryFlagBitsKHR`` 章节
   * 2023/6/13 增加 ``获取缓存的设备地址`` 章节
   * 2023/6/13 增加 ``vkGetBufferDeviceAddress`` 章节
   * 2023/6/13 增加 ``vkGetBufferDeviceAddressKHR`` 章节
   * 2023/6/13 增加 ``VkBufferDeviceAddressInfo`` 章节
   * 2023/6/13 增加 ``VkBufferDeviceAddressInfoKHR`` 章节
   * 2023/6/13 将 ``VK_KHR_acceleration_structure`` 相关所有章节转移至单独的 ``VK_KHR_acceleration_structure`` 文档中

.. admonition:: 有关本文档结构
    :class: warning

    本文档基本提炼于 ``Vulkan`` 标准文档，由于 ``Vulkan`` 标准文档中有时并没有按照开发者的学习逻辑角度布局其文档的前后关系，所以该文档在书写过程中章节会随时按照开发的前后逻辑关系随时调整。

在 ``Vulkan API`` 中有5个与光追相关的扩展

* `VK_KHR_acceleration_structure <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_acceleration_structure.html>`_
* `VK_KHR_ray_tracing_pipeline <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_ray_tracing_pipeline.html>`_
* `VK_KHR_ray_query <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_ray_query.html>`_
* `VK_KHR_pipeline_library <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_pipeline_library.html>`_
* `VK_KHR_deferred_host_operations <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_deferred_host_operations.html>`_

按照扩展的顺序研究研究。

.. toctree::
   :maxdepth: 2

   ./VK_KHR_acceleration_structure.rst
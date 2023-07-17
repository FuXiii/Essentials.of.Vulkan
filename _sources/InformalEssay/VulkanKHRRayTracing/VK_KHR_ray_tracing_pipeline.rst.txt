VK_KHR_ray_tracing_pipeline
====================================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2023/7/14 创建该文档
   * 2023/7/17 增加 ``扩展名定义`` 章节
   * 2023/7/17 增加 ``新增函数`` 章节
   * 2023/7/17 增加 ``新增枚举`` 章节
   * 2023/7/17 增加 ``新增特性`` 章节
   * 2023/7/17 增加 ``新增属性`` 章节
   * 2023/7/17 增加 ``VkPhysicalDeviceRayTracingPipelineFeaturesKHR`` 章节
   * 2023/7/17 增加 ``VkPhysicalDeviceRayTracingPipelinePropertiesKHR`` 章节

该扩展属于 :bdg-info:`device扩展`。

:bdg-primary:`依赖如下`

* Vulkan 1.1
* `VK_KHR_spirv_1_4 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_spirv_1_4>`_ :bdg-info:`device扩展` :bdg-warning:`在Vulkan 1.2中被纳入核心` :bdg-primary:`依赖如下`
        * `VK_KHR_shader_float_controls <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_shader_float_controls>`_ :bdg-info:`device扩展` :bdg-warning:`在Vulkan 1.2中被纳入核心`
              * `VK_KHR_get_physical_device_properties2 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_get_physical_device_properties2>`_ :bdg-info:`instance扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`

* `VK_KHR_acceleration_structure <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_acceleration_structure>`_ :bdg-info:`device扩展` :bdg-warning:`在Vulkan 1.2中被纳入核心` :bdg-primary:`依赖如下`

扩展名定义
************************

* VK_KHR_RAY_TRACING_PIPELINE_EXTENSION_NAME

新增函数
************************

* `vkCmdSetRayTracingPipelineStackSizeKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap10.html#vkCmdSetRayTracingPipelineStackSizeKHR>`_
* `vkCmdTraceRaysIndirectKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap40.html#vkCmdTraceRaysIndirectKHR>`_
* `vkCmdTraceRaysKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap40.html#vkCmdTraceRaysKHR>`_
* `vkCreateRayTracingPipelinesKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap10.html#vkCreateRayTracingPipelinesKHR>`_
* `vkGetRayTracingCaptureReplayShaderGroupHandlesKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap10.html#vkGetRayTracingCaptureReplayShaderGroupHandlesKHR>`_
* `vkGetRayTracingShaderGroupHandlesKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/hap10.html#vkGetRayTracingShaderGroupHandlesKHR>`_
* `vkGetRayTracingShaderGroupStackSizeKHR <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap10.html#vkGetRayTracingShaderGroupStackSizeKHR>`_

新增枚举
************************

VkBufferUsageFlagBits
------------------------

* VK_BUFFER_USAGE_SHADER_BINDING_TABLE_BIT_KHR

VkDynamicState
------------------------

* VK_DYNAMIC_STATE_RAY_TRACING_PIPELINE_STACK_SIZE_KHR

VkPipelineBindPoint
------------------------

* VK_PIPELINE_BIND_POINT_RAY_TRACING_KHR

VkPipelineStageFlagBits
------------------------

* VK_PIPELINE_STAGE_RAY_TRACING_SHADER_BIT_KHR

VkShaderStageFlagBits
------------------------

* VK_SHADER_STAGE_ANY_HIT_BIT_KHR
* VK_SHADER_STAGE_CALLABLE_BIT_KHR
* VK_SHADER_STAGE_CLOSEST_HIT_BIT_KHR
* VK_SHADER_STAGE_INTERSECTION_BIT_KHR
* VK_SHADER_STAGE_MISS_BIT_KHR
* VK_SHADER_STAGE_RAYGEN_BIT_KHR

新增特性
************************

* VkPhysicalDeviceRayTracingPipelineFeaturesKHR

新增属性
************************

* VkPhysicalDeviceRayTracingPipelinePropertiesKHR

VkPhysicalDeviceRayTracingPipelineFeaturesKHR
*************************************************

.. code:: c++

   // 由 VK_KHR_ray_tracing_pipeline 提供
   typedef struct VkPhysicalDeviceRayTracingPipelineFeaturesKHR {
       VkStructureType    sType;
       void*              pNext;
       VkBool32           rayTracingPipeline;
       VkBool32           rayTracingPipelineShaderGroupHandleCaptureReplay;
       VkBool32           rayTracingPipelineShaderGroupHandleCaptureReplayMixed;
       VkBool32           rayTracingPipelineTraceRaysIndirect;
       VkBool32           rayTraversalPrimitiveCulling;
   } VkPhysicalDeviceRayTracingPipelineFeaturesKHR;

* :bdg-secondary:`sType` 该结构体的类型，必须为 ``VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_RAY_TRACING_PIPELINE_FEATURES_KHR`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`rayTracingPipeline` 表示驱动实现是否支持光追管线函数。
* :bdg-secondary:`rayTracingPipelineShaderGroupHandleCaptureReplay` 表示驱动实现是否支持保存和重用着色器组的句柄，例如，用于跟踪捕捉和重放。
* :bdg-secondary:`rayTracingPipelineShaderGroupHandleCaptureReplayMixed` 表示驱动实现是否支持重用着色器组的句柄与不可重用着色器组句柄进行混用，如果为 ``VK_FALSE`` ，所有重用的着色器组句柄必须在任何不可重用的主色器组创建之前指定。
* :bdg-secondary:`rayTracingPipelineTraceRaysIndirect` 表示驱动实现是否支持间接光追指令，比如 ``vkCmdTraceRaysIndirectKHR`` 指令。
* :bdg-secondary:`rayTraversalPrimitiveCulling` 表示驱动实现是否支持在光线遍历时进行图元裁剪。

如果 ``VkPhysicalDeviceRayTracingPipelineFeaturesKHR`` 结构体通过 ``vkGetPhysicalDeviceFeatures2`` 在 ``VkPhysicalDeviceFeatures2::pNext`` 扩展链中指定，将会将对应的设备支持特性信息写入。并通过 ``VkDeviceCreateInfo::pNext`` 扩展链通过指定 ``VkPhysicalDeviceRayTracingPipelineFeaturesKHR`` 激活对应特性。

VkPhysicalDeviceRayTracingPipelinePropertiesKHR
***************************************************

.. code:: c++

   // 由 VK_KHR_ray_tracing_pipeline 提供
   typedef struct VkPhysicalDeviceRayTracingPipelinePropertiesKHR {
       VkStructureType    sType;
       void*              pNext;
       uint32_t           shaderGroupHandleSize;
       uint32_t           maxRayRecursionDepth;
       uint32_t           maxShaderGroupStride;
       uint32_t           shaderGroupBaseAlignment;
       uint32_t           shaderGroupHandleCaptureReplaySize;
       uint32_t           maxRayDispatchInvocationCount;
       uint32_t           shaderGroupHandleAlignment;
       uint32_t           maxRayHitAttributeSize;
   } VkPhysicalDeviceRayTracingPipelinePropertiesKHR;

* :bdg-secondary:`sType` 该结构体的类型，必须为 ``VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_RAY_TRACING_PIPELINE_PROPERTIES_KHR`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`shaderGroupHandleSize` 着色器头部的比特大小。
* :bdg-secondary:`maxRayRecursionDepth` 单次追踪指令中允许光线递归的最大层级数。
* :bdg-secondary:`maxShaderGroupStride` 着色器绑定表中允许着色器组之间的最大比特位跨度。
* :bdg-secondary:`shaderGroupBaseAlignment` 着色器绑定表需要的内存对齐比特。
* :bdg-secondary:`shaderGroupHandleCaptureReplaySize` 对于着色器组的捕获和回放所需的信息的比特大小。
* :bdg-secondary:`maxRayDispatchInvocationCount` 对于单次 ``vkCmdTraceRaysIndirectKHR`` 或 ``vkCmdTraceRaysKHR`` 指令对光线生成着色器最大的执行次数。
* :bdg-secondary:`shaderGroupHandleAlignment` 着色器绑定表中每项的内存对齐比特数。且必须是 ``2`` 的倍数。
* :bdg-secondary:`maxRayHitAttributeSize` 光线属性结构体的最大比特大小。

如果 ``VkPhysicalDeviceRayTracingPipelinePropertiesKHR`` 结构体通过 ``vkGetPhysicalDeviceProperties2`` 在 ``VkPhysicalDeviceProperties2::pNext`` 扩展链中指定，将会将对应的属性信息写入。

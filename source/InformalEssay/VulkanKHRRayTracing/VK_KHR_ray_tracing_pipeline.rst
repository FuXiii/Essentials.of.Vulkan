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
   * 2023/7/21 增加 ``vkCreateRayTracingPipelinesKHR`` 章节
   * 2023/7/21 增加 ``VkRayTracingPipelineCreateInfoKHR`` 章节
   * 2023/8/1 更新 ``VkRayTracingPipelineCreateInfoKHR`` 章节

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

vkCreateRayTracingPipelinesKHR
***************************************************

创建光追管线调用 ``vkCreateRayTracingPipelinesKHR`` 函数：

.. code:: c++

   // 由 VK_KHR_ray_tracing_pipeline 提供
   VkResult vkCreateRayTracingPipelinesKHR(
       VkDevice                                    device,
       VkDeferredOperationKHR                      deferredOperation,
       VkPipelineCache                             pipelineCache,
       uint32_t                                    createInfoCount,
       const VkRayTracingPipelineCreateInfoKHR*    pCreateInfos,
       const VkAllocationCallbacks*                pAllocator,
       VkPipeline*                                 pPipelines);

* :bdg-secondary:`device` 创建该光追管线的逻辑设备句柄。
* :bdg-secondary:`deferredOperation` 配置创建光追管线是否为延迟操作（需要开启 ``VK_KHR_deferred_host_operations`` 扩展）。要么是 ``VK_NULL_HANDLE`` 要么是 ``VkDeferredOperationKHR`` 有效句柄则表示进行延迟操作。
* :bdg-secondary:`pipelineCache` 要么是 ``VK_NULL_HANDLE`` 要么是 ``VkPipelineCache`` 有效句柄则表示进行管线缓存。
* :bdg-secondary:`createInfoCount` 表示 ``pCreateInfos`` 数组中的元素数量。
* :bdg-secondary:`pCreateInfos` 表示数量为 ``createInfoCount`` 类型为 ``VkRayTracingPipelineCreateInfoKHR`` 的数组，用于一次性创建多个光追管线。
* :bdg-secondary:`pPipelines` 表示数量为 ``createInfoCount`` 类型为 ``VkPipeline`` 的数组，用于保存创建多个光追管线句柄。

如果 ``VkPhysicalDeviceRayTracingPipelineFeaturesKHR::rayTracingPipelineShaderGroupHandleCaptureReplay`` 特性被激活，但是驱动不支持重复使用 ``VkRayTracingPipelineCreateInfoKHR`` 中的 ``VkRayTracingShaderGroupCreateInfoKHR::pShaderGroupCaptureReplayHandle`` 的话将会返回 ``VK_ERROR_INVALID_OPAQUE_CAPTURE_ADDRESS`` 错误。

.. admonition:: 正确用法
   :class: note

   * 如果 ``pCreateInfos`` 中任意一个元素的 ``flags`` 包含 ``VK_PIPELINE_CREATE_DERIVATIVE_BIT`` 标志位的话，则对应的元素的 ``basePipelineIndex`` 不为 ``-1`` 的话，则 ``basePipelineIndex`` 所表示的索引值必须小于 ``pCreateInfos`` 数组元素数量。
   * 如果 ``pCreateInfos`` 中任意一个元素的 ``flags`` 包含 ``VK_PIPELINE_CREATE_DERIVATIVE_BIT`` 标志位的话，则对应的基础管线必须使用 ``VK_PIPELINE_CREATE_ALLOW_DERIVATIVES_BIT`` 创建。
   * ``flags`` 一定不能包含 ``VK_PIPELINE_CREATE_DISPATCH_BASE`` 标志位。
   * 如果 ``pipelineCache`` 使用 ``VK_PIPELINE_CACHE_CREATE_EXTERNALLY_SYNCHRONIZED_BIT`` 创建的话， ``Host`` 端访问 ``pipelineCache`` 必须外部同步。
   * 如果 ``deferredOperation`` 不为 ``VK_NULL_HANDLE`` 的话， 他必须是一个 ``VkDeferredOperationKHR`` 有效句柄。
   * 任何与 ``deferredOperation`` 有关的前置操作都需要完成。
   * 必须激活 ``rayTracingPipeline`` 有特性。
   * 如果 ``deferredOperation`` 不为 ``VK_NULL_HANDLE`` 的话，对应的 ``flags`` 中一定不能包含 ``VK_PIPELINE_CREATE_EARLY_RETURN_ON_FAILURE_BIT`` 标志位。

VkRayTracingPipelineCreateInfoKHR
***************************************************

.. code:: c++

   // 由 VK_KHR_ray_tracing_pipeline 提供
   typedef struct VkRayTracingPipelineCreateInfoKHR {
       VkStructureType                                      sType;
       const void*                                          pNext;
       VkPipelineCreateFlags                                flags;
       uint32_t                                             stageCount;
       const VkPipelineShaderStageCreateInfo*               pStages;
       uint32_t                                             groupCount;
       const VkRayTracingShaderGroupCreateInfoKHR*          pGroups;
       uint32_t                                             maxPipelineRayRecursionDepth;
       const VkPipelineLibraryCreateInfoKHR*                pLibraryInfo;
       const VkRayTracingPipelineInterfaceCreateInfoKHR*    pLibraryInterface;
       const VkPipelineDynamicStateCreateInfo*              pDynamicState;
       VkPipelineLayout                                     layout;
       VkPipeline                                           basePipelineHandle;
       int32_t                                              basePipelineIndex;
   } VkRayTracingPipelineCreateInfoKHR;

* :bdg-secondary:`sType` 该结构体的类型，必须为 ``VK_STRUCTURE_TYPE_RAY_TRACING_PIPELINE_CREATE_INFO_KHR`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`flags` 用于指定的创建光追管线的额外参数。对应 ``VkPipelineCreateFlagBits`` 中各位域值。
* :bdg-secondary:`stageCount` 表示 ``pStages`` 中的元素个数。
* :bdg-secondary:`pStages` 个数为 ``stageCount`` 类型为 ``VkPipelineShaderStageCreateInfo`` 的数组。用于描述该管线中的着色器。
* :bdg-secondary:`groupCount` 表示 ``pGroups`` 中的元素个数。
* :bdg-secondary:`pGroups` 个数为 ``groupCount`` 类型为 ``VkRayTracingShaderGroupCreateInfoKHR`` 的数组。用于描述该管线中的每个着色器组中包含的着色器。
* :bdg-secondary:`maxPipelineRayRecursionDepth` 为管线着色器的最大递归深度。
* :bdg-secondary:`pLibraryInfo` 指向 ``VkPipelineLibraryCreateInfoKHR`` 用于定义包含的管线库。
* :bdg-secondary:`pLibraryInterface` 指向 ``VkRayTracingPipelineInterfaceCreateInfoKHR`` 用于定义当时用管线库的额外信息。
* :bdg-secondary:`pDynamicState` 指向 ``VkPipelineDynamicStateCreateInfo`` 用于定义管线的动态属性哪些可以单独动态改变。
* :bdg-secondary:`layout` 表示该管线对应绑定的描述符集所对应的位置。
* :bdg-secondary:`basePipelineHandle` 要派生的父管线句柄。
* :bdg-secondary:`basePipelineIndex` 表示要从 ``pCreateInfos`` 中对应的索引中派生。

如果设置了 ``VK_PIPELINE_CREATE_LIBRARY_BIT_KHR`` 标志位的话，该管线定义的管线库不能直接作为光追管线进行绑定。而是通过管线库定义通用的着色器和着色器组用于之后的管线创建。

如果 ``pLibraryInfo`` 中包含管线库的话，该管线库中定义的着色器们将会被认为是 ``pStages`` 的额外项。

如果 ``VK_DYNAMIC_STATE_RAY_TRACING_PIPELINE_STACK_SIZE_KHR`` 没有设置的话，管线的默认栈大小是按照 `Ray Tracing Pipeline Stack <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap40.html#ray-tracing-pipeline-stack>`_ 计算得出。

如果 ``VkPipelineCreateFlags2CreateInfoKHR`` 存在于 ``pNext`` 扩展链中，将会忽略该结构体中的 ``flags`` 转而使用 ``VkPipelineCreateFlags2CreateInfoKHR::flags`` 。

.. admonition:: 正确用法
   :class: note

   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_DERIVATIVE_BIT`` 标志位的话，并且 ``basePipelineIndex`` 不为 ``-1`` 的话，则 ``basePipelineHandle`` 必须是一个有效的光追管线。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_DERIVATIVE_BIT`` 标志位的话，并且 ``basePipelineHandle`` 是 ``VK_NULL_HANDLE`` 的话，则 ``basePipelineIndex`` 必须是一个有效的索引值。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_DERIVATIVE_BIT`` 标志位的话， ``basePipelineIndex`` 必须是 ``-1`` 或 ``basePipelineHandle`` 为 ``VK_NULL_HANDLE``。
   * 如果 ``flags`` 一定不能包含 ``VK_PIPELINE_CREATE_INDIRECT_BINDABLE_BIT_NV`` 标志位。
   * 如果 `pipelineCreationCacheControl <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap46.html#features-pipelineCreationCacheControl>`_ 特性没有开启 ``flags`` 一定不能包含 ``VK_PIPELINE_CREATE_FAIL_ON_PIPELINE_COMPILE_REQUIRED_BIT`` 或 ``VK_PIPELINE_CREATE_EARLY_RETURN_ON_FAILURE_BIT`` 标志位。
   * 如果 ``flags`` 不包含 ``VK_PIPELINE_CREATE_LIBRARY_BIT_KHR`` 标志位的话， ``pStages`` 最起码其中一个 ``VK_SHADER_STAGE_RAYGEN_BIT_KHR`` 元素隐式的加入到 ``pLibraryInfo`` 中。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_LIBRARY_BIT_KHR`` 标志位的话， ``pLibraryInterface`` 一定不能为 ``NULL`` 。
   * ``pLibraryInfo->pLibraries`` 中的每一个元素的 ``maxPipelineRayRecursionDepth`` 都必须与该管线相等。
   * 如果 ``pLibraryInfo`` 不为 ``NULL`` ，其中的每一个元素的 ``layout`` 都必须与该管线的 ``layout`` 兼容。
   * 如果 ``pLibraryInfo`` 不为 ``NULL`` ，其中的每一个元素的 ``pLibraryInterface`` 成员中的 ``maxPipelineRayPayloadSize`` 和 ``maxPipelineRayHitAttributeSize`` 都必须与该管线的相等。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_SHADER_GROUP_HANDLE_CAPTURE_REPLAY_BIT_KHR`` 标志位的话， ``pLibraryInfo->pLibraries`` 的每一个元素都需要使用 ``VK_PIPELINE_CREATE_RAY_TRACING_SHADER_GROUP_HANDLE_CAPTURE_REPLAY_BIT_KHR`` 创建。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_AABBS_BIT_KHR`` 标志位的话， ``pLibraryInfo->pLibraries`` 的每一个元素都需要使用 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_AABBS_BIT_KHR`` 创建。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_TRIANGLES_BIT_KHR`` 标志位的话， ``pLibraryInfo->pLibraries`` 的每一个元素都需要使用 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_TRIANGLES_BIT_KHR`` 创建。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_ANY_HIT_SHADERS_BIT_KHR`` 标志位的话， ``pLibraryInfo->pLibraries`` 的每一个元素都需要使用 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_ANY_HIT_SHADERS_BIT_KHR`` 创建。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_CLOSEST_HIT_SHADERS_BIT_KHR`` 标志位的话， ``pLibraryInfo->pLibraries`` 的每一个元素都需要使用 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_CLOSEST_HIT_SHADERS_BIT_KHR`` 创建。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_INTERSECTION_SHADERS_BIT_KHR`` 标志位的话， ``pLibraryInfo->pLibraries`` 的每一个元素都需要使用 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_INTERSECTION_SHADERS_BIT_KHR`` 创建。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_MISS_SHADERS_BIT_KHR`` 标志位的话， ``pLibraryInfo->pLibraries`` 的每一个元素都需要使用 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_MISS_SHADERS_BIT_KHR`` 创建。
   * 如果不支持 `VK_KHR_pipeline_library <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap55.html#VK_KHR_pipeline_library>`_ 扩展的话， ``pLibraryInfo`` 和 ``pLibraryInterface`` 必须为 ``NULL`` 。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_ANY_HIT_SHADERS_BIT_KHR`` 标志位的话， 对于 ``pGroups`` 中的每一个 ``type`` 为 ``VK_RAY_TRACING_SHADER_GROUP_TYPE_TRIANGLES_HIT_GROUP_KHR`` 或 ``VK_RAY_TRACING_SHADER_GROUP_TYPE_PROCEDURAL_HIT_GROUP_KHR`` 元素所对应 ``anyHitShader`` 元素一定不能为 ``VK_SHADER_UNUSED_KHR``。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_NO_NULL_CLOSEST_HIT_SHADERS_BIT_KHR`` 标志位的话， 对于 ``pGroups`` 中的每一个 ``type`` 为 ``VK_RAY_TRACING_SHADER_GROUP_TYPE_TRIANGLES_HIT_GROUP_KHR`` 或 ``VK_RAY_TRACING_SHADER_GROUP_TYPE_PROCEDURAL_HIT_GROUP_KHR`` 元素所对应 ``closestHitShader`` 元素一定不能为 ``VK_SHADER_UNUSED_KHR``。
   * 如果 `rayTraversalPrimitiveCulling <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap46.html#features-rayTraversalPrimitiveCulling>`_ 特性没有激活， ``flags`` 一定不能包括 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_AABBS_BIT_KHR`` 标志位。
   * 如果 `rayTraversalPrimitiveCulling <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap46.html#features-rayTraversalPrimitiveCulling>`_ 特性没有激活， ``flags`` 一定不能包括 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_TRIANGLES_BIT_KHR`` 标志位。
   * ``flags`` 一定不能同时包含 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_TRIANGLES_BIT_KHR `` 和 ``VK_PIPELINE_CREATE_RAY_TRACING_SKIP_AABBS_BIT_KHR`` 标志位。
   * 如果 ``flags`` 包含 ``VK_PIPELINE_CREATE_RAY_TRACING_SHADER_GROUP_HANDLE_CAPTURE_REPLAY_BIT_KHR`` 标志位的话 `rayTracingPipelineShaderGroupHandleCaptureReplay <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap46.html#features-rayTracingPipelineShaderGroupHandleCaptureReplay>`_ 必须激活。
   * 如果 ``VkPhysicalDeviceRayTracingPipelineFeaturesKHR::rayTracingPipelineShaderGroupHandleCaptureReplay`` 为 ``VK_TRUE`` 并且 ``pGroups`` 任意一个元素的 ``pShaderGroupCaptureReplayHandle`` 不为 ``NULL`` 的话， ``flags`` 必须包含 ``VK_PIPELINE_CREATE_RAY_TRACING_SHADER_GROUP_HANDLE_CAPTURE_REPLAY_BIT_KHR`` 标志位。
   * 如果 ``pLibraryInfo`` 为 ``NULL`` 或 ``libraryCount`` 为 ``0`` 的话， ``stageCount`` 一定不能为 ``0``。
   * 如果 ``flags`` 不包括 ``VK_PIPELINE_CREATE_LIBRARY_BIT_KHR`` 并且 ``pLibraryInfo`` 为 ``NULL`` 或 ``libraryCount`` 为 ``0`` 的话， ``groupCount`` 一定不能为 ``0``。
   * ``pDynamicStates`` 中的任意一个元素的 ``pDynamicState`` 成员必须为 ``VK_DYNAMIC_STATE_RAY_TRACING_PIPELINE_STACK_SIZE_KHR``。
   * 如果 ``VkPipelineCreationFeedbackCreateInfo::pipelineStageCreationFeedbackCount`` 不为 ``0`` ，其必须与 ``stageCount`` 相等。
   * ``pStages`` 的所有元素必须为 ``VK_SHADER_STAGE_RAYGEN_BIT_KHR`` ， ``VK_SHADER_STAGE_ANY_HIT_BIT_KHR`` ， ``VK_SHADER_STAGE_CLOSEST_HIT_BIT_KHR`` ， ``VK_SHADER_STAGE_MISS_BIT_KHR`` ， ``VK_SHADER_STAGE_INTERSECTION_BIT_KHR`` 或 ``VK_SHADER_STAGE_CALLABLE_BIT_KHR`` 之一。
   * 如果 ``flags`` 包括 ``VK_PIPELINE_CREATE_RAY_TRACING_OPACITY_MICROMAP_BIT_EXT`` 的话，则 ``pLibraryInfo->pLibraries`` 中的每一个元素必须使用 ``VK_PIPELINE_CREATE_RAY_TRACING_OPACITY_MICROMAP_BIT_EXT`` 标志位创建。
   * 如果 ``flags`` 包括 ``VK_PIPELINE_CREATE_RAY_TRACING_DISPLACEMENT_MICROMAP_BIT_NV`` 的话，则 ``pLibraryInfo->pLibraries`` 中的每一个元素必须使用 ``VK_PIPELINE_CREATE_RAY_TRACING_DISPLACEMENT_MICROMAP_BIT_NV`` 标志位创建。

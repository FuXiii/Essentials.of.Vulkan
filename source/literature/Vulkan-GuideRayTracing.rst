光线追踪
=========

.. admonition:: 更新记录
   :class: note

   * 2023/5/12 创建本文
   * 2023/5/12 创建 ``VK_KHR_acceleration_structure`` 章节
   * 2023/5/12 创建 ``VK_KHR_ray_tracing_pipeline`` 章节
   * 2023/5/12 创建 ``VK_KHR_ray_query`` 章节
   * 2023/5/12 创建 ``VK_KHR_pipeline_library`` 章节
   * 2023/5/12 创建 ``VK_KHR_deferred_host_operations`` 章节
   * 2023/5/12 创建 ``光追最佳实践`` 章节
  
`文献源`_

.. _文献源: https://github.com/KhronosGroup/Vulkan-Guide/blob/main/chapters/extensions/ray_tracing.adoc

在 ``Vulkan API`` 中有5个与光追相关的扩展

* `VK_KHR_acceleration_structure <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_acceleration_structure.html>`_
* `VK_KHR_ray_tracing_pipeline <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_ray_tracing_pipeline.html>`_
* `VK_KHR_ray_query <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_ray_query.html>`_
* `VK_KHR_pipeline_library <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_pipeline_library.html>`_
* `VK_KHR_deferred_host_operations <https://registry.khronos.org/vulkan/specs/1.3-extensions/man/html/VK_KHR_deferred_host_operations.html>`_
 
另外也发布了着色器对应 ``SPIR-V`` 和 ``GLSL`` 所需要的扩展

* `SPV_KHR_ray_tracing <http://htmlpreview.github.io/?https://github.com/KhronosGroup/SPIRV-Registry/blob/master/extensions/KHR/SPV_KHR_ray_tracing.html>`_
* `SPV_KHR_ray_query <http://htmlpreview.github.io/?https://github.com/KhronosGroup/SPIRV-Registry/blob/master/extensions/KHR/SPV_KHR_ray_query.html>`_
* `GLSL_EXT_ray_tracing <https://github.com/KhronosGroup/GLSL/blob/master/extensions/ext/GLSL_EXT_ray_tracing.txt>`_
* `GLSL_EXT_ray_query <https://github.com/KhronosGroup/GLSL/blob/master/extensions/ext/GLSL_EXT_ray_query.txt>`_
* `GLSL_EXT_ray_flags_primitive_culling <https://github.com/KhronosGroup/GLSL/blob/master/extensions/ext/GLSL_EXT_ray_flags_primitive_culling.txt>`_

.. note:: 
    很多光追程序都需要分配大量连续内存，由于内存地址空间大小的限值，在32位系统上实现很考验实现能力。虽然可以在32位系统上实现，但是应用可能面临着时不时的内存问题，比如分配内存失败。
    此外一些驱动实现可能根本不会在32位系统中显示支持。

VK_KHR_acceleration_structure
##############################

加速结构在光追中用于描述几何物体的（内部具体实现是驱动自定义的）。通过将几何体构建进加速结构，光追可基于此种已知的数据布局进行高效计算。
``VK_KHR_acceleration_structure`` 扩展提供了构建和拷贝加速结构的功能，并且支持与内存进行序列化。

加速结构需要光追管线 ``VK_KHR_ray_tracing_pipeline`` 和光线查询 ``VK_KHR_ray_query`` 两个扩展

对于加速结构的创建：

.. note:: 
    加速结构的 ``创建`` 和 ``构建`` 是两个不同的东西，创建是创建加速结构实例，构建是构建加速结构内部数据和结构。

* 使用 ``VkAccelerationStructureBuildGeometryInfoKHR`` 声明加速结构的类型、几何类型、数量和最大大小。此时真正的几何数据可以不指定。
* 调用 ``vkGetAccelerationStructureBuildSizesKHR`` 获取构建加速结构时的需要的内存大小
* 分配一个足够大的缓存用于存储加速结构（ ``VkAccelerationStructureBuildSizesKHR::accelerationStructureSize`` ）和暂存缓存（ ``VkAccelerationStructureBuildSizesKHR::buildScratchSize`` ）
* 调用 ``vkCreateAccelerationStructureKHR`` 创建一个加速结构（位于某一个缓存中特定位置）
* 调用 ``vkCmdBuildAccelerationStructuresKHR`` 去构建加速结构，之前提到的 ``VkAccelerationStructureBuildGeometryInfoKHR`` 在此时会被作为参数，将会根据声明的加速结构实例、构建暂存缓存和真正的几何数据（顶点，索引和变换）进行构建

VK_KHR_ray_tracing_pipeline
##############################

``VK_KHR_ray_tracing_pipeline`` 扩展用于光追管线。光追管线是区别于常见光栅化管线的独立渲染管线，光追管线使用一组专用着色器，与传统的顶点、几何、片元着色器独立。并且光追管线也提供独立的渲染指令（ ``vkCmdTraceRaysKHR`` 和 ``vkCmdTraceRaysIndirectKHR`` ）。
这与传统的光栅化绘制类似（ ``vkCmdDraw`` 和 ``vkCmdDrawIndirect`` ）。

为了追踪光线：

* 使用 ``vkCmdBindPipeline`` 绑定光追管线于 ``VK_PIPELINE_BIND_POINT_RAY_TRACING_KHR`` 上。
* 调用 ``vkCmdTraceRaysKHR`` 或 ``vkCmdTraceRaysIndirectKHR`` 

与光追管线有关的着色器如下：

.. image:: ../_static/VK_KHR_ray_tracing_pipeline_shaders_stage.jpg
    :align: center

* ``Ray generation shader`` 光线生成着色器，作为光追管线的起点。与计算着色器类似将会执行一组着色器调用（ ``vkCmdTraceRaysKHR`` 和 ``vkCmdTraceRaysIndirectKHR`` ）。光线生成着色器将会生成光线并且通过在着色器中调用 ``traceRayEXT()`` 进行追踪。并且处理光线相交结果的集合。
* ``Closest hit shaders`` 最近命中着色器将会在最近命中几何体时执行。应用支持任意数量的最近命中着色器。此着色器最常用于光照计算并继续追踪额外的光线。
* ``Miss shaders`` 未命中着色器与最近命中着色器相反，当光线没有与任何几何体相交时未命中着色器会被调用。该着色器常用于采样环境纹理。
* ``Intersection shaders`` 相交着色器允许自定义处理光线相交，并且内置的相交测试是基于三角形进行测试。
* ``Any hit shaders`` 任意命中着色器，与最近命中着色器类似，任意命中着色器在检测到发生相交时调用，任意命中着色器不同的是只要相交发生在 ``[tmin, tmax]`` 之间而不是最近的一次命中。任意命中着色器用于过滤相交和透明度测试。

VK_KHR_ray_query
##############################

``VK_KHR_ray_query`` 扩展支持在所有类型着色器中进行光线追踪，包括图形、计算和光追管线。

光线查询要求光线遍历代码必须位于着色器中。与光追管线不同的是，在光追管线中光线生成、求交测试和光线与几何体击中处理，都是在独立不同的着色器阶段。
所以光线查询允许在广泛的着色器阶段进行光线追踪，当然也有代价，这会限值 ``Vulkan`` 的驱动实现对于光追调度的优化。

该扩展不引入额外的 ``API`` 入口点，其仅仅使用 ``SPIR-V`` 和 ``GLSL`` 的扩展（ ``SPV_KHR_ray_query`` 和 ``GLSL_EXT_ray_query`` ）。

``VK_KHR_ray_query`` 所提供的功能与 ``VK_KHR_ray_tracing_pipeline`` 互补，并且两个扩展可以同时使用。

.. code:: cpp

    rayQueryEXT rq;
    
    rayQueryInitializeEXT(rq, accStruct, gl_RayFlagsTerminateOnFirstHitEXT, cullMask, origin, tMin, direction, tMax);
    
    // Traverse the acceleration structure and store information about the first intersection (if any)
    rayQueryProceedEXT(rq);
    
    if (rayQueryGetIntersectionTypeEXT(rq, true) == gl_RayQueryCommittedIntersectionNoneEXT) {
        // Not in shadow
    }

VK_KHR_pipeline_library
##############################

``VK_KHR_pipeline_library`` 用于管线库，一个管线库是使用 ``VK_PIPELINE_CREATE_LIBRARY_BIT_KHR`` 创建的特殊管线，其并不能直接绑定和使用，而是用于代表一组着色器或着色器组和相关其他管线相关的状态。

``VK_KHR_pipeline_library`` 并没有直接增加新 ``API`` 也没有定义如何创建管线库，而相关的功能是交于那些使用 ``VK_KHR_pipeline_library`` 提供功能的扩展。
当前仅仅提供了 ``VK_KHR_ray_tracing_pipeline`` 的例子。

.. admonition:: 当前仅仅提供了 ``VK_KHR_ray_tracing_pipeline`` 的例子
    :class: note

    在 ``KhronosGroup`` 的 `Vulkan-Samples <https://github.com/KhronosGroup/Vulkan-Samples>`_ 项目中目前已经不单单只有 ``VK_KHR_ray_tracing_pipeline`` 例子，还有 `其他扩展示例 <https://github.com/KhronosGroup/Vulkan-Samples/tree/main/samples/extensions>`_。

``VK_KHR_pipeline_library`` 被定义成独立的扩展，为了是在未来其它扩展共用此扩展而不需要依赖于光追扩展。

对于创建光追管线库：

* 当调用 ``vkCreateRayTracingPipelinesKHR`` 时指定 ``VkRayTracingPipelineCreateInfoKHR::flags`` 中有 ``VK_PIPELINE_CREATE_LIBRARY_BIT_KHR`` 

对于将光追管线链接到一个完整管线中：

* 设置 ``VkRayTracingPipelineCreateInfoKHR::pLibraryInfo`` 指向一个 ``VkPipelineLibraryCreateInfoKHR`` 实例指针
* 将 ``VkPipelineLibraryCreateInfoKHR::pLibraries`` 中设置的管线作为管线库中用于输入连接的管线，并且设置 ``VkPipelineLibraryCreateInfoKHR::libraryCount`` 设置适当值

VK_KHR_deferred_host_operations
##################################

``VK_KHR_deferred_host_operations`` 提供了将繁重的 ``CPU`` 的工作通过多线程进行分摊的机制。 ``VK_KHR_deferred_host_operations`` 被设计成允许应用创建和管理线程。

和 ``VK_KHR_pipeline_library`` 类似， ``VK_KHR_deferred_host_operations`` 也是个独立的扩展，目的也是为了在未来其他扩展共用该扩展功能。

只有在标注了支持延迟操作时才可以进行延迟操作。当前支持的延迟操作为 ``vkCreateRayTracingPipelinesKHR`` 、 ``vkBuildAccelerationStructuresKHR`` 、 ``vkCopyAccelerationStructureKHR`` 、 ``vkCopyMemoryToAccelerationStructureKHR`` 和 ``vkCopyAccelerationStructureToMemoryKHR`` 。

为了操作时延迟的：

* 通过 ``vkCreateDeferredOperationKHR`` 创建一个 ``VkDeferredOperationKHR`` 句柄
* 将 ``VkDeferredOperationKHR`` 作为参数调用需要的延迟操作
* 通过返回的 ``VkResult`` 查看之前的操作结果：
    * ``VK_OPERATION_DEFERRED_KHR`` 表示延迟操作成功
    * ``VK_OPERATION_NOT_DEFERRED_KHR`` 表示操作立即成功完成了
    * 其他任意错误值表示有错误发生

将一个线程加入到一个延迟操作，并且消耗 ``CPU`` 时间去处理该操作：

* 对于每个想要参与操作的线程调用 ``vkDeferredOperationJoinKHR``
* 通过 ``vkDeferredOperationJoinKHR``返回的 ``VkResult`` 查看操作结果：
    * ``VK_SUCCESS`` 表示操作完成
    * ``VK_THREAD_DONE_KHR`` 表示当前调用的线程已经没有要分配的工作了，但是其他的线程可能还在处理额外的工作。当前的线程不应该再通过 ``vkDeferredOperationJoinKHR`` 再次 ``join``
    * ``VK_THREAD_IDLE_KHR`` 表示当前调用的线程暂时已经没有要分配的工作了，但是其他额外的工作可能会在不期到来。当前的线程应该执行其他有用的工作，并且调用  ``vkDeferredOperationJoinKHR`` 再次 ``join`` 以此达到高收益。

当一个延迟操作完成后（比如 ``vkDeferredOperationJoinKHR`` 返回了  ``VK_SUCCESS`` ），调用 ``vkGetDeferredOperationResultKHR`` 获取延迟操作的结果。

光追最佳实践
##################################

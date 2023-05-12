光线追踪
=========

.. admonition:: 更新记录
   :class: note

   * 2023/5/12 创建本文
   * 2023/5/12 创建 ``VK_KHR_acceleration_structure`` 章节
   * 2023/5/12 创建 ``VK_KHR_ray_tracing_pipeline`` 章节
  
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

* ``Ray generation shader`` 光线生成着色器（后文简称 ``光生着色器`` ），作为光追管线的起点。与计算着色器类似将会执行一组着色器调用（ ``vkCmdTraceRaysKHR`` 和 ``vkCmdTraceRaysIndirectKHR`` ）。光线生成着色器将会生成光线并且通过在着色器中调用 ``traceRayEXT()`` 进行追踪。并且处理光线相交结果的集合。
* ``Closest hit shaders`` 最近命中着色器（后文简称 ``中靶着色器`` ）将会在最近命中几何体时执行。应用支持任意数量的中靶着色器。此着色器最常用于光照计算并继续追踪额外的光线。
* ``Miss shaders`` 未命中着色器（后文简称 ``脱靶着色器`` ）与中靶着色器相反，当光线没有与任何几何体相交时脱靶着色器会被调用。该着色器常用于采样环境纹理。
* ``Intersection shaders`` 相交着色器允许自定义处理光线相交，并且内置的相交测试是基于三角形进行测试。
* ``Any hit shaders`` 任意命中着色器（后文简称 ``随靶着色器`` ），与中靶着色器类型，随靶着色器在检测到发生相交时调用，随靶着色器不同的是只要相交发生在 ``[tmin, tmax]`` 之间而不是最近的一次命中。随靶着色器用于过滤相交和透明度测试。

VK_KHR_ray_query
##############################

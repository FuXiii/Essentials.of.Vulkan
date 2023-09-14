着色器绑定表
===========================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/14 增加该扩展文档
    * 2023/9/14 增加 ``光追管线和着色器组结构`` 章节
    * 2023/9/14 增加 ``VkRayTracingShaderGroupCreateInfoKHR`` 章节
    * 2023/9/14 增加 ``一个简单的着色器绑定表示意图`` 章节

`文献源`_

.. _文献源: https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap40.html#shader-binding-table

光追管线和着色器组结构
#####################################

.. figure:: ../../_static/vkRayTracingShaderGroupCreateInfo.svg

    光追管线和着色器组结构示意图


VkRayTracingShaderGroupCreateInfoKHR
********************************************

`VkRayTracingShaderGroupCreateInfoKHR <./VK_KHR_ray_tracing_pipeline.html#vkraytracingshadergroupcreateinfokhr>`_

一个简单的着色器绑定表示意图
#####################################

.. figure:: ../../_static/sbt_struct_sample.svg

    一个简单的着色器绑定表示意图

在创建光线追踪管线时需要通过指定 ``VkRayTracingShaderGroupCreateInfoKHR`` 来设置该管线中的一些类着色器组。在光追光线创建时，驱动会根据用户 ``const VkRayTracingShaderGroupCreateInfoKHR* VkRayTracingPipelineCreateInfoKHR::pGroups`` 指定的着色器组创建相应着色器组句柄。在光追管线构建成功后，既可以
通过 ``vkGetRayTracingShaderGroupHandlesKHR`` 获取相应的着色器组句柄（示意图中的 ``Handle``）。

``Handle`` 是一个类型为 ``uint8_t`` 的数组，实际上就是一段连续的内存，用于存储着色器组对应的句柄。该数组就是通过 ``vkGetRayTracingShaderGroupHandlesKHR`` 获取得到的相应着色器句柄数据。
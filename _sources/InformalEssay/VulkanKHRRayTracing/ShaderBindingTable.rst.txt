着色器绑定表
===========================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/14 增加该扩展文档
    * 2023/9/14 增加 ``光追管线和着色器组结构`` 章节
    * 2023/9/14 增加 ``VkRayTracingShaderGroupCreateInfoKHR`` 章节
    * 2023/9/14 增加 ``一个简单的着色器绑定表示意图`` 章节
    * 2023/9/14 增加 ``着色器绑定表的分类`` 章节
    * 2023/9/14 增加 ``光线生成着色器组`` 章节
    * 2023/9/14 增加 ``命中组`` 章节
    * 2023/9/14 增加 ``未命中组`` 章节
    * 2023/9/14 增加 ``着色器绑定表的拷贝`` 章节
    * 2023/9/14 增加 ``着色器绑定表`` 章节

`文献源`_

.. _文献源: https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap40.html#shader-binding-table

着色器绑定表
#####################################

* 着色器绑定表是一种用于将光追管线和加速结构联系起来的一种资源。
* 其指定了加速结构中每一个几何上要操作的着色器。
* 此外还包含每一个着色器要访问的资源，包括纹理索引，缓存地址和常量。
* 应用通过 ``VkBuffer`` 来分配和管理着色绑定表。
* 着色器绑定表作为光追管线的 ``vkCmdTraceRaysNV`` ， ``vkCmdTraceRaysKHR`` 或者 ``vkCmdTraceRaysIndirectKHR`` 光追调度指令的参数使用

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

在创建光线追踪管线时需要通过指定 ``VkRayTracingShaderGroupCreateInfoKHR`` 来设置该管线中的一些着色器组。在光追光线创建时，驱动会根据用户 ``const VkRayTracingShaderGroupCreateInfoKHR* VkRayTracingPipelineCreateInfoKHR::pGroups`` 指定的着色器组创建相应着色器组句柄。在光追管线构建成功后，既可以
通过 ``vkGetRayTracingShaderGroupHandlesKHR`` 获取相应的着色器组句柄（示意图中的 ``Handle``）。

``Handle`` 是一个类型为 ``uint8_t`` 的数组，实际上就是一段连续的内存，用于存储着色器组对应的句柄。该数组就是通过 ``vkGetRayTracingShaderGroupHandlesKHR`` 获取得到的相应着色器句柄数据。

之后就需要创建一个 ``Buffer`` 缓存（上图的 ``Group``）用于存放（ ``Handle`` 拷贝到 ``Buffer`` 中）这些着色器组句柄，该 ``Buffer`` 就是传说中的着色器绑定表。

着色器绑定表的分类
#####################################

着色器绑定表分为三种：

光线生成着色器组
********************************************

光线生成着色器组只能由一个光线生成着色器组成。

命中组
********************************************

未命中组
********************************************

着色器绑定表的拷贝
#####################################

在将 ``Handle`` 拷贝到 ``Buffer`` 中时需要满足如下条件：

* :bdg-secondary:`VkPhysicalDeviceRayTracingPipelinePropertiesKHR::shaderGroupHandleSize` 单个着色器组句柄的大小。
* :bdg-secondary:`VkPhysicalDeviceRayTracingPipelinePropertiesKHR::shaderGroupHandleAlignment` 单个着色器组句柄的对齐大小。
* :bdg-secondary:`VkPhysicalDeviceRayTracingPipelinePropertiesKHR::shaderGroupBaseAlignment` 不同着色器组句柄的对齐大小。

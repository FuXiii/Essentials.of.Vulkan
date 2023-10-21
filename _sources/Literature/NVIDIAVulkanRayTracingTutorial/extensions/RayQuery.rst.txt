光线查询
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/10/21 增加该扩展文档
    * 2023/10/21 增加 ``教程`` 章节
    * 2023/10/21 增加 ``清除`` 章节
    * 2023/10/21 增加 ``hello_vulkan (头文件)`` 章节
    * 2023/10/21 增加 ``hello_vulkan (源文件)`` 章节
    * 2023/10/21 增加 ``着色器`` 章节
    * 2023/10/21 增加 ``片元着色器相关配置`` 章节
    * 2023/10/21 增加 ``片元着色器`` 章节

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_rayquery

.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html


.. figure:: ../../../_static/rayquery.png

    光线查询结果示意图

教程
####################

该教程为 ``Vulkan`` `光线追踪教程`_ 的扩展。

该教程将使用 `GLSL_EXT_ray_query <https://github.com/KhronosGroup/GLSL/blob/master/extensions/ext/GLSL_EXT_ray_query.txt>`_ 扩展。该扩展运行在任意一个着色器中进行光线相交查询。在本示例中我们将通过在片元着色器中进行查询投射到阴影中的那一部分光线来生成阴影。

与其他添加新内容代码的示例不同，这次我们要删减代码。本例中不再需要着色器绑定表和光追管线，而加速结构是唯一需要留下的资源。

我们将从 `光线追踪教程`_ 开始移除所有与光线追踪相关的代码，除了将底层加速结构和顶层加速结构进行保留。

清除
####################

首先清除所有不需要的代码。

hello_vulkan (头文件)
************************

仅留下加速结构相关代码，其他没有用的都去掉：

.. code:: c++

    // #VKRay
    void initRayTracing();
    auto objectToVkGeometryKHR(const ObjModel& model);
    void createBottomLevelAS();
    void createTopLevelAS();

    VkPhysicalDeviceRayTracingPipelinePropertiesKHR m_rtProperties{VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_RAY_TRACING_PIPELINE_PROPERTIES_KHR};
    nvvk::RaytracingBuilderKHR                      m_rtBuilder;

hello_vulkan (源文件)
************************

对于源文件，移除之前相关的所有代码。

着色器
************************

您可以直接移除所有名为 ``raytrace.*`` 的着色器。

片元着色器相关配置
####################

在 ``HelloVulkan::createDescriptorSetLayout`` 中增加在加速结构描述符中增加片元着色器的访问配置。

.. code:: c++

  // 顶层加速结构
  m_descSetLayoutBind.addBinding(eTlas, VK_DESCRIPTOR_TYPE_ACCELERATION_STRUCTURE_KHR, 1, VK_SHADER_STAGE_FRAGMENT_BIT);

由于目前只有一个描述符集，将 ``eTlas`` 的值设置为 ``3`` ，设置如下：

.. code:: c++

    eGlobals  = 0,  // 包含相机矩阵的全局统一符
    eObjDescs = 1,  // 访问物体的描述
    eTextures = 2,  // 访问纹理
    eTlas     = 3   // 顶层加速结构

在 ``HelloVulkan::updateDescriptorSet`` 将对应的描述符写入描述符集：

.. code:: c++

    VkAccelerationStructureKHR                   tlas = m_rtBuilder.getAccelerationStructure();
    VkWriteDescriptorSetAccelerationStructureKHR descASInfo{VK_STRUCTURE_TYPE_WRITE_DESCRIPTOR_SET_ACCELERATION_STRUCTURE_KHR};
    descASInfo.accelerationStructureCount = 1;
    descASInfo.pAccelerationStructures    = &tlas;
    writes.emplace_back(m_descSetLayoutBind.makeWrite(m_descSet, eTlas, &descASInfo));

片元着色器
************************

最后需要修改片元着色器，我们将增加光线与加速结构的相交查询用于追踪生成阴影的光线。

首先。着色器的版本需要升级到 ``460`` ：

.. code:: glsl

    #version 460

之后添加新的扩展：

.. code:: glsl

    #extension GL_EXT_ray_tracing : enable
    #extension GL_EXT_ray_query : enable

我们增加描述符布局（ ``layout`` ）来访问顶层加速结构：

.. code:: glsl

    layout(binding = eTlas) uniform accelerationStructureEXT topLevelAS;

在着色器的结尾处增加如下代码，发起光线查询。目前我们仅仅关注与是否发生了相交，我们尽可能保持简单：

.. code:: glsl

    // 阴影的光线查询
    vec3  origin    = i_worldPos;
    vec3  direction = L;  // vector to light
    float tMin      = 0.01f;
    float tMax      = lightDistance;

    // 初始化一个光线查询对象，目前并不发起光线遍历
    rayQueryEXT rayQuery;
    rayQueryInitializeEXT(rayQuery, topLevelAS, gl_RayFlagsTerminateOnFirstHitEXT, 0xFF, origin, tMin, direction, tMax);

    // 发起光线遍历: 如果遍历结束返回 false
    while(rayQueryProceedEXT(rayQuery))
    {
    }

    // 如果放生了相交，返回相交的类型
    if(rayQueryGetIntersectionTypeEXT(rayQuery, true) != gl_RayQueryCommittedIntersectionNoneEXT)
    {
      // 发生了相交 == 阴影
      o_color *= 0.1;
    }


多重最近命中着色器
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/12 增加该扩展文档
    * 2023/9/12 增加 ``教程`` 章节
    * 2023/9/12 增加 ``布置场景`` 章节
    * 2023/9/12 增加 ``增加一个新的最近命中着色器`` 章节
    * 2023/9/12 增加 ``raytrace2.rchit`` 章节
    * 2023/9/12 增加 ``createRtPipeline`` 章节
    * 2023/9/12 增加 ``raytrace.rgen`` 章节
    * 2023/9/12 增加 ``hello_vulkan.h`` 章节
    * 2023/9/12 增加 ``hello_vulkan.cpp`` 章节
    * 2023/9/12 增加 ``选择命中着色器`` 章节

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_manyhits

.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html

.. figure:: ../../../_static/manyhits.png

    多重最近命中着色器结果示意图

教程
####################

该教程为 ``Vulkan`` `光线追踪教程`_ 的扩展。

在 `光线追踪教程`_ 中只使用了一个最近命中着色器，但其实是可以使用多个的。比如，对于不同模型使用不同的着色器，或者当计算反射时使用一个相对简单的着色器进行计算。

布置场景
####################

对于本示例，我们将会加载 ``wuson`` 模型并变换创建其另一个实体。

将 ``helloVk.loadModel`` 调用修改如下：

.. code:: c++

    // loadModel(...) 函数内部会自动增加一个 Wuson 的实体
    helloVk.loadModel(nvh::findFile("media/scenes/wuson.obj", defaultSearchPaths, true),
                      nvmath::translation_mat4(nvmath::vec3f(-1, 0, 0)));// 位置变换为 (-1,0,0)

    helloVk.m_instances.push_back({nvmath::translation_mat4(nvmath::vec3f(1, 0, 0)), 0}); // 再增加一个 Wuson 的实体，位置变换为 (1,0,0)

    helloVk.loadModel(nvh::findFile("media/scenes/plane.obj", defaultSearchPaths, true));

增加一个新的最近命中着色器
###########################

我们需要创建一个新的最近命中着色器，并将其加入到光追管线中，并指示哪个实体将使用此着色器。

raytrace2.rchit
********************

我们创建一个非常简单的着色器用于与之前的最近命中着色器进行区别。比如，创建一个 ``raytrace2.rchit`` 文件，并将其加入到 ``Visual Studio`` 的 ``shaders`` 文件夹下。

.. code:: glsl

    #version 460
    #extension GL_EXT_ray_tracing : require
    #extension GL_GOOGLE_include_directive : enable

    #include "raycommon.glsl"

    layout(location = 0) rayPayloadInEXT hitPayload prd;

    void main()
    {
      prd.hitValue = vec3(1,0,0);
    }

createRtPipeline
********************

我们需要将新的着色器加入到光追管线中。所以，在 ``hello_vulkan.cpp`` 的 ``createRtPipeline`` 中，在加载完第一个最近命中着色器之后加载新创建的最近命中着色器。

.. code:: c++

    enum StageIndices
    {
      eRaygen,
      eMiss,
      eMiss2,
      eClosestHit,
      eClosestHit2,
      eShaderGroupCount
    };

    // ...

    stage.module = nvvk::createShaderModule(m_device, nvh::loadFile("spv/raytrace2.rchit.spv", true, defaultSearchPaths, true));
    stage.stage         = VK_SHADER_STAGE_CLOSEST_HIT_BIT_KHR;
    stages[eClosestHit2] = stage;

在增加了第一个命中组之后增加一个新的命中组：

.. code:: c++

    // Hit 2
    group.type             = VK_RAY_TRACING_SHADER_GROUP_TYPE_TRIANGLES_HIT_GROUP_KHR;
    group.generalShader    = VK_SHADER_UNUSED_KHR;
    group.closestHitShader = eClosestHit2;
    m_rtShaderGroups.push_back(group);

raytrace.rgen
********************

为了测试，可以尝试改变 ``raytrace.rgen`` 中 ``traceRayEXT`` 函数调用的 ``sbtRecordOffset`` 参数。如果将其偏移值设置为 ``1`` ，则所有的光线命中将会使用新的最近命中着色器，可能的光追结果如下：

.. figure:: ../../../_static/manyhits2.png

    新的最近命中着色器光追结果示意图

.. admonition:: 注意
    :class: caution

    测试结束后，确保将 ``raytrace.rgen`` 的修改恢复之后再进行之后的章节修改。

hello_vulkan.h
********************

在 ``ObjInstance`` 结构体中，我们将增加一个新的 ``hitgroup`` 成员变量，用于声明该实体使用的是哪一个命中着色器：

.. code:: c++

    struct ObjInstance
    {
      nvmath::mat4f transform;    // 实体的变换矩阵
      uint32_t      objIndex{0};  // 模型索引
      int           hitgroup{0};  // 实体的命中组
    };

hello_vulkan.cpp
********************

最后我们需要告诉顶层加速结构每一个实体要使用的命中组。在 ``hello_vulkan.cpp`` 中的 ``createTopLevelAS()`` 函数中，我们将会记录着色器绑定表中的命中组偏移。

.. code:: c++

    rayInst.instanceShaderBindingTableRecordOffset = inst.hitgroup;  // Using the hit group set in main

选择命中着色器
********************

回到 ``main.cpp`` ，在加载场景模型之后，我们现在可以将两个 ``wuson`` 模型都使用新的最近命中着色器，通过如下代码：

.. code:: c++

    helloVk.m_instances[0].hitgroup = 1;
    helloVk.m_instances[1].hitgroup = 1;

.. figure:: ../../../_static/manyhits3.png

    两个 ``wuson`` 都使用新的最近命中着色器光追结果示意图


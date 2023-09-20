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
    * 2023/9/13 增加 ``着色器记录数据`` 章节
    * 2023/9/13 增加 ``hello_vulkan.h`` 章节
    * 2023/9/13 增加 ``raytrace2.rchit`` 章节
    * 2023/9/13 增加 ``main.cpp`` 章节
    * 2023/9/13 增加 ``HelloVulkan::createRtShaderBindingTable`` 章节
    * 2023/9/13 增加 ``光线追踪`` 章节
    * 2023/9/13 增加 ``命中延伸`` 章节
    * 2023/9/13 增加 ``main.cpp`` 章节
    * 2023/9/13 增加 ``createRtShaderBindingTable`` 章节
    * 2023/9/20 提供 ``Turbo`` 实现开源示例

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_manyhits

.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html

.. admonition:: Turbo 引擎中对该教程的实现示例
    :class: note

    ``Turbo`` 引擎对该教程进行了实现，具体如下：

    * `VulkanKHRRayTracingTestForMultiClosestHits <https://github.com/FuXiii/Turbo/blob/dev/samples/VulkanKHRRayTracingTestForMultiClosestHits.cpp>`_ ：在 `实例化 <../extensions/Instances.html>`_ 基础上实现。 `示例视频 <https://www.bilibili.com/video/BV1Hh4y1a7zH/?vd_source=df46bdc268062b383081e71f702cbc1d>`_

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

    rayInst.instanceShaderBindingTableRecordOffset = inst.hitgroup;  // 使用在 main 中设置的命中组

选择命中着色器
********************

回到 ``main.cpp`` ，在加载场景模型之后，我们现在可以将两个 ``wuson`` 模型都使用新的最近命中着色器，通过如下代码：

.. code:: c++

    helloVk.m_instances[0].hitgroup = 1;
    helloVk.m_instances[1].hitgroup = 1;

.. figure:: ../../../_static/manyhits3.png

    两个 ``wuson`` 都使用新的最近命中着色器光追结果示意图

着色器记录数据 ``shaderRecordKHR``
##################################

之前，当创建着色器绑定表时，该表中的每一个条目都对应着要调用的那个着色器。我们已将所有的数据按照 ``shaderGroupHandleSize`` 大小进行了打包，其实每一个条目可以占有更多内存大小，用于存储数据并在着色器中的 ``shaderRecordKHR`` 块中进行引用。

该特性可以将着色器绑定表中的每一个条目向着色器中传递额外信息。

.. admonition:: 注意
    :class: caution

    着色器绑定表中的每组中的每个条目必须有相同的大小，组中的每一个条目必须有足够的空间来容纳整个组中最大的那个元素。

下图展示了我们当前的着色器绑定表内部结构，并在 ``HitGroup1`` 中增加了一些数据。就像 :bdg-warning:`注意` 中说的那样，即使 ``HitGroup0`` 没有着色器记录数据，它还是需要与最大的命中组 ``HitGroup1`` 保持相同的大小，并与句柄对齐大小进行对齐。

.. figure:: ../../../_static/manyhits_sbt_0.png

    当前着色器绑定表结构示意图

hello_vulkan.h
##################################

在 ``HelloVulkan`` 类中，我们将会增加一个用于承接命中组数据的结构体。

.. code:: c++

    struct HitRecordBuffer
    {
        nvmath::vec4f color;
    };
    std::vector<HitRecordBuffer> m_hitShaderRecord;

raytrace2.rchit
********************

在最近命中着色器中，我们可以使用 ``layout(shaderRecordEXT)`` 描述符获取着色器记录。

.. code:: glsl

    layout(shaderRecordEXT) buffer sr_ { vec4 shaderRec; };

并使用该信息返回颜色信息：

.. code:: glsl

    void main()
    {
        prd.hitValue = shaderRec.rgb;
    }

.. admonition:: 注意
    :class: caution

    增加一个新着色器需要回到 ``CMake`` 中增加到相应的工程的编译系统中。

main.cpp
********************

在 ``main`` 中，在我们实体使用的哪一个命中组之后，我们可以增加对着色器记录的数据设置。

.. code:: c++

    helloVk.m_hitShaderRecord.resize(1);
    helloVk.m_hitShaderRecord[0].color = nvmath::vec4f(1, 1, 0, 0);  // 黄色

HelloVulkan::createRtShaderBindingTable
******************************************

.. tab-set::

    .. tab-item:: 新

        着色器绑定表的创建是通过使用硬编码偏移来创建的，这会潜在的导致错误。取而代之的是使用新代码 ``nvvk::SBTWraper`` （着色器绑定表包装器），使用光追管线和 ``VkRayTracingPipelineCreateInfoKHR`` 来创建着色器绑定表信息。

        该包装器将会寻找每一个组中的句柄并将 ``m_hitShaderRecord`` 数据添加到每个命中组中。

        .. code:: c++

            // 寻找句柄索引并添加数据
            m_sbtWrapper.addIndices(rayPipelineInfo);
            m_sbtWrapper.addData(SBTWrapper::eHit, 1, m_hitShaderRecord[0]);
            m_sbtWrapper.create(m_rtPipeline);

        该包装器将会确保内部跨度足够承载最大的数据大小并按照 ``GPU`` 的属性进行基准对齐。

    .. tab-item:: 老

        由于我们不再将所有的句柄都压入一个连续缓存中，我们需要按照之前的描述填充着色器绑定表。

        .. code:: c++

            m_hitRegion.stride  = nvh::align_up(handleSize + sizeof(HitRecordBuffer), m_rtProperties.shaderGroupHandleAlignment);

        之后新的着色器绑定表写入如下，只有 ``Hit 1`` 有额外的数据：

        .. code:: c++

            // Hit
            pData = pSBTBuffer + m_rgenRegion.size + m_missRegion.size;
            memcpy(pData, getHandle(handleIdx++), handleSize);

            // hit 1
            pData = pSBTBuffer + m_rgenRegion.size + m_missRegion.size + m_hitRegion.stride;
            memcpy(pData, getHandle(handleIdx++), handleSize);
            pData += handleSize;
            memcpy(pData, &m_hitShaderRecord[0], sizeof(HitRecordBuffer));  // Hit 1 数据

光线追踪
##################################

现在的追踪结果应该为两个黄颜色的 ``wuson`` 模型。

.. figure:: ../../../_static/manyhits4.png

    光追渲染结果示意图

命中延伸
##################################

着色器绑定表可以大于着色器的数量，这可以在每一个实体都有一个着色器并携带自己的数据。对于某些应用程序，相较于 `光线追踪教程`_ 中使用一个存储缓存 （ ``storage buffer`` ）中存储材质信息，并在着色器中使用 ``gl_InstanceCustomIndexEXT`` 获取材质数据这种方式，现在可以将这些数据全部放到着色器绑定表中。

接下来的修改将会在着色器绑定表中增加另一个带有不同颜色的条目。新的命中组 ``Hit 2`` 将会使用与命中组 ``Hit 1`` 相同的命中句柄。

.. figure:: ../../../_static/manyhits_sbt_1.png

    新增命中组 ``Hit 2`` 示意图

main.cpp
************

在 ``main`` 中的场景描述中，我们将会设置两个使用 ``wuson`` 模型的实体分别使用命中组 ``1`` 和 ``2`` ，并且有不同的颜色。

.. code:: c++

    // 命中着色器数据设置
    helloVk.m_hitShaderRecord.resize(2);
    helloVk.m_hitShaderRecord[0].color = nvmath::vec4f(0, 1, 0, 0);  // 绿色
    helloVk.m_hitShaderRecord[1].color = nvmath::vec4f(0, 1, 1, 0);  // 青蓝色
    helloVk.m_instances[0].hitgroup    = 1;                          // wuson 0
    helloVk.m_instances[1].hitgroup    = 2;                          // wuson 1

createRtShaderBindingTable
****************************

.. tab-set::

    .. tab-item:: 新

        如果使用 ``nvvk::SBTWraper`` 的话，确保数据添加到第三个也就是 ``Hit 2`` 中。

        .. code:: c++

            // 寻找句柄索引并添加数据
            m_sbtWrapper.addIndices(rayPipelineInfo);
            m_sbtWrapper.addData(nvvk::SBTWrapper::eHit, 1, m_hitShaderRecord[0]);
            m_sbtWrapper.addData(nvvk::SBTWrapper::eHit, 2, m_hitShaderRecord[1]);
            m_sbtWrapper.create(m_rtPipeline);

    .. tab-item:: 老

        .. code:: c++

            // hit 2
            pData = pSBTBuffer + m_rgenRegion.size + m_missRegion.size + (2 * m_hitRegion.stride);
            memcpy(pData, getHandle(handleIdx++), handleSize);
            pData += handleSize;
            memcpy(pData, &m_hitShaderRecord[1], sizeof(HitRecordBuffer));  // Hit 2 data

        .. admonition:: 注意
            :class: caution

            像这样添加条目可能容易出错，而且对于一个像样的场景大小来说这也不方便。推荐使用 ``nvvk::SBTWraper`` 自动存储句柄，数据和着色器绑定表中的每一个组。
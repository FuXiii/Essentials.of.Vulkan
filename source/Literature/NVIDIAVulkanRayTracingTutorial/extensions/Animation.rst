动态更新
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/20 增加该扩展文档
    * 2023/9/20 增加 ``教程`` 章节
    * 2023/9/20 增加 ``更新变换矩阵`` 章节
    * 2023/9/20 增加 ``创建一个场景`` 章节
    * 2023/9/20 增加 ``更新函数`` 章节
    * 2023/9/20 增加 ``循环更新函数`` 章节
    * 2023/9/20 增加 ``nvvk::RaytracingBuilder::buildTlas （实现）`` 章节

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_animation

.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html

.. figure:: ../../../_static/animation2.gif

    动态更新结果示意图

教程
####################

该教程为 ``Vulkan`` `光线追踪教程`_ 的扩展。

我们将会实现两种更新方式：

1. 变换矩阵
2. 几何体

更新变换矩阵
####################

定一个示例是通过更新顶层加速结构中实体对应的变换矩阵进行的动态更新。

创建一个场景
********************

在 ``main.cpp`` 中替换掉之前的通过 ``main()`` 中 ``helloVk.loadModel`` 的函数调用，这次我们使用一个地板和使用 ``Wuson`` 模型组成的 ``21`` 个实体组成的场景。如下代码是在同一位置创建所有的实体，我们将会在之后的更新函数中更新这些数据。如果此时运行示例，你会发现现在渲染的非常慢，这是因为所有的几何体都叠在了一起并且加速结构不能很好的处理此种情况。

.. code:: c++

    helloVk.loadModel(nvh::findFile("media/scenes/plane.obj", defaultSearchPaths),
                      nvmath::scale_mat4(nvmath::vec3f(2.f, 1.f, 2.f)));
    helloVk.loadModel(nvh::findFile("media/scenes/wuson.obj", defaultSearchPaths));
    uint32_t      wusonId = 1;
    nvmath::mat4f identity{1};
    for(int i = 0; i < 20; i++)
      helloVk.m_instances.push_back({identity, wusonId});

更新函数
********************

我们现在想让这些 ``Wuson`` 模型绕着圈转，我们首先使用光栅化进行更新渲染，此示例将会在 ``CPU`` 端进行变换更新，之后再将变换结果拷贝至 ``GPU`` 。而下一个示例中，我们将在 ``GPU`` 上使用计算着色器进行更新。

在 ``HelloVulkan`` 类中声明更新函数。

.. code:: c++

    void animationInstances(float time);

首先计算所有的 ``Wuson`` 模型位置，并一个接着一个的拍成一列。

.. code:: c++

    void HelloVulkan::animationInstances(float time)
    {
      const int32_t nbWuson     = static_cast<int32_t>(m_instances.size() - 1);
      const float   deltaAngle  = 6.28318530718f / static_cast<float>(nbWuson);
      const float   wusonLength = 3.f;
      const float   radius      = wusonLength / (2.f * sin(deltaAngle / 2.0f));
      const float   offset      = time * 0.5f;

      for(int i = 0; i < nbWuson; i++)
      {
        int          wusonIdx = i + 1;
        auto& transform = m_instances[wusonIdx].transform;
        transform        = nvmath::rotation_mat4_y(i * deltaAngle + offset)
                         * nvmath::translation_mat4(radius, 0.f, 0.f);
      }

循环更新函数
********************

在 ``main()`` 中，在进入主循环之前增加一个用于记录开始时间的变量，该变量将会被更新函数使用。

.. code:: c++

    auto start = std::chrono::system_clock::now();

在 ``while`` 循环中， ``appBase.prepareFrame()`` 之前，调用此更新函数。

.. code:: c++

    std::chrono::duration<float> diff = std::chrono::system_clock::now() - start;
    helloVk.animationInstances(diff.count());

如果此时执行该应用，这些 ``Wuson`` 模型将会做圆周运动，并被光栅化（管线）渲染出来。但是此时光追（管线）没有做任何变化，所有的模型还在原位叠在一起一动不动。我们需要更新顶层加速结构使其各实体位置发生变化。

更新顶层加速结构
####################

由于我们要更新顶层加速结构中的变换矩阵，我们需要保存在创建时的对象信息，这样才能知道顶层加速结构中都有哪些实体。

首先，将 ``HelloVulkan::createTopLevelAS()`` 中的 ``nvvk::RaytracingBuilder::Instance`` 数组转移至 ``HelloVulkan`` 类中：

.. code:: c++

    std::vector<nvvk::RaytracingBuilder::Instance> m_tlas;

确保将 ``tlas`` 重命名为 ``m_tlas`` 。

一个要点就是，为了能对顶层加速结构进行更新，我们需要设置构建标志位（ ``VkAccelerationStructureInstanceKHR::flags`` ） 为 ``VK_BUILD_ACCELERATION_STRUCTURE_ALLOW_UPDATE_BIT_KHR`` 来达到更新的目的。这是 :bdg-danger:`必须` 的，否则顶层加速结构将不会有任何变化。

.. code:: c++

    void HelloVulkan::createTopLevelAS()
    {
      m_tlas.reserve(m_instances.size());
      for(const HelloVulkan::ObjInstance& inst : m_instances)
      {
        VkAccelerationStructureInstanceKHR rayInst{};
        rayInst.transform                      = nvvk::toTransformMatrixKHR(inst.transform);  // 实体的变换矩阵（位置修改）
        rayInst.instanceCustomIndex            = inst.objIndex;                               // gl_InstanceCustomIndexEXT
        rayInst.accelerationStructureReference = m_rtBuilder.getBlasDeviceAddress(inst.objIndex);
        rayInst.flags                          = VK_GEOMETRY_INSTANCE_TRIANGLE_FACING_CULL_DISABLE_BIT_KHR;
        rayInst.mask                           = 0xFF;       //  如果 rayMask & instance.mask != 0 表示光线命中
        rayInst.instanceShaderBindingTableRecordOffset = 0;  // 对于所有的物体使用相同的命中组
        m_tlas.emplace_back(rayInst);
      }

      m_rtFlags = VK_BUILD_ACCELERATION_STRUCTURE_PREFER_FAST_TRACE_BIT_KHR | VK_BUILD_ACCELERATION_STRUCTURE_ALLOW_UPDATE_BIT_KHR;
      m_rtBuilder.buildTlas(m_tlas, m_rtFlags);
    }

回到 ``HelloVulkan::animationInstances()`` ，我们需要通过调用 ``buildTlas`` 函数，并将 ``update`` 参数设置为 ``true`` 来更新顶层加速结构。

.. code:: c++

    m_rtBuilder.buildTlas(m_tlas, m_rtFlags, true);

.. figure:: ../../../_static/animation1.gif

nvvk::RaytracingBuilder::buildTlas （实现）
**********************************************

为了方便这里我们使用了 ``nvvk::RaytracingBuilder`` 来更新变换矩阵。对于加速结构的更新和构建，两者之间只有很小的区别。最主要的区别为：

* ``VkAccelerationStructureBuildGeometryInfoKHR`` 将会设置成 ``VK_BUILD_ACCELERATION_STRUCTURE_MODE_UPDATE_KHR`` 更新模式。
* 并不会重新创建一个加速结构，而是反复使用相同的加速结构。
* 更新的目标和更新的数据来源 ``VkAccelerationStructureCreateInfoKHR`` 都是使用之前创建的同一个加速结构。

更新只会去更新包含所有变换矩阵的那个缓存，并且 ``vkCmdBuildAccelerationStructuresKHR`` 将会根据缓存进行相应的更新。
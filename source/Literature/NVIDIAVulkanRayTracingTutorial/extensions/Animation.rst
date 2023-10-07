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
    * 2023/9/22 增加 ``更新底层加速结构`` 章节
    * 2023/9/22 增加 ``增加一个球体`` 章节
    * 2023/9/22 增加 ``计算着色器`` 章节
    * 2023/9/22 增加 ``anim.comp`` 章节
    * 2023/9/22 增加 ``更新物体`` 章节
    * 2023/9/22 增加 ``执行更新`` 章节
    * 2023/9/22 增加 ``底层加速结构的更新`` 章节
    * 2023/10/7 提供 ``Turbo`` 实现开源示例

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_animation

.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html

.. admonition:: Turbo 引擎中对该教程的实现示例
    :class: note

    ``Turbo`` 引擎对该教程进行了实现，具体如下：

    * `VulkanKHRRayTracingTestForAnimationTLAS <https://github.com/FuXiii/Turbo/blob/master/samples/VulkanKHRRayTracingTestForAnimationTLAS.cpp>`_ ：在 `多重最近命中着色器 <./MultipleClosestHitShaders.html>`_ 基础上增加对于顶层加速结构的更新。 `示例视频 <https://www.bilibili.com/video/BV1ez4y137ct/?spm_id_from=333.999.0.0&vd_source=df46bdc268062b383081e71f702cbc1d>`_
    * `VulkanKHRRayTracingTestForAnimationBLAS <https://github.com/FuXiii/Turbo/blob/master/samples/VulkanKHRRayTracingTestForAnimationBLAS.cpp>`_ ：在 `多重最近命中着色器 <./MultipleClosestHitShaders.html>`_ 基础上增加对于底层加速结构的更新。 `示例视频 <https://www.bilibili.com/video/BV1nH4y1U7fL/?spm_id_from=333.999.0.0&vd_source=df46bdc268062b383081e71f702cbc1d>`_

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

更新底层加速结构
####################

在之前的章节中，我们更新的变换矩阵。这次我们将会在计算着色器中修改顶点数据。

增加一个球体
**********************************************

本章节，我们将会更新一个球体的顶点。在 ``main.cpp`` 中设置场景如下：

.. code:: c++

    helloVk.loadModel(nvh::findFile("media/scenes/plane.obj", defaultSearchPaths, true),
                      nvmath::scale_mat4(nvmath::vec3f(2.f, 1.f, 2.f)));
    helloVk.loadModel(nvh::findFile("media/scenes/wuson.obj", defaultSearchPaths, true));
    uint32_t      wusonId = 1;
    nvmath::mat4f identity{1};
    for(int i = 0; i < 5; i++)
    {
      helloVk.m_instances.push_back({identity, wusonId});
    }
    helloVk.loadModel(nvh::findFile("media/scenes/sphere.obj", defaultSearchPaths, true));//增加一个球体

由于我们现在增加了一个新模型（内部会增加一个实体），所以需要修正 ``HelloVulkan::animationInstances()`` 中对于 ``Wuson`` 模型实体数量的计算。

.. code:: c++

    const int32_t nbWuson     = static_cast<int32_t>(m_instances.size() - 2); // 刨除（地）平面和球体

计算着色器
**********************************************

我们使用计算着色器来为模型的顶点做更新。

将如下的所有申明加入 ``HelloVulkan`` 类中成为其成员：

.. code:: c++

    void createCompDescriptors();
    void updateCompDescriptors(nvvkBuffer& vertex);
    void createCompPipelines();

    nvvk::DescriptorSetBindings m_compDescSetLayoutBind;
    VkDescriptorPool            m_compDescPool;
    VkDescriptorSetLayout       m_compDescSetLayout;
    VkDescriptorSet             m_compDescSet;
    VkPipeline                  m_compPipeline;
    VkPipelineLayout            m_compPipelineLayout;

计算着色器将会在一个 ``VertexObj`` 缓存上执行。

.. code:: c++

    void HelloVulkan::createCompDescriptors()
    {
      m_compDescSetLayoutBind.addBinding(0, VK_DESCRIPTOR_TYPE_STORAGE_BUFFER, 1, VK_SHADER_STAGE_COMPUTE_BIT);

      m_compDescSetLayout = m_compDescSetLayoutBind.createLayout(m_device);
      m_compDescPool      = m_compDescSetLayoutBind.createPool(m_device, 1);
      m_compDescSet       = nvvk::allocateDescriptorSet(m_device, m_compDescPool, m_compDescSetLayout);
    }

``updateCompDescriptors`` 将会设置一系列的描述符，用于将 ``VertexObj`` 对象与着色器进行关联。

.. code:: c++

    void HelloVulkan::updateCompDescriptors(nvvk::Buffer& vertex)
    {
      std::vector<VkWriteDescriptorSet> writes;
      VkDescriptorBufferInfo            dbiUnif{vertex.buffer, 0, VK_WHOLE_SIZE};
      writes.emplace_back(m_compDescSetLayoutBind.makeWrite(m_compDescSet, 0, &dbiUnif));
      vkUpdateDescriptorSets(m_device, static_cast<uint32_t>(writes.size()), writes.data(), 0, nullptr);
    }

该计算管线由一个计算着色器和一个推送常量（ ``push constant`` ）构成，这将用于之后的顶点更新。

.. code:: c++

    void HelloVulkan::createCompPipelines()
    {
      VkPushConstantRange push_constants = {VK_SHADER_STAGE_COMPUTE_BIT, 0, sizeof(float)};

      VkPipelineLayoutCreateInfo createInfo{VK_STRUCTURE_TYPE_PIPELINE_LAYOUT_CREATE_INFO};
      createInfo.setLayoutCount         = 1;
      createInfo.pSetLayouts            = &m_compDescSetLayout;
      createInfo.pushConstantRangeCount = 1;
      createInfo.pPushConstantRanges    = &push_constants;
      vkCreatePipelineLayout(m_device, &createInfo, nullptr, &m_compPipelineLayout);


      VkComputePipelineCreateInfo computePipelineCreateInfo{VK_STRUCTURE_TYPE_COMPUTE_PIPELINE_CREATE_INFO};
      computePipelineCreateInfo.layout = m_compPipelineLayout;

      computePipelineCreateInfo.stage =
          nvvk::createShaderStageInfo(m_device, nvh::loadFile("spv/anim.comp.spv", true, defaultSearchPaths, true),
                                      VK_SHADER_STAGE_COMPUTE_BIT);

      vkCreateComputePipelines(m_device, {}, 1, &computePipelineCreateInfo, nullptr, &m_compPipeline);

      vkDestroyShaderModule(m_device, computePipelineCreateInfo.stage.module, nullptr);
    }

最后在 ``HelloVulkan::destroyResources()`` 销毁资源并回收：

.. code:: c++

    vkDestroyPipeline(m_device, m_compPipeline, nullptr);
    vkDestroyPipelineLayout(m_device, m_compPipelineLayout, nullptr);
    vkDestroyDescriptorPool(m_device, m_compDescPool, nullptr);
    vkDestroyDescriptorSetLayout(m_device, m_compDescSetLayout, nullptr);

anim.comp
**********************************************

该计算着色器比较简单。我们在解决方案中的 ``shaders`` 中增加一个新着色器文件 ``anim.com`` 。

该着色器将会随时间将每个顶点来回上下移动。

.. code:: glsl

    #version 460
    #extension GL_ARB_separate_shader_objects : enable
    #extension GL_EXT_scalar_block_layout : enable
    #extension GL_GOOGLE_include_directive : enable
    #extension GL_EXT_shader_explicit_arithmetic_types_int64 : require
    #include "wavefront.glsl"

    layout(binding = 0, scalar) buffer Vertices
    {
      Vertex v[];
    }
    vertices;

    layout(push_constant) uniform shaderInformation
    {
      float iTime;
    }
    pushc;

    void main()
    {
      Vertex v0 = vertices.v[gl_GlobalInvocationID.x];

      // 计算顶点位置
      const float PI       = 3.14159265;
      const float signY    = (v0.pos.y >= 0 ? 1 : -1);
      const float radius   = length(v0.pos.xz);
      const float argument = pushc.iTime * 4 + radius * PI;
      const float s        = sin(argument);
      v0.pos.y             = signY * abs(s) * 0.5;

      // 计算法线
      if(radius == 0.0f)
      {
        v0.nrm = vec3(0.0f, signY, 0.0f);
      }
      else
      {
        const float c        = cos(argument);
        const float xzFactor = -PI * s * c;
        const float yFactor  = 2.0f * signY * radius * abs(s);
        v0.nrm               = normalize(vec3(v0.pos.x * xzFactor, yFactor, v0.pos.z * xzFactor));
      }

      vertices.v[gl_GlobalInvocationID.x] = v0;
    }

更新物体
**********************************************

首先在 ``HelloVulkan`` 中增加更新函数的声明：

.. code:: c++

    void animationObject(float time);

更新函数实现仅干两件事：

1. 推送当前时间
2. 调用计算着色器（ ``dispatch`` ）

.. code:: c++

    void HelloVulkan::animationObject(float time)
    {
      const uint32_t sphereId = 2;
      ObjModel&      model    = m_objModel[sphereId];

      updateCompDescriptors(model.vertexBuffer);

      nvvk::CommandPool genCmdBuf(m_device, m_graphicsQueueIndex);
      VkCommandBuffer   cmdBuf = genCmdBuf.createCommandBuffer();

      vkCmdBindPipeline(cmdBuf, VK_PIPELINE_BIND_POINT_COMPUTE, m_compPipeline);
      vkCmdBindDescriptorSets(cmdBuf, VK_PIPELINE_BIND_POINT_COMPUTE, m_compPipelineLayout, 0, 1, &m_compDescSet, 0, nullptr);
      vkCmdPushConstants(cmdBuf, m_compPipelineLayout, VK_SHADER_STAGE_COMPUTE_BIT, 0, sizeof(float), &time);
      vkCmdDispatch(cmdBuf, model.nbVertices, 1, 1);

      genCmdBuf.submitAndWait(cmdBuf);
    }

执行更新
**********************************************

在 ``main.cpp`` 中，在其他资源创建完成之后，添加计算着色器的创建函数。

.. code:: c++

    helloVk.createCompDescriptors();
    helloVk.createCompPipelines();

在渲染循环中，在 ``animationInstances`` 调用之前调用，物体更新函数。

.. code:: c++

    helloVk.animationObject(diff.count());

.. admonition:: 注意
    :class: caution

    当底层加速结构发生了更新，一定不要忘了去更新一下顶层加速结构。目的是确保顶层加速结构中的包围盒是更新后的状态。

.. admonition:: 注意
    :class: caution

    此时，在光栅化渲染下能够看到更新，但是光追渲染中不会发生任何改变（因为还未更新底层加速结构）。

底层加速结构的更新
####################

在 ``raytrace_vkpp.hpp`` 中的 ``nvvk::RaytracingBuilder`` 中，我们可以增加一个函数用于将之前更新的顶点数据更新到底层加速结构中。这与之前更新实体类似，只不过这次没有缓存传输这一说了。

.. code:: c++

    //--------------------------------------------------------------------------------------------------
    // 从更新的缓存中重组底层加速结构的 blasIdx 数量
    //
    void nvvk::RaytracingBuilderKHR::updateBlas(uint32_t blasIdx, BlasInput& blas, VkBuildAccelerationStructureFlagsKHR flags)
    {
      assert(size_t(blasIdx) < m_blas.size());

      // 准备好所有的构建信息，并填充要更新的加速结构
      VkAccelerationStructureBuildGeometryInfoKHR buildInfos{VK_STRUCTURE_TYPE_ACCELERATION_STRUCTURE_BUILD_GEOMETRY_INFO_KHR};
      buildInfos.flags                    = flags;
      buildInfos.geometryCount            = (uint32_t)blas.asGeometry.size();
      buildInfos.pGeometries              = blas.asGeometry.data();
      buildInfos.mode                     = VK_BUILD_ACCELERATION_STRUCTURE_MODE_UPDATE_KHR;  // 更新标志位
      buildInfos.type                     = VK_ACCELERATION_STRUCTURE_TYPE_BOTTOM_LEVEL_KHR;
      buildInfos.srcAccelerationStructure = m_blas[blasIdx].accel;  // 更新源
      buildInfos.dstAccelerationStructure = m_blas[blasIdx].accel;

      // 从设备中获取构建大小
      std::vector<uint32_t> maxPrimCount(blas.asBuildOffsetInfo.size());
      for(auto tt = 0; tt < blas.asBuildOffsetInfo.size(); tt++)
        maxPrimCount[tt] = blas.asBuildOffsetInfo[tt].primitiveCount;  // 图元数量（也就是三角形数量）
      VkAccelerationStructureBuildSizesInfoKHR sizeInfo{VK_STRUCTURE_TYPE_ACCELERATION_STRUCTURE_BUILD_SIZES_INFO_KHR};
      vkGetAccelerationStructureBuildSizesKHR(m_device, VK_ACCELERATION_STRUCTURE_BUILD_TYPE_DEVICE_KHR, &buildInfos,
                                              maxPrimCount.data(), &sizeInfo);

      // 分配暂付缓存并设置暂付信息
      nvvk::Buffer scratchBuffer =
          m_alloc->createBuffer(sizeInfo.buildScratchSize, VK_BUFFER_USAGE_STORAGE_BUFFER_BIT | VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT);
      VkBufferDeviceAddressInfo bufferInfo{VK_STRUCTURE_TYPE_BUFFER_DEVICE_ADDRESS_INFO};
      bufferInfo.buffer                    = scratchBuffer.buffer;
      buildInfos.scratchData.deviceAddress = vkGetBufferDeviceAddress(m_device, &bufferInfo);
      NAME_VK(scratchBuffer.buffer);

      std::vector<const VkAccelerationStructureBuildRangeInfoKHR*> pBuildOffset(blas.asBuildOffsetInfo.size());
      for(size_t i = 0; i < blas.asBuildOffsetInfo.size(); i++)
        pBuildOffset[i] = &blas.asBuildOffsetInfo[i];

      // 更新设备端的实体缓存并构建顶层加速结构
      nvvk::CommandPool genCmdBuf(m_device, m_queueIndex);
      VkCommandBuffer   cmdBuf = genCmdBuf.createCommandBuffer();


      // 更新加速结构
      vkCmdBuildAccelerationStructuresKHR(cmdBuf, 1, &buildInfos, pBuildOffset.data());

      genCmdBuf.submitAndWait(cmdBuf);
      m_alloc->destroy(scratchBuffer);
    }

之前的 ``updateBlas`` 函数会使用 ``m_blas`` 中存储的几何体信息。为了能够重复使用这些信息，我们需要在 ``nvvk::RaytracingBuilderKHR::Blas`` 对象创建时保留这些数据。

将 ``HelloVulkan::createBottomLevelAS()`` 中的 ``nvvk::RaytracingBuilderKHR::Blas`` 转移至 ``HelloVulkan`` 类中，将其重命名为 ``m_blas`` 。

.. code:: c++

      std::vector<nvvk::RaytracingBuilderKHR::Blas>         m_blas;

和顶层加速结构类似，底层加速结构也需要支持更新（ ``VK_BUILD_ACCELERATION_STRUCTURE_ALLOW_UPDATE_BIT_KHR`` ） 。我们需要使用 ``VK_BUILD_ACCELERATION_STRUCTURE_PREFER_FAST_BUILD_BIT_KHR`` 标志位，用于告知驱动相较于追踪性能，我们更关注加速结构的构建速度。

.. code:: c++

    void HelloVulkan::createBottomLevelAS()
    {
      // 底层加速结构 - 存储几何中的每一个图元
      m_blas.reserve(m_objModel.size());
      for(const auto& obj : m_objModel)
      {
        auto blas = objectToVkGeometryKHR(obj);

        // 每一个底层加速结构都可以包含多个几何体，但是目前我们只有一个
        m_blas.push_back(blas);
      }
      m_rtBuilder.buildBlas(m_blas, VK_BUILD_ACCELERATION_STRUCTURE_ALLOW_UPDATE_BIT_KHR
                                        | VK_BUILD_ACCELERATION_STRUCTURE_PREFER_FAST_BUILD_BIT_KHR);
    }

最后我们可以在 ``HelloVulkan::animationObject()`` 后面增加对于底层加速结构的更新。

.. code:: c++

    m_rtBuilder.updateBlas(sphereId, m_blas[sphereId],
                             VK_BUILD_ACCELERATION_STRUCTURE_ALLOW_UPDATE_BIT_KHR | VK_BUILD_ACCELERATION_STRUCTURE_PREFER_FAST_BUILD_BIT_KHR);
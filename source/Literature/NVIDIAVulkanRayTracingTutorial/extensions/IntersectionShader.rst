相交着色器
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/10/7 增加该扩展文档
    * 2023/10/7 增加 ``教程`` 章节
    * 2023/10/7 增加 ``上层实现`` 章节
    * 2023/10/7 增加 ``创建所有隐式对象`` 章节
    * 2023/10/8 更新 ``创建所有隐式对象`` 章节
    * 2023/10/8 增加 ``布置场景`` 章节
    * 2023/10/8 增加 ``加速结构`` 章节
    * 2023/10/8 增加 ``底层加速结构`` 章节
    * 2023/10/8 增加 ``顶层加速结构`` 章节
    * 2023/10/8 增加 ``描述符`` 章节
    * 2023/10/8 增加 ``相交着色器`` 章节
    * 2023/10/10 更新 ``相交着色器`` 章节
    * 2023/10/10 增加 ``raytrace.rint`` 章节
    * 2023/10/10 增加 ``光线与球体求交`` 章节
    * 2023/10/10 增加 ``光线与轴对齐包围盒求交`` 章节
    * 2023/10/10 增加 ``raytrace2.rchit`` 章节
    * 2023/10/16 提供 ``Turbo`` 实现开源示例

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_intersection#intersection-shader---tutorial

.. admonition:: Turbo 引擎中对该教程的实现示例
    :class: note

    ``Turbo`` 引擎对该教程进行了实现，具体如下：

    * `VulkanKHRRayTracingTestForIntersectionShader <https://github.com/FuXiii/Turbo/blob/dev/samples/VulkanKHRRayTracingTestForIntersectionShader.cpp>`_ ：在 `NVIDIA Vulkan 光线追踪教程 <../NVIDIAVulkanRayTracingTutorial.html>`_ 基础实现。 ``示例视频（暂无，待补充）`` 。


.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html

.. figure:: ../../../_static/intersection.png

    相交着色器结果示意图

教程
####################

该教程为 ``Vulkan`` `光线追踪教程`_ 的扩展。

该教程展示如何使用相交着色器来渲染不同材质的不同图元。

上层实现
####################

从上层角度来看，我们将：

* 在底层加速结构中增加 :math:`2,000,000` 个轴对齐包围盒（ ``axis aligned bounding box`` 简写为 ``AABB`` ）
* 增加两个材质
* 每一个相交物体将会是球体或盒体两者交替，并且使用两个材质其中的一个

为了做到这些，我们需要：

* 增加一个相交着色器（ ``.rint`` ）
* 增加一个新的最近命中着色器（ ``.chit`` ）
* 使用 ``VkAccelerationStructureGeometryAabbsDataKHR`` 创建一个 ``VkAccelerationStructureGeometryKHR``

创建所有隐式对象
####################

在 ``host_device.h`` ，我们将会声明我们需要的结构体。实现定义球体结构体。

.. admonition:: 盒体
    :class: note

    盒体（轴对齐包围盒）也是使用球体来定义的。

这些信息将会在相交着色器中获取到并返回相交点。

.. code:: c++

    struct Sphere
    {
      vec3  center;
      float radius;
    };

之后需要一个轴对齐包围盒结构体用于包裹所有的球体，同时也用于创建底层加速结构（ ``VK_GEOMETRY_TYPE_AABBS_KHR`` ）。

.. code:: c++

    struct Aabb
    {
      vec3 minimum;
      vec3 maximum;
    };

同时增加如下定义，用于区分球体和盒体。

.. code:: c++

    #define KIND_SPHERE 0
    #define KIND_CUBE 1

所有的数据将会在缓存中进行存储，之后着色器将会对其进行访问。

.. code:: c++

    std::vector<Sphere> m_spheres;                // 所有球体
    nvvkBuffer          m_spheresBuffer;          // 存储所有球体的缓存
    nvvkBuffer          m_spheresAabbBuffer;      // 存储所有轴对齐包围盒的缓存
    nvvkBuffer          m_spheresMatColorBuffer;  // 多个材质
    nvvkBuffer          m_spheresMatIndexBuffer;  // 定义哪个球体使用哪个材质

最后，增加两个函数，一个是用于创建球体，一个是用于构造底层加速结构时所需的中间结构体数据（与 ``objectToVkGeometryKHR()`` 类似）。

.. code:: c++

    void createSpheres();
    auto sphereToVkGeometryKHR();

这下来将会在随机的位置上创建随机半径的 :math:`2,000,000` 个球体。并从球体定义中导出轴对齐包围盒。两种材料将会交替分配给每个对象。所有的构建完的数据都会保存进 ``Vulkan`` 的缓存中并在相交着色器和最近命中着色器中使用。

.. code:: c++

    //--------------------------------------------------------------------------------------------------
    // 创建所有的球体
    //
    void HelloVulkan::createSpheres(uint32_t nbSpheres)
    {
      std::random_device                    rd{};
      std::mt19937                          gen{rd()};
      std::normal_distribution<float>       xzd{0.f, 5.f};
      std::normal_distribution<float>       yd{6.f, 3.f};
      std::uniform_real_distribution<float> radd{.05f, .2f};

      // 所有球体
      m_spheres.resize(nbSpheres);
      for(uint32_t i = 0; i < nbSpheres; i++)
      {
        Sphere s;
        s.center     = nvmath::vec3f(xzd(gen), yd(gen), xzd(gen));
        s.radius     = radd(gen);
        m_spheres[i] = std::move(s);
      }

      // 每一个球体的轴对齐包围盒
      std::vector<Aabb> aabbs;
      aabbs.reserve(nbSpheres);
      for(const auto& s : m_spheres)
      {
        Aabb aabb;
        aabb.minimum = s.center - nvmath::vec3f(s.radius);
        aabb.maximum = s.center + nvmath::vec3f(s.radius);
        aabbs.emplace_back(aabb);
      }

      // 创建两个材质
      MaterialObj mat;
      mat.diffuse = nvmath::vec3f(0, 1, 1);
      std::vector<MaterialObj> materials;
      std::vector<int>         matIdx(nbSpheres);
      materials.emplace_back(mat);
      mat.diffuse = nvmath::vec3f(1, 1, 0);
      materials.emplace_back(mat);

      // 为每一个球体分配一个材质
      for(size_t i = 0; i < m_spheres.size(); i++)
      {
        matIdx[i] = i % 2;
      }

      // 创建所有的缓存
      using vkBU = VkBufferUsageFlagBits;
      nvvk::CommandPool genCmdBuf(m_device, m_graphicsQueueIndex);
      auto              cmdBuf = genCmdBuf.createCommandBuffer();
      m_spheresBuffer          = m_alloc.createBuffer(cmdBuf, m_spheres, VK_BUFFER_USAGE_STORAGE_BUFFER_BIT);
      m_spheresAabbBuffer      = m_alloc.createBuffer(cmdBuf, aabbs,
                                                 VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT
                                                     | VK_BUFFER_USAGE_ACCELERATION_STRUCTURE_BUILD_INPUT_READ_ONLY_BIT_KHR);
      m_spheresMatIndexBuffer =
          m_alloc.createBuffer(cmdBuf, matIdx, VK_BUFFER_USAGE_STORAGE_BUFFER_BIT | VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT);
      m_spheresMatColorBuffer =
          m_alloc.createBuffer(cmdBuf, materials, VK_BUFFER_USAGE_STORAGE_BUFFER_BIT | VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT);
      genCmdBuf.submitAndWait(cmdBuf);

      // 调试信息
      m_debug.setObjectName(m_spheresBuffer.buffer, "spheres");
      m_debug.setObjectName(m_spheresAabbBuffer.buffer, "spheresAabb");
      m_debug.setObjectName(m_spheresMatColorBuffer.buffer, "spheresMat");
      m_debug.setObjectName(m_spheresMatIndexBuffer.buffer, "spheresMatIdx");

      // 增加一个额外的实体，用于着色器中访问材质数据
      ObjDesc objDesc{};
      objDesc.materialAddress      = nvvk::getBufferDeviceAddress(m_device, m_spheresMatColorBuffer.buffer);
      objDesc.materialIndexAddress = nvvk::getBufferDeviceAddress(m_device, m_spheresMatIndexBuffer.buffer);
      m_objDesc.emplace_back(objDesc);

      ObjInstance instance{};
      instance.objIndex = static_cast<uint32_t>(m_objModel.size());
      m_instances.emplace_back(instance);
    }

不要忘记在 ``destroyResources()`` 中回收资源。

.. code:: c++

    m_alloc.destroy(m_spheresBuffer);
    m_alloc.destroy(m_spheresAabbBuffer);
    m_alloc.destroy(m_spheresMatColorBuffer);
    m_alloc.destroy(m_spheresMatIndexBuffer);

我们需要一个新的底层加速结构用于承载支持创建的图元（几何体）。为了效率并且所有的图元都是静态的，所有的图元将会将入到同一个底层加速结构中。

与创建三角图元不同的是，现在使用轴对齐包围盒数据并且几何类型为 ``VK_GEOMETRY_TYPE_AABBS_KHR`` 。

.. code:: c++

    //--------------------------------------------------------------------------------------------------
    // 返回用于底层加速结构的光追几何数据，存有所有的球体
    //
    auto HelloVulkan::sphereToVkGeometryKHR()
    {
      VkDeviceAddress dataAddress = nvvk::getBufferDeviceAddress(m_device, m_spheresAabbBuffer.buffer);

      VkAccelerationStructureGeometryAabbsDataKHR aabbs{VK_STRUCTURE_TYPE_ACCELERATION_STRUCTURE_GEOMETRY_AABBS_DATA_KHR};
      aabbs.data.deviceAddress = dataAddress;
      aabbs.stride             = sizeof(Aabb);

      // 设置加速结构的构建信息
      VkAccelerationStructureGeometryKHR asGeom{VK_STRUCTURE_TYPE_ACCELERATION_STRUCTURE_GEOMETRY_KHR};
      asGeom.geometryType   = VK_GEOMETRY_TYPE_AABBS_KHR;
      asGeom.flags          = VK_GEOMETRY_OPAQUE_BIT_KHR;
      asGeom.geometry.aabbs = aabbs;

      VkAccelerationStructureBuildRangeInfoKHR offset{};
      offset.firstVertex     = 0;
      offset.primitiveCount  = (uint32_t)m_spheres.size();  // 轴对齐包围盒的数量
      offset.primitiveOffset = 0;
      offset.transformOffset = 0;

      nvvk::RaytracingBuilderKHR::BlasInput input;
      input.asGeometry.emplace_back(asGeom);
      input.asBuildOffsetInfo.emplace_back(offset);
      return input;
    }

布置场景
####################

在 ``main.cpp`` 中，加载 ``OBJ`` 模型的地方，将其替换成如下：

.. code:: c++

    helloVk.loadModel(nvh::findFile("media/scenes/plane.obj", defaultSearchPaths, true));
    helloVk.createSpheres(2000000);

.. admonition:: 注意
    :class: note

    可以加载更多的 ``OBJ`` 模型，但由于我们现在构建顶层加速结构的流程，球体需要在最后加载。

该场景较大，最好先将相机移开。

.. code:: c++

    CameraManip.setLookat(nvmath::vec3f(20, 20, 20), nvmath::vec3f(0, 1, 0), nvmath::vec3f(0, 1, 0));

加速结构
####################

底层加速结构
**********************************************

``createBottomLevelAS()`` 函数会为每一个 ``OBJ`` 模型创建一个底层加速结构，我们需要增加一个新的底层加速结构用于承载所有球体的轴对齐包围盒。

.. code:: c++

    void HelloVulkan::createBottomLevelAS()
    {
      // 底层加速结构 - 每个模型存入一个几何体中
      std::vector<nvvk::RaytracingBuilderKHR::BlasInput> allBlas;
      allBlas.reserve(m_objModel.size());
      for(const auto& obj : m_objModel)
      {
        auto blas = objectToVkGeometryKHR(obj);

        // 每一个底层加速结构可以增加更多几何体，但是现在我们仅增加一个
        allBlas.emplace_back(blas);
      }

      // 所有球体
      {
        auto blas = sphereToVkGeometryKHR();
        allBlas.emplace_back(blas);
      }

      m_rtBuilder.buildBlas(allBlas, VK_BUILD_ACCELERATION_STRUCTURE_PREFER_FAST_TRACE_BIT_KHR);
    }

顶层加速结构
**********************************************

与 ``createTopLevelAS()`` 类似，顶层加速结构将会引入承载所有球体的底层加速结构。我们将 ``instanceCustomId`` 和 ``blasId`` 设置为最后一个元素。这就是为什么存储球体的底层加速结构需要在所有模型加载完成之后加载。

``hitGroupId`` 将会设置成 ``1`` 而不是 ``0`` 。我们需要为这些隐式图元增加一个新的命中组，由于我们没有提供类似三角形这样的图元，所以我们需要计算类似法线这样的图元属性。

由于我们在创建隐式对象时增加了一个额外的实体，循环遍历时就会将最后一个元素忽略，循环将会少一次。因此循环将会类似于如下：

.. code:: c++

    auto nbObj = static_cast<uint32_t>(m_instances.size()) - 1;
    tlas.reserve(nbObj);
    for(uint32_t i = 0; i < nbObj; i++)
    {
        const auto& inst = m_instances[i];
        ...
    }

紧接着上面的循环之后，构建顶层加速结构之前，我们需要增加如下代码：

.. code:: c++

    // 增加包含所有隐式对象的底层加速结构
    {
      VkAccelerationStructureInstanceKHR rayInst{};
      rayInst.transform           = nvvk::toTransformMatrixKHR(nvmath::mat4f(1));  // 实体的位置 （单位矩阵）
      rayInst.instanceCustomIndex = nbObj;                                         // nbObj == last object == implicit
      rayInst.accelerationStructureReference = m_rtBuilder.getBlasDeviceAddress(static_cast<uint32_t>(m_objModel.size()));
      rayInst.instanceShaderBindingTableRecordOffset = 1;  // 所有的对象我们将使用相同的命中组
      rayInst.flags                                  = VK_GEOMETRY_INSTANCE_TRIANGLE_FACING_CULL_DISABLE_BIT_KHR;
      rayInst.mask                                   = 0xFF;  //  只有当 rayMask & instance.mask != 0 成立时表示命中
      tlas.emplace_back(rayInst);
    }

``instanceCustomIndex`` 为 ``m_instances`` 的最后一个元素，并在着色器中访问隐式对象的材质信息。

描述符
####################

为了在着色器中能够访问到存储所有球体的缓存，需要对描述符进行一些改变。

在 ``Binding`` 中增加一个新的枚举。

.. code:: c++

    eImplicit = 3,  // 所有隐式对象

描述符需要增加一个对于隐式对象的绑定。

.. code:: c++

    // 对应着所有球体 (binding = 3)
    m_descSetLayoutBind.addBinding(eImplicit, VK_DESCRIPTOR_TYPE_STORAGE_BUFFER, 1,
                                   VK_SHADER_STAGE_CLOSEST_HIT_BIT_KHR | VK_SHADER_STAGE_INTERSECTION_BIT_KHR);

``updateDescriptorSet()`` 函数中的更新缓存绑定同样需要进行修改。在更新绑定纹理之后，绑定包含所有球体的缓存。

.. code:: c++

    VkDescriptorBufferInfo dbiSpheres{m_spheresBuffer.buffer, 0, VK_WHOLE_SIZE};
    writes.emplace_back(m_descSetLayoutBind.makeWrite(m_descSet, eImplicit, &dbiSpheres));

相交着色器
####################

相交着色器是增加到类型为 ``VK_RAY_TRACING_SHADER_GROUP_TYPE_PROCEDURAL_HIT_GROUP_KHR`` （ ``VkRayTracingShaderGroupCreateInfoKHR::type`` ）的命中组中。在本示例中，我们已经有一个用于与三角形和相应的最近命中交互的命中组了。想在我能增加一个新的，新增的命中组的 ``Hit Group ID`` 为 ``1`` 。

如下是新的命中组相关代码：

.. code:: c++

    enum StageIndices
    {
      eRaygen,
      eMiss,
      eMiss2,
      eClosestHit,
      eClosestHit2,
      eIntersection,
      eShaderGroupCount
    };

    // 最近命中着色器
    stage.module = nvvk::createShaderModule(m_device, nvh::loadFile("spv/raytrace2.rchit.spv", true, defaultSearchPaths, true));
    stage.stage          = VK_SHADER_STAGE_CLOSEST_HIT_BIT_KHR;
    stages[eClosestHit2] = stage;
    // 相交着色器
    stage.module = nvvk::createShaderModule(m_device, nvh::loadFile("spv/raytrace.rint.spv", true, defaultSearchPaths, true));
    stage.stage           = VK_SHADER_STAGE_INTERSECTION_BIT_KHR;
    stages[eIntersection] = stage;

.. code:: c++

    // 最近命中着色器 + 相交着色器 (第2个命中组)
    group.type               = VK_RAY_TRACING_SHADER_GROUP_TYPE_PROCEDURAL_HIT_GROUP_KHR;
    group.closestHitShader   = eClosestHit2;
    group.intersectionShader = eIntersection;
    m_rtShaderGroups.push_back(group);

raytrace.rint
**********************************************

相交着色器 ``raytrace.rint`` 需要添加到着色器目录下并重新执行 ``CMake`` 将其加入到项目工程中。当光线命中场景中的某一个轴对齐包围盒之后将会执行相交着色器。

.. admonition:: 注意
    :class: note

    在相交着色器中获取不到轴对齐包围盒的相关信息。也获取不到 ``GPU`` 光线追踪器中计算的命中点位置。

仅有的信息就是知道光线与轴对齐包围盒放生了碰撞并与哪一个发生碰撞，并存入 ``gl_PrimitiveID`` ，由于之前我们将球体数组存入缓存中，这样我们就可以通过 ``gl_PrimitiveID`` 获取相应球体的几何信息。

首先在着色器中声明扩展和包含通用头文件。

.. code:: glsl

    #version 460
    #extension GL_EXT_ray_tracing : require
    #extension GL_EXT_nonuniform_qualifier : enable
    #extension GL_EXT_scalar_block_layout : enable
    #extension GL_GOOGLE_include_directive : enable
    #extension GL_EXT_shader_explicit_arithmetic_types_int64 : require
    #extension GL_EXT_buffer_reference2 : require

    #include "raycommon.glsl"
    #include "wavefront.glsl"

接下来声明所有的球体数组结构描述符接口，之后就可以通过 ``gl_PrimitiveID`` 获取具体球体信息了。

.. code:: glsl

    layout(binding = 3, set = eImplicit, scalar) buffer allSpheres_
    {
      Sphere allSpheres[];
    };

我们将会实现两个相交函数用于与射入光线进行相交计算。

.. code:: glsl

    struct Ray
    {
      vec3 origin;
      vec3 direction;
    };

光线与球体求交
--------------------

.. code:: glsl

    // 光线-球体 求交
    // http://viclw17.github.io/2018/07/16/raytracing-ray-sphere-intersection/
    float hitSphere(const Sphere s, const Ray r)
    {
      vec3  oc           = r.origin - s.center;
      float a            = dot(r.direction, r.direction);
      float b            = 2.0 * dot(oc, r.direction);
      float c            = dot(oc, oc) - s.radius * s.radius;
      float discriminant = b * b - 4 * a * c;
      if(discriminant < 0)
      {
        return -1.0;
      }
      else
      {
        return (-b - sqrt(discriminant)) / (2.0 * a);
      }
    }

光线与轴对齐包围盒求交
------------------------

.. code:: glsl

    // 光线-轴对齐包围盒 求交
    float hitAabb(const Aabb aabb, const Ray r)
    {
      vec3  invDir = 1.0 / r.direction;
      vec3  tbot   = invDir * (aabb.minimum - r.origin);
      vec3  ttop   = invDir * (aabb.maximum - r.origin);
      vec3  tmin   = min(ttop, tbot);
      vec3  tmax   = max(ttop, tbot);
      float t0     = max(tmin.x, max(tmin.y, tmin.z));
      float t1     = min(tmax.x, min(tmax.y, tmax.z));
      return t1 > max(t0, 0.0) ? t0 : -1.0;
    }

如果没有交点，两个都返回 ``-1`` ，否则返回交点到光线起点间的距离。

光线信息的获取非常直接：

.. code:: glsl

    void main()
    {
      Ray ray;
      ray.origin    = gl_WorldRayOriginEXT;
      ray.direction = gl_WorldRayDirectionEXT;

并且获取相交轴对齐包围盒中的几何信息如下：

.. code:: glsl

    // 球体数据
    Sphere sphere = allSpheres.i[gl_PrimitiveID];

现在我们只需要判断击中的是球体还是包围盒即可。

.. code:: glsl

    float tHit    = -1;
    int   hitKind = gl_PrimitiveID % 2 == 0 ? KIND_SPHERE : KIND_CUBE;
    if(hitKind == KIND_SPHERE)
    {
      // 与球体相交
      tHit = hitSphere(sphere, ray);
    }
    else
    {
      // 与轴对齐包围盒相交
      Aabb aabb;
      aabb.minimum = sphere.center - vec3(sphere.radius);
      aabb.maximum = sphere.center + vec3(sphere.radius);
      tHit         = hitAabb(aabb, ray);
    }

相交着色器的相交信息是通过 ``reportIntersectionEXT`` 进行报告（返回）的。其有两个参数：

* :bdg-secondary:`tHit` 交点与光线起点间的距离
* :bdg-secondary:`hitKind` 用于区分命中图元类型信息

.. code:: glsl

    // 报告命中点
    if(tHit > 0)
      reportIntersectionEXT(tHit, hitKind);

raytrace2.rchit
**********************************************

该最近命中着色器与之前的 ``raytrace.rchit`` 基本上是相同的，但是由于图元是隐式的，我们需要计算命中点处图元的法线。

我们需要通过相交着色器返回的 ``gl_HitTEXT`` （命中点到光线起点间的距离）计算光线命中点：

.. code:: glsl

    vec3 worldPos = gl_WorldRayOriginEXT + gl_WorldRayDirectionEXT * gl_HitTEXT;

对于球体信息的获取与 ``raytrace.rint`` 相交着色器中的相同：

.. code:: glsl

    Sphere instance = allSpheres.i[gl_PrimitiveID];

之后先按照命中球体进行法线计算：

.. code:: glsl

    // 计算球体上命中点处的法线
    vec3 normal = normalize(worldPos - instance.center);

现在使用 ``gl_HitKindEXT`` （通过相交着色器的 ``reportIntersectionEXT`` 进行设置的）来判断命中的是否为轴对齐包围盒。

如果是个包围盒，我们将法线与坐标轴对齐：

.. code:: glsl

    // 如果 gl_HitKindEXT 为 1 （KIND_CUBE），计算包围盒的法线
    if(gl_HitKindEXT == KIND_CUBE)  // Aabb
    {
      vec3  absN = abs(normal);
      float maxC = max(max(absN.x, absN.y), absN.z);
      normal     = (maxC == absN.x) ?
                   vec3(sign(normal.x), 0, 0) :
                   (maxC == absN.y) ? vec3(0, sign(normal.y), 0) : vec3(0, 0, sign(normal.z));
    }



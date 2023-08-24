任意命中着色器（Any Hit Shaders）教程
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/8/24 增加该扩展文档
    * 2023/8/24 增加 ``教程`` 章节
    * 2023/8/24 增加 ``任意命中着色器`` 章节
    * 2023/8/24 增加 ``负载`` 章节
    * 2023/8/24 增加 ``将任意命中着色器加入光追管线中`` 章节
    * 2023/8/24 增加 ``配置任意命中着色器中访问的缓存`` 章节
    * 2023/8/24 增加 ``不透明标志位`` 章节
    * 2023/8/24 增加 ``光线生成着色器`` 章节
    * 2023/8/24 增加 ``最近命中着色器`` 章节
    * 2023/8/24 增加 ``场景和模型`` 章节
    * 2023/8/24 增加 ``OBJ 材质`` 章节
    * 2023/8/24 增加 ``累积`` 章节
    * 2023/8/24 增加 ``修正管线`` 章节
    * 2023/8/24 增加 ``新着色器`` 章节
    * 2023/8/24 增加 ``新负载`` 章节
    * 2023/8/24 增加 ``traceRayEXT`` 章节
    * 2023/8/24 增加 ``光追管线`` 章节
    * 2023/8/24 初步翻译完成

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/blob/master/ray_tracing_anyhit/README.md

.. figure:: ../../../_static/anyhit.png

    任意命中着色器结果示意图

教程
####################

该教程为 ``Vulkan`` 光线追踪教程的扩展。

与最近命中着色器（ ``closest hit shade`` ）类似，任意命中着色器在光线与几何体相交处执行，与最近命中着色器不同的是，任意命中着色器将会在沿着光线与几何体的所有交点处执行。最近命中着色器只会在最近的交点处执行。

任意命中着色器对于交点的剔除很有用，比如剔除透明的交点，但也可用于进行简单的透明化操作。在本示例中我们将会展示添加该着色器类型需要做什么并实现一个透明效果。

.. note:: 该示例的很多元素来源于 `相机抖动抗锯齿教程 <./JitterCamera.html>`_

任意命中着色器
####################

创建一个新的着色器文件 ``raytrace.rahit`` 之后执行 ``CMake`` 使其加入到工程的解决方案中。

该着色器一开始和 ``raytrace.chit`` 最近命中着色器相似，但使用的信息更少。

.. code:: glsl

    #version 460
    #extension GL_EXT_ray_tracing : require
    #extension GL_EXT_scalar_block_layout : enable
    #extension GL_GOOGLE_include_directive : enable

    #extension GL_EXT_shader_explicit_arithmetic_types_int64 : require
    #extension GL_EXT_buffer_reference2 : require

    #include "random.glsl"
    #include "raycommon.glsl"
    #include "wavefront.glsl"

    // clang-format off
    layout(location = 0) rayPayloadInEXT hitPayload prd;
    layout(buffer_reference, scalar) buffer Vertices {Vertex v[]; }; // 物体的顶点数据
    layout(buffer_reference, scalar) buffer Indices {uint i[]; }; // 三角形索引
    layout(buffer_reference, scalar) buffer Materials {WaveFrontMaterial m[]; }; // 物体中的所有材质数据
    layout(buffer_reference, scalar) buffer MatIndices {int i[]; }; // 每一个三角形对应的材质信息
    layout(set = 1, binding = eObjDescs, scalar) buffer ObjDesc_ { ObjDesc i[]; } objDesc;
    // clang-format on

.. note:: ``random.glsl`` 可以在 `相机抖动抗锯齿教程 <./JitterCamera.html>`_ 中找到。

对于任意命中着色器，我们需要知道我们命中了哪一个材质，且该材质是否支持透明。如果材质是不透明，我们直接返回，也就是说采用该命中点为最终命中。

.. code:: glsl

    void main()
    {
      // 物体数据
      ObjDesc    objResource = objDesc.i[gl_InstanceCustomIndexEXT];
      MatIndices matIndices  = MatIndices(objResource.materialIndexAddress);
      Materials  materials   = Materials(objResource.materialAddress);

      // 物体的材质
      int               matIdx = matIndices.i[gl_PrimitiveID];
      WaveFrontMaterial mat    = materials.m[matIdx];

      if (mat.illum != 4)
        return;

现在我们开启透明：

.. code:: glsl

      if (mat.dissolve == 0.0)
          ignoreIntersectionEXT();
      else if(rnd(prd.seed) > mat.dissolve)
         ignoreIntersectionEXT();
    }

正如你所见，我们生成一个随机数（ :code:`rnd(prd.seed)` ）来判断光线是否命中或忽略该物体。如果我们积累了足够多的光线的话，最终的结果将会趋向于我们希望的理想结果。

负载
####################

随机 ``seed`` 同样需要存入光线负载中。

在 ``raycommon.glsl`` 中，增加 ``seed`` 成员变量：

.. code:: glsl

    struct hitPayload
    {
      vec3 hitValue;
      uint seed;
    };

将任意命中着色器加入光追管线中
###############################

该任意命中着色器将会作为命中着色器组的成员。就目前为止，命中着色器组仅有一个最近命中着色器。

在 ``createRtPipeline()`` 中，在加载 ``raytrace.rchit.spv`` 之后加载 ``raytrace.rahit.spv`` 。

.. code:: c++

    enum StageIndices
    {
      ...
      eAnyHit,
      eShaderGroupCount
    };

    // 命中组 - 任意命中
    stage.module = nvvk::createShaderModule(m_device, nvh::loadFile("spv/raytrace.rahit.spv", true, defaultSearchPaths, true));
    stage.stage  = VK_SHADER_STAGE_ANY_HIT_BIT_KHR;
    stages[eAnyHit] = stage;

任意命中着色器和最近命中着色器在同一个命中组中，所以我们需要将任意命中着色器索引加入其中并存入到相应数组中。

.. code:: c++

    // 最近命中着色器
    // 负载 0
    group.type             = VK_RAY_TRACING_SHADER_GROUP_TYPE_TRIANGLES_HIT_GROUP_KHR;
    group.generalShader    = VK_SHADER_UNUSED_KHR;
    group.closestHitShader = eClosestHit;
    group.anyHitShader     = eAnyHit;
    m_rtShaderGroups.push_back(group);

配置任意命中着色器中访问的缓存
###############################

在 ``createDescriptorSetLayout()`` 中我们配置描述符集布局使得任意命中着色器可访问场景描述缓存。

.. code:: c++

    // 物体描述
    m_descSetLayoutBind.addBinding(eObjDescs, VK_DESCRIPTOR_TYPE_STORAGE_BUFFER, 1,
                                   VK_SHADER_STAGE_VERTEX_BIT | VK_SHADER_STAGE_FRAGMENT_BIT
                                       | VK_SHADER_STAGE_CLOSEST_HIT_BIT_KHR | VK_SHADER_STAGE_ANY_HIT_BIT_KHR);

不透明标志位
###############################

当该示例创建 ``VkAccelerationStructureGeometryKHR`` 时，我们设置的标示位为 ``VK_GEOMETRY_OPAQUE_BIT_KHR`` 不透明标志位。然而该标志位会导致忽略任意命中着色器。

我们可以简单的移除所有的 ``VK_GEOMETRY_OPAQUE_BIT_KHR`` 标志位，但这会导致另一个问题：:bdg-warning:`同一个三角形可能会多次调用任意命中着色器` 。为了在每一个三角形上只执行一次任意命中着色器，设置 ``VK_GEOMETRY_NO_DUPLICATE_ANY_HIT_INVOCATION_BIT_KHR`` 标志位：

.. code:: c++

    asGeom.flags = VK_GEOMETRY_NO_DUPLICATE_ANY_HIT_INVOCATION_BIT_KHR;  // 避免重复命中

光线生成着色器
###############################

如果您已经完成了 `相机抖动抗锯齿教程 <./JitterCamera.html>`_ 的话，接下来只需要稍作修改即可。

首先 ``seed`` 需要在任意命中着色器中使用，这就是为什么我们将其加入到 ``hitPayload`` 结构体中。

将所有 ``seed`` 改成 ``prd.seed`` 。

.. code:: c++

    prd.seed = tea(gl_LaunchIDEXT.y * gl_LaunchSizeEXT.x + gl_LaunchIDEXT.x, pushC.frame);

之前为了优化，调用 ``TraceRayEXT`` 时使用 ``gl_RayFlagsOpaqueEXT`` 标志位。但这会忽略任意命中着色器，所以将其改成：

.. code:: c++

    uint  rayFlags = gl_RayFlagsNoneEXT;

最近命中着色器
###############################

类似的，在最近命中着色器中将标志位修改成 ``gl_RayFlagsSkipClosestHitShaderEXT`` ，目的是我们希望激活任意命中着色器和未命中着色器，但我们还不关心最近命中着色器的阴影射线。这将会开启透明阴影。

.. code:: c++

    uint  flags = gl_RayFlagsSkipClosestHitShaderEXT;

场景和模型
###############################

您可以通过改变 ``main()`` 中的 ``helloVk.loadModel`` 调用来组建更加有趣的场景：

.. code:: c++

    helloVk.loadModel(nvh::findFile("media/scenes/wuson.obj", defaultSearchPaths, true));
    helloVk.loadModel(nvh::findFile("media/scenes/sphere.obj", defaultSearchPaths, true),
                      nvmath::scale_mat4(nvmath::vec3f(1.5f))
                          * nvmath::translation_mat4(nvmath::vec3f(0.0f, 1.0f, 0.0f)));
    helloVk.loadModel(nvh::findFile("media/scenes/plane.obj", defaultSearchPaths, true));

OBJ 材质
###############################

默认情况下，所有的物体都是不透明的，您需要改变材质的描述信息。

修改 ``media/scenes/wuson.mtl`` 和 ``media/scenes/sphere.mtl`` 前几行使得新的光照模型为 ``4`` ， ``dissolve`` 值为 ``0.5`` ：

.. code:: c++

    newmtl  default
    illum 4
    d 0.5
    ...

累积
###############################

正如前面提到的，为了达到效果，我们需要随着时间累积每一帧，请实现 `相机抖动抗锯齿教程 <./JitterCamera.html>`_ 中的：

* `Frame Number <https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_jitter_cam#frame-number>`_ :bdg-danger:`未翻译`
* `Storing or Updating <https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_jitter_cam#storing-or-updating>`_ :bdg-danger:`未翻译`
* `Application Frame Update <https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_jitter_cam#application-frame-update>`_ :bdg-danger:`未翻译`

修正管线
###############################

至此代码已经可以工作了，但是将来就不好说了。这是因为，最近命中着色器中的阴影光线追踪 ``traceRayEXT`` 调用使用的是负载 ``1`` ，但是当光线与物体相交时，任意命中着色器使用的是负载 ``0`` 。在写此篇文章时，当下的驱动会将漏洞进行自动补全并保证没有副作用，但这不是一个良构。

每一个 ``traceRayEXT`` 光线追踪调用的命中组的数量需要与负载的数量一致。对于其他示例还好，因为其他示例中我们使用了 ``gl_RayFlagsSkipClosestHitShaderEXT`` 标志位确保最近命中着色器（负载 ``0`` ）不会被调用，并且该命中组中不包含任何任意命中着色器或相交着色器。但是本示例中我们虽说忽略了
最近命中着色器，但是存在一个任意命中着色器。

为了修正此问题，我们需要增加另一个命中组。

当前的着色器绑定表 （ ``SBT`` ）结构如下：

.. figure:: ../../../_static/anyhit_0.png

现在我们需要将如下结构的着色器绑定表塞入管线中，增加一个之前命中组的拷贝，用于任意命中的新负载。

.. figure:: ../../../_static/anyhit_01.png

新着色器
********************

创建两个新文件 ``raytrace_0.ahit`` 和 ``raytrace_1.ahit`` ，并将 ``raytrace.ahit`` 重命名为 ``raytrace_ahit.glsl`` 。

.. note:: 需要重新执行 ``CMake`` 将新文件加入项目解决方案中。

在 ``raytrace_0.ahit`` 和 ``raytrace_0.ahit`` 中增加如下代码：

.. code:: glsl

    #version 460
    #extension GL_GOOGLE_include_directive : enable

    #define PAYLOAD_0
    #include "raytrace_rahit.glsl"

之后将 ``raytrace_1.ahit`` 中的 ``PAYLOAD_0`` 替换成 ``PAYLOAD_1`` ：

.. code:: glsl

    #version 460
    #extension GL_GOOGLE_include_directive : enable

    #define PAYLOAD_1
    #include "raytrace_rahit.glsl"

之后在 ``raytrace_ahit.glsl`` 中移除 ``#version 460`` 并增加如下代码，这样我们就有了正确的 ``layout`` ：

.. code:: glsl

    #ifdef PAYLOAD_0
        layout(location = 0) rayPayloadInEXT hitPayload prd;
    #elif defined(PAYLOAD_1)
        layout(location = 1) rayPayloadInEXT shadowPayload prd;
    #endif

新负载
********************

在阴影光线负载中不能简单的只包含一个布尔值。我们同样需要 ``seed`` 用于随机函数。

在 ``raycommon.glsl`` 文件中，增加如下结构：

.. code:: glsl

    struct shadowPayload
    {
      bool isHit;
      uint seed;
    };

阴影的负载是在最近命中着色器和阴影未命中着色器中使用的。首先将 ``raytraceShadow.rmiss`` 修改成如下:

.. code:: glsl

    #version 460
    #extension GL_NV_ray_tracing : require
    #extension GL_GOOGLE_include_directive : enable

    #include "raycommon.glsl"

    layout(location = 1) rayPayloadInEXT shadowPayload prd;

    void main()
    {
      prd.isHit = false;
    }

由于最近命中着色器也需要使用该负载，所以最近命着色器也需要相应的修改负载，但任然还是在 ``traceRayEXT`` 中使用。

将最近命中着色器中的负载替换成如下：

.. code:: glsl

    layout(location = 1) rayPayloadNV shadowPayload prdShadow;

之后在调用 ``traceRayEXT`` 之前初始化数值：

.. code:: glsl

    prdShadow.isHit = true;
    prdShadow.seed  = prd.seed;

之后当追踪结束后，将 ``seed`` 值设置回主负载中：

.. code:: glsl

    prd.seed = prdShadow.seed;

并检查追踪阴影的光线是否命中物体：

.. code:: glsl

    if(prdShadow.isHit)

traceRayEXT
********************

当我们调用 ``traceRayEXT`` 时，我们使用的是负载 ``1`` （最后一个参数），我们同样需要追踪另一个使用负载 ``1`` 命中组。为此我们需要将 ``sbtRecordOffset`` 设置为 ``1`` 。

.. code:: glsl

    traceRayEXT(topLevelAS,  // acceleration structure
      flags,       // rayFlags
      0xFF,        // cullMask
      1,           // sbtRecordOffset
      0,           // sbtRecordStride
      1,           // missIndex
      origin,      // ray origin
      tMin,        // ray min range
      rayDir,      // ray direction
      tMax,        // ray max range
      1            // payload (location = 1)
      );

光追管线
********************

最后一步就是通过修改 ``HelloVulkan::createRtPipeline()`` 增加新的命中组。我们需要加载新的任意命中着色器并且创建一个新的命中组。

将 ``shaders/raytrace.rahit.spv`` 替换成 ``shaders/raytrace_0.rahit.spv``

加载新的着色器：

.. code:: c++

    enum StageIndices
    {
      eRaygen,
      eMiss,
      eMiss2,
      eClosestHit,
      eAnyHit,
      eAnyHit2,
      eShaderGroupCount
    };

    // 命中组 - 任意命中
    stage.module = nvvk::createShaderModule(m_device, nvh::loadFile("spv/raytrace_0.rahit.spv", true, defaultSearchPaths, true));
    stage.stage     = VK_SHADER_STAGE_ANY_HIT_BIT_KHR;
    stages[eAnyHit] = stage;
    //
    stage.module = nvvk::createShaderModule(m_device, nvh::loadFile("spv/raytrace_1.rahit.spv", true, defaultSearchPaths, true));
    stage.stage     = VK_SHADER_STAGE_ANY_HIT_BIT_KHR;
    stages[eAnyHit2] = stage;

在创建完第一个命中组后，创建一个使用负载 ``1`` 并包含任意命中着色器新的命中组。由于我盟在追踪时忽略了最近命中着色器，所以我们可以忽略在命中组中的最近命中着色器。

.. code:: c++

    // 负载 1
    group.type             = VK_RAY_TRACING_SHADER_GROUP_TYPE_TRIANGLES_HIT_GROUP_KHR;
    group.generalShader    = VK_SHADER_UNUSED_KHR;
    group.closestHitShader = VK_SHADER_UNUSED_KHR;
    group.anyHitShader     = eAnyHit2;
    m_rtShaderGroups.push_back(group);

.. note:: 运行之后其结果应该如以前一样，得到正确的结果。
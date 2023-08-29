相机抖动抗锯齿教程
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/8/24 增加该扩展文档
    * 2023/8/25 增加 ``教程`` 章节
    * 2023/8/25 增加 ``随机函数`` 章节
    * 2023/8/25 增加 ``帧序`` 章节
    * 2023/8/25 增加 ``随机并抖动`` 章节
    * 2023/8/25 增加 ``存储或更新`` 章节
    * 2023/8/25 增加 ``更新应用帧`` 章节
    * 2023/8/25 增加 ``当 UI 发生变化时帧重置`` 章节
    * 2023/8/25 增加 ``品质`` 章节
    * 2023/8/25 增加 ``光线生成着色器中的多采样`` 章节
    * 2023/8/25 初步翻译完成
    * 2023/8/29 提供 ``Turbo`` 实现开源示例

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/blob/master/ray_tracing_jitter_cam/README.md

.. admonition:: Turbo 引擎中对该教程的实现示例
    :class: note

    ``Turbo`` 引擎对该教程进行了实现，具体如下：

    * `VulkanKHRRayTracingJitterCamera <https://github.com/FuXiii/Turbo/blob/dev/samples/VulkanKHRRayTracingJitterCamera.cpp>`_ ：通过抖动发射源采样点并多帧累积采样结果进行抗锯齿。 `示例视频 <https://www.bilibili.com/video/BV1ej41127tK/?spm_id_from=333.999.0.0>`_

.. figure:: ../../../_static/antialiasing.png

    相机抖动抗锯齿结果示意图

教程
####################

该教程为 ``Vulkan`` `光线追踪教程 <../NVIDIAVulkanRayTracingTutorial.html>`_ 的扩展。

在本示例中，我们将随着时间的随机抖动每个像素的每个光线的偏移来实现抗锯齿，而不总是从像素的中心点发射射线。

随机函数
####################

我们将会使用一些简单的随机数生成函数，这些函数对于本示例是足够用了。

创建一个新的着色器文件 ``random.glsl`` 并写入如下代码，并将其加入 ``shaders`` 文件夹下之后执行 ``CMake`` ，并在 ``raytrace.rgen`` 中 ``#include`` 引入该新着色器文件。

.. code:: glsl

    // 使用两个无符号整型经过16轮微小加密算法生成一个随机的无符号整型。
    // 相关请查阅 Zafar，Olano 和 Curtis 的 "GPU Random Numbers via the Tiny Encryption Algorithm"
    uint tea(uint val0, uint val1)
    {
      uint v0 = val0;
      uint v1 = val1;
      uint s0 = 0;

      for(uint n = 0; n < 16; n++)
      {
        s0 += 0x9e3779b9;
        v0 += ((v1 << 4) + 0xa341316c) ^ (v1 + s0) ^ ((v1 >> 5) + 0xc8013ea4);
        v1 += ((v0 << 4) + 0xad90777d) ^ (v0 + s0) ^ ((v0 >> 5) + 0x7e95761e);
      }

      return v0;
    }

    // 生成一个在 [0, 2^24) 范围中的无符号整型随机值，并初始化之前的（prev）随机数生成器
    // 使用的是数值分析的线性同余生成器（Numerical Recipes linear congruential generator）
    // 知乎上有一位大佬提到了该算法：https://www.zhihu.com/question/34515945/answer/59082990
    uint lcg(inout uint prev)
    {
      uint LCG_A = 1664525u;
      uint LCG_C = 1013904223u;
      prev       = (LCG_A * prev + LCG_C);
      return prev & 0x00FFFFFF;
    }

    // 生成一个在 [0, 1) 范围中的单精度浮点型随机，并初始化之前的（prev）随机数生成器
    float rnd(inout uint prev)
    {
      return (float(lcg(prev)) / float(0x01000000));
    }

帧序
####################

当前我们的抖动示例将会累积每一帧数据，所以我们需要知道当前的渲染帧。一个帧序为 ``0`` 的话表示一个新帧，我们将会积累更大帧序的数据。

.. note:: ``uniform`` 图片是可写可读的，这使得积累之前的帧数据成为可能。

在 ``shaders/host_device.h`` 下的 ``PushConstantRay`` 结构体中增加帧序成员：

.. code:: glsl

    struct PushConstantRay
    {
      vec4  clearColor;
      vec3  lightPosition;
      float lightIntensity;
      int   lightType;
      int   frame;
    };

随机并抖动
####################

在 ``raytrace.rgen`` 中的 ``main()`` 开头，初始化随机种子：

.. code:: glsl

    // 初始化随机种子
    uint seed = tea(gl_LaunchIDEXT.y * gl_LaunchSizeEXT.x + gl_LaunchIDEXT.x, pcRay.frame);

除了帧序为 ``0`` 时我们从像素中心向外发射光线，其余帧序中我们需要使用两个随机数来将像素中的光线进行抖动。

.. code:: glsl

    float r1 = rnd(seed);
    float r2 = rnd(seed);
    // 子像素抖动: 每次在像素中的不同位置发射光想，以达到抗锯齿的目的
    vec2 subpixel_jitter = pcRay.frame == 0 ? vec2(0.5f, 0.5f) : vec2(r1, r2);

现在我们只需要改变像素中心的计算方式即可：

.. code:: glsl

    const vec2 pixelCenter = vec2(gl_LaunchIDEXT.xy) + subpixel_jitter;

存储或更新
####################

在 ``main()`` 函数结束处，如果帧序为 ``0`` 的话，我们直接将结果写入目标图片。否则我们参考之前的帧来生成新结果并写入目标图片。

.. code:: glsl

    // 随着时间积累
    if(pcRay.frame > 0)
    {
      float a         = 1.0f / float(pcRay.frame + 1);
      vec3  old_color = imageLoad(image, ivec2(gl_LaunchIDEXT.xy)).xyz;
      imageStore(image, ivec2(gl_LaunchIDEXT.xy), vec4(mix(old_color, prd.hitValue, a), 1.f));
    }
    else
    {
      // 将第一帧写入目标图片中
      imageStore(image, ivec2(gl_LaunchIDEXT.xy), vec4(prd.hitValue, 1.f));
    }

更新应用帧
####################

我们需要增加当前的渲染帧，但是当场景中发生变化时我们也需要重新设置渲染帧。

在 ``HelloVulkan`` 类中增加两个新函数：

.. code:: c++

    void resetFrame();
    void updateFrame();

在 ``updateFrame`` 中，当相机发生变化时重置帧序，否则累积帧序。

.. code:: c++

    //--------------------------------------------------------------------------------------------------
    // 如果相机的矩阵或FOV发生改变，重置。否则累积帧序
    void HelloVulkan::updateFrame()
    {
      static nvmath::mat4f refCamMatrix;
      static float         refFov{CameraManip.getFov()};

      const auto& m   = CameraManip.getMatrix();
      const auto  fov = CameraManip.getFov();

      if(memcmp(&refCamMatrix.a00, &m.a00, sizeof(nvmath::mat4f)) != 0 || refFov != fov)
      {
        resetFrame();
        refCamMatrix = m;
        refFov       = fov;
      }
      m_pcRay.frame++;
    }

在 ``resetFrame`` 将被调用并在 ``updateFrame`` 累积帧序之前， ``resetFrame`` 将会将帧序设置为 ``-1`` ：

.. code:: c++

    void HelloVulkan::resetFrame()
    {
      m_pcRay.frame = -1;
    }

在 ``HelloVulkan::raytrace`` 一开始调用：

.. code:: c++

    updateFrame();

现在当激活光线追踪时将会进行图像抗锯齿。

在 ``HelloVulkan::onResize()`` 增加 ``resetFrame()`` 将会确保当当改变窗口大小时清空缓存。

当 UI 发生变化时帧重置
#######################

当场景的任意一个部分发生改变时帧序也需要进行重置，比如光照方向或者背景颜色。在 ``main.cpp`` 中的 ``renderUI()`` 中，当 ``UI`` 发生变化时重置帧序：

.. code:: c++

    void renderUI(HelloVulkan& helloVk)
    {
      bool changed = false;

      changed |= ImGuiH::CameraWidget();
      if(ImGui::CollapsingHeader("Light"))
      {
        auto& pc = helloVk.m_pushConstant;
        changed |= ImGui::RadioButton("Point", &pc.lightType, 0);
        ImGui::SameLine();
        changed |= ImGui::RadioButton("Infinite", &pc.lightType, 1);

        changed |= ImGui::SliderFloat3("Position", &pc.lightPosition.x, -20.f, 20.f);
        changed |= ImGui::SliderFloat("Intensity", &pc.lightIntensity, 0.f, 150.f);
      }

      if(changed)
        helloVk.resetFrame();
    }

品质
#######################

在积累了足够的采样后，渲染的质量已经算是相当的高了，此时避免进一步累积更多的图片将变的很有意义。

在 ``HelloVulkan`` 中增加一个成员变量：

.. code:: c++

    int m_maxFrames{100};

并且在 ``renderUI()`` 中增加对其的控制，确保 ``m_maxFrames`` 不能低于 ``1`` 。

.. code:: c++

    changed |= ImGui::SliderInt("Max Frames", &helloVk.m_maxFrames, 1, 100);

之后在 ``raytrace()`` 中，在紧接着 ``updateFrame()`` 之后，判断当前帧序是否超出了最大帧序。

.. code:: c++

    if(m_pcRay.frame >= m_maxFrames)
      return;

光线生成着色器中的多采样
##########################

为了提高效率，我们可以直接在光线生成着色器中进行多采样。这比多次调用 ``raytrace()`` 快很多。

为此，在 ``raytrace.rgen`` 中增加一个常量（也可以通过 ``push constant`` 块在应用端进行控制）。

.. code:: glsl

    const int NBSAMPLES = 10;

在 ``main()`` 中，初始化随机数种子之后，创建一个循环将 ``r1`` 和 ``r2`` 到 ``traceRayEXT`` 的代码调用包起来，并且累积 ``traceRayEXT`` 返回的颜色。在循环结束后，将累积的颜色除以采样数得到一个均值。

.. code:: glsl

    vec3 hitValues = vec3(0);

    for(int smpl = 0; smpl < NBSAMPLES; smpl++)
    {
      float r1 = rnd(seed);
      float r2 = rnd(seed);
      // ...
      // TraceRayEXT( ... );
      hitValues += prd.hitValue;
    }
    prd.hitValue = hitValues / NBSAMPLES;

对于给定的 ``m_maxFrames`` 和 ``NBSAMPLE`` ，图片将会有 :math:`m\_maxFrames \times NBSAMPLE` 的抗锯齿采样。

比如，如果 ``m_maxFrames = 10`` 并且 ``NBSAMPLE = 10`` ，这与使用 ``m_maxFrames = 100`` 并且 ``NBSAMPLE = 1`` 等价。

然而在光线生成着色器中使用 ``NBSAMPLE = 10`` 将会比在 ``NBSAMPLE = 1`` 的条件下调用 ``10`` 次 ``raytrace()`` 快很多。
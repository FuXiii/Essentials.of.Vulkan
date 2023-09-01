实例化
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/1 增加该扩展文档
    * 2023/9/1 增加 ``教程`` 章节
    * 2023/9/1 增加 ``多实例`` 章节
    * 2023/9/1 增加 ``多物体`` 章节


`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_instances

.. figure:: ../../../_static/NVIDIA_instances.png

    实例化结果示意图

教程
####################

该教程为 ``Vulkan`` `光线追踪教程 <../NVIDIAVulkanRayTracingTutorial.html>`_ 的扩展。

光线追踪可以一次性处理有很多物体的实体。对于一个实体，一个顶层加速结构中可以包含不同的底层加速结构。然而，当我们有很多不同的物体时，在内存分配上就会遇到问题。很多 ``Vulkan`` 驱动实现只支持最多 ``4096`` 个分配，当我们的程序每个物体创建 ``4`` 次分配（顶点，索引和材质），其中还包括一个底层加速结构。这就意味着当我们创建 ``1000`` 个物体时，这将会触及到分配上限。

多实例
####################

首先，让我们先来看看使用零星的几个物体构建多个实例的场景长什么样。

在 ``main.cpp`` 中，增加如下头文件：

.. code:: c++

    #include <random>

之后将 ``main()`` 中的 ``helloVk.loadModel`` 调用更改如下，这将会创建 ``cube`` 和 ``cube_multi`` 的实例。

.. code:: c++

    // 加载模型
    helloVk.loadModel(nvh::findFile("media/scenes/cube.obj", defaultSearchPaths, true));
    helloVk.loadModel(nvh::findFile("media/scenes/cube_multi.obj", defaultSearchPaths, true));
    helloVk.loadModel(nvh::findFile("media/scenes/plane.obj", defaultSearchPaths, true));

    std::random_device              rd;  // 用于获取用于随机引擎的种子
    std::mt19937                    gen(rd());  // rd() 的标准 mersenne_twister_engine 种子
    std::normal_distribution<float> dis(1.0f, 1.0f);
    std::normal_distribution<float> disn(0.05f, 0.05f);

    for(uint32_t n = 0; n < 2000; ++n)
    {
      float         scale = fabsf(disn(gen));
      nvmath::mat4f mat =
          nvmath::translation_mat4(nvmath::vec3f{dis(gen), 2.0f + dis(gen), dis(gen)});
      mat              = mat * nvmath::rotation_mat4_x(dis(gen));
      mat              = mat * nvmath::scale_mat4(nvmath::vec3f(scale));
      helloVk.m_instances.push_back({mat, n % 2});
    }

.. note:: 这将会创建 ``3`` 个 ``OBJ`` 模型和相应的实体，之后将会随机创建 ``2000`` 个绿色或各面异色的方盒实例。

多物体
####################

创建多个物体，而不是创建多个实例。

将上面的代码替换成如下：

.. code:: c++

    std::random_device              rd;  // 用于获取用于随机引擎的种子
    std::mt19937                    gen(rd());  // rd() 的标准 mersenne_twister_engine 种子
    std::normal_distribution<float> dis(1.0f, 1.0f);
    std::normal_distribution<float> disn(0.05f, 0.05f);
    for(int n = 0; n < 2000; ++n)
    {
      float         scale = fabsf(disn(gen));
      nvmath::mat4f mat   = nvmath::translation_mat4(nvmath::vec3f{dis(gen), 2.0f + dis(gen), dis(gen)});
      mat                 = mat * nvmath::rotation_mat4_x(dis(gen));
      mat                 = mat * nvmath::scale_mat4(nvmath::vec3f(scale));

      helloVk.loadModel(nvh::findFile("media/scenes/cube_multi.obj", defaultSearchPaths, true), mat);
    }

    helloVk.loadModel(nvh::findFile("media/scenes/plane.obj", defaultSearchPaths, true));

这样也是可以工作的，但是在加载 ``1363`` 个物体之后将会输出如下错误。 创建 ``1363`` 个之后的所有物体将会失败。

======== ================================================================================================================================
 Error	                                                       Error: VUID_Undefined
                              Number of currently valid memory objects is not less than the maximum allowed (4096).
======== ================================================================================================================================
  Note    This is the best case; the application can run out of memory and crash if substantially more objects are created (e.g. 20,000)
======== ================================================================================================================================
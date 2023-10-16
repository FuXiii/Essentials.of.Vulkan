可调用着色器
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/10/16 增加该扩展文档
    * 2023/10/16 增加 ``教程`` 章节
    * 2023/10/16 增加 ``数据存储`` 章节

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_callable

.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html

.. figure:: ../../../_static/callable.png

    可调用着色器结果示意图

教程
####################

该教程为 ``Vulkan`` `光线追踪教程`_ 的扩展。

实时光追支持在光线生成着色器、最近命中着色器、未命中着色器或者其他可调用着色器中使用 ``可调用着色器`` 。可调用着色器的调用有点类似间接函数的调用，不需要将这些着色器链接进可执行程序中。

数据存储
####################

可调用着色器只能够访问父阶段（可调用着色器的调用者）传进来的数据。且一次只能传递一个结构提数据并像负载那样声明。

在父阶段，使用 ``callableDataEXT`` 存储限定符声明传递的数据。比如：

.. code:: glsl

    layout(location = 0) callableDataEXT rayLight cLight;

其中 ``rayLight`` 结构体定义在共享文件中。

.. code:: glsl

    struct rayLight
    {
      vec3  inHitPosition;
      float outLightDistance;
      vec3  outLightDir;
      float outIntensity;
    };

并且在可调用着色器内部必须使用 ``callableDataInEXT`` 存储限定符声明传入的数据。

.. code:: glsl

    layout(location = 0) callableDataInEXT rayLight cLight;
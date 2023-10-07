相交着色器
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/10/7 增加该扩展文档
    * 2023/10/7 增加 ``教程`` 章节
    * 2023/10/7 增加 ``上层实现`` 章节
    * 2023/10/7 增加 ``创建所有隐式对象`` 章节

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_intersection#intersection-shader---tutorial

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

* 在底层加速结构中增加 :math:`2,000,000` 个轴对齐包围盒
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

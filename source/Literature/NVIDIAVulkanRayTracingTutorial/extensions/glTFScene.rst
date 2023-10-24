glTF 场景
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/10/24 增加该扩展文档
    * 2023/10/24 增加 ``教程`` 章节
    * 2023/10/24 增加 ``场景数据`` 章节

`文献源`_

.. _文献源: https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing_gltf

.. _光线追踪教程: ../NVIDIAVulkanRayTracingTutorial.html

.. figure:: ../../../_static/vk_ray_tracing_gltf_KHR.png

    glTF 场景光栅化结果示意图

教程
####################

该教程为对 ``Vulkan`` `光线追踪教程`_ 示例的修改。之前是加载单个的 ``OBJ`` 模型，在该示例中将会加载包含多个物体的 ``glTF`` 场景。

该示例并不是介绍如何渲染的，但是使用了比 ``OBJ`` 更加复杂的数据。

如果您想查阅更加完善的版本，请查阅：

* `vk_raytrace <https://github.com/nvpro-samples/vk_raytrace>`_
* `vk_shaded_gltfscene <https://github.com/nvpro-samples/vk_shaded_gltfscene>`_

场景数据
####################

对于 ``OBJ`` 模型加载的数据最终会存入四个缓存中：

* :bdg-secondary:`顶点缓存` 对于顶点位置、法线、纹理坐标和颜色的数组。
* :bdg-secondary:`索引缓存` 顶点的索引数组，每三个组成一个三角形。
* :bdg-secondary:`材质缓存` ``wavefront`` 材质。
* :bdg-secondary:`材质索引缓存` 每个三角形的材质索引。

由于 ``OBJ`` 模型可以有多个，所以对于这些缓存也可以有多个。

但对于 ``glTF`` 场景，为了方便，数据的组织有点不一样。相较于每个 ``OBJ`` 模型分别创建顶点、位置、法线和其他各种属性数缓存，在 ``glTF`` 中我们将场景中所有的几何体的顶点、索引和其他属性都分别存入相应的单一缓存中。
对于每个几何体本身使用对应的元素数量和偏移进行获取。

对于该示例，不再需要接下来对于 ``OBJ`` 的相关代码，将其移除：

.. code:: c++

    std::vector<ObjModel>    m_objModel;   // host 端的模型数据
    std::vector<ObjDesc>     m_objDesc;    // 用于设备获取模型描述信息
    std::vector<ObjInstance> m_instances;  // 场景模型的实体

在 ``host_device.h`` 中我们将增加新的数据结构： ``PrimMeshInfo`` ， ``SceneDesc`` 和 ``GltfShadeMaterial`` 。

.. code:: c++

    // 用于在最近命中着色器中获取图元信息
    struct PrimMeshInfo
    {
      uint indexOffset;
      uint vertexOffset;
      int  materialIndex;
    };

    // 场景的缓存地址
    struct SceneDesc
    {
      uint64_t vertexAddress;    // 顶点缓存地址
      uint64_t normalAddress;    // 法线缓存地址
      uint64_t uvAddress;        // 纹理坐标缓存地址
      uint64_t indexAddress;     // 索引缓存地址
      uint64_t materialAddress;  // 材质缓存地址 (GltfShadeMaterial)
      uint64_t primInfoAddress;  // 网格图元缓存地址 (PrimMeshInfo)
    };

同样， ``glTF`` 材质也用于光照渲染。该示例使用的是 ``glTF PBR`` 的简化版。如果您对完整的 ``PBR`` (基于物理的渲染) 感兴趣，可以阅览 `vk_raytrace <https://github.com/nvpro-samples/vk_raytrace>`_ 。

.. code:: glsl

    struct GltfShadeMaterial
    {
      vec4 pbrBaseColorFactor;
      vec3 emissiveFactor;
      int  pbrBaseColorTexture;
    };

同时为了存储场景分配的所有缓存，相关声明如下：

.. code:: c++

    nvh::GltfScene m_gltfScene;
    nvvk::Buffer   m_vertexBuffer;
    nvvk::Buffer   m_normalBuffer;
    nvvk::Buffer   m_uvBuffer;
    nvvk::Buffer   m_indexBuffer;
    nvvk::Buffer   m_materialBuffer;
    nvvk::Buffer   m_primInfo;
    nvvk::Buffer   m_sceneDesc;

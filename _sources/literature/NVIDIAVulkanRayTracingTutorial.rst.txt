NVIDIA Vulkan 光线追踪教程
=============================

.. admonition:: 更新记录
   :class: note

   * 2023/5/15 创建本文
   * 2023/5/15 增加 ``介绍`` 章节
   * 2023/5/15 增加 ``配置环境`` 章节
   * 2023/5/15 增加 ``生成解决方案`` 章节
   * 2023/5/17 增加 ``生成解决方案`` 章节
   * 2023/5/17 增加 ``编译和运行`` 章节
   * 2023/5/17 增加 ``开始步入光线追踪`` 章节

`文献源`_

.. _文献源: https://nvpro-samples.github.io/vk_raytracing_tutorial_KHR/

本文所提供的的代码和文档聚焦于使用 `VK_KHR_ray_tracing_pipeline <https://www.khronos.org/registry/vulkan/specs/1.2-extensions/html/vkspec.html#VK_KHR_ray_tracing_pipeline>`_ 扩展展示一个基础光追示例。
该教程从一个基于 ``Vulkan`` 开发的基础程序开始，并且提供一步步的介绍去修改和增加函数和功能。

.. figure:: ../_static/resultRaytraceShadowMedieval.png

    最终结果

.. admonition:: GitHub仓库
    :class: note

    https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR

介绍
####################

本教程重点介绍将光线跟踪添加到现有 ``Vulkan`` 应用中的步骤，并假设您对 ``Vulkan`` 有一定的了解。
对于像交换链管理、 ``Render Pass`` 等常见的组件已经封装在了 `C++ API helpers <https://github.com/nvpro-samples/nvpro_core/tree/master/nvvk>`_ 和
英伟达的 `nvpro-samples <https://github.com/nvpro-samples/build_all>`_ 框架中。这个框架包含很多高级示例，对于 ``Vulkan`` 和 ``OpenGL`` 最佳实践也在其中。
我们同时使用一个助手去生成光追的加速结构，我们会在本文中对其进行详细说明。

.. note:: 出于教育的目的，所有的代码都在分散一些很小的文件中。要将这些结合起来需要额外的抽象层级。

配置环境
####################

推荐的方式是通过 ``nvpro-samples`` 的 ``build_all`` 脚本去下载包括 ``NVVK`` 在内的工程。

在命令行中，从 https://github.com/nvpro-samples/build_all 中克隆 ``nvpro-samples/build_all`` 仓库：

.. code:: 

    git clone https://github.com/nvpro-samples/build_all.git

之后打开 ``build_all`` 文件夹并切执行 ``clone_all.bat`` ( ``Windows`` ) 或 ``clone_all.sh`` ( ``Linux`` )。

如果你希望克隆尽可能少的仓库，打开命令行，并且执行如下指令，只克隆您需要的仓库：

.. code:: 

    git clone --recursive --shallow-submodules https://github.com/nvpro-samples/nvpro_core.git
    git clone https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR.git

生成解决方案
********************

对于存储构建生成的解决方案，最经典的是在工程主目录下创建一个 ``build`` 文件夹。您可以是使用 ``CMake-GUI`` 或者如下指令生成目标工程：

.. code:: 

    cd vk_raytracing_tutorial_KHR
    mkdir build
    cd build
    cmake ..

.. note:: 
    
    如果您没有使用 ``Visual Studio 2019`` 或者更高版本，请确保 ``Visual Studio`` 中目标平台选择的是 ``x64`` 平台。
    对于 ``Visual Studio 2019`` 来说默认是 ``x64`` 平台，但老版本就不一定了。

工具安装
********************

我们需要一张支持 ``VK_KHR_ray_tracing_pipeline`` 扩展的显卡。对于英伟达的图形卡，您需要最起码是 ``2021年`` 或之后的 `Vulkan驱动 <https://developer.nvidia.com/vulkan-driver>`_ 。

该工程最低需要 `Vulkan SDK <https://vulkan.lunarg.com/sdk/home>`_ 的版本为 ``1.2.161``。该工程是使用 ``1.2.182.0`` 进行测试的。

编译和运行
####################

打开位于 ``build`` 目录下的解决方案，之后编译并运行 `vk_ray_tracing__before_KHR <https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/tree/master/ray_tracing__before>`_ 。

该示例将会是此教程的示例起点。这是一个用于加载 ``OBJ`` 文件并使用 ``Vulkan`` 光栅化渲染他们的小框架。您可以通过阅读 `Base Overview <https://github.com/nvpro-samples/vk_raytracing_tutorial_KHR/blob/master/ray_tracing__before/README.md#nvidia-vulkan-ray-tracing-tutorial>`_ 来纵观该示例是如何实现的。
我们将使用这个框架加载几何体并且渲染场景来实现光线追踪。

.. figure:: ../_static/resultRasterCube.png

    首次执行

接下来的步骤将是修改 ``vk_ray_tracing__before_KHR`` 使其支持光线追踪。该教程修改后的最终结果将是同 ``vk_ray_tracing__simple_KHR`` 一样。如果开发过程发生错误
可以看看该工程。

``vk_ray_tracing__simple_KHR`` 工程将会作为额外教程的起点进行开发讲解。

开始步入光线追踪
####################
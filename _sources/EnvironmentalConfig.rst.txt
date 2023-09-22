环境配置
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/22 增加该扩展文档
    * 2023/9/22 增加 ``获取 Vulkan-Headers`` 章节
    * 2023/9/22 增加 ``环境配置`` 章节

在开始真正开发学习 ``Vulkan`` 前，需要配置一下必要的开发环境。

在开始配置环境前，您只需要获取 `Vulkan-Headers <https://github.com/KhronosGroup/Vulkan-Headers>`_ 即可：


获取 Vulkan-Headers
#####################

``Vulkan-Headers`` 是 ``Khronos`` 组织官方发布的 ``Vulkan`` 头文件项目。该项目包含最新版的 ``Vulkan`` 头文件。

.. figure:: ./_static/vulkan_headers_download.png

如图，依次点击 :menuselection:`Code --> Download ZIP` 将其下载下来。

.. admonition:: Git 下载
    :class: note

    如果您安装了 ``Git`` ，还可以通过 ``Clone`` 指令下载：

    .. code::

        git clone git@github.com:KhronosGroup/Vulkan-Headers.git


其中的 ``include`` 文件夹就是我们需要的 ``Vulkan`` 头文件。

环境配置
#####################

.. tab-set::

    .. tab-item:: Windows

        在 ``Windows`` 操作系统中开发，主要是使用 `Visual Studio <https://visualstudio.microsoft.com/>`_ 进行开发。您需要下载并安装 ``Visual Studio`` 。

        .. note:: 这里使用英文版的 ``Visual Studio 2019`` 进行讲解，其他版本的 ``Visual Studio`` 都是可以的，这里的配置步骤都是通用的。

        1. 创建一个 ``C/C++`` 的空项目

        .. figure:: ./_static/vs_create_empty_project.png

        2. 配置项目

        .. figure:: ./_static/vs_create_vulkan_project.png

        这里的 ``Project name`` 项目名称和 ``Location`` 项目目录可以自己配置。

        之后点击 ``Create`` 创建项目即可。

        3. 打开项目的 ``Solution Explorer`` 面板

        .. figure:: ./_static/vs_solution_explorer.png

        如果没找到，依次点击菜单栏中的 :menuselection:`View --> Solution Explorer` 即可。

        .. figure:: ./_static/vs_solution_explorer_menu.png

        待续

    .. tab-item:: Linux

        待续
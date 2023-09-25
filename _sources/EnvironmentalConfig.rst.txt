环境配置
======================================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/22 增加该扩展文档
    * 2023/9/22 增加 ``获取 Vulkan-Headers`` 章节
    * 2023/9/22 增加 ``环境配置`` 章节
    * 2023/9/25 更新 ``环境配置`` 章节中的 ``Windows`` 配置

.. |vs_new_line| image:: ./_static/vs_new_line.png
    :width: 1em

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

        4. 在项目上的 ``Source Files`` 上 :kbd:`右键` 依次点击 :menuselection:`Add --> New Item` 选项

        .. figure:: ./_static/vs_new_item.png

        5. 在 ``Add New Item`` 页面中依次点击 :menuselection:`C++ File(.cpp) --> Name(将 Source.cpp 修改为 main.cpp) --> Add` 选项

        .. figure:: ./_static/vs_create_main_cpp.png

        这样就在 ``Source Files`` 下创建了一个 ``main.cpp`` 文件。

        .. figure:: ./_static/vs_main_cpp_file.png

        6. 在项目上 :kbd:`右键` 点击 :menuselection:`Properties` 选项，打开 ``Properties`` 页面。

        .. figure:: ./_static/vs_project_properties.png

        7. 在 ``Properties`` 页面中依次点击 :menuselection:`Configuration Properties --> C/C++ --> General --> Additional Include Directions --> ∨ --> <Edit...>` ，打开头文件目录配置页面。

        .. figure:: ./_static/vs_additional_include_directions.png

        .. admonition:: 注意
            :class: note

            需要确保红框中对应的配置参数一致（这里使用输出 ``Debug`` 调试目标， ``x64`` 平台）。

            .. figure:: ./_static/vs_config_uniform.png

        8. 在红框空白处 :kbd:`双击` 或点击右上角的 |vs_new_line| 。将 ``Vulkan-Headers`` 的 ``include`` 文件夹目录配置进来。

        .. figure:: ./_static/vs_add_include_header_dir.png

        9. 配置完成后点击 :menuselection:`OK` 完成头文件目录配置。

        .. figure:: ./_static/vs_vulkan_headers.png

        10. 回到 ``Properties`` 页面点击 :menuselection:`Apply` 完成配置

        .. figure:: ./_static/vs_apply_header.png

    .. tab-item:: Linux

        待续
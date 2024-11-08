Vulkan 三角形
===================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/11/7 增加该文章
   * 2024/11/8 更新该文章

.. card:: Vulkan 三角形
   :link: https://github.com/FuXiii/VulkanTriangle/archive/refs/heads/main.zip
   :shadow: lg
   :text-align: center

   点击下载源码

   +++
    .. figure:: ../_static/VulkanTriangle/vulkan_triangle.png
        :scale: 50

.. admonition:: 项目要求
    :class: note

    * ``CMake``
    * ``C/C++`` 的编译环境
    * ``Vulkan 运行时`` （一般系统都默认自带）

.. admonition:: 支持平台
    :class: tip

    * ``Windows``
    * ``Linux``

1. 下载并解压
2. 在同级目录下创建 ``build`` 文件夹

.. figure:: ../_static/VulkanTriangle/create_build_folder.png

    创建 build 文件夹

3. 命令行定位到 ``build`` 文件夹，执行如下指令：

.. code-block:: console

    cmake ..

4. 编译生成可执行程序

.. tab-set::

    .. tab-item:: Visual Studio

        打开 ``build`` 文件夹下的 ``.sln`` 文件，编译执行即可。

    .. tab-item:: Linux

        命令行中执行如下指令即可：

        .. code-block:: console

            make

.. figure:: ../_static/VulkanTriangle/vulkan_triangle.png
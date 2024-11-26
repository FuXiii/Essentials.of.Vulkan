Vulkan 三角形
===================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/11/7 增加该文章
   * 2024/11/8 更新该文章
   * 2024/11/15 更新该文章。增加编译流程说明和 ``MacOS`` 适配。
   * 2024/11/18 增加 ``更新日志`` 章节。
   * 2024/11/18 增加 ``讲解`` 章节。
   * 2024/11/26 更新 ``更新日志`` 章节。

.. sidebar::

   .. image:: ../_static/VulkanTriangle/vulkan_triangle.png

.. card:: Vulkan 三角形
   :link: https://github.com/FuXiii/VulkanTriangle/archive/refs/heads/main.zip
   :shadow: lg
   :text-align: center
   
   点击下载源码
   +++

   .. raw:: html

    <p style="border: 2px solid #18181a; /* 设置边框 */border-radius: 10px; /* 设置圆角的半径 */padding: 5px; /* 设置内边距 */margin: 10px; /* 设置外边距 */">
    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" width="16" height="16">
        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z">https://github.com/FuXiii/VulkanTriangle</path>
    </svg>
    https://github.com/FuXiii/VulkanTriangle
    </p>

.. admonition:: 项目要求
    :class: note

    * ``CMake``
    * ``C/C++`` 的编译环境
    * ``Vulkan 运行时`` （一般系统都默认自带）

.. admonition:: 支持平台
    :class: tip

    * ``Windows``
    * ``Linux``
    * ``MacOS``

0. 配置环境

.. tab-set::

    .. tab-item:: Windows

        ``Visual Studio``

    .. tab-item:: Linux

        命令行中执行如下指令：

        .. code-block:: console

            sudo apt-get install libxrandr-dev
            sudo apt-get install libxinerama-dev
            sudo apt-get install libxcursor-dev
            sudo apt-get install libxi-dev
            sudo apt-get install freeglut3-dev
    
    .. tab-item:: MacOS

        命令行中执行如下指令：

        .. code-block:: console

            brew install libxrandr
            brew install libxinerama
            brew install libxcursor
            brew install libxi
            brew install freeglut

1. 下载并解压
2. 在同级目录下创建 ``build`` 文件夹

.. figure:: ../_static/VulkanTriangle/create_build_folder.png

    创建 build 文件夹

3. 命令行定位到 ``build`` 文件夹，执行如下指令：

.. code-block:: console

    cmake ..

4. 编译生成可执行程序

.. tab-set::

    .. tab-item:: Windows

        使用 ``Visual Studio`` 打开 ``build`` 文件夹下的 ``.sln`` 文件，编译执行即可。

    .. tab-item:: Linux

        命令行中执行如下指令即可：

        .. code-block:: console

            make

    .. tab-item:: MacOS

        命令行中执行如下指令即可：

        .. code-block:: console

            cmake --build .


.. dropdown:: 更新日志

    .. admonition:: 2024/11/25
        :class: note
    
        * 完全动态适配 ``Swapchain`` 纹素格式和空间，而不是单独选配某些格式。

    .. admonition:: 2024/11/22
        :class: note
    
        * 增加动态适配 ``Swapchain`` 纹素的格式和空间，而不是写死。

    .. admonition:: 2024/11/18
        :class: note
    
        * 适配 ``Swapchain`` 大小改变。
        * 优化代码结构。
    
    .. admonition:: 2024/11/15
        :class: note
    
        * ``macOS`` 平台成功编译（由于本人没有苹果环境，没有执行测试，只能得到是否编译成功）。
        
    .. admonition:: 2024/11/14
        :class: note
    
        * 动态判断加载 ``Layer`` 和 ``Extension`` 。
        * 适配了一版 ``苹果`` 系统，还未进行测试，不知是否可行。
        
    .. admonition:: 2024/11/13
        :class: note
    
        * 成功适配 ``Deepin V23`` （ ``Linux`` ）。

讲解
#########

.. admonition:: 备注
    :class: warning

    未完待续
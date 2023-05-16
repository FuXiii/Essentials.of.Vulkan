开始于 Vulkan SDK
===================

.. admonition:: 更新记录
   :class: note

   * 2023/5/16 增加该文章
   * 2023/5/16 增加 ``安装 Vulkan SDK`` 章节
   * 2023/5/16 增加 ``验证安装`` 章节
   * 2023/5/16 增加 ``SDK的版本`` 章节
   * 2023/5/16 增加 ``Vulkan Loader`` 章节
   * 2023/5/16 增加 ``Vulkan的版本`` 章节
   * 2023/5/16 增加 ``Vulkan的库`` 章节
   * 2023/5/16 增加 ``Vulkan的头文件`` 章节

``Khronos`` 这次推出了 ``Vulkan`` 官方的软件开发工具包 `Vulkan SDK <https://vulkan.lunarg.com/home/welcome>`_ ，这避免了像 ``OpenGL`` 开发环境混乱的情形再次上演。

目前 ``Vulkan`` 支持如下平台：

* Windows
* Linux
* MacOS
* Android

下载对应平台的安装包，安装即可。

.. important:: 
   
   ``Vulkan SDK`` 并不会安装硬件设备的 ``Vulkan`` 驱动！！仅仅提供用于应用开发和调试的工具和库，如果您在尝试安装驱动，请移步至对应硬件设备供应商的官网处获取驱动。

安装 Vulkan SDK
####################

.. hint:: 
   
   本人目前只完整适配过 ``Windows`` 和 ``Linux`` 系统，主要以这两个操作系统讲解。
   有关 ``Android`` 的适配应该和 ``Linux`` 是相通的， ``MacOS`` 没适配，苹果的电脑太贵了。 ┑(￣Д ￣)┍

   对于 ``Android`` 和  ``MacOS`` 有适配过的小伙伴，欢迎分享~ ꒰'ꀾ'꒱ 。

* 对于 ``Windows`` 操作系统

   ``Vulkan SDK`` 是一个自解压安装包，运行下载的可执行文件即可。默认的安装地址为 ``C:\VulkanSDK\version`` 。

   .. note::

      如果你已经下载安装了一个或多个新版的 ``Vulkan SDK`` （ ``1.2.189.1`` 或是更新的版本 ），此时如果您需要安装一个老版本的 ``Vulkan SDK`` （早于 ``1.2.189.1``）的话，
      您必须将最近安装的 ``Vulkan SDK`` 卸载掉，可以使用 ``Windows`` 系统的控制面板的应用管理进行卸载，或是通过 ``Vulkan SDK`` 安装目录下的
      ``maintenancetool.exe`` 进行卸载。

   ``Vulkan SDK`` 安装之后将会将安装目录作为 ``VULKAN_SDK`` 的变量添加到环境变量中，并且也会将 ``%VULKAN_SDK%\Bin`` 目录添加到系统的 ``PATH`` 环境变量中。同时也会增加
   ``VK_SDK_PATH`` 环境变量，其值和 ``VULKAN_SDK`` 环境变量是一样的。

   .. note::

      一些程序和命令行环境在没有重新启动时可能获取不到 ``Vulkan SDK`` 相关的环境变量。

* 对于 ``Linux`` 操作系统

   ``Vulkan SDK`` 是一个压缩文件，将其解压出来放到任意您想放到的位置即可。

   1. 创建一个文件夹，用于存放安装的 ``Vulkan SDK`` 。假如这个文件夹叫 ``vulkan``，在您的 ``HOME`` 目录下。
   
      .. code:: console

         cd ~
         mkdir vulkan
         cd vulkan

   2. 使用 ``sha256sum`` 检查下载的压缩文件的完整性。假如压缩包下载到了 ``$HOME/Downloads``。

      .. code:: console

         sha256sum $HOME/Downloads/vulkansdk-linux-x86_64-1.x.yy.z.tar.gz

   3. 解压 ``Vulkan SDK`` 压缩包。假如压缩包下载到了 ``$HOME/Downloads``。

      .. code:: console

         tar xf $HOME/Downloads/vulkansdk-linux-x86_64-1.x.yy.z.tar.gz

   4. 如果没有安装运行时依赖，安装之。

      Ubuntu 22.04:

      .. code:: console

         sudo apt install qtbase5-dev libxcb-xinput0 libxcb-xinerama0

      Ubuntu 20.04:

      .. code:: console

         sudo apt install qt5-default libxcb-xinput0 libxcb-xinerama0

      Fedora:

      .. code:: console

         sudo dnf install qt xinput libXinerama

      Arch Linux:

      .. code:: console

         sudo pacman -S qt5-base libxcb libxinerama

   与 ``Windows`` 系统不同的是， ``Linux`` 的环境变量需要自己手动设置。要设置的环境变量如下表所示，其中 ``VULKAN_SDK`` 环境变量是安装 ``Vulkan SDK`` 的目录（比如 ``~/vulkan/1.x.yy.z/x86_64`` ），剩下的
   环境变量路径都相对于 ``VULKAN_SDK`` 路径。

   ======================  =========================================
     环境变量               文件/路径
   ======================  =========================================
   ``PATH``                 ``$VULKAN_SDK/bin``
   ``LD_LIBRARY_PATH``      ``$VULKAN_SDK/lib``
   ``VK_LAYER_PATH``        ``$VULKAN_SDK/etc/vulkan/explicit_layer.d``
   ``VK_ADD_LAYER_PATH``    ``$VULKAN_SDK/etc/vulkan/explicit_layer.d``
   ======================  =========================================

   使用 ``source`` 指令去加载设置环境变量脚本：

   .. code:: console

      source ~/vulkan/1.x.yy.z/setup-env.sh
   
   .. note::

      ``x`` 、``yy`` 和 ``z`` 是解压出来的 ``Vulkan SDK`` 对应版本。

   或者可以自己手动设置环境变量：

   .. code:: console

      export VULKAN_SDK=~/vulkan/1.x.yy.z/x86_64
      export PATH=$VULKAN_SDK/bin:$PATH
      export LD_LIBRARY_PATH=$VULKAN_SDK/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}
      export VK_LAYER_PATH=$VULKAN_SDK/etc/vulkan/explicit_layer.d

   .. admonition:: 永久性设置 ``Vulkan SDK`` 环境变量
      :class: note

      以上的两种方式为临时设置环境变量，当更换或重启控制台、重启计算机都会使之前设置的环境变量失效。
      如果想要永久性设置环境变量，请参考对应 ``shell`` 或桌面文档，不同系统有些许区别。比如在大多数 ``Ubuntu`` 的桌面系统中，在 ``.profile`` 文件中增加
      ``setup-env.sh`` 文件的源，用于设置永久性环境变量，该环境变量之后就可以全局使用而不需要单独配置。

   对于卸载 ``Vulkan SDK`` 仅通过删除 ``Vulkan SDK`` 解压安装的文件夹即可，例如：

   .. code:: console

      rm -rf ~/vulkan/1.x.yy.z

验证安装
####################

安装完 ``Vulkan SDK`` ，并配置完环境变量后，打开终端命令行程序，运行：

.. code:: console

   vkcube

你将会看到一个旋转的方盒子，说明安装配置成功。

.. figure:: _static/vkcube.png

   vkcube

SDK的版本
####################

安装的 ``SDK`` 版本是由其中发布的 ``Vulkan`` 头文件的 ``Vulkan`` 版本所决定的， ``SDK`` 版本号的组成结构为 ``主版本号.副版本号.补丁版本号.修订版本号`` 。
最后的修订版本号代指同一 ``Vulkan`` 头文件版本下 ``SDK`` 的修订版本，一般用于在同一 ``Vulkan`` 版本中发布多个 ``SDK`` 时使用。
比如 ``SDK`` 的版本为 ``1.1.70.0`` 意味着此 ``SDK`` 使用的 ``Vulkan`` 头文件版本为 ``1.1.70``

.. note::

   ``SDK`` 的版本版本内容是向下兼容的，新版本的 ``SDK`` 支持老版本的内容，而反过来则不行。比如 ``1.1.130.0`` 的 ``SDK`` 可以用于开发 ``Vulkan 1.0`` 和 ``Vulkan 1.1`` 而不能开发 ``Vulkan 1.2`` 的功能。
   还有就是， ``SDK`` 的版本并不一定显示什么版本就能用什么版本开发，具体支持什么版本的 ``Vulkan`` ，需要从设备驱动中获取返回该设备支持的 ``Vulkan`` 版本，才能知道可以使用什么版本的 ``Vulkan`` 的功能 ，比如你下安装了支持 ``Vulkan 1.3`` 的 ``SDK`` ，
   而硬件设备驱动返回其仅支持 ``Vulkan 1.0`` ，则你可以使用此 ``Vulkan 1.3`` 的 ``SDK`` 开发 ``Vulkan 1.0`` 的功能。

Vulkan Loader
####################

之前说过可以通过硬件设备驱动获取设备支持的 ``Vulkan`` 版本，在 ``Vulkan`` 中这是通过调用 ``Vulkan`` 标准函数 ``vkGetPhysicalDeviceProperties`` 函数获取到的，之前说过 ``Vulkan`` 统一了函数获取方式，对于 ``vkGetPhysicalDeviceProperties`` 是通过
``Vulkan Loader`` 获取到的。顾名思义 ``Vulkan Loader`` 就是用于获取 ``Vulkan`` 标准函数的模块， ``Vulkan`` 中所有的标准函数都是通过 ``Vulkan Loader`` 获取到。

那 ``Vulkan Loader`` 是什么？具体长什么样呢？在哪里能找到？

其实 ``Vulkan Loader`` 就是一个动态库，和常见的动态库没什么区别，在 ``Windows`` 操作系统中为 ``vulkan-1.dll``，在 ``Linux`` 操作系统中为 ``libvulkan.so.1`` 或 ``libvulkan.so``，一般都在系统目录下 。
``Vulkan Loader`` 实现了 ``Vulkan API`` 入口，并且管理 ``Layers``，扩展，和驱动。

.. admonition:: Layer
   :class: note

   在 ``Vulkan`` 是 ``Vulkan Loader`` 的一种插件，一般用于为应用开发提供验证和函数调试，用于检查您开发的程序哪里出现了错误，并及时给出提示。
  
如果系统中安装了支持 ``Vulkan`` 的驱动或安装了 ``Vulkan SDK`` 的话， 就会有 ``Vulkan`` 的运行时，该运行时自身就有 ``Vulkan Loader`` 的动态库。如果系统没有找到 ``Vulkan`` 的运行时的话，可以从
`Vulkan SDK <https://vulkan.lunarg.com/home/welcome>`_ 官方网页获取最新的 ``Vulkan Runtime``。

.. note::

   ``Vulkan`` 的运行时一般不需要单独下载安装，一般操作系统都自带该运行时。也就是操作系统一般都自带 ``Vulkan Loader`` 。

Vulkan的版本
####################

一旦系统中安装了支持 ``Vulkan`` 的驱动


Vulkan的库
####################


Vulkan的头文件
####################

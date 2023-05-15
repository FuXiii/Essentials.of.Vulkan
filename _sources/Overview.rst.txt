纵览
================

.. admonition:: 更新记录
   :class: note

   * 2023/5/15 增加该文章
   * 2023/5/15 增加 ``开始于 Vulkan SDK`` 章节
   * 2023/5/15 增加 ``SDK的版本`` 章节
   * 2023/5/15 增加 ``Vulkan的版本`` 章节
   * 2023/5/15 增加 ``Vulkan Loader`` 章节


开始于 Vulkan SDK
####################

``Khronos`` 这次推出了 ``Vulkan`` 官方的软件开发工具包 `Vulkan SDK <https://vulkan.lunarg.com/home/welcome>`_ ，这避免了像 ``OpenGL`` 开发环境混乱的情形再次上演。

目前 ``Vulkan`` 支持如下平台：

* Windows
* Linux
* MacOS
* Android

下载对应平台的安装包，安装即可。

SDK的版本
********************

安装的 ``SDK`` 版本是由其中发布的 ``Vulkan`` 头文件的 ``Vulkan`` 版本所决定的，该版本号的组成结构为 ``主版本号.副版本号.补丁版本号.修订版本号`` 。
最后的修订版本号代指同一 ``Vulkan`` 头文件版本下 ``SDK`` 的修订版本，一般用于在同一 ``Vulkan`` 版本中发布多个 ``SDK`` 时使用。
比如 ``SDK`` 的版本为 ``1.1.70.0`` 意味着此 ``SDK`` 使用的 ``Vulkan`` 头文件版本为 ``1.1.70``

.. note::

   ``SDK`` 的版本版本内容是向下兼容的，新版本的 ``SDK`` 支持老版本的内容，而反过来则不行。比如 ``1.1.130.0`` 的 ``SDK`` 可以用于开发 ``Vulkan 1.0`` 和 ``Vulkan 1.1`` 而不能开发 ``Vulkan 1.2`` 的功能。
   还有就是， ``SDK`` 的版本并不一定显示什么版本就能用什么版本开发，具体支持什么版本的 ``Vulkan`` ，需要从设备驱动中获取返回支持的 ``Vulkan`` 版本，才能知道支持什么版本的 ``Vulkan`` ，比如你下安装了支持 ``Vulkan 1.3`` 的 ``SDK`` ，
   而硬件设备驱动返回其仅支持 ``Vulkan 1.0`` ，则你可以使用此 ``Vulkan 1.3`` 的 ``SDK`` 开发 ``Vulkan 1.0`` 的功能。

Vulkan Loader
********************

之前说过可以通过硬件设备驱动获取设备支持的 ``Vulkan`` 版本，在 ``Vulkan`` 中这是通过调用 ``Vulkan`` 标准函数 ``vkGetPhysicalDeviceProperties`` 获取到的，之前说过 ``Vulkan`` 统一了函数获取方式，对于 ``vkGetPhysicalDeviceProperties`` 是通过
``Vulkan Loader`` 获取到的（其实 ``Vulkan`` 中所有的标准函数都是通过 ``Vulkan Loader`` 获取到）

Vulkan的版本
********************

一旦系统中安装了支持 ``Vulkan`` 的驱动
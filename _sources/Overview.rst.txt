纵览
================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2023/5/15 增加该文章
   * 2023/5/16 将 ``开始于 Vulkan SDK`` 章节的内容移动至单独 ``开始于 Vulkan SDK`` 文章中
   * 2023/6/23 更新该文档
   * 2023/6/23 增加 ``Vulkan 能为我们做什么`` 章节
   * 2023/6/23 增加 ``获取 Vulkan 接口`` 章节
   * 2023/6/23 增加 ``vkGetInstanceProcAddr`` 章节

由于 ``Vulkan`` 比较复杂，为了更好的入门 ``Vulkan`` ，还是大致过一遍 ``Vulkan`` 的核心思路，这对以后的学习很有帮助。

Vulkan 能为我们做什么
######################

``Vulkan`` 最主要的任务就是为我们提供了 ``GPU`` 并行计算的接口。是的 ``Vulkan`` 仅仅只是规定了一套接口，其并没有接口的具体实现，而实现是需要硬件厂商自己适配实现，所以市面上并不是所有硬件设备都支持 ``Vulkan`` 。像 ``NVIDIA`` 、 ``AMD`` 和 ``Intel`` 等国际大厂基本提供了完整的 ``Vulkan``
核心标准接口。而像国产的后起之秀 `摩尔线程 <https://www.mthreads.com/>`_ 也在努力适配 ``Vulkan`` 标准（ :bdg-warning:`景嘉微你要加油啊`）。由于标准的实现都是自家的，所以每家厂商都可以根据自家设备的特点进行优化和扩展，这样在提供 ``Vulkan`` 核心功能的基础上也推出了自家的扩展功能，而扩展功能往往是该设备的卖点（比如硬件实时光线追踪扩展功能）。

而在使用 ``Vulkan`` 时，相比于标准，我们往往更关注于 ``Vulkan`` 所提供的功能，主要的功能如下：

* 光栅化渲染
* 实时光线追踪
* 视频编解码
* （通用）并行计算

其中 ``光栅化渲染`` 应该是最主要的功能了（同时也是 ``Vulkan`` 的核心功能）。该章节也主要以 ``光栅化渲染`` 为核心进行纵览。

获取 Vulkan 接口
######################

由于 ``Vulkan`` 只是一套标准，具体的实现都在硬件驱动中，为了能够使用 ``Vulkan`` 驱动硬件设备，我们需要获取驱动中 ``Vulkan`` 标准实现的接口。

``Vulkan`` 中提供了 ``Vulkan Loader`` 进行 ``Vulkan`` 标准实现接口的获取。根据前文介绍我们知道 ``Vulkan Loader`` 对应着 ``Vulkan`` 的动态库，所以我们第一步就是加载 ``Vulkan`` 的动态库。

.. admonition:: ``Vulkan`` 的动态库
   :class: note

   ``Windows`` 操作系统上 ``Vulkan`` 的动态库为 ``vulkan-1.dll`` ，而 ``Linux`` 上的为 ``libvulkan.so.1`` 或 ``libvulkan.so`` 。

* ``Windows`` 加载 ``Vulkan`` 动态库如下：

.. code:: c++

   #include <Windows.h>

   HMODULE library = LoadLibraryA("vulkan-1.dll");

* ``Linux`` 加载 ``Vulkan`` 动态库如下：

.. code:: c++

   #include <dlfcn.h>

   void *library = dlopen("libvulkan.so.1", RTLD_NOW | RTLD_LOCAL);
   if (!library)
   {
       library = dlopen("libvulkan.so", RTLD_NOW | RTLD_LOCAL);
   }

之后我们就可以从加载的动态库中获取 ``Vulkan`` 的函数了，但是在获取 ``Vulkan`` 函数前我们需要先介绍一下 ``Vulkan`` 中函数的分类：

* :bdg-secondary:`Instance 域函数` 主要是通过 ``vkGetInstanceProcAddr`` 函数接口获取，该类函数大部分与 ``VkInstance`` 进行交互。主要是获取一些与设备不相关与环境相关的函数。
* :bdg-secondary:`PhysicalDevice 域函数` 主要是通过 ``vkGetInstanceProcAddr`` 函数接口获，该类函数大部分与 ``VkPhysicalDevice`` 进行交互。主要是一些获取硬件设备相关信息的函数。
* :bdg-secondary:`Device 域函数` 主要是通过 ``vkGetDeviceProcAddr`` 函数接口获，该类函数大部分与 ``VkDevice`` 进行交互。主要是获取一些与硬件设备相关的功能函数。

.. admonition:: PhysicalDevice 域函数
   :class: note

   在 ``Vulkan`` 标准中并没有所谓的 ``PhysicalDevice`` 域函数，在 ``Vulkan`` 标准中只分为 ``Instance`` 域函数和 ``Device`` 域函数，但是在实际使用中由于 ``PhysicalDevice`` 域函数的特殊性是确确实实可以单独拎出来的，只不过在 ``Vulkan`` 标准中 ``PhysicalDevice`` 域函数归到了 ``Instance`` 域函数中。

.. admonition:: vkGetInstanceProcAddr 和 Device 域函数
   :class: note

   在 ``Vulkan`` 中并没有禁止用户使用 ``vkGetInstanceProcAddr`` 获得 ``Device`` 域函数，但这是不推荐的，当有多个硬件设备时会造成模棱两可的函数获取。比如电脑上插着两个显卡，一个是摩尔线程的的一个是景嘉微的，这两个设备都支持绘制函数 ``vkCmdDraw`` 函数 ，但是到底获取的是哪个设备的实现是由 ``Vulkan Loader`` 定义的，用户并不能知道返回的函数是哪个设备的实现。

vkGetInstanceProcAddr
************************

在 ``Vulkan`` 中获取 ``Instance`` 域函数，提供了统一的 ``vkGetInstanceProcAddr`` 函数获取接口，如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef void (VKAPI_PTR *PFN_vkVoidFunction)(void);

   // 由 VK_VERSION_1_0 提供
   PFN_vkVoidFunction vkGetInstanceProcAddr(
     VkInstance instance,
     const char* pName);

* :bdg-secondary:`instance` 获取 ``instance`` 兼容的函数接口，或是 ``NULL`` 用于获取不依赖任何 ``VkInstance`` 的函数。
* :bdg-secondary:`pName` 获取的接口函数名称。

或取 ``vkGetInstanceProcAddr`` 函数之后既可以使用该函数获取 ``Vulkan`` 函数了。

* ``Windows`` 获取 ``vkGetInstanceProcAddr`` 函数如下：

.. code:: c++

   PFN_vkGetInstanceProcAddr vkGetInstanceProcAddr = (PFN_vkGetInstanceProcAddr)(void (*)(void))GetProcAddress(library, "vkGetInstanceProcAddr");

* ``Linux`` 获取 ``vkGetInstanceProcAddr`` 函数如下：

.. code:: c++

   PFN_vkGetInstanceProcAddr vkGetInstanceProcAddr = = (PFN_vkGetInstanceProcAddr)dlsym(library, "vkGetInstanceProcAddr");

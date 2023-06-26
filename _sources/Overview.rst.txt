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
   * 2023/6/23 增加 ``加载 Vulkan 动态库`` 章节
   * 2023/6/24 更新 ``vkGetInstanceProcAddr`` 章节
   * 2023/6/24 更新 ``Vulkan 最初之物 VkInstance`` 章节
   * 2023/6/24 增加 ``创建 VkInstance`` 章节
   * 2023/6/25 更新 ``创建 VkInstance`` 章节
   * 2023/6/25 增加 ``vkCreateInstance`` 章节
   * 2023/6/25 增加 ``VkInstanceCreateInfo`` 章节
   * 2023/6/25 增加 ``VkApplicationInfo`` 章节
   * 2023/6/25 增加 ``获取支持的 Vulkan 版本`` 章节
   * 2023/6/26 更新 ``获取支持的 Vulkan 版本`` 章节
   * 2023/6/26 增加 ``vkEnumerateInstanceVersion`` 章节
   * 2023/6/26 增加 ``Vulkan 的接口`` 章节

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

Vulkan 的接口
######################

``Vulkan`` 的接口，也就是 ``Vulkan`` 函数，最开始是使用 ``C`` 语言发布的，有些繁琐，后来推出了 ``C++`` 版本的接口，现在 ``Python`` 、 ``Java`` 和 ``C#`` 等高级语言也陆续支持开发 ``Vulkan`` ，支持 ``Vulkan`` 的家族也在慢慢壮大。

本教程主要是用最原始的 ``C`` 语言版本进行讲解。

获取 Vulkan 接口
######################

由于 ``Vulkan`` 只是一套标准，具体的实现都在硬件驱动中，为了能够使用 ``Vulkan`` 驱动硬件设备，我们需要获取驱动中 ``Vulkan`` 标准实现的接口。

加载 Vulkan 动态库
************************

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

   在 ``Vulkan`` 中并没有禁止用户使用 ``vkGetInstanceProcAddr`` 获得 ``Device`` 域函数，但这是不推荐的，当有多个硬件设备时会造成模棱两可的函数获取。比如电脑上插着两个显卡，一个是摩尔线程的，一个是景嘉微的，这两个设备都支持绘制函数 ``vkCmdDraw`` 函数 ，但是到底获取的是哪个设备的实现是由 ``Vulkan Loader`` 定义的，用户并不能知道返回的函数是哪个设备的实现。

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

获取 ``vkGetInstanceProcAddr`` 函数之后就可以使用该函数获取 ``Vulkan`` 函数了。

.. admonition:: PFN_{函数名}
   :class: note

   在 ``Vulkan`` 标准中，所有的接口函数都有对应的函数指针声明，命名规则为 ``PFN_{函数名}`` 。

.. admonition:: PFN_vkVoidFunction 与 vkGetInstanceProcAddr
   :class: note

   ``vkGetInstanceProcAddr`` 会返回 ``PFN_vkVoidFunction`` 类型函数指针。但是我们想获得 ``Vulkan`` 中如 ``vkCreateInstance`` 这样的函数指针，该指针并不是 ``PFN_vkVoidFunction`` 类型的，而是 ``PFN_vkCreateInstance`` 类型的，如何从 ``PFN_vkVoidFunction`` 类型获得 ``PFN_vkCreateInstance`` 类型呢？
   在 ``Vulkan`` 中规定直接使用强制类型转换即可。下文有示例。

* ``Windows`` 获取 ``vkGetInstanceProcAddr`` 函数如下：

.. code:: c++

   PFN_vkGetInstanceProcAddr vkGetInstanceProcAddr = (PFN_vkGetInstanceProcAddr)(void (*)(void))GetProcAddress(library, "vkGetInstanceProcAddr");

* ``Linux`` 获取 ``vkGetInstanceProcAddr`` 函数如下：

.. code:: c++

   PFN_vkGetInstanceProcAddr vkGetInstanceProcAddr = = (PFN_vkGetInstanceProcAddr)dlsym(library, "vkGetInstanceProcAddr");

之后就可以使用 ``vkGetInstanceProcAddr`` 获取 ``Instance`` 域的函数了。比如获取 ``vkCreateInstance`` 函数接口：

.. code:: c++

   PFN_vkCreateInstance vkCreateInstance = (PFN_vkCreateInstance)vkGetInstanceProcAddr(VK_NULL_HANDLE, "vkCreateInstance");

.. admonition:: VK_NULL_HANDLE
   :class: note

   在 ``Vulkan`` 中 ``VK_NULL_HANDLE`` 被定义为空或无效句柄，一般被声明为 ``0`` 、 ``NULL`` 或 ``nullptr`` 。

.. note:: 对于获取 ``PhysicalDevice`` 域函数和 ``Device`` 域函数将会在后文有所体现。

Vulkan 最初之物 VkInstance
############################

在 ``Vulkan`` 中首先要创建的就是 ``VkInstance`` 对象。该对象包含了用户设置的 ``Vulkan`` 环境信息，包括使用的 ``Vulkan`` 的版本信息等，用于初始化 ``Vulkan`` 环境，并构建出 ``Vulkan`` 这个繁杂的系统根基。 ``VkInstance`` 定义如下：

.. code:: c++

   #define VK_DEFINE_HANDLE(object) typedef struct object##_T* object;

   VK_DEFINE_HANDLE(VkInstance)

从 ``VkInstance`` 定义可知为一个句柄，该句柄为一个结构体指针。在 ``Vulkan`` 中所有的对象都是一个句柄。

如上 ``VkInstance`` 声明等价于:

.. code:: c++

   typedef struct VkInstance_T* VkInstance;

也就是说 ``VkInstance`` 在底层其实是作为一个类型为 ``VkInstance_T`` 的指针在使用。

.. admonition:: Vulkan 中的句柄
   :class: note

   ``Vulkan`` 中并不是所有的句柄都是指针类型，也有可能是一个 ``64`` 位的无符号整形，具体是什么类型与平台相关。但用户并不需要关心句柄的底层表达， ``Vulkan`` 中对所有的句柄都做了分别进行了声明，这样用户只需要使用 ``Vulkan`` 提供的句柄声明即可。
   比如声明一个未初始化的 ``VkInstance`` 句柄（对象）：

   .. code:: c++

      VkInstance instance = VK_NULL_HANDLE;

创建 VkInstance
************************

vkCreateInstance
--------------------

我们通过之前获取到的 ``vkCreateInstance`` 函数创建 ``VkInstance`` 。相关声明如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkCreateInstance(
       const VkInstanceCreateInfo*                 pCreateInfo,
       const VkAllocationCallbacks*                pAllocator,
       VkInstance*                                 pInstance);

* :bdg-secondary:`pCreateInfo` 指向 ``VkInstanceCreateInfo`` 数据结构对象，用于控制 ``VkInstance`` 的创建。
* :bdg-secondary:`pAllocator` 内存分配器。
* :bdg-secondary:`pInstance` 创建的目标 ``VkInstance`` 结果。

.. admonition:: pAllocator
   :class: note

   在 ``Vulkan`` 中创建句柄是需要设置内存分配器的，也就是 ``pAllocator`` ，这对于统计内存使用情况和自定义非常重要，如果没有自定义分配器的话也可以是直接传 ``nullptr`` ，这将会使用 ``Vulkan`` 内置的分配器进行分配。

如果创建成功将会返回 ``VkResult::VK_SUCCESS`` 枚举值，否则将返回错误结果枚举值。

.. admonition:: VK_SUCCESS
   :class: note

   对于 ``Vulkan`` 中返回的大多数结果值来说，成功基本都是 ``VK_SUCCESS`` ，否则就是失败（有极个别返回其他结果也可以算作成功，遇到再说）。还有一点需要注意的是， ``VK_SUCCESS`` 的枚举值为 ``0`` ：

   .. code:: c++

      typedef enum VkResult {
         VK_SUCCESS = 0,
         ...
      }VkResult;

   也就是，不应该出现如下判断：

   .. code:: c++

      VkResult result = vkCreateInstance(...);
      if(result) // 如果此时 result 为 VK_SUCCESS ，而 VK_SUCCESS 的枚举值为 0 ，会导致判定不满足条件。
      ...

   而正确的做法为：

   .. code:: c++

      VkResult result = vkCreateInstance(...);
      if(result == VkResult::VK_SUCCESS)
      ...

VkInstanceCreateInfo
----------------------

来看一下 ``VkInstanceCreateInfo`` 的定义：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkInstanceCreateInfo {
       VkStructureType             sType;
       const void*                 pNext;
       VkInstanceCreateFlags       flags;
       const VkApplicationInfo*    pApplicationInfo;
       uint32_t                    enabledLayerCount;
       const char* const*          ppEnabledLayerNames;
       uint32_t                    enabledExtensionCount;
       const char* const*          ppEnabledExtensionNames;
   } VkInstanceCreateInfo;

* :bdg-secondary:`sType` 是该结构体的类型枚举值，必须是 ``VkStructureType::VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`flags` 是 ``VkInstanceCreateFlagBits`` 所表示的位域值，用于设置 ``VkInstance`` 的行为。
* :bdg-secondary:`pApplicationInfo` 要么是 ``NULL`` 要么指向应用信息结构体，用于  ``VkInstance`` 的细节设置。
* :bdg-secondary:`enabledLayerCount` 激活的 ``layer`` 数量。
* :bdg-secondary:`ppEnabledLayerNames` 指向数量为 ``enabledLayerCount`` 的 ``layer`` 字符串数组，用于设置要激活的 ``layer``。
* :bdg-secondary:`enabledExtensionCount` 激活 ``instance`` 扩展的数量。
* :bdg-secondary:`enabledExtensionCount` 指向数量为 ``enabledExtensionCount`` 的扩展字符串数组，用于设置要激活的 ``instance`` 扩展。

.. admonition:: sType 与 pNext
   :class: note

   初次学习 ``Vulkan`` 时会有个疑问： ``VkInstanceCreateInfo`` 已经是一个结构体了为什么还有使用 ``sType`` 再指定一遍结构体类型呢？而且 ``Vulkan`` 中几乎所有的结构体内都声明了 ``sType`` 成员，为什么？

   这就不得不说明一下 ``Vulkan`` 的扩展模块了。随着时代的发展，类似于 ``VkInstanceCreateInfo`` 结构体中的数据可能并不满足于技术背景，需要进行扩展，为此 ``Vulkan`` 引入了 ``pNext`` 成员， ``Vulkan`` 中几乎所有的结构体内都声明了 ``pNext`` 成员，而 ``pNext`` 为 ``const void*`` 类型，这也就是说 ``pNext`` 可以
   指向任意一个类型对象的数据地址。由于 ``Vulkan`` 中几乎所有的结构体内都声明了 ``pNext`` 成员，这样每个结构体都可以使用 ``pNext`` 指向下一个 ``Vulkan`` 的结构体，这样一个接着一个将结构体进行串链就形成了一个扩展链。

   .. mermaid::

      flowchart LR
         subgraph VkInstanceCreateInfo
            direction TB
               VkInstanceCreateInfo_sType["sType = VkStructureType::VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO"]
               VkInstanceCreateInfo_pNext["pNext"]
               %%VkInstanceCreateInfo_sType-.->VkInstanceCreateInfo_pNext
         end

         subgraph VulkanSomeStructureA["Vulkan某个结构体类型A"]
            direction TB
               VulkanSomeStructureA_sType["sType = VkStructureType::某个结构体A类型"]
               VulkanSomeStructureA_pNext["pNext"]
               %%VulkanSomeStructureA_sType-.->VulkanSomeStructureA_pNext
         end

         subgraph VulkanSomeStructureB["Vulkan某个结构体类型B"]
            direction TB
               VulkanSomeStructureB_sType["sType = VkStructureType::某个结构体B类型"]
               VulkanSomeStructureB_pNext["pNext"]
               %%VulkanSomeStructureB_sType-.->VulkanSomeStructureB_pNext
         end

         VkInstanceCreateInfo_pNext-->VulkanSomeStructureA
         VulkanSomeStructureA_pNext-->VulkanSomeStructureB
         VulkanSomeStructureB_pNext-->a2["..."]

   这样驱动就可以根据 ``pNext`` 指针链遍历所有的结构体数据了，但是有一个问题 ``pNext`` 只是个 ``void*`` 指针，驱动在获取到 ``pNext`` 指向的地址时并不知道这个地址应该按照哪种结构体类型进行解析，这时 ``sType`` 的作用就体现出来了，驱动获取该地址下的 ``sType`` 的数据，这样驱动就知道如何解析此块地址了。

   .. code:: c++

      // 驱动内部可能的实现

      const void* pNext = 某个结构体的地址;
      VkStructureType sType = VkStructureType::VK_STRUCTURE_TYPE_MAX_ENUM;
      memcpy(&sType, pNext, sizeof(VkStructureType));

      switch(sType)
      {
      case VkStructureType::VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO:
      {
         VkInstanceCreateInfo* instance_create_info = (VkInstanceCreateInfo*)(pNext);
      }
      break;
         ...
      }

VkApplicationInfo
----------------------

目前我们只需要关注 ``VkApplicationInfo`` 就好，其定义如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkApplicationInfo {
       VkStructureType    sType;
       const void*        pNext;
       const char*        pApplicationName;
       uint32_t           applicationVersion;
       const char*        pEngineName;
       uint32_t           engineVersion;
       uint32_t           apiVersion;
   } VkApplicationInfo;

* :bdg-secondary:`sType` 是该结构体的类型枚举值，必须是 ``VkStructureType::VK_STRUCTURE_TYPE_APPLICATION_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`pApplicationName` 要么是 ``NULL`` 要么指向一个以空字符为结尾的 ``UTF-8`` 字符串，用于表示用户自定义应用名称。
* :bdg-secondary:`applicationVersion` 一个无符号整型，用于用户自定义应用版本。
* :bdg-secondary:`pEngineName` 要么是 ``NULL`` 要么指向一个以空字符为结尾的 ``UTF-8`` 字符串，用于表示用户自定义引擎名称。
* :bdg-secondary:`engineVersion` 一个无符号整型，用于用户自定义引擎版本。
* :bdg-secondary:`apiVersion` 应用打算使用的 ``Vulkan`` 的最高版本，并且忽略 ``apiVersion`` 的 ``patch`` 版本。

如果设备驱动只支持 ``Vulkan 1.0`` 而用户设置的 ``apiVersion`` 的 ``Vulkan`` 版本高于 ``Vulkan 1.0`` 的话， ``vkCreateInstance`` 将会返回 ``VK_ERROR_INCOMPATIBLE_DRIVER`` 。

.. note:: 如果 ``VkInstanceCreateInfo::pApplicationInfo`` 为 ``NULL`` 或 ``apiVersion`` 为 ``0`` 的话，等价于 ``apiVersion`` 设置为 ``VK_MAKE_API_VERSION(0,1,0,0)`` 也就是 ``Vulkan 1.0`` 版本。

这里我们主要关注 ``apiVersion`` 参数，这是一个非常重要的参数。该参数指定的 ``Vulkan`` 版本决定了应用可以使用该版本及以前的版本功能，并不能使用高于 ``apiVersion`` 的 ``Vulkan`` 版本功能。

.. note:: 有关 ``apiVersion`` 如何组成 ``Vulkan`` 版本的，已在 ``开始于 Vulkan SDK`` 的 ``Vulkan的版本`` 中有讲解。

现在我们就可以创建一个最简单的 ``Vulkan 1.0`` 版本的 ``VkInstance`` 了：

.. code:: c++

   VkInstance instance = VK_NULL_HANDLE;

   VkApplicationInfo application_info = {};
   application_info.sType = VkStructureType::VK_STRUCTURE_TYPE_APPLICATION_INFO;
   application_info.pNext = nullptr;
   application_info.pApplicationName = nullptr;
   application_info.applicationVersion = 0;
   application_info.pEngineName = nullptr;
   application_info.engineVersion = 0;
   application_info.apiVersion = VK_MAKE_API_VERSION(0, 1, 0, 0);

   VkInstanceCreateInfo instance_create_info = {};
   instance_create_info.sType = VkStructureType::VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
   instance_create_info.pNext = nullptr;
   instance_create_info.flags = 0;
   instance_create_info.pApplicationInfo = &application_info;
   instance_create_info.enabledLayerCount = 0;
   instance_create_info.ppEnabledLayerNames = nullptr;
   instance_create_info.enabledExtensionCount = 0;
   instance_create_info.ppEnabledExtensionNames = nullptr;

   VkResult result = vkCreateInstance(&instance_create_info, nullptr, &instance);
   if (result != VK_SUCCESS)
   {
      return 创建失败;
   }

.. note:: 经过如上的代码，你可以发现创建一个句柄需要填写各种各样的 ``Vk{结构体名称}Info`` 或 ``Vk{句柄名称}CreateInfo`` 等结构体。在 ``Vulkan`` 中各式各样的结构体占了绝大多数。给人一种：:bdg-info:`来，我这样有张大表，先把表填了，我才知道接下来如何干活` 的感觉。

.. admonition:: 现在我们面临一个问题
   :class: hint

   我咋知道设备支持 ``Vulkan`` 的哪个版本？

获取支持的 Vulkan 版本
############################

由于历史原因 ``Vulkan 1.0`` 标准在设计时并没有考虑到获取 ``Vulkan`` 版本，只有获取驱动支持的 ``Vulkan`` 版本。在 ``开始于 Vulkan SDK`` 中我们知道 ``Vulkan`` 版本有两个版本，一个是系统端支持的 ``Vulkan`` 版本，一个是驱动支持的 ``Vulkan`` 版本。为什么会有两个版本？

这是由于 ``Vulkan`` 的函数分为不同域。系统端支持的 ``Vulkan`` 版本主要是用于配置系统支持的功能、 ``layer`` 和扩展，不同版本支持的功能、 ``layer`` 和扩展不尽相同。驱动支持的 ``Vulkan`` 版本主要是用于配置硬件设备支持的功能和扩展，不同版本支持的功能和扩展不尽相同。

之后在 ``Vulkan 1.1`` 标准中，推出了 ``vkEnumerateInstanceVersion`` 接口来获取支持的 ``Vulkan`` 版本。

.. admonition:: 硬件设备的 Layer
   :class: note

   在 ``Vulkan 1.0`` 中硬件设备是有相关的 ``Layer`` 功能的，但用处不大，比较鸡肋，后来 ``Vulkan`` 标准组将硬件设备的 ``Layer`` 遗弃，但对外的接口还保留着。

由于在支持 ``Vulkan 1.0`` 的实现中 ``vkCreateInstance`` 可能由于 ``VK_ERROR_INCOMPATIBLE_DRIVER`` 失败返回，所以需要在调用 ``vkCreateInstance`` 之前获取支持的 ``Vulkan`` 版本。获取流程如下：

.. mermaid::

   flowchart TD
      TryToGetvkEnumerateInstanceVersion["尝试获取 vkEnumerateInstanceVersion 函数接口实现"]
      IsNull{"是否为 NULL"}
      SupportVulkan_1_0["支持Vulkan 1.0"]
      SupportVulkanFromvkEnumerateInstanceVersion["支持 vkEnumerateInstanceVersion 中获得的 Vulkan 版本"]

      TryToGetvkEnumerateInstanceVersion-->IsNull
      IsNull--是-->SupportVulkan_1_0
      IsNull--否-->SupportVulkanFromvkEnumerateInstanceVersion

vkEnumerateInstanceVersion
********************************

``vkEnumerateInstanceVersion`` 函数定义如下：

.. code:: c++

   // 由 VK_VERSION_1_1 提供
   VkResult vkEnumerateInstanceVersion(
       uint32_t*                                   pApiVersion);

* :bdg-secondary:`pApiVersion` ``instance`` 域函数支持的 ``Vulkan`` 版本。

接下来就让我们获取支持的 ``Vulkan`` 版本吧：

.. code:: c++

   PFN_vkEnumerateInstanceVersion vkEnumerateInstanceVersion = (PFN_vkEnumerateInstanceVersion)vkGetInstanceProcAddr(VK_NULL_HANDLE, "vkEnumerateInstanceVersion");

   if(vkEnumerateInstanceVersion != nullptr)
   {
      uint32_t vulkan_version = 0;
      VkResult result = vkEnumerateInstanceVersion(&vulkan_version);
      if (result != VK_SUCCESS)
      {
         return Vulkan Loader 或任意一个 Layer 发生了内存分配失败;
      }
      return vulkan_version;
   }
   else
   {
      return VK_MAKE_API_VERSION(0,1,0,0);
   }





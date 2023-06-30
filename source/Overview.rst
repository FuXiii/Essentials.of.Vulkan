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
   * 2023/6/26 增加 ``获取物理硬件设备`` 章节
   * 2023/6/26 增加 ``Vulkan 函数分类`` 章节并增加 ``全局函数`` 声明
   * 2023/6/26 更新 ``vkGetInstanceProcAddr`` 章节，增加 ``全局函数`` 相关说明
   * 2023/6/26 更新 ``vkCreateInstance`` 章节，增加 ``全局函数`` 相关说明
   * 2023/6/26 更新 ``vkEnumerateInstanceVersion`` 章节，增加 ``全局函数`` 相关说明
   * 2023/6/27 更新 ``获取物理硬件设备`` 章节
   * 2023/6/27 更新 ``Vulkan 函数分类`` 章节，增加全局函数的条目
   * 2023/6/27 增加 ``vkEnumeratePhysicalDevices`` 章节
   * 2023/6/28 增加 ``获取物理设备属性`` 章节
   * 2023/6/28 增加 ``vkGetPhysicalDeviceProperties`` 章节
   * 2023/6/28 增加 ``VkPhysicalDeviceProperties`` 章节
   * 2023/6/28 更新 ``vkEnumeratePhysicalDevices`` 章节
   * 2023/6/28 增加 ``VkPhysicalDeviceType`` 章节
   * 2023/6/28 更新 ``vkGetInstanceProcAddr`` 章节，增加 ``句柄`` 描述
   * 2023/6/29 增加 ``设备队列`` 章节
   * 2023/6/29 更新 ``VkPhysicalDeviceProperties`` 章节，增加 ``稀疏`` 说明
   * 2023/6/29 增加 ``获取设备队列信息`` 章节
   * 2023/6/29 增加 ``vkGetPhysicalDeviceQueueFamilyProperties`` 章节
   * 2023/6/29 增加 ``VkQueueFamilyProperties`` 章节
   * 2023/6/29 增加 ``VkQueueFlags`` 章节
   * 2023/6/29 增加 ``VkQueueFlagBits`` 章节
   * 2023/6/30 更新 ``加载 Vulkan 动态库`` 章节，增加 ``Vulkan 的静态库`` 说明
   * 2023/6/30 增加 ``逻辑设备`` 章节
   * 2023/6/30 增加 ``创建逻辑设备`` 章节
   * 2023/6/30 增加 ``vkCreateDevice`` 章节

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

.. admonition:: Vulkan 的动态库
   :class: note

   ``Windows`` 操作系统上 ``Vulkan`` 的动态库为 ``vulkan-1.dll`` ，而 ``Linux`` 上的为 ``libvulkan.so.1`` 或 ``libvulkan.so`` 。

.. admonition:: Vulkan 的静态库
   :class: hint

   为什么不是用 ``Vulkan`` 的静态库呢？最主要的原因来源于 `Vulkan Loader 的 Static Linking <https://github.com/KhronosGroup/Vulkan-Loader/blob/main/docs/LoaderApplicationInterface.md#static-linking>`_ 文档：

      In previous versions of the loader, it was possible to statically link the loader. This was removed and is no longer possible. The decision to remove static linking was because of changes to the driver which made older applications that statically linked unable to find newer drivers.

      在 ``Loader`` 之前的版本中，是可以静态链接 ``Loader`` 的。这将会在不久的将来移除。这是由于之前静态链接的老程序无法找到新的驱动。

   此外静态链接有如下问题：

   * 除非重编译链接原工程否则永远得不到新 ``Loader`` 内容
   * 包含的两个库可能会链接了不同版本的 ``Loader``

.. tab-set::

    .. tab-item:: Windows 加载

      .. code:: c++

         #include <Windows.h>

         HMODULE library = LoadLibraryA("vulkan-1.dll");

    .. tab-item:: Linux 加载

      .. code:: c++

         #include <dlfcn.h>

         void *library = dlopen("libvulkan.so.1", RTLD_NOW | RTLD_LOCAL);
         if (!library)
         {
             library = dlopen("libvulkan.so", RTLD_NOW | RTLD_LOCAL);
         }

Vulkan 函数分类
************************

之后我们就可以从加载的动态库中获取 ``Vulkan`` 的函数了，但是在获取 ``Vulkan`` 函数前我们需要先介绍一下 ``Vulkan`` 中函数的分类：

* :bdg-secondary:`Instance 域函数` 主要是通过 ``vkGetInstanceProcAddr`` 函数接口获取，该类函数大部分与 ``VkInstance`` 进行交互。主要是获取一些与设备不相关与环境相关的函数。
   * :bdg-secondary:`全局函数` 在 ``Instance`` 域函数中有几个函数为全局函数。所谓全局函数是指任何驱动都需要实现的接口，并且用户可直接无条件获取其实现。全局函数如下：
      * ``vkEnumerateInstanceVersion``
      * ``vkEnumerateInstanceExtensionProperties``
      * ``vkEnumerateInstanceLayerProperties``
      * ``vkCreateInstance``

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

.. admonition:: 获取全局函数
   :class: note

   获取全局函数时 ``instance`` 为 ``VK_NULL_HANDLE``

.. admonition:: PFN_{函数名}
   :class: note

   在 ``Vulkan`` 标准中，所有的接口函数都有对应的函数指针声明，命名规则为 ``PFN_{函数名}`` 。

.. admonition:: PFN_vkVoidFunction 与 vkGetInstanceProcAddr
   :class: note

   ``vkGetInstanceProcAddr`` 会返回 ``PFN_vkVoidFunction`` 类型函数指针。但是我们想获得 ``Vulkan`` 中如 ``vkCreateInstance`` 这样的函数指针，该指针并不是 ``PFN_vkVoidFunction`` 类型的，而是 ``PFN_vkCreateInstance`` 类型的，如何从 ``PFN_vkVoidFunction`` 类型获得 ``PFN_vkCreateInstance`` 类型呢？
   在 ``Vulkan`` 中规定直接使用强制类型转换即可。下文有示例。

.. tab-set::

    .. tab-item:: Windows 获取

      .. code:: c++

         PFN_vkGetInstanceProcAddr vkGetInstanceProcAddr = (PFN_vkGetInstanceProcAddr)(void (*)(void))GetProcAddress(library, "vkGetInstanceProcAddr");

    .. tab-item:: Linux 获取

      .. code:: c++

         PFN_vkGetInstanceProcAddr vkGetInstanceProcAddr = (PFN_vkGetInstanceProcAddr)dlsym(library, "vkGetInstanceProcAddr");

之后就可以使用 ``vkGetInstanceProcAddr`` 获取 ``Instance`` 域的函数了。比如获取 ``vkCreateInstance`` 函数接口：

.. code:: c++

   PFN_vkCreateInstance vkCreateInstance = (PFN_vkCreateInstance)vkGetInstanceProcAddr(VK_NULL_HANDLE, "vkCreateInstance");

.. admonition:: VK_NULL_HANDLE
   :class: note

   在 ``Vulkan`` 中 ``VK_NULL_HANDLE`` 被定义为空或无效句柄，一般被声明为 ``0`` 、 ``NULL`` 或 ``nullptr`` 。

.. note:: 对于获取 ``PhysicalDevice`` 域函数和 ``Device`` 域函数将会在后文有所体现。

.. note:: 句柄

   英文为 ``Handle`` ，一般认为句柄与唯一识别号作用相同，一个句柄代表一个具体对象，函数作用在句柄上，内部是在修改句柄背后对应的那个对象。

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

.. important:: ``vkCreateInstance`` 属于全局函数。

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

.. important:: ``vkCreateInstance`` 属于全局函数。

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

获取物理硬件设备
############################

``Vulkan`` 具有能够发现连接在主板上支持 ``Vulkan`` 设备的能力。通过 ``vkEnumeratePhysicalDevices`` 函数获取支持 ``Vulkan`` 的设备。

vkEnumeratePhysicalDevices
********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkEnumeratePhysicalDevices(
       VkInstance                                  instance,
       uint32_t*                                   pPhysicalDeviceCount,
       VkPhysicalDevice*                           pPhysicalDevices);

* :bdg-secondary:`instance` 是之前使用 ``vkCreateInstance`` 创建的 ``VkInstance`` 句柄。
* :bdg-secondary:`pPhysicalDeviceCount` 是用于指定或获取的物理设备数量。
* :bdg-secondary:`pPhysicalDevices` 要么是 ``NULL`` 要么是数量不小于 ``pPhysicalDeviceCount`` 的 ``VkPhysicalDevice`` 数组。

如果 ``pPhysicalDevices`` 是 ``NULL`` 的话 ``vkEnumeratePhysicalDevices`` 函数将会将查询到支持 ``Vulkan`` 的设备数量写入 ``pPhysicalDeviceCount`` 所指向的内存中，所以 ``pPhysicalDeviceCount`` 必须是一个有效指针。

如果 ``pPhysicalDevices`` 不是 ``NULL`` 的话 ``vkEnumeratePhysicalDevices`` 函数将会将 ``pPhysicalDeviceCount`` 数量的有效 ``VkPhysicalDevice`` 句柄依次写入 ``pPhysicalDevices`` 指向的数组中。如果 ``pPhysicalDeviceCount`` 指定的数量小于支持 ``Vulkan`` 的设备数量的话， ``vkEnumeratePhysicalDevices`` 将会写入 ``pPhysicalDeviceCount`` 个物理设备句柄到数组中并返回 ``VK_INCOMPLETE`` 表示并不是所有设备都写入数组返回。

如果一切正常 ``vkEnumeratePhysicalDevices`` 将会返回 ``VK_SUCCESS`` 。

.. note:: 获取 ``VkPhysicalDevice`` 句柄不需要通过类似 ``vkCreatePhysicalDevice`` 这样的函数创建（ ``Vulkan`` 标准也没有该函数 ），而是在调用 ``vkCreateInstance`` 时内部已经做好了管理。也就是说 ``VkPhysicalDevice`` 的生命周期与 ``VkInstance`` 句柄一致。

接下来就让我们获取支持的 ``Vulkan`` 的物理设备吧：

首先获取 ``vkEnumeratePhysicalDevices`` 函数：

.. code:: c++

   VkInstance instance = 之前成功创建的 VkInstance ;

   PFN_vkEnumeratePhysicalDevices vkEnumeratePhysicalDevices = (PFN_vkEnumeratePhysicalDevices)vkGetInstanceProcAddr(instance, "vkEnumeratePhysicalDevices");

.. note:: 此时 ``vkGetInstanceProcAddr`` 的第一个参数不为 ``VK_NULL_HANDLE`` 而为有效 ``VkInstance`` 句柄。

之后即可以获取到物理设备了：

.. code:: c++

   uint32_t physical_device_count = 0;
   vkEnumeratePhysicalDevices(instance, &physical_device_count, nullptr);

   std::vector<VkPhysicalDevice> physical_devices(physical_device_count);
   vkEnumeratePhysicalDevices(instance, &physical_device_count, physical_devices.data());

获取物理设备属性
############################

当获取到物理设备 ``VkPhysicalDevice`` 句柄之后，可以通过 ``vkGetPhysicalDeviceProperties`` 函数获取对应物理设备的属性。

vkGetPhysicalDeviceProperties
********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetPhysicalDeviceProperties(
       VkPhysicalDevice                            physicalDevice,
       VkPhysicalDeviceProperties*                 pProperties);

* :bdg-secondary:`physicalDevice` 对应要获取属性的物理设备的句柄。
* :bdg-secondary:`pProperties` 对应返回的物理设备属性。

``VkPhysicalDeviceProperties`` 定义如下：

VkPhysicalDeviceProperties
********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkPhysicalDeviceProperties {
       uint32_t                            apiVersion;
       uint32_t                            driverVersion;
       uint32_t                            vendorID;
       uint32_t                            deviceID;
       VkPhysicalDeviceType                deviceType;
       char                                deviceName[VK_MAX_PHYSICAL_DEVICE_NAME_SIZE];
       uint8_t                             pipelineCacheUUID[VK_UUID_SIZE];
       VkPhysicalDeviceLimits              limits;
       VkPhysicalDeviceSparseProperties    sparseProperties;
   } VkPhysicalDeviceProperties;

* :bdg-secondary:`apiVersion` 该设备驱动支持的 ``Vulkan`` 版本。
* :bdg-secondary:`driverVersion` 该设备驱动版本。
* :bdg-secondary:`vendorID` 设备供应商的 ``ID`` 。
* :bdg-secondary:`deviceID` 设备的 ``ID`` 。
* :bdg-secondary:`deviceType` 设备类型。
* :bdg-secondary:`deviceName` 设备名称。
* :bdg-secondary:`pipelineCacheUUID` 设备的通用唯一识别码（ ``universally unique identifier`` ）。
* :bdg-secondary:`limits` 设备的限值信息。
* :bdg-secondary:`sparseProperties` 稀疏数据属性。

.. admonition:: 稀疏
   :class: note

   ``稀疏`` 为离散在内存各处的大量数据，这些数据可以被一并使用，常用表述数据量巨大的资源。

这里我们主要关注 ``apiVersion`` 和 ``deviceType`` 属性。

* ``apiVersion`` 主要是用于描述对应设备支持的 ``Vulkan`` 的版本，该版本很重要，说明设备只支持 ``apiVersion`` 版本之前的标准，如果在此设备上使用高于 ``apiVersion`` 版本的功能的话将会导致错误或未定义行为。
* ``deviceType`` 主要是用于描述对应设备是独立显卡还是集成显卡。

``VkPhysicalDeviceType`` 枚举值定义如下：

VkPhysicalDeviceType
********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef enum VkPhysicalDeviceType {
       VK_PHYSICAL_DEVICE_TYPE_OTHER = 0,
       VK_PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU = 1,
       VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU = 2,
       VK_PHYSICAL_DEVICE_TYPE_VIRTUAL_GPU = 3,
       VK_PHYSICAL_DEVICE_TYPE_CPU = 4,
   } VkPhysicalDeviceType;

* :bdg-secondary:`VK_PHYSICAL_DEVICE_TYPE_OTHER` 该设备类型不与任何其他类型匹配， ``Vulkan`` 中未定义的设备类型。
* :bdg-secondary:`VK_PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU` 集成显卡。
* :bdg-secondary:`VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU` 独立显卡。
* :bdg-secondary:`VK_PHYSICAL_DEVICE_TYPE_VIRTUAL_GPU` 虚拟环境中的虚拟显卡。
* :bdg-secondary:`VK_PHYSICAL_DEVICE_TYPE_CPU` 中央处理器（ ``CPU`` ）。

.. admonition:: VK_PHYSICAL_DEVICE_TYPE_CPU
   :class: note

   虽然 ``VK_PHYSICAL_DEVICE_TYPE_CPU`` 表示 ``CPU`` 类型的设备，但是在通过 ``vkEnumeratePhysicalDevices`` 获取物理设备时，并不一定会得到插在主板上的 ``CPU`` 设备句柄，由于 ``CPU`` 并不一定支持 ``Vulkan`` ，所以 ``CPU`` 不一定能够获得，大部分支持 ``Vulkan`` 的设备还是显卡设备。

在使用时，一般首选使用 ``VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU`` 独立显卡，之后再考虑使用 ``VK_PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU`` 集成显卡。

获取物理属性例程如下：

首先获取 ``vkGetPhysicalDeviceProperties`` 函数：

.. code:: c++

   VkInstance instance = 之前成功创建的 VkInstance ;

   PFN_vkGetPhysicalDeviceProperties vkGetPhysicalDeviceProperties = (PFN_vkGetPhysicalDeviceProperties)vkGetInstanceProcAddr(instance, "vkGetPhysicalDeviceProperties");

之后就可以调用 ``vkGetPhysicalDeviceProperties`` 获取相应的设备属性了：

.. code:: c++

   std::vector<VkPhysicalDevice> physical_devices = 之前获取到的所有设备;

   for(VkPhysicalDevice physical_device : physical_devices)
   {
      VkPhysicalDeviceProperties physical_device_properties = {};
      vkGetPhysicalDeviceProperties(physical_device, &physical_device_properties);

      std::cout << "Physical Device Name:" << physical_device_properties.deviceName << std::endl;
   }

设备队列
############################

接下来简单介绍一下 ``Vulkan`` 中的设备队列。

``Vulkan`` 中的每一个 ``VkPhysicalDevice`` 物理设备上都有一到多个设备队列。设备队列用于执行所有的用户任务指令，包括渲染、计算、查询、剔除和构建等等各种任务指令。

每个设备队列支持一到多个功能域，这些功能域分为如下 ``5`` 种：

* :bdg-secondary:`图形` 主要用于图形渲染，执行各种渲染绘制指令。
* :bdg-secondary:`计算` 主要用于执行并行计算（计算着色器），执行各种计算指令。
* :bdg-secondary:`转移` 主要用于执行资源的布局转移并支持在不同队列中进行转移，执行各种转移指令。
* :bdg-secondary:`稀疏绑定` 主要用于稀疏内存的管理。
* :bdg-secondary:`受保护` 主要用于受保护的内存的管理。

在使用时常用的为 ``图形`` 、 ``计算`` 和 ``转移`` 功能的队列。

.. admonition:: 设备队列和功能域
   :class: important

   每个物理设备上支持一到多个设备队列，每个设备队列支持一到多个功能域。这里很有可能多个设备队列支持相同的功能域。比如同一物理设备上的设备队列 ``A`` 和 ``B`` 都支持图形和计算功能。

获取设备队列（族）信息
********************************

在 ``Vulkan`` 中是通过 ``vkGetPhysicalDeviceQueueFamilyProperties`` 函数获取：

vkGetPhysicalDeviceQueueFamilyProperties
-------------------------------------------

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetPhysicalDeviceQueueFamilyProperties(
       VkPhysicalDevice                            physicalDevice,
       uint32_t*                                   pQueueFamilyPropertyCount,
       VkQueueFamilyProperties*                    pQueueFamilyProperties);

* :bdg-secondary:`physicalDevice` 要获取属性的物理设备的句柄。
* :bdg-secondary:`pQueueFamilyPropertyCount` 是用于指定或获取的设备队列族数量。
* :bdg-secondary:`pQueueFamilyProperties` 要么是 ``NULL`` 要么是数量不小于 ``pQueueFamilyPropertyCount`` 的 ``VkQueueFamilyProperties`` 数组。

该函数的用法与 ``vkEnumeratePhysicalDevices`` 函数是一样的。

如果 ``pQueueFamilyProperties`` 是 ``NULL`` 的话 ``vkGetPhysicalDeviceQueueFamilyProperties`` 函数将会将查询到的设备队列族数量写入 ``pQueueFamilyPropertyCount`` 所指向的内存中，所以 ``pQueueFamilyPropertyCount`` 必须是一个有效指针。

如果 ``pQueueFamilyProperties`` 不是 ``NULL`` 的话 ``vkGetPhysicalDeviceQueueFamilyProperties`` 函数将会将 ``pQueueFamilyPropertyCount`` 数量的 ``VkQueueFamilyProperties`` 数据依次写入 ``pQueueFamilyProperties`` 指向的数组中。如果 ``pQueueFamilyPropertyCount`` 指定的数量小于支持 ``Vulkan`` 的设备队列数量的话， ``vkGetPhysicalDeviceQueueFamilyProperties`` 将会写入 ``pQueueFamilyPropertyCount`` 个设备队列族信息。

.. admonition:: 队列族
   :class: note

   在 ``Vulkan`` 中设备队列是按照 ``族`` 进行管理的，前面我们知道一个物理设备上的可能会有多个设备队列支持相同的功能域，这些支持相同功能域的设备队列算作同一族。

   .. mermaid::

      flowchart TB
         subgraph DeviceQueueFamily_A["设备队列族 A"]
            direction LR
            subgraph DeviceQueueFamily_A_Flags["支持的功能域"]
               direction LR
                  DeviceQueueFamily_A_GRAPHICS["图形"]
                  DeviceQueueFamily_A_COMPUTE["计算"]
                  DeviceQueueFamily_A_TRANSFER["转移"]

                  DeviceQueueFamily_A_GRAPHICS -.- DeviceQueueFamily_A_COMPUTE -.- DeviceQueueFamily_A_TRANSFER
            end

            subgraph DeviceQueueFamily_A_Queues["支持的队列"]
               direction TB
                  DeviceQueueFamily_A_Queue0["队列0"]
                  DeviceQueueFamily_A_Queue1["队列1"]
                  DeviceQueueFamily_A_Queue2["队列2"]

                  DeviceQueueFamily_A_Queue0 -.- DeviceQueueFamily_A_Queue1 -.- DeviceQueueFamily_A_Queue2
            end

            DeviceQueueFamily_A_Flags o--o DeviceQueueFamily_A_Queues

         end

         subgraph DeviceQueueFamily_B["设备队列族 B"]
            direction LR
            subgraph DeviceQueueFamily_B_Flags["支持的功能域"]
               direction LR
                  DeviceQueueFamily_B_COMPUTE["计算"]
                  DeviceQueueFamily_B_TRANSFER["转移"]

                  DeviceQueueFamily_B_COMPUTE -.- DeviceQueueFamily_B_TRANSFER
            end

            subgraph DeviceQueueFamily_B_Queues["支持的队列"]
               direction TB
                  DeviceQueueFamily_B_Queue3["队列3"]
            end

            DeviceQueueFamily_B_Flags o--o DeviceQueueFamily_B_Queues

         end

         DeviceQueueFamily_A-->DeviceQueueFamily_B
         DeviceQueueFamily_B-->etc["..."]

         style DeviceQueueFamily_A_Flags fill:#f96
         style DeviceQueueFamily_B_Flags fill:#f96
         style DeviceQueueFamily_A_Queues fill:#00bfa5
         style DeviceQueueFamily_B_Queues fill:#00bfa5

设备队列族 ``VkQueueFamilyProperties`` 定义如下：

VkQueueFamilyProperties
---------------------------

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkQueueFamilyProperties {
       VkQueueFlags    queueFlags;
       uint32_t        queueCount;
       uint32_t        timestampValidBits;
       VkExtent3D      minImageTransferGranularity;
   } VkQueueFamilyProperties;

* :bdg-secondary:`queueFlags` 为队列族位域，用于描述该队列族支持的功能域。
* :bdg-secondary:`queueCount` 该队列族中的队列数量。
* :bdg-secondary:`timestampValidBits` 时间戳中有效的位数，有效的位数范围为 ``36`` 到 ``64`` 位，如果为 ``0`` 说明不支持时间戳。超出有效范围的位保证为 ``0`` 。
* :bdg-secondary:`minImageTransferGranularity` 在该族队列上进行图片转移操作时支持的最小转移粒度（大小）。

目前我们主要关心 ``queueFlags`` 和 ``queueCount`` 。

``queueFlags`` 为 ``VkQueueFlags`` 类型，其定义如下：

VkQueueFlags
---------------------------

.. code:: c++

   typedef uint32_t VkFlags;
   typedef VkFlags VkQueueFlags;

可以看到 ``VkQueueFlags`` 其实就是一个 ``uint32_t`` 的标志位。

.. admonition:: VkFlags
   :class: note

   在 ``Vulkan`` 中所有的标志位 ``Vk{标志位名称}Flags`` 都为 ``VkFlags`` 也就是 ``uint32_t`` 。每一位对应的含义都在对应的 ``Vk{标志位名称}FlagBits`` 枚举中定义。

.. admonition:: 标志位与位域
   :class: note

   所谓标志位，也就是位域。像 ``uint32_t`` 其比特位有 ``32`` 个，如果某一比特位为 ``1`` 则说明对应的位域被激活，也就是对应位域表示的事物被激活。比如：

   .. code:: c++

      uint32_t LIKE_CAT_BIT = 0x00000001; //对应的二进制：0000 0000 0000 0000 0000 0000 0000 0001
      uint32_t LIKE_DOG_BIT = 0x00000002; //对应的二进制：0000 0000 0000 0000 0000 0000 0000 0010

      uint32_t likes = 某人的喜好;

      if(likes == 0) //什么也不喜欢
      if((likes & LIKE_CAT_BI) == LIKE_CAT_BIT) //喜欢猫
      if((likes & LIKE_DOG_BIT) == LIKE_DOG_BIT) //喜欢狗
      if((likes & (LIKE_CAT_BIT | LIKE_DOG_BIT)) == (LIKE_CAT_BIT | LIKE_DOG_BIT)) //既喜欢猫，也喜欢狗

``VkQueueFlags`` 对应位域的 ``VkQueueFlagBits`` 定义如下:

VkQueueFlagBits
---------------------------

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef enum VkQueueFlagBits {
       VK_QUEUE_GRAPHICS_BIT = 0x00000001,
       VK_QUEUE_COMPUTE_BIT = 0x00000002,
       VK_QUEUE_TRANSFER_BIT = 0x00000004,
       VK_QUEUE_SPARSE_BINDING_BIT = 0x00000008,
     // 由 VK_VERSION_1_1 提供
       VK_QUEUE_PROTECTED_BIT = 0x00000010,
   } VkQueueFlagBits;

* :bdg-secondary:`VK_QUEUE_GRAPHICS_BIT` 表示该队列族中的队列支持 ``图形`` 功能。
* :bdg-secondary:`VK_QUEUE_COMPUTE_BIT` 表示该队列族中的队列支持 ``计算`` 功能。
* :bdg-secondary:`VK_QUEUE_TRANSFER_BIT` 表示该队列族中的队列支持 ``转移`` 功能。
* :bdg-secondary:`VK_QUEUE_SPARSE_BINDING_BIT` 表示该队列族中的队列支持 ``稀疏绑定`` 功能。
* :bdg-secondary:`VK_QUEUE_PROTECTED_BIT` 表示该队列族中的队列支持 ``受保护`` 功能。

获取设备队列（族）信息例程如下：

首先获取 ``vkGetPhysicalDeviceQueueFamilyProperties`` 函数：

.. code:: c++

   VkInstance instance = 之前成功创建的 VkInstance ;

   PFN_vkGetPhysicalDeviceQueueFamilyProperties vkGetPhysicalDeviceQueueFamilyProperties = (PFN_vkGetPhysicalDeviceQueueFamilyProperties)vkGetInstanceProcAddr(instance, "vkGetPhysicalDeviceQueueFamilyProperties");

之后就可以调用 ``vkGetPhysicalDeviceQueueFamilyProperties`` 获取相应的设备队列（族）属性了：

.. code:: c++

   uint32_t queue_family_count = 0;
   vkGetPhysicalDeviceQueueFamilyProperties(instance, &queue_family_count, nullptr);

   std::vector<VkQueueFamilyProperties> queue_familys(queue_family_count);
   vkGetPhysicalDeviceQueueFamilyProperties(instance, &queue_family_count, queue_familys.data());

   uint32_t uint32_max = std::numeric_limits<uint32_t>::max();
   uint32_t support_graphics_queue_family_index = uint32_max;
   for(uint32_t index = 0; index < queue_family_count ; index++)
   {
      if((queue_familys[index].queueFlags & VkQueueFlagBits::VK_QUEUE_GRAPHICS_BIT) == VkQueueFlagBits::VK_QUEUE_GRAPHICS_BIT)
      {
         // 寻找支持图形的队列族
         support_graphics_queue_family_index = index;
         break;
      }
   }

   assert(support_graphics_queue_family_index != uint32_max) //没找到支持图形的队列族

.. admonition:: VK_QUEUE_GRAPHICS_BIT
   :class: note

   我们一般倾向于需要支持 ``VK_QUEUE_GRAPHICS_BIT`` 图形功能的队列族，这是因为大部分设备队列族如果支持图形功能的话，其他的计算、转移和稀疏绑定功能也会同时支持。

逻辑设备
############################

在获得了物理设备句柄之后，我们需要在某个物理设备上创建逻辑设备，之后所有的操作都应用于此逻辑设备上。 ``Vulkan`` 中使用 ``VkDevice`` 句柄表示一个逻辑设备。

创建逻辑设备
********************************

首先需要使用 ``vkCreateDevice`` 创建逻辑设备。

vkCreateDevice
-----------------
..
   创建逻辑设备（设备队列）

   获得设备队列

   内存

   Buffer 缓存

      vertex buffer

   Image 图片

      color output image

   Image View

   surface

   交换链

   attachment

   RenderPass

   FrameBuffer

   着色器

   描述符布局

   描述符

   图形管线

   命令缓存

   指令记录

   指令推送

   等待执行完成

   显示结果
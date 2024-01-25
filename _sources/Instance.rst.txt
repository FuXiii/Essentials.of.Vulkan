最初之物 VkInstance
=============================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/1/25 更新该文档。
   * 2024/1/25 增加 ``创建 VkInstance`` 章节。
   * 2024/1/25 增加 ``vkCreateInstance`` 章节。
   * 2024/1/25 增加 ``VkInstanceCreateInfo`` 章节。
   * 2024/1/25 增加 ``VkApplicationInfo`` 章节。
   * 2024/1/25 增加 ``vkEnumerateInstanceVersion`` 章节。

开发 ``Vulkan`` 第一步就是创建 ``VkInstance`` ，也就是 ``Vulkan`` 的 ``实例`` 。一个实例代表一整 ``Vulkan`` 环境（或上下文）。不同的 ``Vulkan`` 环境能够获取到不同的 ``Vulkan`` 功能特性。其中最重要的就是配置 ``Vulkan`` 要使用的 ``版本`` 。

创建 VkInstance
######################

通过 ``vkCreateInstance(...)`` 函数创建 ``VkInstance`` ：

vkCreateInstance
*************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkCreateInstance(
       const VkInstanceCreateInfo*                 pCreateInfo,
       const VkAllocationCallbacks*                pAllocator,
       VkInstance*                                 pInstance);

* :bdg-secondary:`pCreateInfo` 指向 ``VkInstanceCreateInfo`` 数据结构对象，用于配置 ``VkInstance`` 的创建信息。
* :bdg-secondary:`pAllocator` 内存分配器。为 ``nullptr`` 表示使用内部默认分配器，否则为自定义分配器。
* :bdg-secondary:`pInstance` 返回创建的目标 ``VkInstance`` 结果。

其中 ``VkInstanceCreateInfo`` 结构体定义如下：

VkInstanceCreateInfo
*************************

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

* :bdg-secondary:`sType` 是该结构体的类型枚举值， :bdg-danger:`必须` 是 ``VkStructureType::VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`flags` 是 ``VkInstanceCreateFlagBits`` 所表示的位域值，用于设置 ``VkInstance`` 的行为。
* :bdg-secondary:`pApplicationInfo` 要么是 ``NULL`` 要么指向应用信息结构体，用于应用细节设置。
* :bdg-secondary:`enabledLayerCount` 激活的 ``layer`` 数量。
* :bdg-secondary:`ppEnabledLayerNames` 指向数量为 ``enabledLayerCount`` 的 ``layer`` 字符串数组，用于设置要激活的 ``layer``。
* :bdg-secondary:`enabledExtensionCount` 激活 ``instance`` 扩展的数量。
* :bdg-secondary:`enabledExtensionCount` 指向数量为 ``enabledExtensionCount`` 的扩展字符串数组，用于设置要激活的 ``instance`` 扩展。

其中 ``VkApplicationInfo`` 结构体定义如下：

VkApplicationInfo
*************************

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

* :bdg-secondary:`sType` 是该结构体的类型枚举值， :bdg-danger:`必须` 是 ``VkStructureType::VK_STRUCTURE_TYPE_APPLICATION_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`pApplicationName` 要么是 ``NULL`` 要么指向一个以空字符为结尾的 ``UTF-8`` 字符串，用于表示用户自定义应用名称。
* :bdg-secondary:`applicationVersion` 一个无符号整型，用于用户自定义应用版本。
* :bdg-secondary:`pEngineName` 要么是 ``NULL`` 要么指向一个以空字符为结尾的 ``UTF-8`` 字符串，用于表示用户自定义引擎名称。
* :bdg-secondary:`engineVersion` 一个无符号整型，用于用户自定义引擎版本。
* :bdg-secondary:`apiVersion` 应用打算使用的 ``Vulkan`` 的最高 :bdg-danger:`核心` 版本，并且忽略 ``apiVersion`` 的 ``patch`` 版本。

其中 ``pApplicationName`` 、 ``applicationVersion`` 、 ``pEngineName`` 和 ``engineVersion`` 这几个值随便设置，甚至可以不设置，赋为 ``空`` 都可以，这些参数不影响实例的创建。

而 ``apiVersion`` 参数是 :bdg-danger:`最为重要的核心参数` ，当创建实例时，该参数用于指定此实例环境中 ``Vulkan`` 的 :bdg-danger:`核心` ``版本`` 。目前 ``Vulkan`` 有 ``3`` 个版本：

* ``Vulkan 1.0`` 主要提供光栅化图形和并行计算的功能。对应 ``VK_API_VERSION_1_0`` 。
* ``Vulkan 1.1`` 主要为 ``Vulkan 1.0`` 不完善的地方进行补全。对应 ``VK_API_VERSION_1_1`` 。
* ``Vulkan 1.2`` 主要提供硬件光追的功能。对应 ``VK_API_VERSION_1_2`` 。
* ``Vulkan 1.3`` 主要提供动态光栅化图形的功能。对应 ``VK_API_VERSION_1_3`` 。

每个 ``Vulkan`` 新版本的发布不单单提供基本功能，还会提供一系列扩展功能，并且会将之前版本中的一些扩展功能提升囊括至核心版本中。 ``VkApplicationInfo::apiVersion`` 将会在调用 ``vkCreateInstance`` 时告诉驱动将使用的 ``Vulkan`` 版本，驱动会为您做好必要的初始化。

如果想要使用的功能为高版本中的功能，而创建实例时 ``VkApplicationInfo::apiVersion`` 指定的是低版本，此时如果获取高版本的功能函数大概率会返回 ``空`` 。所以 ``VkApplicationInfo::apiVersion`` 尽可能的设置为自己需要的高版本。比如：

   如果 ``VkApplicationInfo::apiVersion`` 设置为 ``VK_API_VERSION_1_0`` 则表示可以使用该实例在 ``Vulkan Loader`` 中加载 ``Vulkan 1.0`` 版本发布的函数，而不能加载 ``Vulkan 1.1`` 及高版本的接口函数。如下：

   .. code:: c++

      // 由 VK_VERSION_1_0 提供
      vkCmdCopyImageToBuffer(...) // 该函数为 Vulkan 1.0 版本中的函数，可以加载（可有效加载）。

      // 由 VK_VERSION_1_3 提供
      vkCmdCopyImageToBuffer2(...) // 该函数为 Vulkan 1.3 版本中的函数，不可以加载（加载将返回空）。

在 `纵览 <./Overview.html>`_ 中我们知道由于历史原因， ``Vulkan`` 在 ``Vulkan 1.1`` 版本时推出了 ``vkEnumerateInstanceVersion(...)`` 函数，用于获取驱动支持加载 ``Instance 域函数``  的 ``Vulkan`` 版本。该函数定义如下：

vkEnumerateInstanceVersion
******************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkEnumerateInstanceVersion(
       uint32_t*                                   pApiVersion);

* :bdg-secondary:`pApiVersion` 返回支持的 ``Instance 域函数`` 对应的 ``Vulkan`` 版本。

.. admonition:: vkEnumerateInstanceVersion
   :class: note
   
   * 该函数为全局函数。
   * 该函数返回的版本为可获取的 ``Instance 域函数`` 所对应的版本。
   * 与物理设备（ ``GPU`` ）支持的 ``Vulkan`` 版本可能会不同。
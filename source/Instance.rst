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
   * 2024/1/28 增加 ``Layer`` 章节。
   * 2024/1/28 增加 ``vkEnumerateInstanceLayerProperties`` 章节。
   * 2024/1/28 增加 ``VkLayerProperties`` 章节。
   * 2024/1/30 增加 ``Extension`` 章节。
   * 2024/1/30 增加 ``vkEnumerateInstanceExtensionProperties`` 章节。
   * 2024/1/30 修正 ``vkEnumerateInstanceLayerProperties`` 章节中的打印错误。完善说明。
   * 2024/1/30 增加 ``VkExtensionProperties`` 章节。
   * 2024/2/1 增加 ``示例`` 章节。
   * 2024/2/1 更新 ``vkEnumerateInstanceExtensionProperties`` 章节。修正代码错误。
   * 2024/2/1 增加 ``销毁 VkInstance`` 章节。

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
   * 与物理设备（ ``GPU`` ）支持的 ``Vulkan`` 版本可能会不同，也就是 ``Device 域函数`` 对应的 ``Vulkan`` 版本（ ``VkPhysicalDeviceProperties::apiVersion`` ）。

Layer
###########################

在创建 ``VkInstance`` 时需要通过 ``VkInstanceCreateInfo::enabledLayerCount`` 和 ``VkInstanceCreateInfo::ppEnabledLayerNames`` 来配置实例要开启的 ``层`` （ ``Layer`` ）。

``Vulkan`` 中的 ``层`` 一般都是用来作正确性验证检查的。如果在开发后执行阶段发生了使用错误， ``层`` 会输出错误信息，帮助开发者修正错误。

其中最常使用的 ``层`` 就是 ``VK_LAYER_KHRONOS_validation`` ，用于 ``Vulkan API`` 验证和错误检查。

目前 ``Vulkan`` 支持的 ``层`` 如下：

* :bdg-secondary:`VK_LAYER_KHRONOS_validation` ``Vulkan API`` 验证和错误检查。
* :bdg-secondary:`VK_LAYER_LUNARG_gfxreconstruct` 使用 `GFXReconstruct <https://vulkan.lunarg.com/doc/view/1.3.275.0/windows/getting_started.html#vulkan-api-capture-and-replay-with-gfxreconstruct>`_ 捕获应用的 ``Vulkan`` 指令。
* :bdg-secondary:`VK_LAYER_LUNARG_api_dump` 输出调用的 ``API`` 和传入的参数。
* :bdg-secondary:`VK_LAYER_KHRONOS_profiles` 帮助测试硬件的性能，而不需要物理接触每个设备。该 ``层`` 将会覆盖从 ``GPU`` 查询到的数据。
* :bdg-secondary:`VK_LAYER_LUNARG_monitor` 在应用界面的标题处显示帧率。
* :bdg-secondary:`VK_LAYER_LUNARG_screenshot` 将显示的画面帧输出到一个图片文件中。
* :bdg-secondary:`VK_LAYER_KHRONOS_synchronization2` 使用系统实现的 ``VK_KHR_synchronization2`` 扩展，而不是驱动实现的。
* :bdg-secondary:`VK_LAYER_KHRONOS_shader_object` 使用系统实现的 ``VK_EXT_shader_object`` 扩展，而不是驱动实现的。

.. admonition:: 官方 Layer 文档
   :class: note

   ``Vulkan`` 支持的所有 ``Layer`` 可以在 `Vulkan Layers <https://vulkan.lunarg.com/doc/view/1.3.275.0/windows/getting_started.html#vulkan-sdk-layers>`_ 中找到详细文档。

可以通过 ``vkEnumerateInstanceLayerProperties(...)`` 获取系统中 ``Vulkan`` 支持的 ``Layer`` ：

vkEnumerateInstanceLayerProperties
****************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkEnumerateInstanceLayerProperties(
       uint32_t*                                   pPropertyCount,
       VkLayerProperties*                          pProperties);

* :bdg-secondary:`pPropertyCount` 用于指定 ``pProperties`` 成员的数组长度。
* :bdg-secondary:`pProperties` 如果为 ``nullptr`` 则将会将系统中支持的 ``层`` 数写入 ``pPropertyCount`` 中。否则会将查询到的元素写入 ``pProperties`` 。

如果 ``pPropertyCount`` 数量小于系统中支持的 ``层`` 数，该函数将 ``pPropertyCount`` 个 ``层`` 信息写入 ``pProperties`` 中，并返回 ``VkResult::VK_INCOMPLETE`` （表示只写入了一部分，并不是所有信息）。

如果 ``pPropertyCount`` 数量大于等于系统中支持的 ``层`` 数，则会将所有的 ``层`` 数据写入 ``pProperties``  中，并返回 ``VkResult::VK_SUCCESS`` 。

所以获取 ``层`` 信息一般调用两遍 ``vkEnumerateInstanceLayerProperties(...)`` 函数：

.. code:: c++

   uint32_t layer_property_count = 0;
   vkEnumerateInstanceLayerProperties(&layer_property_count, nullptr);

   std::vector<VkLayerProperties> layer_properties(layer_property_count);
   vkEnumerateInstanceLayerProperties(&layer_property_count, layer_properties.data());

其中 ``VkLayerProperties`` 定义如下：

VkLayerProperties
****************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkLayerProperties {
       char        layerName[VK_MAX_EXTENSION_NAME_SIZE];
       uint32_t    specVersion;
       uint32_t    implementationVersion;
       char        description[VK_MAX_DESCRIPTION_SIZE];
   } VkLayerProperties;

* :bdg-secondary:`layerName` ``层`` 名称。
* :bdg-secondary:`specVersion` ``层`` 实现时的 ``Vulkan`` 版本。
* :bdg-secondary:`implementationVersion` ``层`` 自身维护的版本。
* :bdg-secondary:`description` ``层`` 的描述信息。

其中 ``VK_MAX_EXTENSION_NAME_SIZE`` 和 ``VK_MAX_DESCRIPTION_SIZE`` 定义如下：

.. code:: c++

   #define VK_MAX_EXTENSION_NAME_SIZE        256U
   #define VK_MAX_DESCRIPTION_SIZE           256U

Extension
###########################

在创建 ``VkInstance`` 时需要通过 ``VkInstanceCreateInfo::enabledExtensionCount`` 和 ``VkInstanceCreateInfo::ppEnabledExtensionNames`` 来配置实例要开启的 ``扩展`` （ ``Extension`` ）。

在 ``Vulkan`` 中有两类扩展：

* :bdg-secondary:`Instance 扩展` 与使用哪一个 ``GPU`` 设备无关，与 ``Vulkan`` 环境有关。 ``VkInstanceCreateInfo`` 中的 ``enabledExtensionCount`` 和 ``ppEnabledExtensionNames`` 就是用于配置此类 ``Instance 扩展`` 。
* :bdg-secondary:`Device 扩展` 与使用哪一个 ``GPU`` 设备有关。不同厂家的 ``GPU`` 设备会支持不同的设备扩展。这将会在之后的章节展开。

``VkInstance`` 支持的扩展可以通过 ``vkEnumerateInstanceExtensionProperties(...)`` 函数获取：

vkEnumerateInstanceExtensionProperties
*******************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkEnumerateInstanceExtensionProperties(
       const char*                                 pLayerName,
       uint32_t*                                   pPropertyCount,
       VkExtensionProperties*                      pProperties);

* :bdg-secondary:`pLayerName` 要么为 ``空`` 要么为 ``层`` 的名称。
* :bdg-secondary:`pPropertyCount` 用于指定 ``pProperties`` 成员的数组长度。
* :bdg-secondary:`pProperties` 如果为 ``nullptr`` 则将会将实例支持的 ``扩展`` 数写入 ``pPropertyCount`` 中。否则会将查询到的元素写入 ``pProperties`` 。

如果 ``pLayerName`` 为有效的 ``层`` 名， 该函数将会返回该层内部使用的 ``扩展`` 。如果开启了该 ``层`` ，则其内部使用的 ``扩展`` 将自动开启。

要想获取全部的扩展，该函数的调用与 ``vkEnumerateInstanceLayerProperties(...)`` 类似，调用两遍，第一遍 ``pProperties`` 为 ``nullptr`` ，第二遍为有效值即可：

.. code:: c++

   uint32_t extension_property_count = 0;
   vkEnumerateInstanceExtensionProperties(nullptr, &extension_property_count, nullptr);

   std::vector<VkExtensionProperties> extension_properties(extension_property_count);
   vkEnumerateInstanceExtensionProperties(nullptr, &extension_property_count, extension_properties.data());

其中 ``VkExtensionProperties`` 定义如下：

VkExtensionProperties
*****************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkExtensionProperties {
       char        extensionName[VK_MAX_EXTENSION_NAME_SIZE];
       uint32_t    specVersion;
   } VkExtensionProperties;

* :bdg-secondary:`extensionName` 为扩展名称。
* :bdg-secondary:`specVersion` 为扩展该扩展的版本。

.. admonition:: 有一些扩展我们需要重点关注一下
   :class: important

   * :bdg-secondary:`VK_KHR_surface` 代表窗口通用平面扩展。
   * :bdg-secondary:`VK_{vender}_{platform}_surface` 代表各个平台各自的窗口平面（各自平台适配到通用平面）。其中：
      * :bdg-secondary:`vender` 表示该扩展的供应商（或维护方），有的没有提供该供应商字段（取决于扩展开发商）。比如 ``KHR`` 表示 ``Khronos`` 组织提供维护的该扩展。
      * :bdg-secondary:`platform` 表示扩展对应的平台。
   
   .. admonition:: 比如
      :class: note

      * :bdg-secondary:`VK_KHR_win32_surface` 为  ``Windows`` 平台，供应商为 ``Khronos`` 。
      * :bdg-secondary:`VK_OHOS_surface` 为 ``OpenHarmony`` 平台，供应商为 ``华为`` 。
      * :bdg-secondary:`VK_KHR_android_surface` 为 ``Android`` 平台，供应商为 ``Khronos`` 。
      * :bdg-secondary:`VK_KHR_[wayland/xcb/xlib]_surface` 为 ``Linux`` 平台（其中 ``[wayland/xcb/xlib]`` 表示三者其一），供应商为 ``Khronos`` 。

   这些扩展在窗口中显示渲染结果非常重要，对于具体如何使用，将会在之后的章节展开。

销毁 VkInstance
###########################

当创建完 ``VkInstance`` 之后可通过 ``vkDestroyInstance(...)`` 函数销毁。

vkDestroyInstance
*****************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkDestroyInstance(
       VkInstance                                  instance,
       const VkAllocationCallbacks*                pAllocator);

* :bdg-secondary:`instance` 要么为 ``空`` 要么 :bdg-danger:`必须` 为有效的 ``VkInstance`` 。
* :bdg-secondary:`pAllocator` 分配器。需要与创建 ``VkInstance`` 时指定的分配器匹配。

当 ``VkInstance`` 销毁时，需要确保所有该实例环境下创建的对象（句柄）都已经回收或销毁。

示例
##########################

.. code:: c++

   uint32_t vulkan_version = VK_MAKE_API_VERSION(0, 1, 0, 0);

   if(vkEnumerateInstanceVersion != nullptr && vkEnumerateInstanceVersion(&vulkan_version) != VkResult::VK_SUCCESS)
   {
      vulkan_version = VK_MAKE_API_VERSION(0, 1, 0, 0);
   }

   VkInstance instance = VK_NULL_HANDLE;

   VkApplicationInfo application_info = {};
   application_info.sType = VkStructureType::VK_STRUCTURE_TYPE_APPLICATION_INFO;
   application_info.pNext = nullptr;
   application_info.pApplicationName = nullptr;
   application_info.applicationVersion = 0;
   application_info.pEngineName = nullptr;
   application_info.engineVersion = 0;
   application_info.apiVersion = vulkan_version;

   std::vector<const char *> enable_layer_names;
   #if defined(_DEBUG) || defined(NDEBUG)
   enable_layer_names.push_back("VK_LAYER_KHRONOS_validation");
   #endif

   std::vector<const char *> enable_extension_names;
   enable_extension_names.push_back("VK_KHR_surface");
   #if defined(_WIN16) || defined(_WIN32) || defined(_WIN64)
   enable_extension_names.push_back("VK_KHR_win32_surface");
   #elif 其他平台...
   #endif

   VkInstanceCreateInfo instance_create_info = {};
   instance_create_info.sType = VkStructureType::VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO;
   instance_create_info.pNext = nullptr;
   instance_create_info.flags = 0;
   instance_create_info.pApplicationInfo = &application_info;
   instance_create_info.enabledLayerCount = enable_layer_names.size();
   instance_create_info.ppEnabledLayerNames = enable_layer_names.data();
   instance_create_info.enabledExtensionCount = enable_extension_names.size();
   instance_create_info.ppEnabledExtensionNames = enable_extension_names.data();

   VkResult result = vkCreateInstance(&instance_create_info, nullptr, &instance);
   if (result != VK_SUCCESS)
   {
      throw std::runtime_error("VkInstance 创建失败");
   }

   //缤纷绚丽的 Vulkan 程序 ... 

   vkDestroyInstance(instance, nullptr);

..
   分配器
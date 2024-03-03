逻辑设备
===========

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/2/5 更新该文档。
   * 2024/2/5 增加 ``创建逻辑设备`` 章节。
   * 2024/2/5 增加 ``vkCreateDevice`` 章节。
   * 2024/2/5 增加 ``VkDeviceCreateInfo`` 章节。
   * 2024/2/7 增加 ``VkDeviceQueueCreateInfo`` 章节。
   * 2024/2/7 增加 ``设备扩展`` 章节。
   * 2024/2/7 增加 ``vkEnumerateDeviceExtensionProperties`` 章节。
   * 2024/2/7 增加 ``VkExtensionProperties`` 章节。
   * 2024/2/7 增加 ``销毁逻辑设备`` 章节。
   * 2024/2/7 增加 ``vkDestroyDevice`` 章节。
   * 2024/2/7 增加 ``设备特性`` 章节。
   * 2024/2/7 增加 ``示例`` 章节。
   * 2024/2/7 增加 ``vkGetPhysicalDeviceFeatures`` 章节。
   * 2024/2/7 增加 ``VkPhysicalDeviceFeatures`` 章节。
   * 2024/2/8 更新 ``VkPhysicalDeviceFeatures`` 章节。
   * 2024/2/8 更新 ``VkDeviceQueueCreateInfo`` 章节。
   * 2024/2/8 增加 ``获取设备队列`` 章节。
   * 2024/2/8 增加 ``获取设备队列`` 章节下的 ``示例`` 。
   * 2024/2/16 更新 ``vkDestroyDevice`` 章节。

在 `物理设备 <./PhysicalDevice.html>`_ 章节中我们已经知道，可以获取系统中支持 ``Vulkan`` 的多个物理设备 ``VkPhysicalDevice`` 。我们需要确定使用哪一个或哪几个物理设备作为目标设备为我们所用，为此 ``Vulkan`` 将物理设备抽象成逻辑设备 ``VkDevice`` 。

当确定了逻辑设备之后，我们就可以在该设备上进行资源的创建，分配，操作，销毁和回收等各种各样的操作。

创建逻辑设备
#############

我们可以通过 ``vkCreateDevice(...)`` 函数创建逻辑设备。其定义如下：

vkCreateDevice
***************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkCreateDevice(
       VkPhysicalDevice                            physicalDevice,
       const VkDeviceCreateInfo*                   pCreateInfo,
       const VkAllocationCallbacks*                pAllocator,
       VkDevice*                                   pDevice);

* :bdg-secondary:`physicalDevice` 指定在哪一个物理设备上创建逻辑设备。
* :bdg-secondary:`pCreateInfo` 创建逻辑设备的配置信息。
* :bdg-secondary:`pAllocator` 内存分配器。为 ``nullptr`` 表示使用内部默认分配器，否则为自定义分配器。
* :bdg-secondary:`pDevice` 创建逻辑设备的结果。

其中 ``VkDeviceCreateInfo`` 定义如下：

VkDeviceCreateInfo
***************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkDeviceCreateInfo {
       VkStructureType                    sType;
       const void*                        pNext;
       VkDeviceCreateFlags                flags;
       uint32_t                           queueCreateInfoCount;
       const VkDeviceQueueCreateInfo*     pQueueCreateInfos;
       uint32_t                           enabledLayerCount;
       const char* const*                 ppEnabledLayerNames;
       uint32_t                           enabledExtensionCount;
       const char* const*                 ppEnabledExtensionNames;
       const VkPhysicalDeviceFeatures*    pEnabledFeatures;
   } VkDeviceCreateInfo;

* :bdg-secondary:`sType` 是该结构体的类型枚举值， :bdg-danger:`必须` 是 ``VkStructureType::VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`flags` 目前没用上，为将来做准备。
* :bdg-secondary:`queueCreateInfoCount` 指定 ``pQueueCreateInfos`` 数组元素个数。
* :bdg-secondary:`pQueueCreateInfos` 指定 ``VkDeviceQueueCreateInfo`` 数组。用于配置要创建的设备队列信息。
* :bdg-secondary:`enabledLayerCount` 指定 ``ppEnabledLayerNames`` 数组元素个数。该成员已被 :bdg-danger:`遗弃` 并 :bdg-danger:`忽略` 。
* :bdg-secondary:`ppEnabledLayerNames` 指定要开启的验证层。该成员已被 :bdg-danger:`遗弃` 并 :bdg-danger:`忽略` 。
* :bdg-secondary:`enabledExtensionCount` 指定 ``ppEnabledExtensionNames`` 数组中元素个数。
* :bdg-secondary:`ppEnabledExtensionNames` 指定要开启的扩展。该数组数量必须大于等于 ``enabledExtensionCount`` 。
* :bdg-secondary:`pEnabledFeatures` 配置要开启的特性。

其中 ``queueCreateInfoCount`` 和 ``pQueueCreateInfos`` 用于指定在逻辑设备中需要创建的 `设备队列 <./DeviceQueue.html>`_ 。其中 ``VkDeviceQueueCreateInfo`` 定义如下：

VkDeviceQueueCreateInfo
***************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkDeviceQueueCreateInfo {
       VkStructureType             sType;
       const void*                 pNext;
       VkDeviceQueueCreateFlags    flags;
       uint32_t                    queueFamilyIndex;
       uint32_t                    queueCount;
       const float*                pQueuePriorities;
   } VkDeviceQueueCreateInfo;

* :bdg-secondary:`sType` 是该结构体的类型枚举值， :bdg-danger:`必须` 是 ``VkStructureType::VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`flags` 配置额外的信息。可设置的值定义在 ``VkDeviceQueueCreateFlagBits`` 枚举中。
* :bdg-secondary:`queueFamilyIndex` 指定目标设备队列族的索引。
* :bdg-secondary:`queueCount` 指定要在 ``queueFamilyIndex`` 中创建设备队列的数量。
* :bdg-secondary:`pQueuePriorities` 指向元素数量为 ``queueCount`` 的 ``float`` 数组。用于配置创建的每一个设备队列的优先级。

其中 ``queueFamilyIndex`` :bdg-danger:`必须` 是目标物理设备中有效的设备队列族索引，并且 ``queueCount`` :bdg-danger:`必须` 小于等于 ``queueFamilyIndex`` 索引对应的设备队列族中的队列数量。

其中 ``pQueuePriorities`` 配置的优先级的有效等级范围为 ``[0, 1]`` ，优先级越大，优先级越高。其中 ``0.0`` 是最低的优先级， ``1.0`` 是最高的优先级。在某些设备中，优先级越高意味着将会得到更多的执行机会，具体的队列调由设备自身管理， ``Vulkan`` 并不规定调度规则。
在同一逻辑设备上优先级高的设备队列可能会导致低优先级的设备队列长时间处于 ``饥饿`` 状态，直到高级别的设备队列执行完所有指令。但不同的逻辑设备中的某一设备队列饥饿不会影响另一个逻辑设备上的设备队列。

.. admonition:: VkDeviceQueueCreateInfo::flags
   :class: note

   ``VkDeviceQueueCreateFlagBits`` 在 ``Vulkan 1.0`` 版本中没用定义任何成员。

.. admonition:: 饥饿
   :class: note

   队列饥饿。指的是在系统调度中，总是优先调度优先级高的队列，如果在运行时，有源源不断的任务进行高优先级队列，则系统调度会一直调度该高优先级队列，而不调度低优先级的队列。这就会导致低优先级的队列长期处于无响应阶段得不到执行。

设备扩展
#############

在 ``VkDeviceCreateInfo`` 我们需要通过 ``enabledExtensionCount`` 和 ``ppEnabledExtensionNames`` 来指定该逻辑设备要开启的 ``设备扩展`` （ ``Device Extension`` ）。在开启设备扩展之前，我们需要通过 ``vkEnumerateDeviceExtensionProperties(...)`` 函数获取目标设备支持的扩展。其定义如下：

vkEnumerateDeviceExtensionProperties
******************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkEnumerateDeviceExtensionProperties(
       VkPhysicalDevice                            physicalDevice,
       const char*                                 pLayerName,
       uint32_t*                                   pPropertyCount,
       VkExtensionProperties*                      pProperties);

* :bdg-secondary:`physicalDevice` 要查询扩展的目标物理设备。
* :bdg-secondary:`pLayerName` 要么为 ``空`` 要么为 ``层`` 的名称。
* :bdg-secondary:`pPropertyCount`  要么为 ``空`` 要么为 ``pProperties`` 中元素的数量。
* :bdg-secondary:`pProperties`  为扩展信息数组。元素个数 :bdg-danger:`必须` 大于等于 ``pPropertyCount`` 中指定数量。

如果 ``pLayerName`` 为有效的 ``层`` 名，则该函数将会返回该层内部使用的 ``设备扩展`` 。

如果 ``pLayerName`` 为 ``nullptr`` ，则该函数将会返回 ``Vulkan`` 实现和默认启用的 ``层`` 支持的设备扩展信息。

该函数调用与 ``vkEnumerateInstanceExtensionProperties(...)`` 类似，这里不在赘述。通过两次调用 ``vkEnumerateDeviceExtensionProperties(...)`` 函数获取设备扩展信息：

.. code:: c++

   VkPhysicalDevice physical_device = 之前获取的物理设备;

   uint32_t extension_property_count = 0;
   vkEnumerateDeviceExtensionProperties(physical_device, &extension_property_count, nullptr);

   std::vector<VkExtensionProperties> extension_properties(extension_property_count);
   vkEnumerateDeviceExtensionProperties(physical_device, &extension_property_count, extension_properties.data());

获取的设备扩展信息类型 ``VkExtensionProperties`` 与 ``vkEnumerateInstanceExtensionProperties(...)`` 中的一样，这里只给出定义，不再赘述：

VkExtensionProperties
******************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkExtensionProperties {
       char        extensionName[VK_MAX_EXTENSION_NAME_SIZE];
       uint32_t    specVersion;
   } VkExtensionProperties;

.. admonition:: 有一些设备扩展我们需要重点关注一下
   :class: important

   * :bdg-secondary:`VK_KHR_swapchain` 交换链。用于与 ``VK_KHR_surface`` 和平台相关的 ``VK_{vender}_{platform}_surface`` 扩展配合使用。用于窗口化显示渲染结果。
   * :bdg-secondary:`VK_KHR_display` 某些平台支持直接全屏显示渲染结果（比如嵌入式平台：车载、移动平台等）。
   * :bdg-secondary:`VK_KHR_display_swapchain` 全屏显示交换链。与 ``VK_KHR_display`` 扩展配合使用。
   * :bdg-secondary:`VK_EXT_mesh_shader` 网格着色器。一开始为 ``NVIDIA`` 推出的全新管线，有很多优点，后来用的多了就形成了一套标准。
   * :bdg-secondary:`VK_KHR_dynamic_rendering` 动态渲染。为简单渲染时配置过于复杂的诟病提供的一套解决方案。该扩展在 ``Vulkan 1.3`` 被提升至核心。
   * :bdg-secondary:`VK_KHR_external_memory` 外部内存。一般用于 ``OpenGL`` 与 ``Vulkan`` 联动。
   * :bdg-secondary:`VK_KHR_buffer_device_address` 着色器中支持使用设备地址（类似于特殊的指针）。常用于 ``硬件实时光追`` 。
   * :bdg-secondary:`VK_KHR_spirv_1_4` ``SPIR-V 1.4`` 支持。常用于 ``硬件实时光追`` 。

   .. admonition:: 硬件实时光追
      :class: important

      * :bdg-secondary:`VK_KHR_acceleration_structure` 用于光追加速结构。
      * :bdg-secondary:`VK_KHR_ray_tracing_pipeline` 用于光追管线。
      * :bdg-secondary:`VK_KHR_ray_query` 用于光线查询。
      * :bdg-secondary:`VK_KHR_pipeline_library` 用于整合光追管线。

设备特性
#############

在创建逻辑设备时需要配置 ``VkDeviceCreateInfo::pEnabledFeatures`` 参数，该参数用于配置该逻辑设备要开启的设备特性。一个物理设备会支持一系列特性。可以通过 ``vkGetPhysicalDeviceFeatures(...)`` 获取该物理设备支持的特性，其定义如下：

vkGetPhysicalDeviceFeatures
********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetPhysicalDeviceFeatures(
       VkPhysicalDevice                            physicalDevice,
       VkPhysicalDeviceFeatures*                   pFeatures);

* :bdg-secondary:`physicalDevice` 目标物理设备。
* :bdg-secondary:`pFeatures` 支持的特性信息将会写入该指针指向的内存中。

其中 ``VkPhysicalDeviceFeatures`` 定义如下：

VkPhysicalDeviceFeatures
********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkPhysicalDeviceFeatures {
       VkBool32    robustBufferAccess;
       VkBool32    fullDrawIndexUint32;
       VkBool32    imageCubeArray;
       VkBool32    independentBlend;
       VkBool32    geometryShader;
       VkBool32    tessellationShader;
       VkBool32    sampleRateShading;
       VkBool32    dualSrcBlend;
       VkBool32    logicOp;
       VkBool32    multiDrawIndirect;
       VkBool32    drawIndirectFirstInstance;
       VkBool32    depthClamp;
       VkBool32    depthBiasClamp;
       VkBool32    fillModeNonSolid;
       VkBool32    depthBounds;
       VkBool32    wideLines;
       VkBool32    largePoints;
       VkBool32    alphaToOne;
       VkBool32    multiViewport;
       VkBool32    samplerAnisotropy;
       VkBool32    textureCompressionETC2;
       VkBool32    textureCompressionASTC_LDR;
       VkBool32    textureCompressionBC;
       VkBool32    occlusionQueryPrecise;
       VkBool32    pipelineStatisticsQuery;
       VkBool32    vertexPipelineStoresAndAtomics;
       VkBool32    fragmentStoresAndAtomics;
       VkBool32    shaderTessellationAndGeometryPointSize;
       VkBool32    shaderImageGatherExtended;
       VkBool32    shaderStorageImageExtendedFormats;
       VkBool32    shaderStorageImageMultisample;
       VkBool32    shaderStorageImageReadWithoutFormat;
       VkBool32    shaderStorageImageWriteWithoutFormat;
       VkBool32    shaderUniformBufferArrayDynamicIndexing;
       VkBool32    shaderSampledImageArrayDynamicIndexing;
       VkBool32    shaderStorageBufferArrayDynamicIndexing;
       VkBool32    shaderStorageImageArrayDynamicIndexing;
       VkBool32    shaderClipDistance;
       VkBool32    shaderCullDistance;
       VkBool32    shaderFloat64;
       VkBool32    shaderInt64;
       VkBool32    shaderInt16;
       VkBool32    shaderResourceResidency;
       VkBool32    shaderResourceMinLod;
       VkBool32    sparseBinding;
       VkBool32    sparseResidencyBuffer;
       VkBool32    sparseResidencyImage2D;
       VkBool32    sparseResidencyImage3D;
       VkBool32    sparseResidency2Samples;
       VkBool32    sparseResidency4Samples;
       VkBool32    sparseResidency8Samples;
       VkBool32    sparseResidency16Samples;
       VkBool32    sparseResidencyAliased;
       VkBool32    variableMultisampleRate;
       VkBool32    inheritedQueries;
   } VkPhysicalDeviceFeatures;

该 ``VkPhysicalDeviceFeatures`` 中定义了 ``Vulkan 1.0`` 标准设备特性。由于该结构体中成员过多，这里会挑选几个常用的进行讲解。其他的特性在需要使用时会进行说明。

* :bdg-secondary:`geometryShader` 几何着色器。将会在之后的 ``渲染管线`` 章节中进行讲解。
* :bdg-secondary:`tessellationShader` 细分着色器。将会在之后的 ``渲染管线`` 章节中进行讲解。
* :bdg-secondary:`wideLines` 线宽。当绘制线时可以动态设置线宽。

.. note:: 您可以直接开启所有支持的设备特性。但这不是一个明智的选择，特性开启后多少都会消耗设备资源，所以尽量只开启需要的特性。

.. admonition:: 扩展和特性
   :class: note

   有些特性是与设备扩展绑定的。换句话说就是，当开启了某些设备扩展，相应的特性也需要开启。比如：

   * 在开启 ``VK_KHR_ray_tracing_pipeline`` 光追管线扩展之后，需要使用 ``VkPhysicalDeviceRayTracingPipelineFeaturesKHR`` 特性结构体配置开启光追特性。其定义如下：

   .. code:: c++

      // 由 VK_KHR_ray_tracing_pipeline 提供
      typedef struct VkPhysicalDeviceRayTracingPipelineFeaturesKHR {
          VkStructureType    sType;
          void*              pNext;
          VkBool32           rayTracingPipeline;
          VkBool32           rayTracingPipelineShaderGroupHandleCaptureReplay;
          VkBool32           rayTracingPipelineShaderGroupHandleCaptureReplayMixed;
          VkBool32           rayTracingPipelineTraceRaysIndirect;
          VkBool32           rayTraversalPrimitiveCulling;
      } VkPhysicalDeviceRayTracingPipelineFeaturesKHR;

   可以看到 ``VkPhysicalDeviceRayTracingPipelineFeaturesKHR`` 为扩展 ``VK_KHR_ray_tracing_pipeline`` 提供的结构体。也就是说只有在 ``VK_KHR_ray_tracing_pipeline`` 扩展被成功激活后才可以使用该结构体。

   .. important::

      由于目前以 ``Vulkan 1.0`` 核心进行讲解，所以目前不会对于扩展和高版本的 ``Vulkan`` 设备特性进行展开讲解，为了知识的连贯性会在必要的时候提一嘴。但会在未来规划章节中进行详细讲解。

   .. note::

      有关 ``Vulkan`` 的硬件实时光追相关教程可以先浏览 `文献 <./Literature/index.html>`_ 中相关资料。

销毁逻辑设备
#############

在创建完逻辑设备之后，可以通过 ``vkDestroyDevice(...)`` 销毁创建的逻辑设备。其定义如下：

vkDestroyDevice
*************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkDestroyDevice(
       VkDevice                                    device,
       const VkAllocationCallbacks*                pAllocator);

* :bdg-secondary:`device` 要销毁的逻辑设备。
* :bdg-secondary:`pAllocator` 内存分配器。需要与 ``vkCreateDevice(...)`` 时使用的分配器保持一致。

当 ``device`` 销毁时，需要确保所有该逻辑设备下创建的对象（句柄）都已经回收或销毁。

.. _VkDeviceCreateDemo:

示例
#############

.. code:: c++

   VkPhysicalDevice physical_device = 之前获取到的物理设备;
   uint32_t support_graphics_queue_family_index = 之前获取到支持图形功能的队列族索引;

   std::vector<float> queue_priorities;
   queue_priorities.push_back(0.0f);
   queue_priorities.push_back(0.0f);

   VkDeviceQueueCreateInfo device_queue_create_info = {};
   device_queue_create_info.sType = VkStructureType::VK_STRUCTURE_TYPE_DEVICE_QUEUE_CREATE_INFO ;
   device_queue_create_info.pNext = nullptr;
   device_queue_create_info.flags = 0;
   device_queue_create_info.queueFamilyIndex = support_graphics_queue_family_index;
   device_queue_create_info.queueCount = 2; // 一般创建 1 个图形队列即可。这里创建 2 个支持图形的设备队列（假如 support_graphics_queue_family_index 对应的设备族中有 2 个以上设备队列）。
   device_queue_create_info.pQueuePriorities = queue_priorities.data();

   uint32_t extension_property_count = 0;
   vkEnumerateDeviceExtensionProperties(physical_device, &extension_property_count, nullptr);

   std::vector<VkExtensionProperties> extension_properties(extension_property_count);
   vkEnumerateDeviceExtensionProperties(physical_device, &extension_property_count, extension_properties.data());

   std::vector<char*> enable_device_extensions;
   for(const VkExtensionProperties& extension_property_item : extension_properties)
   {
      if(std::strcmp(extension_property_item.extensionName, "VK_KHR_swapchain") == 0)
      {
         enable_device_extensions.push_back("VK_KHR_swapchain");
         break;
      }
   }

   if(enable_device_extensions.empty())
   {
      throw std::runtime_error("设备不支持交换链扩展");
   }

   VkPhysicalDeviceFeatures support_physical_device_features = {};
   vkGetPhysicalDeviceFeatures(physical_device, &support_physical_device_features);

   VkPhysicalDeviceFeatures enable_physical_device_features = {};
   if(support_physical_device_features.geometryShader == VK_TRUE && support_physical_device_features.tessellationShader == VK_TRUE && support_physical_device_features.wideLines == VK_TRUE )
   {
      enable_physical_device_features.geometryShader = support_physical_device_features.geometryShader;
      enable_physical_device_features.tessellationShader = support_physical_device_features.tessellationShader;
      enable_physical_device_features.wideLines = support_physical_device_features.wideLines;
   }
   else
   {
      throw std::runtime_error("设备不支持几何着色器、细分着色器和线宽特性");
   }

   VkDeviceCreateInfo device_create_info = {};
   device_create_info.sType = VkStructureType::VK_STRUCTURE_TYPE_DEVICE_CREATE_INFO;
   device_create_info.pNext = nullptr;
   device_create_info.flags = 0;
   device_create_info.queueCreateInfoCount=1;
   device_create_info.pQueueCreateInfos = &device_queue_create_info;
   device_create_info.enabledLayerCount = 0;
   device_create_info.ppEnabledLayerNames = nullptr;
   device_create_info.enabledExtensionCount = enable_device_extensions.size();
   device_create_info.ppEnabledExtensionNames = enable_device_extensions.data();
   device_create_info.pEnabledFeatures = &enable_physical_device_features;

   VkDevice device = VK_NULL_HANDLE;
   VkResult result = vkCreateDevice(physical_device, &device_create_info, nullptr, &device);
   if(result != VkResult::VK_SUCCESS)
   {
      throw std::runtime_error("逻辑设备创建失败");
   }

   // 获取设备队列 ...
   // 缤纷绚丽的 Vulkan 程序 ... 

   vkDestroyDevice(device, nullptr);

获取设备队列
#############

在创建完逻辑设备后，就可以通过 ``vkGetDeviceQueue(...)`` 函数获取。其定义如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetDeviceQueue(
       VkDevice                                    device,
       uint32_t                                    queueFamilyIndex,
       uint32_t                                    queueIndex,
       VkQueue*                                    pQueue);

* :bdg-secondary:`device` 目标逻辑设备。
* :bdg-secondary:`queueFamilyIndex` 目标设备队列的队列族索引。
* :bdg-secondary:`queueIndex` 对应 ``VkDeviceQueueCreateInfo::queueCount`` 的对应设备队列索引。
* :bdg-secondary:`pQueue` 对应 ``VkDeviceQueueCreateInfo::queueCount`` 创建的第 ``queueIndex`` 的设备队列。

其中 ``queueFamilyIndex`` 、 ``queueIndex`` 的取值与创建逻辑设备时 ``VkDeviceCreateInfo::pQueueCreateInfos`` 参数相匹配。

示例
************

该示例紧接着上面的逻辑设备创建示例 :ref:`VkDeviceCreateDemo` 。

.. code:: c++

   VkDevice device = 之前创建的逻辑设备;
   uint32_t support_graphics_queue_family_index = 之前获取到支持图形功能的队列族索引;

   //由于我们在 support_graphics_queue_family_index 索引的设备族上创建了 2 个设备队列，所以需要获取 2 个设备队列
   VkQueue graphics_queue_0 = VK_NULL_HANDLE;
   vkGetDeviceQueue(device, support_graphics_queue_family_index, 0, &graphics_queue_0);

   VkQueue graphics_queue_1 = VK_NULL_HANDLE;
   vkGetDeviceQueue(device, support_graphics_queue_family_index, 1, &graphics_queue_1);

..
   规划

   Vulkan 1.1设备特性
   Vulkan 1.2设备特性
   Vulkan 1.3设备特性

   扩展特性
物理设备
==============

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/2/2 更新该文档。
   * 2024/2/2 增加 ``vkEnumeratePhysicalDevices`` 章节。
   * 2024/2/2 增加 ``获取物理设备信息`` 章节。
   * 2024/2/2 增加 ``vkGetPhysicalDeviceProperties`` 章节。
   * 2024/2/2 增加 ``VkPhysicalDeviceType`` 章节。
   * 2024/2/2 增加 ``VkPhysicalDeviceLimits`` 章节。
   * 2024/2/2 增加 ``VkPhysicalDeviceSparseProperties`` 章节。
   * 2024/2/2 增加 ``示例`` 章节。

一台主机上可能插着多个支持 ``Vulkan`` 的物理设备，为此 ``Vulkan`` 提供列举出系统中支持 ``Vulkan`` 的所有物理设备功能，开发者可通过 ``vkEnumeratePhysicalDevices(...)`` 函数进行物理设备列举。其定义如下：

vkEnumeratePhysicalDevices
#############################

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkEnumeratePhysicalDevices(
       VkInstance                                  instance,
       uint32_t*                                   pPhysicalDeviceCount,
       VkPhysicalDevice*                           pPhysicalDevices);

* :bdg-secondary:`instance` 是之前使用 ``vkCreateInstance`` 创建的 ``VkInstance`` 句柄。
* :bdg-secondary:`pPhysicalDeviceCount` 是用于指定或获取的物理设备数量。
* :bdg-secondary:`pPhysicalDevices` 要么是 ``NULL`` 要么是数量不小于 ``pPhysicalDeviceCount`` 的 ``VkPhysicalDevice`` 数组。

当 ``pPhysicalDevices`` 为 ``nullptr`` 时，该函数会将系统中支持 ``Vulkan`` 的设备数量写入 ``pPhysicalDeviceCount`` 中。

如果 ``pPhysicalDevices`` 为一个有效指针，则其指向一个 ``VkPhysicalDevice`` 数组，并且该数组长度 :bdg-danger:`不能` 小于 ``pPhysicalDeviceCount`` 。

如果 ``pPhysicalDeviceCount`` 中指定的数量小于系统中的物理设备数量，则 ``pPhysicalDevices`` 中写入的物理设备不是所有，则 ``vkEnumeratePhysicalDevices(...)`` 函数将会写入 ``pPhysicalDeviceCount`` 个物理设备到 ``pPhysicalDevices`` 数组中，并返回 ``VkResult::VK_INCOMPLETE`` 。

如果所有物理设备成功写入，则会返回 ``VkResult::VK_SUCCESS`` 。

因此，枚举所有物理设备需要调用 ``vkEnumeratePhysicalDevices(...)`` 两次：

1. 将 ``pPhysicalDevices`` 设置为 ``nullptr`` ，并通过 ``pPhysicalDeviceCount`` 获取支持系统中支持 ``Vulkan`` 的物理设备数量。
2. 创建 ``pPhysicalDevices`` 数量的 ``VkPhysicalDevice`` 数组，并传入 ``pPhysicalDevices`` 中以获取系统中支持的 ``VkPhysicalDevice`` 物理设备。

.. code:: c++

   VkInstance instance = 支持创建的 VkInstance;

   uint32_t physical_device_count = 0;
   vkEnumeratePhysicalDevices(instance, &physical_device_count, nullptr);

   std::vector<VkPhysicalDevice> physical_devices(physical_device_count);
   vkEnumeratePhysicalDevices(instance, &physical_device_count, physical_devices.data());

这样就可以枚举出系统中支持 ``Vulkan`` 的所有物理设备。

.. note:: 
   
   枚举的 ``VkPhysicalDevice`` 句柄是在调用 ``vkCreateInstance(...)`` 创建 ``VkInstance`` 时驱动内部创建的。换句话说就是：
   ``VkPhysicalDevice`` 句柄的生命周期与 ``VkInstance`` 相同， ``VkInstance`` 创建 ``VkPhysicalDevice`` 句柄们也会创建， ``VkInstance`` 销毁 ``VkPhysicalDevice`` 句柄们也会销毁。

.. _Get_Physical_Devicce_Properties:

获取物理设备信息
######################

在通过 ``vkEnumeratePhysicalDevices(...)`` 获取系统中支持的物理设备句柄后，我们需要筛选出我们需要的物理设备，比如，相比于使用集成显卡，我们往往倾向于使用性能更强悍的独立显卡。

我们可以通过 ``vkGetPhysicalDeviceProperties(...)`` 函数获取物理设备信息：

vkGetPhysicalDeviceProperties
***********************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetPhysicalDeviceProperties(
       VkPhysicalDevice                            physicalDevice,
       VkPhysicalDeviceProperties*                 pProperties);

* :bdg-secondary:`physicalDevice` 对应要获取属性的物理设备的句柄。
* :bdg-secondary:`pProperties` 对应返回的物理设备属性。

其中 ``VkPhysicalDeviceProperties`` 定义如下：

VkPhysicalDeviceProperties
***********************************

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
* :bdg-secondary:`limits` 设备的限制信息。
* :bdg-secondary:`sparseProperties` 稀疏数据属性。

其中 ``apiVersion`` 是最为 :bdg-danger:`重要` 的参数，该参数表明该设备支持的 ``Vulkan`` 最高版本。该版本与 ``VkApplicationInfo::apiVersion`` 中的版本类似，您只能获取到 ``VkPhysicalDeviceProperties::apiVersion`` 版本及之前版本 ``Vulkan`` 对应的 ``Device 域函数`` 。

所以能够获取到的 ``Vulkan`` 函数逻辑如下：

.. mermaid::
   
   flowchart TD
      VulkanAPI["Vulkan 某一个函数"]
      IsLessEqualInstanceVulkanVersion{"小于等于 VkApplicationInfo::apiVersion 版本"}
      IsInstanceAPI{"为 Instance/PhysicalDevice 域函数"}
      IsDeviceAPI{"为 Device 域函数"}
      IsLessEqualDeviceVulkanVersion{"小于等于 VkPhysicalDeviceProperties::apiVersion 版本"}

      ReturnValidAPI["返回有效API"]
      ReturnNullAPI["返回无效API\n（nullptr）"]

      VulkanAPI-->IsLessEqualInstanceVulkanVersion
      IsLessEqualInstanceVulkanVersion--是-->IsInstanceAPI
      IsLessEqualInstanceVulkanVersion--否-->ReturnNullAPI

      IsInstanceAPI--是-->ReturnValidAPI
      IsInstanceAPI--否-->IsDeviceAPI

      IsDeviceAPI--是-->IsLessEqualDeviceVulkanVersion
      IsDeviceAPI--否-->Undefine["未定义\n一个函数不可能 既不是 Instance/PhysicalDevice 域函数也不是 Device 域函数"]

      IsLessEqualDeviceVulkanVersion--是-->ReturnValidAPI
      IsLessEqualDeviceVulkanVersion--否-->ReturnNullAPI

其中 ``VkPhysicalDeviceType`` 定义如下：

VkPhysicalDeviceType
*************************

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

一般首选使用 ``VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU`` 独立显卡，之后再考虑使用 ``VK_PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU`` 集成显卡。

其中 ``VkPhysicalDeviceLimits`` 用于表述该设备的一些限制，比如最大支持的图片像素大小。

.. _Vk_Physical_Device_Limits:

VkPhysicalDeviceLimits
*************************

.. note:: 由于该结构体中有很多还没有涉及到的知识，并且成员过多，所以这里只给出定义。用户只需要知道该结构体中存有物理设备的上限信息即可。

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkPhysicalDeviceLimits {
       uint32_t              maxImageDimension1D;
       uint32_t              maxImageDimension2D;
       uint32_t              maxImageDimension3D;
       uint32_t              maxImageDimensionCube;
       uint32_t              maxImageArrayLayers;
       uint32_t              maxTexelBufferElements;
       uint32_t              maxUniformBufferRange;
       uint32_t              maxStorageBufferRange;
       uint32_t              maxPushConstantsSize;
       uint32_t              maxMemoryAllocationCount;
       uint32_t              maxSamplerAllocationCount;
       VkDeviceSize          bufferImageGranularity;
       VkDeviceSize          sparseAddressSpaceSize;
       uint32_t              maxBoundDescriptorSets;
       uint32_t              maxPerStageDescriptorSamplers;
       uint32_t              maxPerStageDescriptorUniformBuffers;
       uint32_t              maxPerStageDescriptorStorageBuffers;
       uint32_t              maxPerStageDescriptorSampledImages;
       uint32_t              maxPerStageDescriptorStorageImages;
       uint32_t              maxPerStageDescriptorInputAttachments;
       uint32_t              maxPerStageResources;
       uint32_t              maxDescriptorSetSamplers;
       uint32_t              maxDescriptorSetUniformBuffers;
       uint32_t              maxDescriptorSetUniformBuffersDynamic;
       uint32_t              maxDescriptorSetStorageBuffers;
       uint32_t              maxDescriptorSetStorageBuffersDynamic;
       uint32_t              maxDescriptorSetSampledImages;
       uint32_t              maxDescriptorSetStorageImages;
       uint32_t              maxDescriptorSetInputAttachments;
       uint32_t              maxVertexInputAttributes;
       uint32_t              maxVertexInputBindings;
       uint32_t              maxVertexInputAttributeOffset;
       uint32_t              maxVertexInputBindingStride;
       uint32_t              maxVertexOutputComponents;
       uint32_t              maxTessellationGenerationLevel;
       uint32_t              maxTessellationPatchSize;
       uint32_t              maxTessellationControlPerVertexInputComponents;
       uint32_t              maxTessellationControlPerVertexOutputComponents;
       uint32_t              maxTessellationControlPerPatchOutputComponents;
       uint32_t              maxTessellationControlTotalOutputComponents;
       uint32_t              maxTessellationEvaluationInputComponents;
       uint32_t              maxTessellationEvaluationOutputComponents;
       uint32_t              maxGeometryShaderInvocations;
       uint32_t              maxGeometryInputComponents;
       uint32_t              maxGeometryOutputComponents;
       uint32_t              maxGeometryOutputVertices;
       uint32_t              maxGeometryTotalOutputComponents;
       uint32_t              maxFragmentInputComponents;
       uint32_t              maxFragmentOutputAttachments;
       uint32_t              maxFragmentDualSrcAttachments;
       uint32_t              maxFragmentCombinedOutputResources;
       uint32_t              maxComputeSharedMemorySize;
       uint32_t              maxComputeWorkGroupCount[3];
       uint32_t              maxComputeWorkGroupInvocations;
       uint32_t              maxComputeWorkGroupSize[3];
       uint32_t              subPixelPrecisionBits;
       uint32_t              subTexelPrecisionBits;
       uint32_t              mipmapPrecisionBits;
       uint32_t              maxDrawIndexedIndexValue;
       uint32_t              maxDrawIndirectCount;
       float                 maxSamplerLodBias;
       float                 maxSamplerAnisotropy;
       uint32_t              maxViewports;
       uint32_t              maxViewportDimensions[2];
       float                 viewportBoundsRange[2];
       uint32_t              viewportSubPixelBits;
       size_t                minMemoryMapAlignment;
       VkDeviceSize          minTexelBufferOffsetAlignment;
       VkDeviceSize          minUniformBufferOffsetAlignment;
       VkDeviceSize          minStorageBufferOffsetAlignment;
       int32_t               minTexelOffset;
       uint32_t              maxTexelOffset;
       int32_t               minTexelGatherOffset;
       uint32_t              maxTexelGatherOffset;
       float                 minInterpolationOffset;
       float                 maxInterpolationOffset;
       uint32_t              subPixelInterpolationOffsetBits;
       uint32_t              maxFramebufferWidth;
       uint32_t              maxFramebufferHeight;
       uint32_t              maxFramebufferLayers;
       VkSampleCountFlags    framebufferColorSampleCounts;
       VkSampleCountFlags    framebufferDepthSampleCounts;
       VkSampleCountFlags    framebufferStencilSampleCounts;
       VkSampleCountFlags    framebufferNoAttachmentsSampleCounts;
       uint32_t              maxColorAttachments;
       VkSampleCountFlags    sampledImageColorSampleCounts;
       VkSampleCountFlags    sampledImageIntegerSampleCounts;
       VkSampleCountFlags    sampledImageDepthSampleCounts;
       VkSampleCountFlags    sampledImageStencilSampleCounts;
       VkSampleCountFlags    storageImageSampleCounts;
       uint32_t              maxSampleMaskWords;
       VkBool32              timestampComputeAndGraphics;
       float                 timestampPeriod;
       uint32_t              maxClipDistances;
       uint32_t              maxCullDistances;
       uint32_t              maxCombinedClipAndCullDistances;
       uint32_t              discreteQueuePriorities;
       float                 pointSizeRange[2];
       float                 lineWidthRange[2];
       float                 pointSizeGranularity;
       float                 lineWidthGranularity;
       VkBool32              strictLines;
       VkBool32              standardSampleLocations;
       VkDeviceSize          optimalBufferCopyOffsetAlignment;
       VkDeviceSize          optimalBufferCopyRowPitchAlignment;
       VkDeviceSize          nonCoherentAtomSize;
   } VkPhysicalDeviceLimits;

VkPhysicalDeviceSparseProperties
**************************************

.. admonition:: VkPhysicalDeviceSparseProperties
   :class: note

   将会在 ``稀疏`` 资源章节中进行讲解。

示例
#######

.. code:: c++

   VkInstance instance = 支持创建的 VkInstance;

   uint32_t physical_device_count = 0;
   vkEnumeratePhysicalDevices(instance, &physical_device_count, nullptr);

   std::vector<VkPhysicalDevice> physical_devices(physical_device_count);
   vkEnumeratePhysicalDevices(instance, &physical_device_count, physical_devices.data());

   VkPhysicalDevice target_physical_device = VK_NULL_HANDLE;

   for(VkPhysicalDevice& physical_device : physical_devices)
   {
      VkPhysicalDeviceProperties physical_device_properties = {};
      vkGetPhysicalDeviceProperties(physical_device, &physical_device_properties);

      if(physical_device_properties.deviceType == VkPhysicalDeviceType::VK_PHYSICAL_DEVICE_TYPE_DISCRETE_GPU)
      {
         target_physical_device = physical_device;
         break;
      }
      else if(physical_device_properties.deviceType == VkPhysicalDeviceType::VK_PHYSICAL_DEVICE_TYPE_INTEGRATED_GPU)
      {
         target_physical_device = physical_device;
      }
   }

   if(target_physical_device == VK_NULL_HANDLE)
   {
      throw std::runtime_error("没有找到合适的物理设备");
   }

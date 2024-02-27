内存
============

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/2/17 更新该文档。
   * 2024/2/17 增加 ``句柄对象的内存分配器`` 章节。
   * 2024/2/17 增加 ``PFN_vkAllocationFunction`` 章节。
   * 2024/2/17 增加 ``PFN_vkReallocationFunction`` 章节。
   * 2024/2/21 更新 ``PFN_vkAllocationFunction`` 章节。
   * 2024/2/21 更新 ``PFN_vkReallocationFunction`` 章节。
   * 2024/2/21 增加 ``PFN_vkInternalAllocationNotification`` 章节。
   * 2024/2/21 增加 ``PFN_vkInternalFreeNotification`` 章节。
   * 2024/2/21 增加 ``VkSystemAllocationScope`` 章节。
   * 2024/2/21 增加 ``VkInternalAllocationType`` 章节。
   * 2024/2/21 增加 ``示例`` 章节。
   * 2024/2/27 增加 ``设备内存`` 章节。
   * 2024/2/27 增加 ``vkGetPhysicalDeviceMemoryProperties`` 章节。

``Vulkan`` 中有两种分配内存的途径：

1. 在 ``vkCreate{对象名称}(...)`` 或 ``vkDestroy{对象名称}(...)`` 函数中指定 ``const VkAllocationCallbacks* pAllocator`` 内存分配器。比如：

   * ``vkCreateInstance(...)`` 和 ``vkDestroyInstance(...)``
   * ``vkCreateDevice(...)`` 和 ``vkDestroyDevice(...)``

   该方式是在创建和销毁句柄对象时指定，用于在 ``内存条`` 上分配和回收内存。其内部通过 ``malloc`` 和 ``free`` 之类的函数进行内存分配和销毁。用于 ``句柄对象`` 本身的分配和销毁。

   .. note::

      * 一般 ``pAllocator`` 可以直接指定为 ``nullptr`` ，用于告诉 ``Vulkan`` 使用内置的内存分配器。
      * 如果 :bdg-danger:`不为` ``nullptr`` ，则用于指定自定义内存分配器。

   .. note::

      自定义内存分配器常用于内存统计。


2. 通过 ``vkAllocateMemory(...)`` 函数分配内存。

   该方式主要用于在 ``Host`` 端和 ``Device`` 端进行内存分配。主要用于存储 ``GPU`` 的计算结果。

现在就安顺进行讲解：

句柄对象的内存分配器
#########################

在创建句柄（对象）时需要指定 ``const VkAllocationCallbacks* pAllocator`` 的内存分配器。其中 ``VkAllocationCallbacks`` 定义如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkAllocationCallbacks {
       void*                                   pUserData;
       PFN_vkAllocationFunction                pfnAllocation;
       PFN_vkReallocationFunction              pfnReallocation;
       PFN_vkFreeFunction                      pfnFree;
       PFN_vkInternalAllocationNotification    pfnInternalAllocation;
       PFN_vkInternalFreeNotification          pfnInternalFree;
   } VkAllocationCallbacks;

* :bdg-secondary:`pUserData` 为用户自定义数据指针。当该分配器中的回调被调用时将会传入 ``pUserData`` 作为回调的第一个参数。
* :bdg-secondary:`pfnAllocation` 内存分配回调。用于分配内存。
* :bdg-secondary:`pfnReallocation` 内存重分配回调。用于重分配内存。
* :bdg-secondary:`pfnFree` 内存释放回调。用于释放内存。
* :bdg-secondary:`pfnInternalAllocation` 内部内存分配通知回调。该回调由驱动在分配内部内存时调用。仅用于将内部内存分配信息反馈给用户。该回调内部 :bdg-danger:`不应该` 分配新内存。
* :bdg-secondary:`pfnInternalFree` 内部内存释放通知回调。该回调由驱动在释放内部内存时调用。仅用于将内部内存释放信息反馈给用户。该回调内部 :bdg-danger:`不应该` 释放内存。

其中 ``PFN_vkAllocationFunction`` 定义如下：

PFN_vkAllocationFunction
****************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef void* (VKAPI_PTR *PFN_vkAllocationFunction)(
      void*                                       pUserData,
      size_t                                      size,
      size_t                                      alignment,
      VkSystemAllocationScope                     allocationScope);

* :bdg-secondary:`pUserData` 为用户自定义数据指针。对应 ``VkAllocationCallbacks::pUserData`` 。
* :bdg-secondary:`size` 要分配的内存大小。单位为 ``字节`` 。
* :bdg-secondary:`alignment` 要分配内存的 ``内存对齐`` 大小。单位为 ``字节`` 。:bdg-danger:`必须` 为 ``2`` 的幂次方。
* :bdg-secondary:`allocationScope` 该内存声明周期所属的分配范围。

该函数回调将返回大小为 ``size`` 比特，内存对齐为 ``alignment`` 分配的新内存。

如果分配失败，该函数 :bdg-danger:`必须` 返回 ``NULL`` 。如果分配成功，需要返回空间 :bdg-danger:`最少` 为 ``size`` 字节，并且指针地址为 ``alignment`` 的倍数。

.. admonition:: 内存对齐
   :class: note

   .. important:: 此处简单讲解内存对齐，并不完善，只是说明了基本思想，网上有很多详细资料可供参阅。

   处理芯片在读取内存时并不是一比特一比特的读，而是 :math:`n` 字节 :math:`n` 字节的读取（其中 :math:`n` 为 ``2`` 的幂次方）。如下结构体：

   .. code:: c++

      struct Demo
      {
         char  a; // 占 1 字节
         int   b; // 占 4 字节
         short c; // 占 2 字节
      };

   比如当 :math:`n = 4` 时，也就是一次读取 ``4`` 个字节。判定如下：

   * 由于 ``a`` 只占 ``1`` 个字节，而处理器一次性读 ``4`` 个字节，则 ``a`` 成员大小将会扩展到 ``4`` 个字节。其中只有第一个字节为 ``a`` 成员的有效内存，其他 ``3`` 个扩展字节用于占位。
   * 由于 ``b`` 的大小为 ``4`` 个字节，正好为 ``4`` 的倍数。则不需要扩展字节就可以直接读。
   * 由于 ``c`` 的大小小于 ``4`` 则其处理方式与 ``a`` 的一样，扩展到 ``4`` 字节，其中前两个字节为 ``c`` 成员的有效内存，其他 ``2`` 个字节用于占位。

   示意图如下：

   .. figure:: ./_static/aligment_struct.png

   这样处理器在 ``4`` 个字节 ``4`` 个字节读的时候就能够读取到正确的数据了。
   
   如上就是按照 ``4`` 字节进行的内存对齐。

``PFN_vkAllocationFunction`` 是一个函数指针，需要指向一个返回值为 ``void*`` 形参为 ``(void *pUserData, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)`` 的函数。比如：

.. tab-set::

    .. tab-item:: C++ 17

      .. code:: c++

         #include <cstdlib>

         void *VKAPI_PTR Allocation(void *pUserData, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
         {
            return aligned_alloc(alignment, size);
         }

         PFN_vkAllocationFunction pfn_allocation = &Allocation;

    .. tab-item:: Windows

      .. code:: c++

         #include <malloc.h>

         void *VKAPI_PTR Allocation(void *pUserData, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
         {
            return _aligned_malloc(size, alignment);
         }

         PFN_vkAllocationFunction pfn_allocation = &Allocation;

    .. tab-item:: Linux

      .. code:: c++

         #include <malloc.h>

         void *VKAPI_PTR Allocation(void *pUserData, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
         {
            return memalign(alignment, size);
         }

         PFN_vkAllocationFunction pfn_allocation = &Allocation;

其中 ``PFN_vkReallocationFunction`` 定义如下：

PFN_vkReallocationFunction
****************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef void* (VKAPI_PTR *PFN_vkReallocationFunction)(
       void*                                       pUserData,
       void*                                       pOriginal,
       size_t                                      size,
       size_t                                      alignment,
       VkSystemAllocationScope                     allocationScope);

* :bdg-secondary:`pUserData` 为用户自定义数据指针。对应 ``VkAllocationCallbacks::pUserData`` 。
* :bdg-secondary:`pOriginal` 在该内存的基础上进行重分配。
* :bdg-secondary:`size` 要重分配的内存大小。单位为 ``字节`` 。
* :bdg-secondary:`alignment` 要分配内存的 ``内存对齐`` 大小。单位为 ``字节`` 。:bdg-danger:`必须` 为 ``2`` 的幂次方。
* :bdg-secondary:`allocationScope` 该内存声明周期所属的分配范围。

.. 该回调将返回在 ``pOriginal`` 内存的基础上进行重分配，并将新分配的内存结果返回。

如果分配成功，需要返回空间 :bdg-danger:`最少` 为 ``size`` 字节，并且 ``pOriginal`` 原始内存内的 :math:`[0, min(原始内存大小, 新分配的内存大小)-1]` 范围的数据需要原封不动的转移至新分配的内存中。

如果新分配的内存大小大于之前的分配，则多出来的内存数据初始值是未定义的。

如果满足如上要求进行了重新单独分配，则之前的内存需要进行回收。

如果 ``pOriginal`` 为 ``空`` ，则该回调的行为需要与 ``PFN_vkAllocationFunction`` 回调一致。

如果 ``size`` 为 ``0`` ，则该回调的行为需要与 ``PFN_vkFreeFunction`` 回调一致。

如果 ``pOriginal`` 非空，该分配 :bdg-danger:`必须` 确保 ``alignment`` 与 ``pOriginal`` 分配的 ``alignment`` 保持一致。

如果重分配失败，并且 ``pOriginal`` 非空，则 :bdg-danger:`不能` 回收 ``pOriginal`` 之前的内存。

``PFN_vkReallocationFunction`` 是一个函数指针，需要指向一个返回值为 ``void*`` 形参为 ``(void *pUserData, void *pOriginal, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)`` 的函数。比如：

.. tab-set::

    .. tab-item:: Windows

      .. code:: c++

         #include <malloc.h>

         void *VKAPI_PTR Reallocate(void *pUserData, void *pOriginal, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
         {
            return _aligned_realloc(pOriginal, size, alignment);
         }

         PFN_vkReallocationFunction pfn_reallocation = &Reallocate;

    .. tab-item:: Linux

      .. code:: c++

         #include <malloc.h>

         void *VKAPI_PTR Reallocate(void *pUserData, void *pOriginal, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
         {
            void* new_memory = memalign(alignment, size);
            if(new_memory)
            {
               memcpy(new_memory, pOriginal, min(malloc_usable_size(pOriginal), size));
               free(pOriginal);
               return new_memory;
            }

            return nullptr;
            //return realloc(pOriginal, size); // 此处使用 realloc(...) 进行重分配可能会有问题，Linux 上没有 _aligned_realloc(...) 函数需要自己实现。
         }

         PFN_vkReallocationFunction pfn_reallocation = &Reallocate;

其中 ``PFN_vkFreeFunction`` 定义如下：

PFN_vkFreeFunction
****************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef void (VKAPI_PTR *PFN_vkFreeFunction)(
       void*                                       pUserData,
       void*                                       pMemory);

* :bdg-secondary:`pUserData` 为用户自定义数据指针。对应 ``VkAllocationCallbacks::pUserData`` 。
* :bdg-secondary:`pMemory` 要回收的内存指针。

``PFN_vkFreeFunction`` 是一个函数指针，需要指向一个返回值为 ``void`` 形参为 ``(void *pUserData, void *pMemory)`` 的函数。比如：

.. tab-set::

    .. tab-item:: Windows

      .. code:: c++

         #include <malloc.h>

         void *VKAPI_PTR Free(void *pUserData, void *pMemory)
         {
            return _aligned_free(pMemory);
         }

         PFN_vkFreeFunction pfn_free = &Free;

    .. tab-item:: Linux

      .. code:: c++

         #include <malloc.h>

         void *VKAPI_PTR Free(void *pUserData, void *pMemory)
         {
            return free(pOriginal, size);
         }

         PFN_vkFreeFunction pfn_free = &Free;

其中 ``PFN_vkInternalAllocationNotification`` 定义如下：

PFN_vkInternalAllocationNotification
***************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef void (VKAPI_PTR *PFN_vkInternalAllocationNotification)(
       void*                                       pUserData,
       size_t                                      size,
       VkInternalAllocationType                    allocationType,
       VkSystemAllocationScope                     allocationScope);

* :bdg-secondary:`pUserData` 为用户自定义数据指针。对应 ``VkAllocationCallbacks::pUserData`` 。
* :bdg-secondary:`size` 分配的内存大小。单位为 ``字节`` 。
* :bdg-secondary:`allocationType` 分配的类型。
* :bdg-secondary:`allocationScope` 该内存声明周期所属的分配范围。

该函数回调仅仅用于纯信息返回。

其中 ``PFN_vkInternalFreeNotification`` 定义如下：

PFN_vkInternalFreeNotification
***************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef void (VKAPI_PTR *PFN_vkInternalFreeNotification)(
       void*                                       pUserData,
       size_t                                      size,
       VkInternalAllocationType                    allocationType,
       VkSystemAllocationScope                     allocationScope);

* :bdg-secondary:`pUserData` 为用户自定义数据指针。对应 ``VkAllocationCallbacks::pUserData`` 。
* :bdg-secondary:`size` 回收的内存大小。单位为 ``字节`` 。
* :bdg-secondary:`allocationType` 分配的类型。
* :bdg-secondary:`allocationScope` 该内存声明周期所属的分配范围。

该函数回调仅仅用于纯信息返回。

每一次分配都对应的 ``allocationScope`` 分配范围用于定义此次分配与之相关的对象。有效的枚举值被定义在了 ``VkSystemAllocationScope`` 中。其定义如下：

VkSystemAllocationScope
***************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef enum VkSystemAllocationScope {
       VK_SYSTEM_ALLOCATION_SCOPE_COMMAND = 0,
       VK_SYSTEM_ALLOCATION_SCOPE_OBJECT = 1,
       VK_SYSTEM_ALLOCATION_SCOPE_CACHE = 2,
       VK_SYSTEM_ALLOCATION_SCOPE_DEVICE = 3,
       VK_SYSTEM_ALLOCATION_SCOPE_INSTANCE = 4,
   } VkSystemAllocationScope;

* :bdg-secondary:`VK_SYSTEM_ALLOCATION_SCOPE_COMMAND` 表示此次分配作用于 ``Vulkan`` 指令。
* :bdg-secondary:`VK_SYSTEM_ALLOCATION_SCOPE_OBJECT` 表示此次分配作用于 ``Vulkan`` 对象创建或使用。
* :bdg-secondary:`VK_SYSTEM_ALLOCATION_SCOPE_CACHE` 表示此次分配作用于 ``VkPipelineCache`` 或者 ``VkValidationCacheEXT `` 对象。
* :bdg-secondary:`VK_SYSTEM_ALLOCATION_SCOPE_DEVICE` 表示此次分配作用于 ``Vulkan`` 的设备。
* :bdg-secondary:`VK_SYSTEM_ALLOCATION_SCOPE_INSTANCE` 表示此次分配作用于 ``Vulkan`` 的实例。

其中作为 ``pfnInternalAllocation`` 和 ``pfnInternalFree`` 回调函数形参的 ``allocationType`` 有效的枚举值被定义在了 ``VkInternalAllocationType`` 中。其定义如下：

VkInternalAllocationType
***************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef enum VkInternalAllocationType {
       VK_INTERNAL_ALLOCATION_TYPE_EXECUTABLE = 0,
   } VkInternalAllocationType;

* :bdg-secondary:`VK_INTERNAL_ALLOCATION_TYPE_EXECUTABLE` 表示此次分配作用于 ``Host`` 端程序。

示例
*******

这里给出 ``Windows`` 平台代码示例， ``Linux`` 平台类似。

.. code:: c++

   #include <malloc.h>

   size_t memory_in_use = 0; // 统计内存使用大小

   void *VKAPI_PTR Allocation(void *pUserData, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
   {
      memory_in_use += size;
      return _aligned_malloc(size, alignment);
   }

   void *VKAPI_PTR Reallocate(void *pUserData, void *pOriginal, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
   {
      memory_in_use -= _msize(pOriginal);
      memory_in_use += size;
      return _aligned_realloc(pOriginal, size, alignment);
   }

   void *VKAPI_PTR Free(void *pUserData, void *pMemory)
   {
      memory_in_use -= _msize(pMemory);
      return _aligned_free(pMemory);
   }

   void VKAPI_PTR InternalAllocationNotification(void* pUserData, size_t size, VkInternalAllocationType allocationType, VkSystemAllocationScope allocationScope)
   {
   }

   void VKAPI_PTR InternalFreeNotification(void* pUserData, size_t size, VkInternalAllocationType allocationType, VkSystemAllocationScope allocationScope)
   {
   }

   VkAllocationCallbacks GetVkAllocationCallbacks(void* pUserData)
   {
      VkAllocationCallbacks vk_allocation_callbacks = {};
      vk_allocation_callbacks.pUserData = pUserData;
      vk_allocation_callbacks.pfnAllocation = &Allocation;
      vk_allocation_callbacks.pfnReallocation = &Reallocate;
      vk_allocation_callbacks.pfnFree = &Free;
      vk_allocation_callbacks.pfnInternalAllocation = &InternalAllocationNotification;
      vk_allocation_callbacks.pfnInternalFree = &InternalFreeNotification;

      return vk_allocation_callbacks;
   }

   VkInstanceCreateInfo instance_create_info = 之前填写的创建信息;

   VkAllocationCallbacks allocation_callbacks = GetVkAllocationCallbacks(nullptr);

   VkInstance instance = VK_NULL_HANDLE;

   VkResult result = vkCreateInstance(&instance_create_info, &allocation_callbacks, &instance);
   if (result != VK_SUCCESS)
   {
      throw std::runtime_error("VkInstance 创建失败");
   }

   // 缤纷绚丽的 Vulkan 程序 ...

   vkDestroyInstance(instance, &allocation_callbacks);

设备内存
#########################

``Vulkan`` 标准规定了两种设备内存：

1. :bdg-secondary:`Host 端内存` 一般表示主板内存条上的内存。
2. :bdg-secondary:`Device 端内存` 一般表示 ``GPU`` 设备内部使用的内存。

这些设备内存根据不同特性又分为两种类型：

1. :bdg-secondary:`Host 端内存，但可被 Device 端访问` 这类内存的前提是在主板的内存条上，并且这部分内存可被 ``GPU`` 访问。
2. :bdg-secondary:`Device 端独占内存` ``GPU`` 设备自身携带的专有内存。

其示意图如下：

.. figure:: ./_static/device_memory_struct.png

   Vulkan 设备内存示意图

.. important::

   不管内存是内存条上的还是物理设备上的，只要能被 ``Vulkan`` 识别并使用的内存都叫做 ``设备内存`` 。

由于 ``Vulkan`` 支持多种类型的内存，所以需要先通过 ``vkGetPhysicalDeviceMemoryProperties(...)`` 获取支持的内存信息。其定义如下：

vkGetPhysicalDeviceMemoryProperties
**************************************

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   void vkGetPhysicalDeviceMemoryProperties(
       VkPhysicalDevice                            physicalDevice,
       VkPhysicalDeviceMemoryProperties*           pMemoryProperties);

* :bdg-secondary:`physicalDevice` 要获取设备内存所对应的物理设备。
* :bdg-secondary:`pMemoryProperties` 返回设备内存信息。

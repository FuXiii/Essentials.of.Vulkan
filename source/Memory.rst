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

         #include <cstdlib>

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

该回调将返回在 ``pOriginal`` 内存的基础上进行重分配，并将新分配的内存结果返回。

如果 ``pOriginal`` 为 ``空`` ，则该回调的行为需要与 ``PFN_vkAllocationFunction`` 回调一致。

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

         #include <cstdlib>

         void *VKAPI_PTR Reallocate(void *pUserData, void *pOriginal, size_t size, size_t alignment, VkSystemAllocationScope allocationScope)
         {
            return realloc(pOriginal, size); // 此处使用 realloc(...) 进行重分配可能会有问题，Linux 上没有 _aligned_realloc(...) 函数需要自己实现。
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

         #include <cstdlib>

         void *VKAPI_PTR Free(void *pUserData, void *pMemory)
         {
            return free(pOriginal, size);
         }

         PFN_vkFreeFunction pfn_free = &Free;

资源
=========

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档
   * 2024/3/27 更新该文档
   * 2024/3/27 增加 ``缓存资源`` 章节。
   * 2024/3/27 增加 ``创建缓存`` 章节。

在 ``Vulkan`` 中只有 ``2`` 种资源 :

* :bdg-secondary:`Buffer` 缓存资源。一段连续内存的数据集合。
* :bdg-secondary:`Image` 图片资源。有特定数据格式的数据块集合。

.. note::

   ``Vulkan`` 标准中的资源其实并不只有这 ``2`` 种，还有一种资源为 ``加速结构`` ，该资源在说明 ``Vulkan 硬件实时光追`` 时会涉及。由于 ``Buffer`` 和 ``Image`` 是最为核心的两个资源所以目前仅涉及这两个资源。

在 ``Vulkan`` 中创建的所有资源都是 :bdg-warning:`虚` 资源，换句话说就是，创建的资源仅仅是一个资源句柄，并没有对应存储资源数据的内存。资源需要绑定到合适的设备内存中才具有 :bdg-warning:`完整的一生` （图桓宇给出了一个赞许的大拇指 (๑•̀ㅂ•́)و✧ ）。

缓存资源
###########

在 ``Vulkan`` 中使用 ``VkBuffer`` 句柄代表缓存资源。其定义如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VK_DEFINE_NON_DISPATCHABLE_HANDLE(VkBuffer)

创建缓存
****************************

缓存资源通过 ``vkCreateBuffer(...)`` 函数创建，其定义如下：

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   VkResult vkCreateBuffer(
       VkDevice                                    device,
       const VkBufferCreateInfo*                   pCreateInfo,
       const VkAllocationCallbacks*                pAllocator,
       VkBuffer*                                   pBuffer);

* :bdg-secondary:`device` 要创建缓存的目标逻辑设备。
* :bdg-secondary:`pCreateInfo` 缓存的创建信息。
* :bdg-secondary:`pAllocator` 缓存句柄的内存分配器。如果为 ``nullptr`` 则使用内置的分配器，否则需要自定义句柄内存分配器。
* :bdg-secondary:`pBuffer` 创建的缓存结果。




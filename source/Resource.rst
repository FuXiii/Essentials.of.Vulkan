资源
=========

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档
   * 2024/3/27 更新该文档
   * 2024/3/27 增加 ``缓存资源`` 章节。
   * 2024/3/27 增加 ``创建缓存`` 章节。
   * 2024/3/28 增加 ``vkCreateBuffer`` 章节。
   * 2024/3/28 增加 ``VkBufferCreateInfo`` 章节。
   * 2024/3/28 增加 ``VkBufferUsageFlagBits`` 章节。

在 ``Vulkan`` 中只有 ``2`` 种资源 :

* :bdg-secondary:`Buffer` 缓存资源。一段连续内存的数据集合。
* :bdg-secondary:`Image` 图片资源。有特定数据格式的数据块集合。

.. note::

   ``Vulkan`` 标准中的资源其实并不只有这 ``2`` 种，比如其中的一种资源为 ``加速结构`` ，该资源在说明 ``Vulkan 硬件实时光追`` 时会涉及。由于 ``Buffer`` 和 ``Image`` 是最为核心的两个资源所以目前仅涉及这两个资源。

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

vkCreateBuffer
--------------------

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

其中 ``pCreateInfo`` 为缓存创建配置信息，对应的 ``VkBufferCreateInfo`` 类型定义如下：

VkBufferCreateInfo
-----------------------

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef struct VkBufferCreateInfo {
       VkStructureType        sType;
       const void*            pNext;
       VkBufferCreateFlags    flags;
       VkDeviceSize           size;
       VkBufferUsageFlags     usage;
       VkSharingMode          sharingMode;
       uint32_t               queueFamilyIndexCount;
       const uint32_t*        pQueueFamilyIndices;
   } VkBufferCreateInfo;

* :bdg-secondary:`sType` 是该结构体的类型枚举值， :bdg-danger:`必须` 是 ``VkStructureType::VK_STRUCTURE_TYPE_BUFFER_CREATE_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`flags` 缓存创建的额外标志位参数。
* :bdg-secondary:`size` 要创建的缓存大小。单位为字节。
* :bdg-secondary:`usage` 用于指定该缓存的用途。
* :bdg-secondary:`sharingMode` 当该缓存会被多个设备队列访问时，该参数用于配置该缓存的共享模式。
* :bdg-secondary:`queueFamilyIndexCount` 指定 ``pQueueFamilyIndices`` 数组中元素数量。
* :bdg-secondary:`pQueueFamilyIndices` 用于指定将会访问该缓存的设备队列（族）。如果共享模式 :bdg-danger:`不是` ``VkSharingMode::VK_SHARING_MODE_CONCURRENT`` （并行访问）将会忽略该数组。

.. admonition:: VkBufferCreateFlags
   :class: note

   ``VkBufferCreateFlags`` 的有效值被定义在了 ``VkBufferCreateFlagBits`` 枚举中。 ``Vulkan 1.0`` 标准中在 ``VkBufferCreateFlagBits`` 枚举中定义了 ``稀疏资源`` 的标志位。由于目前还不会涉及到 ``稀疏资源`` 所以暂时先忽略。

其中 ``VkBufferCreateInfo::usage`` 用于配置该缓存的用途。在开发时一个缓存 :bdg-danger:`一定` 是由于某些特定功能需求而存在的，底层设备可以在不同的需求的前提下使用更加高效的内部算法和结构，以此能够得到更加高效的执行。比如一个缓存中存储的结构如下：

.. _vertex_buffer_pseudocode_demo:

.. code:: c++

   struct Position
   {
      float x;
      float y;
      float z;
   };

   struct UV
   {
      float u;
      float v;
   };

   struct Vertex
   {
      Position position;
      UV uv;
   }

   std::vector<Vertex> vertices;
   vertices.push_back(...);
   vertices.push_back(...);

   VkBuffer buffer = 创建存储 Vertex 结构的数组缓存(vertices);
   vk设置该缓存的内部结构(Vertex);

由于 ``GPU`` 上的设备队列都是并行执行的（设备上有很多并行单元），当设备知道该缓存中存储的各个元素结构都相同时，可以并行的一块块的读取各个元素，而不需要像 ``CPU`` 那样从头按字节读取。这极大的提高了执行效率。

由于设备队列的并行性，其对于缓存的读写也是并行的，所以需要协调好各个队列对该缓存的读写，否则就会导致缓存数据混乱。如果某资源是某设备队列独享的，这将会省去不必要的跨设备队列间的同步，提高效率。为此其中的 ``VkBufferCreateInfo::sharingMode`` 、 ``VkBufferCreateInfo::queueFamilyIndexCount`` 和 ``VkBufferCreateInfo::pQueueFamilyIndices`` 就是用于配置各个设备队列对该资源的访问权限，进一步明确设备对该资源的访问方式以提高效率。

其中 ``VkBufferCreateInfo::usage`` 的有效值被定义在了 ``VkBufferUsageFlagBits`` 枚举中，其定义如下：

VkBufferUsageFlagBits
^^^^^^^^^^^^^^^^^^^^^^^^

.. code:: c++

   // 由 VK_VERSION_1_0 提供
   typedef enum VkBufferUsageFlagBits {
       VK_BUFFER_USAGE_TRANSFER_SRC_BIT = 0x00000001,
       VK_BUFFER_USAGE_TRANSFER_DST_BIT = 0x00000002,
       VK_BUFFER_USAGE_UNIFORM_TEXEL_BUFFER_BIT = 0x00000004,
       VK_BUFFER_USAGE_STORAGE_TEXEL_BUFFER_BIT = 0x00000008,
       VK_BUFFER_USAGE_UNIFORM_BUFFER_BIT = 0x00000010,
       VK_BUFFER_USAGE_STORAGE_BUFFER_BIT = 0x00000020,
       VK_BUFFER_USAGE_INDEX_BUFFER_BIT = 0x00000040,
       VK_BUFFER_USAGE_VERTEX_BUFFER_BIT = 0x00000080,
       VK_BUFFER_USAGE_INDIRECT_BUFFER_BIT = 0x00000100
   } VkBufferUsageFlagBits;

* :bdg-secondary:`VK_BUFFER_USAGE_TRANSFER_SRC_BIT` 该缓存用于数据传输的数据源。
* :bdg-secondary:`VK_BUFFER_USAGE_TRANSFER_DST_BIT` 该缓存用于数据传输的目的数据。
* :bdg-secondary:`VK_BUFFER_USAGE_UNIFORM_TEXEL_BUFFER_BIT` 该缓存用于存储纹素数据。用于设备读取。
* :bdg-secondary:`VK_BUFFER_USAGE_STORAGE_TEXEL_BUFFER_BIT` 该缓存用于存储纹素数据。用于设备读取和存储。
* :bdg-secondary:`VK_BUFFER_USAGE_UNIFORM_BUFFER_BIT` 该缓存用于存储任意格式数据。用于设备读取。
* :bdg-secondary:`VK_BUFFER_USAGE_STORAGE_BUFFER_BIT` 该缓存用于存储任意格式数据。用于设备读取和存储。
* :bdg-secondary:`VK_BUFFER_USAGE_INDEX_BUFFER_BIT` 该缓存用于存储整型索引数据。
* :bdg-secondary:`VK_BUFFER_USAGE_VERTEX_BUFFER_BIT` 该缓存用于存储具有相同结构的顶点数据。
* :bdg-secondary:`VK_BUFFER_USAGE_INDIRECT_BUFFER_BIT` 该缓存用于间接数据。用于存储指令参数，设备可一次性读取这些参数。

.. note::

   `如上示例 <vertex_buffer_pseudocode_demo_>`_ 中就是 ``VkBufferUsageFlagBits::VK_BUFFER_USAGE_VERTEX_BUFFER_BIT`` 用途的典型用例。

   

VK_KHR_buffer_device_address
==============================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/6/20 创建该文档
    * 2023/6/20 增加 ``访问物理存储缓存`` 章节
    * 2023/6/20 增加 ``vkGetBufferDeviceAddress`` 章节
    * 2023/6/20 增加 ``vkGetBufferDeviceAddressKHR`` 章节
    * 2023/6/21 更新 ``vkGetBufferDeviceAddressKHR`` 章节
    * 2023/6/21 增加 ``VkBufferDeviceAddressInfo`` 章节
    * 2023/6/21 增加 ``VkBufferDeviceAddressInfoKHR`` 章节
    * 2023/6/21 增加 ``vkGetBufferOpaqueCaptureAddress`` 章节
    * 2023/6/21 增加 ``vkGetBufferOpaqueCaptureAddressKHR`` 章节
    * 2023/6/21 增加 ``查询不透明捕获地址`` 章节
    * 2023/6/21 增加 ``vkGetDeviceMemoryOpaqueCaptureAddress`` 章节
    * 2023/6/21 增加 ``vkGetDeviceMemoryOpaqueCaptureAddressKHR`` 章节
    * 2023/6/21 增加 ``VkDeviceMemoryOpaqueCaptureAddressInfo`` 章节
    * 2023/6/21 增加 ``VkDeviceMemoryOpaqueCaptureAddressInfoKHR`` 章节
    * 2023/6/21 增加 ``依赖`` 章节
    * 2023/6/21 增加 ``新增函数`` 章节
    * 2023/6/21 增加 ``新增特性`` 章节
    * 2023/7/4 更新 ``VkBufferDeviceAddressInfoKHR`` 章节。增加 ``VK_MEMORY_ALLOCATE_DEVICE_ADDRESS_BIT`` 说明

该扩展属于 :bdg-info:`device扩展` :bdg-warning:`在Vulkan 1.2中被纳入核心`

依赖
#########################

* Vulkan 1.1

或

* `VK_KHR_get_physical_device_properties2 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_get_physical_device_properties2>`_ :bdg-info:`instance扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`
* `VK_KHR_device_group <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap47.html#VK_KHR_device_group>`_ :bdg-info:`device扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心` :bdg-primary:`依赖如下`
        * `VK_KHR_device_group_creation <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap47.html#VK_KHR_device_group_creation>`_ :bdg-info:`instance扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`

新增函数
#########################

* `vkGetBufferDeviceAddressKHR <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap14.html#vkGetBufferDeviceAddressKHR>`_
* `vkGetBufferOpaqueCaptureAddressKHR <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap14.html#vkGetBufferOpaqueCaptureAddressKHR>`_
* `vkGetDeviceMemoryOpaqueCaptureAddressKHR <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap11.html#vkGetDeviceMemoryOpaqueCaptureAddressKHR>`_

新增特性
##########################

* `VkPhysicalDeviceBufferDeviceAddressFeaturesKHR <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap38.html#VkPhysicalDeviceBufferDeviceAddressFeaturesKHR>`_

.. admonition:: 提升至 Vulkan 1.2 核心
    :class: note

    该扩展的所有函数都将作为 ``Vulkan 1.2`` 的核心，并省略 ``KHR`` 后缀。如果设备支持 ``Vulkan 1.2`` 但不支持该扩展的话 ``bufferDeviceAddress`` 特性将成为可选项。之前的类型、枚举和指令名称都还是有效的并作为核心函数的别名存在。

.. admonition:: 提升至 Vulkan 1.3 核心
    :class: note

    不管设备是否支持该扩展， ``Vulkan 1.3`` 中将会强制支持 ``bufferDeviceAddress`` 特性。

访问物理存储缓存
##################

查询获取着色器可访问的 ``64`` 比特的设备缓存地址，调用：

vkGetBufferDeviceAddress
*****************************

.. code:: c++

    // 由 VK_VERSION_1_2 提供
    VkDeviceAddress vkGetBufferDeviceAddress(
        VkDevice                                    device,
        const VkBufferDeviceAddressInfo*            pInfo);

或是与之等价的

vkGetBufferDeviceAddressKHR
*****************************

.. code:: c++

    // 由 VK_KHR_buffer_device_address 提供
    VkDeviceAddress vkGetBufferDeviceAddressKHR(
        VkDevice                                    device,
        const VkBufferDeviceAddressInfo*            pInfo);

* :bdg-secondary:`device` 表示创建缓存的逻辑设备。
* :bdg-secondary:`pInfo` 表示获取的缓存地址信息。

返回的 ``64`` 比特值表示 ``pInfo->buffer`` 的起始地址。可以表示的范围为从返回值表示的位置开始到整个缓存的大小范围，其都可以使用 ``SPV_KHR_physical_storage_buffer`` 扩展和 ``PhysicalStorageBuffer`` 类用于将缓存绑定到着色器中进行访问。比如该返回值可以存到一个 ``uniform`` 缓存中，之后着色器就可以通过 ``uniform`` 缓存获取到该值并进行对应的读写。如果返回为 ``0`` 的话说明为 ``null`` 指针并且对于有效设备缓存地址一定不会返回为 ``0`` 。
着色器对通过 ``PhysicalStorageBuffer`` 指针进行的所有加载、存储和原子操作都需要在同一个缓存范围内。

如果使用 ``VkBufferOpaqueCaptureAddressCreateInfo::opaqueCaptureAddress`` 非零值创建的缓存的话，其返回值和捕获时的捕获值相同。

对于 ``VkBufferDeviceAddressInfo::buffer`` 的缓存，返回地址必须满足 ``VkMemoryRequirements::alignment`` 对齐。

如果多个 ``VkBuffer`` 重叠绑定到了同一个 ``VkDeviceMemory`` 上的话，驱动可能也会返回重叠的地址范围。这将会导致 ``VkBuffer`` 和地址的映射变的模棱两可。为了有效利用的目的，如果多个 ``VkBuffer`` 对象都可以关联到一个设备地址上，为了有效性只使用其中一个  ``VkBuffer`` 。

.. admonition:: 正确用法
   :class: note

   * 必须开启 ``bufferDeviceAddress`` 特性。
   * 如果 ``device`` 使用的多物理设备创建的话，必须开启 ``bufferDeviceAddressMultiDevice`` 特性。

VkBufferDeviceAddressInfo
*****************************

.. code:: c++

    // 由 VK_VERSION_1_2 提供
    typedef struct VkBufferDeviceAddressInfo {
        VkStructureType    sType;
        const void*        pNext;
        VkBuffer           buffer;
    } VkBufferDeviceAddressInfo;

或是与之等价的

VkBufferDeviceAddressInfoKHR
*****************************

.. code:: c++

    // 由 VK_KHR_buffer_device_address 提供
    typedef VkBufferDeviceAddressInfo VkBufferDeviceAddressInfoKHR;

* :bdg-secondary:`sType` 表示结构体类型。必须是 ``VK_STRUCTURE_TYPE_BUFFER_DEVICE_ADDRESS_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`buffer` 要获取地址的对应缓存。

.. admonition:: 正确用法
   :class: note

   * 如果缓存是非稀疏并且没有使用 ``VK_BUFFER_CREATE_DEVICE_ADDRESS_CAPTURE_REPLAY_BIT`` 标志位创建的话，则其必须绑定到一个完整且连续的 ``VkDeviceMemory`` 对象上。
   * ``buffer`` 必须使用 ``VK_BUFFER_USAGE_SHADER_DEVICE_ADDRESS_BIT`` 创建。

.. admonition:: VK_MEMORY_ALLOCATE_DEVICE_ADDRESS_BIT
    :class: important

    ``buffer`` 对应绑定的内存必须使用 ``VK_MEMORY_ALLOCATE_DEVICE_ADDRESS_BIT`` 分配。（该点 `14.3. Physical Storage Buffer Access <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap14.html#descriptorsets-physical-storage-buffer>`_ 章节中并没有说明，而是在内存章节）

vkGetBufferOpaqueCaptureAddress
*************************************

获取 ``64`` 位不透明缓存捕获地址，调用：

.. code:: c++

    // 由 VK_VERSION_1_2 提供
    uint64_t vkGetBufferOpaqueCaptureAddress(
        VkDevice                                    device,
        const VkBufferDeviceAddressInfo*            pInfo);

或是与之等价的

vkGetBufferOpaqueCaptureAddressKHR
*************************************

.. code:: c++

    // 由 VK_KHR_buffer_device_address 提供
    uint64_t vkGetBufferOpaqueCaptureAddressKHR(
        VkDevice                                    device,
        const VkBufferDeviceAddressInfo*            pInfo);

* :bdg-secondary:`device` 表示创建缓存的逻辑设备。
* :bdg-secondary:`pInfo` 表示获取的缓存地址信息。

返回的 ``64`` 比特值表示 ``pInfo->buffer`` 的不透明捕获地址。

如果缓存使用非 ``0`` 的 ``VkBufferOpaqueCaptureAddressCreateInfo::opaqueCaptureAddress`` 创建的话，则返回值都是相同的地址。

.. admonition:: 正确用法
   :class: note

   * 必须开启 ``bufferDeviceAddress`` 特性。
   * 如果 ``device`` 使用的多物理设备创建的话，必须开启 ``bufferDeviceAddressMultiDevice`` 特性。

查询不透明捕获地址
####################

vkGetDeviceMemoryOpaqueCaptureAddress
***************************************

从内存对象中查询 ``64`` 为不透明捕获地址，调用：

.. code:: c++

    // 由 VK_VERSION_1_2 提供
    uint64_t vkGetDeviceMemoryOpaqueCaptureAddress(
        VkDevice                                    device,
        const VkDeviceMemoryOpaqueCaptureAddressInfo* pInfo);

或是与之等价的

vkGetDeviceMemoryOpaqueCaptureAddressKHR
********************************************

.. code:: c++

    // 由 VK_KHR_buffer_device_address 提供
    uint64_t vkGetDeviceMemoryOpaqueCaptureAddressKHR(
        VkDevice                                    device,
        const VkDeviceMemoryOpaqueCaptureAddressInfo* pInfo);

* :bdg-secondary:`device` 表示创建缓存的逻辑设备。
* :bdg-secondary:`pInfo` 表示获取的地址的内存对象信息。

返回的 ``64`` 比特值表示 ``pInfo->memory`` 的不透明捕获地址。

如果缓存使用非 ``0`` 的 ``VkBufferOpaqueCaptureAddressCreateInfo::opaqueCaptureAddress`` 创建的话，则返回值都是相同的地址。

.. note:: 不透明地址仅仅在追踪中捕获和回放工具中存储地址，在随后的重播期间指定它们。

.. admonition:: 正确用法
   :class: note

   * 必须开启 ``bufferDeviceAddress`` 特性。
   * 如果 ``device`` 使用的多物理设备创建的话，必须开启 ``bufferDeviceAddressMultiDevice`` 特性。

VkDeviceMemoryOpaqueCaptureAddressInfo
********************************************

``VkDeviceMemoryOpaqueCaptureAddressInfo`` 结构体定义如下：

.. code:: c++

    // 由 VK_VERSION_1_2 提供
    typedef struct VkDeviceMemoryOpaqueCaptureAddressInfo {
        VkStructureType    sType;
        const void*        pNext;
        VkDeviceMemory     memory;
    } VkDeviceMemoryOpaqueCaptureAddressInfo;

或是与之等价的

VkDeviceMemoryOpaqueCaptureAddressInfoKHR
********************************************

.. code:: c++

    // 由 VK_KHR_buffer_device_address 提供
    typedef VkDeviceMemoryOpaqueCaptureAddressInfo VkDeviceMemoryOpaqueCaptureAddressInfoKHR;

* :bdg-secondary:`sType` 表示结构体类型。必须是 ``VK_STRUCTURE_TYPE_DEVICE_MEMORY_OPAQUE_CAPTURE_ADDRESS_INFO`` 。
* :bdg-secondary:`pNext` 要么是 ``NULL`` 要么指向其他结构体来扩展该结构体。
* :bdg-secondary:`memory` 要获取地址的对应内存对象。

.. admonition:: 正确用法
   :class: note

   * ``memory`` 必须使用 ``VK_MEMORY_ALLOCATE_DEVICE_ADDRESS_BIT`` 标志位域分配。

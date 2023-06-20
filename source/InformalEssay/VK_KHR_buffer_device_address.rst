VK_KHR_buffer_device_address
==============================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/6/20 创建该文档
    * 2023/6/20 增加 ``访问物理存储缓存`` 章节
    * 2023/6/20 增加 ``vkGetBufferDeviceAddress`` 章节
    * 2023/6/20 增加 ``vkGetBufferDeviceAddressKHR`` 章节

该扩展属于 :bdg-info:`device扩展` :bdg-warning:`在Vulkan 1.2中被纳入核心`

:bdg-primary:`依赖如下`

* Vulkan 1.1

或

* `VK_KHR_get_physical_device_properties2 <https://registry.khronos.org/vulkan/specs/1.3-extensions/html/chap54.html#VK_KHR_get_physical_device_properties2>`_ :bdg-info:`instance扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`
* `VK_KHR_device_group <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap47.html#VK_KHR_device_group>`_ :bdg-info:`device扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心` :bdg-primary:`依赖如下`
        * `VK_KHR_device_group_creation <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap47.html#VK_KHR_device_group_creation>`_ :bdg-info:`instance扩展` :bdg-warning:`在Vulkan 1.1中被纳入核心`

新增加函数如下：

* `vkGetBufferDeviceAddressKHR <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap14.html#vkGetBufferDeviceAddressKHR>`_
* `vkGetBufferOpaqueCaptureAddressKHR <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap14.html#vkGetBufferOpaqueCaptureAddressKHR>`_
* `vkGetDeviceMemoryOpaqueCaptureAddressKHR <https://registry.khronos.org/vulkan/specs/1.3-khr-extensions/html/chap11.html#vkGetDeviceMemoryOpaqueCaptureAddressKHR>`_

新增特性如下：

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
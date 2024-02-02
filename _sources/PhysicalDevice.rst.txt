物理设备
==============

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2024/1/2 增加该文档。
   * 2024/2/2 更新该文档。
   * 2024/2/2 增加 ``vkEnumeratePhysicalDevices`` 章节。

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
   ``VkPhysicalDevice`` 句柄的声明周期与 ``VkInstance`` 相同， ``VkInstance`` 创建 ``VkPhysicalDevice`` 句柄们也会创建， ``VkInstance`` 销毁 ``VkPhysicalDevice`` 句柄们也会销毁。

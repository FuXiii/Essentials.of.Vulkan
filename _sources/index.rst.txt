欢迎来到 Vulkan 入门精要
================================================

.. admonition:: 更新记录
   :class: note

   * 2023/5/11 增加 ``文献翻译`` 目录
   * 2023/5/14 增加 ``序言`` 目录
   * 2023/5/14 增加 ``介绍`` 目录

.. image:: https://img.shields.io/badge/QQ%20Group-128656761-deepgreen?logo=tencentqq
   :target: https://jq.qq.com/?_wv=1027&k=rZGd2LHr
   
.. image:: https://img.shields.io/badge/Email-g1018505124@outlook.com-deepgreen


序言
####################

.. sidebar:: 赞助 |biohazard|
   :subtitle: 请量力而为，如果赞助完真有困难可以退回。

   .. image:: _static/aifadian.jpg

   .. attention:: 未成年人禁止投喂

.. |biohazard| image:: https://afdian.moeci.com/1/badge.svg
   :target: https://afdian.net/@TurboEngine

摇想童年看到游戏中那些酷炫的画面难以自拔，为了制作游戏，多年后填报了软件工程专业，但学了才知道该专业只是教一些通用的计算机知识，并不会教你如何制作游戏。遥想那是大二的夏天，网络搜索游戏制作，
映入眼帘的就是 `Unity <https://unity.com/>`_ ，有个人免费版，也就下载下来玩玩，继续搜索 ``Unity`` 是如何绘制酷炫的画面的，映入眼帘的就是 ``Shader`` 这个单词，继续搜索找到了冯乐乐的 ``《Unity Shader入门精要》``，
是的，这本书就是我的第一本图形学入门启蒙书籍，且该项目的命名灵感也来源于此本书籍，不得不说，写的是真好，拜读了不知道多少遍，头一次知道 ``计算机图形学`` 这个词，之后就在计算机图形学的道路上一发不可收拾，
而创建自己的渲染引擎也成为了我的目标之一。

后来学习了 ``OpenGL`` 绘制了一个三角形，但是 ``OpenGL`` 的状态机机制让我很不适应，而且很多任务都由驱动实现，让你知其然，而不知其所以然，使用 ``OpenGL`` 总让我有种面前有层面纱的感觉，总是看不清面纱背后的真相。直到 ``2018`` 年偶然听说
有一个新的图形 ``API`` 名叫 ``Vulkan`` ，网络搜之，原来是 ``OpenGL`` 标准组 ``Khronos`` 发布的新标准，从网上找到一本 ``Vulkan Programming Guide The Official Guide to Learning Vulkan`` 介绍 ``Vulkan`` 的书籍，如获至宝的拜读了好几遍，
当时英文不好，楞是硬着头皮读了好几遍，后来才意识到英文读多了也就习惯了，这里也鼓励英文不好的小伙伴努力阅读英文文献，相信自己的潜力是无穷的。通读之后， ``OpenGL`` 的那层面纱总算是揭开，看的是清清楚楚，之后参考了 ``Khronos`` 发布的
`VulkanSamples <https://github.com/LunarG/VulkanSamples>`_ 实例代码绘制了出了绿粉蓝的长方形盒子，开心了好几天。

.. figure:: ./_static/drawcube.png

    VulkanSamples绘制的长方形盒子

直到后来尝试自己实现渲染引擎，这也是 `Turbo <https://github.com/FuXiii/Turbo>`_ 开源渲染引擎的由来。在实现此引擎过程中也认识了很多志同道合的小伙伴，也有很多新入门的小伙伴，很多小伙伴都苦于 ``Vulkan`` 的学习资料太少学起来太难，想让我
出一套详细的入门教程，为了帮助小伙伴轻松学习 ``Vulkan`` ，也为了祖国的图形学事业的发展进步做出微薄的贡献，遂发布了该项目。

在这里感谢我的父母家人，朋友，老师和小伙伴们的鼎力支持，谢谢。

致良知，知行合一。让我们步入 ``Vulkan`` 的学习吧~ (๑•̀ㅂ•́)و✧

.. important:: 文章来源于本人学习总结，会出现讲解错误，请各位及时提出指正，谢谢。

.. toctree::
   :caption: 入门精要
   :maxdepth: 2

   Introduction.rst

.. toctree::
   :caption: 文献翻译
   :maxdepth: 2

   literature/index.rst
   test.rst

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
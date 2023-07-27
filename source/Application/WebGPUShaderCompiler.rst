WebGPU Shader Compiler
============================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2023/7/25 增加该文档
   * 2023/7/25 增加 ``源码说明`` 文档
   * 2023/7/25 增加 ``发布 0.1`` 文档
   * 2023/7/26 增加 ``发布 0.2`` 文档
   * 2023/7/26 将跳转链接更改成卡片样式
   * 2023/7/27 增加 ``发布 0.3`` 文档

.. card:: 在线着色器编译器
   :link: ../_static/WebGPU/ShaderCompiler/WasmShaderCompiler.html
   :shadow: md
   :text-align: center

   您可以点击该卡片跳转至 `Shader Compiler <../_static/WebGPU/ShaderCompiler/WasmShaderCompiler.html>`_

.. admonition:: 源码说明
   :class: important

   该项目的源码位于 `Turbo <https://github.com/FuXiii/Turbo>`_ 的 `PureCCppWebShaderCompiler <https://github.com/FuXiii/Turbo/tree/dev/samples/PureCCppWebShaderCompiler>`_ 中。

   该项目是一个工具项目，并没有打算做的多精美，所以这个工具代码写的就像 ``依托答辩`` ，请谨慎阅览。

.. dropdown:: 发布 0.3
   :color: primary
   :icon: checklist
   :open:

   .. article-info::
    :avatar-outline: muted
    :author: WebShader Compiler
    :date: July 27, 2023 发布
    :class-container: sd-p-2 sd-outline-muted sd-rounded-1

   .. admonition:: 重要功能
      :class: important

      * 提供着色器代码到 ``SPIR-V`` 二进制的反编译代码（可阅读格式）的功能。

   .. admonition:: 更新记录
      :class: note

      * 优化输出的 ``SPIR-V`` 十六进制数组格式。
      * 修正当更改 ``Target Language`` 所对应的 ``SPIR-V`` 版本后编译器错误识别的 ``Bug`` 。
      * 增加对于 :kbd:`Ctrl+C` 快捷键的支持。现可以通过该快捷键直接复制编辑器中的代码。
      * 增加 ``Code Viewer`` 窗口。用于展示和获取编译结果。
      * 修改 ``Shader Code Editor`` 窗口的 :menuselection:`Convert` 菜单。
      * :menuselection:`Convert` 菜单，增加 :menuselection:`SPIR-V` 子菜单。
      * :menuselection:`SPIR-V` 子菜单，增加 :menuselection:`To SPIR-V Disassemble` 按钮。

   .. admonition:: 使用教程
      :class: seealso

      1. 首先将要编译的着色器代码选中后 :kbd:`Ctrl+V` 粘贴至剪贴板。
      2. 进入 `在线着色器编译器 <../_static/WebGPU/ShaderCompiler/WasmShaderCompiler.html>`_ 页面。如果是第一次进入会弹出 ``允许访问剪贴板`` 的弹窗，点击 ``允许`` 。

         .. admonition:: 允许访问剪贴板
            :class: note

            需要通过访问剪贴板将着色器代码粘贴至编译器。

         .. figure:: ../_static/WebGPU/ShaderCompiler/allow_browser_clipboard.png

      3. 直接 :kbd:`Ctrl+V` 或依次点击 :menuselection:`Edit --> Paste` 将代码粘贴至编译器页面中

         .. figure:: ../_static/WebGPU/ShaderCompiler/paste_shader_code.png

      4. 配置着色器语言 ``Language`` 选项（ ``GLSL`` 或 ``HLSL`` ），配置 ``Shader Type`` 选项（ ``顶点着色器`` 还是 ``片元着色器`` 等）

         .. figure:: ../_static/WebGPU/ShaderCompiler/language_and_shader_type.png
      5. 依次点击 :menuselection:`Convert --> SPIR-V` 进行输出配置。包括 ``Target Client`` 目标端和 ``Target Language`` 目标语言标准（如果没有特定需求保持默认即可）。

         .. figure:: ../_static/WebGPU/ShaderCompiler/ver03_convert_spirv.png
      6. 如上配置完成后依次点击 :menuselection:`Convert--> SPIR-V --> To SPIR-V` 将代码编译成 ``SPIR-V`` 二进制代码。或依次点击 :menuselection:`Convert--> SPIR-V --> To SPIR-V Disassemble` 将 ``SPIR-V`` 二进制代码反编译成可阅读的 ``SPIR-V`` 代码。

         .. figure:: ../_static/WebGPU/ShaderCompiler/ver03_convert_shader_to_spirv.png

      7. 如果编译失败，说明代码有错误，相关错误会在 ``Console`` 中进行显示。

         .. figure:: ../_static/WebGPU/ShaderCompiler/compile_error.png

      8. 如果编译成功，相关的 ``SPIR-V`` 将会写入剪贴板中，并在 ``Console`` 中给出 ``成功`` 提示。并弹出 ``Code Viewer`` 窗口用于显示编译结果。用户直接 :kbd:`Ctrl+V` 将编译的结果粘贴即可。

         * :bdg-secondary:`SPIR-V Binary` 输出结果为 ``C/C++`` 格式的 ``SPIR-V`` 的十六进制数组，可以直接用于 ``Vulkan`` 等 ``API`` 。
         * :bdg-secondary:`SPIR-V Disassemble` 输出结果为 ``SPIR-V`` 二进制的反编译结果，为 ``SPIR-V`` 的可阅读格式。

         .. figure:: ../_static/WebGPU/ShaderCompiler/ver03_to_spirv_binary_success.png

            成功编译成 ``SPIR-V Binary`` 格式

         .. figure:: ../_static/WebGPU/ShaderCompiler/ver03_to_spirv_disassemble_success.png

            成功编译成 ``SPIR-V Disassemble`` 格式

   .. admonition:: 开发计划
      :class: tip

      1. 提供 ``HLSL`` ， ``GLSL`` 和 ``SPIR-V`` 的相互转换功能
      2. 提供 ``SPIR-V`` 输出为文件的功能
      3. 提供 ``WGSL`` 着色器支持
      4. 提供对于 ``#include`` 着色器头文件的支持
      5. 控制台输出考虑是否输出时间信息

.. dropdown:: 发布 0.2
   :color: primary
   :icon: checklist

   .. article-info::
    :avatar-outline: muted
    :author: WebShader Compiler
    :date: July 26, 2023 发布
    :class-container: sd-p-2 sd-outline-muted sd-rounded-1

   .. admonition:: 更新记录
      :class: note

      * 增大可视大小，之前的太小了。
      * 增加对于 :kbd:`Ctrl+V` 快捷键的支持。现可以通过该快捷键将 ``Shader`` 代码直接粘贴进代码编辑器中。

.. dropdown:: 发布 0.1
   :color: primary
   :icon: checklist

   .. article-info::
    :avatar-outline: muted
    :author: WebShader Compiler
    :date: July 25, 2023 发布
    :class-container: sd-p-2 sd-outline-muted sd-rounded-1

   .. admonition:: 使用教程
      :class: seealso

      1. 首先将着色器代码选中后 :kbd:`Ctrl+V` 粘贴至剪贴板。
      2. 进入 `在线着色器编译器 <../_static/WebGPU/ShaderCompiler/WasmShaderCompiler.html>`_ 页面。如果是第一次进入会弹出 ``允许访问剪贴板`` 的弹窗，点击 ``允许`` 。

         .. figure:: ../_static/WebGPU/ShaderCompiler/allow_browser_clipboard.png

      3. 依次点击 :menuselection:`Edit --> Paste` 将代码粘贴至编译器页面中

         .. figure:: ../_static/WebGPU/ShaderCompiler/paste_shader_code.png

         .. admonition:: 存在的问题
            :class: warning

            * 必须进行 :menuselection:`Edit --> Paste` 操作才能将代码粘贴至编译器中，直接在编译器中 :kbd:`Ctrl+V` 没有反应。
            * 考虑如何设置引用着色器的 ``include`` 头文件。

      4. 配置着色器语言 ``Language`` 选项（ ``GLSL`` 或 ``HLSL`` ），配置 ``Shader Type`` 选项（ ``顶点着色器`` 还是 ``片元着色器`` 等）

         .. figure:: ../_static/WebGPU/ShaderCompiler/language_and_shader_type.png
      5. 依次点击 :menuselection:`Convert` 进行输出配置。包括 ``Target Client`` 目标端和 ``Target Language`` 目标语言标准（如果没有特定需求保持默认即可）。

         .. figure:: ../_static/WebGPU/ShaderCompiler/target_clent_and_target_language.png
      6. 如上配置完成后依次点击 :menuselection:`Convert --> To SPIR-V` 将代码编译成 ``SPIR-V``

         .. figure:: ../_static/WebGPU/ShaderCompiler/to_spirv.png

      7. 如果编译失败，说明代码有错误，相关错误会在 ``Console`` 中进行显示。

         .. figure:: ../_static/WebGPU/ShaderCompiler/compile_error.png
      8. 如果编译成功，相关的 ``SPIR-V`` 将会写入剪贴板中，并在 ``Console`` 中给出 ``成功`` 提示。用户直接 :kbd:`Ctrl+C` 将编译的 ``SPIR-V`` 代码进行粘贴即可（输出结果为 ``C/C++`` 格式的 ``SPIR-V`` 的十六进制数组，可以直接用于 ``Vulkan`` 等 ``API`` ）

         .. figure:: ../_static/WebGPU/ShaderCompiler/compile_success.png

   .. admonition:: 开发计划
      :class: tip

      1. 提供 ``HLSL`` ， ``GLSL`` 和 ``SPIR-V`` 的相互转换功能
      2. 提供 ``SPIR-V`` 输出为文件的功能
      3. 提供 ``SPIR-V`` 输出为可阅读的文本格式
      4. 提供 ``WGSL`` 着色器支持
      5. 提供对于头文件的支持
WebGPU Shader Compiler
============================

.. dropdown:: 更新记录
   :color: muted
   :icon: history

   * 2023/7/25 增加该文档
   * 2023/7/25 增加 ``源码说明`` 文档
   * 2023/7/25 增加 ``发布 0.1`` 文档
   * 2023/7/26 增加 ``发布 0.2`` 文档

`WebGPU Shader Compiler <../_static/WebGPU/ShaderCompiler/WasmShaderCompiler.html>`_ ``在线着色器编译器`` 可在线浏览。

.. admonition:: 源码说明
   :class: important

   该项目的源码位于 `Turbo <https://github.com/FuXiii/Turbo>`_ 的 `PureCCppWebShaderCompiler <https://github.com/FuXiii/Turbo/tree/dev/samples/PureCCppWebShaderCompiler>`_ 中。

   该项目是一个工具项目，并没有打算做的多精美，所以这个工具代码写的就像 ``依托答辩`` ，请谨慎阅览。

.. dropdown:: 发布 0.2
   :color: primary
   :icon: checklist
   :open:

   .. article-info::
    :avatar-outline: muted
    :author: WebShader Compiler
    :date: July 26, 2023 发布
    :class-container: sd-p-2 sd-outline-muted sd-rounded-1

   * 增大可视大小，之前的太小了。

.. dropdown:: 发布 0.1
   :color: primary
   :icon: checklist
   :open:

   .. article-info::
    :avatar-outline: muted
    :author: WebShader Compiler
    :date: July 25, 2023 发布
    :class-container: sd-p-2 sd-outline-muted sd-rounded-1

   .. admonition:: 使用教程
      :class: seealso

      1. 首先将着色器代码选中后 :kbd:`Ctrl+V` 粘贴至剪贴板。
      2. 进入 `PureCCppWebShaderCompiler <../_static/WebGPU/ShaderCompiler/WasmShaderCompiler.html>`_ 页面。如果是第一次进入会弹出 ``允许访问剪贴板`` 的弹窗，点击 ``允许`` 。

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
Android 平台适配
==================

.. dropdown:: 更新记录
    :color: muted
    :icon: history

    * 2023/9/23 创建该文档
    * 2023/9/23 增加 ``AGDK`` 章节
    * 2023/9/23 增加 ``game-activity 使用`` 章节
    * 2023/9/23 增加 ``实现 android_main`` 章节
    * 2023/9/23 增加 ``游戏循环`` 章节
    * 2023/9/23 增加 ``事件处理`` 章节
    * 2023/9/23 增加 ``导出动态库`` 章节
    * 2023/9/23 增加 ``CMake 指令`` 章节
    * 2023/9/23 增加 ``GameActivity 引入库`` 章节

.. _GameActivity: https://developer.android.com/games/agdk/game-activity/get-started?hl=zh-cn
.. _AGDK: https://developer.android.com/games/agdk/download?hl=zh-cn#agdk-libraries
.. _Jetpack: https://developer.android.com/jetpack/getting-started?hl=zh-cn
.. _NDK: https://developer.android.com/ndk/downloads?hl=zh-cn

``Android`` 官网推荐使用 `GameActivity`_ 进行适配

``GameActivity`` 是一个库，用于帮助开发者将 ``Android`` 的应用与已有的 ``C/C++`` 程序联系起来。该库可单独从 `AGDK`_ 下载下来。也可通过使用 `Jetpack`_ （该库包括 ``GameActivity`` 库）来使用 ``GameActivity`` （官方也推荐这种方式）。

而  ``Android`` 端 ``Vulkan`` 的 ``C/C++`` 头文件和库，还有其他一些 ``C/C++`` 相关的头文件和库都在 `NDK`_ 中。

从原理上来说， ``C/C++`` 接入 ``Android`` ，是通过实现 ``Android`` 对外开放的 ``C/C++`` 接口，并导出一个动态库，之后在 ``Android`` 的 ``Java`` 端加载该动态库即可。

也就是说，如果单就 ``C/C++`` 端，只需要使用 ``AGDK`` 中提供的接口并实现，与 ``NDK`` 一起导出一个动态库即可。

AGDK
###########

下载下来的 ``AGDK`` 的 ``zip`` 包中可以找到 ``GameActivity`` 的源码。

1. 解压缩下载的软件包
2. 在解压缩的软件包中，解压缩 ``GameActivity-release.aar`` 。
3. 在 ``prefab/modules/game-activity/include`` 下找到并复制所有 ``C/C++`` 源代码，其中包含以下内容
    * ``game-activity`` ，提供适配 ``GameActivity`` 的 ``C/C++`` 接口
    * ``game-text-input`` ，提供适配 ``GameTextInput`` 的 ``C/C++`` 接口

game-activity 使用
######################

在项目的 ``CMakeLists.txt`` 文件中导入 ``game-activity`` 软件包，其中 ``game-activity`` 需要 ``libandroid.so`` 。

.. code:: cmake

    find_package(game-activity REQUIRED CONFIG)
    
    target_link_libraries(... android game-activity::game-activity)

之后在 ``.cpp`` 中添加以下代码：

.. code:: c++

    #include <game-activity/GameActivity.cpp>
    #include <game-text-input/gametextinput.cpp>
    extern "C" {
      #include <game-activity/native_app_glue/android_native_app_glue.c>
    }

实现 android_main
######################

``android_native_app_glue`` 库是一个源代码库，游戏使用它在单独的线程中管理 ``GameActivity`` 生命周期事件，以防止主线程中出现阻塞。使用该库时，您可以注册回调以处理生命周期事件，例如触控输入事件。

.. note:: ``NDK`` 中也有个 ``android_native_app_glue`` 库，但是该库和 ``GameActivity`` 不同，这是两个独立的库，需要使用 ``GameActivity`` 的 ``android_native_app_glue`` 库。

将 ``android_native_app_glue`` 库源代码添加到项目中后，它会与 ``GameActivity`` 进行交互。实现一个名为 ``android_main`` 的函数，该函数由该库调用，并用作游戏的入口点（入口函数。类似 ``C/C++`` 的 ``main`` 函数）。
系统会向该函数传递一个名为 `android_app <https://developer.android.com/reference/games/game-activity/struct/android-app?hl=zh-cn>`_ 的结构体。

.. code:: c++

    #include <game-activity/native_app_glue/android_native_app_glue.h>

    extern "C" {
        void android_main(struct android_app* state);
    };

    void android_main(struct android_app* app) {
        NativeEngine *engine = new NativeEngine(app);
        engine->GameLoop();
        delete engine;
    }

游戏循环
######################

在游戏循环中处理 ``android_app`` ，比如在循环中处理 `NativeAppGlueAppCmd <https://developer.android.com/reference/games/game-activity/group/android-native-app-glue?hl=zh-cn#nativeappglueappcmd>`_ 中定义的应用周期事件。

比如。一下代码中将 ``您的事件处理回调函数`` 注册为 ``NativeAppGlueAppCmd`` 的处理回调，之后循环查询周期事件，并将其发送到之前注册的事件处理回调中（在 ``android_app::onAppCmd`` 中）。

.. code:: c++

    void NativeEngine::GameLoop() {
      mApp->userData = this;
      mApp->onAppCmd = 您的事件处理回调函数;  // 注册【您的事件处理回调函数】
      mApp->textInputState = 0;
    
      while (1) {
        int events;
        struct android_poll_source* source;
    
        // IsAnimating 用于指示是否继续执行
        // 如果 IsAnimating 返回 true 表示继续执行
        // 如果 IsAnimating 返回 false 将会阻塞
        while ((ALooper_pollAll(IsAnimating() ? 0 : -1, NULL, &events,
          (void **) &source)) >= 0) {
            if (source != NULL) {
                // 处理事件，native_app_glue 内部将会把事件发送至 mApp->onAppCmd 中注册的事件处理回调中
                source->process(source->app, source);
            }
            if (mApp->destroyRequested) {
                return;
            }
        }
        if (IsAnimating()) {
            DoFrame();
        }
      }
    }

事件处理
######################

如果想让 ``C/C++`` 应用获得 ``Android`` 端的输入事件的话，请使用 `android_app_set_motion_event_filter <https://developer.android.com/reference/games/game-activity/group/android-native-app-glue?hl=zh-cn#android_app_set_motion_event_filter>`_ 和 `android_app_set_key_event_filter <https://developer.android.com/reference/games/game-activity/group/android-native-app-glue?hl=zh-cn#android_app_set_key_event_filter>`_ 创建并注册事件过滤器。

默认情况下， ``native_app_glue`` 库仅允许来自 `SOURCE_TOUCHSCREEN <https://developer.android.com/reference/android/view/InputDevice?hl=zh-cn#SOURCE_TOUCHSCREEN>`_ 的输入动作事件。

如果需要处理输入事件，需要在循环中使用 `android_app_swap_input_buffers() <https://developer.android.com/reference/games/game-activity/group/android-native-app-glue?hl=zh-cn#android_app_swap_input_buffers>`_ 获取对 ``android_input_buffer`` 的引用。获取到的这些缓存中包含自上次循环以来发生的 `动作事件 <https://developer.android.com/reference/android/view/MotionEvent?hl=zh-cn>`_ 和 `按键事件 <https://developer.android.com/reference/android/view/KeyEvent?hl=zh-cn>`_ 。所包含的事件的数量分别存储在 ``motionEventsCount`` 和 ``keyEventsCount`` 中。

如下在循环中处理事件。在此示例中，会循环获取 ``motionEvents`` 并处理他们：

.. code:: c++

    android_input_buffer* inputBuffer = android_app_swap_input_buffers(app);
    if (inputBuffer && inputBuffer->motionEventsCount) {
        for (uint64_t i = 0; i < inputBuffer->motionEventsCount; ++i) {
            GameActivityMotionEvent* motionEvent = &inputBuffer->motionEvents[i];

            if (motionEvent->pointerCount > 0) {
                const int action = motionEvent->action;
                const int actionMasked = action & AMOTION_EVENT_ACTION_MASK;
                // 将 pointerIndex 初始化为最大值
                // 只有 pointerIndex 在有效范围内才进行处理
                uint32_t pointerIndex = GAMEACTIVITY_MAX_NUM_POINTERS_IN_MOTION_EVENT;
                struct CookedEvent ev;
                memset(&ev, 0, sizeof(ev));
                ev.motionIsOnScreen = motionEvent->source == AINPUT_SOURCE_TOUCHSCREEN;
                if (ev.motionIsOnScreen) {
                    // 使用屏幕大小作为交互区域
                    ev.motionMinX = 0.0f;
                    ev.motionMaxX = SceneManager::GetInstance()->GetScreenWidth();
                    ev.motionMinY = 0.0f;
                    ev.motionMaxY = SceneManager::GetInstance()->GetScreenHeight();
                }

                switch (actionMasked) {
                    case AMOTION_EVENT_ACTION_DOWN:
                        pointerIndex = 0;
                        ev.type = COOKED_EVENT_TYPE_POINTER_DOWN;
                        break;
                    case AMOTION_EVENT_ACTION_POINTER_DOWN:
                        pointerIndex = ((action & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK)
                                       >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT);
                        ev.type = COOKED_EVENT_TYPE_POINTER_DOWN;
                        break;
                    case AMOTION_EVENT_ACTION_UP:
                        pointerIndex = 0;
                        ev.type = COOKED_EVENT_TYPE_POINTER_UP;
                        break;
                    case AMOTION_EVENT_ACTION_POINTER_UP:
                        pointerIndex = ((action & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK)
                                       >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT);
                        ev.type = COOKED_EVENT_TYPE_POINTER_UP;
                        break;
                    case AMOTION_EVENT_ACTION_MOVE: {
                        // 移动事件是包括所有触点，所以在这里循环遍历处理这些触点
                        // 我们不设置 pointerIndex 的值，是因为在此次循环中处理事件，而不是在结尾处处理事件
                        ev.type = COOKED_EVENT_TYPE_POINTER_MOVE;
                        for (uint32_t i = 0; i < motionEvent->pointerCount; ++i) {
                            _cookEventForPointerIndex(motionEvent, callback, ev, i);
                        }
                        break;
                    }
                    default:
                        break;
                }

                // 只有 pointerIndex 为有效值时进行处理。注意【移动】事件在上面的【switch】中处理了。
                if (pointerIndex != GAMEACTIVITY_MAX_NUM_POINTERS_IN_MOTION_EVENT) {
                    _cookEventForPointerIndex(motionEvent, callback,
                                              ev, pointerIndex);
                }
            }
        }
        android_app_clear_motion_events(inputBuffer);
    }

导出动态库
######################

导出 ``Android`` 需要的动态库，主要是参考 ``NDK`` 的 `CMake <https://developer.android.com/ndk/guides/cmake?hl=zh-cn>`_ 章节。

需要使用 `NDK`_ 。

.. note:: 如果已经安装了 ``Android SDK`` 的话，其下一般都自带有 ``NDK`` 。

CMake 指令
*************

常用的 ``CMake`` 指令模板如下：

.. code::

    $ cmake \
    -DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake \
    -DANDROID_ABI=$ABI \
    -DANDROID_PLATFORM=android-$MINSDKVERSION \
    $OTHER_ARGS

* :bdg-secondary:`$NDK` 为 ``NDK`` 目录。
* :bdg-secondary:`$ABI` 为目标 ``ABI`` 平台。
* :bdg-secondary:`$MINSDKVERSION` 为 ``SDK`` 最小版本号。
* :bdg-secondary:`$OTHER_ARGS` 为其他指令参数。

其中 ``$ABI`` 为如下：

+-----------------------+----------------------------------------------------------+
| 值                    |备注                                                      |
+=======================+==========================================================+
| armeabi-v7a           |                                                          |
+-----------------------+----------------------------------------------------------+
| armeabi-v7a with NEON | 与 -DANDROID_ABI=armeabi-v7a -DANDROID_ARM_NEON=ON 相同。|
+-----------------------+----------------------------------------------------------+
| arm64-v8a             |                                                          |
+-----------------------+----------------------------------------------------------+
| x86                   |                                                          |
+-----------------------+----------------------------------------------------------+
| x86_64                |                                                          |
+-----------------------+----------------------------------------------------------+

其中 ``MINSDKVERSION`` 为 ``ANDROID_NATIVE_API_LEVEL`` ，为 `ANDROID_PLATFORM <https://developer.android.com/ndk/guides/cmake?hl=zh-cn#android_platform>`_ 别名。 ``ANDROID_PLATFORM`` 为指定应用或库所支持的最低 ``API`` 级别。此值对应于应用的 ``minSdkVersion`` 。当直接调用 ``CMake`` 时，此值默认为所使用的 ``NDK`` 支持的最低 ``API`` 级别。例如，对于 ``NDK r20`` ，此值默认为 ``API`` 级别 ``16`` 。

比如面向 ``armeabi-v7a`` 架构，使用 ``Android23`` 标准，使用 ``Ninja`` 构建。

.. code::

    $ cmake \
    -DCMAKE_TOOLCHAIN_FILE=$NDK/build/cmake/android.toolchain.cmake \
    -DANDROID_ABI=armeabi-v7a \
    -DANDROID_PLATFORM=android-23 \
    -GNinja

GameActivity 引入库
######################

此时需要 ``Android Studio``

1. 创建继承自 ``GameActivity`` 的自定义类。

.. code:: java

    import com.google.androidgamesdk.GameActivity;

    public class YourGameActivity extends GameActivity { ... }

2. 确保在启动时使用静态块加载之前自定义的原生库

.. code:: java

    public class EndlessTunnelActivity extends GameActivity {
      static {
        // 加载原生库
        // 库的名称取决于 CMake 配置文件中的声明，并且必须在 AndroidManifect.xml 中进行声明
        System.loadLibrary("android-game");
      }
      ...
    }

3. 如果您的库名称不是默认名称 ( ``libmain.so`` )，请将您的原生库添加到 ``AndroidManifest.xml`` 中：

.. code:: xml

    <meta-data android:name="android.app.lib_name"
        android:value="android-game" />
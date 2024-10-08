# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

#project = 'Essentials.of.Vulkan'
project = 'Vulkan入门精要'
copyright = '2023-2024, FuXii'
author = 'FuXii'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinxcontrib.mermaid', 
    #'sphinxcontrib.images',# Sphinx 8.0 版本中遗弃了 status_iterator 接口，sphinxcontrib.images 需要适配新版本的 Sphinx（https://github.com/sphinx-contrib/images/issues/40）
    'myst_parser', 
    'sphinx_copybutton',
    'sphinx_inline_tabs',
    #'sphinx_last_updated_by_git',
    'sphinx_design',
    'sphinx_comments',
    ]

comments_config = {
   "hypothesis": True
}

myst_enable_extensions = [
    #"amsmath",
    "dollarmath",
    #'myst_dmath_allow_labels',
    #'myst_dmath_allow_space',
    #'myst_dmath_allow_digits',
    #'myst_dmath_double_inline',
    #'dmath_allow_labels',
    #'dmath_allow_space',
    #'dmath_allow_digits',
    #'dmath_double_inline',
    ]

templates_path = ['_templates']
exclude_patterns = []
#include_patterns = ['**','literature/*']
source_suffix = {
    '.rst': 'restructuredtext',
    '.txt': 'restructuredtext',
    '.md': 'markdown',
}

language = 'zh_CN'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'furo'
html_static_path = ['_static']

version = '0.1'

html_logo = '_static/Vulkan.png'

html_favicon = '_static/VulkanLogo.png'

html_title = 'Vulkan入门精要'

html_baseurl = 'https://github.com/FuXiii/Essentials.of.Vulkan'

html_theme_options = {
    #"announcement": "<em>Important</em> announcement!",
    "source_repository": "https://github.com/FuXiii/Essentials.of.Vulkan",
    "source_branch": "main",
    "source_directory": "source/",
    "footer_icons": [
        {
            "name": "GitHub",
            "url": "https://github.com/FuXiii/Essentials.of.Vulkan",
            "html": """
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            """,
            "class": "",
        },
    ],
}

html_css_files = [
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css",
    'css/custom_sidebar_drawer.css',
    'css/custom_content.css',
]

html_js_files = [
    'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js',
]

pygments_style = 'monokai'

###from pygments.lexers.c_cpp import CppLexer
###from pygments.token import Name, Keyword
###from sphinx.highlighting import lexers
###
###class VulkanLexer(CppLexer):
###
###    name = 'Vulkan'
###    aliases = ['vulkan']
###
###    EXTRA_KEYWORDS = set((
###        'VK_MAKE_VERSION',
###        'VK_VERSION_MAJOR',
###        'VK_VERSION_MINOR',
###        'VK_VERSION_PATCH',
###        'VK_API_VERSION_VARIANT',
###        'VK_API_VERSION_MAJOR',
###        'VK_API_VERSION_MINOR',
###        'VK_API_VERSION_PATCH',
###        'VkBool32',
###        'VkDeviceAddress',
###        'VkDeviceSize',
###        'VkFlags',
###        'VkSampleMask',
###        'VkBuffer',
###        'VkImage',
###        'VkInstance',
###        'VkPhysicalDevice',
###        'VkDevice',
###        'VkQueue',
###        'VkSemaphore',
###        'VkCommandBuffer',
###        'VkFence',
###        'VkDeviceMemory',
###        'VkEvent',
###        'VkQueryPool',
###        'VkBufferView',
###        'VkImageView',
###        'VkShaderModule',
###        'VkPipelineCache',
###        'VkPipelineLayout',
###        'VkPipeline',
###        'VkRenderPass',
###        'VkDescriptorSetLayout',
###        'VkSampler',
###        'VkDescriptorSet',
###        'VkDescriptorPool',
###        'VkFramebuffer',
###        'VkCommandPool',
###        'VK_ATTACHMENT_UNUSED',
###        'VK_FALSE',
###        'VK_LOD_CLAMP_NONE',
###        'VK_QUEUE_FAMILY_IGNORED',
###        'VK_REMAINING_ARRAY_LAYERS',
###        'VK_REMAINING_MIP_LEVELS',
###        'VK_SUBPASS_EXTERNAL',
###        'VK_TRUE',
###        'VK_WHOLE_SIZE',
###        'VK_MAX_MEMORY_TYPES',
###        'VK_MAX_PHYSICAL_DEVICE_NAME_SIZE',
###        'VK_UUID_SIZE',
###        'VK_MAX_EXTENSION_NAME_SIZE',
###        'VK_MAX_DESCRIPTION_SIZE',
###        'VK_MAX_MEMORY_HEAPS',
###        'VkResult',
###        'VkStructureType',
###        'VkPhysicalDeviceProperties',
###    ))
###
###    def get_tokens_unprocessed(self, text):
###        for index, token, value in CppLexer.get_tokens_unprocessed(self, text):
###            if token is Name and value in self.EXTRA_KEYWORDS:
###                yield index, Keyword.Pseudo, value
###            else:
###                yield index, token, value
###
###lexers['vulkan'] = VulkanLexer(startinline=True)
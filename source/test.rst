Test
======

.. mermaid::
   
   sequenceDiagram
      participant Alice
      participant Bob
      Alice->John: Hello John, how are you?
      loop Healthcheck
          John->John: Fight against hypochondria
      end
      Note right of John: Rational thoughts <br/>prevail...
      John-->Alice: Great!
      John->Bob: How about you?
      Bob-->John: Jolly good!

.. 这是注释

*斜体*

**粗体**

``代码样例``

* This is a bulleted list.
* It has two items, the second
  item uses two lines.

1. This is a numbered list.
2. It has two items too.

#. This is a numbered list.
#. It has two items too.



* this is
* a list

  * with a nested list
  * and some subitems

* and here the parent list continues


term (up to a line of text)
   Definition of the term, which must be indented

   and can even consist of multiple paragraphs

next term
   Description.


| These lines are
| broken exactly like in
| the source file.

This is a normal text paragraph. The next paragraph is a code sample::

   It is not processed in any way, except
   that the indentation is removed.

   It can span multiple lines.

This is a normal text paragraph again.

CPP code::
   int a = 0;

>>> 1 + 1
2

+------------------------+------------+----------+----------+
| Header row, column 1   | Header 2   | Header 3 | Header 4 |
| (header rows optional) |            |          |          |
+========================+============+==========+==========+
| body row 1, column 1   | column 2   | column 3 | column 4 |
+------------------------+------------+----------+----------+
| body row 2             | ...        | ...      |          |
+------------------------+------------+----------+----------+

=====  =====  =======
A      B      A and B
=====  =====  =======
False  False  False
True   False  False
False  True   False
True   True   True
=====  =====  =======

This is a paragraph that contains `a link`_.

.. _a link: https://domain.invalid/

.. 
   This is a heading
   =================

.. _my-reference-label:

This is a heading 2
####################

This is a heading 3
********************

This is a heading 4
--------------------

This is a heading 5
^^^^^^^^^^^^^^^^^^^^

This is a heading 6
"""""""""""""""""""""

:fieldname: Field content

def my_function(my_arg, my_other_arg):
    """A function just for me.

    :param my_arg: The first of my arguments.
    :param my_other_arg: The second of my arguments.

    :returns: A message (just for me, of course).
    """

This is `interpreted text`

This is :title:`interpreted text`

This is :abbreviation:`abbreviation text`

This is :acronym:`acronym text`

This is :code:`code text`

This is :emphasis:`emphasis text`

This is :literal:`literal text`

This is :math:`math text`

This is :strong:`strong text`

This is :subscript:`subscript text` 

This is :superscript:`superscript text`

This is :title-reference:`title-reference text`

Please RTFM [1]_.

.. [1] Read The Fine Manual

Here is a citation reference: [CIT2002]_.

.. [CIT2002] This is the citation.  It's just like a footnote,
   except the label is textual.

Clicking on this internal hyperlink will take us to the target_
below.

.. _target:

The hyperlink target above points to this paragraph.

.. image:: _static/aifadian.jpg

.. figure:: _static/aifadian.jpg

   The larch.

.. note:: This is a paragraph

   - Here is a bullet list.

.. Danger: modify at your own risk!

.. figure:: _static/aifadian.jpg
   :scale: 50

   The larch.

.. This is a comment
..
   _so: is this!
..
   [and] this!
..
   this:: too!
..
   |even| this:: !

.. [this] however, is a citation.

.. DANGER::
   Beware killer rabbits!

.. cpp:class:: MyClass : public MyBase, MyOtherBase

.. note:: This is a note admonition.
   This is the second line of the first paragraph.

   - The note contains all indented body elements
     following.
   - It includes this bullet list.

.. attention:: This is a attention admonition.
   This is attention.

.. caution:: This is a caution admonition.
   This is caution.

.. danger:: This is a danger admonition.
   This is danger.

.. error:: This is a error admonition.
   This is error.

.. hint:: This is a hint admonition.
   This is hint.

.. important:: This is a important admonition.
   This is important.

.. note:: This is a note admonition.

   This is note.

.. tip:: This is a tip admonition.
   This is tip.

.. warning:: This is a warning admonition.
   This is warning.

.. admonition:: And, by the way...

   You can make up your own admonition too.

:Version: 1.1

.. image:: _static/aifadian.jpg
   :height: 100px
   :width: 200 px
   :scale: 50 %
   :alt: alternate text
   :align: right

.. figure:: _static/aifadian.jpg
   :scale: 50 %
   :alt: map to buried treasure

   This is the caption of the figure (a simple paragraph).

   The legend consists of all elements after the caption.  In this
   case, the legend consists of this paragraph and the following
   table:

   +---------------------------------------+-----------------------+
   | Symbol                                | Meaning               |
   +=======================================+=======================+
   | .. image:: _static/aifadian.jpg       | Campground            |
   +---------------------------------------+-----------------------+
   | .. image:: _static/aifadian.jpg       | Lake                  |
   +---------------------------------------+-----------------------+
   | .. image:: _static/aifadian.jpg       | Mountain              |
   +---------------------------------------+-----------------------+

.. header:: This space for rent.

.. note:: texts

.. container:: custom

   This paragraph might be rendered in a custom way.

.. topic:: Topic Title

    Subsequent indented lines comprise
    the body of the topic, and are
    interpreted as body elements.

.. sidebar:: Optional Sidebar Title
   :subtitle: Optional Sidebar Subtitle

   Subsequent indented lines comprise
   the body of the sidebar, and are
   interpreted as body elements.

.. parsed-literal::

   ( (title_, subtitle_?)?,
     decoration_?,
     (docinfo_, transition_?)?,
     `%structure.model;`_ )

.. _title: https://fuxiii.github.io/Essentials.of.Vulkan
.. _subtitle: https://fuxiii.github.io/Essentials.of.Vulkan
.. _decoration: https://fuxiii.github.io/Essentials.of.Vulkan
.. _docinfo: https://fuxiii.github.io/Essentials.of.Vulkan
.. _transition: https://fuxiii.github.io/Essentials.of.Vulkan
.. _%structure.model;: https://fuxiii.github.io/Essentials.of.Vulkan

.. code:: python

  def my_function():
      "just a test"
      print 8/2

.. code-block:::: python

  def my_function():
      "just a test"
      print 8/2

.. code:: c++

   float value = 10.0f;
   VkPhysicalDevice physical_device = VK_NULL_HANDLE;

.. code-block:: c++

   int32_t value = 0;
   VkInstance instance = VK_NULL_HANDLE;

.. epigraph::

   No matter where you go, there you are.

   -- Buckaroo Banzai

.. highlights::

   highlights

   -- highlights

.. pull-quote::

   pull-quote

   -- pull-quote

.. compound::

   The 'rm' command is very dangerous.  If you are logged
   in as root and enter ::

       cd /
       rm -rf *

   you will erase the entire contents of your file system.

.. table:: Truth table for "not"
   :widths: auto

   =====  =====
     A    not A
   =====  =====
   False  True
   True   False
   =====  =====

.. csv-table:: Frozen Delights!
   :header: "Treat", "Quantity", "Description"
   :widths: 15, 10, 30

   "Albatross", 2.99, "On a stick!"
   "Crunchy Frog", 1.49, "If we took the bones out,
   it wouldn't be crunchy, now would it?"
   "Gannet Ripple", 1.99, "On a stick!"

.. list-table:: Frozen Delights!
   :widths: 15 10 30
   :header-rows: 1

   * - Treat
     - Quantity
     - Description
   * - Albatross
     - 2.99
     - On a stick!
   * - Crunchy Frog
     - 1.49
     - If we took the bones out, it wouldn't be
       crunchy, now would it?
   * - Gannet Ripple
     - 1.99
     - On a stick!

.. meta::
   :description: The reStructuredText plaintext markup language
   :keywords: plaintext, markup language

.. .. default-role:: subscript

An example of a `default` role.

.. role:: custom

An example of using :custom:`interpreted text`

.. function:: foo(x)
              foo(y, z)
   :module: some.module.name

   Return a line of text input from the user.

Lorem ipsum [Ref]_ dolor sit amet.

.. [Ref] Book or article reference, URL or whatever.

.. |name| replace:: replacement *text*

.. |caution| image:: _static/aifadian.jpg
             :alt: Warning!

.. productionlist::
   try_stmt: try1_stmt | try2_stmt
   try1_stmt: "try" ":" `suite`
            : ("except" [`expression` ["," `target`]] ":" `suite`)+
            : ["else" ":" `suite`]
            : ["finally" ":" `suite`]
   try2_stmt: "try" ":" `suite`
            : "finally" ":" `suite`

It refers to the section itself, see :ref:`my-reference-label`.
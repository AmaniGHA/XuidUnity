# XdUnityUI 9Slice Helper

![9SliceHelperIntroduction](https://user-images.githubusercontent.com/20549024/92680529-0091f280-f366-11ea-840d-98f921766871.gif)

## Overview

You can do bitmap 9slice in XD.<br>
9-slice is commonly used in game UI.<br>
Currently XD doesn't have this feature.<br>
However, you can create similar with this plugin.<br>
Easy to do.<br>
1. Drop 9slicable image to AdobeXD.<br>
2. Add the slice number of pixels to the image layer name. (similar to CSS: border-image-slice)<br>
     Ex.  frame-image {image-slice: 10px 20px 10px 20px}<br>
3. Click plugin icon.<br>

9groups created to simulate 9Slice.<br>
<br>


## How it works

- Plug-in processing
    1. 9 copies of the original image.
    1. Create a mask to match the slice area.
    1. Create 9 mask groups.
    1. Change the responsive size parameter.

## Install the plugin

1. https://github.com/itouh2-i0plus/XdUnityUI/releases
1. Download the latest version of 9SliceHelper.xdx.
1. Double-click the xdx file and install it into AdobeXD.

## How to do it

1. Import 9Sliceable images to AdobeXD.
1. Enter a sliced pixel in the layer name of the imported image.
    - Examples: top 20 pixels, right 30 pixels, bottom 10 pixels, left 40 pixels
        - ```layer-name {image-slice: 20px 30px 10px 40px}```
    - Example: top right, bottom left, same number of pixels
        - ```layer-name {image-slice: 100px}```
1. select an image and click 9SliceHelper from the plugin menu.

Created groups ResponsiveResize parameters will be automatically set as follows:
- ![image.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/350704/54037def-c3ed-eb7e-257a-e1a49ee47a44.png)

## Related
- 9Slice in Unity
    - https://docs.unity3d.com/ja/2018.4/Manual/9SliceSprites.html.
- XuidUnity
    - GitHub
        - https://github.com/itouh2-i0plus/XuidUnity
    - Qiita(Japanese)
        - https://qiita.com/itouh2-i0plus/items/7eaf9a0a562a4573dc1c
- Adobe Forum
    - Requests to 9slice on the forum
        - https://adobexd.uservoice.com/forums/353007-adobe-xd-feature-requests/suggestions/18521113-9-slice-scaling-of-bitmaps
        - Designing in bitmap over AdobeXD may not be much of an effort

## future
I'd like to do more and more things that make game production easier using Adobe XD.
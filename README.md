# <img src="https://user-images.githubusercontent.com/20549024/92304327-f368b280-efb7-11ea-8e75-6bbc8ede9b07.png" width=25> XuidUnity - AdobeXD to Unity UI

![introduction](https://user-images.githubusercontent.com/20549024/76156453-0f40e800-613e-11ea-9923-59554aceae3c.gif)

## Renamed from XdUnityUI

## Overview

Transfer AdobeXD UI/UX Design.<br>
Run it in Unity right away!<br>
Design - Run - Improve<br>
This asset makes iteration boost!<br>

AdobeXD's features can be converted.
- ResponsiveResize
- RepeatGrid
- ScrollGroups
- Stack
- Padding


## Installation

- Unity plugin Install
  1. https://github.com/itouh2-i0plus/XdUnityUI/releases
  1. Download XdUnityUI.unitypackage file.
  1. Import the XuidUnity.unitypackage into Unity. /Assets/I0plus/XuidUnity folder will be created.
- AdobeXD plugin Install
  1. https://github.com/itouh2-i0plus/XdUnityUI/releases
  1. Download XuidUnityExporter.xdx file.
  1. Double-click xdx file and install to AdobeXD.

## Quick Start

1. Open the Adobe XD sample.
    1. https://github.com/itouh2-i0plus/XdUnityUI/releases
    1. Donwload Samples.zip and unzip.
    1. Open sample.xd 

2. AdobeXD export
    1. Select the artboard.
    1. Click on "Xuid Unity Export" in the plugin menu.
    1. "Folder" is the destination of the output folder.
    1. Click on "Export" to start exporting. 

<img src="https://user-images.githubusercontent.com/20549024/76756957-0bf6cd80-67ca-11ea-9504-7ef273613a36.gif" width="640" />

3. Unity conversion
    - Unity Menu > Assets > XuidUnity > Clean Import
    - Specifies the same folder as the export.
    - The created prefabs are placed in Assets/I0plus/XuidCreatedPrefabs.
    - The created UI images are placed in Assets/I0plus/CreatedSprites.
      - UI images are sliced.

<img src="https://user-images.githubusercontent.com/20549024/76759838-d3f28900-67cf-11ea-9721-31c221cfe63a.gif" width="640" />

1. Place created Prefab under canvas.

<img src="https://user-images.githubusercontent.com/20549024/76759902-f5ec0b80-67cf-11ea-9dd5-5ca556222c40.gif" width="640" />


## ChangeLog

### [v0.9.7] - 2020-09-06
- more stable and faster.

### [v0.9.6] - 2020-09-06
- Unity: non-destructive conversion.

### [v0.9.3] - 2020-07-21
- XD,Unity: Added option to convert components to Prefab.

### [v0.9.2] - 2020-05-31
- XD,Unity: Scrollable Groups support.

### [v0.9] - 2020-05-31
- XD,Unity: Responsive resizing information is now more accurate. 
- Unity: Import by specifying a folder.

<details><summary>Details</summary><div>
### [v0.8] - 2020-03-16
- XD: Fixed to output a selection.
- Unity: fixed to work with Unity2018.
- Unity: fixed to work with Unity2017.
- Unity: deleted the asmdef file.

### [v0.7.2] - 2020-03-13
- Testing the DotsScrollbar
- Fixing mask processing

### [v0.5] - 2020-03-07

- Maintain InputField conversion.
- README_JP.md Sample images added

### [v0.4] - 2020-03-04

- README.md Englishization
- XD plugins English support

### [v0.3.2] - 2020-03-03

- Sample Modifications
- README.md Revisions and additions
- Corrected XdPlugin/main.js comments

### [v0.3.1] - 2020-03-02

- TextMeshPro sample added and explanation corrected.
- Add Button Sample
- Toggle samples added
- README.md Fix.

### [v0.3] - 2020-03-01

- Creating a unitypackage
- How to install from unitypackage
</div></details>

## Support Forum

- https://forum.unity.com/threads/xdunityui-adobexd-to-unity.843730/.

## Acknowledgements.

- @kyubuns (https://kyubuns.dev)
- Baum2 (https://github.com/kyubuns/Baum2)

### Thank you so much for your help.

# GeoGebra Apps Embedding

This page describes how to embed GeoGebra Apps into your website. For more information on how to interact with embedded apps, please see [GeoGebra Apps API](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/).

## Quick Start

In order to embed GeoGebra apps into your page, you need to add the following three parts:  
1 Make sure you have this in the `<head>` section to make sure scaling works correctly (eg on mobile browsers) and that Unicode works  
`<meta name=viewport content="width=device-width,initial-scale=1">`  
`<meta charset="utf-8"/>`  
2 The javascript library deployggb.js needs to be included with this tag:  
`<script src="https://www.geogebra.org/apps/deployggb.js"></script>`  
3 Create an element for the GeoGebra app on your page:  
`<div id="ggb-element"></div>`  
4 Configure and insert the app:  
`<script>`  
    `var params = {"appName": "graphing", "width": 800, "height": 600, "showToolBar": true, "showAlgebraInput": true, "showMenuBar": true };`  
    `var applet = new GGBApplet(params, true);`  
    `window.addEventListener("load", function() {`  
        `applet.inject('ggb-element');`  
    `});`  
`</script>`  
Simply change the `appName` parameter from `graphing` to `geometry` or `3d` to get one of our other apps. To load an activity you can use eg `"material_id":"RHYH3UQ8"` or `"filename":"myFile.ggb"` and you can customize our apps further by using various [GeoGebra App Parameters](https://geogebra.github.io/docs/reference/en/GeoGebra_App_Parameters/).

## Tutorial

Please see here for a longer tutorial which explains the different embedding options: [https://www.geogebra.org/m/sehv2qc9](https://www.geogebra.org/m/sehv2qc9)

## Live Examples

The following examples and their html source code show how to use GeoGebra apps either embedded in your page or in popup dialogs:

* [GeoGebra Calculators embedded](https://geogebra.github.io/integration/example-graphing.html)  
* [GeoGebra Calculators popup](https://geogebra.github.io/integration/example-popup.html)

## GeoGebra Apps API

The following examples show how you can interact with embedded apps through the [GeoGebra Apps API](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_API/):

* [Showing & hiding objects with buttons](https://geogebra.github.io/integration/example-api.html)  
* [Saving & loading state](https://geogebra.github.io/integration/example-api-save-state.html)  
* [Listening to update, add, remove events](https://geogebra.github.io/integration/example-api-listeners.html)

## Offline and Self-Hosted Solution

We suggest you to use the GeoGebra Apps from our global and super-fast server network www.geogebra.org as shown above, but in case you prefer to host and update the GeoGebra apps yourself, you can [download our GeoGebra Math Apps Bundle](https://download.geogebra.org/package/geogebra-math-apps-bundle) The embed codes are almost the same as above, with two differences: the tag for including deployggb.js needs to be changed to  
   `<script src="GeoGebra/deployggb.js"></script>`  
and you need to include the following line before the inject() call:  
   `applet.setHTML5Codebase('GeoGebra/HTML5/5.0/web3d/');`  
Alternatively if you just need to fix to a specific version then you can still use the CDN like this (don’t change the `5.0.` just the `498`)  
   `applet.setHTML5Codebase("https://www.geogebra.org/apps/5.0.498.0/web3d");`  
For technical reasons, you need to use `5.2` not `5.0` after version 804 eg  
   `applet.setHTML5Codebase("https://www.geogebra.org/apps/5.2.804.0/web3d");`

## Adjusting embedded apps appearance

This feature is currently available only for GeoGebra Notes. To change the colors of the UI elements, you can set some CSS variables  
`<style>`  
`body {`  
  `--ggb-primary-color: #ee0290; /* used for most UI elements, including the toolbar header and buttons */`  
  `--ggb-primary-variant-color: #880061; /* used for floating buttons on hover */`  
  `--ggb-dark-color: #880061; /* used for highlighted text in dialogs */`  
  `--ggb-light-color: #f186c0; /* used for progress bar */`  
`}`  
`</style>`

## Speed up loading time with a service worker

You can speed up loading of the GeoGebra library by using a service worker. To use a service worker you should set a specific version of GeoGebra using `setHTML5Codebase()`.  
To install the service worker, first you have to include the *sworker-locked.js* file under your domain (e.g. *www.example.com/path/sworker-locked.js*). The service worker file can be found under the *GeoGebra/HTML5/5.0/web3d/* folder in the *GeoGebra Math Apps Bundle*.  
Next, include the following snippet on the page where GeoGebra is loaded. Please change the path to the service worker. You can also set the appletLocation variable to enable the worker only in a specific folder (or leave it as '/' to use it on all pages of your domain):  
  `var serviceWorkerPath = '/sworker-locked.js'`  
   `var appletLocation = '/'`

   `function isServiceWorkerSupported() {`  
       `return 'serviceWorker' in navigator && location.protocol === "https:";`  
   `}`

   `function installServiceWorker() {`  
       `if (navigator.serviceWorker.controller) {`  
           `console.log("Service worker is already controlling the page.");`  
       `} else {`  
           `navigator.serviceWorker.register(serviceWorkerPath, {`  
               `scope: appletLocation`  
           `});`  
       `}`  
   `}`

   `if (isServiceWorkerSupported()) {`  
       `window.addEventListener('load', function() {`  
           `installServiceWorker()`  
       `});`  
   `} else {`  
       `console.log("Service workers are not supported.");`  
   `}`  
With this installed, when a user opens the page where the service worker is enabled, the application scripts get downloaded and cached by the service worker. This way, the next time that same user visits the page, the scripts are loaded from the cache instead of downloading them again from the servers.

© GeoGebra® | [License](https://www.geogebra.org/license) | [Help Center](https://help.geogebra.org/) | Built using [Antora](https://antora.org/)

# Material Embedding (Iframe)

This article describes how to easily embed GeoGebra materials in your website.

|  | In case you need extra customization, JavaScript API or offline support, please see [Math Apps Embedding](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_Embedding/). |
| :---- | :---- |

To get the iframe code for a material, open the material, click the ![Menu-file-share.svg][image1] Share icon and then select Embed. You will get a code similar to this:  
`<iframe scrolling="no"`  
`src="https://www.geogebra.org/material/iframe/id/23587/width/1600/height/715/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/true/ld/false/sri/false"`  
`width="1600px"`  
`height="715px"`  
`style="border:0px;" allowfullscreen>`  
`</iframe>`  
The language of the GeoGebra user interface (toolbar, menu, …​) is set to the browser’s language.

| Description | Code | Example |
| :---- | :---- | :---- |
| Enable Right Click, Zooming and Keyboard Editing | rc | /rc/true |
| Show Input Bar | ai | /ai/true |
| Enable Shift-Drag & Zoom | sdz | /sdz/true |
| Show Menu Bar | smb | /smb/true |
| Show Toolbar | stb | /stb/true |
| Show Toolbar Help | stbh | /stbh/true |
| Allow label dragging | ld | /ld/true |
| Show reset icon (top-right) | sri | /sri/true |
| Show play button that starts the construction | ctl | /ctl/true |
| Show full-screen button. Make sure you also add allowfullscreen to the iframe tag | sfsb | /sfsb/true |
| Show zoom buttons | szb | /szb/true |

# GeoGebra App Parameters

This page lists all parameters that can be used to configure GeoGebra Apps. Please see [GeoGebra Apps Embedding](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_Embedding/) to learn how to embed GeoGebra apps into your pages and where these parameters can be used.

| Name | Value | Description | Since |
| :---- | :---- | :---- | :---- |
| appName | eg `"graphing"` | app name, default: "classic" "graphing" …​ GeoGebra Graphing Calculator "geometry" …​ GeoGebra Geometry "3d" …​ GeoGebra 3D Graphing Calculator "classic" …​ GeoGebra Classic "suite" …​ GeoGebra Calculator Suite "evaluator" …​ Equation Editor "scientific" …​Scientific Calculator "notes" …​ GeoGebra Notes | 6.0 |
| width | eg `800` | Applet width (compulsory field unless using `scaleContainerClass`) |  |
| height | eg `600` | Applet height (compulsory field unless using `scaleContainerClass`) |  |
| material\_id | eg `"RHYH3UQ8"` | GeoGebra Materials id to load See first applet here: [https://geogebra.github.io/integration/index.html](https://geogebra.github.io/integration/index.html) | 5.0 |
| filename | eg `"myFile.ggb"` | URL of file to load See second applet here: [https://geogebra.github.io/integration/index.html](https://geogebra.github.io/integration/index.html) | 4.0 |
| ggbBase64 | base64 encoded .ggb file | Encoded file to load. See third applet here: [https://geogebra.github.io/integration/index.html](https://geogebra.github.io/integration/index.html) | 4.0 |
| borderColor | e.g. `#FFFFFF` for white | Color of the border line drawn around the applet panel (as hex rgb string). Default: gray | 3.0 |
| borderRadius | number | Size of applet’s [border radius](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) in pixels. | 6.0 |
| enableRightClick | `true` or `false` | States whether right clicks should be handled by the applet. Setting this parameter to "false" disables context menus, properties dialogs and right-click-zooming. Default: true. NB also enables/disables some keyboard shortcuts eg Delete and Ctrl \+ R (recompute all objects). Default: true | 3.0 |
| enableLabelDrags | `true` or `false` | States whether labels can be dragged. Default: true | 3.2 |
| enableShiftDragZoom | `true` or `false` | States whether the Graphics View(s) should be moveable using Shiftmouse drag (or. Ctrl \+ mouse drag) or zoomable using Shift \+ mouse wheel (or Ctrl \+ mouse wheel). Setting this parameter to "false" disables moving and zooming of the drawing pad. Default: true | 3.0 |
| showZoomButtons | `true` or `false` | States whether the zoom in / zoom out / home buttons should be shown in the Graphics View or not. Default: false | 6.0 |
| errorDialogsActive | `true` or `false` | States whether error dialogs will be shown if an invalid input is entered (using the Input Bar or JavaScript) Default: true | 3.2 |
| showMenuBar | `true` or `false` | States whether the menubar of GeoGebra should be shown in the applet. Default: false | 2.5 |
| showToolBar | `true` or `false` | States whether the toolbar with the construction mode buttons should be shown in the applet. Default: false | 2.5 |
| showToolBarHelp | `true` or `false` | States whether the toolbar help text right to the toolbar buttons should be shown in the applet | 3.0 |
| customToolBar | e.g. `0 1 2 3 , 4 5 6 7` | Sets the toolbar according to a custom toolbar string where the int values are [Toolbar Mode Values](https://geogebra.github.io/docs/reference/en/Toolbar/), `,` adds a separator within a menu, `|` starts a new menu and `||` adds a separator in the toolbar before starting a new menu. This will override the saved toolbar from the .ggb file / base64 string. Custom tools are numbered 100 001, 100 002, etc | 2.5 |
| showAlgebraInput | `true` or `false` | States whether the algebra input line (with input field, greek letters and command list) should be shown in the applet. Default: false | 2.5 |
| showResetIcon | `true` or `false` | States whether a small icon (GeoGebra ellipse) should be shown in the upper right corner of the applet. Clicking on this icon resets the applet (i.e. it reloads the file given in the filename parameter). Default: false | 2.5 |
| language | [iso language string](http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) | GeoGebra tries to set your local language automatically (if it is available among the supported languages, of course). The default language for unsupported languages is English. If you want to specify a certain language manually, please use this parameter. | 2.5 |
| country | iso country string, e.g. `AT` for Austria | This parameter only makes sense if you use it together with the language parameter. | 2.5 |
| id | eg `applet2` | This parameter allows you to specify the argument passed to the JavaScript function ggbOnInit(), which is called once the applet is fully initialised. This is useful when you have multiple applets on a page \- see [this example](https://geogebra.github.io/integration/example-api-sync.html) (will have no effect in earlier versions) | 3.2 |
| allowStyleBar | `true` or `false` | Determines whether the Style Bar can be shown (or will be shown if just Graphics View 1 is showing)Default: false | 4.0 |
| randomize | `true` or `false` | Determines whether random numbers should be randomized on file load. Useful when you want the app to reload in exactly the same state it was saved.Default: true | 6.0 |
| randomSeed | eg `"randomSeed":33` | Specify seed for random numbers. Note that if you save a state of the app after user interacted with it and try to reload that state with the same randomSeed, you may get a different result. Use `randomize` for those use-cases. | 5.0 |
| appletOnLoad | eg `function(api){ api.evalCommand('Segment((1,2),(3,4))'); }` | JavaScript method to run when the activity is initialized (and file loaded if applicable) | 5.0 |
| useBrowserForJS | `true` or `false` | When true, GeoGebra runs ggbOnInit from HTML ignores ggbOnInit from file ignores JS update scripts of objects in file When false, GeoGebra: ignores ggbOnInit from HTML (use appletOnLoad parameter of GGBApplet instead) runs ggbOnInit from file runs JS update scripts of objects in file Default: false | 4.0 |
| showLogging | `true` or `false` | Determines whether logging is shown in the Browser’s consoleDefault: false | 4.2 |
| capturingThreshold | integer | Determines the sensitivity of object selection. The default value of 3 is usually fine to select and drag objects both with the mouse and touch. Use larger values (e.g. 4 or 5\) to make it easier to select and drag objects.Default: 3 | 4.4 |
| enableFileFeatures | `true` or `false` | Determines whether file saving, file loading, sign in and Options \> Save settings are enabled. This argument is ignored when menubar is not showing.Default: true | 5.0 |
| enableUndoRedo | `true` or `false` | Determines whether Undo and Redo icons are shown. This argument is ignored when toolbar is not showing.Default: true | 6.0 |
| perspective | string | For values see [SetPerspective\_Command](https://geogebra.github.io/docs/manual/en/commands/SetPerspective/). Just for a blank start ie shouldn’t be used with *material\_id*, *filename* or *ggbBase64* parameters | 5.0 |
| enable3d | `true` or `false` or none | Whether 3D should be enabled (for exam mode). When neither true nor false are entered, user can decide in a dialog. | 5.0 |
| enableCAS | `true` or `false` or none | Whether CAS should be enabled (for exam mode). When neither true nor false are entered, user can decide in a dialog. | 5.0 |
| algebraInputPosition | `algebra`, `top` or `bottom` | Determines whether input bar should be shown in algebra, on top of the applet or under the applet. When left empty (default), the position depends on file. | 5.0 |
| preventFocus | `true` or `false` | When set to true, this prevents the applet from getting focus automatically at the start.Default: false | 5.0 |
| scaleContainerClass | String | Name of CSS class that is used as container; applet will scale to fit into the container. | 5.0 |
| autoHeight | boolean | • `true` to restrict the width of the applet and compute height automatically, add `autoHeight:true`• \`false\`if you want the applet to be restricted by both width and height of the container | 5.0 |
| allowUpscale | `true` or `false` | Determines whether automatic scaling may scale the applet upDefault: false | 5.0 |
| playButton | `true` or `false` | Determines whether a preview image and a play button should be rendered in place of the applet. Pushing the play button initializes the applet.Default: false | 5.0 |
| scale | number | Ratio by which the applet should be scaled (eg. 2 makes the applet 2 times bigger, including all texts and UI elements). Default: 1 | 5.0 |
| showAnimationButton | `true` or `false` | Whether animation button should be visible | 5.0 |
| showFullscreenButton | `true` or `false` | Whether fullscreen button should be visible | 6.0 |
| showSuggestionButtons | `true` or `false` | Whether suggestion buttons (special points, solve) in Algebra View should be visible | 6.0 |
| showStartTooltip | `true` or `false` | Whether "Welcome" tooltip should be shown | 5.0 |
| rounding | string | String composed of number of decimal places and flags — valid flags are "s" for significant digits and "r" for rational numbers. Hence "10" means 10 decimal places, "10s" stands for 10 significant digits. | 6.0 |
| buttonShadows | `true` or `false` | Whether buttons should have shadow | 6.0 |
| buttonRounding | Number (0 \- 0.9) | Relative radius of button’s rounded border. The border radius in pixels is `buttonRounding * height /2`, where `height` is the height of the button. Default 0.2. | 6.0 |
| buttonBorderColor | Hex color (`#RGB`, `#RGBA`, `#RRGGBB` or `#RRGGBBAA`) | Border color of buttons on the graphics view. Default is black, if the button background is white, otherwise one shade darker than the background color | 6.0 |
| editorBackgroundColor | Hex color | Background color of the evaluator app | 6.0 |
| editorForegroundColor | Hex color | Foreground (text) color of the equation editor (appname \= "evaluator") | 6.0 |
| textmode | `true` or `false` | Whether editor is in text mode or not (appname \= "evaluator")Default: `false` | 6.0 |
| showKeyboardOnFocus | `false`, `true` or `auto` | Whether to show keyboard when input is focused. When set to `true`, keyboard is always shown, for `false` it never appears, for `auto` it’s shown unless closed by user. Default: `true` in evaluator app, `auto` in other apps | 6.0 |
| keyboardType | `scientific`, `normal`, `notes` | Which keyboard is shown for equation editor (appname \= "evaluator") | 6.0 |
| transparentGraphics | `true` or `false` | Whether the Graphics View and Graphics View 2 should be transparent | 6.0 |
| disableJavaScript | `true` or `false` | Whether running JavaScript from material files is disabled or not. | 6.0 |
| detachKeyboard | `true`, `false` or `auto` (default) | Whether the keyboard should be detached from the applet. When set to `false`, the keyboard is attached directly to the `body` of the document. When set to `auto` (or not set), the keyboard is attached to the applet if there are views other than the graphics view and attached to document body otherwise. | 6.0 |
| detachedKeyboardParent | String | When set, the keyboard should be attached to the first element in DOM that fits the selector. | 6.0 |

Following table shows which tool numbers can be used in the definition of a custom toolbar. See `customToolbar` [app parameter](https://geogebra.github.io/docs/reference/en/GeoGebra_App_Parameters/).

| Name | ID | Icon |
| :---- | :---- | :---- |
| MOVE | 0 | ![Mode move.svg][image2] |
| POINT | 1 | ![Mode point.svg][image3] |
| JOIN | 2 | ![Mode join.svg][image4] |
| PARALLEL | 3 | ![Mode parallel.svg][image5] |
| ORTHOGONAL | 4 | ![Mode orthogonal.svg][image6] |
| INTERSECT | 5 | ![Mode intersect.svg][image7] |
| DELETE | 6 | ![Mode delete.svg][image8] |
| VECTOR | 7 | ![Mode vector.svg][image9] |
| LINE\_BISECTOR | 8 | ![Mode linebisector.svg][image10] |
| ANGULAR\_BISECTOR | 9 | ![Mode angularbisector.svg][image11] |
| CIRCLE\_TWO\_POINTS | 10 | ![Mode circle2.svg][image12] |
| CIRCLE\_THREE\_POINTS | 11 | ![Mode circle3.svg][image13] |
| CONIC\_FIVE\_POINTS | 12 | ![Mode conic5.svg][image14] |
| TANGENTS | 13 | ![Mode tangent.svg][image15] |
| RELATION | 14 | ![Mode relation.svg][image16] |
| SEGMENT | 15 | ![Mode segment.svg][image17] |
| POLYGON | 16 | ![Mode polygon.svg][image18] |
| TEXT | 17 | ![Mode text.svg][image19] |
| RAY | 18 | ![Mode ray.svg][image20] |
| MIDPOINT | 19 | ![Mode midpoint.svg][image21] |
| CIRCLE\_ARC\_THREE\_POINTS | 20 | ![Mode circlearc3.svg][image22] |
| CIRCLE\_SECTOR\_THREE\_POINTS | 21 | ![Mode circlesector3.svg][image23] |
| CIRCUMCIRCLE\_ARC\_THREE\_POINTS | 22 | ![Mode circumcirclearc3.svg][image24] |
| CIRCUMCIRCLE\_SECTOR\_THREE\_POINTS | 23 | ![Mode circumcirclesector3.svg][image25] |
| SEMICIRCLE | 24 | ![Mode semicircle.svg][image26] |
| SLIDER | 25 | ![Mode slider.svg][image27] |
| IMAGE | 26 | ![Mode image.svg][image28] |
| SHOW\_HIDE\_OBJECT | 27 | ![Mode showhideobject.svg][image29] |
| SHOW\_HIDE\_LABEL | 28 | ![Mode showhidelabel.svg][image30] |
| MIRROR\_AT\_POINT | 29 | ![Mode mirroratpoint.svg][image31] |
| MIRROR\_AT\_LINE | 30 | ![Mode mirroratline.svg][image32] |
| TRANSLATE\_BY\_VECTOR | 31 | ![Mode translatebyvector.svg][image33] |
| ROTATE\_BY\_ANGLE | 32 | ![Mode rotatebyangle.svg][image34] |
| DILATE\_FROM\_POINT | 33 | ![Mode dilatefrompoint.svg][image35] |
| CIRCLE\_POINT\_RADIUS | 34 | ![Mode circlepointradius.svg][image36] |
| COPY\_VISUAL\_STYLE | 35 | ![Mode copyvisualstyle.svg][image37] |
| ANGLE | 36 | ![Mode angle.svg][image38] |
| VECTOR\_FROM\_POINT | 37 | ![Mode vectorfrompoint.svg][image39] |
| DISTANCE | 38 | ![Mode distance.svg][image40] |
| MOVE\_ROTATE | 39 | ![Mode moverotate.svg][image41] |
| TRANSLATEVIEW | 40 | ![Mode translateview.svg][image42] |
| ZOOM\_IN | 41 | ![Mode zoomin.svg][image43] |
| ZOOM\_OUT | 42 | ![Mode zoomout.svg][image44] |
| POLAR\_DIAMETER | 44 | ![Mode polardiameter.svg][image45] |
| SEGMENT\_FIXED | 45 | ![Mode segmentfixed.svg][image46] |
| ANGLE\_FIXED | 46 | ![Mode anglefixed.svg][image47] |
| LOCUS | 47 | ![Mode locus.svg][image48] |
| MACRO | 48 | ![Mode tool.svg][image49] |
| AREA | 49 | ![Mode area.svg][image50] |
| SLOPE | 50 | ![Mode slope.svg][image51] |
| REGULAR\_POLYGON | 51 | ![Mode regularpolygon.svg][image52] |
| SHOW\_HIDE\_CHECKBOX | 52 | ![Mode showcheckbox.svg][image53] |
| COMPASSES | 53 | ![Mode compasses.svg][image54]\] |
| MIRROR\_AT\_CIRCLE | 54 | ![Mode mirroratcircle.svg][image55] |
| ELLIPSE\_THREE\_POINTS | 55 | ![Mode ellipse3.svg][image56] |
| HYPERBOLA\_THREE\_POINTS | 56 | ![Mode hyperbola3.svg][image57] |
| PARABOLA | 57 | ![Mode parabola.svg][image58] |
| FITLINE | 58 | ![Mode fitline.svg][image59] |
| RECORD\_TO\_SPREADSHEET | 59 | ![Mode recordtospreadsheet.svg][image60] |
| BUTTON\_ACTION | 60 | ![Mode buttonaction.svg][image61] |
| TEXTFIELD\_ACTION | 61 | ![Mode textfieldaction.svg][image62] |
| PEN | 62 | ![Mode pen.svg][image63] |
| Rigid Polygon | 64 | ![Mode rigidpolygon.svg][image64] |
| Polyline | 65 | ![Mode polyline.svg][image65] |
| Probability Calculator | 66 | ![Mode probabilitycalculator.svg][image66] |
| Attach / Detach | 67 | ![Mode attachdetachpoint.svg][image67] |
| Function Inspector | 68 | ![Mode functioninspector.svg][image68] |
| Intersect Two Surfaces | 69 | 32px\] |
| Vector Polygon | 70 | ![Mode vectorpolygon.svg][image69] |
| Create List | 71 | ![Mode createlist.svg][image70] |
| Complex Number | 72 | ![Mode complexnumber.svg][image71] |
| Freehand Mode | 73 | ![Mode freehandshape.svg][image72] |
| Freehand Function | 74 |  |
| Extremum | 75 |  |
| Roots | 76 |  |
| Select Objects | 77 |  |
| Point on object | 501 | ![Mode pointonobject.svg][image73] |
| MODE\_SPREADSHEET\_CREATE\_LIST | 2001 | ![Mode createlist.svg][image74] |
| MODE\_SPREADSHEET\_CREATE\_MATRIX | 2002 | ![Mode creatematrix.svg][image75] |
| MODE\_SPREADSHEET\_CREATE\_LISTOFPOINTS | 2003 | ![Mode createlistofpoints.svg][image76] |
| MODE\_SPREADSHEET\_CREATE\_TABLETEXT | 2004 | ![Mode createtable.svg][image77] |
| MODE\_SPREADSHEET\_CREATE\_POLYLINE | 2005 | ![Mode createpolyline.svg][image78] |
| MODE\_SPREADSHEET\_ONEVARSTATS | 2020 | ![Mode onevarstats.svg][image79] |
| MODE\_SPREADSHEET\_TWOVARSTATS | 2021 | ![Mode twovarstats.svg][image80] |
| MODE\_SPREADSHEET\_MULTIVARSTATS | 2022 | ![Mode multivarstats.svg][image81] |
| MODE\_SPREADSHEET\_SUM | 2040 | ![Mode sumcells.svg][image82] |
| MODE\_SPREADSHEET\_AVERAGE | 2041 | ![Mode meancells.svg][image83] |
| MODE\_SPREADSHEET\_COUNT | 2042 | ![Mode countcells.svg][image84] |
| MODE\_SPREADSHEET\_MIN | 2043 | ![Mode mincells.svg][image85] |
| MODE\_SPREADSHEET\_MAX | 2044 | ![Mode maxcells.svg][image86] |

## 3D Tools

| VIEW\_IN\_FRONT\_OF | 502 | ![Mode viewinfrontof.svg][image87] |
| :---- | :---- | :---- |
| PLANE\_THREE\_POINTS | 510 | ![Mode planethreepoint.svg][image88] |
| PLANE\_POINT\_LINE | 511 | ![Mode plane.svg][image89] |
| ORTHOGONAL\_PLANE | 512 | ![Mode orthogonalplane.svg][image90] |
| PARALLEL\_PLANE | 513 | ![Mode parallelplane.svg][image91] |
| Perpendicular line (3D) | 514 | ![Mode orthogonalthreed.svg][image92] |
| SPHERE\_POINT\_RADIUS | 520 | ![Mode spherepointradius.svg][image93] |
| SPHERE\_TWO\_POINTS | 521 | ![Mode sphere2.svg][image94] |
| Cone given by two points and radius | 522 | ![Mode cone.svg][image95] |
| Cylinder given by two points and radius | 523 | ![Mode cylinder.svg][image96] |
| Prism | 531 | ![Mode prism.svg][image97] |
| Extrude to Prism or Cylinder | 532 | ![Mode extrusion.svg][image98] |
| Pyramid | 533 | ![Mode pyramid.svg][image99] |
| Extrude to Pyramid or Cone | 534 | ![Mode conify.svg][image100] |
| Net | 535 | ![Mode net.svg][image101] |
| Cube | 536 | ![Mode cube.svg][image102] |
| Tetrahedron | 537 | ![Mode tetrahedron.svg][image103] |
| Surface of Revolution | 538 |  |
| Rotate View | 540 | ![Mode rotateview.svg][image104] |
| Circle Point Radius Direction | 550 | ![Mode circlepointradiusdirection.svg][image105] |
| Circle Axis Point | 551 | ![Mode circleaxispoint.svg][image106] |
| Volume | 560 | ![Mode volume.svg][image107] |
| Rotate around Line | 570 | ![Mode rotatearoundline.svg][image108] |
| Mirror at Plane | 571 | ![Mode mirroratplane.svg][image109] |

## User defined

| User defined 1 | 100 001 |
| :---- | :---- |
| User defined X | 100 000+X |

# GeoGebra Apps API

This page describes the GeoGebra Apps API to interact with GeoGebra apps. Please see [GeoGebra Apps Embedding](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_Embedding/) on how to embed our apps into your web pages.

## Examples

In these examples you can see the GeoGebra Apps API in action:

* [Showing & hiding objects with buttons](https://geogebra.github.io/integration/example-api.html)  
* [Saving & loading state](https://geogebra.github.io/integration/example-api-save-state.html)  
* [Listening to update, add, remove events](https://geogebra.github.io/integration/example-api-listeners.html)

|  | Arguments in square brackets can be omitted. |
| :---- | :---- |

## Creating objects

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| boolean evalCommand(String cmdString) | 3.0 | Evaluates the given string just like it would be evaluated when entered into GeoGebra’s input bar. Returns whether command evaluation was successful. From GeoGebra 3.2 you can pass multiple commands at once by separating them with \\n. Note: you must use English commands names |
| boolean evalLaTex(String input) | 5.0 | Evaluates LaTeX string to a construction element. Basic syntaxes like `x^{2}` or `\frac` are supported. |
| String evalCommandGetLabels(String cmdString) | 5.0 | Like evalCommand(), but the return value is a String containing a comma-separated list of the labels of the created objects eg `"A,B,C"` |
| String evalCommandCAS(String string) | 3.2 | Passes the string to GeoGebra’s CAS and returns the result as a String. |
| void insertEmbed(String type, String uri) | 6.0 (Notes) | Inserts embedded element with specific type and URI. Type and URI are then used to obtain the HTML code for the embed element, see `registerEmbedResolver` |

## Setting the state of objects

### **General methods**

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void deleteObject(String objName) | 2.7 | Deletes the object with the given name. |
| void setAuxiliary(geo, true/false) | 5.0 | Affects or not the status of "auxiliary object" to object *geo*. |
| void setValue(String objName, double value) | 3.2 | Sets the double value of the object with the given name. Note: if the specified object is boolean, use a value of 1 to set it to true and any other value to set it to false. For any other object type, nothing is done. |
| void setTextValue(String objName, String value) | 3.2 | Sets the text value of the object with the given name. For any other object type, nothing is done. |
| void setListValue(String objName, int i, double value) | 5.0 | Sets the value of the list element at position 'i' to 'value' |
| void setCoords(String objName, double x, double y)void setCoords(String objName, double x, double y, double z) | 3.05.0 | Sets the coordinates of the object with the given name. Note: if the specified object is not a point, vector, line or absolutely positioned object (text, button, checkbox, input box) nothing is done. |
| void setCaption(String objName, String caption) | 5.0 | Sets the caption of object with given name. |
| void setColor(String objName, int red, int green, int blue) | 2.7 | Sets the color of the object with the given name. |
| void setVisible(String objName, boolean visible) | 2.7 | Shows or hides the object with the given name in the graphics window. |
| void setLabelVisible(String objName, boolean visible) | 3.0 | Shows or hides the label of the object with the given name in the graphics window. |
| void setLabelStyle(String objName, int style) | 3.0 | Sets the label style of the object with the given name in the graphics window. Possible label styles are NAME \= 0, NAME\_VALUE \= 1, VALUE \= 2 and (from GeoGebra 3.2) CAPTION \= 3 |
| void setFixed(String objName, boolean fixed, boolean selectionAllowed) | 3.0 | Sets the "Fixed" and "Selection Allowed" state of the object with the given name. Note: fixed objects cannot be changed. |
| void setTrace(String objName, boolean flag) | 3.0 | Turns the trace of the object with the given name on or off. |
| boolean renameObject(String oldObjName, String newObjName) | 3.2 | Renames oldObjName to newObjName. Returns whether the rename was successful |
| void setLayer(String objName, int layer) | 3.2 | Sets the layer of the object |
| void setLayerVisible(int layer, boolean visible) | 3.2 | Shows or hides the all objects in the given layer |
| void setLineStyle(String objName, int style) | 3.2 | Sets the line style for the object (0 to 4\) |
| void setLineThickness(String objName, int thickness) | 3.2 | sets the thickness of the object (1 to 13, \-1 for default) |
| void setPointStyle(String objName, int style) | 3.2 | Sets the style of points (-1 default, 0 filled circle, 1 cross, 2 circle, 3 plus, 4 filled diamond, 5 unfilled diamond, 6 triangle (north), 7 triangle (south), 8 triangle (east), 9 triangle (west)) \- see [SetPointStyle Command](https://geogebra.github.io/docs/manual/en/commands/SetPointStyle/) for the full list |
| void setPointSize(String objName, int size) | 3.2 | Sets the size of a point (from 1 to 9\) |
| void setDisplayStyle(String objName, String style) | 5.0 | Sets the display style of an object. Style should be one of "parametric", "explicit", "implicit", "specific" |
| void setFilling(String objName, double filling) | 3.2 | Sets the filling of an object (from 0 to 1\) |
| String getPNGBase64(double exportScale, boolean transparent, double DPI) | 4.0 | Returns the active Graphics View as a base64-encoded Stringeg var str \= ggbApplet.getPNGBase64(1, true, 72); The DPI setting is slow, set to `undefined` if you don’t need it |
| void exportSVG(String filename) or void exportSVG(function callback) | HTML5 | Renders the active Graphics View as an SVG and either downloads it as the given filename or sends it to the callback function The value is `null` if the active view is 3D `ggbApplet.exportSVG(svg => console.log("data:image/svg+xml;utf8," + encodeURIComponent(svg)));` For Classic 5 compatibility please use `ExportImage("type", "svg", "filename", "foo.svg")` inside materials |
| void exportPDF(double scale, String filename, String sliderLabel) or void exportPDF(double scale, function callback, String sliderLabel) | HTML5 | Renders the active Graphics View as a PDF and either downloads it as the given filename or sends it to the callback function `ggbApplet.exportPDF(1, pdf => console.log(pdf));` For Classic 5 compatibility please use `ExportImage("type", "pdf", "filename", "foo.pdf")` instead |
| void getScreenshotBase64(function callback) | 5.0 | Gets the screenshot of the whole applet as PNG and sends it to the callback function as a base64 encoded string. Example: `ggbApplet.getScreenshotBase64(function(url){window.open("data:image/png;base64,"+url);});`For internal use only, may not work in all browsers |
| boolean writePNGtoFile(String filename, double exportScale, boolean transparent, double DPI) | 4.0 | Exports the active Graphics View to a .PNG file. The DPI setting is slow, set to `undefined` if you don’t need it eg var success \= ggbApplet.writePNGtoFile("myImage.png", 1, false, 72); |
| boolean isIndependent(String objName) | 4.0 | checks if objName is independent |
| boolean isMoveable(String objName) | 4.0 | checks if objName is is moveable |
| void showAllObjects() | 5.0 | Changes bounds of the Graphics View so that all visible objects are on screen. |
| void registerEmbedResolver(String type, Function callback) | 6.0 | Adds a resolving function for specific embedded element type. The function gets an ID of the embed and returns a promise that resolves to a HTML string. |

### **Automatic Animation**

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void setAnimating(String objName, boolean animate) | 3.2 | Sets whether an object should be animated. This does not start the animation yet, use startAnimation() to do so. |
| void setAnimationSpeed(String objName, double speed) | 3.2 | Sets the animation speed of an object. |
| void startAnimation() | 3.2 | Starts automatic animation for all objects with the animating flag set, see setAnimating() |
| void stopAnimation() | 3.2 | Stops animation for all objects with the animating flag set, see setAnimating() |
| boolean isAnimationRunning() | 3.2 | Returns whether automatic animation is currently running. |

## Getting the state of objects

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| double getXcoord(String objName) | 2.7 | Returns the cartesian x-coord of the object with the given name. Note: returns 0 if the object is not a point or a vector. |
| double getYcoord(String objName) | 2.7 | Returns the cartesian y-coord of the object with the given name. Note: returns 0 if the object is not a point or a vector. |
| double getZcoord(String objName) | 5.0 | Returns the cartesian z-coord of the object with the given name. Note: returns 0 if the object is not a point or a vector. |
| double getValue(String objName) | 3.2 | Returns the double value of the object with the given name (e.g. length of segment, area of polygon). Note: returns 1 for a boolean object with value true. Otherwise 0 is returned. |
| double getListValue(String objName, Integer index) | 5.0 | Returns the double value of the object in the list (with the given name) with the given index. Note: returns 1 for a boolean object with value true. Otherwise 0 is returned. |
| String getColor(String objName) | 2.7 | Returns the color of the object with the given name as a hex string, e.g. "\#FF0000" for red. Note that the hex string always starts with \# and contains no lower case letters. |
| boolean getVisible(String objName) | 3.2 | Returns true or false depending on whether the object is visible in the Graphics View. Returns false if the object does not exist. |
| boolean getVisible(String objName, int view) | 4.2 | Returns true or false depending on whether the object is visible in Graphics View 'view' (1 or 2). Returns false if the object does not exist. |
| String getValueString(String objName \[, boolean useLocalizedInput \= true\]) | 2.7 | Returns the value of the object with the given name as a string. If useLocalizedInput is false, returns the command in English, otherwise in current GUI language. Note: Localized input uses parentheses, non-localized input uses brackets.For this method (and all others returning type String) it’s important to coerce it properly to a JavaScript string for compatibility with GeoGebra Classic 5 eg `var s = getValueString("text1") + "";` |
| String getDefinitionString(String objName) | 2.7 | Returns the description of the object with the given name as a string (in the currently selected language) |
| String getCommandString(String objName \[, boolean useLocalizedInput\]) | 5.0 | Returns the command of the object with the given name as a string. If useLocalizedInput is false, returns the command in English, otherwise in current GUI language. Note: Localized input uses parentheses, non-localized input uses brackets. |
| String getLaTeXString(String objName) | 5.0 | Returns the value of given object in LaTeX syntax |
| String getLaTeXBase64(String objName, boolean value) | 5.0 | Returns base64 encoded PNG picture containing the object as LaTeX. For value \= false the object is represented as the definition, for value=true the object value is used. |
| String getObjectType(String objName) | 2.7 | Returns the type of the given object as a string (like "point", "line", "circle", etc.). |
| boolean exists(String objName) | 2.7 | Returns whether an object with the given name exists in the construction. |
| boolean isDefined(String objName) | 2.7 | Returns whether the given object’s value is valid at the moment. |
| String \[\] getAllObjectNames(\[String type\]) | 2.7 | Returns an array with all object names in the construction. If type parameter is entered, only objects of given type are returned. |
| int getObjectNumber() | 3.0 | Returns the number of objects in the construction. |
| int getCASObjectNumber() | 3.0 | Returns the number of object (nonempty cells) in CAS. |
| String getObjectName(int i) | 3.0 | Returns the name of the n-th object of the construction. |
| String getLayer(String objName) | 3.2 | Returns the layer of the object. |
| int getLineStyle(String objName) | 3.2 | Gets the line style for the object (0 to 4\) |
| int getLineThickness(String objName) | 3.2 | Gets the thickness of the line (1 to 13\) |
| int getPointStyle(String objName) | 3.2 | Gets the style of points (-1 default, 0 filled circle, 1 circle, 2 cross, 3 plus, 4 filled diamond, 5 unfilled diamond, 6 triangle (north), 7 triangle (south), 8 triangle (east), 9 triangle (west)) |
| int getPointSize(String objName) | 3.2 | Gets the size of a point (from 1 to 9\) |
| double getFilling(String objName) | 3.2 | Gets the filling of an object (from 0 to 1\) |
| getCaption(String objectName, boolean substitutePlaceholders) | 5.0 | Returns the caption of the object. If the caption contains placeholders (%n, %v,…​), you can use the second parameter to specify whether you want to substitute them or not. |
| getLabelStyle(String objectName) | 5.0 | Returns label type for given object, see setLabelStyle for possible values. |
| getLabelVisible() | 5.0 |  |
| isInteractive(String objName) |  | Returns true, if the object with label objName is existing and the user can get to this object using TAB. |

## Construction / User Interface

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void setMode(int mode) | 2.7 | Sets the mouse mode (i.e. tool) for the graphics window (see [toolbar reference](https://geogebra.github.io/docs/reference/en/Toolbar/) and the [applet parameters](https://geogebra.github.io/docs/reference/en/GeoGebra_App_Parameters/) "showToolBar" and  "customToolBar" ) |
| int getMode() | 5.0 | Gets the mouse mode (i.e. tool), see [toolbar reference](https://geogebra.github.io/docs/reference/en/Toolbar/) for details |
| void openFile(String strURL) | 2.7 (Java only) | Opens a construction from a  file (given as absolute or relative URL string) |
| void reset() | 2.7 | Reloads the initial construction (given in filename parameter) of this applet. |
| void newConstruction() | 2.7 | Removes all construction objects |
| void refreshViews() | 2.7 | Refreshs all views. Note: this clears all traces in the graphics window. |
| void setOnTheFlyPointCreationActive(boolean flag) | 3.2 | Turns on the fly creation of points in graphics view on (true) or off (false). Note: this is useful if you don’t want tools to have the side effect of creating points. For example, when this flag is set to false, the tool "line through two points" will not create points on the fly when you click on the background of the graphics view. |
| void setPointCapture(view, mode) | 5.0 | Change point capturing mode. view: 1 for graphics, 2 for graphics 2, \-1 for 3D. mode: 0 for no capturing, 1 for snap to grid, 2 for fixed to grid, 3 for automatic. |
| void setRounding(string round) | 5.0 | The string consists of a number and flags, "s" flag for significant digits, "d" for decimal places (default). JavaScript integers are cast to string automaticlly. Example: "10s", "5", 3 |
| void hideCursorWhenDragging(boolean flag) | 3.2 | Hides (true) or shows (false) the mouse cursor (pointer) when dragging an object to change the construction. |
| void setRepaintingActive(boolean flag) | 2.7 | Turns the repainting of this applet on (true) or off (false). Note: use this method for efficient repainting when you invoke several methods. |
| void setErrorDialogsActive(boolean flag) | 3.0 | Turns showing of error dialogs on (true) or off (false). Note: this is especially useful together with evalCommand(). |
| void setCoordSystem(double xmin, double xmax, double ymin, double ymax) | 3.0 | Sets the Cartesian coordinate system of the graphics window. |
| void setCoordSystem(double xmin, double xmax, double ymin, double ymax, double zmin, double zmax, boolean yVertical) | 5.0 | Sets the Cartesian coordinate system of the 3D graphics window. The last parameter determines whether y-axis should be oriented vertically. |
| void setAxesVisible(boolean xAxis, boolean yAxis) | 3.0 | Shows or hides the x- and y-axis of the coordinate system in the graphics windows 1 and 2\. |
| void setAxesVisible(int viewNumber, boolean xAxis, boolean yAxis, boolean zAxis) | 5.0 | Shows or hides the x-, y- and z-axis of the coordinate system in given graphics window. |
| void setUndoPoint() | 3.2 | Sets an undo point. Useful if you want the user to be able to undo that action of evalCommand eg if you have made an HTML button to act as a custom tool \[EXAMPLE\] \==== `ggbApplet.setAxesVisible(3, false, true, true)` \==== |
| void setAxisLabels(int viewNumber, String xAxis, String yAxis, String zAxis) | 5.0 | Set label for the x-, y- and z-axis of the coordinate system in given graphics window. `ggbApplet.setAxisLabels(3,"larg","long","area")` |
| void setAxisSteps(int viewNumber, double xAxis, double yAxis, double zAxis) | 5.0 | Set distance for the x-, y- and z-axis of the coordinate system in given graphics window. `ggbApplet.setAxisSteps(3, 2,1,0.5)` |
| void setAxisUnits(int viewNumber, String xAxis, String yAxis, String zAxis) | 5.0 | Set units for the x-, y- and z-axis of the coordinate system in given graphics window. `ggbApplet.setAxisUnits(3, "cm","cm","cm²")` |
| void setGridVisible(boolean flag) | 3.0 | Shows or hides the coordinate grid in the graphics windows 1 and 2\. |
| void setGridVisible(int viewNumber, boolean flag) | 5.0 | Shows or hides the coordinate grid in given graphics view graphics window. |
| getGridVisible(int viewNumber) | 5.0 | Returns true if grid is visible in given view. If view number is omited, returns whether grid is visible in the first graphics view. |
| getPerspectiveXML() | 5.0 | Returns an XML representation of the current perspective. |
| undo() | 5.0 | Undoes one user action. |
| redo() | 5.0 | Redoes one user action. |
| showToolBar(boolean show) | HTML5 | Sets visibility of toolbar |
| setCustomToolBar(String toolbar) | 5.0 | Sets the layout of the main toolbar, see [toolbar reference](https://geogebra.github.io/docs/reference/en/Toolbar/) for details |
| addCustomTool(String iconURL, String name, String category, Function callback) | 6.0 (Notes only) | Adds a custom tool with given name and icon (https: or data: URL) to the Notes toolbox. The `callback` function is called when user selects the tool, it may show custom UI and/or use object creation APIs to create new objects. The `category` parameter may be one of `upload`, `link` or `more` and specifies in which category to show the new tool; if omitted, the `more` category is used. |
| showMenuBar(boolean show) | HTML5 | Sets visibility of menu bar |
| showAlgebraInput(boolean show) | HTML5 | Sets visibility of input bar |
| showResetIcon(boolean show) | HTML5 | Sets visibility of reset icon |
| enableRightClick(boolean enable) | 5.0 | Enables or disables right click features |
| enableLabelDrags(boolean enable) | 5.0 | Enables or disables dragging object labels |
| enableShiftDragZoom(boolean enable) | 5.0 | Enables or disables zooming and dragging the view using mouse or keyboard |
| enableCAS(boolean enable) | 5.0 | Enables or disables CAS features (both the view and commands) |
| enable3D(boolean enable) | 5.0 | Enables or disables the 3D view |
| void setPerspective(string perspective) | 5.0 | Changes the open views, see [SetPerspective Command](https://geogebra.github.io/docs/manual/en/commands/SetPerspective/) for the string interpretation. |
| setWidth(int width) | 5.0 (HTML5) | Change width of the applet (in pixels) |
| setHeight(int height) | 5.0 (HTML5) | Change height of the applet (in pixels) |
| setSize(int width, int height) | 5.0 (HTML5) | Change width and height of the applet (in pixels) |
| recalculateEnvironments() | 5.0 (HTML5) | Update the applet after scaling by external CSS |
| getEditorState() | 5.0 (HTML5) | Get state of the equation editor in algebra view (or in evaluator applet). Returns JSON object with `content` and optional fields (`caret` for graphing app, `eval` and `latex` for evaluator app) |
| setEditorState(Object state) | 5.0 (HTML5) | Set state of the equation editor in algebra view (or in evaluator applet). The argument should be a JSON (object or string) with `content` and optional `caret` field. |
| getGraphicsOptions(int viewId) | 5.0 (HTML5) | Get the graphics options for euclidian view specified by viewId. It returns a JSON (object or string) with `rightAngleStyle`, `pointCapturing`, `grid`, `gridIsBold`, `gridType`, `bgColor`, `gridColor`, `axesColor`, `axes`, `gridDistance` |
| setGraphicsOptions(int viewId, Object options) | 5.0 (HTML5) | Set the graphics options for euclidian view specified by viewId. The second argument should be a JSON (object or string) with optional fields with `rightAngleStyle`, `pointCapturing`, `grid`, `gridIsBold`, `gridType`, `bgColor`, `gridColor`, `axesColor`, `axes`, `gridDistance` |
| setAlgebraOptions(Object options) | 5.0 (HTML5) | Set the options for the algebra view. The argument should be a JSON (object or string) with field `sortBy` |
| getViewProperties(int viewID) | 6.0 | Returns properties of a view as JSON-encoded string. The object has several properties: `invXscale` and `invYscale` (number of graphics view units per pixel in x and y directions), `xMin` and `yMin` (minimal visible value on x-axis and y-axis respectively), `width` and `height` (size of the view in pixels), `left` and `top` (position of the view within the app frame). |

## Event listeners

With these methods you can implement Applet to JavaScript communication. For example, these methods can be used to:

* monitor user actions (see [Event listeners example](https://geogebra.github.io/integration/example-api-listeners.html))  
* communicate between two GeoGebra applets (see [two applets example](https://geogebra.github.io/integration/example-api-sync.html))

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void registerAddListener(JSFunction function) | 3.0 | Registers a JavaScript function as an add listener for the applet’s construction. Whenever a new object is created in the GeoGebraApplet’s construction, the JavaScript function is called using the name of the newly created object as its single argument. Example: First, register a listening JavaScript function: ggbApplet.registerAddListener(myAddListenerFunction); When an object "A" is created, the GeoGebra Applet will call the Javascript function myAddListenerFunction("A"); |
| void unregisterAddListener(JSFunction function) | 3.0 | Removes a previously registered add listener, see registerAddListener() |
| void registerRemoveListener(JSFunction function) | 3.0 | Registers a JavaScript function as a remove listener for the applet’s construction. Whenever an object is deleted from the GeoGebraApplet’s construction, the JavaScript function is called using the name of the deleted object as its single argument. Note: when a construction is cleared, remove is not called for every single object, see registerClearListener(). Example: First, register a listening JavaScript function: ggbApplet.registerRemoveListener(myRemoveListenerFunction); When the object "A" is deleted, the GeoGebra Applet will call the Javascript function myRemoveListenerFunction("A"); |
| void unregisterRemoveListener(JSFunction function) | 3.0 | Removes a previously registered remove listener, see registerRemoveListener() |
| void registerUpdateListener(JSFunction function) | 3.0 | Registers a JavaScript function as a update listener for the applet’s construction. Whenever any object is updated in the GeoGebraApplet’s construction, the JavaScript function is called using the name of the updated object as its single argument. Note: when you only want to listen for the updates of a single object use registerObjectUpdateListener() instead. Example: First, register a listening JavaScript function: ggbApplet.registerUpdateListener(myUpdateListenerFunction); When the object "A" is updated, the GeoGebra Applet will call the Javascript function myUpdateListenerFunction("A"); |
| void unregisterUpdateListener(JSFunction function) | 3.0 | Removes a previously registered update listener, see registerUpdateListener() |
| void registerClickListener(JSFunction function) | 5.0 | Registers a JavaScript function as a click listener for the applet’s construction. Whenever any object is clicked in the GeoGebraApplet’s construction, the JavaScript function is called using the name of the updated object as its single argument. Note: when you only want to listen for the updates of a single object use registerObjectClickListener() instead. |
| void unregisterClickListener(JSFunction function) | 3.0 | Removes a previously registered click listener, see registerClickListener() |
| void registerObjectUpdateListener(String objName, JSFunction function) | 3.0 | Registers a JavaScript function as an update listener for a single object. Whenever the object with the given name is updated, the JavaScript function is called using the name of the updated object as its single argument. If objName previously had a mapping JavaScript function, the old value is replaced. Note: all object updated listeners are unregistered when their object is removed or the construction is cleared, see registerRemoveListener() and registerClearListener(). Example: First, register a listening JavaScript function: ggbApplet.registerObjectUpdateListener("A", myAupdateListenerFunction); Whenever the object A is updated, the GeoGebra Applet will call the Javascript function myAupdateListenerFunction(); Note: an object update listener will still work after an object is renamed. |
| void unregisterObjectUpdateListener(String objName) | 3.0 | Removes a previously registered object update listener of the object with the given name, see registerObjectUpdateListener() |
| void registerObjectClickListener(String objName, JSFunction function) | 5.0 | Registers a JavaScript function as a click listener for a single object. Whenever the object with the given name is clicked, the JavaScript function is called using the name of the updated object as its single argument. If objName previously had a mapping JavaScript function, the old value is replaced. Note: all object click listeners are unregistered when their object is removed or the construction is cleared, see registerRemoveListener() and registerClearListener(). Example: First, register a listening JavaScript function: ggbApplet.registerObjectClickListener("A", myAclickListenerFunction); Whenever the object A is clicked, the GeoGebra Applet will call the Javascript function myAclickListenerFunction(); Note: an object click listener will still work after an object is renamed. |
| void unregisterObjectClickListener(String objName) | 5.0 | Removes a previously registered object click listener of the object with the given name, see registerObjectClickListener() |
| void registerRenameListener(JSFunction function) | 3.0 | Registers a JavaScript function as a rename listener for the applet’s construction. Whenever an object is renamed in the GeoGebraApplet’s construction, the JavaScript function is called using the old name and the new name of the renamed object as its two arguments. Example: First, register a listening JavaScript function: ggbApplet.registerRenameListener(myRenameListenerFunction); When an object "A" is renamed to "B", the GeoGebra Applet will call the Javascript function myRenameListenerFunction("A", "B"); |
| void unregisterRenameListener(String objName) | 3.0 | Removes a previously registered rename listener, see registerRenameListener() |
| void registerClearListener(JSFunction function) | 3.0 | Registers a JavaScript function as a clear listener for the applet’s construction. Whenever the construction in the GeoGebraApplet is cleared (i.e. all objects are removed), the JavaScript function is called using no arguments. Note: all update listeners are unregistered when a construction is cleared. See registerUpdateListener() and registerRemoveListener(). Example: First, register a listening JavaScript function: ggbApplet.registerClearListener(myClearListenerFunction); When the construction is cleared (i.e. after reseting a construction or opening a new construction file), the GeoGebra Applet will call the Javascript function myClearListenerFunction(); |
| void unregisterClearListener(JSFunction function) | 3.0 | Removes a previously registered clear listener, see *registerClearListener()* |
| void registerStoreUndoListener(JSFunction function) | 4.4 | Registers a listener that is called (with no arguments) every time an undo point is created. |
| void unregisterStoreUndoListener(JSFunction function) | 4.4 | Removes previously registered listener for storing undo points, see registerStoreUndoListener |
| void registerClientListener(JSFunction function) | 5.0 | Registers a JavaScript function as a generic listener for the applet’s construction. The listener receives events as JSON objects of the form `{type: "setMode", target:"", argument: "2"}` where `target` is the label of the construction element related to the event (if applicable), `argument` provides additional information based on the event type (e.g. the mode number for setMode event). Please refer to the list of client events below. |
| void unregisterClientListener(JSFunction function) | 5.0 | Removes previously registered client listener, see registerClientListener |

### **Client Events**

These events can be observed using the `registerClientListener` method

| Type | Attributes | Description |
| :---- | :---- | :---- |
| addMacro | `argument`: macro name | when new macro is added |
| addPolygon |  | polygon construction started |
| addPolygonComplete | `target`: polygon label | polygon construction finished |
| algebraPanelSelected |  | Graphing / Geometry apps: algebra tab selected in sidebar |
| deleteGeos |  | multiple objects deleted |
| deselect | `target`: object name (for single object) or null (deselect all) | one or all objects removed from selection |
| dragEnd |  | mouse drag ended |
| dropdownClosed | `target`: dropdown list name, `index` index of selected item (0 based) | dropdown list closed |
| dropdownItemFocused | `target`: dropdown list name, `index` index of focused item (0 based) | dropdown list item focused using mouse or keyboard |
| dropdownOpened | `target`: dropdown list name | dropdown list opened |
| editorKeyTyped |  | key typed in editor (Algebra view of any app or standalone Evaluator app) |
| editorStart | `target:` object label if editing existing object | user moves focus to the editor (Algebra view of any app or standalone Evaluator app) |
| editorStop | `target`: object label if editing existing object | user (Algebra view of any app or standalone Evaluator app) |
| export | `argument`: JSON encoded array including export format | export started |
| mouseDown | `x`: mouse x-coordinate, `y`: mouse y-coordinate | user pressed the mouse button |
| movedGeos | `argument`: object labels | multiple objects move ended |
| movingGeos | `argument`: object labels | multible objects are being moved |
| openDialog | `argument`: dialog ID | dialog is opened (currently just for export dialog) |
| openMenu | `argument`: submenu ID | main menu or one of its submenus were open |
| pasteElms | `argument`: pasted objects as XML | pasting multiple objects started |
| pasteElmsComplete |  | pasting multiple objects ended |
| perspectiveChange |  | perspective changed (e.g. a view was opened or closed) |
| redo |  | redo button pressed |
| relationTool | `argument`: HTML description of the object relation | relation tool used |
| removeMacro | `argument`: custom tool name | custom tool removed |
| renameComplete |  | object renaming complete (in case of chain renames) |
| renameMacro | `argument`: array \[old name, new name\] | custom tool was renamed |
| select | `target`: object label | object added to selection |
| setMode | `argument`: mode number (see toolbar reference for details) | app mode changed (e.g. a tool was selected) |
| showNavigationBar | `argument`: "true" or "false" | navigation bar visibility changed |
| showStyleBar | `argument`: "true" or "false" | style bar visibility changed |
| sidePanelClosed |  | side panel (where algebra view is in Graphing Calculator) closed |
| sidePanelOpened |  | side panel (where algebra view is in Graphing Calculator) opened |
| tablePanelSelected |  | table of values panel selected |
| toolsPanelSelected |  | tools panel selected |
| undo |  | undo pressed |
| updateStyle | `target`: object label | object style changed |
| viewChanged2D | `xZero`: horizontal pixel position of point (0,0), `yZero`: vertical pixel position of point (0,0), `xscale`: ratio pixels / horizontal units, `yscale`: ratio pixels / vertical units, `viewNo`: graphics view number (1 or 2\) | graphics view dimensions changed by zooming or panning |
| viewChanged3D | similar to 2D, e.g. `xZero: 0,yZero: 0,scale: 50,yscale: 50,viewNo: 512,zZero: -1.5,zscale: 50,xAngle: -40,zAngle: 24` | 3D view dimensions changed by zooming or panning |

## GeoGebra’s File format

With these methods you can set everything in a construction (see [XML Reference](https://geogebra.github.io/docs/reference/en/XML/) ).

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void evalXML(String xmlString) | 2.7 | Evaluates the given XML string and changes the current construction. Note: the construction is NOT cleared before evaluating the XML string. |
| void setXML(String xmlString) | 2.7 | Evaluates the given XML string and changes the current construction. Note: the construction is cleared before evaluating the XML string. This method could be used to load constructions. |
| String getXML() | 2.7 | Returns the current construction in GeoGebra’s XML format. This method could be used to save constructions. |
| String getXML(String objName) | 3.2 | Returns the GeoGebra XML string for the given object, i.e. only the \<element\> tag is returned. |
| String getAlgorithmXML(String objName) | 3.2 | For a dependent GeoElement objName the XML string of the parent algorithm and all its output objects is returned. For a free GeoElement objName "" is returned. |
| String getFileJSON() | 5.0 | Gets the current construction as JSON object including the XML and images |
| String setFileJSON(Object content) | 5.0 | Sets the current construction from a JSON (object or string) that includes XML and images (try getFileJSON for the precise format) |
| String getBase64() |  | Gets the current construction as a base64-encoded .ggb file |
| String getBase64(function callback) | 4.2 | Gets the current construction as a base64-encoded .ggb file asynchronously, passes as parameter to the callback function when ready. The callback function should take one parameter (the base64 string). |
| void setBase64(String \[, function callback\] ) | 4.0 | Sets the current construction from a base64-encoded .ggb file. If callback function is specified, it is called after the file is loaded. |

## Miscellaneous

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void debug(String string) | 3.2 | Prints the string to the Java Console |
| String getVersion() | 5.0 | Returns the version of GeoGebra |
| void remove() | 5.0 | Removes the applet and frees up memory |

### **Obtaining the API Object**

If you are loading GeoGebra using the `deployggb.js` script, you can access the api as an argument of `appletOnLoad`:  
`const ggb = new GGBApplet({`  
  `appletOnLoad(ggbApi) {`  
    `// ggbApi provides the applet API`  
  `}`  
`});`  
`ggb.inject(document.body);`  
For compatibility reasons the API objects can be also accessed via global variables. The name of the global variable is `ggbApplet` by default and can be overridden by the `id` parameter passed to `new GGBApplet(...)`. In case you have multiple GeoGebra apps on a page, `ggbApplet` always contains API of the last active one. In such case you should either avoid using global variables or use set the `id` parameter explicitly for all apps.

### **Obtaining the API Object as a module: The ES6 way**

You can use math-apps module now to inject the applet the ES6 way too  
`<script type="module">`  
    `import {mathApps} from 'https://www.geogebra.org/apps/web3d/web3d.nocache.mjs';`  
    `mathApps.create({'width':'800', 'height':'600',`  
        `'showAlgebraInput': 'true',`  
        `'material_id':'MJWHp9en'})`  
        `.inject(document.querySelector("#applet1"));`  
`</script>`  
`<div id="applet1"></div>`  
Example of using the API:  
`mathApps.create({'appName':'graphing'})`  
    `.inject(document.querySelector("#plot"))`  
    `.getAPI().then(api => api.evalCommand('f(x)=sin(x)'));`

# GeoGebra Apps API

This page describes the GeoGebra Apps API to interact with GeoGebra apps. Please see [GeoGebra Apps Embedding](https://geogebra.github.io/docs/reference/en/GeoGebra_Apps_Embedding/) on how to embed our apps into your web pages.

## Examples

In these examples you can see the GeoGebra Apps API in action:

* [Showing & hiding objects with buttons](https://geogebra.github.io/integration/example-api.html)  
* [Saving & loading state](https://geogebra.github.io/integration/example-api-save-state.html)  
* [Listening to update, add, remove events](https://geogebra.github.io/integration/example-api-listeners.html)

|  | Arguments in square brackets can be omitted. |
| :---- | :---- |

## Creating objects

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| boolean evalCommand(String cmdString) | 3.0 | Evaluates the given string just like it would be evaluated when entered into GeoGebra’s input bar. Returns whether command evaluation was successful. From GeoGebra 3.2 you can pass multiple commands at once by separating them with \\n. Note: you must use English commands names |
| boolean evalLaTex(String input) | 5.0 | Evaluates LaTeX string to a construction element. Basic syntaxes like `x^{2}` or `\frac` are supported. |
| String evalCommandGetLabels(String cmdString) | 5.0 | Like evalCommand(), but the return value is a String containing a comma-separated list of the labels of the created objects eg `"A,B,C"` |
| String evalCommandCAS(String string) | 3.2 | Passes the string to GeoGebra’s CAS and returns the result as a String. |
| void insertEmbed(String type, String uri) | 6.0 (Notes) | Inserts embedded element with specific type and URI. Type and URI are then used to obtain the HTML code for the embed element, see `registerEmbedResolver` |

## Setting the state of objects

### **General methods**

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void deleteObject(String objName) | 2.7 | Deletes the object with the given name. |
| void setAuxiliary(geo, true/false) | 5.0 | Affects or not the status of "auxiliary object" to object *geo*. |
| void setValue(String objName, double value) | 3.2 | Sets the double value of the object with the given name. Note: if the specified object is boolean, use a value of 1 to set it to true and any other value to set it to false. For any other object type, nothing is done. |
| void setTextValue(String objName, String value) | 3.2 | Sets the text value of the object with the given name. For any other object type, nothing is done. |
| void setListValue(String objName, int i, double value) | 5.0 | Sets the value of the list element at position 'i' to 'value' |
| void setCoords(String objName, double x, double y)void setCoords(String objName, double x, double y, double z) | 3.05.0 | Sets the coordinates of the object with the given name. Note: if the specified object is not a point, vector, line or absolutely positioned object (text, button, checkbox, input box) nothing is done. |
| void setCaption(String objName, String caption) | 5.0 | Sets the caption of object with given name. |
| void setColor(String objName, int red, int green, int blue) | 2.7 | Sets the color of the object with the given name. |
| void setVisible(String objName, boolean visible) | 2.7 | Shows or hides the object with the given name in the graphics window. |
| void setLabelVisible(String objName, boolean visible) | 3.0 | Shows or hides the label of the object with the given name in the graphics window. |
| void setLabelStyle(String objName, int style) | 3.0 | Sets the label style of the object with the given name in the graphics window. Possible label styles are NAME \= 0, NAME\_VALUE \= 1, VALUE \= 2 and (from GeoGebra 3.2) CAPTION \= 3 |
| void setFixed(String objName, boolean fixed, boolean selectionAllowed) | 3.0 | Sets the "Fixed" and "Selection Allowed" state of the object with the given name. Note: fixed objects cannot be changed. |
| void setTrace(String objName, boolean flag) | 3.0 | Turns the trace of the object with the given name on or off. |
| boolean renameObject(String oldObjName, String newObjName) | 3.2 | Renames oldObjName to newObjName. Returns whether the rename was successful |
| void setLayer(String objName, int layer) | 3.2 | Sets the layer of the object |
| void setLayerVisible(int layer, boolean visible) | 3.2 | Shows or hides the all objects in the given layer |
| void setLineStyle(String objName, int style) | 3.2 | Sets the line style for the object (0 to 4\) |
| void setLineThickness(String objName, int thickness) | 3.2 | sets the thickness of the object (1 to 13, \-1 for default) |
| void setPointStyle(String objName, int style) | 3.2 | Sets the style of points (-1 default, 0 filled circle, 1 cross, 2 circle, 3 plus, 4 filled diamond, 5 unfilled diamond, 6 triangle (north), 7 triangle (south), 8 triangle (east), 9 triangle (west)) \- see [SetPointStyle Command](https://geogebra.github.io/docs/manual/en/commands/SetPointStyle/) for the full list |
| void setPointSize(String objName, int size) | 3.2 | Sets the size of a point (from 1 to 9\) |
| void setDisplayStyle(String objName, String style) | 5.0 | Sets the display style of an object. Style should be one of "parametric", "explicit", "implicit", "specific" |
| void setFilling(String objName, double filling) | 3.2 | Sets the filling of an object (from 0 to 1\) |
| String getPNGBase64(double exportScale, boolean transparent, double DPI) | 4.0 | Returns the active Graphics View as a base64-encoded Stringeg var str \= ggbApplet.getPNGBase64(1, true, 72); The DPI setting is slow, set to `undefined` if you don’t need it |
| void exportSVG(String filename) or void exportSVG(function callback) | HTML5 | Renders the active Graphics View as an SVG and either downloads it as the given filename or sends it to the callback function The value is `null` if the active view is 3D `ggbApplet.exportSVG(svg => console.log("data:image/svg+xml;utf8," + encodeURIComponent(svg)));` For Classic 5 compatibility please use `ExportImage("type", "svg", "filename", "foo.svg")` inside materials |
| void exportPDF(double scale, String filename, String sliderLabel) or void exportPDF(double scale, function callback, String sliderLabel) | HTML5 | Renders the active Graphics View as a PDF and either downloads it as the given filename or sends it to the callback function `ggbApplet.exportPDF(1, pdf => console.log(pdf));` For Classic 5 compatibility please use `ExportImage("type", "pdf", "filename", "foo.pdf")` instead |
| void getScreenshotBase64(function callback) | 5.0 | Gets the screenshot of the whole applet as PNG and sends it to the callback function as a base64 encoded string. Example: `ggbApplet.getScreenshotBase64(function(url){window.open("data:image/png;base64,"+url);});`For internal use only, may not work in all browsers |
| boolean writePNGtoFile(String filename, double exportScale, boolean transparent, double DPI) | 4.0 | Exports the active Graphics View to a .PNG file. The DPI setting is slow, set to `undefined` if you don’t need it eg var success \= ggbApplet.writePNGtoFile("myImage.png", 1, false, 72); |
| boolean isIndependent(String objName) | 4.0 | checks if objName is independent |
| boolean isMoveable(String objName) | 4.0 | checks if objName is is moveable |
| void showAllObjects() | 5.0 | Changes bounds of the Graphics View so that all visible objects are on screen. |
| void registerEmbedResolver(String type, Function callback) | 6.0 | Adds a resolving function for specific embedded element type. The function gets an ID of the embed and returns a promise that resolves to a HTML string. |

### **Automatic Animation**

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void setAnimating(String objName, boolean animate) | 3.2 | Sets whether an object should be animated. This does not start the animation yet, use startAnimation() to do so. |
| void setAnimationSpeed(String objName, double speed) | 3.2 | Sets the animation speed of an object. |
| void startAnimation() | 3.2 | Starts automatic animation for all objects with the animating flag set, see setAnimating() |
| void stopAnimation() | 3.2 | Stops animation for all objects with the animating flag set, see setAnimating() |
| boolean isAnimationRunning() | 3.2 | Returns whether automatic animation is currently running. |

## Getting the state of objects

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| double getXcoord(String objName) | 2.7 | Returns the cartesian x-coord of the object with the given name. Note: returns 0 if the object is not a point or a vector. |
| double getYcoord(String objName) | 2.7 | Returns the cartesian y-coord of the object with the given name. Note: returns 0 if the object is not a point or a vector. |
| double getZcoord(String objName) | 5.0 | Returns the cartesian z-coord of the object with the given name. Note: returns 0 if the object is not a point or a vector. |
| double getValue(String objName) | 3.2 | Returns the double value of the object with the given name (e.g. length of segment, area of polygon). Note: returns 1 for a boolean object with value true. Otherwise 0 is returned. |
| double getListValue(String objName, Integer index) | 5.0 | Returns the double value of the object in the list (with the given name) with the given index. Note: returns 1 for a boolean object with value true. Otherwise 0 is returned. |
| String getColor(String objName) | 2.7 | Returns the color of the object with the given name as a hex string, e.g. "\#FF0000" for red. Note that the hex string always starts with \# and contains no lower case letters. |
| boolean getVisible(String objName) | 3.2 | Returns true or false depending on whether the object is visible in the Graphics View. Returns false if the object does not exist. |
| boolean getVisible(String objName, int view) | 4.2 | Returns true or false depending on whether the object is visible in Graphics View 'view' (1 or 2). Returns false if the object does not exist. |
| String getValueString(String objName \[, boolean useLocalizedInput \= true\]) | 2.7 | Returns the value of the object with the given name as a string. If useLocalizedInput is false, returns the command in English, otherwise in current GUI language. Note: Localized input uses parentheses, non-localized input uses brackets.For this method (and all others returning type String) it’s important to coerce it properly to a JavaScript string for compatibility with GeoGebra Classic 5 eg `var s = getValueString("text1") + "";` |
| String getDefinitionString(String objName) | 2.7 | Returns the description of the object with the given name as a string (in the currently selected language) |
| String getCommandString(String objName \[, boolean useLocalizedInput\]) | 5.0 | Returns the command of the object with the given name as a string. If useLocalizedInput is false, returns the command in English, otherwise in current GUI language. Note: Localized input uses parentheses, non-localized input uses brackets. |
| String getLaTeXString(String objName) | 5.0 | Returns the value of given object in LaTeX syntax |
| String getLaTeXBase64(String objName, boolean value) | 5.0 | Returns base64 encoded PNG picture containing the object as LaTeX. For value \= false the object is represented as the definition, for value=true the object value is used. |
| String getObjectType(String objName) | 2.7 | Returns the type of the given object as a string (like "point", "line", "circle", etc.). |
| boolean exists(String objName) | 2.7 | Returns whether an object with the given name exists in the construction. |
| boolean isDefined(String objName) | 2.7 | Returns whether the given object’s value is valid at the moment. |
| String \[\] getAllObjectNames(\[String type\]) | 2.7 | Returns an array with all object names in the construction. If type parameter is entered, only objects of given type are returned. |
| int getObjectNumber() | 3.0 | Returns the number of objects in the construction. |
| int getCASObjectNumber() | 3.0 | Returns the number of object (nonempty cells) in CAS. |
| String getObjectName(int i) | 3.0 | Returns the name of the n-th object of the construction. |
| String getLayer(String objName) | 3.2 | Returns the layer of the object. |
| int getLineStyle(String objName) | 3.2 | Gets the line style for the object (0 to 4\) |
| int getLineThickness(String objName) | 3.2 | Gets the thickness of the line (1 to 13\) |
| int getPointStyle(String objName) | 3.2 | Gets the style of points (-1 default, 0 filled circle, 1 circle, 2 cross, 3 plus, 4 filled diamond, 5 unfilled diamond, 6 triangle (north), 7 triangle (south), 8 triangle (east), 9 triangle (west)) |
| int getPointSize(String objName) | 3.2 | Gets the size of a point (from 1 to 9\) |
| double getFilling(String objName) | 3.2 | Gets the filling of an object (from 0 to 1\) |
| getCaption(String objectName, boolean substitutePlaceholders) | 5.0 | Returns the caption of the object. If the caption contains placeholders (%n, %v,…​), you can use the second parameter to specify whether you want to substitute them or not. |
| getLabelStyle(String objectName) | 5.0 | Returns label type for given object, see setLabelStyle for possible values. |
| getLabelVisible() | 5.0 |  |
| isInteractive(String objName) |  | Returns true, if the object with label objName is existing and the user can get to this object using TAB. |

## Construction / User Interface

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void setMode(int mode) | 2.7 | Sets the mouse mode (i.e. tool) for the graphics window (see [toolbar reference](https://geogebra.github.io/docs/reference/en/Toolbar/) and the [applet parameters](https://geogebra.github.io/docs/reference/en/GeoGebra_App_Parameters/) "showToolBar" and  "customToolBar" ) |
| int getMode() | 5.0 | Gets the mouse mode (i.e. tool), see [toolbar reference](https://geogebra.github.io/docs/reference/en/Toolbar/) for details |
| void openFile(String strURL) | 2.7 (Java only) | Opens a construction from a  file (given as absolute or relative URL string) |
| void reset() | 2.7 | Reloads the initial construction (given in filename parameter) of this applet. |
| void newConstruction() | 2.7 | Removes all construction objects |
| void refreshViews() | 2.7 | Refreshs all views. Note: this clears all traces in the graphics window. |
| void setOnTheFlyPointCreationActive(boolean flag) | 3.2 | Turns on the fly creation of points in graphics view on (true) or off (false). Note: this is useful if you don’t want tools to have the side effect of creating points. For example, when this flag is set to false, the tool "line through two points" will not create points on the fly when you click on the background of the graphics view. |
| void setPointCapture(view, mode) | 5.0 | Change point capturing mode. view: 1 for graphics, 2 for graphics 2, \-1 for 3D. mode: 0 for no capturing, 1 for snap to grid, 2 for fixed to grid, 3 for automatic. |
| void setRounding(string round) | 5.0 | The string consists of a number and flags, "s" flag for significant digits, "d" for decimal places (default). JavaScript integers are cast to string automaticlly. Example: "10s", "5", 3 |
| void hideCursorWhenDragging(boolean flag) | 3.2 | Hides (true) or shows (false) the mouse cursor (pointer) when dragging an object to change the construction. |
| void setRepaintingActive(boolean flag) | 2.7 | Turns the repainting of this applet on (true) or off (false). Note: use this method for efficient repainting when you invoke several methods. |
| void setErrorDialogsActive(boolean flag) | 3.0 | Turns showing of error dialogs on (true) or off (false). Note: this is especially useful together with evalCommand(). |
| void setCoordSystem(double xmin, double xmax, double ymin, double ymax) | 3.0 | Sets the Cartesian coordinate system of the graphics window. |
| void setCoordSystem(double xmin, double xmax, double ymin, double ymax, double zmin, double zmax, boolean yVertical) | 5.0 | Sets the Cartesian coordinate system of the 3D graphics window. The last parameter determines whether y-axis should be oriented vertically. |
| void setAxesVisible(boolean xAxis, boolean yAxis) | 3.0 | Shows or hides the x- and y-axis of the coordinate system in the graphics windows 1 and 2\. |
| void setAxesVisible(int viewNumber, boolean xAxis, boolean yAxis, boolean zAxis) | 5.0 | Shows or hides the x-, y- and z-axis of the coordinate system in given graphics window. |
| void setUndoPoint() | 3.2 | Sets an undo point. Useful if you want the user to be able to undo that action of evalCommand eg if you have made an HTML button to act as a custom tool \[EXAMPLE\] \==== `ggbApplet.setAxesVisible(3, false, true, true)` \==== |
| void setAxisLabels(int viewNumber, String xAxis, String yAxis, String zAxis) | 5.0 | Set label for the x-, y- and z-axis of the coordinate system in given graphics window. `ggbApplet.setAxisLabels(3,"larg","long","area")` |
| void setAxisSteps(int viewNumber, double xAxis, double yAxis, double zAxis) | 5.0 | Set distance for the x-, y- and z-axis of the coordinate system in given graphics window. `ggbApplet.setAxisSteps(3, 2,1,0.5)` |
| void setAxisUnits(int viewNumber, String xAxis, String yAxis, String zAxis) | 5.0 | Set units for the x-, y- and z-axis of the coordinate system in given graphics window. `ggbApplet.setAxisUnits(3, "cm","cm","cm²")` |
| void setGridVisible(boolean flag) | 3.0 | Shows or hides the coordinate grid in the graphics windows 1 and 2\. |
| void setGridVisible(int viewNumber, boolean flag) | 5.0 | Shows or hides the coordinate grid in given graphics view graphics window. |
| getGridVisible(int viewNumber) | 5.0 | Returns true if grid is visible in given view. If view number is omited, returns whether grid is visible in the first graphics view. |
| getPerspectiveXML() | 5.0 | Returns an XML representation of the current perspective. |
| undo() | 5.0 | Undoes one user action. |
| redo() | 5.0 | Redoes one user action. |
| showToolBar(boolean show) | HTML5 | Sets visibility of toolbar |
| setCustomToolBar(String toolbar) | 5.0 | Sets the layout of the main toolbar, see [toolbar reference](https://geogebra.github.io/docs/reference/en/Toolbar/) for details |
| addCustomTool(String iconURL, String name, String category, Function callback) | 6.0 (Notes only) | Adds a custom tool with given name and icon (https: or data: URL) to the Notes toolbox. The `callback` function is called when user selects the tool, it may show custom UI and/or use object creation APIs to create new objects. The `category` parameter may be one of `upload`, `link` or `more` and specifies in which category to show the new tool; if omitted, the `more` category is used. |
| showMenuBar(boolean show) | HTML5 | Sets visibility of menu bar |
| showAlgebraInput(boolean show) | HTML5 | Sets visibility of input bar |
| showResetIcon(boolean show) | HTML5 | Sets visibility of reset icon |
| enableRightClick(boolean enable) | 5.0 | Enables or disables right click features |
| enableLabelDrags(boolean enable) | 5.0 | Enables or disables dragging object labels |
| enableShiftDragZoom(boolean enable) | 5.0 | Enables or disables zooming and dragging the view using mouse or keyboard |
| enableCAS(boolean enable) | 5.0 | Enables or disables CAS features (both the view and commands) |
| enable3D(boolean enable) | 5.0 | Enables or disables the 3D view |
| void setPerspective(string perspective) | 5.0 | Changes the open views, see [SetPerspective Command](https://geogebra.github.io/docs/manual/en/commands/SetPerspective/) for the string interpretation. |
| setWidth(int width) | 5.0 (HTML5) | Change width of the applet (in pixels) |
| setHeight(int height) | 5.0 (HTML5) | Change height of the applet (in pixels) |
| setSize(int width, int height) | 5.0 (HTML5) | Change width and height of the applet (in pixels) |
| recalculateEnvironments() | 5.0 (HTML5) | Update the applet after scaling by external CSS |
| getEditorState() | 5.0 (HTML5) | Get state of the equation editor in algebra view (or in evaluator applet). Returns JSON object with `content` and optional fields (`caret` for graphing app, `eval` and `latex` for evaluator app) |
| setEditorState(Object state) | 5.0 (HTML5) | Set state of the equation editor in algebra view (or in evaluator applet). The argument should be a JSON (object or string) with `content` and optional `caret` field. |
| getGraphicsOptions(int viewId) | 5.0 (HTML5) | Get the graphics options for euclidian view specified by viewId. It returns a JSON (object or string) with `rightAngleStyle`, `pointCapturing`, `grid`, `gridIsBold`, `gridType`, `bgColor`, `gridColor`, `axesColor`, `axes`, `gridDistance` |
| setGraphicsOptions(int viewId, Object options) | 5.0 (HTML5) | Set the graphics options for euclidian view specified by viewId. The second argument should be a JSON (object or string) with optional fields with `rightAngleStyle`, `pointCapturing`, `grid`, `gridIsBold`, `gridType`, `bgColor`, `gridColor`, `axesColor`, `axes`, `gridDistance` |
| setAlgebraOptions(Object options) | 5.0 (HTML5) | Set the options for the algebra view. The argument should be a JSON (object or string) with field `sortBy` |
| getViewProperties(int viewID) | 6.0 | Returns properties of a view as JSON-encoded string. The object has several properties: `invXscale` and `invYscale` (number of graphics view units per pixel in x and y directions), `xMin` and `yMin` (minimal visible value on x-axis and y-axis respectively), `width` and `height` (size of the view in pixels), `left` and `top` (position of the view within the app frame). |

## Event listeners

With these methods you can implement Applet to JavaScript communication. For example, these methods can be used to:

* monitor user actions (see [Event listeners example](https://geogebra.github.io/integration/example-api-listeners.html))  
* communicate between two GeoGebra applets (see [two applets example](https://geogebra.github.io/integration/example-api-sync.html))

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void registerAddListener(JSFunction function) | 3.0 | Registers a JavaScript function as an add listener for the applet’s construction. Whenever a new object is created in the GeoGebraApplet’s construction, the JavaScript function is called using the name of the newly created object as its single argument. Example: First, register a listening JavaScript function: ggbApplet.registerAddListener(myAddListenerFunction); When an object "A" is created, the GeoGebra Applet will call the Javascript function myAddListenerFunction("A"); |
| void unregisterAddListener(JSFunction function) | 3.0 | Removes a previously registered add listener, see registerAddListener() |
| void registerRemoveListener(JSFunction function) | 3.0 | Registers a JavaScript function as a remove listener for the applet’s construction. Whenever an object is deleted from the GeoGebraApplet’s construction, the JavaScript function is called using the name of the deleted object as its single argument. Note: when a construction is cleared, remove is not called for every single object, see registerClearListener(). Example: First, register a listening JavaScript function: ggbApplet.registerRemoveListener(myRemoveListenerFunction); When the object "A" is deleted, the GeoGebra Applet will call the Javascript function myRemoveListenerFunction("A"); |
| void unregisterRemoveListener(JSFunction function) | 3.0 | Removes a previously registered remove listener, see registerRemoveListener() |
| void registerUpdateListener(JSFunction function) | 3.0 | Registers a JavaScript function as a update listener for the applet’s construction. Whenever any object is updated in the GeoGebraApplet’s construction, the JavaScript function is called using the name of the updated object as its single argument. Note: when you only want to listen for the updates of a single object use registerObjectUpdateListener() instead. Example: First, register a listening JavaScript function: ggbApplet.registerUpdateListener(myUpdateListenerFunction); When the object "A" is updated, the GeoGebra Applet will call the Javascript function myUpdateListenerFunction("A"); |
| void unregisterUpdateListener(JSFunction function) | 3.0 | Removes a previously registered update listener, see registerUpdateListener() |
| void registerClickListener(JSFunction function) | 5.0 | Registers a JavaScript function as a click listener for the applet’s construction. Whenever any object is clicked in the GeoGebraApplet’s construction, the JavaScript function is called using the name of the updated object as its single argument. Note: when you only want to listen for the updates of a single object use registerObjectClickListener() instead. |
| void unregisterClickListener(JSFunction function) | 3.0 | Removes a previously registered click listener, see registerClickListener() |
| void registerObjectUpdateListener(String objName, JSFunction function) | 3.0 | Registers a JavaScript function as an update listener for a single object. Whenever the object with the given name is updated, the JavaScript function is called using the name of the updated object as its single argument. If objName previously had a mapping JavaScript function, the old value is replaced. Note: all object updated listeners are unregistered when their object is removed or the construction is cleared, see registerRemoveListener() and registerClearListener(). Example: First, register a listening JavaScript function: ggbApplet.registerObjectUpdateListener("A", myAupdateListenerFunction); Whenever the object A is updated, the GeoGebra Applet will call the Javascript function myAupdateListenerFunction(); Note: an object update listener will still work after an object is renamed. |
| void unregisterObjectUpdateListener(String objName) | 3.0 | Removes a previously registered object update listener of the object with the given name, see registerObjectUpdateListener() |
| void registerObjectClickListener(String objName, JSFunction function) | 5.0 | Registers a JavaScript function as a click listener for a single object. Whenever the object with the given name is clicked, the JavaScript function is called using the name of the updated object as its single argument. If objName previously had a mapping JavaScript function, the old value is replaced. Note: all object click listeners are unregistered when their object is removed or the construction is cleared, see registerRemoveListener() and registerClearListener(). Example: First, register a listening JavaScript function: ggbApplet.registerObjectClickListener("A", myAclickListenerFunction); Whenever the object A is clicked, the GeoGebra Applet will call the Javascript function myAclickListenerFunction(); Note: an object click listener will still work after an object is renamed. |
| void unregisterObjectClickListener(String objName) | 5.0 | Removes a previously registered object click listener of the object with the given name, see registerObjectClickListener() |
| void registerRenameListener(JSFunction function) | 3.0 | Registers a JavaScript function as a rename listener for the applet’s construction. Whenever an object is renamed in the GeoGebraApplet’s construction, the JavaScript function is called using the old name and the new name of the renamed object as its two arguments. Example: First, register a listening JavaScript function: ggbApplet.registerRenameListener(myRenameListenerFunction); When an object "A" is renamed to "B", the GeoGebra Applet will call the Javascript function myRenameListenerFunction("A", "B"); |
| void unregisterRenameListener(String objName) | 3.0 | Removes a previously registered rename listener, see registerRenameListener() |
| void registerClearListener(JSFunction function) | 3.0 | Registers a JavaScript function as a clear listener for the applet’s construction. Whenever the construction in the GeoGebraApplet is cleared (i.e. all objects are removed), the JavaScript function is called using no arguments. Note: all update listeners are unregistered when a construction is cleared. See registerUpdateListener() and registerRemoveListener(). Example: First, register a listening JavaScript function: ggbApplet.registerClearListener(myClearListenerFunction); When the construction is cleared (i.e. after reseting a construction or opening a new construction file), the GeoGebra Applet will call the Javascript function myClearListenerFunction(); |
| void unregisterClearListener(JSFunction function) | 3.0 | Removes a previously registered clear listener, see *registerClearListener()* |
| void registerStoreUndoListener(JSFunction function) | 4.4 | Registers a listener that is called (with no arguments) every time an undo point is created. |
| void unregisterStoreUndoListener(JSFunction function) | 4.4 | Removes previously registered listener for storing undo points, see registerStoreUndoListener |
| void registerClientListener(JSFunction function) | 5.0 | Registers a JavaScript function as a generic listener for the applet’s construction. The listener receives events as JSON objects of the form `{type: "setMode", target:"", argument: "2"}` where `target` is the label of the construction element related to the event (if applicable), `argument` provides additional information based on the event type (e.g. the mode number for setMode event). Please refer to the list of client events below. |
| void unregisterClientListener(JSFunction function) | 5.0 | Removes previously registered client listener, see registerClientListener |

### **Client Events**

These events can be observed using the `registerClientListener` method

| Type | Attributes | Description |
| :---- | :---- | :---- |
| addMacro | `argument`: macro name | when new macro is added |
| addPolygon |  | polygon construction started |
| addPolygonComplete | `target`: polygon label | polygon construction finished |
| algebraPanelSelected |  | Graphing / Geometry apps: algebra tab selected in sidebar |
| deleteGeos |  | multiple objects deleted |
| deselect | `target`: object name (for single object) or null (deselect all) | one or all objects removed from selection |
| dragEnd |  | mouse drag ended |
| dropdownClosed | `target`: dropdown list name, `index` index of selected item (0 based) | dropdown list closed |
| dropdownItemFocused | `target`: dropdown list name, `index` index of focused item (0 based) | dropdown list item focused using mouse or keyboard |
| dropdownOpened | `target`: dropdown list name | dropdown list opened |
| editorKeyTyped |  | key typed in editor (Algebra view of any app or standalone Evaluator app) |
| editorStart | `target:` object label if editing existing object | user moves focus to the editor (Algebra view of any app or standalone Evaluator app) |
| editorStop | `target`: object label if editing existing object | user (Algebra view of any app or standalone Evaluator app) |
| export | `argument`: JSON encoded array including export format | export started |
| mouseDown | `x`: mouse x-coordinate, `y`: mouse y-coordinate | user pressed the mouse button |
| movedGeos | `argument`: object labels | multiple objects move ended |
| movingGeos | `argument`: object labels | multible objects are being moved |
| openDialog | `argument`: dialog ID | dialog is opened (currently just for export dialog) |
| openMenu | `argument`: submenu ID | main menu or one of its submenus were open |
| pasteElms | `argument`: pasted objects as XML | pasting multiple objects started |
| pasteElmsComplete |  | pasting multiple objects ended |
| perspectiveChange |  | perspective changed (e.g. a view was opened or closed) |
| redo |  | redo button pressed |
| relationTool | `argument`: HTML description of the object relation | relation tool used |
| removeMacro | `argument`: custom tool name | custom tool removed |
| renameComplete |  | object renaming complete (in case of chain renames) |
| renameMacro | `argument`: array \[old name, new name\] | custom tool was renamed |
| select | `target`: object label | object added to selection |
| setMode | `argument`: mode number (see toolbar reference for details) | app mode changed (e.g. a tool was selected) |
| showNavigationBar | `argument`: "true" or "false" | navigation bar visibility changed |
| showStyleBar | `argument`: "true" or "false" | style bar visibility changed |
| sidePanelClosed |  | side panel (where algebra view is in Graphing Calculator) closed |
| sidePanelOpened |  | side panel (where algebra view is in Graphing Calculator) opened |
| tablePanelSelected |  | table of values panel selected |
| toolsPanelSelected |  | tools panel selected |
| undo |  | undo pressed |
| updateStyle | `target`: object label | object style changed |
| viewChanged2D | `xZero`: horizontal pixel position of point (0,0), `yZero`: vertical pixel position of point (0,0), `xscale`: ratio pixels / horizontal units, `yscale`: ratio pixels / vertical units, `viewNo`: graphics view number (1 or 2\) | graphics view dimensions changed by zooming or panning |
| viewChanged3D | similar to 2D, e.g. `xZero: 0,yZero: 0,scale: 50,yscale: 50,viewNo: 512,zZero: -1.5,zscale: 50,xAngle: -40,zAngle: 24` | 3D view dimensions changed by zooming or panning |

## GeoGebra’s File format

With these methods you can set everything in a construction (see [XML Reference](https://geogebra.github.io/docs/reference/en/XML/) ).

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void evalXML(String xmlString) | 2.7 | Evaluates the given XML string and changes the current construction. Note: the construction is NOT cleared before evaluating the XML string. |
| void setXML(String xmlString) | 2.7 | Evaluates the given XML string and changes the current construction. Note: the construction is cleared before evaluating the XML string. This method could be used to load constructions. |
| String getXML() | 2.7 | Returns the current construction in GeoGebra’s XML format. This method could be used to save constructions. |
| String getXML(String objName) | 3.2 | Returns the GeoGebra XML string for the given object, i.e. only the \<element\> tag is returned. |
| String getAlgorithmXML(String objName) | 3.2 | For a dependent GeoElement objName the XML string of the parent algorithm and all its output objects is returned. For a free GeoElement objName "" is returned. |
| String getFileJSON() | 5.0 | Gets the current construction as JSON object including the XML and images |
| String setFileJSON(Object content) | 5.0 | Sets the current construction from a JSON (object or string) that includes XML and images (try getFileJSON for the precise format) |
| String getBase64() |  | Gets the current construction as a base64-encoded .ggb file |
| String getBase64(function callback) | 4.2 | Gets the current construction as a base64-encoded .ggb file asynchronously, passes as parameter to the callback function when ready. The callback function should take one parameter (the base64 string). |
| void setBase64(String \[, function callback\] ) | 4.0 | Sets the current construction from a base64-encoded .ggb file. If callback function is specified, it is called after the file is loaded. |

## Miscellaneous

| Method Signature | Since | Description |
| :---- | :---: | :---- |
| void debug(String string) | 3.2 | Prints the string to the Java Console |
| String getVersion() | 5.0 | Returns the version of GeoGebra |
| void remove() | 5.0 | Removes the applet and frees up memory |

### **Obtaining the API Object**

If you are loading GeoGebra using the `deployggb.js` script, you can access the api as an argument of `appletOnLoad`:  
`const ggb = new GGBApplet({`  
  `appletOnLoad(ggbApi) {`  
    `// ggbApi provides the applet API`  
  `}`  
`});`  
`ggb.inject(document.body);`  
For compatibility reasons the API objects can be also accessed via global variables. The name of the global variable is `ggbApplet` by default and can be overridden by the `id` parameter passed to `new GGBApplet(...)`. In case you have multiple GeoGebra apps on a page, `ggbApplet` always contains API of the last active one. In such case you should either avoid using global variables or use set the `id` parameter explicitly for all apps.

### **Obtaining the API Object as a module: The ES6 way**

You can use math-apps module now to inject the applet the ES6 way too  
`<script type="module">`  
    `import {mathApps} from 'https://www.geogebra.org/apps/web3d/web3d.nocache.mjs';`  
    `mathApps.create({'width':'800', 'height':'600',`  
        `'showAlgebraInput': 'true',`  
        `'material_id':'MJWHp9en'})`  
        `.inject(document.querySelector("#applet1"));`  
`</script>`  
`<div id="applet1"></div>`  
Example of using the API:  
`mathApps.create({'appName':'graphing'})`  
    `.inject(document.querySelector("#plot"))`  
    `.getAPI().then(api => api.evalCommand('f(x)=sin(x)'));`

# File Format

## Accessing GeoGebra files

A GeoGebra file is ending with `.ggb` (GeoGebra worksheet) or `.ggt` (GeoGebra tool), which are both just renamed `.zip` files. You can easily open them with a ZIP program of your choice by renaming them to .zip and open them as you would open any `.zip` file.

## Contents

### **.ggb \- GeoGebra Worksheet**

The `.ggb` file is the standard way to save GeoGebra worksheets. As stated above this file is just a renamed `.zip` file. If you rename your `.ggb` to `.zip` you will find the following files after unzipping:

#### **geogebra.xml**

This is the file in which all the information about the construction is stored, the information is stored in [XML](http://en.wikipedia.org/wiki/Xml). For more information about the contents and structure of this file see the [XML reference](https://geogebra.github.io/docs/reference/en/XML/).

#### **geogebra\_thumbnail.png**

This image contains a small preview image of the construction saved in the `geogebra.xml`. GeoGebra itself uses this image for the preview of GeoGebra files in the "Open.." and "Save As.." Dialog. This thumbnail could also be used to display previews of GeoGebra files within the operating systems file explorer or could be used by online systems or any other kind of software to display previews of uploaded GeoGebra files.

### **geogebra.js**

This file contains global JavaScript definitions used in the file. See [Scripting](https://geogebra.github.io/docs/manual/en/Scripting/) for details.

#### **images**

Images used in the construction (included using the GeoGebra ![Tool Insert Image.gif][image110][Image Tool](https://geogebra.github.io/docs/manual/en/tools/Image/)) or as icons of custom tools are not stored with human-readable filenames, but can easily copied and renamed to be extracted out of GeoGebra files. If there are no images or custom tools in the `.ggb` there will be just the `geogebra.xml` and `geogebra_thumbnail.png` in the `.ggb`.

### **.ggt \- GeoGebra Tool**

The `.ggt` files use the same technique for storage as the `.ggb` files, so renaming and unzipping will reveal the following files:

#### **geogebra\_macro.xml**

This [XML](http://en.wikipedia.org/wiki/Xml) stores the main information about the tool. As custom tools are also stored in the normal `.ggb` files the structure of the entries in this files are also explained in the [XML reference](https://geogebra.github.io/docs/reference/en/XML/).

#### **images**

If there is any special icon assigned to this tool this icon is stored in a sub-folder. Be aware that both the icon and the sub-folder have names not intended to be read by humans, so don’t try to make some sense out of it.

## Modifying the files

Modifying `.ggb` or `.ggt` files (namely the `.xml` files within them) is clearly a task for the most tech-savvy users of GeoGebra. Whether you want to touch the `.xml` because you want to modify something which can’t be modified by GeoGebra at the moment, like the definition of a custom tool, or you want to trick GeoGebra or just experiment you should take some tips for your journey:

1. Backup your files. It’s almost certain that you will break your files sometime if you’re modifying the XML definition.  
2. Read the [XML reference](https://geogebra.github.io/docs/reference/en/XML/) to understand what you are doing.  
3. Be aware that the changes you’ve made may be lost if you re-save your file within GeoGebra. While it might be possible that GeoGebra understands something unusual while loading it might not save it at all or save it somehow anormal which corrupts the file.  
4. ZIP all required files at the end using the most standard ZIP options (no encryption etc.) and rename your files back to `.ggb`.

# XML

The GeoGebra XML format has two variants: one for [Geogebra Worksheet (.ggb)](https://geogebra.github.io/docs/reference/en/File_Format/) files and other for [GeoGebra Tool (.ggt)](https://geogebra.github.io/docs/reference/en/File_Format/) files. These are defined by XML Schema [http://geogebra.org/ggb.xsd](http://geogebra.org/ggb.xsd) and [http://geogebra.org/ggt.xsd](http://geogebra.org/ggt.xsd) respectively. Also .ggs files are used by GeoGebra Notes which may contain several slides (included as individual .ggb files)  
Root elements in both geogebra.xml and geogebra\_macro.xml are called `geogebra`. More details about XML tags used by both formats is contained in following three articles:

* [XML tags in geogebra.xml](https://geogebra.github.io/docs/reference/en/XML_tags_in_geogebra_xml/)  
* [XML tags in geogebra\_macro.xml](https://geogebra.github.io/docs/reference/en/XML_tags_in_geogebra_macro_xml/)  
* [Common XML tags and types](https://geogebra.github.io/docs/reference/en/Common_XML_tags_and_types/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVR4XmP4//8/AyUYQwAXnjt3Lu+sWbPmzJw58w2IBvFJMgCoMRuI/yPhbFIN2IJmQBdRBsyePdsWqPgY0NkngfQDqOZXQL4ahgHz5s0ThbGnT5+uM2PGjM1AxdeBigNBYqtWrWIG8m2ANBtMHcx5klAbQKbvAeJFQPwIKJYK0oTuKmQMJoA21SD7D8g/1NfXx4muGBumjgEUewGGyQ5EfJikaMSHZ5KbkJAMoCwpU5yZcGEAtZnJr0Tar8MAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAClElEQVR4XsWWv2taURTHNVU0/mq0/v4FglGhgoOjQ4d2K3ToYLE/HApK0P4LDh07BbpmcunUzd2pZOtkKJRSJLH+iBpNpUOLpqfnSlLsPff61ITXL3zw8Xn3Po/nvXufGgDQ/E+IUBsi1IYItSFCBmaLdzcBETJ0Ot17LMLD++tChAy73T50uVwtLCLBn7sORMjwer29RqMBgUCgj924x5/fFCJk+Hy+U/yEdrsN8Xh8aLPZ8vyYTSBCht/vnxfAMplMIJPJjBwOx2t+3LoQIYO1HhYynU4hl8uNnU7nO3wubvHjV4UIGcFg8J8CrlKpVH5gER+wCAsI5ilBhAxZASzVavUXFvEZi/CBYO4yiJARCoWkBbDU6/XfuEy/YRF3QTBfBhEywuHwABRydHR0tUzvg+AaIogQgdFGIpGlBcxmM+h0OlCr1cBqtf5EXoLgWjxEiMDoo9Go8BYcHBwAtn6EG9UJ/vqP2Kmax+N5q9frX+E8EwiutwgRIjBG3Hz+7gPdbhf29/cv2HG/3wfcpE42fVkRIYItsWQyOS+AfeHu7u5wZ2fnlO2KLOVyeWI2m5/y81aBCBGY26lUqjcYDCAWi50ZjcYHSL5QKHzH8/OOYBea7Fnh5ypBhAjMHbwFo0QiMTKZTI8u3Rau/WP24LGwYra3tx/zc5UgQgTGrdVqLywWy5NFj114USwWz/EYWq0W4PviCz9XCSJEYFwIucesC263+5jdApZ8Pn9uMBge8uOWQcS6YBee7+3tzbvQbDZZFz7xY5ZBxLpcdqHZ6/WAJZvNjm98J1QCu/CsVCqNDw8PIZ1On+Hftzf8GBlEbALrAv5D+oq7YR2PU/z5ZRCxKZoVtl0RRKgNEWpDhNoQoTZ/AJ3kZrT/rGurAAAAAElFTkSuQmCC>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABx0lEQVR4XsWWzStEURjG3/kwoyYSsmJnocgCKwvNRkkWlkopH9mKEhs2/CE2VpSyspKklFKzIGVtMRaKjRTmeu6d0zH3ea/FnFvHrV9zz+8573vP3LkfI0EQyH+ihG+U8I0SvlHCN0qkBR1XQAUscJaEEmlAtwx4BF/gjvMklEgDuk2GHcG6+SzzHEaJNKDbCbgx+w/gmOcwSriCTn3m1C+b8Rr4BL08N1bHwhV02gdvoGTGHeAd7PHcWB0LF9ClBVTBOZhq4Ao8gwLX2FoWLqDLXNgJfCQQ+nmusbUsXECXS3DG3mSn4Jq9zVk0CzoMmW85y5nJZ0w+wlmUs2gWdNgAFyDHmclzJt/mLMpZ+EYJ3yjBYBsW6TwS6cIzvhsXlIzznDQoEQtFpkVyeLoNYrADRkGmJtK6xHNdUcIGOLJI6VVkNZr1yy4o4v6Wdq5xQQkbRKdesHNPC6iCPM6ClLnGBSVsgPNeX0CFFvAEsuECJrjGBSVsgKPgJ3gRWcSg1rCALVDES0bauMYFJWKhCP5g5PFK7cdgM6hfjNlvkcKfz/ZmUYLBNoDb8ECk5xa34iHGYzwnDUr4RgnfKOEbJXyjhG+U8M0PwT4qivy+ifkAAAAASUVORK5CYII=>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABx0lEQVR4XsWWvUoDQRSFj03EJikEi6AYjQliIvgEyVOksPAVRAUfQltBEATBIlj5AFpqoY1YWpjCxkqiT5B47s6yyd4L5mey44VPds89kxln584M+v0+/hMjhMYIoTFCaIwQEkbLiCFg5Mk1aZtk1jAa5JXsRu/akBWMHDkh92Ql0bVxVjAWhp5r5IkckbmUTzf0hVEEKuys9g2U3/m5z6k9k23tjfxa8AWoXgI30S8DH2SVA8G89iV+LfgClDrATzwAYas7/Dk0RvCBUQAWX4CDnhuEzMTGo/al2mhhWhhNuPLaA9aOORP8/psXfF/S3lQ7LUwKXHmdkjuyrPOjMMIkMOpw5XUIVV7jYoRxkM7iTqXzus5PghFGIdMcT7dMe07nJ8UIqSQXEOv6DFh/46KS/5gLLFpoTe2dFiOkkqg88MDiwxfZ77kSQ0H7fDBCkuDmwe20O9hQpK5LHe3zxQhJgtun20Y/4wHckuqV9vlihEjkwYHoAJGDpMytdYczUZEDpai9vqRfXHnJkSnlVRvS87rhrBg88JIAd1mQS4N3eY2L+8PrEVx5NbQhayTacBfEzKb5LyRaWgyJEUJjhNAYITRGCM0vG0L08ieDkFoAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB8UlEQVR4XsXWwUtUURjG4VdLLVSoEKFRxgqkTVqYCwkyhaCFuDCEchEklgsVicQgKgRRKFoIgkQQLSpM20gQuRBBhIKEwnSCdgX9DWIYefvdGcTxfGbDzHi68CzOe77znXPvnRlGQRDofzKBbybwzQS+mcA3E3gl5dhwt0lHcA2TiNmCbJMO4iIeYRFvcRNV4bxdkCkpH40Yxnu8wxDOxeecettgG1x5UvQ6OuU24T3iJPowHSTucgwtOOD2cpnAxZXLxt+k+2v4JZX/+C4dZaYd44jhJToQddf/iwlcUuSydPdnWBnK0531URUuMejHqSB8AtusS5UJ4njkOIvBSeV/KVD3740DSL2rUkmTWZOmzYF0AjfwBp/xGK04JFUs881ZSYh+VYZ3nSzc+HmQeI+v0IljblG8UEX1fKYa3DxT4QFOI9ed8MUEvpnAh4h0GFfwzEzuBjYqQhNG8BGzuI1aU5wNNN6DOtzDHBbwEBewP7nWLE4XjSvRhSks4ynaUOrWJjNBqmhcgkt4giW8Rg+Ou7U7McHf0HgfzuMBPmAeAziDvW59qkywgaY5qMEtzOATRtGMYrc+XVsGNK5AByYQwwtcRZm7MFvCTVswhkVMow/VkSz+3u8kPMAwGiPuHw1PTOCbCXwzgW8m8M0Evv0BkanFEOKSwGwAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACGklEQVR4XqXXO2hTURzH8Z8vFB1EI1gC9RUrpCIIopMOGgSd6qBTnTpop6qgCHUShNJBF7u0UzZB1EUHFR+Dgk/wUVAndycfOCiK1+/hKqTnR3PvuQl8IHzP/540uclNqizLlES6jz7rFVkoJI1j2HpFFgpJO9G2XpGFQtJCzFqvyEIp0jUMWq/AQinSKMasV2ChFKnxU7olabGtJbJQhrT1Qk2NX9LAJ6k5Ga+nsFCE2yap9UX6neVa32gD8VxZFopI605Kl/+EI3Phfv+peK4sC0W4reIUfJY+ZLnmV1otnivLQhnSmr3SlqfbtP77BtUOxespLCSRJjFkPYGFJNJ+TFlPYCGJtAyvrSewkEy6h37rJVlIJp3FiPWSLCSTduCK9ZIsJMu/nt9jga11UeeKhhFbqES6iu3WO/BgKzGEKbzCbZy2wUqkYzjT2dh8CfbgPB7jCSawD0v/z/lmVUgbcYeNB3ECN/EG0ziC1XbMPxZSsHEfjqL9UfrRkG5w/zga8ex8LHTDxitwEJfwEg8wjl18JU6zXSs+poiFTmy8KGyOc3iIF7iIA1g+Z146jIl4jyIWwsuHUVzHLNoYxtp4do5wnqXn1guEB6zV8zfKDN7W8zfQGJrxcCHpWZb42yD8AY/q+Udld73XH5nhFPBkrHdhoSd8xjFjvQsLPQkXGOmd9S4s9Ey6i83W52GhZ+GSHP5zivs8/gLjhNHCTSwttAAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACIUlEQVR4XsXW34sNcRjH8YdlN4nU/ijJsruJuBEl60akkKgVueICV8KVi5W2NpeKCyKpLUVSInKjCDdKfuTXjSt/A7eU4/3d7+wYn+fMmensnPHUa0/7eZ45Z2bOd2aONRoN+59cUDcX1M0FdQt1GQPaqEuoA3iH81isA50W/5h14Tg+4rAOddK//5gtwnU8wlId7gQXTIdmO/ChjrPhgrQRz8YUbqJb+7NFrZo+29pQ1Em8RL/22kFtxgM8xx430Ay10+ICXae9Mqg52JccyD1sSns6nIdam+zEqPbyUD04hve4ihE3o0Er1PJkJzZqT+aWYByfMYk+nUlnNShCDSdvvL7XbD+vazK9sIMXLV5BJ7BAt1cuKIMaXWb2i0P8OWb2g+X8jOwWXuEg5uo2eVxQxmqzC7fDpokt7AgfOqZzZbigCNU1xBE/zOwAl8h38iGdLcMFeaiFOGVxEV5byYfeMPt9mq9ihdk3nS/LBYoasPik/IQzljwxw+uI2bm+v9f3Vt22DBekjZlbpdkbHMF8ncnMDlpc+T3aK+KDeKu8j6fYrf081FlMaF5kZuNwq9yLF7hrBTeaZqhui2dhWHuthDqKt7hiba7kzJuFx/hjzVsJNYFebbSLeoINmudxwWxR23FH8zwuqAL1GoOaN+OCKlCHcEnzZlxQBYu/sr9Yi3tHOqtBVSxeVbs0Vy6oCrUNU5orF1Ql+Rq+Yp72sv4AYD57uSZn/RMAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABVklEQVR4XsXUMUpDURCF4QcpQrKBNOnSKmnEJoIEAgErIbaKbsDCDVjaigbsLOxFcAGindsQ3IRFeJ7BV8icOddbjQMfPP53JzekSNO2bfOfKGSjkI1CNgrZKGSjkI1CDcwJvP7yAjv+XA0KNTDvcA+nnTe49udqUKjRfYEL2O48wI0/V4OCgjmEZ/gEC5EPeIIDv69QiGDGwWV/GfvPiVCIYPrwCF/BRZ6dsbN9/zkRCiWYAczhGM7hsmPP1uzdwO+VUFAwC1jDEezDLmx17NmavbMzC7+vUFAwq4Z/bmXl9xUKCmYZXKQs/b5CQcHMgouUmd9XKCiYaXCRMvX7CgUFMwkuUiZ+X6GgYEbBRcrI7ysUFMwwuEgZ+n2FQglmE1zmbfxeCYUSzF1woXfr90oolGB6sAdncNX8/Ocbe7Zm73p+r4RCNgrZKGSjkI1CNgrZKGT7BtMMQaz3w3mCAAAAAElFTkSuQmCC>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABrklEQVR4XsXVzyvDcRzH8RfNUEsSyY+xMuZHyslOiqKU/8BuSuLi4oaDg1LKZXGUg5zkwBEnycHN2cHFSYz8itXm9d20rfd7m6/59PGux9Lz+17fre++X0gmk/hPKtimgm0q2KaCbSrYpoJpHB+1yJ45LoNJQGgT6LsHhmJA4ILBo3ZkMIXTCAw+OGdIW/wAmiJqTwZTgKoRYPYt+wEOKLSl9mQwgVNLc0DrHbDPcE49T2ztaleGUnHKaJT26J2205ehOwr0HgLefvme1Ptk+C1OgFbohpzgOKYKuZuPCm5xJumUEjkndlxRjdwvRAW3OFFxYsct+eVuMSq4xamnWM7Jn2lA7v1EBTc4YbqkZfqkOI3LPTdUKIbjQfoHd0Jt322JpuWuWyoUwgnRGS1QuTxeKhVSEagDgvym/in+7UXqoQLnWZ73Xv4LHYAGnpj/QHZ4e63y2ja/sK1Tpdw1QQcE14DdhHMkLcLneXVY7pmiAwLzwEY8+wHGnFutQ+6ZogO/Li/BNTDzCkw8Ap1HcsckFTIH4BvmS5fspqlgmwq2qWCbCrapYJsKtqlg2xdlO/uS0KJUUgAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbElEQVR4Xr2XPWsUURSGX0UTiBg/sDIadlxFJFpY2SViJ1pYxC+Q4A+wiDaCVoKFH2An9mrstBUV7AQF0aBNIJVoClEQgsFCZHzPvcu4c97ZnVFvcsnDyT7nLHOXO3PmXuR5jhLAcfJA/DIhIgDcJafFLwMiAsAwmSXbJZcYEQXAOHlGVkkuISJKANfJBfEJEVECGCAvyT7JJUKEAIyRV2RQcgkQUQkwTW6Kr4FjE//OWPS5osaLSuxGBJ6Qg5LrAZBNAXu/AVd/xZhN+ZpQ50VPgJE8PpobJFcB0J4HvoQrxNie9zWhzou+ACfIjPgKgNYnYLEzAYvZB18T6ryoBbhHTonvguMkl30BmFiy+XLlFoEd074u1HpRiy1BXIptPsexkcyQ+53/dwE7r1n0tcV3vGgEfxp5mnd1SY5DZBa2TL6+DyIaA9wg53nBQXKLPCZbpa4GEY1hl3wBvFsHvOeFz+Ef3xkimsCxmlxcD7x5G++HAV/TFBF1cLTIc3KFrLFlCMtRUdsEEf3gOEtekwOFj13SbsgJX98EEUUCa/cDu2/HiC3kIblDhnxtbo/kX3TJ0nW8CBLZJeDod+ARPxz5AWxmU8FhX1fCmpM1Ke9rEBEkso/AUsjG2FrwNZXEtvf/fYAvjjngc2cCFttzvqaSP11yRHI9EBEkRieBPV+Byz9jHJ30NT2xV3Z8dTfqCyKKBMAeM3TMos/VYpsX28R4X4GIJNj2LW7jxiTnEJEM28jGDW3fLikiKbalt629912ISErskna4GZdcBxHJseNdfDSHJZevxAQMO+jagdf7fKUmYNiR347+zv8GN0/BgWJ0QXkAAAAASUVORK5CYII=>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACcklEQVR4XsXWTUhUURjG8acyIiGJ2oyVUplYUiBiQSQI0if0QYQrIWgRuKlVtXERUeAmIUwIpKBFtImKqE2LJAgpQYpqWW1qUxR9LkIwb/9z7zDNvG8zztW4Hfgxw/Oee87h3HvPjKIo0v/kgqy5IGsuyJoL0qItlhouSR03pEU7bX0mLkiDNo/J30jXpqVxgs4fUm2H7VeJC9Kg1Uv7vodREmPYeNv2q8QFadBWMuEnaTK/gKFfUuNp268SF6RBW8gteCU1swvdX6UNj8mW2H6VuCAN2hWcSJ4F1dt6NVxQLdpJXLZ5Wi6oBm0/HoRbYGtVkepwAMO+OANaG55hma2VFRbKO4ozeIQnGEC371wBLYcXaLE1R2rFcdzFc4ygB8tLxnQXlqH4xNMYtttajMWhF1fxEjfRhybXt3hcG5QUpaXSqmMcsTv4zlHLgH8mrMUeDGICo+jHFsy3Y5XjgkKBbZbWfZDOT0mHJ/n+Oj94mCRMFiYNk4dF1Nrrq+WCQkGbLkp34h5BnbZNjUu3omSbc7b/bJUG4QFJHpSRQ8p9lu4VFiBtZSd0Fo12kLkIk3ZHySsRXo3wioRXpbM9fuKb3kvnmLiXX7nm+0x+FA8xiiNKeez+TVjAcJQcCnWuGC+ipUeq2WXy1ejHU1zHbiwoqq+R1vbx2WbHtFyQFm0zhpScD4OcT+xM6zfpAsUudq51wF5Tcr0NZotWg73SCiZ/F48sTUfhNtq+JdfZYK6k9RPS2/wCfqLhY/HtsVwwV7xIB/mT8oW7wt+0Lnaj/ZTtU9LfBv+C4n9KjZygM/9muCBrLsiaC7Lmgqy5IGsuyNpvy1WajLZKBSsAAAAASUVORK5CYII=>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACAUlEQVR4XsWWTytEURjGH5NCxkI20ogsUBaWynwART6DYomyku9gjxX2lso3UMrCUBZKY0lRdqwYzzvnmK7nba6rGXdO/erO77znOWfu34NarYZO4kTeOJE3TuSNE2mwdZNZskb2yEXEjs1ZX7eOS8OJZrCtkhtyRDZJmfRH7Nic9VnNqo5vhhMKW4mckQObTPuVuKD9OKYUXVHrGvUqJGyZ3JIF7fsNG8O1VIHRZ16ZV2Dyim7E1alIBIyQSzKofVlgKwBjD8B9fRaeEDJ94upUJAJOSVl9Vti6gJmXMLnxRiaqrk5FHGx39K76vwKMnwPHn8ATf2x9AFPbrsYJoJdckx7t+yuWwUXwEZ3mkzHwyN99rsYJYI4cqm8Vy7Rs550A1smGeoWtCAwvAUMrPC5ov2KZlu28E2Gl8+qlhnf46B2w/Q7svIfj5s96HDNv2c47AVTwywsn/GubOCSEhQwvap3k2guq4rwTmRZgp94mDQlhMUMrWie5mReQ5RIUw2m3iW0h9UuQeh9YpmU770T2m7AQLoWdjfTrH+sz34Qdfwzb9iL6xrJiZq/rUxEHtOVV/I1lWab6ep+KxKCWPkaJHNusnKpv9KtIDGzpcxwzBmOG2wc0alRIQIsbkvrYZe37UadCQRu2ZGk40Qx0alP6o7iT2/L/wom8cSJvnMibLzlhIyxk7ImtAAAAAElFTkSuQmCC>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbUlEQVR4XsWWPWgVQRSFjyFoxB+MgmISjX9Jnj9o8QohIQg2sQnYWwixTAQbLewton0UC7W3DFhqJQgWGsHCIBEEjRAhEsVCic9z307e25zrbjZvwjrwsbtnzr07zOzMXtRqNfxPnFA2TigbJ5SNE/JgaydnyBUyRV4E7N4062vXuDyckAXbGHlDHpKrZIhsC9i9adZnnjGNz8IJClsPeULu2cu0XwkDuhtieoK2XX0NvwqSbJS8JSPatxYWw7HMAQcWuDKLQP8ral3Op0IqQRd5STq1rwhsbUDvB+B9/S2cEFJ57HwqpBJMkyHVi8K2CTj5NXm58ZMcmXM+FUKwfdF3VF8vwKHnwKM/wBc+XFsGBm44z+oA7AO6L/M6S7aoeb1YDg6CW7TCnbFjns9bnadp3nOcU/QNuMURD//i9N1WcwxsD8hZpzcNh3mgzIT1Mk7MqzkGtgky7vSm4dRT4F14+TLp4weEzRrQKmyDNgtObxp2Xkj2630+XFwCTkd/hGmQHFCvnS4m7v3dn3mcD/O+Tc0xFBpAMNrHMqh6LGsuQco4TiZUj8VyWm6nO4Fb5V8jjSXMbPY2TBk7yAw24CBawXKFnB2uT4UQsCFH8QqWy3KqXu9TIRUU9TNK5bFiZVr1Rr8KqcCo33HI0RlyuDqg4VFBEhQuSNiqwLGbvB4NzyMhdlS9q+JUUFCgJOOpeR04v5ScotXvwK5nIaZekuXhhCyQW5R2LyYFhxkXSN8njc/CCXkgsyzv/QH8DgP4SA7OamwWTmgFLjuXoMpZmGQtUWFNUTmnniyc0Cps/cD+S7zu1b48nFA2Tiibv7E9Ob4ahkgjAAAAAElFTkSuQmCC>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADAklEQVR4XsWWW4hNYRTH/xqXcZkatzDM1QzmaNzHC9F4IbeilFuNPEiuT4bcohDjySXyokQoXiQiXoSUzEwu4WFE5MHI/TYu4/jts097z1l7O+NMp+OrX33ff62193e+vc76lqLRqP4nASHTBIRMExDCkAYtliIPpJJGafhsX1cPGAMLoBrKoYONT0ZAsDCKpNHvpPcsmmDkV7RbcBduwFHYAOvgDNyHK7ATyuzzLAHBIhWulPbHPF2cef4m65cYowEwJ77BtdBF6jNZ6reMeacEXxtsYUyRKn9Kn1i0wIQPaMOsXxjOy2AHGyZmFSe3/TsH+hytv+djg8wD+kOdVLqbk3gpDX0GNdYvGVLHKmnRF/8E9/3ieSs8uw3wA9UdbsJEa0sF8jQiLfzkb+BAC0m91bPbADdIWXAe5ltbe5AG17mfYDMvL3iPkO3ZrLMboC2QNNFShZOYx2dcyOQe5Hl60FFd404J2Zou5NaLjd46xGGpcwJWTxeMfLjsrUMcjsEIq6cT54S9eYiRhFFHq6cTRoM3byXmUCQOkyjNVNAapVjTUyH0BLhkzkmHom69X/9bKt5vA9MBoxdc89a+Ychrv1g0Q6TRBqcDxlSo9da+ofih9DS+gatQdsEGpwPGKRjrrX1DSSU5wH0/mrJZ8BYh1wa3F0rLeKniIj/ysdStPsGW6BgrwdlwCSbZB7UHxZqW0ldO3kkvoNLpJ8Z5dhsQDyqBeuhsbanCn2sWSf3Dz6+TMHKPZ7cBfmCsy9ll9VRRLOsr6AO+xDdQzQnkzPTsNqBVoNNMHIGz0Nfa/wVGIZyWBl5nymcob6KfOJHgY4MsjGnQAHPd9ZDpXK8kUzEPHLUXISskJhdq5bZkVXEt9HMGhDAYPeG4Yg1K2WfpTdRtz1ZztL2XoOc5L4LlsA/uyO2U26ymASEZjFF0N9/8hLoNRR/ldsEHYY3cQtPFxv6NgNAW1AiO/hGTb7CAe6PnDOuTCgGhLdgAPV4pN2bkCf/WbdaeKgEh0wSETBMQMs0fDfYIVdJ+3Z4AAAAASUVORK5CYII=>

[image15]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5UlEQVR4XrXW+2tPcRzH8deMmc20zOZSLDbLtakJIVJIrKxcchnCD0qREiWXiJIiiyKaKLEQ5QeXteb2wxhh2BL+Ab8oCimX4/nZ+W777vPevre2Tz1a39f783mfc/b9nHO+CoJAPUbaj+0mj8EEKZPy0YQMU4vBBCmTTmOVyeMwQUqkYjQgzdTiMEFKpOuYZ/IEmCBp0jTcMXmCTJA06QEmmzxBJkiKVI6L0RkjR0nsBRMkTErHC4zkgMtwDS14ifd4iCMYZNZGMUHCpE1fpVORA1/BJPRtbywVYCOasNCsb5vnBwmRBvyVmodIr2leYepRGMNQi+V+rbXuBwmR9pyRnrgrNLUuMHIVnmyBqflBXFLed+ljVpK3HmMJLpncD+KSqo5LNTRbb2oxMPrgg8n9ICZpNJ71CTfeRFOPQ+HXNrxT5k+KSbqKBTR5hX6mHgejGnM6Zf6kbklluB9p5L6C8WZOHIzHGNop8yd1S6rDlEijnVhj5sTASEOLyf2gS9IiXI5qVoo619TM7QZjBapN7gcGuxfPUeg15GbQNjO/C4x8vEOeqfmBIW3ACT9nZOI51vk1b16hwu9+qV+jmmEWeBMy8QaDTS1sPhDncAtT0T+qNgpbIyc5gyQXc7EjcA8kXlqBe0/4Tb0T2IXdJvcw5kdOpBFNRWy2zTwvbvIO+C3dZkYznuIstmA6BrSu9ZtFGmZVShOC8Ooz/Xo79/ZzDySpEsdR/49XMX9rcQyrMS5w+8hf23YsE6jkrjTrS7bKfpZqrHtyhTtdysZMbMV5NOIdbmAvFmOE3y8e7+BZ5dLmHy51+qv8V4N0jw9vg/DHx4XA7XxpNnL8ZqlwV1aClTh6SHktaTrZenAnTYf/zFTugSCFx26i3Am4TXIQFfv4F6er+Bt3TRBeeNFn92/xF/UkE3ySHhWoqJ6nLr852EBdLOpJnQNuJ9T4k3pTxwe327l3Mcaf1Js6PkhrUeVP6G3/Af2FRrKGGEClAAAAAElFTkSuQmCC>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB10lEQVR4XsXVP0hVURzA8R/RkFAUSIKDUxJNmQgiCrqUSJMEmtBSPLEGRzXIaCsIGgoXh6A/Y4WDEG4K0WaY6FDi8gahP4soiIrJ63t9h8vp/HiP84vH8cKHd+/3nnv8Pd4FpVQqyXFSITUVUlMhNRWiifRgDHdwTt2PpEIUkef4ifdYxT661LoIKkQR6Uadd/0JM2pdBBX+i8gs5lSPoIJZ+T3YwWV1L4IKJiID2EWvuhdJBRORJTxW3UAFE5FfGFHdQAUTkTY0qG6ggonIRwypbqCCicg2xlU3UCE1FWqJ4xK+40x4L18ThlriuILspOI/KxVqyTQARwte4Avm8QgnwgcsvAE68Q5f8QqN+Rpv8aJbdBE3sYnRYMN+TFcxVWGA7EtdRTNm8Q0n8wGyC3TgLOpQj894FmyYDddXxbUKAxS8lr2Y2Ul/PoC7MYgV7GHDfb70N7TyBrgQ9C1MHJ270I5D3MYp15bxOnjwPopVrFUYoNtrja7d8ge4i9/iXjqO0/iDD/6GVt4AD7w2jH00HV27mP3BH3iDh1iX8hu7EG5q4Q1QxFtM4QCT+Rpv8Xkp/wRP0Io23Ag3tZDyy3zPfRbwFNf/WRM+lJoKqamQmgqpqZDaXyWGcUB0HDFhAAAAAElFTkSuQmCC>

[image17]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABgUlEQVR4XsXUsSuEcRzH8Q+RYkEmw/U8HpIyMBnJJgbDxaLLH2CwKSZlMNnkH3Ajq81kksF4dZN0gyh1uQzS4/P8nqdn+H7r7p67X1+/vPq59/crT0eHOI7xn1SwpoI1FaypYE0FaypYU8Enngl+7SW3nOU7MvgChBVg8RM4+03vsCJ33J4MvgBRHXh3vyG9o7rccXsy+AIEDaCZPUByhy9yx+3J4APPLv/sfIDVFlBlWGsCM4dyz+3K0A+ecarSdfb9HDB7ntxyN/8ZGXrFs07PtCNn7ahQFM8IXdAdTct5JyoUwbNEj3RAA3LeDRW6wTNIR/RA83JehAqd8AR0T6c0JOdFqdAOzz490Yqc9UqFfIDhZb67l+mNKbqhKxqVu/1QwUWEx8DWF3DLF5vfwCQ/VLAh93xQwUWEr0DLTdM7aMgdX1RwEVENeMseILmjmtzxRQUXUSoDCx/AyU96l8pyxxcV8gEwxv+37eSWM59UsKaCNRWsqWBNBWsqWFPB2h+7sDx9dVaZSQAAAABJRU5ErkJggg==>

[image18]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADJ0lEQVR4XsWWW0hUURSG/xlFrShDSDI1L0WjVOLMOWpXMpBECCFIK6Qns7QHIe0K6WvaQxczZxzLQIJK6KGICIIg6NFKRulCUFH2EkGCJJba9J+pM5xZ28uMDvbwceb8e6/1r7POPnsP/H4//ieKsNAoQsggkAWsOcxruhyLFooQHICzGigaBtp44/oOpFXJOdFAEYIDyPgCjARmAMMkd1DOiQaKEByA4yMw+a+Ab367LeuDnBMNFCE4AMdJG7aOAO3+WJs2eig78bPXhd1y3nxRBCt7V2F/2cqkvoo07PE6UdKp4QnpuFGMBDl3riiCFT5xJQ0vd7mgmXg1tFB74daxQc6fC4pgpdOFEzRrshYQKOJvYT5SL2MiRRGsdOpop1mNLMDguhObWeAt8rDbiRUyNlwUwQoLuM93Xy7NrbhdOMZOvOa1VMaHgyJYMd41TTZJUwm7VMq18YzduNi7HnEyz0woghUW8EqaTYfHCZ0du8CYPpIjc02HIpi0rUU8E/VLo9lgN6pYyCA5InNOhSKYdBQgmy19LA3CgYVvYwF3GX8vKSGFh1mOD1j9hmfbdumjGJt4C7CD7/WmTB4Jxx1oibdrk8ZWDnwiDh5uoV+MYhwsQMdBj4ZLMmkkpC5Kvwr0BFz+0vqbnagMqwCan2UHzsik4cLY2sZ16I+zl44DY3QaJ4U81pEdVgF8j11dOqpl4pkIfAkaGslzroHbvG7k/4pT/C/xlb5DxgEnfRRjEz7BI+P0kyZTcU1HITvWTMMBGnvc+ciU+aZDEUyYcMBILM2sePOxhYatxn7BFd/qzkOyzDMbimDCpG+lYRAdxTS8EjDWcLqtCMtkfLgogkFPHpYw8UtpTG0Xn7ibVx87VGtsVjI2UlQBWJqbmFxXmR7vMxZVoNU8kGh4h+uiz6PjQG8FYmTcXAm9AWK5W7232Zp+xdgaJhbHZAx1uPCAT/2U+0KZDI4GoTdIrgPO/zQ3jljb0YmSlMQaGRRNQm+QuQ84FywAqP8BLC+XQdEk9IZu3DDeAc1jQMMof/tkQLRRBcDOV1EFpO7k73mv8tlQhIVGERaaP0cPlcl/Iy8lAAAAAElFTkSuQmCC>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACFklEQVR4XsXUTUhUURQH8JOFiZYfoExCDSpiIi4Cdy50YRGBuJHAglZtwrXrRHChmxaB7oRBVwlujNY+bdlEEw2DQqAIuQiCPhZ9oE7/4z0z3DlnJnengR+897/n3nvevA8qFov0P5nAmwm8mcCbCbyZwJsJvJnAmwm8mcCbCcoDRNehQ+cydg26Is26RtVzzTgMwaWKMV0sE3rgFD7pCTKeAB+UHMNrmFR13GgOfsMunEAB0uc1sAiHsvD9KuMJvJAN2ChswB9ISc0FyMMWtEjWDll4VrMB/OrhM8zAJi9QpSaBjMr6KPwbw3I+Jue3Vd09WCifV1n8AYW/rIPCfeNw4F8N4HcZZuEImiSbp3Abz66+FhsQ7cC6HNdRuBVLqiaBbxTu6x78gi8wGNVkoKDX1/TmAxSu+E6UPYXvcDXKEtiGKXgIC/AB3pbq8FuDnN5Q0w08p9DAe54sPko2rRrIqLn8gP2AGTnnpvghPrsltcQLNMJXWIEnyivIn9NAA4XXdk7OJyg0PqLq7sIy1OkGHsNPaIsnyBh/QPhgNGqg9Bp2Uniy1ylc8Q2puQj78BKuSMa17yBbXjva5A2s6s2jcb4dpYczodBQjBd+pOZ0U/jw8PfhQOp4nb6KBih8NG5Cq944WiwFvXKchv5Il65Xc/nLyq/0Ld6rYkwXezOBNxN4M4E3E3gzgTcTeDOBNxN4M4G3v46sDsV+M0EtAAAAAElFTkSuQmCC>

[image20]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqUlEQVR4XsWVv0rDUBTGP4cKKigoOIjUlvi3dfEB1AfQwaEKgs8gRXDRB1B3HQQHcRAnVxFXURd17aCDiIIg1kFxEKxf7i2hPQdq2qTXAz9u7u98aUOSQ1AqlfCfKOEaJVyjhGuUcAlrXkkXsDrJATlUzWbDmiK3ZNHsZaBZsFrJJjkj/YGXwbhgtVUcZ8glWSEtVTl5YlRYfcDQFZAtAt4dH/c2HfcYl1mTlyIqwPAecGR+GXggA0X/9stckJciKkDqHngvX4BP5q3ycUiUiALMePVcA/kfexH+nRg8l7mqc6RoFNYkuSFLQHqVd4LPf3SX+16ZrTpPinphJcgGOUXFeIVFiXqAHa8LkocYr7AoEQb/z8gy7GxnZb8elPgLmDnHCdlCjfEKixK1YOVgX7Rp2WsUJYIGEhPAyI5dzddrH/YL1iWzUVDCSKTXgNkP4JibmS+g+4lyQebiQAkjkX4EPk3XrqlnmYkLJYyEVwBeyhfgr15BZuJCCSOR5Ms29gqsf9s1mZOZuFAiaAAdQPucv8penCjhGiVco4RrlHCNEq5RwjVKuOYXpCYYnWrm1ToAAAAASUVORK5CYII=>

[image21]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABWklEQVR4XsWXsUoDQRCG/9I0goUSC40SCWwqK8GH8BXEl/ARfAUfQCsVhAhnc/hAQrTQVjxndmMx8zcbWMeFj2O+2WFye+GYwzAM+E9IREMiGhKtAUZ7QOqByVKunYhdk/cFrSnN+9wJeBDSo8n7gtYAB8vSXPkW9l9N3he0phz7YtX8RpjfmbwvaI0+cz12vXNtLvGOyfuCaEhEQyIaEtGQiIZELbKmCbgV9J898/laSNQga2MCvD1L+YswBd7Fbfp9NZCoYQxcXAFfuVy4lrfMIXDp99VAogZZ8zPg4/cHnAOfI+DU76uBRC0z4P5YHsOJcAQ8+XwtJNZB1paw7f06kIiGRDQkoiERDYlobCDDQhkadHjQIcIOkH+BDXJzHZt0fNIxKnW+oDU2yHeuzUtGB0pf0Bob5GPX0VkDHaVT7wtaY4MyQHarj4hePyp8QWtIREMiGhLR/ABCsl5mZEyuUwAAAABJRU5ErkJggg==>

[image22]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACBElEQVR4XsWWT0tUURyG3wJNJaEoalFUamOludC2RRHRpm0RfYDaRkSbVn4ECaxNLQxat00ISqFQg9BoUwRtjSyiNkXi9NxRZjzvaZpTHm4vPMzc5/eemTsz98+oWq3qfxKJsolE2UQiBbJZ2nNTGp6QOk75/G+IRApS75w0tixNs3Hym7Rt2DupRKIVpEs6/rlYucprOPzEe6lEohVkO2/4QfqxtgMPoecxfpN3U4hECvz216WBJekiX3//G8QdeATd3m1FJFIhbTCwbvsCPIdd3v0TkdgI5Ay8gK0+a0YkNgq5BA/cNyMSOSB34bL73xGJHJBOmIcunzmRyAW5BlfdO5HIRfHp4SW0+SzoucgJGYcT7oOOi5yQ8zDqPui4yAnZCVPug46LxuLefVJlVur7yLX+KaLTOymQBXfB3EVjYc+CNFNrSPehf8I7KZB5d8HcRWPh4NLqmxf8hMp776RAZmCL+/rcRWPhkWlpkicrMA4H/vUbKO4NTU/FSKxbyAF0kFvs/kXp0D22O7yTAnnlLpi7yAXZIe29weMznwU9FzngbnxaOvpJurUinf0ujYx6p951kQMOYP6iva29urQMFU5ltXuv1nWRA05h/jW/W9uBgsFF79S7LnIg7R7iLPoi3eYnOPeVHRjzTr3rIheEK2nfFR6P+SzouSibSJRNJMrmF7NQAbK09x+qAAAAAElFTkSuQmCC>

[image23]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACbElEQVR4XsWWTW9MYRiG74rSNjREw4K0+kkVSUmsKizEphEbIjYWEmLXSFhg0/gF9VE2LOojsbNgQSKkTUgRtMKCiJ2k4jNsiKZ1TWcyM+d+58w5aMadXDkz1/M855zp6TvvaHp6Wv+TQFSaQFSaQKSBzJGWH5e6h6SarV7/EwKRBqnlkTQwKY3wZst3aVG396QlEEmQOqnnc2YyywtYfc/70hKIJMhiLvhe+pm7gevQfAdf5b1pCEQapPXHpFU8gj38+TteIc7DLVjovUkEIg2kD47AmiK3Gx7AUu8vRyCSINXwDBaUqG2Dx6VqcQQiCbIPTrovqu+Fq+7jCEQ5SBWwBNXgNeu7AAfclyIQ5SA74Ix7h9TCGNR5zQlEOcgwrHRfCnIY+tw7gYiD9MAV93FkPj08hWqvRfpcxEFuwDr35SCDsNl9pMdFKTIXhpvukyC7oN99pMdFKcjlpE9SCtIAw+4jPS4Kwy2NUvtDjp/Yer8gar0nDWTcXaTuojDYPC6NznRIl6BjyHvSQMbcReouCoNdH7MXz/AL2t55TxrIKMx3n6+7KAx2jki3eTEFg7DsLfIJsBOq0fvjUHZviF2KgSga5B+ojS22aYKt9yLva6Ae9sPdHJnX9T5r53nuLlJ3kRbSBCeU3RmvQS/MLaovkVYc5XjfZyPncfE3kE1wFl7CKR75IWktq+f0lLT9h7Sh32fysy7+BWV/K+yUWvnJ9nrm7NIktH/Az/P+mRkXswFLmC37Te4GMnRNeE++18VswIrhq7vzq3SOR9D7jRsY8J58r4vZgvBN2nqQ40avRfpcVJpAVJpAVJrfZqCWPWn3z5QAAAAASUVORK5CYII=>

[image24]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACVklEQVR4XsXWX2iNcRzH8a8xhtGkyBiGbYcJOWtqJSXFldxJcsEuhBIXW22XtAtccUFJyz1XLlzKDbnx342lKdJkiqZc0Bzv5/yeduzzdY7tOXse33p1zvP5fZ//f61QKNj/5IKsuSBrLsiaCyqh6rEHZzGIB3iIq+jGVszR+Spxwd9Qs3AEL3EFR7ENtahDJ05a2KgXOKbLKMcFysJe3cdlNOi4ohbiGu5iVZzVa99EvwaysC48QruO/Qu1l20ZNmsaZR++mLU+JWt0fRr8sYAmPMNKHZsKqsZszVuzN8W1cECQu+X6NIhnXhDveZeOTZUVr5v2z2Hlke9YN+z6NIhnPofTmk+X2Vrukpu/zD4ycWbcrK3X9UyewZZz5A/xOxQdBW2eLmoeG8EtmuPOWDTC9HzXU2peupFD9NVsgC3e+YPDd1Gbq0HdwA6XlxqaOefP4/MV2TSizdWgTuCUy0sNm++ZvY5XPo4WLiCbqzMkZeFhNejyUsPifeF+vc7EgTGzLZe0uRoWnpiPXS5NjVwHfTxhO/hfo83VoGbjics1SAu1AbddrkFaqP0473IN0kIN4KDLNUgD1WDhVV7nxjRIQ3TocVzz4pgGM41qtvBWrdWx4rgGM4lab+ELqVPHJno0SIrKc6f1RyuNp9vwCh3aO2k+DZLgqdljtnssPEXz38yW3CGMvoC2a69yQRJ8NH0KHxzRxChaPpQ758oFSfD4fm/2M96Ad1g9pD3luCAJTjunIM+L7ALfEjm+KXK7tKccFyRFtZqtOMzvMh2rxAVZc0HWfgMMD4qciOz1ogAAAABJRU5ErkJggg==>

[image25]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACpklEQVR4XsXWX2iNcRzH8a9xMsya1GSMHYftsIW2NbWSlOJCcidJQhJKJMqF0tYucGUXlLRcuRk3LrgTF+TC/JcsTZH8mSJKsuZ4P+f3tHP2+Z1zds6zOr716pzn8/s+/8/zO4+lUin7n7yg3Lyg3Lyg3LygEKoKG3AUfbiH+7iAvViFabpeIV6QCzUFO/EcvdiN1YihEh04aO6gnmGPbiMfL1DmzuoOzqNGxxU1CxdxEwvDrEr7xvo1kI114gGadWwi1EaOZcisfphz+GbW+JiszuvTIGsD9XiCBTpWDKrCbPFbszfpvXBBkOz3+jQIV54ZnnmnjhXL0r+b5q9u54FfWDLk9WkQrtyFw5qXyqyBp+TKX7NPLBwZNWs64fWMX8HmceW38zkYXAVtLhU1nYPgEU3yZMz+yPIMryfTPHc5l+i7WQ9HvPYPl++sNk8GdRlrvDzTEOeePw3vV2DFZ22eDOoADnl5pqHlttnrcOejSIwQvsItnMMutOa6jMUwN1n1eXmmoXqTe14vsbD1h9nKYKfBDNiAzTiJq+YezRe4jtOI60ZzMTdjDni5NNXxO2BHsXa+V2hzVl8wBbfgFHp1PBdqKh55uQalCM/qpea5UEtxzcs1KBXVj1bNFbUF3V6uQamoYN7o0lxRPdjm5RqUiqrGQ82lp8bcX3mlN6ZBFOb+ehOaZ413Y7/m6TENoqD24Zjm4Vjc3KMb07H0uAZRULW4myNPmHtD6tCxsR4NoqIGONngh5a+FVSTuQmrXXvHradBFMyax83W/3azaNtPszk3CIM3oIkfTw2i4KXpi3vhCBaGseyD5bnnyguiYPp+bzYSHsA7LBrUnny8IApuO7egjT+yM7xLJHmnSK7Tnny8ICqq0Wz+Dj5rdawQLyg3Lyi3f82HNxf+lXnDAAAAAElFTkSuQmCC>

[image26]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABwklEQVR4XsXWzStEURgG8AcLG7LAYpQxGN/5WEl2bC1s/BHKxsqGhaUSS2VnKUQofwCZlUjNCimUFGVFFjKe+5H0PjJzde9x6re4z3nvPXfOnM65KBQK+E8SuCaBaxK4JkExbIO0Spu0TXt0QMvUa+uLkeAnbBU0QYe0RaOUpWZqpBSNhX05mqIa+5yfSGCxtdEZLVHG9ltstTRNp5QOsypb91VvA/OwJjqnAdtXDNswx73kO9wD/c9Au/cjGqTOBt8e4E2rd9OQ7SsFWzkHvwOu/FG4TKhzU+psEN5cTSc0YvtKxVYG9DwFg3teqeVa6mwQ3jxJszaPikvmGFj7AB54Mf0OdMxIjQ2CG/2VLP9XVGyVfIkVTj3XUWrOmxWpkQDopn2bJ0UDYJHGbZ4UDYJdLWXzpGgQbK2NNk+KBsAONds8KRoEh0zW5knRIDjp/rwBRaUBt15vFmyeFA38o7eOB0j2hkthHb+cZHHQAB0LwDy3zxdebFAmZ2vipAEyt8Cb3xPoe7Q1cdIAbfzM2g0Hz1Nr3tbESQOgHug64ovwIyJ9wSM08ndeFBJ8dXAx2iwJErgmgWsSuCaBaxK4JoFrn4MB8JhUSGh8AAAAAElFTkSuQmCC>

[image27]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABl0lEQVR4XsXTMUsDQRQE4ItBD4KoReIlG1IIFmkEBbGxsRZEBSvriGBtIaQR9QdoIVhaiYWCglhZiJ0W6e1ELQRr63P2bpU4z5wbCM8HHyyzc5slyQVxHAf/SQTaRKBNBNpEoE0E2kTQS5g+GOX8R4eDXsHMwyM8wA0McifpcdArmDtYdusTWONOsseBeyAHO3ANFzDLnb9gQnuOW5/DJneSPQ7cAxNwBHlYhFbb3jicdmB+OWsFXmCE97IuYD94A87gFp654wMzDe8ww3vfHQ7cg1tB+rtV3CFvbXte3wBmDF5hgc/3ucAubMMwHMAHd7JgBoL0DdiHSafKvaTLgTtgCPbgCpaC9P+Q/KF8YApwTFa5l3Q50CYCbSLQJgJtIvCF6TclM2XZNe/7EoEPTL4SVZtw7zRtxj0ffPBckL7/mcIwPIyK5ScTVWPLrm3GvQ7msi5QD9L3PlMYFtbLpUrr6wJ2bTPudVDveAFfmJyJTAMffpkyDZtxz4cIulEr1ozFeTdEoE0E2kSgTQTaRKBNBNpEoO0TXJN0qotiIQcAAAAASUVORK5CYII=>

[image28]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABDUlEQVR4Xu2WLQ7CQBCFR4AAjURxBW7BCTAoLCfhACgcip9jcACOUE+CgQRBAszQNtm+bvIWmARBv+QznX2zu82KEWloqNNTd+pFfThpvbaS96bY5tjAy40k4Hlz9CwJYMhbCga8pWDAWwoGvKVgwFsKBrylYMBbCga8pWDAWwoGUs3UiXqP1EIpGEjxqg4trMwj9VAKBkozdazeIrWpBQta6j6y5qsDhDecQW1VfA/pq0ep9/n4AOENjUXx/aB2oVYykvh7oGBgWS2/aEs+NwywAMTeAyVcbDfsVMtvEXsPlHLhSfgNU8D3QMFf5i3l5yOZTa8Y9HItCdjobNOrnRYbfKr1ss2TxvKG/+IJVGLs26fWpyMAAAAASUVORK5CYII=>

[image29]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACGklEQVR4XsWTvUtjURDF1UUQBFmsdotttLGykW39B2TLBRs7o0YQwV4I6Re0CJgPzeajSiHptDKNhUFiIQQMJEUgxi02IOTDkN11PFNEwsw1y7uB64UfD867Z867c+eNEdHYe6IE1yjBNUpwjRJco4RBNjZoHhyDW/Brc5PO8fTDNS732qKEPj4frSKsBcjAxc4OzUiPDUpgELAAOobgQU6kzwYlMGj1qSFQsb5Oi9LrFSUwKH4vw0zgmnzS6xUloPAk+CfD3iAo/V5RAoPCRUOYie/S6xUlMGjtD0OYpLW9TZ+k1ytKYNbWaBoBZUPoKxjULemzQQl9/H6aQycuZTDoQN+V+21RwiCBAE3gpN8QGgRHfGr+MLlvFJTgGiWMQjwe/5hMJg/T6XQxlUrV8bxKJBJ7mUzmg9zbRwm2xGKxZYQ+lEqlP91ul3g1m03K5/Mt6MVwOPxZehgl2IDwWQ5vt9tkWrVa7Rnvr8jgVYINaHukUqn8pSErl8s9ogsrJLyqmA043V2v16Nhq1qtEvYdkPCqYjbwwNF/VqPRIAzlGQmvKmYDPuDmrfvvr3K5TPhLAiS8qpgN+NX2C4VCi4asbDb7OxKJfCXhVcVswHBNYhDv6vX6MxkWPu4J7xNk8CrBllAo9AUh1zztPHB859x2Pjk69BPtn5IeRgkjMs6/Gk87DxzfeTQaXTLse0UJrlGCa5TgGiW45gWb5/F388oeWwAAAABJRU5ErkJggg==>

[image30]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACL0lEQVR4XsWVP2gUURDGR6NCCJJGEbUJBLRKCiWdXGcliGCRxkKwMEWQlGJsRCuFgyjcXw7MlScp0gSSFAoKnkiCaCGChRgIFiYEURDFbL63N7u8+yZ35bjw4/Z+872ZfY9bTpIkkf+JEd4Y4Y0R3hjhjRHeGOGNEd4Y4Y0RXUWR86ANXoPTXO9FqVQ6W61W24Fwz/UYI7qKIvMg3ATuc70XGDwHEuUJ12OMyAsix8Bv8An8BN/AEc4xzWZzCEN3wFfwHfxoNBpHOZfPYZEXRG7rzqdBXe+vcY6pVCpTYef4vAse6SlMcy6fwyKVIgfBF/ALDINz+gBtzjIY9gH8BSfBKNgFH1E7wNl0FotUilzWgY3IvVE3wfkM7LigO17IHO6X9UQucj7tyyKVIis8DNd1dfOcz8CgFg/D9yv6UIucT/saIXIG7IJ18oNgWzo/zOO8Dj+0U3r0n5PouFut1gDcBvhXLpdHeN1+DzCnO10CM8Sa1u7wOuz6XthprVZ7js+ZGLhXegoPeR0PHwI7OqQfG+BQtg6ND4NNHdKPrWKxONjvAW7qgAdgpAdPNXM1W4fdT4YB2OnjcMz7EWohg+yNfg/wHvwBJ2JPmeyVfJE5NH5Z7bxuo5yPMtkr+a6rX9S4oI2f8WIG11vNjtXr9XE93lXOMSGj2Qt5r6jprHT+eAq8kME1qdlbaBYIfzyXOMeEjGZn814c8sYIb4zwxghvjPDGCG+M8MYIb4zwZg8c/dNl7uQVdAAAAABJRU5ErkJggg==>

[image31]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABZElEQVR4Xs2Vvy4EURSHv6xQiCgk1gqFRSwrNGrqjWqT7RXiEUQlHkAinkDpFZSi0amoFKg2ssUGISFhs87MXcQ5zURO7rjJl7n5zm/un5k7GbrdLnliRGyMiI0RsTEiNkbExghPBmCpDLtASde+MMKLBTisw/ORTLECjyVY15kEIzyQ1j8HrU4yvHAnVOBC59KsFh5I65uF+/feAq7DAs51Ls1q4cUi7K3Cwz50qtAehTWdSTDCE2mTY7Al1yFd+85oERsjsiKtAMVGgIKuZ8WILITJx29h5zWQ9P+2CCOyEHadTBxGCP1iQ+eyYEQW/sECcn4F6Y15HkJPjPhVhGHtvDEilVQ2YaoJy22YORUxqDNeWCE/EphuwUvvhB98QHlb57ywQrYMtaefT+xSmD/TOS+MSCXlGziRTlOov8FITWe8MCKVcgCgeiwP4womNnTdEyNiY0RsjIiNEbExIjZGxOYTUtxBvMzhDLMAAAAASUVORK5CYII=>

[image32]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACPklEQVR4Xr3Xv0sbcRgG8Ac0KkUqUWoj7WC0aLWkIJ11cFGKg/4DHcTBJVNcAkX3SilOTi6C+B90ECyB0qX4A+zUQTpJcZC21EGoEp+7bxK4571LLiHXBz7oPe/rJWq4XFAul+FhNmizevy/BA+AfVrWpSQFD4Ae+kwzupgUWwBDdEojOkuCKfwSmKKv1KezdjNFbQAs0Ufq0Fk7mSIwBIq0pX1cXUAuC7zlOTI6qzKFYnZpVftGJoAPi8DfHT7EK+B3BnitOx5TKKabSjSrsyhMagy4vPNOTz9oHDjSPX9XizDMIJ3QmM7CMB3PgJ//Kk/gu3sCX3TP39UiCpOjI0rrLMwLYH0a+PUOuJsErh5FXFtMUQ+zQAfUqbMwzNPHwAq/9uqstqNFI0yBtrVvlSniYPjiRl77VpgiDiZFhzSns2aZIi5mgI5pQmfNMEUzvAevPIkBncVlimZ5/4bKvyOlszhM0QomTzvax2GKVjHbVNC+EVMEhsBD7aIwnXAXqQWd1WMKd7LxZWD4Anh5BYx+YvFAd8IwabjLdU5nUWzBNxLejV0C1/4UeH8LZNd0LwrDN0L/jWtQZ2FswV8ZmP/jHtxzRs9LulcPMwv3Ft6tM2UKd4LsOe/G+M0FLd4A/fO60wizSrvaK1NUfngYmNzjH+Mb8OSNzuNitqiofWBHi3aC/3ryb2yXdFbb0aLdmD64W/wpnflzLZLAjMB92BkyMy2SwszAfezrCfS6mCSGFzjsBzpdShqzSRvV43tQB6zrBj4AvQAAAABJRU5ErkJggg==>

[image33]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAChUlEQVR4XsXVS2gTURQG4F/6CEGllCpCtFBtNUWwFIPgwlUVwS50oaGiICTmSRqkFARRMAoibrWgUBQ3rgVREdwoFAQF0YVYXIm6ELWgNCKhj/jfTBun50wmoxnihY82/z2Tc+fOZAblchn/kwqaTQXNpgI/cbRsAEZ6gNP8f62cr9TIwE/dwJszQGkCWAgBM1xEl6xRB/mlDYgcBWYrLeg2sNgHXJJ16kC/cGw7APxYXsBVYH4zMK7qZNCofD4fSKfTI6lU6l5/MPj8CBcxBvzaBLznolbLevUF/4oNd9JEMpks8u8iHTN5OzDQCQyz+Sp5jKGCv5HL5brY8BSbvaayzXlZW4sKvGKTSSqJxsakrHWjAq945sdlc177R4VCoVXWulGBV4lEYjebztgW8Coejzs+bNyooB5zhmx2kR7TDvpEHzOZzEZZ64UK3GSz2TC3fooNx5fvau7EEA3IWq9U4MQ0Y9NRXuNn5qzlfCNUUAnRHQd6p4HwVCgUPsSmD+lKNBptl7VOONZQjIblnKQDtA0Ce4vAV36YLgcC/XOxWGxI1jnh2EO3aJbu1Hr4rDhGBQjfBO5XZixjJaB1v6z7Uw++6MCXHt6RCYwn5G23VICOfcCJn3yD8kORtn+Dw7uc4zA9oHlbY+Mtdcr6WlRgffnW6/QF2PKB90JSzls1uCEaG5+pR9a6UUF1gvsuMzG/jr7bmnPXsEvW1aMCLzgi9IIuw7oEC3RQ1nmhAjccLXSWnlLfUnaBRmWtVyqohaMX1t19zizEltf9qblRgROOk7C2PCLnGqWCFZPAerpL1ygo5/2gguoEf070kmo+hPygguoEry11yNxvKmg2FTSbCprtNz6boLuBLkm/AAAAAElFTkSuQmCC>

[image34]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACo0lEQVR4XsWWS0iUURiG3zIVu0LYoiyixsyRFkWiaFGLQFpYLWJqMYto7g5MMaGUEZW1rCC6LAIholUukoaUFkXRbdMikG4S4cogyMAozLCm94wzOX7fX+E/w2ng4Zzznu+c9zuX//8H6XQa/xMl2EYJtlGCbZTwJ5YBez3AgBe4BmC57HeLEpxYDLTsAsaGGd5PVgNvZYxblOBELfBgwIRm2Q6Mchc8Ms4NSnCCW99xAfhhwscI2x+YQImMc4MSnOBv7hrg/npghObDvAdBGeMWJfwN/hZKrVCUYBsl2EYJtlGCE7FYbEMkErkbDoe3yr5CUYIT0Wi0neZXmcRt8pT1nbyQs2ScG5TgBBO4Q3aEQqGNxpz1G+RhIpEo+KlQgsTn85Vw1a+NeT5M5BD1J4FAYIEcMxOUIKFJI+nliptY9pBbNI+RTtLO9qNkMlkhx2UmBxYB1ScBr/mAOb66lSChwVFygmbnWO5juYfleDAYzB3JeSZ3WI7LTI6VQ0D3T6CPDc9np6+oGiTh5Pdo0mrOndvdZEyZwBvW67MJNJsjisfj86ebV2wGQl+NwyQ9pPainF8Z5sOJS8mgMWICXeQy26fIEOv7c/eB7bNsH5ueAJYCWz5NJXD6O7AiID2UaT58/jdx4pt5Rm3kCGnhynez7CD95BXjOuV4oO4K0DgCtPLzveo5hVIVI4WpwZjHc+6i0fFcAuYimotH+mj6kuUZo8uxYp5KUiP13/1KAGYDa1PAuo/l5XXjVVXN12mWJCnywmz3v0xnghZQybfcwW+T5zaRLitrmPD7/Ze4+noZWwy0AG83kMpeHMMBJjNnm4wrFlrg/gMNX4B3bDwmnvfmWGRcsVBCRsQS/u+secbd6GWjWvYXEyXYRgm2UYJtlGCbX/jwy7cTzAQ0AAAAAElFTkSuQmCC>

[image35]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACIUlEQVR4XsWVz0tUURTHvxaWjU1pKO6ilGlmmBaCSKQICtHOcOlmYBrmRwwMtDIRJMo/QVwWRLtAXLpQV+6dFta+FoJYKFSbiqbvnXcH3pzzZt74HJ8XPsy9n3su595z37yHarWKi0SJsFEibJQIGyX8KBQKM+Sx9EFRwo9isfiMG3gufTPYRhLAah8wI+dq81L4Ud9AqVS6zv4r9iMyps4QMDsB/FhnmjzwKw68lzFqkR92Awtkk8zJeTcxoPLVpLCwEkesyFV3jFrkh93AF/JGzkmSwHbFJv9DRoADbuCSO0Yt8sNuYJns5/P5cTnv5hrwgFU4XAR+jwPfU8ALGaMW+VF/Bph8lL+fM5lMn4xhu0yu2H53FHjC31syrjYvhR/ZbDZaLpdvmH4ulxtKp9O9MsZgEkvnhRJnhc1zQ81QIihsPdK1gxJBMfcuXTsocVpMyUmX9O2iRCtMmUnU9rvbfdBaoUQzgNQakOSbbPQbEP/guMaXShCU8ILtNjB9Yl9q5OlPFmJSxgVBCS+A/nngpXmb2g28I7EVGRcEJbxw7v4uS7/LwUeSOqYblHFBUKIm+cUid1zjCOHXNLkBJHY4HJNrgqIF7i8B93jaR7zz4U8UAzKmkzQOaic3yf/au377j3f9Wi7qJI0Dlt05uTMD7JHkllzUSbTA8L5zcpN8yvzdHsqYTqIFcNOU3Zz8vJMblAgbJcJGibBRImyUCJv/Tg39zDZF5PgAAAAASUVORK5CYII=>

[image36]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB50lEQVR4XsWWvUoDQRSFL0FJwDQSEElib2enkDyAoKTyAQKxEmMnYuEbaK02xsY3CNjaKjYqKPgUlhYW8ZzsEDbn5mdDdHfgg9lz7z0zu7M7O9br9SxLnJA2TkgbJ6SNEyaBtgA2wD64BI8B9qkxtqB1k3DCONBa4A3cgiNQB0sB9qkxxpyW1o/DCQpaFdyDaw6mcSVM6CrUVDWuOEHMGuAdbGtsGqwJtQ2NDeWpEDMog2ewrLGksDZ4lDU2yFEhVtwFddVnAW0R3IEXjQ1yVAiFfKPPVZ8FtHXwBM7ABT01p5/nBLMCeAV5jSUF7SB4bIbrfLguuFwnmG2BjupJQFuxaOluQFFiHXq7GieYHYK26goHMFvdNSs10c+BHfAB9jQ35Lfp7XQnRDOtqS45GHDt0+zk2+wUVL6gPYCK5sZqavR2uhPwxtqUDSe6aw4cOZgd//BpaJ74coNyX8OoxAQT4KPn3UcO0WRKTc0T38QTSLIExWgJODAnwr7lNE9qEi9B0pcwFy0Fn8bwGz8KetLb6U6Y4zOcBD3p7XQn/MFGpNAreE7fiELB3FtxHHrRU/V+TIVY0dw/o+DDw0pX9UFchVhhtr/jYJDdgSRmlN2RbCgxq0PpUHKWx/L/wglp44S0cULa/AIc+RV0x8uh3AAAAABJRU5ErkJggg==>

[image37]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACn0lEQVR4XsXWz2uScRwH8K8+Phrp/MUWsoOMgcKEbuo8BxUM2T/QYdshkC47DXFdumTQoRWG5+oyBA/B2NihQx1iJMZ+iJujqEXF+mFFRv6cfvo8Npf7fvY8+uzw9IEXyJvP9/v9+PVBZQDA/icSaI0EWiOB1kigNRKcBpYFufi8HyRQC2sGfUZF9ADp+B4lJFAL6zmSXki+IQ/fo4QEamF96BrgKxL4HiUkUAPrLPt7/Z0B3vA9vZBADazA4bvuDLDE9/RCAjWwrqL64eEtFOV7eiGBGlgPu979d3SR7+mFBGpgbXUN8IWd4ruABEqwvOgxeoGS6Ef3AHx/P0igBGuj60BJ5XCIX6iEnqDryMyvlUMCOdKm7PgTL6eKdvn1ckggB+syO37lSqSvZSu/x0lIIEev1990Op0tm83WstvtIAhn+EO7STfV128CCeQ4naFUMpmETCYDExM7MDJSgFAo1BwcHGw6HI6mxWIBk8kEOp1OGmCfXy+HBHIEoVAbHy/CwsIr8HjKMDpahmw227a6ugqJRALi8TiEw2GwWq3L/Ho5JDgJY/dmzOZ8IxAogddbhtnZ9+B2V9qHr6xsweJi/miYYDAoXf95fg85JOAxdsshCLvVyckczM29g/n5vTa3uwqpVB4/igq4XDW8hU1Ip9dgYODKJ34PJSTgGY1L2bGxlwedgzv8/lL7FiKRj3jtRfD5foMo1sFgeJrh91BCAp7RuJwzm7cbfv9Ga2pq52iAWGwPotF/NzI9vY8P4XaDsUcX+D2UkOAkjN29JorpZ6KY/SkIbw9MpkLDYsnVHY7N2vDwen1oaL0uiq8bBsNakV/bCwn6wVjcx9jtS4zdwf+D92P4kEYYu3GO7+sHCbRGAq2RQGsk0BoJtPYH2mrJwy6azbMAAAAASUVORK5CYII=>

[image38]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADHUlEQVR4XsXWX0hTURwH8O/cBE13d3fvtrvdXXU5K00TKVOK/mBFRYWCb4ZgZKkQFlEgFfbP0AfFl9THiF7CIMgKgqBeQwnsDyRBRUEEZX/sn1mi67fN6TznandT1oEPzO8593fO9Z7tHgQCAfxPXJBoXJBoXLAQ1LKBwjOA2kSfzWy/Hi6IFzUZWD4MXKE/OsaBzCF2jB4uiBfgvwhcD1UM2/sDEHLYcSwuiBew9BDQNTGzgB2fKcxjx7G4IF6yLFeYzf5fwP6fwLYRoOAaO0YPF8TD48koVhXvoyxHlgdIKaM719gxc+GCWHk8njya/ImiZGazfUZwQSzcbrcvPHlGAdtnFBcY5XT63DT5oObWSti+WHCBEfmaJnkV7wDZyvbFigv+5azV6tguuUaOCeI5ti8eXDCf44qStkdyDrelCbfo0seklB1DmY20kUZSTebdnFwwlzoguVJyvG0SxLt02RqyiwyR9FljgRNkNWkg70gSWysaF+ihZqoSHc8PC2L/1OQRwTttnTUeuBT1eYCtxeICPftE+eFBm/SMmTxoLXlJTNPjgSaygawjr8gWtl40LgiF9EsGrGgAllTU26R71aL85k94MnYBQcFHsjJqASK5QFoC4f0w06eDDwA37ZtPQOeEGTXjSrLv92hws/ETR7STeraOUXwAfy9wJ9QTZMH67/3ARp2JI+pIF1vHKD7Aqi7gxswCTMWTO232D81W8ebtlJQanQUcDQT/5TrFjeADIBfIeU+PkE41ld/old7bYrWWNwr2vnLJ+XGTQxmtpQ3ZkS50v7BYyuiK8+QIW8coLgiFQCqg1NJXvwjM2a7HZrOfstpO1orSYJmsjFbanWO7ZWe35tIK2TpTtWhPWbaydab72SBWnalCSZaiHqAXUy+9G56qLu9lVVGrVFV1APk99G38Qr9JtI/9r2kRWez1XMGFoJakKVqp6lJPKw73QJKpiB7jZGgW4CrJbeeuYYPFQs0ObP4a2czAfbKsjxvHBouJDqoPgOax8N0X0DkRPm4MGywmaibA2QgUtWKOEzIXJBoXJBoXJNpf6ppZF6ryxtcAAAAASUVORK5CYII=>

[image39]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWUlEQVR4XsXVT4hNYRjH8a/GjMQ03ZDC1IwZJsokt9nIxp8sZsGCGlEK2ZEmpfzZWEi2TFET2VgrEQsLihQlFjJZCQv5F81INzNz/N575l53nufec0/u6XrrU3N/7/Oe9533nPccoijif3JBs7mg2VyQJbWWpTDUBSf0d7vtL9bYIEud8OokFEZgahl81SIW2Ro3KCutkN8D48Up5DpM98I5W+cGZkVt9SD8KC3gIkx2w3FXZ4OGwTwZklsD8HS3FjEMv1bAWy1qga33F/hXsEFG5JtMy96Qt0F/DrQZzHFjokYXEB4qOCYvS1s945SrrcEFqcGoFMzEwairTeCC1GBflcnvyVxXm8AFqcHGKL7f8WXgRVTjZZPEBXVBaxTOM9yXdfJB3styV5uCCxLBGnkchfNceqphi/S72pRcUFWYDI7Kk+J/bfsb4IJiSOdB6BmDvkebad+p5K5ckDZbW43aQjkgg7bP8gGt62HrBHzWj7EoR/fvL2Gbqwy21DbJNRmXG7VePrPGuIC+q3C72BMbLuhkbbd1f+vRhw599HgjIQgekHa3XEDHNtj/U19Q/ZiQtdoAf7zUdskdmayYOHgtOVtfiwvii6+6LJ9g5Ts9C4dtf1zDFTNx8FG6bG0SF5Q76rzR1BbL94rJtWsM2Lp6XJCGWl6eyXniWzAlO2xdGi5IotYip+Wh9M5kZ+WIrU3LBbWo9RA/3WfCQiryukctiQuqUTtEvOV529coF8zqhCVyUy7JfNufBReUO3Sc5LnUfAllwQXlDt1b6bB51lzQbC5oNhc02x9eTZdlmnlz7gAAAABJRU5ErkJggg==>

[image40]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACKElEQVR4XsXWvWsUQRjH8UdEERVfCqMQCwNaaWx8I6QwNuILhCRoIdgaBDtBRCttBEPAIoVEsJDEVGpjIWqRKyxiiBFE/4OkCcTOSsn5nZsnm93nMd7u3boOfO5mfvPszsLeza7U63X5n1xQNRdUzQVVyw5EenEGm3V8EltxPvQ168YpbLAnyyMch8s43hinJl7gNq7hjWY1PMYlfMUzXMET3LEnb4Z2AfN4mWQ6sQXfUoWn9buGbu3fxKj2D2DaLrCecD58QBgsYU8ypwX7MPuHA2thMe1fx71U/Yytt2gn8FbiwqsGMzWp4jl0oUP0YqTFC6AdxivJLhxMuNrUQcfwFJOydgtGsFf74f5d1f5uPLInS53rIn5JdvEF7HK1NigL7a65gHO2plFngzJI/Jt+lvgPCsG4rUlqbdAuWj8+Yr+O72O7rUvqbdAOiT/U99hp59bjglZI3N0e4LnoLpqXC4qibcIEHoYLsfPNuKAI2g6JG80NO5eXC/KidWIGA3auCBfkQTsi8aHSY+eKckEztD58wiE71woX/I3ER3F4qnXYuVa5IDOpm4n2b+E1ttm6drggmWDvxrLE+z0m8SVko61rlwsaYXzaLUrcx39gxNaUxQWNMD6SQ2fVFymwvRbhA5Ehs3jwE8O2tgzZAe9q+J5aeAVTOGgPLEt2kH2NCr/4o/aAsq11eN3ShaelhB0ur/gR9/V3OGsL/rX4wVuunaiKC6r2G9XQOYQ5NSM0AAAAAElFTkSuQmCC>

[image41]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADt0lEQVR4XsWWbUhTURjHTzpTM2UuderUkBgaQi/aywcJP7TAHIELp5i6fN1sRlD0LSSLIIRCCPxQSrAswSiQRlFfJCgFP/ShlEoihppvy3cK8iVP/6MO5zn3bktzPfDj3Pu/55znf557z9kIpZT8TwTB3wiCvxEEfyMIciACeO1fIAhyKBSKJzCh5vXNIghyREZGjkdHRw/CRCr/bDMIghyxsbGjPT09VKPROFGNLP75RhEEOeLi4sbQ0qGhIZqSkjIeERFh4vtsBEGQIz4+ftkAi9nZWZqZmTmpUqmu8f3+FkGQg5WeusXCwgItLCycioqKasV3Ecj39xVBkCMhIWGdAVfU1tb+gIm3MLGTSozzhiDIIWeAhc1mm4OJPpiIoxJjPSEIciQmJsoaYNHR0bGEbfoNJtKoxHg5BEGOpKSk79RL9Pb2urbpcSoxhxSC4E5lZeU+rGgbIzk52aOBxcVFOjw8TO12Ow0PD/8FyqnEnDyC4I7FYhkwm83vy8rKirVareQraGpqoij9JA6qAaz+HSplV6vVd4KCgs7D+A4qMa87guCiqqoqDclfAD2u24qLixc6OztZTjoyMkIbGhp+s2un00lxSA1s9MdKEFwg8QVwA68hIy8v7xhiqrGxkba0tFBUY1ypVI6xU5FFTU3NbFhY2Bl+Dl8QBBdI/gwrN1RUVBwpKio6i5Nvoru7mxoMhjkYagsJCTHh+Qz6LlcEVXCwb4WfxxuCwKirqwuAgU9s9UjyvLS0tDk/P3++oKBgPiMj4xK+jTY8v4i9388+PBbMTGho6Gl+Lm8IAqO6uvogqwAMmNDeysnJOaHT6ZZyc3MfM1PQjoIPMTExFrTTGEMHBwcpfi++8HN5QxAYWOFlTHwd7Wms7LZer9ehAl3QbjIDqyaugnqY6GevgIXJZJoODg7W8/N5QhAYSPwSnELyw0jy1LyyG+7ivn31tTD9HFs9TsgaVGy5Cg6Hg1XhIz+fJwTBaDQGmlffvwskzFpNakHbirYPrQ0ms9F/O6rgGB0dpSxQqakNn4SE7NKpVAfulZSU2Fni8vLyQ2grkPARSwoesKRog9zHYUcUWa3Wqa6uLoqPdAJ/3+r5RHK4Jde+IsT6k5D7SwpF6hy2WzsSfQYtWO1JPum6SXAI4R/SV5yGHbjezz/3hGsCNSGZE+xuhdc4z9PfeErK48uxK4VrsJKQ9PE1A3awt5nvvBWsXZDUh4RkzxByZZ6Q3U4IGr7zVrD+hpA9hKiMaH0u/WYRBH/zB6m65TmQX9ALAAAAAElFTkSuQmCC>

[image42]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABqklEQVR4XsWUO05DMRBFjWhAiIYmkajSpaJLm5qK1FkDG2ADVCwge6ClSccGWAA0UCMkOiQKULgX50XOHcefh2RGOtLz8W/i2ONWq5X7T4xojRGtMaI1RrTGiBoQB2CmvgYjSkHsgVvwDS60vxQjSkHcAH6QDzDRMSUYUQLiMti84xWMdGwOI3LwuMFXJAHyCE50TgojcnADMFxzBu6DNjnUOSmMqGG94VJ9DUbEcP7YzdGmEkCcg4F6xQjF+QvH/3wY6UslcAVewFj7tsapCBbgOw+fWp8E+PEOptq/GadiPZkVjkWm25zwwoWXbdcl7LgO5n6Cue6TSmDmfIULE+BGS4HuLeLJk8x/BsdmLxVBErx4rHDdAn3/AvIQm/87ToUsMnG+wv0lgTtwpP2bcSoUxMj5CtcngQXY176tcSpiOF/9TIXLJHCqLoYRNaQSKMWIHM5XOB4v4VPjbe/apOiXb9ZTkQMxcL7CsaEsdHwOI0pAjJ2vcOHmvO3JCxfDiFIQU+crHBt85zufWgojakDMna9w5omWYkQtLlJeazCiNUa0xojWGNGaH/mcQchaA0hKAAAAAElFTkSuQmCC>

[image43]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB8UlEQVR4XsWWPUtcQRiFT7QKJoUWUbCImMYilU0KwV9gpf4HQYygzYZEAoEUBjGggoiFpQiCgoWo8aOwCIFAhBRpUoiCfYqEpMl65s7sXfe8I3ddZRx4YOc575377uzcy6JcLuM+MSI1RqTGiNQYkRojYnC8IO/IFvlO1slr0qO1N8WImhBoIfPkf+An2SdnxBX8JSXSrNfWixF5ADwmP8KNF0mr5J1kIzTyiTTpGvVgRB4AS+HmA+K/yHwiNFHSNerBiEwC/eHmc5HsJOJ2yD/SpVkRRmQS+BgWbIlksQaew+/CiGZFGJFJ4Ih8Ux+yWAMPyC+yqlkRRmQSOCfr4fOJ8Efmm6HuK9nVtYowIpPAIRrbgWXNijAik8AsGjsDk5oVYUQmgT74p2AhksUa2IPfgTbNijAiD6pvwCHx2zJ/Bf/t3+sa9WBEHvjXsHvvu8kKaZe82zUTcscxeaTrFGFETQg8RHUnnDglB+QizH/Dnxf3yq40MUWGda3rMCIGRy95A/9bfyZr5C15EvKOK01UGNd1YhjRKBzT0oBjTOsUIxqF42WkAceo1tZcp+I2wJ8HbcCdn0Gtza9RcVs4ZiJNzGhdXq/iLuD4cOXm7kl5qjV5rYq7gmMU/k/NM81q6lSkxojUGJEaI1JjRGqMSM0lAwBuPtJutfIAAAAASUVORK5CYII=>

[image44]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB20lEQVR4XsXWvytGURwG8C8mvQwMKAOxGEwWg/IXmPA/KKFYXiGlDCQKJRmMUooyyG+DwaIog8Ugym5QLF7Pufe43Od7da7r7Tj1Ke/zfO+9x3XfGykUCvKfVOCbCnxTgW8q8E0FSbDaYQp24Qa2YAxaePa3VBArRXKwBO/WHRzDA5iBV8hDGR+blgqiQqQSbu2FV6CK+nrYths5glI+RxoqiAqRVXvxLu5obthuIs9dGioIQpFOe/FF7pJg7cMbNHLnooIgFFmwJ8xxlwSr1d6FPu5cVBCEImdwxflPsErgGTa4c1FBEIo8wpb9+dphx85dwgGfy0UFQShyKtnuwBp3LioIQpF5yfYMjHDnooIgFOmQ8FuwzF0SrEN7B6q5c1FBVHy9AXu4o7lR+9tPc5eGCqIifA2b9775sA611DfBnu2Nc6jg87ioIFaKlMvXnTDBPZzAk/38IuHzYl7Zn5uYgF4+109UkASrDcYl/FtfwCZMQo3t675t4tMQnyeJCrLCmqENGAM8x1SQFdZgwgaMfp6NHcfBX0j4PPAGzPPTzbPRMRz8FdZcwibmeC6a56AYsGa/Xdx8Uxp4JprloFiw+iX8p6aZu9gcB76pwDcV+KYC31Tgmwp8+wDIKX+hw05IzgAAAABJRU5ErkJggg==>

[image45]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACe0lEQVR4XrXWTYhNcRjH8d9gMSYkMkjmLshb42VBKSUL2RDyslGKbIxYyZ7cpQWbQSbZSLMwsSEvxcyOZoZME0LZKAvE4q6U43vOue7c8zxn7v0f3fvUp+75/V/mzD3nPucoiiJlSEM47PI2cQHRArxByY21gQsS0naMYJYbazEX1EjnUXZ5i7mgRpqJ59jhxlrIBRnSckxgoRtrERc40gHcd3mLuCCXdA2nXZ6DmosOm0/HBbmk2RjFBjcWbyIdxCAmMYa3eIYy5tn5mbU2mJbUi3F01RZzb1T/8G30qu5nS3XjOF5jl9vv3zwbNCT14UaykBPBKPa7eXWoJXiEQ3YsGbdBU9VWzYZX4v/Qjeeg5uMVut2YDZqiVVekj+ukp26sAWo3brncBiFOSle/SO+iAq2amoH3LrdBCGrwg9QfFWzV1AiWZjI7KQQ1fkzqjAq2ampA8YOuPrOTQlB3sJZPPVGBVk0NY3Ems5NCUGdxJDkObNVUByZdboMQ1EY8iTdNsoBWrfSnO+ByG4SiLuFMcty8VS/ChHIulZsciurESxxNsrRVj0V1rbo6r6T02u+zeyTjNiiCmoPrGMLmSvyNTLXqHpyqnuRWu7a2hw3+B7WzeiIvHks/eQJ95vM9nFN8eXLW1NbaoLph/KBZZvMQn7jeUfrTLNmxPD7QqgfStu/Slm/S+psq8HJRU+CtOnugrj3SiUqcpvb+UtxwchY2JV3ARZcb2QOt7pMu/5k6gfJvvtGgR66TvlUPR01adfYguXNX/kjXPcSKr/HXYhcFC2jVPuDm4z64K23q5/MaO14Y74tRg1btgrZo0Kpd0BYNWrWf3C7TtOq/lYtr0rz3jsgAAAAASUVORK5CYII=>

[image46]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACBElEQVR4XsXUMWhTYRQF4GOqVuxipQVxKI1pEcFBB5EuIjqJDkIbXYwkQxKJDm4F7ZCCQ6cuInYV7GjBQcTFqVNpRXGwoItIhmJBKEqhIvHc5yOEex5pYx9/Ax/3f+de8t+EEDSbTewlCUKTIDQJQpMgNAlCkyA0CZIUi8VD1Wp1oVKprNAXOxcKhT4/5/HV3w/csup7rRkfJOGFF3jxnJ3z+fxBnj+Vy+VxP9cuC9w+Dfx4BPyxas9+xkiQhJf28MICPaNXXGCNS93xc+1ywOfv9vZk1Z79jJEgCS+doUVeOlYqlQa5wEe67+fajQKNjXgBq/wGvvoZI0ESXvaG7sbnAdriMlN+rgW4+ZgLXAZ+zfOKi8DGCSBxYQmS8NOf46Uf4kXe0Uua9XN8uyM0T8/tzB/f6AgwY1VmYxJ0UqvVjtXr9YzPI8Alek83pNeBBF0DemmWXtNx6W9Dgq4AZ2iJ7tE+6e+ABDsCZGiSFumk9LsgwbaAYXpL07Rf+l2SoCOgSMt0Xnr/SYJWAwfO8tt9YpVPA/SCntJhP7sbEkQhsg+Aaz+BhWYPrm5O4miD6RU/lwYJohDZb/wTi7pWMxhu+Jm0SBCFyK0Ca/ECVnOrfiYtEkQhhiaAU+vAw9//6tCEn0mLBK0G0Mff23WrvpcmCUKTIDQJQpMgNAlCkyA0CUL7CxZVLiO9Er0LAAAAAElFTkSuQmCC>

[image47]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACt0lEQVR4XsXWTUhUURgG4HdsBA1nxtEZr9wZMjXLykTKkqQfrCApMHBXBEVGCTFEq6iwIMsWmht/dkW1CYsiIwhaRLvITURgm4pWQdmPSQyG5O2dvxy+705No9wOPDC+59zvnHvneObCsiz8TypwmgqcpoL5YKuqB86ZwEl+XiT77aggV2yly4GJGyzZB8wsAV7JMXZUkKtqYOBOrFzSPuC7F1gmx0kqyFUlcGyId55awE7gC5/KSjlOUkGu2AI1fOyHeOc7gMk64JYcY0cF81UAtHAxYZlnogKnqcBpKnCaCrICuFSWIxX8FVBIT6hV9eVABX8E5NNDukQvqMlmjC/ZH6H9VKXGpFFBRkAe3aaLtI52WbHjFigS407RWuqk9/HrZK00KsgIuEIDyclTYnfaI8ZdTfs8puoIKrAFXKbrYvKY9fTGSt+U/CWkTbSR3tI2VS+NCuIhTzJgRSeweA//6qK71CgmT3lEq9IWUEwXqNtK7Ie5Phs6AMq5bz4D/T/zcfBHM8ITVuJO5cQpvXRU1smWDlA9ktjoiV43mqeeAZttJk45QoOyTrZ0gDWDwL25BbgaZ1t9/o9dnuL7DwoKDtgs4IQVe+Q2xbOhA6CW7xEf+BXOAO1T/Ekf6fZ42iJe/2hbSfDTloAR7fCVjPcVeYdeu90tvOI8HZd1sqWCeMjTDjA6eO40QLzbDft8/jMe3+mO4pLnLaVGtN0fnN5dGhwKl4XrZZ1kLe4p93ZZ53e/DP5Vf6F3Q4VhHjaN0EjICL00y0LXTMPca5pmAFg9zP/GrzyTotxb77iICnm9KjgfbHlhI9xklplnjUD5WJ6rgV/jbHwW4CbV9qprZLBQ2PzA1m+pzQw8pppRNU4GCwmofMpzbDpx93WTDJaqMTJYSGwuIBgBGnqQ4Q1ZBU5TgdNU4LRfFd+AsxcJyuoAAAAASUVORK5CYII=>

[image48]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADJklEQVR4XsXWWUhUURgH8L82aqEFTmVuYwmVWVYUgcuDlC20SZAULSgtD1I+lD20PFQUggSRRJRpRsuLQRsJPbSIFARFWYlhUOlTUFEUFAQFefqfOTNy53wz451Ku/BjZr7zfWfO3HuWgVIK/5MIDLfQAJBAlXbSUAoNACPoBJ2nRDt5KIiAH7CdOmicaPvHRGAAsIg6aYZoi5W5s8voEjU422RyaGEePfEX221uABOpnl7QSSqyc2SRDfDSHdoh2iIBFtL1QN1qFWU+iUBYZnU002nyiHaTk6LM3HmmzCSeLXLCEIGogFq6RamO2FQ6Tq/pEE0QdVGIwKCA5fT4K1DB16v0nLZQksh1QQQGpX8h0P4D+NUKnBPtMRKBiIA4qlZmVazoBEr7gC9TeBcAjBH5LolAWEAB3aWDNNIRn/8O6E3lMuMgCkWdCyIQAhilzDrWzzpXtJucdR+BGxzAQ9pH8SInChEYACxVZh2vFG02oPUbB8IvP0rtlCVyIhABZZ51A11Qztsdjdmsumksv3wJzCNZJfLCsDuKpzPK3PY4OzkqYCft8ncKjKebdIrmer2Zt9PTJ3POotyusztppN12kit6c9IrxBHjVZuZmddfUXFEVVdfVj7fTB3cFJLj6KCY7sX8y52Aa0rvjIHPegCFhetVU5Pyq6lpUzk5BX3OGmex/vLpotNYAMdoQfAzr8V5eaUDA6isbFZeb0a3syZYqM/rHtFhrIC9tNYZy86e9ik/v0yVlFSptLTcfg7qFZUF24OFWUrv6XaHsQLOqnBnPrDZ40ncw9dk8lEH1VNCsNBDj5TbZRcJ0OXvy45beMXTfnrgLD5Ah+1k14AN1CLiUfAqdnaQpMyWW6f0FhymIFCUzonewp25B8ipCtQW0f1odZGEBsw/Hz2TXypz7ot9nX8TeRBe4Zv3Kg4bf27FaP1B/3nNsHPdEAE/ffCYTUkvzTZlTsE1XcC2RMz7rquMXpWB/Dd8kyz6cEkEBDNB9XGsn3FdCnw8dz4EBnCRyyqnUdTEQAQGA8wqBya9BeZ85utT/OXKEQE3eCXqNWzH/4QIDLffcAxg9gvyb7wAAAAASUVORK5CYII=>

[image49]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABbElEQVR4XsWUO0oEQRCGSzHVRAMxNZS9gRqZLXgEvYSBZzEz2BvoAQQPIb4wMfBtpKgL41/0TLvWPwv2g3LgY2e/qmb+6a1eaZpG/hMS3pDwhoQ3JLwh4Q2JPnDtgiNwBc7BAVi2fTmQ6APXADyDT6BiDG7Agu1NhcQ09I3BHrhsgyinYNb2pkAiFkR2wKDHr4NHCTvxCoa2JwUSsSByDF7AivFL4L4NoJ9rdm0KJGIhDNwX2Dd+KGEe9MsDmLNrUyARC2Ha9eZawrYvgm352X7l1q5LhUQshKOm067Dpg/V7e7eXPkA72DTrk2BRCyEqdefoTt6k+jDu3sNlR2CxK8izjk4kTDtugN3Es7/20SAohAkLLhmwBZY1fvWbYCnGiFI/JVaIUikUCMEiVRKQ5DIoSQEiVxyQ5AoIScEiVKmhLiwfbHfihqYEPpPemh7Yq8VtWhDnIERmLf12GeFNyS8IeENCW9IeEPCm281G5G4qh/bDwAAAABJRU5ErkJggg==>

[image50]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACb0lEQVR4Xu2VzWsUMRiHp4ofKB5K12QmCUsLe9BD8VBoBQ/ipagHQfAiePDiFyiCCqJQqOhBy/oFgh9YUSqCWKH0YNEiVilFpKKHVqh6989Yn+xm7ZhxnXXajpcGHvLum0x+v51J3gSVSiX4nyQSWaD1wmXY4o+lkUj8K7T1MAISxv3xNBKJrNDaYNLPp+Evsg12wGr3uxvWwS4bu1wn9EBL7LlVMApdvkAacfFhOAuHYMzlJuA27IMZeAT74R6cc3Na4AHs8Rdvhrr4Wpj9lQyC7a6fgE4Xn4Kyi9vhjYvtW/oEdyy+QBp1wRA+JAZrBtpdfBT6Y/Pf+/OzMB8EwTR0gKibydtAFwzC42D+EwyAdPFuOODiVrjuL5aFRCIvlFJF2ycG8kCFuqxCM2DjxOBSQluphH6opP4eSX2tmvMnLRWlUmkNwqOR0M+VNDdzNVAoFDYood5qqYciaQ7naoDNVuCbf0T8rhXPbIC2ws+lYXc6YrNamht18cwG+AdblVQ/dKiH+Y5HWHyTPydOFEWb+eZflTBX4uILNKDHefAiRp4QT9ndbDeWCtVxI429Jas3pAlNd3VMmAu++EINvPptMfsmhOm3m4tz/a5myLyk/4bAeV948Q38gVDoPjjt53Mz0AzLBpYNYGAwNwOhUGc4qrcQHYFpe0SpG2PRRrNz0Q0gcILrtsy8pzBZqwt6Kgr11UiYvabNaH/dhFAjfAOc9WO8xkvU+SHyrxGeo/+MifuU64O2FNcr499IJBrhDHzRQr+gFM9ww81RCZ9h5iRluMfe9/4zzZBINEJK2YF4H/d6b7FYbPXHs5JI5M1Pske1Xis8FAQAAAAASUVORK5CYII=>

[image51]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAA/UlEQVR4XsWWOw7CMBBE5y40QIsoKBA9h6FBnAeJgtMg0XAQOkrjCYTP2oHE3rUjvSTedfImVRbOOdTAH2PPOWiU4CXnVTat+ZQ3a7nBEilvanKTFTF5U5cbLVgC85icBJu12QHrEXCNyUlQ0ITyKXDzn36RvZagoAXlEy8/AluvOcl+S1DQoJUfgI1XLIoGEPJZ0QARebkAHfIyAX7I7QP8kdsG6CG3C9BTbhNggFw/wEC5boAEuV6ARLlOgAx5foBMeV4ABXl6AMo5TDz/53xJKis3NABnOI5RzSTDh/PZS0dngK7p1YrvRWE5ed9UkJPHqZKcVJUTHtXk5A6NVQab3hQD6wAAAABJRU5ErkJggg==>

[image52]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADeUlEQVR4XsWXWUhUYRzFz01LpxRGUyPLbBnDxrZZBKflwckCH6xISKKICrKIFg3aaCEpeoiKSiidNoqiXiIKeksyLEpaiagQ7MEgymxVMsqczh2U9P/NvTNzH+zCjzvzn++ec+63KoLBIP4nSmGgUQpW4ZUzCdjEu1P+ZoZSsIITWJAPfAtQzs97DrBTtjFCKVhhHNDcpkuRP8QBtMg2RiiFUBHQSKas93LcgYRTbswOeLCn1o36GQno/NwT4BvJAt7JZ4xQCi5gYy7wgV35hWP6gEHSjvhgo6GfhvtqPWggz2u9uMz79lNezC1Mxo5pGtoPAd0z49BVmIDNUteI/l+A1Dya/+p5m7MUXJyBtzR6VuPBRb7tltMuzGEYj2RVNop9SaiqdIR65bo0MkIJUAx8D5XJU+IajEZpFgn21M0aN0qkWTiUwljg9SW+uW7OYfgxPwNLpUEk2GPzOEQveB8q9SVqAUgssOFWkQ3NPjs2SfFo4ZAdIIelvkQp6HAMK8heKRoLgenIZy88ZC9MkfrRBNhPKqVorNR4sYQ692ijSQ/TAHywlgIrpaAVOCHPMUS59DANwK67yocXSTErcAhmLR2J904NTdwx748AxkUOwN3NaL3Hij8Na0s1/P5Kq4dkDPeZyAG40+mTSIpZwRuP2w09+4rOEqCDKy3XNADH7aUUsoo3Cfsrga5uWrUjdFC1MkCKaQD2wCspZJWjbqwvTUErjT/xmH4zESjr69XPmFdcqi3eVzba1nJgCnxSzAKL9Jc54zI+WUWA3BsalnUM0qq647QJbWVZWBBGNFr8NH950guXNA0bQHcHCnuPdXIlmDHEcT6McDQUcB41MsBCaSjpG2A44NdXS0+Aa8FJyZlN+qkWxsAU7iPXyVZpFo7+X+CoA8q5TA7xL6vxH3c5sYZvcpch7vBg2RzN0qRxNduek0ZGqAUklwB5y/khvbcWyEceu/MEaWKgkwEvinsNdzsx22O3b3DbEyr0tyb1bDdY6hqhFMy4MBXDAm6spsFjBqmr5oEVr2W/07DtV5y2+ueoxKwfR/KQKp8zQylEC3sl359ufzRIO6bvMSElfQUBSZNlWzOUQixwqMqB6q5/E3cFAyQWyXZmKIVY4JXBydoCHPwNbO3kJH4i20RCKcQKryFA1jr+GzGXn23y90gohYFGKQw0fwGFfITEJA0riwAAAABJRU5ErkJggg==>

[image53]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADHklEQVR4XsWVPUxTURTHMfEDHTRx0M1EFgcHB2NijNHFwdFoujgYBigfCRDsYgwhJE4wFQakfJRQSiDQxsF0MmkYoAlpInWrFCIBq4WWFoZqCpbj/7z01ffuvaUlbZ4n+aXpeefc83/n3nteHRHV/U8kh9VIDquRHFYjOWqFzUbnm5vpXksL2e12srW1UYMYw0iOWtDURPdR9CsgAQ+4YoyVkqsFb/0ARf4oiutEuDt6vLRANTQ2Uj0KxBRFTUDkOz3HtMDk5GT96Ojok5GRkaflQNzjvr6+s8Z8LP5QLFaCdUkAFn3k8Xh2FxcXM6FQaL8cwWAwPTU19WN4ePiWvgYOXIeimIrjjg66bBLg9XpDe3t7dBrb3Nw8hmgP/RPwSlFMRQ6c45yiALxN3LR6CUun04T2E4vNZrM0MzPzmQprYG9vK4qpCOs5pxbgdDqptbWVEomEJIDB4h8UBUWe6fGnErC0tEQ8Vfx+v/ZfJQDartnVM0AD2+Q0xlcsgFvf2dlJvb29dHh4qPlUAhgUusSF8BsvFOa58AW+52JsxQIGBwehvoU2NjaKvlICjHBHurvpoujXqUjA8vKy1vr5+XmTvxIB5ZAEBAIB6u/vp1QqxX8pk8lQV1cX9fT0FFuv20kCMNRseBacnp7+DtaBd2xs7KYYJwlYXV2l9vZ2cjgcWruHhoa01sdiMa2o0VQCEH8Bo+ETLMPi2Y6Ojmh7e5tmZ2eTEGI3xksC2NbW1qgbG8fXjVs/NzenPzKZSgCKv49EIr+FUM1YyMLCQgpT9w6dJICN7zlmPQ0MDFAulzM+KpoowOVy3cA5SYpxRuOuoAvFnKKAWoxiTMgX4XA4K8aJhlo7+DlDRgG1+BhNTEy84e0rZz6fb2d8fPwqGQUw1X6O2c/iDLWUhi34SYUck4Bq4bfCmdjlw1bKtra28hAQoEKOtEi1uN3uNlzB/Xw+T6IdHBzw/icwD65zLCMtUAtwNt7ynY9Go/lkMknxeJxWVlZ+wf8Nxe8aY6XkWoHD2YAz9Rpv/BEtd+OKvuQhJcZJiVYjOaxGcliN5LCav4NuPXJAHalBAAAAAElFTkSuQmCC>

[image54]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC5ElEQVR4XsWXzUsVYRjFT5neSFQo20SY3rpSQZpEUouwL1q0aF9QYYFEEiEV/QEuCtr1RfSxi4o+oEW1uhZFUdD3ImhZEZS1yAgiiprO4zvo+JwZvfcKdeGH75zzPOe+M/PemVdEUYT/iQgTAtSQZaSHnImxsWk1Uj8BImQCdJI75BE5R3rJyhgbm2ae1XRKfwYiCECOHCZ3yQLxPVYTaq0nJ75DBBfWRp6Rg2Sq+FlYbeix3jbxE4iQCKklj8kS8UrFekNGrXgxIiSaT5LNopeLZViW12NEiJvWkyuiV4plWabXo7QJAFXkKWkUr1IsK2RWeS+t2O7bRdEni2WmrKe0wm5yQPQU+Gkki72eimVats/wAqUTZJ3ovhH5ItD1BVhDWm9hoqegZVq2z/FCFJ5mM0VPNiG3Edj6zboD274D1T00VmSxFtjww54LPssLlF6RatGTTchvAfp/jU7g0G+g/j6NU1lMB04PAe8kywuULpEO0ZNNwGygaRC4yoPLpOUDtRm+zuV2DGf7LC9Q2k92iO4beZv4xWe5Bo9w3Op9wTIt2+d4gdJqclz0yWKZlu30tMJ68oRMEa9SLCtk1ntPi0NDP9kteqVYlmV6PcqeQDV5QOaLVy6WEbJSf1kiJBrbye2onH2AJ+wLLKNdvBgRXEAfuVfRlQhnbr194iUQQeDzlrwku8TLwmpDT5d4DhFSCbujo6RI9pJVpC7h18WaeVZjtZm7oCQijAtQINvJsSgsrOcxNjbNvIL0jYMIZQFMG8brZSBCqQBzunmyr4G5b7gT3+T9sbVoAObdBJo/sucaErdPikuBnxZgKV9uQzz4RNo5zr70nOB14DwHf8gF0jww4vniUuCbcE9YZyEhjBve03iRTlPi1W20DE5yAljE/7541l958JMstyuw0NeN1tvu6Ub85fa3UBzxfHGpcA47ef+5D8i/5Rnt8/7YWszibRhg7WeuhYdcAiM7bin+1/wFP+E87wu6iksAAAAASUVORK5CYII=>

[image55]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACGElEQVR4Xr3Wz4uMARzH8Q9rWVoSyYa0Y7B+l+TISWxK7UEuygEHhduWlJRykJIDDg5y4V+gVknkoJQsFwc5bdrDhjgotvGe5xlb+/k+M/PM09PzqVe7fb7f55mn5nlmRo1GQ+2QFXjlfZlC4cikd2UKhSMTWOd9WULhyAWc874soXBkI556X5ZQZCFvsNz7MoQiC7mGE953s1jaXZOucOyQz/4LRRayExPed7Jduj0m/XzAS+yTvg9JR30nObcX7ZBHOOJ9FtK/VZqebZ4eXzAivfW9ZNeLdsiw0nthoc8c6dssff3TuoBP6QW89r1k14tOyC2c8j4L79nVA9K3m9LsDmlmjXTQd5JzetEJWYX3GPBZFrJhrXSWv4M+m9vxohtyHve9LyoUeZCHuOh9EaHIgyzBSxzyWa9CkRfh7U3uhy0+60UoekH2ti5il8/yCkWvCE+Z3uGYz/IIRRFKH89nuOSzbkJRFFmEu3iM1T5vJxTzhvwm9K4bchIfcBlLfe5CkZ5k5DQf/VPSnhmp/pxime90QgYw3rqQM+jznbndULAsbZqWfiVTPv7/SrVx38uDrMQNpU/KdezHgnk7GQfVpdEf6Ys3TWLbC9/rBRnEcaX3x0fcw2E1P0t8OT2g9ll6wj9TGPvNTT7qO0WR/taL31HzF7cvtJaGeby52jrv4fpcX79FhaJqoahaKKoWiqqFomqhqNo/C7nHEnY6oMoAAAAASUVORK5CYII=>

[image56]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC80lEQVR4XsWXzUtUURjGH03IxCIooiKcpnEMTaWJYoRykZXSxmjTYqBFJIK4CyJqYasiMsmIQFooBEKFERRBhNimj0XZH1C0iNoZFUlo9DE975yLc897znhncZle+DFzn/djzjlz7znvRT6fx//EESqNI1QaRygXWi05QC6RZ+Q1eUPuk3PkEKnTeRpHiILWRZ6QWXKV9JBVIX8DOUoukFdkt65h1dNCKeRHyDXygCS130cwmKfkFKnS/kKMFnzQsjBL3Kd9UdBqyEUyoX0FvxaCpG1A+3lg8xl+F2QW5c56B5DhfbFuIDxr2jQ55sQ7AjOBpjngFi+u/OYg5qlV6zgfwMomDvwbcIcXZ39yzC9DdTvJJ13LUyR1HbhX8BhyP4A1jTrOB9D4GHgRys1yMFhd9GOGdFs5bpHkIHDjV7FIzxeKzTrOB1d/lE9hkPeHtH6muLHoRy8ZsXLcIljPQXDkJxaBg/xsvatjSkFLcAU/AAMLwJ6vwM5R5e8gY5bmKZImj7jP7OfnFu2PgraCN75sUBs8vgwZtzRP0BDJaT0OaC1k0tI8QbLD1Ws9DmgpMmVpKkCW6LZOjAvaETJsaSpgWIJ0YlzI5MguS1MBU7JMOjEOaPVk1tFV0CRp0UFxQMuRIUdXQeMk4wTxgeb2LGf8du0rFxQebaQdXQWNkQ5by5wE9vE8uMmLvd+53Q7qIlEEs7ee/yWfChwhvbaW+AjMFyKBBdL8ThdZDlo7eY5Q02L5VXA3mbG19FtgMRjAHNn6XhcpBW0tTB9R8sbWCdUwR2ZnUUv182/ggXT5L9DG/b3tsC7iI6j1EBGPtSuwaSDTSksAm44jdLItBy0J08Sc1j6NIwQFJmDaqBrti4LWB7PsWe3z4QhBkSqYRlJm0aD9PmBmLQ2rNK7eG86HI1hOttQwrbW02NJqLw1GfgSmJZfWXA4wadW7dI0oHEFDq4N5yZCNSF465OVDllheRuSlRM7+Wp1XLo5QaRyh0jhCpfkHgHzjKBWnyz0AAAAASUVORK5CYII=>

[image57]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACvElEQVR4XsXXS0hUURgH8L+KvSAywqQy0wqmaXq6iQYqImgRQRoGYQRJWS0iWwXRIiJoFUREqxYFSlHQY1NURPZaRBmNUi1aBBJU0hMJyqJO/3M/uzLnu1fn3pkx8Idz/+c745lzz5xzhQEu0UpjDP4H8Gce3XcbRou8AE5Rq9s4GuQFMIG6aL5bUGxDF8Aiekzj3KJiyg6APd7tCCgsFhUwukoNKnc7AiU0xs2jUgGjKdRDM1Wb7QCMBWZlgCVfgZr3QHqtWxOFCjzAKrobtB6A6tPA2T+2J/CBavrcmihU4AN20XV3EED9beCV11OkORMoV/1zpIIsdm9wBgFUbgOaBoDXvOigOd0MS1XfHKlAAbbTHar2O2HaViD1iGuhgxcTVZ8IVBBI1kQ3bVZteVJBKKCCLhg5vNKqPSYVjMienMB5ekK7TcjXNVcqyBkwlfbTDXpOl+kAtVAjraalVGtk9mShAmWDfZO0wgY3jUztMdpk4nwi7opGjvVmaqNDdJzO0BXqpKf0zMihd4vO0UnbuYoStI4Om6FPZI/oheqPFZgKPHa6gPV0je5Rk6opEBUocg/b6SJNVu15UoHf4O5usj4yxu4JAfVxqcALkTzIXa6P22wvMHef3wZMpwe0we0Tlw5QvpjrsR/4wYsBqv9ij0C/Bpg0OIhGt28cOkDiCI9br0Uc/c1b35xVJ4N4WIiZ0AFQByzrl7P+DSXtDFS4dUY2F3s+zIZ9qHXbc6QCL0RtC/eVF/z9ku+/xm3/5y13sgZvrSQ+ctzvONg2t2YkKoiCO+rGMuz9JbfqJ6U+wT7SBdSGUUEUwIJ2eV6RdwJ2fme43K0bjgqi4ENxiofjN6DX2DVZihmfYQ+bgNowKoiKt2ELZ6KrCnWZHpR0GnswBdSFUUFegBO0Q+XDUEFeZH+w/1OMV20h/gIl0JZpHAHBVQAAAABJRU5ErkJggg==>

[image58]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWklEQVR4XrXX34tMcRjH8c/uWllSaiXShrVp29ptrJQtSVgXQglJSeTGhbiQKMqNlOTH3hCrUDYlLrYspVV+1G6JtWwu/QeUuJXjfc5sM3ue58yMM8556tXMfJ5nvvvdaeZ8ZxQEgRzpPta6PAcuiEiHccrlOXBBRFqBEZfnwAUl0hSaXJ4xF5RIg9ji8oy5oETahDsuz5gLSqRGfMFs18uQC2Kkq9jh8gy5IEbqCXL+NLjAkZ6i4PKMuMCR+vDI5TMXkZZJXUNS+wnuL7D9alyQSBrFKpeHC6h5jdT9U3rOg4HfUseknanGBYmkjRh2ebiACg+kF9FKRdt+EHbZuUpcUJF0C0dsLq28IN3+U95A4RvhXDtXSViNNkwkzcME2s0CLVLbV2nvL2n1d/75AffcKsIax3rbSCStw5toM36hTiy2eS1hdWAYD9FmBxzpIMawxPXqUL4jbcV7nEeLHYyRNuBjEF6obC+l+ANpFo7jE/bZ4RjefRjHE+xEs5uppvidY5dvBNFGFuImXqHX9s1CvbiGzxjCFZwJwk+MtGf69jQu4y5eB8VDbgQX/YLxjfRgFINYZPtmI03oxuYgfPWkYzg7fbsf/UFxs62xv+EWSkDtxiROKu1LXYMLKqHm4BwmsN326+WCWqil4PKrZ+i0/bRc8K+oPozhulKegLF1bJAG1YBDmMJR1fEt2gX1oObjEt4pPDkTZipxwf9Q+bL+GMttP4kLskD14wM4qv3BFZu1QVZUvqyH748DaLAz0ZwNska14gbeKuEXt3tCXlS8rL/EPc04yv8CLouR6XTvRAYAAAAASUVORK5CYII=>

[image59]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC6klEQVR4Xr2XX2hOYRzHPxib/ww3mne8Y5sN2YSJUKjJhaRcKhfkT4qbKTeKorjxr2SFC0WtiCgSwg1t+TfmQkNcEBsz5E9sx/e85+V1nt9e3ldne+tT5/l+f8/vPOc5z+95zovneXQ7UC2ui1zXs8FRA2XivhhlPK+7BwAjxT0xyXhJjBAZ0E9cE0sgZyFMPQojVrpxtmOW6JcnclxdzjGxGYqXwYLPcEHNjd/Urgv1Nx0zRL98KHwEVW9h3DMon/PbhxpRG8TFHsPrxJ0CylpCedzEmQLx83ApmfS5KHyS8GCpuCL6BnGlF6EhGdcuYq/wX8+vPG7iTNFUNsOHZGKforb3UKmLuyI/FTdgmgb7ElbrNRRrtqaE1oFJnClQsBs2/YA3atR29qfssi4aRYmNJVfM8teL8VwhG/TuN+h+jf2IH9Sj3ZSy0I35F0b4L+CkWGf0DDBC1sA2ccDoGWKEkAljfFz9N7DCCwq8j/EyxAgJMbG5+PW79KNWbatqfLsbo6jp4rYYarwsMEJCJLYXjnQG5dUhylv4c7dTCXjBio+7fbPFCAmRihPB6RlEwGKVePJmMFDcEnNT8cXrZb/QuDRbFTsk9HJzpsMIQcK8+TBT039Vjf0dKrX6hOcnhtNiVSqWAh12qsKvanwTy7Xh5C5yc6bDCKnEuSXaRk/B2Br8Y9XXYZfYE44bUg1bvqdmq06U7XPzpcMIaYGV4qzoHUqgEWjNtEGzGu/EvE/SJpv+aTBCl8BsUS8GGc9PQsEMDaIJJup0jK1x/b9hBIPegRes+JjxIsAIIWCwF5ylVcaLCCswulQl9VDT2VpJvLUB1roxUWIFih7Aw4QDZ0TRKTcmSqzAlJZUSfl1PfaFGxMlRhhOYVNQy1/ETlEaqvuoCQswoV3zP4j4ORj/VE9/mK6+eCMk1YBh4o7nf9d1EdhdBBf+UwafuMvdgO4muIBDYqtr9gT+zTeK467RU/gDuOF18be5p/gJhHeDmu48TqIAAAAASUVORK5CYII=>

[image60]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEFUlEQVR4XsWXX0jbVxTHT+ufZI0xmdHqMJGIa4a1YosPVjf2oLV/kMIKpQVbHJsPuo1BB9soUrphX8QyWJkP69ijc9rNltKHUkrBtrgKFktnx5jr+uDGaqPGhWlsRu3d9+beX/z9TuL/sB34/HLuuefce3J+909CQgj6P1lUiN4Al8F5ENC2YvAduAaO8uBUoB5EWeA3kA2qwBVtvwH2Awe4AzbxATaKemBgkKn1Y+C61ieADeTywFRhbahvHAbbgQv8Seq1XAXf82BTXDG3rRY+UAY4Dn4CXrAAnLpvGOzgA0hsNtvj9PT0vdy+GtSDaBs4r/UXwSOdzDTYou0/gO18AElubu5fZWVlUy6Xq4X3rcSiQnSB1Iq/BZq07TCpHXARfMWDDQoLCyfn5uZEbW1tKCcn5yzvXw5rg8gDMphNLsJ8HmjG6/VO4lMsLCyI5ubmMCpyiY+zFAmG9eDz+aaESTo6OmaRhFwzLu7LSTCsh6KiIksCUvr6+v7Jy8uTZ4vP8EtGgmGtQDb7/f6EBKQMDg4+z8/PfwyfXSJJrMQ8kA98RGob2i1ORPskPFj3ZZSUlMTWQDIZGxsTqNAktmqDSBYfV4hugzfBaXDOZH8Z/AG+5MG63x4IBIJysqUkGAyK8vLyabfb/b7g8bEHURo4ovVXwKjWN5Pahu8uk4CjtLR02QSkRCIRUV9fH/J4POfIdKckG1CeBx9o/WPwHqkLaakEnPh2T9Q0VhkfHxcDAwOip6dHdHZ2RltaWmYyMzOfpaWlfUvG3SMfBpBTpA4jeTnJq3hIf8pX842czOyvY9wVFRUTi9MKEY1GY59dXV3PHQ7HI5T+E/g1gXqwA3ji8XGF6C1Sp2BsAZK6kHo1A+Ah2GP4m+I8lZWV8QS6u7ujDQ0Nf0t9fn5eFBQUTMEnm8fF4/UgAfAUfApOgLctTsu/gq1VVVWxBHp7e+Xe/xFb797IyIg0ydI/xfF8hsfF4/Ug8gKSv4gMLDebnARU8GDd91JNTc1Ef3//M0z+M6kfNbvr6uqm0S9mZ2cFEpqEzcFj4wlsBIgXE0fAGHS3YUfph40qtLe3z2MdnOKxsXhuWCsQv91u/4VMC0vbq40qhMNhgQSDsL2QEM8Na0VODLZyuwRVuGtUoa2tLeJ0Oj/kPnww+f7KmE1uw0oeuBogNUYVQqGQrMIT2GwWH5Oz3HYPwJDJ9g6pLfgF6OMTrAYswHgVWltb57KysizH8aJCdBC8xhI4Cfxa/x3k8AlWAvJqdXX1TGNj4wwq8BC/HS1nCXcuMCdgsr8ORmmd/wuwA77G8XsoWby1kSQBUtf0r8TWRqqwNlgCpA6o++AAD0wV1kZiAjfBZ2CnJnaDpRJrA7cdOGFqnwWfm1jzIlyJBMN/zb+vs6XevNha+wAAAABJRU5ErkJggg==>

[image61]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABoklEQVR4Xs3WP0sDMRjH8ZRaKAjWxSIOUnCog5tO4qDQwTegqIv4EjopLs7qLoKLi6iIouAkOLl0cnIoOrkIIv5BEMf6fbh4xiQdrrS5HnwweZLL86v2alWj0VBpcgqhOYXQnEJoTiE0pxDa30CpDBZxjVqHyNnSI+MLUMEVSsh3SElFPSq+ADuYtn9F7SY9pFc8NxaOMGrf0G7SQ3rFc2OhuwNwZVHGGHLWWj96jXkPBuWn55zkAbhm8Yx33OEVC8b6Odb0OIdLHCLrOStZAK4hfGEFeV2bwAfKZgAVvfJTnMjYPqvVAHLwg6e+hy09lgDrOMCZatJc700cQBrteupVXOixBHjCJwr2Xuu+xAG2lX6lVn0V+3osATZRx7EyPuls0kN6xXNjoVmAZdx46vK3rurx73tgBC/YsPcb9yUOUMA95o3aDB5R1HPzKZjCN+bss/R6sgB6TZ79Gt5U9CjeYtJYjwPo+ZKKnpxxz1nJAxh7ihj21P99EOnaAPo8e1sP0A5dHSD1f8epfyFJ9ytZWpxCaE4hNKcQmlMIzSmE9gMTOzfpqvRL9QAAAABJRU5ErkJggg==>

[image62]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABaElEQVR4Xt3Wv0rDUBQG8IBVEBwUHBwcBAcjIujmY+hexU0Ekb6AEBwdoiL5i5BVgkNxcXVRHBxrFYc+gIu+gMTvkgQu9+TGyi0n4oXf0O+eJF/SQmNlWWY1iQTcSMCNBNxIwI0E3EgwKo7jtHzfX4qiyJaJLE3TiXKOHDgKcRxv4WI9uIYrRQrPYRi2xSw52BTubqy4+Ky6V/I8bwr7fdd1J8mmqSRJpnHyOzVX4Sl1gyBYIBum/mQBrB1w5YylANY4nMMXfMpzXAUWwYfNoQtgHcADvME9rKozdTRfwcZQBbBm4BWWoQUXcKvMXMKjxqlRAanELhxDF57UmTpGBbBseLfyu2xDDC/KTAfONPZMC4i7vpE+ix/QQJlZKU5YxTYtsG7lT2AbTqAHH/LMT4wKFMNrcGTlj3oeDtWZOpoCc7AvZ9oCpqoKVPm/BRr/OxYafSEpNfpK9hsk4EYCbiTgRgJuJOD2DQa8z65MICHGAAAAAElFTkSuQmCC>

[image63]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABRElEQVR4XsXRS07DMBgEYLcViCUH6BLEtViz4Ard8n7DkjVbrsAZeoTCNdKx1UbxjGM7iRMsfQuPf2csxVRVZf6TBFOTYAxYSzjh3J1xUBrWMaxhA6dyzkFJWEfwA3Zj/cKZN8OXSsK6aJTv/cGynuFLJWHN4ZMeYPfzeoYvlUaP8MrdOV8YAmsGB4HcPuKcy90ZB33tyj/gGw75vI0EfTTK9/85+xESdBUobz5iwfNMgi4i5dYVz4dIkCtRfs3zbSTIkSi/4fkYCVIS5bc8nyJBTKL8judzSNAmUX7P87kkCBmr3H2bA5Yof+D5riTwDuPljzzfhwT1Qbz8ief7ksCF8fJnnh9Cg3j5C88P5W/i5a98uQR/Y8wqUGy98cVS/I0xX4Hyd75Ukr/RB4xabvkbYy53j7BWMOMLpUkwNQmmJsHUtmznVT4M5dyzAAAAAElFTkSuQmCC>

[image64]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADhklEQVR4XsWWW0hUURiF19FBu1CG0GClVhZORolzSbtSgSRGGEFqIfVihgZFaPfS17KHLmYzOnaBCLpAPUQPQREE9VBY2ijRBeyiEUWQIImlNa0zOuOZf6czY2IPH3PO2vP/a529z+w98Hq9+J8owlijCEGDwGxgznZ+Jhm0tSRVfnekKEJgANZiIKsTqOGN7RuQWNSvYzJpJzuJJusiRRECA5j5EejyfQPoJGmtg2PYT/SLe8bZGQmKEBiA5R3wayDAV2+UNvvt4BgmkE8DIThL2Crrw0URAgOw7NOwrAuo9Zo0e/e2lLh2tw3rBsd9S6Bf+LlJpso+oVAEIxunY1NuQnxjfiI2uK3IrrfjPnFeXIVxNIsh70WIz2S97DMcimCET1xAw9MNNtj9uO04Ru2Zy4EFNCsWAXQOyT7DoQhG6m3YS7NKYwBfiP5gnlobdtPw9YDxb+KWPUKhCEbqHailWYkMoHPeiiUMeKUwGU0a8J3mG8gjki37DIciGGGAW1z7PGluxGlF+eE0tLlsyKG5mTSRdNlrKBTBiL7WNFksTSWcpRy+Gw85IyfjYzCfAZoR5v6gCCLAC2k2FHVWODhjJ1jTuDgehQzwhMTJnhJF8FMzF7Fs1iyNQsHZKGKQ1twEOBngLomRvcMK4FyEFE7pXWkQDgy+nCFurEvAc5M26TEwrwVIfsmzbYX0UYz9uBdhJdf1smweCXssOBat2X/rWznwgVj0bTtot1SMAwEc2FJnxynZNBJmjE86C1zyufRTzTDJBWEFoPkRzsBB2TRcWFtakYrmmKicXqCHTr0kk8c6UsIKwHVsaHCgWDYeDt8vwY4K8pTvwFV+LuT/Ch7diV/o26EfcNJHMfbDJ7ijn37S5G+ccyCTM1ZFwxYa17kyMEv2GwpF8MOGLXpjaWbEnYGlNKzW9wv+Yqpd6TDLPqFQBD9s+koaBnBgFQ3P+IztOFCThcmyPlwUQedSOiaycZM0praGT3yBnx7OUKm+WcnaSFEFYFJanLmsICnWo79UvqnmgUTDa3wvGusc2Hw9H9GybqQE3wAm7lZtmlb5M1or75sQPbPDacNtPvUD7gu5sng0CL6BuQw4/sO/cZi0HX3Z0+JKZNFoEnyDWTzFjgYCALv4R2NKniwaTYJv6MYN4w1Q1QOUd/PaIwtGG1UAorgURcCM1bz+57c8FIow1ijCWPMHC5UcwMAje+8AAAAASUVORK5CYII=>

[image65]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADKUlEQVR4XsWXS0iUURTH/2pZppiS44zfOD5GMWQ2QZgLV4HVwqAHlAWBBD18VIuonW2LIop2tVZokz21osJFYgRRJLZp0aIWRUaBRGT0+PqfueM87vnG+cjBBn7o/Z9z7znf+e7MPReu6+J/ooSlRgn5BihpB1ofkiEOGpXdFvIJPxEg9hV4xsF90viBWlGGjz0pbwDLoogOA1fjUQwnfgDlXel+eqKF1NDWPJHyAt3kApkgz69g5aMiDPxMJdDxheuFMtZXC80bgFKg5QHf3Wcg+pb/d6cFqySbySlyh7xK/B0km8jqxBoFQPNdoI2BW2f4Os6qOLaQSqDpJHDmt8l81i1FdPYXMMzBFJkkF8ke12NjJYIn3zU/a7JVUgmpSWsfA9NxD6EYW75fAnZwsNz2tQkGg9VOMDxZW1vrGTQjji0kDajeCezmpvnEwbhbicYZ28cLx3FWOaHwRDgU3mjbvFBC0gAUAuE+Vvh1AVpGXgL3qB6z/WwiVRHHCTrbbD0bSsgKv1ZkhBxVtkWghAWR9w9cJ0dsG0u+KxAIlNl6LpSQk1QSA/MaS763Jhgeg1TJ9s+BEnxhkrhB+uur6mu445/8y9MLSvCNSeIm6YvFYsXK7hMl+CUeFBDiSdh2vyjBD1JuKbuUP5HELdJr+/lBCbmQjSYbTjZeUjdJ3CaHbf9cKCEX8vTylbP1RBJyIB1StgVQwqJIJXFQ2bKghGzIz6v8zNq6AlhBRskBZfNACV7IwSIHjBw0ts0TJvEHGOtEeJRnyXv2ElNAXafyc30kIEeqHK1yxNq2hahAxfZi7GM/Mcco70jTx/QeYR41MS6yeZAmIm2sJirY/ZA60kn616PhjelbTBSg5xvXabPnqYWkbTLtk7RR0k5x4cxAAdJB9pPT5Bp54ZpOSd699IS9PSgbLEDPXKoC0RmvB7GCI2QaR2MpZEN5DiVDHAhPXdMijZPL5DjZSlpcjy4J8X6i+TzQwFa8eZoJZHTDWRIo7zKts7FIS70B9fJU60ipPTkfZA5YInN5kEuEXCbkUoGIPSmfaIEZmGuUXKdK2m17vlHCUqOEpeYvIxo9DWfr0WcAAAAASUVORK5CYII=>

[image66]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACGklEQVR4XsXWz0tUURQH8JPgJkEtyFB0JelCCFyHf4CEqEjkokWr0kU4GFablECFQHeCCCK6sEkwgiCMNuGIEeVKjX7Q//L63u4ben3Pue++FMfFh2G+c849d2beL0mSRM6TCmpNBbWmgqLQ2QrP4Alc5s+LUkER6LoCx7AGW3AAF7muCBUUga4VWIZ7qZfwiOuKUEEMOhrhJ9zPbOABfIc6ro9RQQw6HkI5M7xqB4a4PkYFMej4ASVjA9NQ4foYFeRBdQ/sG8OrvkET9+VRQR5UT8GGMbjqNdzivjwqyIPqPXhsDK56Dpvcl0cFIahsEH+k89CsMfgFF7g/RAUhqByAN8ZQtgu93B+ighBUrsKCMZC5umnuD1FBiPjTb9wYyCbhM/eHqMCCqm74aAwLOYJLvI5FBRbx32rdGBTyCm7zOhYVWFD1QfJPPzYHZV7HogKGinb4ZAzJ425U7nbdyOsxFTBULIo/v3lIjLs3TPF6TAU0vAMO01ceEHMNvkrkYFRBZng9VKAP2owBMa5nWPzFK3hlVEE6/Cq8g4n0/Yk2kPbOi39sM++SOpCkX/wBdDOTnXgDaf8d8X/lDTUvU3Rd/LPee2ilTZ1qA+kaneIvZu5y3vU3l2QWvsA2DIrxf7nFjAEx/2wgXccdV6PwVvyDzYwLR6CZi89iA7Rmi/zZjEgprvepyNKL/+N6eB2T3D1X/NPUmgpq7TeFMklOv1UJ4wAAAABJRU5ErkJggg==>

[image67]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB+ElEQVR4XsXXzytEURQH8MMCw05SFswwGMPCBn+CpZRkZcnC3l4i7CxsbCRlIVKKRqbZSVkobC0kKzV7P4rxPfPe033nvDd1Z27j1Geme865nXmv+XGHSqUS/SeVqDeVqDeVcC1B1J0lyieJini+IKIus642uMbD8zwGjgHrU7OuNriWwpWXx8AP9BC9mXW1wbUhosszf/gBDBMdmXW1wSXENOzzbecr5+FYd4Z65CYXEAOQgw9Iy3qoVyZqgWiFdfgETqzKHkklqoWYgRd/MHuGhOyTVMIWIgNXxuDAlOyNohK2EMsRw89lXxyVqAZixxj+Dn2yJ45K2EKMwCNs+y9gRfZUohI2EIP+8GF/vQQtsq8SlagE0Qgb0Ay98ACjss+GSlSCWCTvNhf84eOyx5ZKxEG0Q9F/AewGmmSfLZWIg9g1hgdOZJ8tlYiCGINvMRw/85SRvbZUQkI0wK0x+BVmZV+1OCZ4iCwYDQv+4C/YgjbZUwuOPbiGyYhi8Mbjd31W1l3wHohPTnQIueDwwM/kXfGc3ORSaNGPjxYfm/j4xMcoPk7JDa6FFnzlPLychhQfKCM2uRRa8G3nozOn+SiNdUFucC28wJ8G/vOQxJWniZ7wxb8pN7imEn8F7wfnHjpkzSWVCBWJ5mFN5l1SiVDRO+XeybxLv/bcoC/TrErVAAAAAElFTkSuQmCC>

[image68]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADFElEQVR4XsXVT0gUcRQH8PE3M7/ZUYQgItg6GEkQdCgqjQykW4fq4Kmgg39Ly1pXDx6EkqBFqTD8h3XaDoJSdijW/myUrGmmkWIhblaURpIuuhAlpDF9p1hb3293mzXdhI/OvPeb997Ob3aUDMOQ/gf7+g25UC0kEgXN2yBTSCQCGjPwm3+FZCKg8R5oNY+FZEHByb68vNOvrcrPPzVeWFhSRevEYu49HIs4AAqOInr8t+7KP8ch11yS1FklSbfOmucZGR3NuOYCrRMLmvfCOgsDNNeIA5iNG2ol6aprOQOg8VroC50LC4qLSycdjsopq0pLncGSkjNXaJ1o0PwInI86QEVFxYQRx8/g4KCBay4ZEZpFguY3YXfoXFiwmgOgsR36w2PCIofDMd3U1GRY5XK5DKfT2UDrRILm56Aw5gDl5eUfA4GAYZXP5zNwzWVah0JjBV5BcswBVmsL0DgH6mhcWFhWVva5vb3dsKqxsdHcgnpah0LzB7CFxoWFKPbJ7/cbVnk8HnMLhE8WLktPObRLT3lL4xEHWI0tqFG5P4cxawPg04x7vd55q9xu9wKuuUjrhDzl2qavSUkLM4xtprmIAxQVFR2G3Dhtp3VCBlTu7eN8gMYXB8CDkUqDK2VYUdPw6X+06ik7aS7EHOAGDa6UHq71YAuWvPkoc4BmcNLEv+rU9H3m3o8qajrNhTMH4OCDLJpcNklSPsjKdBfX3EKO+PULzTfCC7DTBcsxpPLrI4o6g/KM5qjFA/MOwBBso4vicVezHfyCW9+mJ2fSXCRLTtB8a3rqmvf7Nb2WLrQCD5x9Qpa/PeFazBdTOCFwIIm1uPHV8Wq2DqRlmo8mwFjaJJOD/SrvpblYhIBpTFF2vJOVWTxIE1OMCf9AqPuabe80Y3MeTe+iub8RAiF3bDpHwcfmfuJu3MZA4tcJT/tDzVY9y9j8I83WIuQtEALUS0XNxlM9NIdteaMowWcqH/FxzdvLtTHcne/jshzEC+cEvc4qIRCVJKX6FfVoN9fq8ZDde67yOgyVLayLkxBINCGQaD8ByE/xDLvtGN0AAAAASUVORK5CYII=>

[image69]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADfUlEQVR4XsWWWUhUURjH/3cccmY0xyXNScfJqRjFtpnRLFsoCIQooWjFCFowfBGK0KCFiqjsoSCy0qgogiDooZdeKumh6CUKJGiDFtuljTS1xab/Hb3Dne+kjDbYw4875/995/t/nHvuOYNQKIT/iSIMN4oQFQTygXFVfLplLF4oQiQA/3qg9AtwhIPAZyC3UubEA0WIBOB5DbSHM4AvpPC+zIkHihAJwPcc6Olr4EPIouU/kznxQBEiAfhqNcxsB46GrFqwc4PX+bIpgIUy719RBDNFKdg9xu5sW5aLxU1+zG8MopkcOzMXNpk7VBTBTI4dzeTFyQCCBk1BHGATd48XY6LMHwqKEAkADquG7qQEfDQ3EG4igOVsooXUyHmDRREiAWA1CWnciQ1TUSKbOOXHjMYALpArp/3IlPNjRREiAeCa3oDOqjwskg0YHA9gE1fiAZ/lskYsKEJY5MlHeowGpqehWhqb4Ssp5964ydU4fLEII2S9gVCEvga2GeY6E5KxV5pKTvhR3FiMQ1yNO6RA1uwPRehr4LG5gWwbzkjD/uBqVLKR+2SjrPs3VIFnLnlLfhsNpFhxVRoNBFdgFhu4xFdyOd3m4mVW0ALkPeTdNlvxk4JBWQbqpjjxZE4m1pWlo0qaxMIWHw4kWoI9+lEOtBIfL7foL0YxNijNwKl5mbghiw6GHLu7ATgXdumlnquatzymBgKpaK5w4bwsOhD6RlzswpLCZGwfn4zroxPRkaCVcwW66fSTTOO1Dm9MDRSm4NEaD/ZIEzMr3aiY5MTWLBvOOqy4Y9HQYewbnqK/CkZiM/9X1PG/RBt9X+kXnPRRjA08SfhQ60OlNDWon4zpCRrem78WAzbyhk+/rPk3FMGAn14Xd3OpNDaT70CDNCe3Sbas1x+KYGqgWxoa7CrEgtmZuDWaOVyFHybzcyRR1hoIRdApSYfb60C7NOYrWVo2Cve4ubqYc3GWE2k03IHeY7tO1okFVQBGumxp+9yOEZ/0Xa0b13ixloaPuCqdfDbNyIXdlJ9KhvxPKXoAWHlaPdWw/ZeGTb/tFs+7KaloddnwdVoG6hlPkAX+legBsqqBg991VUdDdcjjcBxlQJMT40X0AGNXAPsjDQA137jCFXJSPIkehN+n9wmwsxvY3MnfLXJCvFEFwMJXUQnkzMMgP6mhoAjDjSIMN38AqM9DxQ6vqTUAAAAASUVORK5CYII=>

[image70]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACYElEQVR4XsWVT4jNURTHv+R/iCbpSZIikQ07s1azsJhZDRvFRlYSYUOzUCw0RZh3f9OMLGYz2UyRKEzEagjNYjZKsxCFBZKMPN/z+13PPeeMN9MsrsVn3u98z7nfc3733fsGjUYD/xMn5MYJuXFCbpyQGyfkxgm5cUJunFCKw1iEgGVWnyviJZ5WL3Mq6MECFg+RXyhwyBbPFfEqPcWbPVROBQGd5DPq2Gb0hWQrBrDCmltYs44Nu3ANm5ReYDs9vvJzr9JVEDhfgYdKu45V1O4x1+DnvjSn6nownzV3yBR5R36Sw8b/KV/ulNJUUOACC+4340Gs4aI35Hlp2GqAOvag2uYdsdlJ8jbdcsaj8pJqnQoCNy5gOIlrNO7mu8/j8/cZBuhmzZlk7U5Uu7Y70UZIr1rXfJCtlokLHLXmcXHLASysP12uuYK2psbtpzaZnqXqT4EtTHwiLznIEmsWDWc9APqxi/XfYLdbrmPAOPnIYTaXWkzUIAdEdoDP1jDWzGqA6DVJbsnBNLkN5AN5/KfP32T1Pb9ik7PWNC6ecQBcxkrWvSBjuIrlLh9wnjxTmim4REbswphrOQCbL2bNA/KaX8Fam48ed8lFpZmCc+k1NDk1AOv2y28Gm60v4wI3WPOlvI592NikF0sTj1Hp0WqA4+SJbT7tAAE32exREk9Arp2ljo6kZoweJ5SvCvrQzqIfXHSQvwir7RCqNuA9zbqsPh3iher/wZT0UDlXHHAMch3rOGBzSU2NhrftKf8X4oXqcB5xOSvkxgm5cUJunJAbJ+TGCblxQm6ckBsn5OY3u3upJ87il50AAAAASUVORK5CYII=>

[image71]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABpElEQVR4XsXVvyvEYRwH8Pcd3SmhnGw2gxILISSLlPIXsDCYDBaZ/Bj9BWaLySIZbCzKom5RYpNBoSxEuK/3904P9/7c3fB8r8fVq+55f57P53n63l2HKIrwn0wQmglCM0FoJgjNBL446YhOqxjX/a5PA1+ctEnb4iQ+gWZ1v+vToF44uYse6JwyWnf7NKiH+MCfgx/ji2i9bK8G9cCpO/RF01pTJkiKE+fjqbSltUpMkASn9dELHVNa65WYwBcntdEN3VJO69WYwAenpOiA3mlY67WYwAenjMWT6IxWKhjRHtergQ9OGaKrGpa1x/VqEJoJQjOB4qsfaN8HctdAxyHXo7onCROUFYEZoOET6OVinQYoVQCaFnWvLxO4Ak8Gmp+BpeKuXxuUfWO9VXt8mMAVio8efHMpF7inRj4FTGqPDxO4Ap976QJ5ucAdpeMLTGiPDxO4Ak/hR/AELHBR+HOBNcq+st6iPT5MUFYEpvi4P4BuLlaj0pcxzb/ZzJzu9WUCxVcPf4a7QOcFf4p7XA/qniRMEJoJQjNBaCYIzQShmSC0b+HXLD3AQv4MAAAAAElFTkSuQmCC>

[image72]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABRElEQVR4XsXRS07DMBgEYLcViCUH6BLEtViz4Ard8n7DkjVbrsAZeoTCNdKx1UbxjGM7iRMsfQuPf2csxVRVZf6TBFOTYAxYSzjh3J1xUBrWMaxhA6dyzkFJWEfwA3Zj/cKZN8OXSsK6aJTv/cGynuFLJWHN4ZMeYPfzeoYvlUaP8MrdOV8YAmsGB4HcPuKcy90ZB33tyj/gGw75vI0EfTTK9/85+xESdBUobz5iwfNMgi4i5dYVz4dIkCtRfs3zbSTIkSi/4fkYCVIS5bc8nyJBTKL8judzSNAmUX7P87kkCBmr3H2bA5Yof+D5riTwDuPljzzfhwT1Qbz8ief7ksCF8fJnnh9Cg3j5C88P5W/i5a98uQR/Y8wqUGy98cVS/I0xX4Hyd75Ukr/RB4xabvkbYy53j7BWMOMLpUkwNQmmJsHUtmznVT4M5dyzAAAAAElFTkSuQmCC>

[image73]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADoElEQVR4XsWXWUhUYRTHzx11mtQotcxJc9IkWs25M5qarVpkllkR1EMvExVktFokhVFYIWEFJbOobfRkWfnQRoGUme0YKhS9VFREUIFFRUHT/7s2Mp2rdxZbHn7fnTnfd8//f7/lzhlyu930P1EFAuFkKkVUpVMcjweCKuAvDpkWOS3U5rTSLVzDeL+/qAK+qM6gJIhfcspUX2OmXJeFKgV8nL+oAr1RN470DguVQbjVbiZbtUwWgcNMVhhoxCwU8Hv8QRXoCVc65UGgFQYqa6yU4RH3IGYCS9Fun0jx/F5fqALeQNQI6vCEl11WyufC3thlWgkT1+uWUAjPo4UqIBBJkGwjxNtxXcvFegMzVIUlKuf5tFAFkCgToveQyFFrpiwu4s3eCSlZcYYnx4qM2xeL7640Ssd9zdgXuTxvb3R/qMmiaAjX4qmbXDIt5GI9MXbgldIQ6dvbGP2zM54Y7p8NOuypFMvFekJpcEMieAy2cREtIkPftciD6jeESl/flI8fnd1tQqZiPMw1pJe4IEdpsMvTIH6OC2hhM9nyIfzKYQ6zRulfNoyJvLrDux8btwbs4IKcoA3E939UFWd4fFR8zo4+vio89MMd735xXDETd5E3h4v+EQNh0pfnet3nZwZdZxtoR6YfyxLXzP9tnJXm4vi2H8mgGC7cJwNTh7hs/XQfO0pSpk/3EGt4esJo6HDyscpxlukiF+6TgSj9i/OmiHuV3rHCuLIl2BOvxZ7g4/F+OIX9UMLFgzYQBJkw8RA66f/LgNgPC5Q3q4UG+m2gYGjI0lGR0WUVqZTJ+4JBvGewFGf9MhAZmnRdR0WfJNr1PURKeL8qiWbzhMGApTiNjVmsaWB1Es3SSRmdoreLs+4YffJpnixQXGaaBvE90PoMRvZqwGaifJ2U42XggjtKn9LAE/oD8s7AMdyJJ2/E9LfAwFZ7Go3QnAFBuC75gUQrvhId/qGTTJ3LTTSXJ9dgJvLtFvWBo0t0C4oWk/fa+zQgyBocvjqxv/Fg6Siawvs4mN48UQsgT9OvQnUzKubhXJCjacAXzq6f3n2iBoBoM552U/UkSuAiWgRsABXxHLzfKzD+thDFuq4PphYMyICoByG0X/y64XoTY9ehWhrGkwWD0vRkAFXRPAgeQPy+sq4yrcXVyBP0FaXxGMBGKsQ6HnKK97aFbojKpq9/vXyhNMIABD+JY4PrGmykoXzg30JpaifTAH+LyD+NKvCv+QlGlv7xYbrYhAAAAABJRU5ErkJggg==>

[image74]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACYElEQVR4XsWVT4jNURTHv+R/iCbpSZIikQ07s1azsJhZDRvFRlYSYUOzUCw0RZh3f9OMLGYz2UyRKEzEagjNYjZKsxCFBZKMPN/z+13PPeeMN9MsrsVn3u98z7nfc3733fsGjUYD/xMn5MYJuXFCbpyQGyfkxgm5cUJunFCKw1iEgGVWnyviJZ5WL3Mq6MECFg+RXyhwyBbPFfEqPcWbPVROBQGd5DPq2Gb0hWQrBrDCmltYs44Nu3ANm5ReYDs9vvJzr9JVEDhfgYdKu45V1O4x1+DnvjSn6nownzV3yBR5R36Sw8b/KV/ulNJUUOACC+4340Gs4aI35Hlp2GqAOvag2uYdsdlJ8jbdcsaj8pJqnQoCNy5gOIlrNO7mu8/j8/cZBuhmzZlk7U5Uu7Y70UZIr1rXfJCtlokLHLXmcXHLASysP12uuYK2psbtpzaZnqXqT4EtTHwiLznIEmsWDWc9APqxi/XfYLdbrmPAOPnIYTaXWkzUIAdEdoDP1jDWzGqA6DVJbsnBNLkN5AN5/KfP32T1Pb9ik7PWNC6ecQBcxkrWvSBjuIrlLh9wnjxTmim4REbswphrOQCbL2bNA/KaX8Fam48ed8lFpZmCc+k1NDk1AOv2y28Gm60v4wI3WPOlvI592NikF0sTj1Hp0WqA4+SJbT7tAAE32exREk9Arp2ljo6kZoweJ5SvCvrQzqIfXHSQvwir7RCqNuA9zbqsPh3iher/wZT0UDlXHHAMch3rOGBzSU2NhrftKf8X4oXqcB5xOSvkxgm5cUJunJAbJ+TGCblxQm6ckBsn5OY3u3upJ87il50AAAAASUVORK5CYII=>

[image75]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACOElEQVR4XsXWPWsUURSH8RPyZhBCEJuomEpBJKA2CmkEsbCSNGm0EFQ0oGCCiiCJIGlShAiC+QAiIqYRUlgJgihaiaIYEStFbUzEKOLb+szc63D3f3c3OxOYHPjB3nPOXA4zszNjlUrFVlOUKFuUKFuUqCqatWMC17TWCLEFl/AIt9CvPVmvJoJNNuAeksWi1ushurCAJ7iAh/ic5LU37ddEsNEc7mAm5wCH8Reb/Hq9Xx/R3rSuiWCj/xucyTnAVuwJ1muwhEntTeuaUHkHUMQpc5cxG6qqrgm1kgGI3fiBGa1lPZpQRQcgNuM97qND61mfJlSRAYh1eIlXyW+tV/VqQuUdwNzf8AHeoU/rKkqoAgNcxy8cwo5A+q9SUUKZu4s/ar4e4rG5G09d1d60XxNlixJlixJlixJVRbNubNd8s4gW9FidF1Haowl/YCdu4ju+Yh4j2rccYtTcY/iK1rIeTfgDj+MndqEVp/1G+7W3HmIbvuFLkQEmMRas15r7b1/U3lqINnPfA9N4mnsARZw0dwb2aa2WZHi8NvdULD4AcR4vsIhjWq+F2GnuwTPg1ysa4DI++Q3H0aI90t+B55gKcsUHCDY5au4SDGtN+obNna0D2Ou9waw1+0Fi7gZKDuyTXPJuv639cuxZi98Byffgb8xrf3qMJvxGz3A3WPf6zbJT2ywrcgmIE/hj7mGUXPu3+ICN2rucQgP4A4fMvdtv4KA1+KxqhDiHQc1ndU2ULUqULUqU7R/1lR8Uqb2p1AAAAABJRU5ErkJggg==>

[image76]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB6ElEQVR4XsWVzytEURTHv4mVX0mEIpGahZL8Dxa2shcLoSRpssNC2YgU86NYWNhaj1LYsMBGKZvZ2CIpzWY0vufN88y5Zzeea/GZued7zvmeO3fum0GpVMJ/YgTfGME3RvCNEXxjBN8YwTdG8I0RAnEPDdhFk6tXCzJoxhHqXT3IqWANtcjimA0lMuMWVwu9FkLPI5mhcipIY4xFHyThmvwWpDBI3wIZVboKMlghN25zXND7jiwqzSlYI9duY1zQ+1Y+pNJUkMYOC3JRDDR0A/N1wIgxA2ragXFB1m5eeqRXPKIeevOObSqfaLGPFhY8kdVwwEAP8LIFFCeA9z7gpHJ4J5BPAgVB1pWbkFrpkV7xEK9wA6skX/mElV9S6GXilTziAI2iJYDjU0mHjJSNWiUnn1oGf+dkLVq4uVap/c6Jh3gFOXoHMzJ45rrrZwOHaOPxnzHxRvr/bAP0Dmfk5MSjDUTHwQtItkOjv/gKtsm5mulsYINcVAyK9xKmcUnWlY8KMkjKKbhmcQF5DLNYVpoKsphj0b3bGBf0fuAJTCtNBSkMs6gI+e1Ood01qBb+uXVw8BJ9P/k+pHKmmDsMLmMWU26uWug3S98rek6anCv4xgi+MYJvjOAbI/jGCL4xgm+M4Bsj+OYLUXejHzYlyfgAAAAASUVORK5CYII=>

[image77]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACUUlEQVR4Xs3Xz4tNYRzH8e+EQUqSjTGZFSUpbCgbJQuraTY2LBT33pmiEFIaSjazmKgp8wfISGyUJiulRKxuRHckK8KGkR/Jr+v9zPOc6Ttf597znKPj+tZrus+P89xP57nnx0iz2ZROmvlTrVYnUS+gEdj+GJM6QN0mi1Gr1QYd2x8j+c45DYtagHO4aMecVgGoNTiD+7iKDXZOZgCqB7fhGtN23EkLQC3GezzESdzDO9ev58UEuIkbGM8ZYC9+oTe0V4T2Pj0vJkCywOGcAdZiq2ovwieM6HmZAdQCuQJY1EHx2zgbyvknAagt+IpxO1Z6AGo1XuEOuu14qQGo5XiKhvtsx53SAoi/DO/iJfrsMYkyA1zCd+zBRmXmqkrkCeB+xW9sv9MiwAPxPzxrTM+LDtBOWoBYNkAjWSyPSqUy4dj+GO47/6sAqVtALcV6259IFrP96vguLBPzIHLsFswJQC3EFXzBR0zhiF0kIsBR8bfhC3YsK0AF37AZ83AoLLRTz2sXgFqHz/hQJMAIhlV7ifhr+5Se1yoANV/8+8B51HMHsKhB8Wdgh+5vE2AYz8TfFYsHoE7gCaZxwI6nBaA2ib/xbAvtvwpwFm/DgqfRpcdtAKobjzGq+ooHUIvsF78FQ7o/JcCQ+LO1C9uD57gusS8k4n9A7sA+0+ee7dcyAhyTP58B7n3wB6aiAoSFHuGWaq8Mi82e2rQAaaTIFlA1/BR/M3J7/wKvsUrPKy1AOHC3+Gf7ZfRLymtVZIDjGLD9mQFixARoxQbo7D+nnfQbaREZgRA9eQ8AAAAASUVORK5CYII=>

[image78]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADU0lEQVR4Xt2WS0hUURjH/2a+S83XHWeuj0wrF73QyEQIraCozIqsFuG0cAYKbJGFEdQuggQJgxYueizCRYsWBdamJ/mK6LFoXETRprCXZKGQevufO3fGmXO07kxa0IHfued83z3n+5/vzNxzYBgG/iVm5fV6NzU2Np4J4PF4zof2yUF54ExhVlbQE0KIgG0fbbVWfxv7PfLAmcKshAARLGAUAd1ud6Joi+f/L0DsuUi7CGQxTPqstnj65IHRAMQvAzK3szEnaBOV9UOrFau1VtzHZ7rVT6evV54sUoDiW0DdV6B5FNDf0ZBu2kU121vAUghUD4lofjomKOiU6RPVrGQAiCXlpLkbuJuCLeOTAjrJkragALu/AZYEoOAQsLifi2pi38xSSMDV5Ci5QZ6TS8RtmBkoeAwcYfovUEj+J47NCQqwuwXA0nbOPwa8YufYeD6Kr1sBb5IX5DI5IALKGWGJYcw6oKiF7flBe2QCCt8DP8xR4pmKvBEr4EI5YABnjrOyDGVxsj1AUIDHxpeQqe8BfJYAnzEXJU/kCcOCZzurnJrrkaZpKbIvTIDdswDIKudi3wA1Q8koHOxCwlNaU+VJBXq2XsLgz/RM3SX7FAGRwpJntvnHJvenEqFp+UWuHNcK2S6jGCIG2DGdCDsohqgAdgoRn4E0V7ZrpeL/BYohaoBdx1PT3y7SnOcU3y9QDNHicrgaKrK0Xn5j7xkh//PfoRiihQLqdV1P4pS7jQhEKIYZAai3K0IxRILD4cguWlCUJttNgD12RCgGu4h080PzkKmvln1BgL2WiHn8dsSRJPkddZANxMHCwNdyNd0j+xSAfU1wvI5BySBQ+oEH2sWwuZQBNsjIyEi1FdwwxebGo+IbMGZGY1K+MxFrg355wHRw0BpW+bJdgdkxxHEMbCUtrUh8EIuTE/7ggiuk+HRwXmUCCZZEzucDGriKDbxWlXaGBNPIenKYdJBu8pJ0kVbi5slVGYPij0C/5Vo+zDn1CASIG1DbWGAFSagZHZgMdIe0Ey+pMqyLpgyQvIrCb/M45+0sY2OYT35ZhoNa/Xc4/9ux2D+yDgmb5feiRTHIsGjcgi/AVXbOMhMFA/I7f4JimAq/CJEJsR0hF9EZQDH8bX4CI+ju8y/YiQYAAAAASUVORK5CYII=>

[image79]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABUUlEQVR4Xu2VPU7DMBiGLaZKXXoKxDXY2oGcIUsciStU6swCEhI7JwAhWJgZ6M8BqlYqVDAwwAYHCO8bnMp8MmpiErWVPDx2/DWfv8c/bVWWZWqT5E2apt0kSU4KtNYX9hgcy8S6yBtTtE8RgucZYpEZH2E8kol1kTcUYLEiyIJxHLf4zH5nBDDbIXgFc4tnMJDvrnLY8My57Sxk+AIT88x+JhNdYLYuuAXa4hycyXd/CZiLFnG1ZsUT9B0z7uCzsUx08S+Bmo7AX2CjO9DwHbgCn+qPi5knNnwEN+BJxFa7sj0CuuIvITLb4ECQgHtRbL2Az3+B+lntC3iwWIKFKLZewAdVfrtdsSAQBHZMAG/tgZYgAndiYlcxV6yyAFf7AaYW76rcd94V8xLw3W5XLAgEgSDgJTA0iQWP4M0zRqlKAvvglEkWl+DaM0Z6pQWa5BtYc9tFL+Ol/wAAAABJRU5ErkJggg==>

[image80]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADZklEQVR4Xr2WS0hUURjH/9FDKTQ1KyoT34avKcVKqGhnLdLACCQoFzoT0RMKCssiKWzXQqgWBWEF0SIqRCiI6EFmSBotbNGmIOiplfQ0b//v3DvjnXNmbBxHh/mde8//++4533kfWJaFSQdII89IuhJ8Pt+6hoaGFhet9fX17vwOo5BoAWaRx2Sl5JUolXi93kYJROB7H6ly8hv43mkUFA3AFHKdbPFrKpEApDK/KBXW1dXFy7s8YxhAC2l2ayqZlACAbeSa6gWXrhIZc6fbOx2+kS7nXZ59RoFjAVhFHpGZuk0lMuFkzKW1Tou7+Exy8knMP9E/jBggk/SQhWDrIZPQZVfJhA0BkEi6SBmQewnI/whkfwCWHff7qGQ8PcBfHuA5xSVNoIJ2Kp9K2skmIK4SqB2U2oDfpGKAvhmBAKKdA/zNBgre2SurbZhBvKE23QngNDls+xUdAs6r2myODQHJte4AohoCdmuzXbG/4D3fgZQKvvjIZVeguUAJW/2SmW6Sx2FAQgwCSKtha36OBFA90GxXft9yD4fyTeU8yOhmb9ziYigP6P4AvFHshDKjOQQPgJovwNr+FOR3WPaMn6/7hkMl4z0LZJAb7eUm/Vui20fDEKICmEbukCrD9h8MISqAc+SAoUeAIQQZgUL+rwBZnVxxpbpdwalPLhh6hBhCwMBZzIrf2hP6BfF8peYJ8gPWk7tkhv59pBhCwICEKvbqr5El1kZKTgR82DWWfatJtf1ln49fAyw5KeteLy8chhAwAHOB8n576xRh+w8Ow2Zlp82pvGDEv6yJ+8CgHWgFe2vRVr3MUBhCkBFLjwI53LWKP3P3ale6dDdwj1QG+2a9B/44wX6S2Hr08kJhCDpQ+z0PFr8GXCS7TL+818CQE8Arktmr+4TCEEYFOEjOGLoUhPy9QCl7qokHTRaHLif0qtG/04WwABvJbUs2Hd3mL4zNBuZUS6/ptnAYQkh4g7DsbTbZsI0TQwgY1BHqOZKLxN3M9VpjWFpjwRCUiLhsLvMBmW9x2Pl3Ho9R3SdWGIISkdMBPFRWmxWcVOaNNhYYghJRdBa46VQ+TIp5mcQC3S8WGIJwFdiXgkzedPZzK17NoShs1X1ihSFQWk6e3uAeb58HSDd8YkiwACwmzy253YRwngj+AbaN4jTV+6+TAAAAAElFTkSuQmCC>

[image81]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACMElEQVR4Xs2TMUgbURjHP7BDNzt1c3fS9i4uhYKDg0PXit0ckuIiCYSEZnOJukhCa2NylV5LxMEhDqVTwEwFtwgNdCgixCGIODgrff6/awiX7907SSh3PfhdXv7v/77vf/fekVKK4kQTokYTokYTdmfoKSN19xk9qdk0PSpBtaBPfpyjqcAAVZtWGYP+07Hpe82iH7X+OAx4TuD9oNWyaBHzWyMHwKKNTxbZGK+h+BceP8BbJzFGABS/AKdDJOhinADwnWm1WLNoxxgg9jdgCoCmXdAGv/AE5/1xGL/R6L1WKyyAicPXNOHO0+NRWZ+nR7KWH02IGk2IGu9WTdCb6nOalZOORUvYq70++9j3uu+/ERy+l1qtOVpgpP53EgeCD4ac5BPMcwiygt8DrwGPw7Dpq+kQB+neDU9WAp9xat8JjvlT4k8KhbfhWQ/41IaAbwPrjgJqHRkDeMVt2sQTL/vBgm/jBPDelF5rLyxAvFuAha/wBqblpPNvD+ELRupDf+JAE6JGE6LGu6XT6a1sNnudz+cvTeRyuatMJnMjdQl72Ct1P9yLew4CYMFup9NRYVev11OO40hZu9jD3rCLe3FP9T8FqLVaLdXtdo20221VLpc1XcIe9krdD/finoMA2BO3VCop13WNVCoVVSgUNF3CHvZK3Q/34p7+NxD7FsQeoFKv1++azeatiUajcVcsFv9IXcIe9krdD/finoMAyWTSTqVSK1HCPQcB4kQTouYeaNw7RBq2pMAAAAAASUVORK5CYII=>

[image82]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABvklEQVR4XsXWv0scURTF8ecWoqgowRiw3sbCxkqNnSxaimBjaWOVSgtBURA7rfwXtNc2kMIqEQIiFmmCjcRCRYgh/gDR9fucKWbPnXXmLct44IPrudfnc2F3ddVq1b0nUxTNFEUzRdFMUTN07gO60aKzZjFFzdC5CTzjCQ+BbvS8NKZQZB3+gfcPkxhOMYppLOMq3u/W85QpFCnhW3ygt687inzCJco6U6ZIQ/pwnrjEgu4osoYR7ZUp6iFjeIwv4L9+1h3Z7/K0V6Z4C1mML+D9wUfdCWWKLGQ/cYmvKOlOCFNkIT04TVxiVXdCmCIPMuSi17r/xr9HjOtOXqbIi8wnnoUL9OtOHqYIQXYSl9jUeR6mCEE68RdH/rHO8zBFCLKFs0af/tcztMiLfMENBnUWwhR5kCkXvQoqOgtliiwu+uS7w5zOGmGKt5Cyiz5qN3SWhrRhSfuaHS3qIb34jV2d1UNWXMbL0xRpSDt+4ACtOlfxX17Bf8zqvGZXC+Wif0j2XPRm8wuHGX7iPt73BvTM0AtsJw4LdesyPi1NIb98Bic4DuR/5hrf9UxlimYiHdopUxTNFEUzRdFMUbQXa6FjXB5HJa0AAAAASUVORK5CYII=>

[image83]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABTklEQVR4Xu3VsStFYRjH8TfUTXdVMrC7WcwmJqSbTSbrLWW4ksnfwIZMrAYGgzKxYOKPYLArg3R8b+ek2/M7zvsc6bV46jOc73PO7e3WvSdkWRb+koTUJKQmoQozhiXMf2PCPhMjoQoziGu8YQ3LhRUcYNs+EyMhJuTfwgvOSnYLtsVI8GDm8IFNu6tLghezg3fM2F0dEryYAVziCSN27yWhDmYK9xi2Oy8JXkwTpxi1uzokeIT853iCyZJd07YqEjyYPcyW9FVM215FQgyzhWecGzd4RcM+U0VCFWYc+yH/17MOezv7TIyE1CSkJiE1CV+LENp4/CVt+/nRA6QiITUJqUnwYI6wizs84Dj88J0gwSPkr+FbNDCEK3TtfR4SPIoDbPRdr+PC3uchwaM4QKfvutNr9j4PCR7/B2AW0eq7bvWavc9DQmoSUpOQ2id4UdViDHpAnwAAAABJRU5ErkJggg==>

[image84]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACZElEQVR4XsWWzYvNURjHjzFhxtvkJWEMCySJUFjMKMMGZRSxYUMZs8CCKM3ChIwsLFiYSV4KkRSzkPeFl5ikMSMsraw1f8H1Ofd3+jX3+zxZHqc+3d/9nO/z3Ns9v98zEyqVSvifGJEbI3JjRG6MyI0RuTHCg9UF7eIWwTknexJWOf4yNBuvwoP1EFaI2wXdTvYlzHL8N6g3XoWHV8w6D9ud7FfHTYVB9dU9FQprmlfMegrzxLXAgJNtg3711T0VCmsj9Dl+2HEd0OP4o9Alblz1VcMK6xgcFjcXnjnZHtjp+JuwAabAIRiEtuqehhXWLVgvbhtccLIDsNDxP6APhuE0zCn3NKywvkCDuG7Y42RHxlxPhH3wFkZD8aXrTI0KaRibeHf1I1gibja8hsVwKRRPzlnYCne1R1mnQpqugTuOjz9l9SZK7+tDcf6/QjEHdkeX9g7ACe1R1qqQDzoIx8U1wbt03Zw+eCQ6zabMFdisvtxXIcVXgx3B7fA4Ec93P0yCB7Dc6fEeZqov91VI8QeYka7jGZ+C3/AGVko2Hst4cXXwXfvWZFRocSim2D34BJ1wH1ZLNo7aj06PpfBEfU1GRSqcHoo7+E+QOcAaggmSj1/ymtNnL5xRX5ORgrVwPRTP/m3olf1G+GyaFKO20/G90KG+JpOCy0Jx3vFG2pTcRdghDeM4vWGaFL/SOsc/hxb1NZkUnBzGjMfkXsACcfEfkyOmiTMtk/+pTjHiX8WsfmgVF6flkJOdD6/UK0ak4vgEbHF8KzSKawjpL5v4OLDMsShG5MaI3BiRGyNyY0RujMjNX42I8QFr/1TPAAAAAElFTkSuQmCC>

[image85]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACI0lEQVR4XsXWT0hUQRzA8TGpNKIQVERJPCgYFIkHD3tQ8OLJVBBCIU+xu5EHlaBuFXqSTl3Em+BNPOnJi0joQVAQD0EdhDKCiiRE7J+1fefNz+01857Gvpgd+Dzf/uY3v/3pm51V5XI5VUxOwDcn4JsT8M0J+OYEfHMCvgWXTCbTn06nR/7RXbtIEsGFoitYxswp5vHZLpJEcJEGev+aUKoKvWg9jmWz2YZwA4zzuI1xjOGG/QaS14YHeIx+nDuxAUYjXkK/mIlqgFERyjmUnz9wz3rzEfzCN+xK3g6aIhtg3MI+DiQ5roFnMj+BC7og1vEdjZJThg/YRLXEumTd87gGFjGFGkmMa+AFvuJS6LcdlTV35PWQ5Awc50h8FUcoj2ogXPCkBupRaxUeljXpcNzG2MZHlDgNWImxDdgYZ7GlzLO+EjFfiW7M4ieGgri+/KcGpiX/kT0n819kXu+Rm/m4viRtQP350y+h1J6XnElsKPPs3yAVxPUlSQOMHimqN2WFXcPGqMNbvMfFRA0wUsqcAbpgvb0+DuOp1G4vuAHGVXzCHq7ZayVnTWrkT1OJ642ob1oKaoDYZbxWZsd3KnPghAX7QJnjV9/MKXNynkGfMo/slc4rtIFmmYvzUNbrj+aCxHSz7+ReH8XXg5xTGoj8MlJ685i5OME5H6rTgft4gkGU5edCDRTv67jo/5AUkxPwzQn45gR8cwK+OQHfnIBvvwFtS5fYQYDP2wAAAABJRU5ErkJggg==>

[image86]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACOUlEQVR4XsXWQYhNURzH8TPIMDIxIjZIitJko9hY2CiFJnmSvM1b3PssFFGSSa9mMRsrC2KBHQvNykYNKTXZSCklOyUpYoiMpOf77/zvuM7/jDH31plTn959//M/p9/cd99547rdrptPppCaKaRmCqmZQmqmkJoppGYKdWRZdgKn/kee54dljdmkDjaexF3cmsVDPJI1ZhPGbgyhLzK3HWcwguPoDQO02+2Npf59uIjz2FvqGzIBGD3aLG/E9EY6fxK/dO6bvj7H6lgAxk3t+YQPej2B5SYAYwXua9NXfS3/JeswhdcYRC9y7bsRBqC22fmwd7AMC3BW+y/HAuzCSxxCRxvLAY5obbRUk00/4k0kwCV8x7ZS/2LtfxEL0IdFet1xNkC/vJe+Um0h3uFtGKB4XyZrnb+L4yZA0NhxQYAY9+euXClqsQCM9TiKB85/vDtrB2BsxWfn78CamQIwtuhe4j0Gta96AMZKvMJP7CnPRQIM4Jrzz5cUnmJD5QCMJXis83k4HwYI1sqDLs/ARKUAzj/1Yzo3Eq4T/wqge4zL+kajcaxKgKtavx6uKUiAVqu1iZ4vzj9w/aX1ctDJwfWj2Ww25hSAcVpr95w/WOSjKEwfx8UdoHZb++XIlp6lOKe1sTl/BM6faHIRMxUJsBbPdH7S+eNYrp9g1WwB5Cv2148RY4fWYg6EAXSNHFQHMYwL2I8e7Zs5QB0SIKv7c1xHNt//kFRhCqmZQmqmkJoppGYKqZlCar8BG0F2jktlB08AAAAASUVORK5CYII=>

[image87]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACG0lEQVR4XsXVT6hMYRjH8cf1f0zyp3Q3urpJnMVskJRiY6URJSSyUEoKWyV3cRcUJUKJ1LUQSSmJnZt/hSKJBaLYKCxkZXOP73OeYxrPY8bM3Ho99anT7zzve86cc953JM9z+Z9CkFoIUgtBaiFILQSphSC1EKQWgtRCkFoIUgtBaiEYL2op+n3eSgh6QS3AITzFBn++nRB0ipqN3biPMbxB5vv+JQTtUFOwEdfxExqq25jl+zsRglao9fjcdNHfjqLP93cqBK1Q/biIt3iI79ji+7oVAo+aiWE8x6amfJLv7UUIGifsfe/DS+zp9ILUXLHXdQG3cABLMMH3Fv0hoBHb8AJDqPqev6Hm4Bxe4yOu4SSe4b3YEl0TxrlJ1uIxTmOeb26FWod7OILzYk9vGgbK86swKvYNjei5xtimSVbjKhb6C7RDrcANVPAIU7ETX6vV6li9XtcfNBkHsRnbcQfT/7iBXlCDuKyTYTHOYiI+Ic+yLK/VatqoF85wphynNzhSHPtJu1FOdKo8XoZjmIEfegOVSkVPqP2Yj0tl70qMFsd+0m5QfbiCw2KP/m6ZnygvrL6Jbdv66PeK3egrLCp6/aTdEnvkuuT0iz+OXWW+HDvEvg1dIQ/ElvUTDDbG+wl7JbYSdKnphnVT7D9Db0I3sXdi+8mQNK2AYpyfaDzEXsNWsdX0AV/E/i11Mxrw/cUYH6QWgtRCkNov8Vg9yeZA16wAAAAASUVORK5CYII=>

[image88]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADgklEQVR4Xu1WS0hUURj+zp1H2uTQS0OdGXW0NCbHmXFmVCgSs9ei0F5ELytLswgqIyFCh2jXg7B0xlGTaBMtIoho2TIoaBNR7apFy6ioMUi8/f91bt05jqCVbZoffs6995x7vu9/ngNkJCMZ+QsSAZQ+D+Zd96NooBquSD3M8pq/LpEkaMyHpbEw6uIBrO8PYnOUxmgQKx7NBgkVEGTh3MEwSgYDqI0HsZEAdwwGsS8WRCvNHSIi+2lsivlRRaNF3mPGooNGfSiOhxCi53UEtq2rAsebCnHpbAU6BwJoMyqTiQWwhdb7Ih5Y5T2nI2KkHlkcT7IkSBaujfuxlazeQ1YfbMhbGDeLpQmB42M88rtMgv5p5X/6A6ju3Yg5MkA60UD7QnDqoAS4RQcl1x7WN7cqjk/AB3KOqvJoVZwfZQKaUkhIt1NOhCkxs2RATThOUS/yiKmX4tlAQM2xNKBGNQvXlwlw1nGV3+U1RhKcJ1OSGAqgjKxcxe7iBIpOAWrUgmzXU4HOMeC5KnBqrDDb9URew3q6HF1d5ThjJMFeTiFAk6WULI1EYK+8wVR6zY8jlfb8ewutpa+985fc43fjPIG1L7I6XppFXcIkahOL5zhfsGFpSdyhLOWS4azlxJHBfkdX59qGBY6O6WFS0P69MW/ugJ4Tw5RjKeHgF048ntQWpdlU114/Os6lKT2jLs8pfADcTOYI64jqsRfc5zk2ko2lZPf1lhmqYzokQgsKbpuFM2EWNV9tJsf78x6ckNewtrmVHpPwjAKvCfyVahLLRzvcSrc+z0keC2ENh/8nARauV3ZPOhLdHpw0i2UJYDRp1a1xR3bRYxlc1835tqt2i/ud3VLytjnfdkX7PhGCFvYAjSv7qABSCGgkyC1xn9bxUki0FOGCSez89sutb1UGkIFl1ZKPSpr22kXaRCGop7Hyhh+5U54X6UhcrsQxi+L4DDxT2QsKWr9Xzc+/KwOycv/gPkLguzVQ6i9DQfh7a+BIVoCQMSdJsjpSwtHmNvfYLcVvshTHh4qcgodcbkZQPgO4nLWeQqVN/wW4s04bVBY+SLiXy+GYBBrEXj6gkkdxeNCLkote2Pggk/ecsRCwhS1hqyhzDzARrU0nQfkeQN9q+kNw8/0gQvcEeY8/FiaRbFYbSDfxQUUxDdP30uFy5ERmA1QWvmbpV65/BpqRjPwX8gPeldPyLMtfsAAAAABJRU5ErkJggg==>

[image89]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACMUlEQVR4Xu1WzU4TURg9NaAEZKkrERAMC7TODDMDJJo0/rPQICgLFBRQn2P27BraGaYge1+CR8NzrlPS3tKkTadsmJN8ue3M3HvOd7+fe4ECBQrkgAi4VVvE3SMX08dLeBhVMGJ/kzuijDRx8DgJsZp6eFf38THmGPt4cj4MERdAiR6ON0LMNjyspD7WSLjV8LGb+Djgu58U8oPjeuLiGcdRe42+0SSNHcykAQL+fkuyz7RdEh+Q8Nexh9+tJjGJhw1+70SLuG2v2QtKZxWMKZ70xCfRm9TFJr3+Rq/3ryK1zYjjnLqHpeoa7tgEV8GQ1gJMNUlJuNEPaYcxJLQvzImQiTlmExooTnEZ96m0zHi+JNGnZBBS2yhCedJVxImHeXr5QtulBIrzILWtRYR2uU0AX84xWV5TwE7HxDytm4i/zFKVjLJWidMxMU/LcuKUOdYWDv1R4uml+ciemKPJSTnLZHeq8y3VcZ0ilORJgFcK/6UAQfWq7RmaiP8h+K4d4Pi8xgJoE2BEcFtSx3S8XESoqph4+1xrm7bOEFQ4Pv3j4l7X82JQEeof6iMk/2pI2V9OfLjVZTzIKqBkc3Ygq46ewyFSnQEqZ9NTWNqc56mz9kxqQweJenk3EZekPnZ0QGVHcdgoY/awjAkdZPaafYPEo/JEXjFz9yTEtOmMVPcAPluuB3ik+0HEe4K9xsCQiKxZvad90EHFmIZ8Pne6gMloGKQ2dM1qXrmujbRAgRuBf6TiyJubwMNRAAAAAElFTkSuQmCC>

[image90]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACrUlEQVR4Xs1XS2sTURQ+k4dowTRBSMaZmNiJxkVTMJNJKz5qdBUVCy4sWGnTRm21PnGhuBCKG90oKo1Nx9ei2kXBhX9C/4OCa9246CKggtNzBqdOTptm4rQZP/gS5uTc831z5547NwAuIInS5PZYfJzH2wbPDchR+ZL3BqLyBI+3Df+DgYt2A68LsLmShx32nA0FGUiK0pXpXkhXVSjO5uD8rArj+N3Hc9cVUwUITGch2Z/Y9vh4V2TOFGV8psI+Ps4VFk6Dn0Tx7o7MaFAmkWJX5M0xJBe3+NytiQX4K4pTPMYFTAM7I295vI45OMjrrgkDQMCFJOp52F/VYGRFwVYNqObjOMR1OJZFdQ2GeYFGpOfvxACxmoV+0uHC8EKDA3rWuaidZKCoROZ5vBFXnQme1ArXMvCwBy6fTcD923vglj2+Yib4wFZ4KtWpDyjhlzw+mfLdDfriiz6h9CMgZGo9Ifm9/XfsjqO01kwDdMELuGU4qHwG+IgaBvKXERCU2oMMXK3Lw84yTdAHXfAiTkgzcFIJv+LxDn/yG8D3PwYMNFCo3UzDHZ5HN289CQE74DBPaMbh9NZHQ6nQEx7PhsV3PmHwJ8AnNDD3u8Mvf51RYYLnEZfXApmgBcIT/pV9keh8Z1D5ktiS/HCvG27w3y3aDZigVuFJjXhmd+jp4K5QhcedkFqftgCub4I2JD5gNZI4rQMeb8gclGi90fY+BeDjunWoODTRjLoKo5ao0UyUA996vbygnY0WIW7nZTof0DmBXt28bkvQ90KeC1ikTcg6D+CL65wlincc5HVcAbtD4+JEbK0LKHbCvNNu2MTHrSssEySKUzyAKzijSNKQLMolnrthoAMnHTytaykmlaVY/Jo9p63w3oAojXluAP+aXefxtsFzA9gBo24NLAGKZwnwUX5G0gAAAABJRU5ErkJggg==>

[image91]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEhklEQVR4Xt2X309bZRjHn7ZAofMHW2XIL3sojLEKlJ624qZsnSzcwNj41WUbFFp+I0MgZhEcBJUQlegCE1qKIrgbw41ZduOd0f9g8cbEGK9MzGKmxoiLXhy/zzmtlrfdhNot0Sf55BxOzvt+v8/7Pu9zCtH/IRQi3aqTTB84KD9op4ItIoP4zoMI3dZRygpWkxR00TNhN52CiQa+hhxkm/VQmjggFaH70EOZazVUiGxdEKwPuagt7KDOsIsC+Ls3KFM37ptgqiJVJnSYKJOXFgIysqsLy9S8JlMHi+K+b1Wm/lgiZs6CyqRNbD1NGbynWNJqiL2AzJrBRWQWCCYQFYmYa+bxMJIuzp8wZiG67KYno6KcxV5ERdZc1MNbtCKTk+cW9dTYaifD+0fpwDoKB3t5AoPOQPhCsqJxoC7YBLbOxasq6hNeKAHP83Lh2sUD4iZJgmsOGhyw0sx8BY3e18SyTKV8dLiSxUmSZaKMJjP0BT8adA2/pems2+79+R9HTWBrnTtM8LHCcjtQNK2pyt6cUfwV0WfoTwq4q6TppO2FShqJmuDTtMOE2lC4mcjkTcbEiiN9cKEqd2zWZpt6zVY+mWWw3Cb6KWJAUQy6uu2xUprkd2Ggh4sbhVm143SwCTyoCcl0bjcmgrJ+4J0q8+ir5Y6Z8UN1b79Ycnpp0NqywtfDj9i+0FPvH0S3YeCmkqUv+AEFPRAdC40O7icrbrL+ZYDj3X8wERWdPlJ5ZaLM8yaL9RV7w36pY6Pb4vuI4ft+a0voyKO2z00G6fuDxuJbk+X0sjae+sJap2xFLdSGqunQDgOJTLDoVXv2pb9FGxf7i9tXA9KFdRbssnRdF/FLnZv91rbQ5cPH5t5zmIa4KalZy9QScqOTas0pL+5ERGPW6TS9UVHqmSp3XpooOzkfK8qTi4Lx+K/7JP9GwOJbGilpvHy1+omGcDW5+cO1UEX7+OspaiIUPFRMQAI12cbvmupzFybPFw0vd0vdG/EiCZACmx2WgfX2wvHVxrzXF4/nrM7Z998YKcz80pNLt/aJipFQsAxKHnCAU6AVdIIeU/qdodqc0Ly3cDzsswQSLndUlN85nT+zdOLgtbcqH7t5xWz8dlRPvw9gnl5wDjyrJRgXCgpBOQ7agB/0gf4oJv2d4VpzeN5bNBHqlHo3VSOC6EmI2rNvTOcYv3kpne4Oxo6PcD8TCo6CUkda1uLAiImfh4+Z1+dYrKXgleXGvNlFztSe/cl0rvHrsXuIisSayIo1gGagVIKzoCfBQBWj/pch2+OfTjGqqP7X3YiKsAkvqKGdK6HWAdcAbwO/JA5MJTw/15kMMkUT/PBhmOggreBLYww8FBM8p4+07X6O1PqLi5Sb4Dm6wXnQRNqJs4ED4F6/F9XC/Dcm+CgHwEVwBnhAFcglNcFdxZ5NREV5f1tI22Mu7HxgJLXT7jl4idRJuGoTHdFEok5QRGqFJyUqhmrCDppJ20teDVHUBZ4itcGkRFQM1UQFqAeNpHVOztRC2gfsQYiKoeAfTqUQFERE9eIb/8n4E/9eaVzUwGGXAAAAAElFTkSuQmCC>

[image92]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACtklEQVR4XsWWy2tTQRjFT2OjNlasJKmoxarE+OpGaX3hA3xWrbZWqsVGidpGRRDcuhAiiAiCCxeCbnzSlRs37kRQsD6gC/f+AY0LQaVYlfF8d64YvtxcboSMB37kcu7jzHwz8xGgRhngHWnWvjMx/AbZr31nYng3ual9Z2J4grzXvlNxAM/JfO07E8MvkePadyaGd30GHvMyoe85UQzLRpuR+QlkOY7MI32/zkr2AblJ1sFYhng994B+qo7KXAUe+OHCfWM9Z0qsBTq/ACVjkevEGv1UndU+RD62oe37TCz8r6fhDtmifWdi+AApaj+6TEw7NYnhSfJS+8Ey00gTSZKlZBXp0E/VLA7gDWkpcxpII2GTMq0kS7hxDZfK7CEHST/pJTv+vvdPMg0/0Hh9Aukjfthy0km2kb3kEDlKcuQkOU2GfY6R7fqLIaqYmRd2G2cvfkDHUz9skJzwwyRkhBQCkHtsaGa1TimTt2YSNo+sQOXMvLAUSoUSUl9RPUwjz8m768gMnUp5M11CNpDdsCMNndkoBl8k8O1cuRcC+4Y3kTk62Zdphw2WNTqFiDNL4tMF7QWQh92I1f5LmDTZCTtb/XJV1mPsymUU32pfIdXrIRl4Va6Q4T9dsxV2x+qXQ4nh15kcHt5TvlROlkuCpZr74G26wOZjpsNuClnrSCVXjMQxVUhj4jxs9eQ7ctZlw8p6Sx9YTOI6mZIRSUcyh2FHrD+ukQHKec7DVkt6QN9dDD97gv4xXneRlWQBbFXl6AaV/I+8TScjlVJFCZMOJhtJOpvMLEta2Qs2TSE+jvCwIHnHTcqVh9318hsWJn1hFgJmxpY8TprKvQgyG8ku0g17AjZHCQsSw2+RWvu7tzkWkRRs54sUFiSG95Jr2ncmhs8mr7XvVBzAK5LSvjMxvEgGtF9NvwGnqdF4Pn/vCAAAAABJRU5ErkJggg==>

[image93]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFTUlEQVR4XsVX3U9bdRg+TpFA5hIkLkTigtJCOho+CuWjo19QKC1fLYONAgVKacv6BTMx88Zk0RsVY3QhbpSPAauMr7LyWeDCbNGrRd2dWZZ44932H1gv6vuccrDtAUrUsYsn5/DrOe/7vM/7/N7zg4lEIsyrBG/htMFbOG3wFo7DZBXztq+EMY9LmICvlPl5vJR5BrD3WKPf8Ezie8eBt3AYKEn6HQnjo+vTyarUwD1t1qf3m3O88/ocx2zteaev8s0b9PvoeBmzhmf2n01PjHMYeAuJmJAwcqrwt7n6rO+2PbpmYNetM9C1fctRY1rvl5lXOsUD8/oLjln5OTcpMXKnlPHjHbybGC8RvAUOtwRMKgW57ZO+8cvi5fwrc+rMiqWOguq1gUvqbWdd/Y6nsRFEtlzaKxsDiu4HZkn/ojHPxioiPTN8W8LcJEWeIAZiJcZPSgAvTlWnL285tQ1+XXYlCNxvzZUFukoU24OKmpC7Qbs7rG8KeRuMByS64klADV8ZE0SsxPjHEoB042Wv/QqZkSzQVnCJTU7XQJdUsU5rUIGS6/eGG1t23PrLm0O1nWsWWc+qqciy0PK+fUaV4QIBryhtcbT49edHtYO3APOgfyvGvOs7Xn3rpk2jWTVLlcHOQnmwRyJft1QpQQoEqAW6XU9Tc8jT2MaqYFN0r/aW9y23iwZn6t51WQsyfurPe+vxWOmZzxDzMGPyCMDBvoqUOQRDdZtDGi0SovcAqgepkFujhQIgsOdtMlJLOrYcSlOwr6p33FAw0lN84am75J0VqMAZE7ET88X9gT2MbQRHb9gVXbsjOgOSoFok3bSpNDvXNBrWhF59A4wYIpJQIEqgxjRqKPmks1Twx03lB1/DCxOVKV6ORHQbx8+JOALskKG9vNCSa4cCCIwKITXMCOPhuk1/s7uAfqN7AzyAFtxokIyZyvN/H2sRfwQz3qvPujYlS/McEKDYyHEkAUwzDJQFQ64dhkJV0T3f1IyEe6QGrlvk/nWXvtWlkn7uVZd9EXTWX7Uri9b7ZBcf+7ulNhjxMALssKIcRxLYH68fzzfnOIJ95b1wNnYCthoMycrtbmxB1QphwfNqgSMsF9rDynzRn86awuW1QXkPTLjSWTSAIhIJIDZyHEmAne30oF+bPYQqEHDbWXt1FySoHaSAEWQ86vIvkbxa8GNELngUUQoH/xpRFX+DqYhZsNQhtmIrwgNxBKIkniUlMFeb6cJWQjXwApRAj9mWOHXtnhrpVwqhLawQPIwoBT9E1MKB8HVF4bd4HsSX2/IGYeQZijNdmfqPCZMR4FoA1mgDpEQroMSGXd0VIiIgE6T7unzRC5XQGlYLLeH6vPwXAbO0H8mXOkRWmPh7kn9Wdc7NTcSTtWDfhHgY8qGPIIHKIC+MCUWAB9ZqM6r+UC6+tdwjtUSTi60wn1//3tBsbSZP/uQm3N+GeBgvw0SLxlwbAiMBPjiszLEwSSwgGaDKkZz9KhJ5fBknY6sHkm1DbhBxL8zKz7pBAu1AXwNEBJ9eJIxCfJAYskcrP++cpuS83kdbcPwgAjAuMTa5l+7Kz3oQ1K/PHgIRJIIqAO7hdlQNon6SHcknDkl+olEMcB8j9nu+//KELM07TYZCAiTiAKPhin5PqzLcaNtkRUq87ATEOvHHCIh+jpknsUHgZlQ2JSNFqEoOUOguJWZnflmC5Bwo1ok/xxzY0xAdJnjBogFZQnFb7Aj8qwMJwB3JwD62HSfFfz6SceAOpbHGTIb/5VAaC5iHO5ZjL7MDhabaQVK6f2nH8li8sn9MXiZ4C6cN3sJp42/tfpffAiWndAAAAABJRU5ErkJggg==>

[image94]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFZ0lEQVR4XsVXSUxbVxR9hBAERagpUkSLgqDYIIoVisEMBhsbOxib0QRSIExmsImxDalUtcu0q05Smywa5gTikjCYmMEYWFRNu2rVQV20qth1Saqu2k1dqe4933xq/w92NiGLo/95/u+ec8+9b4AFg0H2PCEaOG2IBk4booFomKlgL00VsZ5JOfNMFbPvJovZPsC9Y4x+wzfCedEgGjgORJI8IWdT9Px1piLRc9+Q/t6DxizXoinLNq+7YJ8qP/c2/f7RZAlbxzeH3yYL4xwH0YAQ03Kmogx/WahN/2zbaWwEdh3GFnq2+Ww1nRv9yp7VDtnAoinTNq9KdZAT4xPFzI05mMuRMCYnvCCMHVXAbQlLpCB3phRnv1+6knd1QZtWttxeULU+UKndtl+u3XHW10OIb9RwdXNAfe1Rj7x/yZw7zDmiODN2R85uvitjP6eczfiTsc6/GMv7nTHpW0IeETEPkM9WJa/47IY6tzGjHAIeNOcoPV1F6u0hdY3fUWfYHTM1+F115iMRXZEispIzv2XMx7Ew9g/h1QNyIj6mAFg3WRL3A2wGmae1oJIjp6enS6HeoDG4QOSmvbH6ph2H6crWiK5j3aLsXusstDxsyrbe05wfffFc9m+M7R8KAIr+IAERTSoiR/Ogfqvm3Bs7LlPz1rBev9ajqPZ2XFJ5u+WqDUtFNURBAJXAuOtsaPQ761s5F4bV19Z6S/tW2vKH3IaMkeaLKRPxcZV/M/Y4GB938984lv2VkE8kAB08VZawgGDIbmtEbwAhag8ge4jyO/QGOAABe64GM5Wk3Wer7vT2VfSudhQOLDZm2eBCX+aZT15Jyv7J9HLqN7cK2ayQL+IPrGEsI3T0plXdtTtubAEJsgXp1rBGv3Ndr+ea0GWqQyP6SSQcCAkIrQquDC05VvTCdHmCCyuDA7eMo5SA22RoLT9syrHCAQRGhrAazYjGw3Ob/uZWAf1G7y3oAZQADvAC0Iz3a9OvzyqTnEcCKDY4ThSA3QwbCtSjoZBVaM03NIJwj9zA00fdvzFqah7VKN53aUs+2CDybbvuDbiGEpwkgNusiONEAYfb6zuon7evtBedjZWApYaG5Ox21Dcha7W04KBKYguopNaALu+1g02rtmt9SNWNJkQPIAmhAMQGx4kCuL2dPkQHIwsERGa7EEHlIAfMEOPUln4I8irJ10GV5HGwWjoUGNe8/insx16w3C4bxFJED0QICInYjylgQZc2iqWEbNALcAI15kpiN7Y5axQfq6XDAbXky2C15IugVjoQuKG+dAvfQ/hKa+4QGvkexZkrT/y/CWMJ4EsA1SgDrEQp4AQs9pMQiPHS++W8/Cca6WBAK7UEanPznnh6FP0gX27PH0QTf072z2tSHdgRn74Eh02Ij2Ef6ggRyAz2ojHhCPBosKoHWb+pkt1e6VZYQuSyQTSf23RxZF6XJrI/dhMeLkN8jMlooiVzzjACgwAHDmdzODrlFoj0UOYg505FEo+TcSY8eyDWMuQ3In7CvCrFAREoB+rqISE4ekEYguyIGLaHMr9gnyNyUe1DJYi+EQHYinGe85PuqlKcCOo2ZYxACIjgCoB3dDuyhlA32Q7y6WPIEROxhXwiAfxhhPOcnzytTHLNUUOBAEQ80Gh4ot5zmvMOlG2mLCHSdgJiIeZxtySRACB0HLMfw4Ogm5HZrJIcoSx5wKG7RMzt+SUCy3lQLP52JIRogAd3GyphXlGwUEBOUMQSOwGIgVjC+DEF8FcyqA8vx9OCm0NzEQOxhPFjCuDBX0rDGzMWhJfSaBANHAc0D38tx1rmNhTa1Y5I6f2ZXcvD8dz+MXmWEA2cNkQDp43/APn+hiul4Z8EAAAAAElFTkSuQmCC>

[image95]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAGxklEQVR4XsWXe0zTVxTHf4gPBj6G+ECZM8GpIxGMymAoAgNERBARlfEw+EB5iYoFRVAHTARU3hSBllIoj/LGU1ugtBYsFaEpoYgIElFMjEZFmP+oU8LuLVvCfj8q/Wv7JZ/kx/nde87pved77oWYmJgg/k8oBk1Bjw5BrAqahNAhf9cUikET0DObIAxfEETSn5Pgd2I2eZwmUAyaQBArfAni4kc8exL8vsKXPE4TKAZNIAh9Fy2tsA//JKBF4Hd9F/I4TaAYNAE9Woa6332aNydgHGOoa/QJ28jjNIFi0IQqL9Pk2kPmz2/GRcvoMTRZpZfp84r9JsnkcZpAMcxEtY/JWra9wdggv6RhSFwNj3ls6C5Mbii00x+r9jRZSx4/ExTDTJTsMuqR/OYvH27jwxNRJfRDIfRW0EEYsVfOcTLsIY+fCYrha3A91kWVu695OdhQBsNSHjxpqoD+ehb0cjPRKiRC2e7VL7kexlHkeV+DYlBH+Z71KwttF47Kc2OFT4SV8LQVACfyqI4BD8oyoIuVANKkECFr+4LRAjSWPF8dFIM6ip2W378dvKP7YXUuPJXUqRgUlMKjmjx4UJoKXcwr0JEdBXVHtnYXOS67T56vDophOjguRoHFO5a/7mIlwqN6JgyjXz8kroHH/GLACSk5N0DBiIOOzPPQlhQKRfZLXnOcjQLJfqaDYiCTs/t7fZa13ojksr+om30N+lHVP28TwJBoUgEPK+nQXXwd5Hmx0J4WAdLEEGgMdxMVbNMdwXPJ/shQDGTYvywWVf1q1tuRGQVKtNSDAg4qQKQAYcXfCsiGbnYSyHMvQ3sqDaQJgSC55Afcfet62Xbfisj+yFAMUym2X3yAtX3hSMvvAbxOegw84GagyueiLcAK4CIFMFUK6EIKwN/v3TgDrVdOgDjGBxrP7uGxrOePYB9kvxolkGpFfMPcqvOaF2gnkSYGo18Yq1puvPRPW+qnKCBNpYDO7Gi4d/0UtMYfA3G0NzSFu0Gt3xYJ00rnNfZF9j9jAgXW8+s4zisHRFFe0HY9DOQ3LzUrGPE9T0RVArT0bZ05MSNKTspdRUHCnZb4o2+lyaGytuRQfnOkp7Ip0rO54Ywr8E7YQbHj0oECa906sv+vJsDequfEtJo7euu47R1B2K6nsuthjXJ6jLSLdbUHyU8wJKq63Q8swcPqHFAW3wB5zqWG9vQIPlopgZDm0dMY7ioThO0UVPtuHq7x3ihmWs4ZZdvoOZHjTJuAHbpYMCxmvyx3/6GdF+zYIjy3v6M9PZKnRJWOq35SAZUqNfRiBSBl4O2ZVEAwSC4fAmGkJwhCnaHW36K9ysvsbomzUTv2iX2T41ESYPykzUFL9rHGZ9O9hjNu0IL2tBM1mAelaWjfS6cogAUteYkyUfpFGVoBpIBwlQLESAFNEXuBH+IE9Ue2QbX3Rih3M5aievrIsNTmkOP964+bZsSyfPNZY2V7jJvx5CbaXmhFTnEALDccGDehx43lPFZ89Hv6uSufM89c/Ew/dfS97MZpXuuVAJUCmmjuwA92gPrDVlDtZQZcd2Moclx6J99cawzHUJtA/iYijvHz3JEKzx8BAmxBeP6AqrMp8uIA7zfuflgBUg79fm50ypcsWv1EeljFRFpQ5JeicN/B8vCDCk6Iq6LwiIOC4WOlyN23UZG9e70i3WGVIsXaQJFtrv0ex1CbAMOCsGdYzn1ZeXAD8ILtVXLC0sJ9HksOBx+S1ICImd6VcyF9PPNs3UTayfKJlMAL43mhXi/YoR59zGM7+/L8bProByz6Mtw29KU6relLtl3Rl2Cp35e1ZdYfOIbaBFRJWM55VuFp0swPdVJ1NNzdcKfDe473H19CBoDNy4+hfcg6e208/WT8eEaQ74e7icE81K5RAR4ApBy0gjZQ42cOeDVLXVYB23ZRM9qCZ+R4lASY2/T8sQRr/czbWmIPQ0dGpOqwwQfP1EuIsiyLfyv5grIm7rSyLSUcSxAljBQQsU+lADhmDaiQUUteiw6nxTJUW6N5Ftr+5HiUBDAlNstNWdvnD6PsB6RXg4T4vFd3CcEFeg8poDUBt2A/VeHyQ3aoFIDmNxfaLHycb6E9XGg115QcR20CmFik2XLXVVlFDgbDJc4r3zbRPHp7ytLEAzz27amXkE569OQZEB8AzecP3objtuIy19W9+DRkWM0bZm3TzZpO/zMmMJXagM0mtd6bCkpdV/cXOy57VWRv8I7tsGQMJfaGs9PwTaHtojG0Yu9Q+37Fsl3QX+SwuIDraGBC9jMdFIPGoP8DuF4b1mDwO+W7hlAM/zUUw3/NXwwbiCr2mzYYAAAAAElFTkSuQmCC>

[image96]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFiklEQVR4Xu2XaVBTVxTHXxJkF1q1pVqt1mq144YkAcKuEsIilGrKIou4IItoi6WBqiyCBLCAghWzJ3JfCEho1AAiQagUAvVpU6RidcTpDFW7SesHZorC0PvaMqYvJMSOY2c6/fCf3Ny8e87vnnPuuyfIxMQE8m/KYOJ5y2BiKuX5IRa8tcgGofuMSpG75Vn4eVnoNuMmHN/ChY+hrooYlo0itxk8ngsSKvVDrIl2ppLBhL7+dGpZJ3SzvFPNmtuiTlpX1p4dx8E+ydrVj5bF6utKVfbOjrxtGc27mcXyoAXn4LrbUGoBjbKZaHdaALEnMhPuCMj8Zmlb00MP9VeXxhEdmiMN590DIMDpgtDV4vzJ1cjLRD9TApx0RhZB5wOqeNcqokF9fSHibg3zYgkC3ZnSbkFhAvF3fTWm+BfDKN4UuiBUoj8DADyHZ7Z7VRCN6OtLGBFb68U/kUmHx0ik0jE4foADEZ/TV2sGO1voatFC9Pe3L3wq4giL6nafrDieaEBfcUFBR8nkjEf4alxkEncs1JMlJD5HlMjTto/nhiw1CnCCjjgLaOQRndh0SPew3ymkkHeNPgHIehQTEGwyargErpRhgQsSYxQARmA5n076oSGWJiEuJsrRbtkQhbzzNwp59+hM22V38bQQn9FXUxqrREAj/QiPaKBpACrplpBh9V3d5uU101V/etSmgjR2OJc4T1RDrAsPFvb3fBqpf1oAAZU0gLLmyWXrXrwq8XEYVO/wOYbxcnYQjU4nPI1NKf5HpL4vXBd52A6IvR0UEAAzDyDwVaCMWgMaop0b5cELrogYNkOydbMwZfRacVMqs6R9f/RHPWX7Ur76K0I95R8kdxzcknk+LaCoIY7OP7V+VpfQ3equ1NdRV818pQUwnYDE2wE8NUBj0nrQlhUFuopTQUfeVrU60bdbGbmqRx7y2jXZhjmDUm/7exJv+/syX8c71f4v9cPI9co3LtTWR65qVsXTQX3ESqAIWwyeCQDGzwXX646DAZUQ9CsqgE5WBLCqbNBTngG6ilJAR248aM1kg/N7Q8C5XX7gf4D/JoBOwlX3VnAGdNJi1eWqA+rWzIjhzwoSNZ0FiacbU/2/bd4b1IYDqLZ5ND0zgJb3w1qg4V96KzmqPvCxEu5c0wfKFTopF7184iCKR6CTm4y2ZkWcu7AvXNm0J7hGGb1m8HTEyh4cQB68sPmpAUDgPFTx9tI+uJPWNk6E4nNusuKfpKCOvUIBWHOHTm2Y0/5UAPA819aGv4nBDgg1VQOq/Pcu1h9IvGgMYDIF1f5OqMTLXmPeq5hGuouy5jZMVQOTANdqKtDStMSHh7dnPj4Um/74cEz4w/acONQYAJ4CMQ5ANeMyggAjMAU1pgAaj+Z2cJNyxvITlBO5MfKJnMjdYxUJITf42wO0J7f4aI+z6dpjoSu1pawl2iN+87Vcxmxtvou9ttyZNGgSoHIJYgUhhuSwBkwBnC3L6SxMyh9/ArB3vCwuaPDEVn/seJQXdnQTDSsLWYGVMN/AuL7zsQK32VjuWjuMRyWNyujICqMAf0SBhmik3jP7TAHgKShJ3TFSsC13PC82azx/S9jIdCkQeVg3wc19Q/RnAAAbR3cBnfQADXDqMgaAF+EVSaG89uCebpSzs/tSYbLcVBFKfRx0sADvmdWU4qpejdjB9qle7GX365kExqXOomSUCGDOMZRvXHRB5GGFO78Pnb9F9GMUYFIwHekid6t2kYfNg5rQ14c1H7J7eyo46quCQ58SAdr2Ryrgda2BV3H3Keacr4WuFqMCOuU2LLpNRLtmA0yqMgixElDJmfDur4V3v1bsaTsCm5SfxR42QyKG9SP4D2gYtnE34PgebL20fCol/DQDsSHamUoGE89bBhPPW78DpKBYExdjQCsAAAAASUVORK5CYII=>

[image97]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFnklEQVR4XsWXC0xTVxjHv3v7FBWExYgwAYXWB04QylMBXWQRdUO0LkzxOcWoM0wdgq/ImAdbHSovtbctVcpDEIpDZZGhmwxERxDB+gSJm3OLWzS6mRkM0n0Fy8qtIFa33eSf9H73nPv7n3O/c85XMBgM8H/KIvBvaABAgAfATgBwYT+zaPym5Q7AzAH4U4sob4BH9gCzzJ9bdHiT8nUCm9EUPHhmxKBaUTgT9eZtLDpZoyQAWuEL7gclEKn0425TBvJ1qgDeFUUAv9mTS7U9fW6gCSUGqDLv2+NFeA0BEONsjfgNQHQWYJAnG4YgF0YCEYwvnaAK4BcoA3iNCGzRhNrW5M10LSldHLi/clP05gY1WXI5NzVmznixLpgDz5Ip6BgFcB/zIbgPA+67AVI7ADrw5rxByHFrVUjoTxFyGFWv9Oe1aEIGX8ibMaK0ZKGfovIz6baLTNIyI6g3lS0P3Sv34jYtd4GfEWDDHhDLgCt+pj86o0YJOWPatXPHa0+tn530Q9amFeyX90eqIGEr4wsMzpyeDX+BgZ4zMNxW/Dg7zO7O4WlDG3SL/A/WpSXGsgF96eTqcDnjz21U+IC8nwa6cmAg9+32kc6BP+XsSlK0VBSS8xmJitJF/qc1YXa3D011uFy8wEddm7p+FRvIlnrSwOsIVvbbgEmqYBv9zfJcuRHeXJ5HbpRpyDWdglwp3E9qd8dl6RZKKtDMLdS1ougJOTWyT9aaoMdkCSujPEW6GU4Ol5IncFoQTqwwINRfP54tZ8Mv5+0jjYd3kXr1DlKn2E7OJsemFc+fWH4ozO5Gdsjgm0elY/M9hLwHKorqOGlccjS0bR0D6VYZuFrKyPuCX8jcQmr3xZOaL+NItWwNOZ0YvSdhsktNLA3PTFlchHrPFuqsMqA/miXvL7wqOZZ8t30JYZZHpE/hcp6YDHxBQfu8YXDCKgNNR/bKXwV+Zst8UpEgJdOdHZqCuHRbJA3t43hwL90LZFYYEOgv5aTKXxVesSGKlMfNJFkR7rot4+n65wloTRIK9A3ZMrk18BOrwsmRSFEB48epNhnYPhayYlwEL98Juw0ECfT1TLLcGnhZbBjJ/2BUtwE/e8cqHi15QlOf4wY36j7AgN7PApOUaODCgW1ya+DHlgWT/FmuaICq3j8RUgS022OAp8/zsgkl7v00NDdQm5Egf2X4Yv89RdKxurwI52KFH6VHA/cEtPtf0L0yW1EevdcDeAnxQNpszx/R5isKaszduDTtRfBT8VG7yz4OLca9Pu2rpcHqgijRL7g9M8XRXgqc/jPa8GE6RkLVGD/BaFunBj4diTWJFgHejwDse6+IjHCAde0AD/HmiMHJ4Z27p+KlRd9uXZBZuenDzJKFkl/L10zL/Xrt9ExdjG/V8RWhGcdXhqWULg1KwcOKlER7k6PScSQnfGgBGujMAcYHcuNEnHM48pfXhGjgVhe864mQ59lWvGJq7TeJ0gOVWz9Kqdw4V2Yx7fjNzeGFUWKS865DtwFcfldRPmxwLwbEKuPIuwz8aBjCd3msCuTf1oY7fq+LkRjrgpSXwQveH0k0U+w6DeDoNVimnWVD+zAATlgT4HSNe4BLphnAcWqRJ/A7S7AAHpZfnNt48JwrmC3KP7YkaOeL4NoIZ6IOGYQGoBoLkUYc/WQ2tFcDZkYGsGNGFc0DzgEJTGH8OWrGj25VT7I5jwlXWBjpITPBs8OHpkS7DamZ6WR/d583XGS/gy2LQL8FQCl9IFApodMZCd2MNWOdOsSm2E7g/DuHim+nqAwDh3LErIe3LPqaySJgrQ5OBK/VIlrDp6WmvwGoQ7j7ue9gtzWXReB1ZMxigIiH/xhIxyXtuoHdrkcfduB1BeB2BmAuTv26JwDD72BgELtNj/bswJsQAM/buOPhD5r9jC2LwH+tvwEfiV1q7AdjBQAAAABJRU5ErkJggg==>

[image98]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFFElEQVR4XsWWC0xTVxyHr5RCW0A3Njbm0GWbw2zKgPJoeQymAjVsayQpMLA6EEUnYDveikJbPVhB5Uaw9F2eolTE1y71sfFsEQGdU8YzBN0MJkuWAZpsyZLuXAQCt4BYfJzkl9vzzznn+85tz71FjEYj8jpjWkAQGrH2MmNaQJAUYu1lZmYHQSxhHuFX4sAXEZU7slzqiQQX05Edk7UZA2BjwuAfmMTJzxO1O+Ig80DWyT0skpRMK42CSb6pYFp1qwOWGso2ODTJPJeMTo6dMRG2zAmBTOKis0XigrwJQf4yD4vvlUyyXMkgG5QMqx6Vv017ZajT+Rqup+xK8qacdml23N2KY1w8an/be1IP5MFcAroJAd30usoPsVPQESa8fXEKBrkIpgmmV+VHu1XOcrx8NspVpeN/I2pDM3ZOgmbL1ZSwbLm3ZReUHjARmPj+xyYE8Ov470DJsGyWe5NG4O27reV8Wv5j4sbDhrw9CcTFFxJ14LJbUjqimUuAMQGfDAOvw1um14sTqmq/82rSBNj9URbk0Fkby5S0F2XGEwHzpX5/dIbcm9wnoyNgLoF0gkD6UwGavutsMTrUcB4MXNeCG2i6/NwWz3pNwLL7pevt79RwPRRtx1N2EYHElKyzb4W7r5hPACMIYFMCpwtRHN6PVYLeixrQfU4GurQSoM/jSWo2069pApcNagLf6KqJdtUYjiQlEuHNom3JcPeD4/DZBGCzgOlDnj4D/pm44n0LXODuqQKUCL9biYI7pXmgU5ULOmUC0HBw+4maKNc6+D33q76w69VGrK1oOhTPxwXKgt9tgODTcwpMD2y/TO+rfGl6CELng7dJskArmgb0R3mgRZwAru2NLNCGr7mkCVzaDU/KIDwxQ1NwcwRuqwG6UDjcNWjIiQE/Z3HB9YwIcDbK7ZTC27JjEQJUfadcgJoDh+ceFyiBAu2LEugozkbNgWO8r4D2WxcoQFqcwM3CTNQc+OWEYHCGs2bxAjcKUlBz4Bfj14GqMOcShddiBHwoev1RPmoO/Pw2P1DF/niGAOpqf1xCJw89n4A4EX1e+JmtQfl5oTGnlRtdqlH3t/oinXh/pnwSeIHzfprBkdrXsWABBRRoBjvRueBYyuYjJ7lpp8rjtp6URm9Xx/ueeCRk/YCJQhIu7WYIe4W+7I58t+X3eatYOv6qYMyR8tsApI6/ZxYs0CiMRVvyk3PVe8SVZ1L3Sqv5yZIkVunwIY74p2OR+2p5QYX9+0MFjaLQVEzAStYJghOx7PW7sAMBO7CDPiGGo27vDeHw6BUJjVTS31O7X5DAbufIVqbznSEeu/pq2qayAVFEUUt+tBjLDT98TcwRYCAsCzvEzsRwuJDFx6bDs/xiMZH3BkO+61OBFdTb8PFuXP8sgeUz+0YbEvJfuC3l8VUbypPhz1d298T4V7fmcgR1z4LvY3IxodeXUMBxaMsHcfUUi9F7JjxiYb7A0dYwX9taj16gWT0ZXv1OT2+Ee8XNnJDUutngGV7RmIAeMC7wka2hB85lm6xJLCw0cCb8B2UMsrEaq6JaPhn+0L6nj71a05Hus0s3CU+nh2PZ7r6GA5+5/k6xGOmH45eYrEMsmBO4CnydG/1p5McqCunxQye73oGglcpbSWu5V7JdGAa/t9V/kZB/NxPnjc8lFl5E4KpeVNJYIYU09sCJ9utDB+uBEVgjEceNjyUWXnQgwQWZdu6JMSm86pgUXnVMCq86/wP5/5POGgmAIQAAAABJRU5ErkJggg==>

[image99]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAErklEQVR4XsWXbUyVZRjH/5wjiqjl2xxHVvhClkXCecHolVnyAcqMzGlBgITYTM1qwg5TIAOWOrQQhHOA5exDw3I1P1ixVWatQsqCiqxk1NaX5sYyIyOmT/+Lcx7C+z7n8Jwv9Wy/3fd9Pdd9Xf/79TkHhmHg/0QzRAMwPVNQ7dGgGazAJwZI7AOe+COA1BGj+llBM1gBmJUDbPtTegeQ+qwc1c8KmsEKgCMP2PnXvwKk7shT/aygGazAZ9KkmITz9pi6K0KsLWFQbKqfFTSDFaoB20EnunMc13bnJl5zrtGFs023YLrqZwXNYIUWFzb43Ghtd+J2lt/4Paj3u1Gv+llBM0zEkWWYxqS9vnSUsjxMfmh14V6xsVyq+k+EZpgIJtrd4sYLLR4UsL6N9LGexeTbfR58qPpPhGaIBKd8PhN+6U9DOhO6BUnKJVjPd9kU9g6XZ53aLxKaIRJMdMTnwlOSmMk6KeYulkdlJkSA34UiWZJoNqRmCEezB05utA/GRu7CG8EZaJQlEQFsP8x6G3lJ7R8OzRAOjux9stYUMCbEjV3kkCmA5FNon9UNqRlCwU22mqPqMJOyvpkzUBVsl8psmAK4DHmclVr6fKzGCYVmUOHoYskZvxMrx0btQQVH+fRom+Io4ORVAtwoEVubE+vVeCqaQUUSyZpKssaMqbdVPpK1q6Ig70RN9tJ1YgteRt+qAtjPy379E21IzTCeV9Iwk8F6JYkk8xbkddVs3ze833vUqNi4eahy1R1bR2fEjR9VAXIyZGlYvqzGtSxARk68kqQ+M2GFt/jJC77azw3hYGWn4S0s7AkK+K7NhVWqAM5CuS9wU4bdkJrBhB0XM0CXue6HlsfdXV5UNNhSc3pUgMxC1dr7+7kfjlPkKV8aSlQBfFfGGH6Wn6jxrQh4Uz46wRE+xpPQv3vNyne9xSUXq7dUD5cX5g/Wr3A82xoYaSenu4c+b41e0TwhpgD2r5KBZM+bsge44QA/20kRBfC5eU8qVjDIiWZ+ZOSeZ1nEIFspKL8pY8bGuqzk55udeFzaAt91MOFh+pVxNipZ/4r9X2O9Tt4lxc8fiLUVXwE6mCDlAhB3jyaAz/XAggHgod+n2pNH0mcnHmOgAQloJgoHkzTLjDHpDh7XnX75WLmwj+32A2nomWJLGffr6Wuy5FQIATe2A8eDTsNGrG3Bbw0ebFKThYKJav1yUyoCKL6hIRXt8fZFfwOXg7FPkpuOhRCQ3A2cCzoZRpzdOVJ3K7/3/PioCVU4+ufImRACZGl+cs50MPZy/mwrG+ZE/8pkY6dinIA5ucB9Q0AXG3tHJtuSvuAtt4MBPiK9DPq6bC7/uLUfx4YXU/BzE/eACKDfXvb5jJuw2zyCfBKAGQ+yjDVzXiUg4BSXyel5G7juGTammXa5zXi8chnwVY7qLHmPSRuZaFPZEmyJtyf9Eme/8/Jk28KLDzjmdMmo+a7UsPBfQTNYocWJ1NHNyeOVMTfhfGB3S7Qhg2IuNS/DPLVPODRDtNhiFvcAA2N7J7DWmKv6hUMzRAtzPQqsvgR8z0Ybz/rC06pPJDRDtPCxAbPX8Jb7FFhUJ7tZ9YmEZviv+QdirjWIxO4JjAAAAABJRU5ErkJggg==>

[image100]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFbklEQVR4XsWVeVBTRxzHV0iAxJY6Ylu0ozJWS52O2goxJqhEHGWYolQ8aOsx9QCsYMEiMYpoCllBOaIBAo/kcSlyKGfkCaIUIigR8Wo9OCO2VmpPderVP+i+QCDZp0QctZn5zNv9vt/u7/vNu0BPTw/4P2EKAHBx7VXCFAAIw7VXifkEABaimz7ihZZI4QFH1XTggeuWMJ8AMBNBD2bihZZQC2xL0nlWDzM/BiPwc4NhPgFA0mdAghcOBuECpmR5OLRkuA2/qxZySvHzg2E+AaCyz0AlXjgYpBvnVOO+rZn5iz+4nOv1Xoeab/05XvMsBga91/9+nwH6+Fz3QbqrtVe+z4RznTXFkArx1lQEeepIIfcn9K+MxmufxsAAAH5fcyN8vBincBmwJoV21y4elCe3Hy+ATWk7kw8tHN9eK11Tge6JOrz+aQwMABBjBsR4MU46n72xZDWvlk7fRuXCa8UEzBSN6G7RZKfnfzbpAjGDHYyvwTE1QGEGKLzYFNINvImuvb5FkxNPp28pz4RXCpQwb9H7508nhJacz4AkOn9TPR1MxNcyDKCfFaIV9L4DHvUd6bkVvsCI2o0Tdyx04VHT9D/k7oPlgXNLNYGiM5dz5URV+JJSFZ99gb5U+HozA2YCABdxDQe9dMZmzrHv1J8sjTFNfyl7L2yI2bg/x9NRTxs4mxxB5PlMaCT4rCh8j/5+DOE5DKjduEVaWUB+f/qi3vTN5G6oU0bALHf7X5AZFW2gNmqdihTY6VNdwSf4PoZ+DMGCAfS6dclZ4Hj1hrYc4umbCSnUKbbCQ5+Oa6rZtbqMNlAHA4gy/zmFKh7rumIisMX3YzSwZAA947pzhFTVm/6ASXqZIX1D4mZ4ZBWvqHiVq85ooCrclzjoOaZOxbNS4vsxGgxmII1n7VuwdLKuP30pnT65P/0ZlL4+NghWiZfKsz0cukwNlK+fQ6hm2rShSyF6IQPozcYmhZzWK0eI/Z01RbDtqDF94kD6+M1QK9sAayJXwozZb9w6LQ8jTQ3kLXTKJVyHdSj4wH7IBkihbRja5MRAehJLH25IXytdC09sWw4PLHBsrESPqamBwiUfEmnCkXV7po45MSQD9CeWdBuub68u3Gua/hIjfYAh/fEwX3jIZ0qx2lvYUbJNXJCxPkjzrUj2924PP63/5E3n7Nm3W4ZkAN14KdWS5WWG9JXm6XXK6FgiJKUoP1yqyv1Gogqan3Un2kdavcd7Q4VC4PQgyT9ep1gp1ib4BGppA072F2+grqLnNqDkgQmZc0e0609VxBQl1x6uTNNk1JM5CvGq739LCD6iJbekHd7ul3cNrkiti1sRS8Uu/Y6CiyRUlNdmSil4908iYGeD0UDIjC1nuay7V8z6WTLgO25Hhbtz/a+hX7XWykKaridJaurVEWVU6pbCypTQA5Ti63RKvi6Jil8dT+3xk1ExiyMpmbeYki7YRMmFH7UTy/x+NBpwdmjWo47elgyMMZ/3oO9Ej/tw7pMsrt2/tyaN/b1tpVdzc+Kmwqqk4AxqX0AqlbhGTuHppfM2UrsForOp8126aAPb5kXoOOx77Yx+uDAYqHoYgs+1fZLKtX10c9w7dzoWC+ouRC1POW5MH9WXPlIUQO0QfFmlFIz6izYwbXRTpzV4/AVjT1wYCmj1NA77UQLH5oHe8a1uvefkY5fC5+6q3onSR8xaS0n4K6ikGaP+iPbZ0cS1+aeL/jcZe+DCi4J2crZjPY7msO+3OXBvd80eW3p5w9Tgk3EuE1tnjdd0s62f+ONrDOtw4WWAdnViWT3cbse6d/Vtu447I21+voc0Nl5nqMWFlw3qMBrx1E+x4TwuvG4YwuuGIbxu/gP/iUOC3OyC7AAAAABJRU5ErkJggg==>

[image101]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFX0lEQVR4XsWWbVBUVRjHD8hd9o11N3BRQRYJXJhNZXevysuMM2YkOGrWEikDooYIIs0mKCQl0jBTWI6TUu4uKWhSiiHppEgGSquEYgwIjOILKSC0TiQDNjC+zOk56NJ6buDCB/rw23v3uec8//95e+5FGGP0f8IJjDecwHjDCdgL9FQAEXR8tHAC9gI9Tzo64h64utDPRgMnYA/QiwWO8Pm4WyLBxfTz0cAJ2AP0KgfCXFywOSAAN/B4WEe3sRdO4EVAj7eALwCtkxPODQ/HF2Qy3AT/5XRbe+AEjFoUbWLRMjo+2BhhBjADIcQAoPPwwNf0enxUKMTldHt74ASMGpQJJq4DzUYWbdntiyRDjRHeBGQ+Ex9EIMBdBgM2qdW4imFwIp3vRXACJg1aDSby8jXoVZMW7SZmDCzan6xYEgytq9DTDThkQCTClRs24NLsbGyCDUmWwpvOORKcgEmNXjNo0REwoCWYAtEcMJIW7Fr4h84zrWWFV0o6gx4OmYCj+HFoKK7OycHGyEj8HWzIaog70nmHgxMoCER+MOpKqwFC1LTU5WKnbvNKr40Zet+wii3KkDsJPlGGl8U1CyDDUjc3fIMYSE7Gxhkz8BnYnNvovBwQctjLIjXnQYE34oOBRlsDLk6WitnS46lh8p0xhGVTtick+7xRlO4fcuc9v/CTIsHDe1lZOJ8Y0OmwETZkAxibSee2YpqDQmCZS/ap0VTOQwIswTWreIhbwTopr+NHq7gti+Sfx66dHrNT5Xr+fsLSs3+lxv1WGRn5xMSy+CAsTR2Y4Nnm/XIOmgzL+S0M0PLVLKQkMY44gZwAsvYGNcMKJ9yvDZIVJNLitnjwG/fOm33v+tbo4zdTwr/p0QVX1E2W91dA9j0kX4IWMTDirZC3G+j7mkVzrVoc8UEDLKqC07DIX/zzNjnvxgFakEYrPZriKu2/u3nNlZ/iF5+ti2IP9+tU+Y8lzJ99b3pmZoBoE1AMtEKNee4FxhEnwDQd2fGK+1qBY2/9wkl5cbTg8qnpKWu843LjFKu/189YaI6YnGMRMn1PNr9delfp2dGtkFs65ymbTjOOD29lq/xvw8laATkvGzQohtbiiBNgunapJ/5Q5iOuzovxStgeo1h3SO/7evmSqVntQS8d6E1Tzm9UScpuegnqrkYrEj9SSU5nTxT0XI5Y0G2OXd5Wsii0rUTpZSn3EDY1gPAByHcOZvV9WmdYAxnKuTkyXvtj2OG/a2Qlt6fwm9vW+MTlamTHdgSIz3xIzwhhmqB+T4Bvb7PVgFg4cGVbwKxWEK8CE5/SGiMayJ3pfmj+JMMVN15rLePw4Nwk59Y9c2WHRtyIQbKiJIlooIsYCFVbTrkLb5F1fwQj30/nH9EArFcsdCzPZ9G7cC3aFTjxxgpP/UV3fstFZ4cHv8iYOwZWVryRNkAQOg90RkV0nHCTDtRn+AffBvETpODQGsMaAEEvoAVYYFuIYOcSU4V5akHLKkV8rYegoYbn8PcFKdO+L1BaqrcacBVYKjSqnktugo6rMO3ni1XouTrwX/z7B5yCiBnWbL2tOA28mFZCu/w8De9q/PR36ryFl6r5E3prJEznQTm/pVAkeNy13ifqpO1bdCSGbmC6suDsH6QFR0SLkqBfrUHr+CjFb3GDj6i6hs/0NpOKRwsNx+APqUykWEDSIFoEKmIIGTVM6QcwOwYQLIPz3Aztr5HjBXETlO40UmBAeBot8CLQZ7OQyEg+PjRoI1yTyJGB+8Nw/dX49MOkHgSOwfUT2JiriCnywqITjRVEPjYgeRsInn02mk1jHc1YQKd8kTMdHE84gfGGExhvOIHx5h9hSJNNbk2N+gAAAABJRU5ErkJggg==>

[image102]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAHIElEQVR4XsVXa1BTRxQ+uUkQVNRKSrUKIiiCINXIGwm+sBpQXpU3GiAPJAIihfJQsLbXB9XxWkUhCVEsUBCQBERUFC0qNqilFofBquPUtj9sp1ZrKfWZ7iJpYy7Q8KfdmW/Injm733fOnrt7AK1WC/8naIbhgIaFLcC2mQCXJwKEoTlh6DNS0AzDYTpAhwLg5U20LAigjwMQZegzUtAMQwENjjvAg/4lCHcR7Blw3dBvpKAZhsJBF7B0YEFf74CAaoQQS9bPck+2RubByi+eB+8YrjEGNAMNAAyFO1Mo9zC5JZ5r1TKLzX64mMXsdR4z+vvPNqes11AfSFQCr/1lizlnkU+P3NPkMxkXQoqcYOzfJABjrADSHQCaTQH8hhSABtscYBX6OwnP5VxwlLuz2yuWT2nqKMoRdZXvjm3/NHu9ItKjG/+m4ciuuJaNwQWVq2xrSr3NvlF4jLogd2dlziTgWiHAMw2iWwLQawEQQhOAhqM1wP0sgCf4rPkTGBqFt2n36YyQfH2Sq4qtwpbs8IM08kHQXpgqLQlxOezFZDzT1c5thBkAV2gCUHrqzg04vUBwYhF9F/ZvSTDcdKRo35slns0mnjwZ2LsBwR5AQROAjG1dA04Ybkx4XrLcRn0KpfRrlFrdhleL8pIbxX7XDIkGgzqRR5X6jP5R7PL2DWcT1h9hBDxHWb6Dsm1NE4CKg+cM8AhXt4QBf841ZbUrF47PQxucUHiZ3ClbyjmvjvfZd+mTtNSWrPdk+kRYYGbMyg+P78oW4/kFUpJWtoTTWREwrbN9d9qey1Qm2Zgeti/PmdWp46MJ6J8ATAu2YNwLth5bUB0+h1cf67mwQchb3CTx868JmpF8eNEbZagubigXjL1RFWpf1ZoblbN/Y8LGGSbsB0KCeDKXxXocYzfxm0M88x9aN0WXXy8rJK8c2ExeKkwhT2cEU6igLw0rAEM2n3G2aqVNkD55c9LSd5ul/vxTUn5go3DBmooVU76qWDGVUvLM2wItiN9PDRzbcwSU6qedVfsLuz7/lLwm30ri6Ns+FpMnUvlIAOvfBZS4MlqrQhxCByNvkr4b1LhuaXR1qGPRyVR+eLN0eeR8M5NbPXq14zHKpK+1eMdu/ejPFwjIpqQllMwYATIk4Ohqp/cGI29ODQw5mcYP05GfSF4Ws4Y7vdCLYPThLOQSxHOe1eS7htGfyYkk1YkLjBdQF+kcMRS5OsFPVBFgo8HkTUn+cU1JCwUZixzyV3FYD98P9j/1VeW+7Th6zYG8/uhbUfToLiHrBR6UzI1pjABmqzp6XuRg5E0p/Cj5ulB5sST0dtm6gFxMflzES1An+IqUvHHdnUqSGiz6EykryGPRXOMFHIvlxhiS47TvS4nrUmcnP9Xkp2uLU9b2ycUBezC5Kt5Lggqy+2rxFur16Nf0R9+QtIisXe1kpAA35rn6OI84Q/Ia6UphUarg9x925Gq/356t7dqSrj2QFHEbk6vWuCUreWO7O4pyqVfRZ7wWvSrBm6wKmUmh4zVOQF2cm8Cw4BokyxIpadxv323L1t4js7SX89ZrD8bz75XzrS7WR3PXo7uh58s9GdRg0R+LdSUrAq2NEyBHAlTx3vH65HWxrrnl/KnfycVBZ4qkMY8/3xD/lJKE/1q+1je/Otxp89EIl7RS79EPT6YHaXD0LTmRsjM54X9HXxPuTApmW6q8OW/9iC+7YQXkzmZ2VEa5SjC5WuQnahQvFKqFvutU8e7puOCqhX6pykT/nTjtOHJMXhvmmF7qM6YHXcHUxZ3SbapEn64GEa8W1ceeo2GzaqeNt73FZIieAVQjRudHAKY8mgD8QNgA3MUPxmwm8TjKjqMuXzH1Xl00t0C/2nVnrk9eHWyXUepj1vPFFgHVthWd/Qcoeimq/Di3vSXLpn45ijmn75+7qgvBvo0mYBZAKX4qsQk/nfYs4lGtyDfJGPLKQJsshY/ZzbOboil89iczgvrPvi6WSx4OtN1pxrRDW74YEHAewaGOJgA3CbhZGPDS4iZir5/lkfoY7oZ/I69c/nY2eqRunskMo3TRqwTeJHozlDI34va8CZM7ANwfAGQhIdb3cfNDE4DbJNwu4bYJt0+4jZK7Epnoq7iIHpEbh3jjVJUBVrtqIlw2GJIfWfpm3k6uyZ2m9JV7USGS9fHeu5S+5pfkrgwNbusGjngSgDlu99g6ztcEYOCGETeOuIFEjmN0dtxg4kYTiSlHEX0r9xx18ZDf+Ipyf8sPP/J8Y8c4ts1PpkyfF2Zsu94IR/srMnfm3RIuU4y2Z+jvPxhoBmOAW/ASV6JA5sa46mUx+ZdX1Y1369WOZk7rwy284ZqhQDOMFATD7jr6eHSlo3111sAx9BsKNMNIgbiiAILQZ3YTTRQvAaZ3GPoMB5phpECDAJiI/lGdeRnAdhuaWxj6DAea4b/GX3ls6Gg5iUKRAAAAAElFTkSuQmCC>

[image103]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEkElEQVR4XsWVC1BUVRjHv33BSjwm0QR6AKJrDVqhrCwgsQZBjcMjhxALxQViA0VAUDCksIBSsceSuS92oUUR0CBAaoccBERQeaSAmjRjzUSP6THNqBlTQt912FjO2ZU7MkNn5jdz9r/fuf///e6558LExAT8n1DCXEMJcw0lsAWHqwhAwcDMyf/ZQglswDHPDeCXWlzOwMwZjaxjAyWw4WEA+bsAf99djjBzRiPr2EAJbJgHELAZ4KYpAM5vMRpZxwZKYIvYjvNDKJ879hyfMx7kwL2t9QF3soYNlMAGpZgXoZc69ahz5RmlwS79p3bHndb6247ofGAhWTsTlDATh5+EhzR+gpGe0qy0waqD8Q2JgYom+dqetoL4Fo2/zZDCDxzJNfeCEmZC7cc3NqVISxlzht6PX0+uDFnw3dfNFaqT28JbtRJBj14KQnKdNSjhXqhXc18zhLkaTeYmKkIWDA/oi6ouGUpVn76yskOLIWtfAh653hKUYA3l07BUK7G9dkH5RhIZ4PhGn4qW7S+0MwHOl+WpqiM9e9RiXjVenkNeh4QSLFEoBT4+997WHdFvkuYMncXyDEO424gpQPtbyarK0IUD2LEy8loklGAJfO4l1dFLakljc/TBTtf7NHt1pgBfZEWqdWvsh1VibgGekkLEFyx0hDIjUfqAvzbQbmhAV5JAmppTs15Ub8yKMpoCGLMiVQ0JEk2ch/PPAu6SGwDxNwHcRzGEN+sAh7zBXrNacLV9b2I2aUjSujNmz9FIz0vmAT6TBageEHjcwoNy8tDsQkRNrANo/QSf1L3soyHNrKELsh/tKJHXY2DtybTQekOUaFTIX/bX5ImN/IR4XbYaAAfXBSAWP7Hn1jpyqw6tcewlTRgG9O9s6SxJ3dOnKkzpOpCe25gS3H9m/7Y8w/NufY3Jwd+2FWw2fJ65Tt+Q4Fe59EGv6zxO9jhAJxqEYzdcZFYDPAqwNR5gbATlDzgwHuDsdOXMvq27z5flp3Urdm1velXa2/52UtHZ9zJ2NqeGdJx9PzOnX1+c2P1hbjoTrDn12QPH1osumD8CfZhbfdxjdt8APNGAezGI7PK0H54A136b6tfEU3zen3VJz5y7e7e6EhljOHikdBPZkf86U168BXf+9+YB8OwYPuwLUtLYYoBlADXGSfPfkRUCGCsPtLtYF+tdybzrpKEl8FjuN2ZGHGMCHI9dXoOv4VekqdUAOBYvxi5IAf7AbvyIxKhWgatazE3DDdlZHiAcrH5RdLStUJZDGps4sUmsqo15vIsJoA9yuIjr15GmVgOYBXnE0qGh9Yf5+CmWaSSCVvz8Xq6O9qo5lb8xzzxA98EdqQUr7UfTg1acxru/Ql6DhBLYUh4IDmpfiNNIbBoxzNUjEe4nvsyJKVg0f/mwLS/6Dp+bPm7DdcEtBfbkWnMo4X5gPr9KX4jK9+a3CHlhd6b2seIfPP2yyXpzKGE2AAhWAWy4MRWgAt9/ryKybtoaUpgtuH2GAPJuA3yEnXD9FQVnsmZaPSnMFhw8gEUbADx24dyB/J+EEuYaSphrKGGu+Rfgh0WPF3piUQAAAABJRU5ErkJggg==>

[image104]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACG0lEQVR4XsXXv0scQRQH8GdsTIhFxBRCuMbjCOkFRawCqUQELWwEg429gTRCGjutBJsEG0OqpBARLGzUJgEx4Yj/QUp/VImnBLx8nzvg7Pft7M6esBn4wO133syOt3O7q7TbbfmfTFA1E1TNBGWhjcC4d9zPNXlMUAbaCnyGHViGLtjkujwmiIX2Ag694yN4C7+4No8JYqF9glfe8Rz8gXOuzWOCGGi98IOy96AfWlyfxwQx0F7Cunc8AH/dAlQXjwkxQQy0JZilbBqu3AIe8ZgQE8SQZNc3MvIxuJASP0UTMLSH0AfP4KnLTiTwNUvy63jCeQgP7oePcCrJjr6Ru+t6Ju6v1gXwRFnQ6vCA81QNB27gIvz2Tn4Jw66vG5o8JgvaPOxJcpMa5P7bGhqgd7JVSW4qM7AG1zDh1ei3dMAT5dHxbk6dO3XpuHAStilLbSi0BmzxSWLo3HqOVEYFQ0WT33MBW3qOVJZRpNfrm3hfO/V3egl0zmXTx4EboLt3A37CB3gNzyXZI7mb0NVorY7RsTqHzlXn2uACvMl6YBTewBc4hu/Qgq+w6+jnpuvTGq3VMTq2h+eNXkCIJDcifSDVnMdcE8sEMSRwK+6ECWJIxsOoUyaIIfQ49vIFCWy2EBPEkOwXEt39+1Jw72cmiCX2lWwK3nFdERPEkuyX0hrXFTFBGUKv5dwfwwRlCf1jUpYJqmaCqpmgav8AY/NAU4/U9AsAAAAASUVORK5CYII=>

[image105]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACaUlEQVR4Xu2VsWtTURTGj2ntIzRUMxRDCVUqrQ1qnQqdHZxKcRVaHKoiDk4O3R1dqotTsf9AQaFDFx1FXISig0NdpJMiiLM+v6/nxdycc9Pc6+DkgR88vnPOd7/khRspy1L+FtRZYvUcnJAD6iaxeg5OyAH1jFg9ByfkgPpErJ6DE1JBTQM+kGnbT8UJqaDWggBrtp+KE1JBbQUBtmw/FSekgjoIAhzYfipOSAHVDg7v0rZzKTghBdRqJMCqnUvBCSmgOuA6eFrB546dS8EJOaDuEqvn4IQc/gf49wFERsAVcBuc/hMAz5XG3ojbOwYnOEQaYAO8BLvgMbgF6kGAeqWxxxnOcqfh/JIDqOkD8AE8BFN2ZuAr4KzucJcedTfT9bBCZdABH0v9VIXrd5cHBej5FJUHvaL3hBMgzYD3YMn17PKwAD3Ppcpzxvbs4CR4AxbsYIzkAISe6j3Z52GG+IPacMsRRMYWRGZfK2NJgY+8TWA78AJccIsG1ITI+W8ib0uFzzJh5xz05hmhV9A8AfbdUgT8894X2fzJbWXzV2O8vT91pv18GF9rtcOjs1wADfEZnLIHWlCXRFa+9wKs/CiK4lqr1Tp3HHeazctIfdjnZQLwFdywB8YQmdsWufhFmdu2/Sj0HvgKdGARvAIn3XIE1DixehR6qvdin0dkcL3U63Tg7ZWN3qr0XLc9P6wL/KqYtul6udBDvaKv1gnB4jJ4B56AWdcfBnd0lx7Lrl/hBGNSq4LslfoV8l6/Wup1PRrMjVYae5zhLHe4W3O+yQFCRObBPfAI7JR6A/HTET5TY48z825/AL8B5zo1i7lS/moAAAAASUVORK5CYII=>

[image106]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACKUlEQVR4Xu2VP2sUURTFT9Yl/gEVkhDNjjFpNOIWsRAREaIWfgIbRQuLgBZ2ghAs/AI2QkRQsAmEgApiIaSzURHRr5CAdexEtBjPmTfEN/e+ye5sqbvwY4dzzzvvZN/wgjzPMSjZZHZLWL0JTmjCsMCwwH9cAJgmu7cL8LnQjI+fQ8Cei/wesbNtjxWSAKfIEnlF3pEXZCwqMFZqmsmzNIPZVeDMFnD7B3DkG0tkLrdnAeAkeUk+kRtkXzxPHgE9m8DiQZz4rfSAuh1fdvlh7EXKe8lzskbOuXlJsoBC+dcC57eUfhYf8hVczidxbN36Cq8VKI2St+SumxnqCghg5j1P4qdO5CqyX5sY2Siyra8iAO08/OSL1phi5wJo8x28Bsw95vNskRmy2xVfZSFwhTyyYXXsVCCJsrVHpFnDM7LgFtYwQIGFYo9Is4avZJdbWEPncOemsHotytYekWYNelH6LtCYUGAj1qzhI7ngFtYwNTV9Wli9FmVrj0izhuskeWGkGOAdWC72iDRr0E+ka+uOW5yg2+2OCqsnUWbIrhxxyqi7YIXcdzNDp9OZE1Z3KCtkVu4A4c1hQYs8IW/IJTcv6XkEWhsylNVy87yuwN+A+TzcDfpnpJtsIp5nWTYuzJqJ0qs1WjvvciOckAQYJ/fIOvlCPpPX31utp0LPpaaZPPJWi9XghL4IR3T0wf4DD4WeC836+sAJTej5DvSBE5owLDAs8E8U+AP+jIjmPjJZXgAAAABJRU5ErkJggg==>

[image107]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEaElEQVR4XsWWa0wcVRTHV41JU59Y2Hnu7O7sY3ZhoSvQXbZQ5aWEEKEhioQGuzykwZTKJkVBGqVmJyB+AJpqO3TRWJu4MesjBtNWG6rVphULpK0kfIGiVRObKug3P+F/YLBkBnZ5ud7klzlz7uP87zl3bkY3Nzen+z/RONYDWiF4DQjqvlhoHGsFTQ/eVZ5fqPtjoXGsB7Qt4GnwqbovFuqFPCAf3Ku8Z4AHwJPAp/gEkAPuWjLvEfAWOKoOEIulwd8Hr4M6cFbxnQEDuoXdXQWnwB5wHASVMbKgXMX+CmxVB4nGYvC7weS/Tp1ul/KUBeQo9gs6ZYdoJBhVbDlDYXAEvKIOEIvFgPeDcU3nggC3YvtBl2I/DCbU49fDHWMhfRbwEBjTLWQlrgJc4Bj4ABQqviDgFfsJUKPY94ET6sWWgyVYL0Uwx2maNqj75tdSOzYTJfh1Ws++QeuZEZpgPqT1dPbSMZpJmwVDMFlycJIkiymKypBh9MxzNEF/AjE3ExISOHmcZuJmgEA+7Pba0uAyeN9BkfRp9P2dmJiYIY/VTN4o0YLTBHsWGbhMJBE3/hMBqO/OlYIzJHvOwBiG9Xq9tCoBFMl8TpM4NAT9FMdxCep+NfLhWik4SxnOmzn+itlsllYtABO+tvPCrxxrvG1guJ9Ykr2G03wUgp41Jhqp1QbnaO4bq8U2kpqaKq1JgI0XIoc7DofaXm57e0e655LRYLqd7EiZtllso0jnVZzkCUrPvAdBR1Db8eWCG1nTJYfdOer1eqV1CTh06NVQb2+v2NbWJlZWVr4p2ByzubvypgWr8JeVt90yseZpmmJ+JPX0L8jCxwzJPLMYnOf4713JrrGCggJpnQJsEew+1N3dLQYCAbGqqkp02pNnhoeHpaGhIam/v/9UXU3dea/HN2kxWf9EqWZZ2jCDek/h/Qf39kfHSktLpSgC0qMKsJptkYMHXwoFg0GxqalJLC8vF522OwIGBwelcDgsDQwMSH19fVJra+vJstKyL1NT0qY8GZ4rECzFEBA9A7KAwIuBUEdHh9jQ0CCWlZVBgHNFAZ2dnVJ7e7vU3Nws1dfXS5sgwBo5sP9ASK5/bW2tWFRUJArxFMBDQGNjY6ilpWW+/lhIFKxxFrDv+X0huf4VFRVidnZ2nAUYrRG/3x9CFubrn5WVJdqtwoYEmDhTmCTIISqJnlmFAD6yt3pvSK5/SUmJ6Ha71yRg9+7ykz6v74xTcI4YDeab+Dz/wG06josrnLSN3G/SmbZEFYAr9MJOX8656j3VnXL9XS6XaLcsL6Crq+sdv7/ms/y8/MtpKWmTZiP/OzYwZbPYB3FztjssjvndLofGsQh+oRwsxfUZaO6G3WI/beEtvXjOXPz24omenp6PcAldyHs8byLF4bqFG/Ln7S73UGZ6Zndmplf+dbtHvd5KaBxqIGQrRbAN+MO5jrth1pWc+ps3M+u73MdyjxXmFVYUFxc/qJ6zFjSOaKAU29S+jaJxxJt/AAURsQFTPDYTAAAAAElFTkSuQmCC>

[image108]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADW0lEQVR4Xr2WW0hUURSGf4M0JsqCIoqy8lZqkFAUSb11Mewh8qUiBCGJCiqSXhLBwIdkmsIbKqOGeBsVSU0y8J4KMllkOOGVHiIkBc0kjDJXa5+ZcebsnZnNTAMfZ61//3utffbsOWdARBAAdIO54sz/F64AdIJ5JBt8jSsA7WCaZIOvcQUgP2ZANvgafQKyMgbZ5Ev0CaiMiZZNvkSfgFKYC7LJl+gTUDxzTzEBa5n9su4N9Akoiqly1yKBZBYnzwOzIcAYm7bKRTxBn4D8mdeuHKvDgU8/hY1pYCKAPLmIJ6gC6C2zyh5jSwwwpdmYAWYP8EKe4wmqYL/RYGfO2959H5jvYPEo8DUQOC7P8QRVAGUwca4ca3YC13jraw3AQdn/twD+fJz2ZvO3qjvMvzFSIpMs654AhPGL7uQs3wMnZ/gafndxTDXTEcbsrmVmZsYy100m09WMjIzE3NzcGNb95blLAQS/B75o3YA5JuTj4phqpg1Mt7tWUVHxZnR0lAQjIyNktVqpqalppra29nl+fv5tnuQn19HXDLMB444FiDMdOrbkAuwTyOaM09LS1tTV1U07F+Ckra2NBgcHqb+/f6G6uvod79BFuY6rXvA5IGIKSJkHovgaemm5BYhDv0nEFovlck9Pj3bnJSUllJOTQ0ajkdLT03ULam5unjSbzSlyLVdN8TQ1nOXrep0uGx0LyGOOibiwsNAyPDxM9fX11NjYqDXjrdcW4b4AxwI/8BnZJtf7E4qgiaCbTJKIS0tLX4oGRUVF1NnZqTUrLi6m1NRU6urq0vKWlpbx8vLyx1lZWZvlWsuhCJoIOsWYRFxTUzMhmvT19VFBQQHxL4A6OjpoaGiIWltbJ/mAllVWVq7ornW9ZEETQUHMM5vNdqihoUG31Y4DOF3FH/4l7JLnrhRF0ETt79ncAPd42Nvb6954lk/8E97ycHnOv6IImojIB8DhHwZD9PeEhDui8Tc+eI3t7e37ZK+nqAI/NYDYGWCBBAEBcfNJSUnxss9bqAK283M7e0GM2BFx0C3Z5y1UAQi0P61sZCfiM2sbZZ+3UARNxDp+IR3o4zfXBPfWHki+QhEWB0ABzCtZ9zaKoBt0+3vmKxRBNwh6yuyWdW+iCLpBkJE5Leve5BfUDAPEYEcy+AAAAABJRU5ErkJggg==>

[image109]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACjUlEQVR4Xu2Xy29NURTGv6JKlXpHNWkTt70tERLvgVQ9EoJKqXoMLpcgxhL/gL9BGIspf4iEsRkxNNJIm9SA7fvW3rdk3cc54hwx6Jf80ttz9+5aZ+9v77UKLOv/UFhFNpB+0pt+7/KjSlbYTMbIAXKI7CcjZAvpISv8jIIVVqaAJ8kVcoPMkkvkDDlGdpNtsBUqRWFdCnSd3CMPyH1yl9wi18g5sheWcEd1DQC1ceDpVuCE/7KDws4U5E5K4HeUTB1xVaro4BMu5StOWHzNQRPA/C7goR/TRvqjYQ/iNjRWwVNHTHKHn53USzPNBQ4Qc2QY+OQHdVDoJkfITcS39gmIGuzlQp+fTfVUmMD3lMDnmMAHPyhDdixPIe69Dy6UmIyqE9NkylHg2RSw8Bx2nL4OAbN+TA6FQXIB0YQ+AaEtuox4fJv8sAaY4Js/5scx/11OLflhJgXzCQiZVX4Y8LMLUm4/8Ki19EMRCusRL6gsPxxGCz8UpFx+0NHVbdnkhwKU635Qcudhl1kpsiqZ5Qdt0yTsGJciGc0MJ+P54KLhByXa7WcXJF3BbeuFKMQP7AHQ5q43P1TJdArmExANPwz62TlUfQQMs4Yc/wIMveeDjX4Eoh8OIpbuQv2wHRhn8G+pmL38wYRe+EFR1j+oIBXqBxaX2nwMLj6S0Xd+0C8t+aHeIgHRqBe5/bCWy84K+paBF8jtRaCigtJG5gcWvzCVkmi1HXp+Fvnvhz5eOCNv6AM2EZUnfJCRufWTatO0EmrbtPcyod5eCemn+sujsG0rRWZKNaxaagU6TS6SqykpbcMkYuOb1U/+rdTCh9VkE2FzFPYhNi5q+auwfwH+uWyb6C/rtERZVXNZf6afsDatrEx6g3wAAAAASUVORK5CYII=>

[image110]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABDUlEQVR4Xu2WLQ7CQBCFR4AAjURxBW7BCTAoLCfhACgcip9jcACOUE+CgQRBAszQNtm+bvIWmARBv+QznX2zu82KEWloqNNTd+pFfThpvbaS96bY5tjAy40k4Hlz9CwJYMhbCga8pWDAWwoGvKVgwFsKBrylYMBbCga8pWDAWwoGUs3UiXqP1EIpGEjxqg4trMwj9VAKBkozdazeIrWpBQta6j6y5qsDhDecQW1VfA/pq0ep9/n4AOENjUXx/aB2oVYykvh7oGBgWS2/aEs+NwywAMTeAyVcbDfsVMtvEXsPlHLhSfgNU8D3QMFf5i3l5yOZTa8Y9HItCdjobNOrnRYbfKr1ss2TxvKG/+IJVGLs26fWpyMAAAAASUVORK5CYII=>
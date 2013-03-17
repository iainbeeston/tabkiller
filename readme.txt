Note: Below is the original readme.txt, translated from japanese using google translate.


========================================================================
            Tabukira for Netscape 7 & Mozilla & Firefox
========================================================================
Tabukira for Netscape [name] 7 & Mozilla & Firefox
[Version] 1.0.2005012901
Free Software [Type]
Piro [the author] (Hiroshi Shimoda)
2005/1/29 [Last Update]
LHA [compression format]
Mozilla 1.0 or higher environment to work more or Netscape 7.0 [Operating Environment].
              In me on Windows2000, Netscape 7.1, Mozilla 1.7,
              Check the operation of the latest Nightly Build, in Mozilla Firefox 1.0
              Going.

Unauthorized reproduction or re-distribution [redistribute it and / or reprint] You can safely go to you for free. Remodel
              I do not limit what I can publish. However, the original credit
              Please do leave things.
              Most of the code that is included in this package MPL 1.1, GPL 2.0,
              Because it has become a triple of the LGPL 2.1 license, and
              These issues, in accordance with the terms of the license under each
              Again.
              In addition, such software can be recorded to the appendix to the Book and CD-ROM
              Case, please contact us beforehand.

Piro copyright of the programs included [Copyright] This package Hiroshi Shimoda (
              ) I held minded. Maybe.
              What did I copyright can be seen in the program I mean? Furthermore
              The soup UI XML. Copyright occur in the markup of the document instance
              I think that's also not like was the view of the public ......

Piro.outsider.reflex @ gmail.com [Contact]
Http://piro.sakura.ne.jp/ [distributor]
              http://hp.vector.co.jp/authors/VA016061/


========================================================================
* Table of Contents

  Header
  Table of contents
  Configuration and file
  Introduction
  Installation procedures and
  Procedures and uninstall
  Acknowledgments
  · Disclaimer
  · Update History (excerpt)


========================================================================
* Configuration file

  · Readme.txt: (this file) Instruction
  · Tabkiller.xpi: body XPInstall Package

 ※ Both can be deleted after installation.


========================================================================
* Introduction

Disable the tabbed browsing feature of Moz/NS7/Mozilla Firefox. The Mozilla
Try it if I want to use as a browser SDI.
Advanced settings in the category (see details) "Tab Killer (Tabukira)" Panel
I can at.


========================================================================
* Installation Instructions

  + ------------------------------------------------- ---------------- +
  | ※ When updating from a previous version, before you begin the installation, you need |
  | First, access the previous version according to the "uninstall procedure" on the next page |
  | Be sure to uninstall. Files remain from a previous version |
  | If you have, or if you fail to introduce, it will be a hindrance to the operation of the NS / Moz |
  | There is. |
  | ※ Before you install, Preferences (Settings)> |
  | Lee Advanced> Software Installation (details) (Software |
  | "Enable software installation on the installation) (Software |
  | Please check in) "to allow for the installation of. |
  | ※ Mozilla 1.3 and earlier, you can install and not the administrator |
  | I ん. Always, the introduction should be made to log on with admin or root. |
  + ------------------------------------------------- ---------------- +

copy of the file: step1
  When you drop a browser window tabkiller.xpi, installation
  I is started.
  Along the way, because there is a confirmation of whether or not to register the Japanese language pack, if necessary
  Please select Te.

Restarting the NS / Moz: step2
  When you have finished copying the files, I will restart the NS / Moz.
  Group the copied file is registered in the NS / Moz at startup.


========================================================================
* Uninstall procedure

Preferences> Advanced (Settings)> Tab Killer (more) and (Tabukira)
When you click on the button labeled "Uninstall (uninstall)" and
Uninstall is performed automatically.

In addition, the deletion of files are not automatically performed. Follow the prompts
After Te, was to quit the browser, you must manually delete the specified file.


Follow these steps, in case of an emergency, such as the browser itself can not be started, you must manually
Please uninstall on.

  To terminate the 1. NS / Moz. If you enable the Quick Launch is (fast start),
     Right-click the icon in the task tray and exit too.
  Or 2. User profile directory, install the NS / Moz
     Located in (if you install as administrator) directory
     From / chrome / folder, tabkiller.jar, overlayinfo directory,
     Remove the chrome.rdf.
  If you install with administrator privileges 3., Notepad, etc. installed-chrome.txt
     Open it in, delete the following lines.
     · Content, install, url, jar: resource :/ chrome / tabkiller.jar!
                           / Content / tabkiller /
     · Locale, install, url, jar: resource :/ chrome / tabkiller.jar!
                           / Locale / en-US / tabkiller /
    (· Locale, install, url, jar: resource :/ chrome / tabkiller.jar!
                           / Locale / ja-JP / tabkiller /)

Although this procedure will remain and configuration information, use the browser on
There is no issue with.


========================================================================
* Disclaimer

Against any failure that may occur due to the use of this package, the author
I do not have any responsibility. Shall be based on the personal responsibility of all use.


========================================================================
* Update History (excerpt)

1.0.2005012901
    · Fixed a problem that you can not get the latest Mozilla Chrome URL in the browser
1.0.20040411
    - Fixed a little specifications for the menu item to hide
    · Fixed an issue where the menu items Tabukira being obscured until when invalid
1.0.20040123
    · I was able to disable the setting screen Tabukira
1.0.20040117
    Disclosure and
    · Fixed an issue that can not display the setup screen


-------------------------------------------------- ----------------------
Tab Killer for NS7 & Moz & Firefox
Copyright 2004-2005 Piro (YUKI "Piro" Hiroshi)

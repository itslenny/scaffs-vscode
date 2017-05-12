# Change Log

## 1.4.0 - BREAKING CHANGE

* Remove `header` (singular) from scaffs-config
* Add `headers` to scaffs-config to allow different headers based on glob matchers
* Minor version bump because no one is using this package yet


## 1.3.0

* Automatic discovery of registry scaffs (@scaffs)
* Made .scaffs-config.json optional

## 1.2.x
* 1.2.3
    * fix bug finding target path on Windows
* 1.2.2
    * update scaffs library
        * removes package.json from scaffs list
* 1.2.1
    * Fix missing js files 
    * Add prepublish hook
* 1.2.0
    * Update scaffs (npm)
        * CLI removed for a smaller library

##1.1.x

* 1.1.0
    * Update scaffs (npm)
        * Fixes for indention / header
        * Lighter module (removed cli)
* 1.0.0
    * Update scaffs (npm)
        * Add ability to specify a custom file header in scaffs-config
        * Add override indention in scaffs-config 

## 1.0.2

* fix bug loading directory of scaffs

## 1.0.1

* Minor doc updates

## 1.0.0

* Initial release
* Scaffs Can Actually Fucking Fix Shit
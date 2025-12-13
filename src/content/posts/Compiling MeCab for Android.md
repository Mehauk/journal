---
title: Compiling MeCab for use in Android
date: 2025-11-28
tags: [android, native, mecab]
excerpt: Building the required shared libraries to be used in andoird development
readTime: 1 min read
---

# Compiling MeCab for use in Android
The package [[https://mvnrepository.com/artifact/org.chasen.mecab/mecab-java|mecab java]] requires the `libmecab-java.so` shared library to be packaged with the android application. This article steps through the various steps required to build this library.

##### The Rundown
There are three steps To properly build and use `libmecab-java.so`;
1. Build the IPADICT dictionary to be packaged alongside the android application. You may also be able to use a different dictionary, but this article uses IPADICT.
2. Build the `libmecab.a` static library
3. Build the `libmecab-java.so` shared object library, making sure to statically link `libmecab.a`

I have created individual guides for each step.
- [[Compiling MeCab for Android/Building IPADICT|Building IPADICT]]
- [[Compiling MeCab for Android/Building libmecab.so for Android|Building libmecab.so for Android]]
- [[Compiling MeCab for Android/Building libmecab-java.so for Android|Building libmecab-java.so for Android]]
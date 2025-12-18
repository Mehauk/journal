---
title: Building libmecab-java.so for Android
date: 2025-11-29
tags: [shared library, android, native, mecab]
excerpt: Compiling the libmecab-java.so for use in Android (aarch64-linux-android)
readTime: 7 min read
---

This is not the same is `libmecab.so` which is built from the Mecab source. In fact the default name for this file is `libMeCab.so` so it can be a bit confusing.

### The Rundown
First update Linux/WSL and install the build tools required. Then download and unpack the version of Mecab-java we are trying to build.

Next is setting the environment variables that will be referenced inside the Makefile. Mecab-Java already comes with a Makefile, but it is not sufficient to compile the `arm64-v8a` version we need for android.

Now you should be able to just run `make`; compiling our target in place.

Note:
	~~It is probably possible to statically link `libmecab.a` so we don't require both `libmecab.so` and `libmecab-java.so`. Furthermore, if we could statically link `libc++` (or maybe `libc++shared`) into `libmecab` in the first place, we might only need this final result.~~ 
	We will build `libmecab-java.so` with both `libc++` and `libmecab` statically linked

### Prerequisites
- Follow this [[Building libmecab.so for android (old)|link]] to build `libmecab.so/a` as it is required when building MeCab-Java. 
- Use Linux or WSL for builds
- Install Java
- install Android NDK r29 (or the same one you used for `libmecab.so`)

```
sudo apt update
sudo apt install build-essential
```

### Download and unpack mecab-java-X.XXX.tar.
You can find the downloads [[Links and References|here.]] (I used 0.993)
If required, fix the directory permissions
```
sudo chown -R $USER:$USER ~/path/to/mecab-java-0.993
```

### Setting up the environment
```
# Set up Android NDK environment
export NDK=~/path/to/android-ndk-r29
export API=35
export TOOLCHAIN=$NDK/toolchains/llvm/prebuilt/linux-x86_64
export TARGET=aarch64-linux-android
export AR=$TOOLCHAIN/bin/llvm-ar
export AS=$TOOLCHAIN/bin/llvm-as

# Use clang directly with target flag instead of wrapper scripts
export CC=$TOOLCHAIN/bin/${TARGET}${API}-clang
export CLANG_ARGS="--target=${TARGET}${API}"
export CXX=$TOOLCHAIN/bin/${TARGET}${API}-clang++
export CLANG_CXX_ARGS="--target=${TARGET}${API}"
export LD=$TOOLCHAIN/bin/ld
export STRIP=$TOOLCHAIN/bin/llvm-strip

export CFLAGS="-fPIC -D__ANDROID_API__=${API}"
export CXXFLAGS="-fPIC -D__ANDROID_API__=${API} -stdlib=libc++  -I$NDK/toolchains/llvm/prebuilt/linux-x86_64/include/c++/v1"
export LDFLAGS="-stdlib=libc++ -L$NDK/toolchains/llvm/prebuilt/linux-x86_64/lib64 -static-libstdc++"

# Java setup, you might want to point this to the java version you have
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export JAVA_INCLUDE=$JAVA_HOME/include
export JAVA_INCLUDE_LINUX=$JAVA_HOME/include/linux

export MECAB_A=~/path/to/mecab-0.993/src/.libs/libmecab.a
export MECAB_INCLUDE=~/path/to/mecab-0.993/src
```

### Updating the Makefile
replace the current `Makefile` with:
```
# ----------------------------
# Makefile for Android arm64-v8a (STATICALLY linking libmecab.a)
# ----------------------------

TARGET=mecab-java
PACKAGE=org/chasen/mecab

JAVAC=javac
JAR=jar

CXXFLAGS=-O3 -fPIC \
    -I$(JAVA_INCLUDE) \
    -I$(JAVA_INCLUDE_LINUX) \
    -I$(MECAB_INCLUDE)

all:
    @echo "Compiling JNI wrapper..."
    $(CXX) $(CXXFLAGS) -c MeCab_wrap.cxx -o MeCab_wrap.o

    @echo "Linking static libmecab..."
    $(CXX) -shared \
        MeCab_wrap.o \
        -Wl,--whole-archive $(MECAB_A) -Wl,--no-whole-archive \
        -llog -static-libstdc++ -ldl -lm -lc \
        -o lib$(TARGET).so

    @echo "Compiling Java..."
    $(JAVAC) $(PACKAGE)/*.java
    $(JAR) cfv $(TARGET).jar $(PACKAGE)/*.class
    @echo "Done! lib$(TARGET).so and $(TARGET).jar created."

clean:
    rm -fr *.o *.so *.class *.jar $(PACKAGE)/*.class
```

### Compiling
Run `make` in the directory with the Makefile. `libMeCab.so` and `MeCab.jar` should be built in the same location.
```
cd ~/path/to/mecab-java-0.993
make clean
make
```

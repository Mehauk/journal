---
title: Building libmecab.so for Android
date: 2025-11-29
tags: [shared library, android, native, mecab]
excerpt: Compiling the libmecab.so for use in Android (aarch64-linux-android)
readTime: 7 min read
---

### The Rundown
First update Linux/WSL and install the build tools required. Then download and unpack the version of Mecab you are trying to build.

Next create environment variables for the scripts and commands that are about to be used. 
A few things to note here are; 
1. We are building for `aarch64-linux-android` which is the `android arm64-v8a` architecture
2. We are building with `android-ndk-r29` (Linux version) and targeting `android api 35`
3. The shared library we are compiling ~~will not~~ **WILL** include `libc++.so` as part of the built artifact, ~~and will require it as a companion instead. I could not figure out how to package them together.~~ (I figured it out - just needed to add the `-static-libstdc++` flag)

Then, update the config files - since they do not work for the target architecture.

Now run the automatic configuration, which builds all of the Makefiles for the project.

At this stage you also need to update `MECAB_DEFAULT_RC` in the Makefiles to point to a file that you will need to provide in your android app. I have provided the [[#Files|File]] below.

You should now be able to, in the root of your project, `make` the library.

### Prerequisites
```
sudo apt update
sudo apt install build-essential
```

### Download and unpack mecab-X.XXX.tar.
You can find the downloads [[Links and References|here.]] (I used 0.993)
If required, fix the directory permissions
```
sudo chown -R $USER:$USER ~/path/to/mecab-0.993
```

### Set up the environment
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
```

### Update some config files that don't work (except on X86_64?)
```
cd ~/path/to/mecab-0.993
wget -O config.sub  https://git.savannah.gnu.org/cgit/config.git/plain/config.sub
wget -O config.guess https://git.savannah.gnu.org/cgit/config.git/plain/config.guess
chmod +x config.sub config.guess

autoreconf -i
```

Alt-server incase the first ones did not work
```
cd ~/path/to/mecab-0.993
wget -O config.sub https://raw.githubusercontent.com/gcc-mirror/gcc/master/config.sub
wget -O config.guess https://raw.githubusercontent.com/gcc-mirror/gcc/master/config.guess
chmod +x config.sub config.guess

autoreconf -i
```

### Run the configuration
By default this will cause the builds to occur in `./src/.libs/`, but you can change this by setting a `--prefix` tag.
```
cd ~/path/to/mecab-0.993

# make sure to update this later to where you have put the mecabrc file
export DICTPATH = "/data/user/0/com.example.com/files"

./configure \
  --host=$TARGET \
  --build=x86_64-linux-gnu \
  --with-pic \
  --sysconfdir=$DICTPATH \
  CC="$CC $CLANG_ARGS" \
  CXX="$CXX $CLANG_CXX_ARGS" \
  AR=$AR \
  CFLAGS="$CFLAGS" \
  CXXFLAGS="$CXXFLAGS" \
  LDFLAGS="$LDFLAGS"
```

### Compile the shared library (.so)
Your libmecab.so can now now be created in `./src/.libs` by running `make`. This also created a `libmecab.a` file which can be used for statically linking with another shared library (for `libmecab-java.so` as an example).
```
make -j$(nproc)
```

### Files
Put this in the location you specified for `DICTPATH`. Make sure that `dicdir` points to the location you put the compiled mecab dictionary, which you can find how to do [[Building IPADICT|here.]]
```
# mecabrc
dicdir = /data/user/0/com.example.com/files/ipadic
```
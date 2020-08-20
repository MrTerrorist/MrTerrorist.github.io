---
title: 通过Gatsby搭建个人博客
date: "2020-08-20T16:56:03.284Z"
description: "通过Gatsby搭建个人博客"
categories: [blog]
comments: false
---

# 一、Linux安装
## 1、Linux安装npm
```
wget https://npm.taobao.org/mirrors/node/latest-v14.x/node-v14.8.0-linux-x64.tar.gz
tar zxvf node-v14.8.0-linux-x64.tar.gz -C /opt
sudo ln -s /opt/node-v14.8.0-linux-x64/bin/node /usr/local/bin/node
sudo ln -s /opt/node-v14.8.0-linux-x64/bin/npm /usr/local/bin/npm
npm -v
```
参考:
https://www.jianshu.com/p/7310798db1c2
https://developer.aliyun.com/mirror/NPM?from=tnpm
https://www.npmjs.com/
https://nodejs.org/en/

## 2、安装cnpm
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
sudo ln -s /opt/node-v14.8.0-linux-x64/bin/cnpm /usr/local/bin/cnpm
cnpm -v
```


## 3、安装gatsby
```
cnpm install -g gatsby-cli
sudo ln -s /opt/node-v14.8.0-linux-x64/bin/gatsby /usr/local/bin/gatsby
gatsby --v
yum install curl-devel expat-devel gettext-devel \
  openssl-devel zlib-devel
yum -y install git-core
git --version
```

参考：
https://github.com/renyuanz/leonids
https://www.gatsbyjs.com/tutorial/
https://www.gatsbyjs.com/docs/quick-start/
https://www.atlassian.com/git/tutorials/install-git#linux
https://www.runoob.com/git/git-install-setup.html


## 4、安装Leonids 
```
gatsby new my-blog https://github.com/renyuanz/leonids
cd my-blog
gatsby develop
```

参考：
https://github.com/renyuanz/leonids

## 5、遇到的权限等问题解决
```
vim install.sh
chmod u+x install.sh
./install.sh
nvm --version
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
nvm install node
sudo yum install libpng libpng-devel
```

参考：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash

https://www.cnblogs.com/zhenqichai/p/npm-eacces-permission-error-fix.html
https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally
https://github.com/nvm-sh/nvm
https://my.oschina.net/tearlight/blog/685514

# 二、网站开发和部署
## 1、WSL 2
### （1）适用于 Linux 的 Windows 子系统安装指南 (Windows 10)
https://docs.microsoft.com/zh-cn/windows/wsl/install-win10

### （2）WSL迁移
https://github.com/DDoSolitary/LxRunOffline/releases

```
icacls D:\Ubuntu.windows /grant "lijinzhou:(OI)(CI)(F)"
.\LxRunOffline.exe list
.\LxRunOffline.exe move -n Ubuntu -d D:\Ubuntu.windows\installed\Ubuntu
.\LxRunOffline.exe get-dir -n Ubuntu
```
参考：
https://blog.csdn.net/u013032345/article/details/103960743
https://blog.csdn.net/starhosea/article/details/82624629

## 2、本地环境配置
### （1）npm安装
https://www.npmjs.com/get-npm
https://developer.aliyun.com/mirror/NPM?from=tnpm

### （2）安装 Gatsby 命令行工具
```
cnpm install -g gatsby-cli
gatsby -v
```



参考：https://kalasearch.cn/blog/gatsby-blog-setup-tutorial-with-netlify/
https://cloud.tencent.com/developer/article/1602246
https://www.gatsbyjs.com/docs/gatsby-on-linux/

## 3、安装Leonids 
```
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install autoconf automake libtool
sudo apt-get install libpng-dev
sudo apt-get install libtiff5-dev libtiff5 libjbig-dev
sudo apt-get install make

tar zxvf nasm-2.14.02.tar.gz
./configure
make
sudo make install
whereis nasm


gatsby new my-blog https://github.com/renyuanz/leonids
cd my-blog
gatsby develop
gatsby build
gatsby serve
```

参考：
https://github.com/renyuanz/leonids
https://www.cnblogs.com/chengmf/p/12526821.html

---
title: 通过Gatsby搭建个人博客-基于WSL 2
date: "2020-08-20T16:56:03.284Z"
description: "通过Gatsby搭建个人博客"
categories: [blog]
comments: false
---

# 一、本地环境准备
## 1、WSL 2
### （1）安装适用于 Linux 的 Windows 子系统
```
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

wsl --set-default-version 2
```

注意：
1、Windows 10必须更新到版本 2004 的内部版本 19041 或更高版本
2、必须在主板开启虚拟化支持

参考：
https://docs.microsoft.com/zh-cn/windows/wsl/install-win10

https://docs.microsoft.com/zh-cn/windows/wsl/compare-versions

### （2）WSL迁移（可选）
Windows 10的WSL系统默认安装到C盘，可以迁移至其他盘符。

下载：https://github.com/DDoSolitary/LxRunOffline/releases

```
icacls D:\Ubuntu.windows /grant "admin:(OI)(CI)(F)"
.\LxRunOffline.exe list
.\LxRunOffline.exe move -n Ubuntu -d D:\Ubuntu.windows\installed\Ubuntu
.\LxRunOffline.exe get-dir -n Ubuntu
```

参考：
https://blog.csdn.net/u013032345/article/details/103960743

https://blog.csdn.net/starhosea/article/details/82624629

## 2、npm和Gatsby安装
### （1）nvm安装
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
nvm --version
```

参考：
https://www.cnblogs.com/zhenqichai/p/npm-eacces-permission-error-fix.html

https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

https://github.com/nvm-sh/nvm

### （2）node安装
```
export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node
nvm install node
```

参考：
https://www.npmjs.com/get-npm

### （3）cnpm安装
```
npm install -g cnpm --registry=https://registry.npm.taobao.org
sudo ln -s /opt/node-v14.8.0-linux-x64/bin/cnpm /usr/local/bin/cnpm
cnpm -v
```

参考：
https://developer.aliyun.com/mirror/NPM?from=tnpm

### （4）安装 Gatsby 命令行工具
```
cnpm install -g gatsby-cli
gatsby -v
```

参考：https://kalasearch.cn/blog/gatsby-blog-setup-tutorial-with-netlify/

https://cloud.tencent.com/developer/article/1602246

https://www.gatsbyjs.com/docs/gatsby-on-linux/

# 二、安装Leonids

## 1、环境准备
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
```

参考：
https://www.cnblogs.com/chengmf/p/12526821.html

## 2、Leonids安装
```
gatsby new my-blog https://github.com/renyuanz/leonids
cd my-blog
gatsby develop
gatsby build
gatsby serve
```

参考：
https://www.gatsbyjs.com/docs/quick-start/

https://github.com/renyuanz/leonids


# 三、部署和发布
## 1、GitHub配置
```
git config --global user.name "admin"
git config --global user.email "admin@qq.com"
ssh-keygen -t rsa -b 4096 -C "admin@qq.com"
eval $(ssh-agent -s)
ssh-add ~/.ssh/id_rsa
vi ~/.ssh/id_rsa.pub
ssh -T git@github.com
```

参考：
https://www.cnblogs.com/rhjeans/p/4798027.html

## 2、安装 gh-pages
```
cd my-blog
npm install gh-pages --save-dev
```

## 3、配置部署脚本
package.json文件配置：
```
"scripts": {
    "build": "gatsby build",
    "dev": "gatsby develop",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
    "start": "npm run develop",
    "serve": "gatsby serve",
    "clean": "gatsby clean",
    "test": "echo \"Write tests!\" && exit 1",
    "deploy": "gatsby build && gh-pages -d public -b master"
  }
```

参考：
https://zhuanlan.zhihu.com/p/101565299?utm_source=zhihu

https://kalasearch.cn/blog/gatsby-blog-setup-tutorial-with-netlify/

https://www.gatsbyjs.com/docs/how-gatsby-works-with-github-pages

## 4、配置推送源码
```
git remote add origin -t dev git@github.com:amdin/admin.github.io.git
```

## 5、个人域名解析，配置CNAME
在static文件夹下创建文件CNAME，文件内容为个人主域名。

参考：
https://www.zhihu.com/question/31377141

## 6、发布
```
npm run deploy
```
# HTTPS

## 什么是 HTTPS

HTTPS（全称：Hyper Text Transfer Protocol over Secure Socket Layer），是以安全为目标的HTTP通道，简单讲是HTTP的安全版。即HTTP下加入SSL层，HTTPS的安全基础是SSL，因此加密的详细内容就需要SSL。 现在它被广泛用于万维网上安全敏感的通讯，例如交易支付方面。

## HTTP 与 HTTPS 的区别

- HTTP 是明文传输，HTTPS 通过 SSL\TLS 进行了加密
- HTTP 的端口号是 80，HTTPS 是 443
- HTTPS 需要到 CA 申请证书，一般免费证书很少，需要交费
- HTTPS 的连接很简单，是无状态的；HTTPS 协议是由 SSL+HTTP 协议构建的可进行加密传输、身份认证的网络协议，比 HTTP 协议安全。

## 为什么要使用 HTTPS

前一段时间，公司要求对全栈使用 HTTPS，当时我还在想，HTTPS 不是只用于支付的环节吗，为什么要全栈都使用 HTTPS，真的是图样图森破
其实使用 HTTPS 最主要的用处是以下两点：

- 建立一个信息安全通道，来保证数据传输的安全
- 确认网站的真实性，防止钓鱼网站

##  SSL和TLS的关系

1. 传输层安全性协议（英语：Transport Layer Security，缩写作 TLS），及其前身安全套接层（Secure Sockets Layer，缩写作 SSL）是一种安全协议，目的是为互联网通信，提供安全及数据完整性保障。
2. 网景公司（Netscape）在1994年推出首版网页浏览器，网景导航者时，推出HTTPS协议，以SSL进行加密，这是SSL的起源。
3. IETF将SSL进行标准化，1999年公布第一版TLS标准文件。随后又公布RFC 5246 （2008年8月）与 RFC 6176 （2011年3月）。在浏览器、电子邮件、即时通信、VoIP、网络传真等应用程序中，广泛支持这个协议。

## TLS/SSL 协议

HTTPS 协议的主要功能基本都依赖于 TLS/SSL 协议，TLS/SSL 的功能实现主要依赖于三类基本算法：`散列函数` 、`对称加密`和`非对称加密`，其利用非对称加密实现身份认证和密钥协商，对称加密算法采用协商的密钥对数据加密，基于散列函数验证信息的完整性。

![](/Users/huangleilei/Desktop/-/HTTPS/HTTPS1.png)
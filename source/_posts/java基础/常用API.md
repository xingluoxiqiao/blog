---
title: 常用API
description: java基础知识
mathjax: true
tags:
  - java
categories:
  - java
abbrlink: e3dac448
date: 2023-08-12 20:18:02
updated: 2023-08-12 20:18:02
---

# MATH
<img src="/post-img/Pasted image 20230719171712.png" alt="图片损坏" style="zoom:100%;" />

# System
<img src="/post-img/Pasted image 20230719171743.png" alt="图片损坏" style="zoom:100%;" />

# Runtime
<img src="/post-img/Pasted image 20230719171840.png" alt="图片损坏" style="zoom:100%;" />

# Object和Objects
## Object
1.Object是java中的顶级父类，所有的类都直接或间接的继承于Object类
2.Object类中的方法可以被所有子类访问
3.Objet类中没有成员变量，因此只有一个空参构造方法

### 成员方法
<img src="/post-img/Pasted image 20230719172210.png" alt="图片损坏" style="zoom:100%;" />

**1.toString（）**
当我们打印一个对象的时候。底层会调用对象的toString方法。把对象变成字符串。然后再打印在控制台上,打印完毕换行处理。
默认情况下,因为Object类中的toString方法返回的是地址值，所以默认情况下打印一个对象打印的就是地址值，但是地址值对于我们是没什么意义的，如果要看到对象内部的属性值，应该重写Object类中的toString方法
**2.equals（）**
如果没有重写equals方法，那么默认使用Object中的方法进行比较，比较的是地址值是否相等。一般来讲地址值对于我们意义不大，所以我们会重写，重写之后比较的就是对象内部的属性值了。
**3.clone（）**
方法在底层会帮我们创建一个对象，并把原对象中的数据拷贝过去。
书写细节:
1. 重写Object中的clone方法
2. 让javabean类实现Cloneable接口
3. 创建原对象并调用clone
深克隆和浅克隆：
浅克隆：不管对象内部的属性是基本数据类型还是引用数据类型，都完全拷贝过来（引用拷贝地址值），是Object中的默认方式
深克隆：基本数据类型拷贝过来，字符串复用，引用数据类型重新创建新的空间拷贝数据后返回新地址值，需要重写clone方法

# BigInteger
## 构造方法
对象一旦被创建数据不能被修改
<img src="/post-img/Pasted image 20230719173753.png" alt="图片损坏" style="zoom:100%;" />
1.获取指定的大整数细节:字符串中的数字必须是整数
2.获取指定进制的大整数细节:
字符串中的数字必须是整数；
字符串中的数字必须要跟进制吻合。
比如二进制中，那么只能写0和1，写其他的就报错。
3.public static BigInteger valueOf(1ong val)
静态方法获取BigInteger的对象，内部有优化
细节:
1.能表示范围比较小，只能在long的取值范围之内，如果超出long的范围就不行了
2.在内部对常用的数字:-16 ~ 16进行了优化。
提前把-16 ~ 16 先创建好BigInteger的对象，如果多次获取不会重新创建新的。
<img src="/post-img/Pasted image 20230719174258.png" alt="图片损坏" style="zoom:100%;" />

## 成员方法
<img src="/post-img/Pasted image 20230719174324.png" alt="图片损坏" style="zoom:100%;" />

## 底层存储方式
通过数组分段，分别表示符号，基数和次幂
最大可以是42亿的21亿次方
# BigDecimal
## 创建方法
表示较大的小数和解决小数运算精度失真的问题
```
//通过传递double类型的小数来创建对象，可能是不精确的，不建议使用
BigDecimal bd = new BigDecima(0.01);
//通过传递字符串表示的小数来创建对象
BigDecimal bd = new BigDecima("0.01");
//通过静态方法创建对象
BigDecimal bd = BigDecimal.valueOf(10);
//如果要表示的数字不大，没有超出double的取值范围，建议使用静态方法
//如果要表示的数字超出了double的取值范围，建议使用构造方法
//如果传递的是0~10之间的整数，包含0和10，方法会返回已经创建好的对象，不会重新创建；但是如果传递的是小数，则是直接创建新的对象
```
## 成员方法
<img src="/post-img/Pasted image 20230720164842.png" alt="图片损坏" style="zoom:100%;" />

## 底层存储方式
遍历字符串，得到每一个数字和小数点代表的ASKII码，存入一个数组中
# 正则表达式
1.检验字符串是否满足规则
2.在一段文本中查找满足要求的内容
<img src="/post-img/Pasted image 20230720165324.png" alt="图片损坏" style="zoom:100%;" />
<img src="/post-img/Pasted image 20230720165726.png" alt="图片损坏" style="zoom:100%;" />

注意：
1.如果要求两个范围的交集，要写”&&“，如果只写一个，表示的仅仅是”&“这个符号
2."\\"是转义字符
<img src="/post-img/Pasted image 20230720165836.png" alt="图片损坏" style="zoom:100%;" />
<img src="/post-img/Pasted image 20230720165901.png" alt="图片损坏" style="zoom:100%;" />

## 爬虫
```
//获取正则表达式的对象
Pattern p = Pattern.compile("Java\\d{0,2});
//获取文本匹配器的对象
//m:文木匹配器的对象
//str:大串
//p:规则
//m要在str中找符合p规则的小串
Matcher m = p.matcher(str);
//拿着文本匹配器从头开始读取，寻找是否有满足规则的子串
//如果没有，方法返回false
//如果有，返回true。在底层记录子串的起始索引和结束索引+1
boolean b = m.find();
```
## 正则表达式在字符串方法中的使用
<img src="/post-img/Pasted image 20230720170913.png" alt="图片损坏" style="zoom:100%;" />
贪婪爬取和非贪婪爬取
"ab+"和"ab+?"

## 分组
可以复用前面已经有的正则表达式
1.每组是有组号的，也就是序号。从1开始，连续不间断。
2.以左括号为基准，最左边的是第一组，其次为第二组，以此类推。
3.\\\\组号： 表示把第x组的内容再用一次
<img src="/post-img/Pasted image 20230720171347.png" alt="图片损坏" style="zoom:100%;" />

# 时间
## Date
Date类是一个JDK写好的Javabean类，用来描述时间，精确到毫秒。利用空参构造创建的对象，默认表示系统当前时间。
利用有参构造创建的对象，表示指定的时间。
<img src="/post-img/Pasted image 20230720171641.png" alt="图片损坏" style="zoom:100%;" />

## SimpleDateFormat
<img src="/post-img/Pasted image 20230720171817.png" alt="图片损坏" style="zoom:100%;" />

## Calender
<img src="/post-img/Pasted image 20230720172005.png" alt="图片损坏" style="zoom:100%;" />
<img src="/post-img/Pasted image 20230720172023.png" alt="图片损坏" style="zoom:100%;" />

# 包装类
为了将基本数据类型转化为对象，提出了包装类的概念，其本质是在堆内存中开辟了一块空间，用来存储基本数据类型的值，而把这块空间的地址值传递给包装类对象，这样做可以使所有的数据类型都可以视为对象，是object的子类，排除了代码的局限性，此外，集合的泛型中也需要传递包装类
## 获取包装类对象的方法（以Integer为例）
<img src="/post-img/Pasted image 20230720172756.png" alt="图片损坏" style="zoom:100%;" />
细节：
1.-128~127间的数据，用的比较多，因此java底层已经创建好了这些数据的对象，如果用到了会直接返回对象的地址值，因此在这个范围内获取两个值相同的数据时，实际上获取的是同一个对象，这样做的目的是不浪费太多内存
2.JDK5后对包装类新增了自动装箱和自动拆箱的操作

## Integer成员方法
<img src="/post-img/Pasted image 20230720173222.png" alt="图片损坏" style="zoom:100%;" />
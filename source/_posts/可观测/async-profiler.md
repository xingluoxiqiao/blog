---
title: async-profiler
description: async-profiler的简介，基本使用和性能开销
mathjax: true
tags:
  - 可观测
categories:
  - 可观测
abbrlink: 5afb4600
date: 2024-03-24 19:18:02
updated: 2024-03-24 19:18:02
---
# 什么是Async-profiler
Async-profiler是一个针对Java的低开销采样分析器，它没有受到Safepoint Bias问题（只能在SafePoint处进行采样，可能导致一些代码无法被采样）的影响。该分析器利用了HotSpot特有的一系列API来收集堆栈跟踪信息，并追踪Java堆中的内存分配情况。async-profiler适用于OpenJDK以及其他基于HotSpot JVM的Java运行环境。

async-profiler能够追踪以下类型的事件：
- CPU周期
- 硬件和软件性能计数器，例如缓存未命中、分支未命中、页面错误、上下文切换等
- Java堆中的内存分配
- 对于互斥锁的竞争尝试，包括Java对象监视器和ReentrantLocks（可重入锁）

由于其实现依赖于特定操作系统的底层性能监控接口和技术，目前只支持linux和mac系统。
# 使用方法
async-profiler 是基于 JVMTI(JVM tool interface) 开发的 Agent，支持两种启动方式（建议OpenJDK11及以上）：
1. 跟随 Java 进程启动，自动载入共享库；
2. 程序运行时通过 attach api 动态载入。
## 分析已经在运行的程序
1. 下载压缩包（如果在caster容器中，应该使用对应的架构版本x64），并解压缩
2. 启动一个java程序，使用`jps -l`命令获取pid
3. 命令+操作+参数+PID，示例./profiler.sh start -d 30 -f profile.html 3456
4. 有时运行脚本时会遇到权限问题，可以根据提示使用--all-user选项

操作：
- start：启动性能分析并立即返回(停止后数据会打印在控制台)。
- resume：恢复性能分析而不重置已收集的数据。
- stop：停止性能分析。
- dump：转储已收集的数据，而不停止性能分析会话。
- check：检查目标JVM是否支持指定的性能分析事件。
- status：打印性能分析状态(输出示例：`Profiling is running for 2 seconds`)。
- meminfo：打印分析器的内存统计信息。
- list：列出目标JVM支持的所有性能分析事件。
- collect：按照指定的时间段（默认60s）收集性能分析数据，之后自动停止（这是默认操作）。
参数：
- -e event：指定性能分析事件类型，如：cpu、alloc、lock、cache-misses等。（默认是cpu，如果需要同时分析多种事件类型，需要通过-f指定输出格式为jfr，例：./profiler.sh -e cpu,alloc -f profiler.jfr \<pid>)
- -d duration：持续分析指定秒数。
- -f filename：将分析结果输出到指定文件。（推荐html格式，最新版已经不支持svg）
- -i interval：采样间隔，单位为纳秒。
- -j jstackdepth：最大Java堆栈深度。默认值为 2048。
- -L level:- 日志级别：`debug`、`info`、`warn`、`error`或`none`
- -t：单独分析不同的线程。
- -s：使用简单类名代替全限定类名（FQN）。
- -g：打印方法签名。
- -a：为Java方法添加注释。
- -l：在输出前加上库名称。
- -o fmt： 指定分析结束时要转储的输出格式：flat（扁平化）、traces（踪迹）、collapsed（折叠）、flamegraph（火焰图）、tree（树状图）、jfr（JFR格式）。
- -I include：仅输出包含指定模式的堆栈跟踪。
- -X exclude：排除包含指定模式的堆栈跟踪。
- -v, --version：显示版本信息。
其它高级选项：
- --title string：为火焰图设置标题。
- --total: 计算所收集指标的总值而不是样本数量，例如总分配大小。
- --minwidth pct：忽略小于指定百分比宽度的帧。
- --reverse：生成反向堆叠的火焰图或调用树。
- --loop \<time>：按指定时间循环运行分析器。示例`loop 1h`。
- --alloc \<bytes>：分配分析间隔，默认单位为字节，可以指定500k，2m等，例如，如果使用`--alloc 500k`，那么平均而言，每分配500KB的内存，就会采集一次样本数据。
- --live：仅从活动对象构建分配分析。
- --lock \<duration>：锁分析阈值，默认单位为纳秒。示例`lock 10ms`。
- --total：累计总值（如时间、字节数等）。
- --all-user：仅包括用户模式事件。
- --sched：按调度策略分组线程。
- --cstack mode：C栈遍历方式：fp（帧指针）、dwarf（DWARF调试信息）、lbr（分支日志记录）、no（不遍历）。
- --begin function：当指定函数执行时开始性能分析。
- --end function：当指定函数执行时结束性能分析。
- --ttsp：执行至安全点的时间分析。
- --jfrsync config：与JFR录制同步分析器。
- --lib path：容器中libasyncProfiler.so的完整路径。
- --fdtransfer：使用fdtransfer服务来自非特权目标的perf请求。
示例：
- ./profiler.sh -d 30 -f profile.html 3456
- ./profiler.sh start -i 999000 jps
- ./profiler.sh stop -o flat jps
- ./profiler.sh -d 5 -e alloc MyAppName
`<pid>` 表示目标JVM的数字进程ID，也可以是关键字“jps”，用于自动查找正在运行的JVM，或者是指定应用程序的名字，该名字会在`jps`工具中出现。
## 跟随 Java 进程启动
如果需要在 JVM 启动后立即分析一些代码，而不是使用 `profiler.sh` 脚本，可以在命令行加上`async-profiler`作为代理。例如：
```
java -agentpath:async-profiler-2.9/build/libasyncProfiler.so=start,event=alloc,file=profile.html -jar ...
```
参数说明：
1. `agentpath:path-to-library`: 这是JVM的一个参数，指定了代理库（Profiler库）的路径
2. `parameters`: 传递给async-profiler的参数，多个参数之间用逗号分隔，没有空格
	- `start`: 表示启动async-profiler。
	- `event=alloc`: 设置分析事件为内存分配（allocation）。async-profiler支持多种事件，如CPU、锁、线程状态变化、内存分配等。
	- `file=profile.html`: 将分析结果输出到指定的HTML文件，这里表示输出到名为`profile.html`的文件，生成的结果通常是一个交互式的火焰图。
## 火焰图
### 特征
火焰图有以下特征（这里以 on-cpu 火焰图为例）：  
- 每一列代表一个调用栈，每一个格子代表一个函数
- 纵轴展示了栈的深度，按照调用关系从下到上排列。最顶上格子代表采样时正在占用 cpu 的函数。
- 横轴的意义是指：火焰图将采集的多个调用栈信息，通过按字母横向排序的方式将众多信息聚合在一起，需要关注的不是格子间的相对位置，而是每个格子的宽度，宽度代表其在采样中出现频率，所以一个格子的宽度越大，说明对应函数运行的时间较长，它是瓶颈原因的可能性就越大。
- 火焰图格子的颜色是随机的暖色调，方便区分各个调用信息，但颜色本身没有意义。
- 其他的采样方式也可以使用火焰图， on-cpu 火焰图横轴是指 cpu 占用时间，off-cpu 火焰图横轴则代表阻塞时间。
### 类型
<img src="/post-img/Pasted image 20240407152358.png" alt="图片损坏" style="zoom:100%;" />

# 原理
## CPU Profiling的两种实现方式
### Instrumentation
仪器化是一种主动的性能分析方法，它通过修改应用程序的字节码或插入额外的代码来收集性能数据。在仪器化过程中，开发人员可以向应用程序中插入特定的监控代码或调试代码，用于收集各种性能指标或调试信息。这种方法可以实现更精细的性能分析和调试功能。
特点：
- 精确度：仪器化可以精确地控制收集性能数据的位置和时机，因此可以捕获更详细和准确的性能信息。
- 高定制性：由于可以修改应用程序的字节码或插入自定义的代码，所以仪器化具有很高的定制性，可以根据需要实现各种特定的性能分析和调试功能。
- 开销较大：由于需要修改应用程序的代码或字节码（JVM层面的AOP），仪器化的过程会增加应用程序的运行开销，可能会对应用程序的性能产生一定的影响。
### Sampling
采样是一种被动的性能分析方法，它通过在应用程序运行过程中获取当前执行位置的信息，定期检查程序的状态，并记录下当前的堆栈信息，以了解程序在执行时所处的上下文。这些采样数据可以用于分析应用程序的性能瓶颈和调优。
特点：
- 低开销：采样过程中对应用程序的执行影响较小，因为采样器只是周期性地对调用栈进行采样，而不会修改程序的执行流程。
- 部分覆盖：由于采样是周期性的，所以不能完全覆盖应用程序的所有执行路径，可能会错过某些关键路径或短暂的性能瓶颈。
- 实时性：采样数据可以实时地反映应用程序的执行情况，但由于采样间隔的存在，以及JVM固有的只能在安全点（Safe Point）进行采样的“缺陷”，会导致统计结果存在一定的偏差，可能无法捕获瞬时的性能问题，如果把采样周期减小，可能可以缓解该问题，但会造成性能开销骤增。
### 两种方式对比
这两种实现技术并没有非常明显的高下之判，只有在分场景讨论下才有意义。Sampling由于低开销的特性，更适合用在CPU密集型的应用中，以及不可接受大量性能开销的线上服务中。而Instrumentation则更适合用在I/O密集的应用中、对性能开销不敏感以及确实需要精确统计的场景中。

## Async-profiler原理
Async Profiler 的原理是在目标应用程序的进程中注入一个动态链接库，该库使用 Perf 事件子系统来收集 CPU 活动数据。与传统的基于采样的分析器不同，Async Profiler 通过异步采样来避免对目标应用程序的性能造成过大的影响。
### 动态链接
动态链接是HotSpot提供的一种特殊能力，它允许一个进程向另一个运行中的JVM进程发送一些命令并执行，命令并不限于加载Agent，还包括Dump内存、Dump线程等等。在 Async Profiler 中，动态链接库是指被注入到目标应用程序进程中的二进制文件，这个动态链接库负责收集应用程序的性能数据，包括 CPU 活动、函数调用堆栈等信息，并将这些数据传输给 Profiler，以便进行性能分析。通过注入动态链接库，Async Profiler 可以监控目标应用程序的执行情况，而无需修改或重新编译目标应用程序的源代码。
### Perf事件子系统
Perf 事件子系统是 Linux 内核提供的性能事件采集框架，它允许用户空间工具收集各种硬件和软件事件的性能数据，包括 CPU 指令、缓存访问、分支预测等。Async Profiler 利用 Perf 事件子系统来收集 CPU 活动数据，例如指令执行、缓存失效、分支预测等，并将这些数据用于性能分析。通过 Perf 事件子系统，Async Profiler 能够在低开销的情况下捕获目标应用程序的性能数据，而不会对应用程序的执行性能产生显著的影响。
### 异步采样
异步采样是 Async Profiler 的核心特性之一，它与传统的基于采样的分析器不同。
- 在传统的基于采样的分析器中，分析器定期中断目标应用程序的执行，然后获取当前执行位置的堆栈信息。这种方式可能会影响应用程序的性能，并导致分析结果不准确。
- 在 Async Profiler 中，采样是异步进行的，即采样操作与目标应用程序的执行是独立的（在另一个线程中采集 CPU 活动数据，并将数据存储到内存中）。采样线程的数量可以通过参数进行配置，以便更好地适应不同的 CPU 架构和应用程序负载。当分析结束时，Async Profiler 将采集到的数据导出到一个文件中，并使用 Flame Graph 等可视化工具将数据转换为易于理解的图形化形式。
- java中，异步采样依赖方法AsyncGetCallTrace，它是 Java HotSpot VM 中用于异步获取 Java 线程的调用堆栈信息的技术。它是一种非阻塞的方法，用于在 Java 虚拟机内部获取线程的堆栈跟踪信息，而不会阻塞线程的执行。
# 性能开销
async-profiler的设计目标是尽可能降低对被分析程序的影响，尤其是在CPU开销方面。由于async-profiler采用异步采样的方式，并且直接利用HotSpot JVM的内置接口，它的CPU开销通常是非常小的；Latency（延迟），async-profiler通过精准的采样技术，理论上不会直接影响应用程序本身的响应时间或延迟。然而，如果配置的采样频率过高，理论上有可能造成微小的延迟增加，但正常配置下，这种影响也应该是微乎其微的；内存消耗方面，async-profiler在运行过程中会占用一定的内存来存储采样数据和相关结构，具体内存消耗取决于配置的采样类型和持续时间，以及应用程序本身的复杂度（如方法数量）。

---
title: CAS
description: CAS的简介和原理
mathjax: true
tags:
  - java
categories:
  - java
abbrlink: 969d9481
date: 2023-11-15 20:18:02
updated: 2023-11-15 20:18:02
---
# 什么是CAS
CAS（Compare And Swap）是一种多线程并发控制的技术，是一种原子操作。它用于解决多个线程同时修改同一内存位置时可能发生的竞态条件（Race Condition）问题。它是乐观锁思想的一种实现，尤其是在并发量大的业务场景下保证单个实例的原子性，java类库中java.util.concurrent.atomic包下一些方法，均使用CAS处理。CAS 操作是原子的，即整个过程中不会被中断或切换到其他线程执行。因此，CAS 操作在并发编程中常用于实现无锁算法、线程安全的数据结构以及乐观锁机制。
# 操作流程
CAS 操作包含三个参数：**内存位置**（通常是一个变量的内存地址）、**期望值**（即当前内存位置的预期值）和**新值**。CAS 操作执行的逻辑是：在操作提交之前，与原获取到的值先进行比较，如果当前内存位置的值等于期望值，则将该位置的值更新为新值；否则，重新获取内存位置的值，与期望值进行比较。 基本操作流程如下：
1. 读取内存位置的当前值。
2. 比较当前值与预期值。
3. 如果相同，则用新值更新内存位置的值，并返回成功标志。
4. 如果不同，则不做任何操作，并返回失败标志，（稍后重试）。
# 原理
- **UNSAFE** 类：在早期的 JDK 版本中，`sun.misc.Unsafe` 类提供了对底层内存的直接操作，可以用于实现 CAS 操作。但是，这种方式使用不当可能会导致不安全的操作，因此在 JDK9 中标记为不推荐使用。
- **JNI（Java Native Interface）**：通过 JNI 调用本地方法，利用底层平台的原子性操作指令（如 `cmpxchg` 指令）来实现 CAS 操作。
- **Java 内置的 CAS 支持**：一些 JVM 实现提供了直接支持 CAS 操作的原生实现，通过底层的硬件支持或者 JVM 内部的优化来实现 CAS 操作的效率和性能。

java.util.concurrent.atomic包中的一些方法使用了CAS
```java
private static AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();
```
跟踪可以发现，最终调用的是一个native方法：
```java
@IntrinsicCandidate  
public final native boolean compareAndSetInt(Object o, long offset,  
                                             int expected,  
                                             int x);
```
这个方法的注释说：这个方法的作用是原子性地将 Java 变量更新为指定的值 x，但仅当它当前持有预期的值 expected 时才进行更新。这个操作具有内存语义上的 volatile 读和写，即读取和写入操作具有与 volatile 变量相同的内存语义，保证了对变量的读取和写入操作在内存中的可见性。也就是说，java中使用**CAS+volatile**为我们提供了一种实现并发编程的方法（即Atomic系列类），而CAS的底层调用的是操作系统的一个原子命令。
# 优缺点
## 优点
- **高效性**：CAS 操作是基于硬件支持的原子操作，比传统的锁机制更高效。
- **无锁化**：CAS 操作不需要使用锁，避免了锁带来的性能开销和线程阻塞。
- **并发安全**：CAS 操作保证了对共享资源的并发访问的安全性，避免了竞态条件和数据不一致的问题。
## 可能的问题
- **ABA问题**：CAS 操作可能会忽略中间状态的变化，导致 ABA 问题（即在其他线程修改前后，被比较的值恰好变回了原来的值），这个问题可以通过添加版本号或时间戳的方法来解决（AtomicStampedReference采取的是这种方式）。
- **自旋消耗性能**：CAS 操作会引入自旋等待，当多个线程同时尝试更新相同的内存位置时，可能会导致自旋等待过长，影响性能。
- **只能修改一个变量**：CAS不能确保代码块的原子性，因为CAS机制确保的是一个变量的原子性操作，并不能保证整个代码块的原子性。如果多个变量共同进行原子性的更新操作，就需要用lock或者synchronized了。

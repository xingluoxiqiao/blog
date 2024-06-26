---
title: mysql原理
description: mysql
mathjax: true
tags:
  - mysql
categories:
  - mysql
abbrlink: 6b129314
date: 2023-09-13 18:19:03
updated: 2023-09-20 22:00:00
---
# mysql重要组件
1. **MySQL Server（MySQL 服务器）：**
    - MySQL Server 是 MySQL 数据库管理系统的核心组件，负责处理客户端的请求、执行 SQL 语句、管理数据库和表结构等核心功能。
    - MySQL Server 提供了多种存储引擎，如InnoDB、MyISAM等，用于实现不同的数据存储和管理方式。
2. **Storage Engines（存储引擎）：**
    - 存储引擎是 MySQL 中负责数据存储和检索的模块。不同的存储引擎具有不同的特性，适用于不同的应用场景。
    - 常见的存储引擎包括 InnoDB（支持事务、行级锁、外键等特性）、MyISAM（适用于读多写少的场景）、MEMORY（将表数据存储在内存中）、等等。
3. **MySQL Clients（MySQL 客户端）：**
    - MySQL 客户端是与 MySQL Server 进行通信的用户接口。它可以是命令行工具（如 mysql 命令行客户端）、图形用户界面工具（如 MySQL Workbench）或应用程序中的数据库连接库。
    - 客户端通过 MySQL 协议与服务器通信，向服务器发送 SQL 语句并接收执行结果。
4. **SQL Interface（SQL 接口）：**
    - SQL 接口是连接 MySQL 客户端和服务器之间的桥梁。它定义了客户端如何与服务器进行通信，以及如何发送 SQL 语句和接收执行结果。
    - MySQL 使用标准的 SQL 语言作为与用户交互的接口，用户通过 SQL 语句进行数据库操作。
5. **MySQL Connectors（MySQL 连接器）：**
    - MySQL 连接器是用于不同编程语言的 API，允许应用程序与 MySQL 数据库进行连接和通信。常见的连接器包括 JDBC（Java 数据库连接）、ODBC（开放数据库连接）、PHP MySQLi（PHP 连接器）等。

**在mysql的各组件中，我们最关注的应该是服务器（也就是通常说的server层）以及存储引擎**
## mysql服务器

server层的重要组成部分如下：
1. **解析器（Parser）：**
    - 解析器负责对 SQL 语句进行语法分析，将 SQL 语句解析为内部的数据结构，如解析树。这是 SQL 执行的第一步。
2. **优化器（Optimizer）：**
    - 优化器负责选择最佳的执行计划，即确定如何执行查询以获得最佳性能。它考虑了索引的使用、连接顺序、Join 类型、过滤条件等因素。
3. **执行计划生成器（Execution Plan Generator）：**
    - 执行计划生成器使用优化器的结果，生成一个具体的执行计划，包括执行每个步骤的顺序。生成的执行计划被存储在缓存中，以便在将来的执行中重用。
4. **存储引擎接口（Storage Engine Interface）：**
    - MySQL 支持多种存储引擎，如 InnoDB、MyISAM 等。存储引擎接口提供了与存储引擎进行交互的接口，包括读取、写入、锁定等操作。
5. **缓存和缓存管理器（Cache and Cache Manager）：**
    - MySQL 使用缓存来提高查询性能。缓存管理器负责管理查询结果的缓存，以及其他缓存，如索引缓存、表缓存等。
## 存储引擎
mysql的存储引擎有许多实现，最为常见的是innoDB和MyISAM
### MylSAM和 InnoDB的区别
1. **事务支持：**
    - **MyISAM：** MyISAM不支持事务。这意味着它不适用于需要事务支持的应用，如银行应用或在线购物网站。
    - **InnoDB：** InnoDB支持事务。它提供了ACID（原子性、一致性、隔离性和持久性）属性，可以确保数据的完整性和一致性。
2. **锁定级别：**
    - **MyISAM：** MyISAM使用表级锁定（Table-level Locking），这意味着在执行写操作时，整个表将被锁定，阻塞其他写操作。
    - **InnoDB：** InnoDB使用行级锁定（Row-level Locking），这使得多个事务可以同时操作同一表的不同行，提高了并发性能。
3. **外键支持：**
    - **MyISAM：** MyISAM不支持外键约束。它不会强制执行引用完整性，因此需要应用程序自行管理外键关系。
    - **InnoDB：** InnoDB支持外键约束。它可以在数据库层面强制执行引用完整性，确保数据的一致性。

### InnoDB的四大特性（了解）
1. **插入缓冲（Insert Buffer）：**
    - 插入缓冲是 InnoDB 存储引擎的一个特性，用于优化插入操作的性能。
    - 当执行插入操作时，数据首先被写入到插入缓冲中，然后根据适当的时机（通常是在后台任务执行时）将数据合并到主要数据页中。
    - 这减少了插入操作引起的磁盘 I/O 操作，提高了插入性能。
2. **二次写（Double Write）：**
    - 二次写是一项用于提高数据完整性的安全措施。
    - 当数据写入磁盘时，InnoDB 将数据首先写入到一个称为 doublewrite buffer 的地方，然后再写入到实际的数据文件。
    - 如果在写入过程中发生崩溃，InnoDB 可以从 doublewrite buffer 中恢复数据，以避免数据损坏或丢失。
3. **自适应哈希索引（Adaptive Hash Index，AHI）：**
    - 自适应哈希索引是 InnoDB 存储引擎中的一种优化技术，用于加速哈希索引的访问。
    - 在某些情况下，InnoDB 使用哈希索引来提高查询性能。AHI 动态地调整哈希索引的大小和位置，以适应查询模式和工作负载的变化。
    - AHI 的目标是确保在高负载环境下，哈希索引仍然可以有效提高查询性能。
4. **预读（Read Ahead）：**
    - 预读是 InnoDB 存储引擎的一项优化技术，用于减少磁盘 I/O 操作的开销。
    - 当执行查询时，InnoDB 可以预读邻近的数据页，因为查询通常不仅仅涉及单个数据页。这样，在查询需要这些数据页时，它们已经在内存中，减少了磁盘访问的需求，提高了查询性能。

# InnoDB
## 逻辑存储结构
1. **表空间（Tablespace）：**
    - 表空间是 InnoDB 存储引擎的最顶层结构，用于存储记录，索引等数据。每个数据库表都存储在一个或多个表空间中。
2. **段（Segment）：**
    - 表空间内的逻辑存储结构被划分为段。每个段包含一个或多个区。InnoDB 使用段来**组织数据**。分为数据段（Leaf node segment）、索引段（Non-leaf node segment）、回滚段（Rollback segment） , InnoDB是索引组织表，数据段就是B+树的叶子节点，索引段即为B+树的非叶子节点。
3. **区（Extent）：**
    - 区是 InnoDB 存储引擎中的一个单位，相当于若干个连续的页。每个区的大小默认为 1MB，因此一个区中有64个连续的页。区是**分配和管理存储空间的基本单位**。为了保证页的连续性，InnoDB每次从磁盘中申请4-5个区。
4. **页（Page）：**
    - 页是 InnoDB 存储引擎的**最小存储单位**，通常为 16KB。所有的数据都存储在页中，包括表数据、索引、回滚段等。页是物理存储的基本单位，也是缓冲池中数据的基本单元。
5. **行（Row）：**
    - 行是表中的最小数据单元，包含表中的一条记录。InnoDB 存储引擎支持行级别的锁和多版本并发控制（MVCC），使得多个事务可以同时对同一表进行读写操作而不会互相干扰。
    - 每行还包含两个隐藏字段**Trx_id（事务id）和Rol pointer（隐藏指针）**
    - Trx_id:每次对某条记录进行改动时，都会把对应的事务id赋值给trx_id隐藏列。
	- Rol pointer: 每次对某条引记录进行改动时，都会把旧的版本写入到undo日志中，然后这个隐藏列就相当于一个指针，可以通过它来找到该记录修改前的信息。

## 内存架构
### 缓冲池（Buffer Pool）：
1. 把磁盘读到的页放到一块内存区域里面,下一次读取相同的页,先判断是不是在这个内存区域里面,如果是,就直接读取,然后操作,不用再次从磁盘中加载。这体现了**局部性原理**和**预加载机制**。
2. 当磁盘的一块数据被读取的时候,很有可能它附近的位置也会马上被读取到,这就是**局部性原理**。
3. 每次读取的时候可以多读取一些数据,而不是用多少读多少，这就是**预读取**,体现为以页为最小单位加载数据。
4. 缓冲池以页（同逻辑结构中的页）为单位，底层采用链表数据结构管理。 根据状态，将Page分为三种类型： **free page**:未被使用，**clean page**:被使用过但数据没有被修改过，**dirty page**:脏页，被使用过且数据被修改过，其数据与磁盘的数据产生了不一致。

### 更改缓冲区（Change Buffer）
1. **针对于非唯一二级索引页**
2. 在执行DML语句时，如果这些数据Page没有在Buffer Pool中，不会直接操作磁盘，而会将数据变更存在更改缓冲区Change Buffer中，在未来数据被读取时，再将数据合并恢复到Buffer Pool中，再将合并后的数据刷新到磁盘中 
3. 目的：与聚集索引不同，二级索引通常是非唯一的，并且以相对随机的顺序插入二级索引。同样，删除和更新可能会影响索引树中不相邻的二级索引页，如果每一次都操作磁盘，会造成大量的磁盘IO。有了ChangeBuffer之后，我们可以在缓冲池中进行合并处理，**减少磁盘IO**。

### 自适应哈希（AHI）
1. 用于优化对Buffer Pool数据的查询。InnoDB存储引擎会监控对表上各索引页的查询，如果观察到hash索引可以提升速度，则建立hash索引，称之为自适应hash索引。
2. 无需人工干预，是系统根据情况自动完成。开关参数（默认开）: adaptive_hash_index

### 日志缓冲区（Log Buffer）
1. 用来保存要写入到磁盘中的log日志数据（redolog、undolog），默认大小为16MB，日志缓冲区的日志会定期刷新到磁盘中。如果需要更新、插入或删除许多行的事务，增加日志缓冲区的大小可以减少磁盘l/O。设置缓冲区大小：innodb_log_buffer_size
2. 日志刷新到磁盘时机参数：innodb_flush_log_at_trx_commit
	- 0：每秒将日志写入并刷新到磁盘一次
	- 1：日志在每次事务提交时写入并刷新到磁盘（保证数据能写到日志）
	- 2：日志在每次事务提交后写入,并每秒刷新到磁盘一次

## 磁盘结构
### 表空间（Tablespace）
1. **系统表空间（System Tablespace）**：是更改缓冲区的存储区域。如果表是在系统表空间而不是每个表文件或通用表空间中创建的，它也可能包含表和索引数据。(在MySQL5.x版本中还包含InnoDB数据字典、undolog等) 参数:innodb_data_file_path
2. **用户表空间（File-Per-Table Tablespaces）**：每个表的文件表空间，包含单个InnoDB表的数据和索引，并存储在文件系统上的单个数据文件中 参数:innodb_file_per_table
3. **通用表空间（General Tablespaces）**：需要通过CREATE TABLESPACE 语法创建通用表空间，在创建表时，可以指定该表空间。

### 双写缓冲区（Doublewrite Buffer Files）
innoDB引擎将数据页从Buffer Pool刷新到磁盘前，先将数据页写入双写缓冲区文件中，便于系统异常时恢复数据。（显示为dblwr文件）

### 重做日志（Redo Log）
1. 用来**实现事务的持久性**
2. 该日志文件由两部分组成:
	- 重做日志缓冲（redo log buffer），在内存中（前面提到的Log Buffer）
	- 重做日志文件（redo log），在磁盘中。
	- 当**事务提交之后**会把所有修改信息都会存到该日志中,用于在刷新脏页到磁盘时,发生错误时,进行数据恢复使用。

### 回滚日志（Undo Log）
1. 记录了事务发生之前的数据状态(不包括select).如果修改数据时出现异常,可以使用undo log来实现回滚操作(**保持原子性**)
2. 在执行undo的时候,仅仅是将数据从逻辑上恢复至事务之前的状态,而不是从物理页面上操作实现的,属于逻辑格式的日志
3. undo log采用段的方式进行管理和记录，存放在前面介绍的 rollback segment 回滚段中，内部包含1024个undo log segment
4. 当insert的时候，产生的undo log日志只在回滚时需要，在事务提交后，可被立即删除；而update、delete的时候，产生的undo log日志不仅在回滚时需要，在快照读时也需要，不会立即被删除。

## MVCC
全称Multi-Version Concurrency Control，多版本并发控制。指维护一个数据的多个版本
使得读写操作没有冲突，快照读是MySQL实现MVCC的一个非阻塞读功能。MVCC的具体实现，还需要依赖于数据库记录中的三个隐式字段、undo log日志、readView。
### 快照读和当前读
1. **当前读**：
	- 读取的是记录的最新版本，读取时还要保证其他并发事务不能修改当前记录，会对读取的记录进行加锁。以下是一些当前读操作，如:
```SQL
select ...lock in share mode(共享锁)
select ... for update、update、insert、delete(排他锁)
```
2. **快照读**：
	- 简单的select (不加锁)就是快照读，读取的是记录数据的可见版本，有可能是历史数据，不加锁，是非阻塞读。  
	- Read Committed:每次select，都生成一个快照读。
	- Repeatable Read:开启事务后第一个select语句才是快照读的地方。
	- Serializable:快照读会退化为当前读。

### 实现原理
#### 隐藏字段
每条记录（行）中有三个隐藏字段：
- DB_TRX_ID：最近修改事务ID，记录插入这条记录或最后一次修改该记录的事务ID。
- DB_ROLL_PTR：回滚指针，指向这条记录的上一个版本，用于配合undo log，指向上一个版本。
- DB_ROw_ID：隐藏主键,如果表结构没有指定主键，将会生成该隐藏字段。

#### undolog版本链
1. 不同事务或相同事务对同一条记录进行修改，会导致该记录的undolog生成一条记录版本链表，链表的头部是最新的旧记录，链表尾部是最早的旧记录。
2. 每个链表的节点都是一条行记录的一个版本，只是隐藏字段不同

#### readview读视图
1. 是**快照读**SQL执行时MVCC提取数据的依据，记录并维护系统当前活跃的事务（未提交的） id。不同的隔离级别，生成ReadView的时机不同:
	- READ COMMITTED∶在事务中每一次执行快照读时生成ReadView
	- REPEATABLE READ:仅在事务中第一次执行快照读时生成ReadView，后续复用该ReadView
2. ReadView中包含了四个核心字段:
	- m_ids：当前活跃的事务ID集合（当前还未提交的事务ID集合）
	- min_trx_id：最小活跃事务ID（最小还未提交事务id）
	- max_trx_id：预分配事务ID,当前最大事务ID+1（因为事务ID是自增的）
	- creator_trx_id：ReadView创建者的事务ID
3. 版本链访问规则（trx_id是当前事务ID）：
	- trx_id == creator_trx_id ?可以访问该版本（说明数据是当前这个事务更改的）
	- trx_id < min_trx_id ?可以访问该版本（说明数据已经提交了）
	- trx_id > max_trx_id ?不可以访问该版本（说明该事务是在readview生成后才开启）
	- min_trx_id <= trx_id <= max_trx_id ?如果trx_id不在m_ids中是可以访问该版本的（说明数据已经提交）
    
# SQL执行流程
## server中
查询缓存->解析->预处理->优化器->执行器->执行引擎
<img src="/post-img/Pasted image 20240216204730.png" alt="图片损坏" style="zoom:100%;" />

## 执行引擎（InnoDB）
1. 写undo log，存储回滚指针和事务ID
2. 若当前操作记录在内存中，找到数据并更新，否则先从磁盘数据页中加载数据
3. 写redo log，WAL（write-ahead log），将刷盘从随机读写变为顺序读写，提高性能
4. 写bin log，备份/主从同步
5. 事务提交
<img src="/post-img/Pasted image 20240216205106.png" alt="图片损坏" style="zoom:100%;" />

---
layout: post
title:  "Java Object"
date:  2018-10-21
excerpt: "java.lang.Object"
tags: [Java, Object]
comments: false
---


# Java Object
> https://www.cnblogs.com/lwbqqyumidi/p/3693015.html  
https://blog.csdn.net/zhxdick/article/details/56673610  
https://blog.csdn.net/ynter/article/details/52712767  
https://blog.csdn.net/baiye_xing/article/details/71788741  
http://ifeve.com/java-concurrency-thread-directory/  
https://www.cnblogs.com/lwbqqyumidi/p/3804883.html  


## 一、概览

~~~ 
package java.lang;
import jdk.internal.HotSpotIntrinsicCandidate;
public class Object {
    private static native void registerNatives();
    static {
        registerNatives();
    }

    @HotSpotIntrinsicCandidate
    public Object() {}

    @HotSpotIntrinsicCandidate
    public final native Class<?> getClass();

    @HotSpotIntrinsicCandidate
    public native int hashCode();

    public boolean equals(Object obj) {
        return (this == obj);
    }

    @HotSpotIntrinsicCandidate
    protected native Object clone() throws CloneNotSupportedException;

    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }

    @HotSpotIntrinsicCandidate
    public final native void notify();

    @HotSpotIntrinsicCandidate
    public final native void notifyAll();

    public final void wait() throws InterruptedException {
        wait(0L);
    }

    public final native void wait(long timeoutMillis) throws InterruptedException;

    public final void wait(long timeoutMillis, int nanos) throws InterruptedException {
        if (timeoutMillis < 0) {
            throw new IllegalArgumentException("timeoutMillis value is negative");
        }

        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException(
                                "nanosecond timeout value out of range");
        }

        if (nanos > 0) {
            timeoutMillis++;
        }

        wait(timeoutMillis);
    }

    @Deprecated(since="9")
    protected void finalize() throws Throwable { }
}
~~~ 

## 二、方法详细
### 1、registerNatives()
&emsp;&emsp;修饰符native表明了这是个本地方法，由于JAVA是无法直接访问到操作系统底层（如系统硬件等) 的，当代码中需要访问到底层时，就需要用native方法来扩展了，它能够通过JNI接口调用其他语言来实现对底层的访问。Java中，用native关键字修饰的函数表明该方法的实现并不是在Java中去完成，而是由C/C++去完成，并被编译成了.dll，由Java去调用。方法的具体实现体在dll文件中，对于不同平台，其具体实现应该有所不同。用native修饰，即表示操作系统，需要提供此方法，Java本身需要使用。具体到registerNatives()方法本身，其主要作用是将C/C++中的方法映射到Java中的native方法，实现方法命名的解耦。  
&emsp;&emsp;通常，为了让JVM找到你的本地函数，它们必须以某种方式命名。通过使用registerNatives（或者说，JNI函数RegisterNatives），你可以任意指定你的C函数。  
&emsp;&emsp;相关Object.c源码：  
~~~ 
static JNINativeMethod methods[] = {
    {"hashCode", "()I", (void *)&JVM_IHashCode},
    {"wait", "(J)V", (void *)&JVM_MonitorWait},
    {"notify", "()V", (void *)&JVM_MonitorNotify},
    {"notifyAll", "()V", (void *)&JVM_MonitorNotifyAll},
    {"clone", "()Ljava/lang/Object;", (void *)&JVM_Clone},
};

JNIEXPORT void JNICALL
Java_java_lang_Object_registerNatives(JNIEnv *env, jclass cls)
{
    (*env)->RegisterNatives(env, cls, methods, sizeof(methods)/sizeof(methods[0]));
}

JNIEXPORT jclass JNICALL
Java_java_lang_Object_getClass(JNIEnv *env, jobject this)
{
    if (this == NULL) {
        JNU_ThrowNullPointerException(env, NULL);
        return 0;
    } else {
        return (*env)->GetObjectClass(env, this);
    }
}
~~~ 
&emsp;&emsp;对于列出的函数，关联的C函数在该表中列出，这比编写一堆转发函数更方便。请注意，`Object.getClass`它不在列表中，它仍然会被“标准”名称调用`Java_java_lang_Object_getClass`。  
### 2、@HotSpotIntrinsicCandidate
&emsp;&emsp;这个注解是HotSpot虚拟机特有的注解，使用了该注解的方法，它表示该方法在HotSpot虚拟机内部可能会自己来编写内部实现，用以提高性能，但是它并不是必须要自己实现的，它只是表示了一种可能。这个一般开发中用不到，只有特别场景下，对于性能要求比较苛刻的情况下，才需要对底部的代码重写。
### 3、Object()
&emsp;&emsp;在类定义过程中，对于未定义构造函数的类，默认会有一个无参数的构造函数，Object类作为所有类的基类，当然也会有自己的构造方法。
### 4、getClass()
&emsp;&emsp;与registerNatives()一样，getClass()也是一个native方法，自然我们还得从Object.c中去寻找痕迹。 
&emsp;&emsp;它的实现在jni.cpp中：
~~~ 
JNI_ENTRY(jclass, jni_GetObjectClass(JNIEnv *env, jobject obj))
  JNIWrapper("GetObjectClass");

  HOTSPOT_JNI_GETOBJECTCLASS_ENTRY(env, obj);

  Klass* k = JNIHandles::resolve_non_null(obj)->klass();
  jclass ret =
    (jclass) JNIHandles::make_local(env, k->java_mirror());

  HOTSPOT_JNI_GETOBJECTCLASS_RETURN(ret);
  return ret;
JNI_END
~~~ 
&emsp;&emsp;可以看到JVM返回了对象运行时的类。GetClass()是一个类的实例所具备的方法，它是在运行时才确定的，所以若此时实例终止了，则会抛出空指针异常。
### 5、hashCode()
&emsp;&emsp;它定义在Object.c的JNINativeMethod数组里，它的函数指针指向了JVM_IHashCode。最终hash是从markOop对象的hash()方法中获取的，这个方法的实现在hotspot\src\share\vm\oops\markOop.hpp中：
~~~ 
// hash operations
intptr_t hash() const {
  return mask_bits(value() >> hash_shift, hash_mask);
}
~~~ 
&emsp;&emsp;从整体来看，hashCode就是根据对象的地址或者字符串或者数字算出来的int类型的数值。
### 6、equals(Object obj)
~~~ 
public boolean equals(Object obj) {
    return (this == obj);
}
~~~ 
&emsp;&emsp;equals()方法用于比较其他对象与本对象是否等同，它适用于非空对象之间的对比。从它的注释来看，它拥有以下这几个特性（自反性、对称性、传递性、一致性、非空性）：  
- It is reflexive: for any non-null reference value x, x.equals(x) should return true.
- It is symmetric: for any non-null reference values x and y, x.equals(y) should return true if and only if y.equals(x) returns true.
- It is transitive: for any non-null reference values x, y, and z, if x.equals(y) returns true and y.equals(z) returns true, then x.equals(z) should return true.
- It is consistent: for any non-null reference values x and y, multiple invocations of x.equals(y) consistently return true or consistently return false, provided no information used in equals comparisons on the objects is modified.
- For any non-null reference value x, x.equals(null) should return false.  
&emsp;&emsp;Java内规定，hashCode方法的结果需要与equals方法一致。也就是说，如果两个对象的hashCode相同，那么两个对象调用equals方法的结果需要一致。那么也就是在以后的java程序设计中，你需要同时覆盖这两个方法来保证一致性。如果两个Object的hashCode一样，那么就代表两个Object的内存地址一样，实际上他们就是同一个对象。所以，Object的equals实现就是看两个对象指针是否相等（是否是同一个对象） 。在JAVA程序设计中，对于hashCode方法需要满足：
- 在程序运行过程中，同一个对象的hashCode无论执行多少次都要保持一致。  
&emsp;&emsp;但是，在程序重启后同一个对象的hashCode不用和之前那次运行的hashCode保持一致。但是考虑如果在分布式的情况下，如果对象作为key，最好还是保证无论在哪台机器上运行多少次，重启多少次，不同机器上，同一个对象（指的是两个equals对象），的hashCode值都一样（原因之后会说的）。 
例如这里的Object对于hashCode的实现，在当前次运行，这个对象的存储地址是不变的。所以hashCode不变，但是程序重启后就不一定了。对于String的hashCode实现：
~~~ 
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        char val[] = value;

        for (int i = 0; i < value.length; i++) {
            h = 31 * h + val[i];
        }
        hash = h;
    }
    return h;
}
~~~ 
&emsp;&emsp;String就是一种典型的适合在分布式的情况下作为key的存储对象。无论程序何时在哪里运行，同一个String的hashCode结果都是一样的。
- 如果两个对象是euqal的，那么hashCode要相同 。
- 建议但不强制对于不相等的对象的hashCode一定要不同，这样可以有效减少hash冲突。
### 7、clone()
&emsp;&emsp;它定义在Object.c的JNINativeMethod数组里，它的函数指针指向了JVM_Clone。代码会首先判断准备被clone的类是否实现了Cloneable接口，若为否则会抛CloneNotSupportException异常。接着根据要clone的对象是否数组进行新对象的内存分配以及信息写入，然后copy内存块信息到新对象。接下来初始化对象头，进行存储检查标记新对象分配堆栈，然后将需要特别注册的方法进行注册，最后将复制完成的内存块转换成本地对象并将其返回。
&emsp;&emsp;其中`_Copy_conjoint_jlongs_atomic()`方法:
~~~ 
void _Copy_conjoint_jlongs_atomic(jlong* from, jlong* to, size_t count) {
    if (from > to) {
      jlong *end = from + count;
      while (from < end)
        os::atomic_copy64(from++, to++);
    }
    else if (from < to) {
      jlong *end = from;
      from += count - 1;
      to   += count - 1;
      while (from >= end)
        os::atomic_copy64(from--, to--);
    }
}
~~~ 
&emsp;&emsp;至此，我们看到了整个对象copy的过程，就是把from指针指向的内存的值赋给to指针指向的内存，这是一个简单的拷贝操作。可以知道，在经过了clone()方法生成的新对象并不是通过构造函数来创建，而是直接在内存层面进行了copy操作。要注意的是，使用clone()来进行对象的copy是浅拷贝，浅拷贝仅仅复制所考虑的对象，而不复制它所引用的对象。
### 8、toString()
~~~ 
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
~~~ 
&emsp;&emsp;getName()方法位于java.lang.Class类中：
~~~ 
public String getName() {
    String name = this.name;
    if (name == null)
        this.name = name = getName0();
    return name;
}
private transient String name;
private native String getName0();
~~~ 
&emsp;&emsp;java.lang.Integer.toHexString() 方法返回为无符号整数基数为16的整数参数的字符串表示形式。
### 9、notify()
&emsp;&emsp;这个方法用来唤醒一个在当前对象监视器（monitor）里的正等待唤醒的线程，而且notify()只能在本身拥有对应对象监视器的对象上去调用，获得对象本身的监视器有三种途径：从执行该对象的同步方法中获取、从执行该对象的同步块中获取、从执行类的静态同步方法中获取。  
&emsp;&emsp;从源码分析，我们依然还是在Object.c中可以找到它的定义，同样在JNINativeMethod数组里，它的函数指针指向JVM_MonitorNotify。  
&emsp;&emsp;通过ObjectSynchronizer::inflate()方法获得了objectMonitor对象，执行其中的notify()方法：   

~~~ 
// Consider: a not-uncommon synchronization bug is to use notify() when
// notifyAll() is more appropriate, potentially resulting in stranded
// threads; this is one example of a lost wakeup. A useful diagnostic
// option is to force all notify() operations to behave as notifyAll().
//
// Note: We can also detect many such problems with a "minimum wait".
// When the "minimum wait" is set to a small non-zero timeout value
// and the program does not hang whereas it did absent "minimum wait",
// that suggests a lost wakeup bug. The '-XX:SyncFlags=1' option uses
// a "minimum wait" for all park() operations; see the recheckInterval
// variable and MAX_RECHECK_INTERVAL.

void ObjectMonitor::notify(TRAPS) {
  CHECK_OWNER();
  if (_WaitSet == NULL) {
    TEVENT(Empty-Notify);
    return;
  }
  DTRACE_MONITOR_PROBE(notify, this, object(), THREAD);
  INotify(THREAD);
  OM_PERFDATA_OP(Notifications, inc(1));
}
~~~  

### 10、notifyAll()
&emsp;&emsp;与notify()方法类似，notifyAll()方法也是唤醒线程，但它唤醒的是全部等待唤醒的线程。
&emsp;&emsp;通过ObjectSynchronizer::inflate()方法获得了objectMonitor对象，执行其中的notifyAll()方法：  
~~~ 
// The current implementation of notifyAll() transfers the waiters one-at-a-time
// from the waitset to the EntryList. This could be done more efficiently with a
// single bulk transfer but in practice it's not time-critical. Beware too,
// that in prepend-mode we invert the order of the waiters. Let's say that the
// waitset is "ABCD" and the EntryList is "XYZ". After a notifyAll() in prepend
// mode the waitset will be empty and the EntryList will be "DCBAXYZ".

void ObjectMonitor::notifyAll(TRAPS) {
  CHECK_OWNER();
  if (_WaitSet == NULL) {
    TEVENT(Empty-NotifyAll);
    return;
  }

  DTRACE_MONITOR_PROBE(notifyAll, this, object(), THREAD);
  int tally = 0;
  while (_WaitSet != NULL) {
    tally++;
    INotify(THREAD);
  }

  OM_PERFDATA_OP(Notifications, inc(tally));
}
~~~ 
### 11、wait()
~~~ 
public final void wait() throws InterruptedException {
    wait(0L);
}
public final native void wait(long timeoutMillis) throws InterruptedException;
public final void wait(long timeoutMillis, int nanos) throws InterruptedException {
    if (timeoutMillis < 0) {
        throw new IllegalArgumentException("timeoutMillis value is negative");
    }

    if (nanos < 0 || nanos > 999999) {
        throw new IllegalArgumentException(
                            "nanosecond timeout value out of range");
    }

    if (nanos > 0) {
        timeoutMillis++;
    }

    wait(timeoutMillis);
}
~~~ 
&emsp;&emsp;总体来看，使用了timeout参数的wait()方法，会让线程等待设置的timeout时长后自动被唤醒，若在等待过程中线程执行了notify()或者notifyAll()则会被直接唤醒。这里的timeout参数设置为0，则表示线程会永久等待直到notify()或notifyAll()将其唤醒。
### 12、finalize()
&emsp;&emsp;finalize()方法在对象终结时调用，它在GC回收对象时会自动被调用，但JVM不保证finalize()方法一定会被调用，也就是说它的自动调用是不确定的。当然，基于这个原因，当初SUN就不提倡大家使用这个方法。现在我们看到再JDK9中，这个方法终于被标记为Deprecated，即为过时方法，从注释中也可以看出，Oracle建议用java.lang.ref.Cleaner来替代finalize()的使用


# smart platform

# 参考规范


### 1.maven依赖管理

应用的依赖继承自smart-parent，maven管理规则如下：

* 所有依赖的版本号都要从主pom的dependencyManagement中指定，不允许在子模块中直接指定依赖版本号。基础依赖比如Spring、dubbo等中间件的版本号提取成property；

* 需要新添加依赖的时候，先从主pom和当前pom中进行搜索，以免重复添加；添加到主pom的dependencyManagement中，在子pom的dependencies进行依赖；

* 建议：修改现有依赖的版本号时，比较修改前后lib文件夹的依赖包数量和版本号，尽量避免运行时的包冲突。



### 2.应用部署和运维规范

初步定了一下路径的规则，可自定义（约定优于配置）

* 参数化构建 mvn clean package -DskipTests -P deploy|pre|online

* 部署基础文件

        /usr/local/
                 |------jdk1.8
                 |------nginx
                 |------tomcat

        /home/mapp/{app-name}
                        |------logs            应用的日志文件
                        |------bin             应用的启动脚本
                        |-----.default         应用运行文件夹,下面包括tomcat配置和war解压后的ROOT
                        |------target          应用发布时候的文件夹
                                |-----{app-name}.war   应用发布时候打出来的war包


* 应用日志文件位置

        /home/mapp/${app-name}/logs

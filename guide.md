### 文件的命名规范
#### 不同的类型文件，带上类型，文件名小写、中间用 - 分开；
+ app-header.component.html;
+ app-header.component.ts;
+ app-header.component.less;
+ app-header.service.ts;
+ app-header.module.ts;
+ app-header.pipe.ts;
+ app-header.directive.ts;

### html属性顺序
HTML 属性应当按照以下给出的顺序依次排列，确保代码的易读性。
+ class
+ id, name
+ data-*
+ src, for, type, href, value
+ title, alt
+ role, aria-*

### 样式属性声明顺序
相关的属性声明应当归为一组，并按照下面的顺序排列：
+ Positioning
--- position overflow left  top  right  bottom clear  z-index
+ Box model
--- display float width height margin padding
+ Typographic
--- font(font-size、font-style、font-family、font-varint) line-height color text-decoration text-align  vertical-align
+ Visual
-- background border border-raidus
+ Misc
--- opacity

### js命名规范
#### 变量
+ 前缀为名词 
+ 变量名字中体现所属类型
#### 函数
+ 小驼峰
+ 动词前缀
+ can、has、is、get、set、load
#### 常量
+ 全部大写

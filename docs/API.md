## Modules

<dl>
<dt><a href="#module_webpack-glob/index">webpack-glob/index</a> ⇒ <code><a href="#CompilerAdapter">CompilerAdapter</a></code></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#CompilerAdapter">CompilerAdapter</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#compilationCallback">compilationCallback(err, stats)</a> : <code>function</code></dt>
<dd><p>Called when <code>webpack.config.js</code> file is compiled. Will be passed <code>err</code> and <code>stats</code> objects.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#CompilerOptions">CompilerOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#WebpackOptions">WebpackOptions</a> : <code>Object</code></dt>
<dd><p><a href="https://webpack.github.io/docs/configuration.html#configuration-object-content">https://webpack.github.io/docs/configuration.html#configuration-object-content</a></p>
</dd>
</dl>

<a name="module_webpack-glob/index"></a>
## webpack-glob/index ⇒ <code>[CompilerAdapter](#CompilerAdapter)</code>
<a name="CompilerAdapter"></a>
## CompilerAdapter
**Kind**: global class  

* [CompilerAdapter](#CompilerAdapter)
    * [new CompilerAdapter([compilerOptions], [webpackOptions])](#new_CompilerAdapter_new)
    * [.run(pattern, [callback])](#CompilerAdapter+run) ⇒ <code>Promise</code>
    * [.watch(pattern, [callback])](#CompilerAdapter+watch) ⇒ <code>Promise</code>

<a name="new_CompilerAdapter_new"></a>
### new CompilerAdapter([compilerOptions], [webpackOptions])

| Param | Type |
| --- | --- |
| [compilerOptions] | <code>[CompilerOptions](#CompilerOptions)</code> | 
| [webpackOptions] | <code>[WebpackOptions](#WebpackOptions)</code> | 

<a name="CompilerAdapter+run"></a>
### compilerAdapter.run(pattern, [callback]) ⇒ <code>Promise</code>
Builds the bundle(s)

**Kind**: instance method of <code>[CompilerAdapter](#CompilerAdapter)</code>  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>Pattern</code> |  |
| [callback] | <code>function</code> | `callback` doesn't receive `err` and `stats` objects because all configs compiled in separate `process` |

<a name="CompilerAdapter+watch"></a>
### compilerAdapter.watch(pattern, [callback]) ⇒ <code>Promise</code>
Builds the bundle(s) then starts the watcher

**Kind**: instance method of <code>[CompilerAdapter](#CompilerAdapter)</code>  

| Param | Type |
| --- | --- |
| pattern | <code>Pattern</code> | 
| [callback] | <code>[compilationCallback](#compilationCallback)</code> | 

<a name="compilationCallback"></a>
## compilationCallback(err, stats) : <code>function</code>
Called when `webpack.config.js` file is compiled. Will be passed `err` and `stats` objects.

**Kind**: global function  

| Param | Type |
| --- | --- |
| err | <code>Error</code> | 
| stats | <code>Stats</code> | 

<a name="CompilerOptions"></a>
## CompilerOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| progress | <code>Boolean</code> | <code>false</code> | Displays compilation progress |
| memoryFs | <code>Boolean</code> | <code>false</code> | Compiles to [memory](https://webpack.github.io/docs/node.js-api.html#compile-to-memory) |
| json | <code>Boolean</code> | <code>false</code> | Saves `stats` object to JSON file |
| profile | <code>Boolean</code> | <code>false</code> | Captures timing information for each module |
| failOn | <code>Object</code> &#124; <code>Boolean</code> | <code>{}</code> | In case when `failOn` is `Boolean` then all nested `failOn.*` properties will be filled out with that value. |
| failOn.errors | <code>Boolean</code> | <code>false</code> | Fails build if some `stats` objects have some errors |
| failOn.warnings | <code>Boolean</code> | <code>false</code> | Fails build if some `stats` objects have some warnings |

<a name="WebpackOptions"></a>
## WebpackOptions : <code>Object</code>
[https://webpack.github.io/docs/configuration.html#configuration-object-content](https://webpack.github.io/docs/configuration.html#configuration-object-content)

**Kind**: global typedef  

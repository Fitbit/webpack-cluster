## Modules

<dl>
<dt><a href="#module_webpack-glob/index">webpack-glob/index</a> ⇒ <code><a href="#CompilerAdapter">CompilerAdapter</a></code></dt>
<dd></dd>
<dt><a href="#module_webpack-glob/lib/compilerAdapter">webpack-glob/lib/compilerAdapter</a> ⇒ <code><a href="#CompilerAdapter">CompilerAdapter</a></code></dt>
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
<dd><p>Called when <code>webpack.config.js</code> file is compiled. Will be passed <code>err</code> and <code>stats</code> objects</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#GlobString">GlobString</a> : <code>String</code></dt>
<dd></dd>
<dt><a href="#Error">Error</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Promise">Promise</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Stats">Stats</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#FailOnOptions">FailOnOptions</a> : <code>Object</code> | <code>Boolean</code></dt>
<dd></dd>
<dt><a href="#CompilerOptions">CompilerOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#WebpackOptions">WebpackOptions</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="module_webpack-glob/index"></a>
## webpack-glob/index ⇒ <code>[CompilerAdapter](#CompilerAdapter)</code>
<a name="module_webpack-glob/lib/compilerAdapter"></a>
## webpack-glob/lib/compilerAdapter ⇒ <code>[CompilerAdapter](#CompilerAdapter)</code>
<a name="CompilerAdapter"></a>
## CompilerAdapter
**Kind**: global class  

* [CompilerAdapter](#CompilerAdapter)
    * [new CompilerAdapter([compilerOptions], [webpackOptions])](#new_CompilerAdapter_new)
    * [.run(pattern, [callback])](#CompilerAdapter+run) ⇒ <code>[Promise](#Promise)</code>
    * [.watch(pattern, [callback])](#CompilerAdapter+watch) ⇒ <code>[Promise](#Promise)</code>

<a name="new_CompilerAdapter_new"></a>
### new CompilerAdapter([compilerOptions], [webpackOptions])

| Param | Type |
| --- | --- |
| [compilerOptions] | <code>[CompilerOptions](#CompilerOptions)</code> | 
| [webpackOptions] | <code>[WebpackOptions](#WebpackOptions)</code> | 

<a name="CompilerAdapter+run"></a>
### compilerAdapter.run(pattern, [callback]) ⇒ <code>[Promise](#Promise)</code>
Builds the bundle(s)

**Kind**: instance method of <code>[CompilerAdapter](#CompilerAdapter)</code>  

| Param | Type |
| --- | --- |
| pattern | <code>[GlobString](#GlobString)</code> | 
| [callback] | <code>[compilationCallback](#compilationCallback)</code> | 

<a name="CompilerAdapter+watch"></a>
### compilerAdapter.watch(pattern, [callback]) ⇒ <code>[Promise](#Promise)</code>
Builds the bundle(s) then starts the watcher

**Kind**: instance method of <code>[CompilerAdapter](#CompilerAdapter)</code>  

| Param | Type |
| --- | --- |
| pattern | <code>[GlobString](#GlobString)</code> | 
| [callback] | <code>[compilationCallback](#compilationCallback)</code> | 

<a name="compilationCallback"></a>
## compilationCallback(err, stats) : <code>function</code>
Called when `webpack.config.js` file is compiled. Will be passed `err` and `stats` objects

**Kind**: global function  

| Param | Type |
| --- | --- |
| err | <code>[Error](#Error)</code> | 
| stats | <code>[Stats](#Stats)</code> | 

<a name="GlobString"></a>
## GlobString : <code>String</code>
**Kind**: global typedef  
**See**: [https://github.com/isaacs/minimatch#features](https://github.com/isaacs/minimatch#features)  
<a name="Error"></a>
## Error : <code>Object</code>
**Kind**: global typedef  
**See**: [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)  
<a name="Promise"></a>
## Promise : <code>Object</code>
**Kind**: global typedef  
**See**: [https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)  
<a name="Stats"></a>
## Stats : <code>Object</code>
**Kind**: global typedef  
**See**: [https://webpack.github.io/docs/node.js-api.html#stats](https://webpack.github.io/docs/node.js-api.html#stats)  
<a name="FailOnOptions"></a>
## FailOnOptions : <code>Object</code> &#124; <code>Boolean</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| errors | <code>Boolean</code> | <code>false</code> | Fails build if some `stats` objects have some errors |
| warnings | <code>Boolean</code> | <code>false</code> | Fails build if some `stats` objects have some warnings |

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
| failOn | <code>[FailOnOptions](#FailOnOptions)</code> | <code>{}</code> | In case when `failOn` is `Boolean` then all nested `failOn.*` properties will be filled out with that value |

<a name="WebpackOptions"></a>
## WebpackOptions : <code>Object</code>
**Kind**: global typedef  
**See**: [https://webpack.github.io/docs/configuration.html#configuration-object-content](https://webpack.github.io/docs/configuration.html#configuration-object-content)  

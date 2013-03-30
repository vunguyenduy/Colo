/*247acc46e9518331621298396858961397c58707*/if(!window.Cordova){window.Cordova=window.cordova}(function(){var a,e,g,h,d,f,c,b;c=this;g={};d=0;h=function(j){var i;i="cb"+(d+=1);g[i]=j;return i};b=function(i,j){if(c.sqlitePlugin.DEBUG){console.log(i+": "+JSON.stringify(j))}Cordova.exec(i,j)};f=function(l,m,k){var i,j;i={};j=false;if(typeof m==="function"){j=true;i.success=m}if(typeof k==="function"){j=true;i.error=k}if(j){l.callback=h(i)}return l};a=function(k,j,i){if(!k||!k.name){throw new Error("Cannot create a SQLitePlugin instance without a db name")}this.dbargs=k;this.dbname=k.name;this.openSuccess=j;this.openError=i;this.openSuccess||(this.openSuccess=function(){console.log("DB opened: "+this.dbname)});this.openError||(this.openError=function(l){console.log(l.message)});this.open(this.openSuccess,this.openError)};a.prototype.openDBs={};a.prototype.txQueue=[];a.prototype.features={isSQLitePlugin:true};a.handleCallback=function(j,i,l){if(c.sqlitePlugin.DEBUG){console.log("handle callback: "+j+", "+i+", "+JSON.stringify(l))}var k;if((k=g[j])!=null){if(typeof k[i]==="function"){k[i](l)}}g[j]=null;delete g[j]};a.prototype.executePragmaStatement=function(n,m,j){var l;if(!n){throw new Error("Cannot executeSql without a query")}var i=m;var k=function(o){i(o.rows)};l=f({query:[n],path:this.dbname},k,j);b("SQLitePlugin.backgroundExecuteSql",l)};a.prototype.executeSql=function(m,i,l,j){var k;if(!m){throw new Error("Cannot executeSql without a query")}k=f({query:[m].concat(i||[]),path:this.dbname},l,j);b("SQLitePlugin.backgroundExecuteSql",k)};a.prototype.transaction=function(k,i,l){var j=new e(this,k,i,l);this.txQueue.push(j);if(this.txQueue.length==1){j.start()}};a.prototype.startNextTransaction=function(){this.txQueue.shift();if(this.txQueue[0]){this.txQueue[0].start()}};a.prototype.open=function(k,i){var j;if(!(this.dbname in this.openDBs)){this.openDBs[this.dbname]=true;j=f(this.dbargs,k,i);b("SQLitePlugin.open",j)}};a.prototype.close=function(k,i){var j;if(this.dbname in this.openDBs){delete this.openDBs[this.dbname];j=f({path:this.dbname},k,i);b("SQLitePlugin.close",j)}};e=function(i,k,j,l){if(typeof(k)!="function"){throw new Error("transaction expected a function")}this.db=i;this.fn=k;this.error=j;this.success=l;this.executes=[];this.executeSql("BEGIN",[],null,function(m,n){throw new Error("unable to begin transaction: "+n.message)})};e.prototype.start=function(){try{if(!this.fn){return}this.fn(this);this.fn=null;this.run()}catch(i){this.db.startNextTransaction();if(this.error){this.error(i)}}};e.prototype.executeSql=function(l,i,k,j){this.executes.push({query:[l].concat(i||[]),success:k,error:j})};e.prototype.handleStatementSuccess=function(j,i){if(!j){return}var k={rows:{item:function(l){return i.rows[l]},length:i.rows.length},rowsAffected:i.rowsAffected,insertId:i.insertId||null};j(this,k)};e.prototype.handleStatementFailure=function(j,i){if(!j){throw new Error("a statement with no error handler failed: "+i.message)}if(j(this,i)){throw new Error("a statement error callback did not return false")}};e.prototype.run=function(){var m,q,p,j,o=[];m=this.executes;q=m.length;this.executes=[];j=this;function k(i,r){return function(s){try{if(r){j.handleStatementSuccess(m[i].success,s)}else{j.handleStatementFailure(m[i].error,s)}}catch(t){if(!p){p=t}}if(--q==0){if(p){j.rollBack(p)}else{if(j.executes.length>0){j.run()}else{j.commit()}}}}}for(var l=0;l<m.length;l++){var n=m[l];o.push(f({query:n.query,path:this.db.dbname},k(l,true),k(l,false)))}b("SQLitePlugin.backgroundExecuteSqlBatch",{executes:o})};e.prototype.rollBack=function(k){if(this.finalized){return}this.finalized=true;tx=this;function j(){tx.db.startNextTransaction();if(tx.error){tx.error(k)}}function i(l,m){l.db.startNextTransaction();if(l.error){l.error(new Error("error while trying to roll back: "+m.message))}}this.executeSql("ROLLBACK",[],j,i);this.run()};e.prototype.commit=function(){if(this.finalized){return}this.finalized=true;tx=this;function j(){tx.db.startNextTransaction();if(tx.success){tx.success()}}function i(k,l){k.db.startNextTransaction();if(k.error){k.error(new Error("error while trying to commit: "+l.message))}}this.executeSql("COMMIT",[],j,i);this.run()};SQLiteFactory={opendb:function(){var j,l,k,i;if(arguments.length<1){return null}l=arguments[0];i=null;k=null;j=null;if(l.constructor===String){i={name:l};if(arguments.length>=5){k=arguments[4];if(arguments.length>5){j=arguments[5]}}}else{i=l;if(arguments.length>=2){k=arguments[1];if(arguments.length>2){j=arguments[2]}}}return new a(i,k,j)}};c.sqlitePlugin={openDatabase:SQLiteFactory.opendb,handleCallback:a.handleCallback}})();
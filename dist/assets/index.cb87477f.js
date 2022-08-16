var T=Object.defineProperty;var E=(n,t,e)=>t in n?T(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var o=(n,t,e)=>(E(n,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const h of s)if(h.type==="childList")for(const r of h.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const h={};return s.integrity&&(h.integrity=s.integrity),s.referrerpolicy&&(h.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?h.credentials="include":s.crossorigin==="anonymous"?h.credentials="omit":h.credentials="same-origin",h}function i(s){if(s.ep)return;s.ep=!0;const h=e(s);fetch(s.href,h)}})();class f{constructor(t,e){o(this,"x");o(this,"y");this.x=t,this.y=e}}let x={default:1,super:2};class A{constructor(t){o(this,"color");o(this,"position");o(this,"status");this.color=t,this.position=null,this.status=x.default}}class C{constructor(t){t.subscribers={},t.subscribe=(e,i)=>{t.subscribers[e]||(t.subscribers[e]=[]),t.subscribers[e].push(i)},t.publish=(e,i)=>{!t.subscribers[e]||!t.subscribers[e].length||t.subscribers[e].forEach(s=>s(i))}}}const g={ratio:1.14,radiusPercent:20,assets:{star:{src:"../assets/star.png",widthRatio:.58,heightRatio:1},top:{src:"../assets/tile-top.png",widthRatio:.95,heightRatio:.17}},speed:{move:10,remove:5}};class R{constructor(t){o(this,"ready");o(this,"readyCallback");o(this,"canvas");o(this,"ctx");o(this,"canvasPosition");o(this,"canvasSize");o(this,"cols");o(this,"rows");o(this,"tile");o(this,"assets");o(this,"field");let e=window.requestAnimationFrame;window.requestAnimationFrame=e,new C(this),this.ready=!1,this.readyCallback=null,this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.canvasPosition=null,this.canvasSize={width:0,height:0},this.setSizes(),this.canvas.addEventListener("click",i=>this.onClick(i)),this.cols=0,this.rows=0,this.tile={width:0,height:0,radius:0},this.assets={},this.loadAssets()}subscribe(t,e){throw new Error("Method not implemented.")}setSizes(){this.canvasSize.width=this.canvas.offsetWidth;let t=()=>{let e=this.canvas.getBoundingClientRect();this.canvasPosition=new f(e.left,e.top)};t(),document.addEventListener("resize",()=>{t()}),document.addEventListener("scroll",()=>{t()})}loadAssets(){let t=0,e=0,i=0,s=()=>{i+e==t&&(this.ready=!0,this.readyCallback&&this.readyCallback())};for(let h in g.assets){const r=g.assets[h];let l=new Image;l.src="/"+r.src,t++,l.onload=()=>{this.assets[h]={src:l,widthRatio:r.widthRatio,heightRatio:r.heightRatio},e++,s()},l.onerror=()=>{i++,s()}}}onReady(t){this.ready?t():this.readyCallback=t}setTileSize(){let t=Math.floor(this.canvasSize.width/this.cols);this.tile={width:t,height:g.ratio*t,radius:t*g.radiusPercent/100}}draw(t,e){if(!(!t||!t.length||!t[0].length)){this.field=t,this.cols!==t[0].length?(this.cols=t[0].length,this.rows=t.length,this.setTileSize(),this.canvasSize.height=this.tile.height*this.rows,this.canvas.height=`${this.canvasSize.height}`):this.rows!==t.length&&(this.rows=t.length,this.canvasSize.height=this.tile.height*this.rows,this.canvas.height=`${this.canvasSize.height}`),this.ctx.clearRect(0,0,this.canvasSize.width,this.canvasSize.height);for(let i=0;i<this.rows;i++)for(let s=0;s<this.cols;s++)this.drawTile(t[i][s],null,0);e&&e()}}drawTile(t,e,i){!t||(i=i||this.tile.width,t.status===x.super?this.drawTileSuper(t,e):this.drawTileDefault(t,e,i))}drawTileDefault(t,e,i){let s=this.ctx;i=i||this.tile.width,e=e||this.getCoordsByPoint(t.position);let h=this.tile.width-i,r=e.x1+h/2,l=e.y2-i-h/2,a=i,d=a,c=h?i*g.radiusPercent/100:this.tile.radius,p=this.getTileColors(r,l,t.color),y=()=>{let m=this.assets.top,u=a*m.widthRatio,w=m.heightRatio*u,v=r+(a-u)/2,b=l+c/4-w;s.beginPath(),s.drawImage(m.src,v,b,u,w),s.globalCompositeOperation="source-atop",s.fillStyle=p.dark,s.fillRect(v,b,u,w),s.globalCompositeOperation="source-over"},P=()=>{s.fillStyle=p.back,s.beginPath(),s.moveTo(r+c,l),s.lineTo(r+a-c,l),s.quadraticCurveTo(r+a,l,r+a,l+c),s.lineTo(r+a,l+d-c),s.quadraticCurveTo(r+a,l+d,r+a-c,l+d),s.lineTo(r+c,l+d),s.quadraticCurveTo(r,l+d,r,l+d-c),s.lineTo(r,l+c),s.quadraticCurveTo(r,l,r+c,l),s.closePath(),s.fill()},S=()=>{let m=this.assets.star,u=a*m.widthRatio,w=u*m.heightRatio,v=r+(a-u)/2,b=l+(d-w)/2;s.globalCompositeOperation="destination-out",s.drawImage(m.src,v,b,u,w),s.globalCompositeOperation="destination-over",s.fillStyle=p.star,s.fillRect(v-2,b-2,u+4,w+4),s.globalCompositeOperation="source-over"};y(),P(),S()}drawTileSuper(t,e){this.drawTileDefault(t,e,0)}getTileColors(t,e,i){let s=`hsl(${i}, 100%, 40%)`,h=`hsl(${i}, 100%, 80%)`,r=`hsl(${i}, 100%, 30%)`,l=t,a=t,d=e,c=e+this.tile.width,p=this.ctx.createLinearGradient(l,d,a,c);p.addColorStop(0,h),p.addColorStop(1,s);let y=this.ctx.createLinearGradient(l,d,a,c);return y.addColorStop(0,r),y.addColorStop(1,h),{back:p,star:y,base:s,light:h,dark:r}}clearArea(t){!t||this.ctx.clearRect(t.x1,t.y1,t.x2-t.x1,t.y2-t.y1)}getPointByCoords(t){let e=Math.floor(t.x/this.tile.width),i=Math.floor(t.y/this.tile.height);return new f(e,i)}getCoordsByPoint(t){let e=t.x*this.tile.width,i=e+this.tile.width,s=t.y*this.tile.height,h=s+this.tile.height;return{x1:e,x2:i,y1:s,y2:h}}onClick(t){let e=t.clientX-this.canvasPosition.x,i=t.clientY-this.canvasPosition.y,s=this.getPointByCoords(new f(e,i));this.publish("click",s)}publish(t,e){throw new Error("Method not implemented.")}delete(t,e,i){let s=[],h=r=>{s.push(r),s.length==e.length&&i()};e.forEach((r,l)=>this.deleteTile(t[r.y][r.x],()=>h(l)))}deleteTile(t,e){let i=this.getCoordsByPoint(t.position),s=performance.now(),h=this.tile.width,r=l=>{l-s>0&&(this.clearArea(i),h-=g.speed.remove,this.drawTile(t,null,h)),h>0?requestAnimationFrame(r):e()};requestAnimationFrame(r)}move(t,e){this.field=t;let i=[];if(t.forEach((h,r)=>{h.forEach((l,a)=>{!l||!l.from||(l.from.x!==a||l.from.y!==r)&&(l.current=this.getCoordsByPoint(l.from),l.destination=this.getCoordsByPoint(l.position),i.push(l))})}),!i.length){e();return}let s=()=>{let h=!1;i.forEach(r=>{!r.current||(this.clearArea(r.current),r.current.y1-=g.speed.move,r.current.y2-=g.speed.move,r.current.y1<=r.destination.y1?r.current=null:h=!0,this.drawTile(r,r.current,0))}),h?requestAnimationFrame(s):e()};requestAnimationFrame(s)}}class k{constructor(t){o(this,"deactivate");o(this,"cols");o(this,"rows");o(this,"colors");o(this,"minGroupCount");o(this,"map");o(this,"canvas");o(this,"inAction");o(this,"subscribers");new C(this),this.deactivate=!1,this.cols=t.width,this.rows=t.height,this.colors=t.colors,this.minGroupCount=t.min,this.map=[],this.canvas=new R(t.canvas),this.canvas.subscribe("click",e=>this.onClick(e));for(let e=0;e<this.rows;e++){this.map[e]=[];for(let i=0;i<this.cols;i++)this.map[e].push(null)}}forEachCell(t){for(let e=0;e<this.rows;e++)for(let i=0;i<this.cols;i++)t(new f(i,e))}start(){this.canvas.onReady(()=>this.fill())}fill(){this.forEachCell(t=>{if(!this.map[t.y][t.x]){let i=this.getTile(null);i.position=t,this.map[t.y][t.x]=i}}),this.canvas.draw(this.map,()=>this.inAction=!1)}getColor(){let t=Math.floor(Math.random()*this.colors.length);return this.colors[t]}getTile(t){return new A(t||this.getColor())}onClick(t){if(this.deactivate)return;this.inAction=!0;const e=this.getNeighbors(t);e.length<this.minGroupCount||this.canvas.delete(this.map,e,()=>{this.publish("remove",e.length),e.forEach(i=>{this.map[i.y][i.x]=null}),this.canvas.draw(this.map),this.move()})}getNeighbors(t){let e=this.map[t.y][t.x];if(!e)return!1;let i=e.color,s=[],h=r=>{if(r.x<0||r.y<0||r.x>this.cols-1||r.y>this.rows-1)return;let l=this.map[r.y][r.x];!l||l.checked||l.color!==i||(s.push(r),l.checked=!0,h(new f(r.x-1,r.y)),h(new f(r.x+1,r.y)),h(new f(r.x,r.y-1)),h(new f(r.x,r.y+1)))};return h(t),s}move(){let t=[];this.forEachCell(e=>{t[e.x]||(t[e.x]=[]),t[e.x][e.y]=this.map[e.y][e.x]}),t=t.map((e,i)=>{e=e.filter(s=>s?(s.from=s.position,s):!1);for(let s=0;s<this.rows;s++){if(!e[s]){e[s]=null;continue}e[s].position=new f(i,s)}return e}),t.forEach((e,i)=>{e.forEach((s,h)=>{this.map[h][i]=s})}),this.canvas.move(this.map,()=>this.fill())}subscribe(t,e){this.subscribers[t]||(this.subscribers[t]=[]),this.subscribers[t].push(e)}publish(t,e){this.subscribers[t].forEach(s=>s(e))}stop(){this.deactivate=!0}}const q={width:10,height:10,colors:[0,90,180,270],min:2};class ${constructor(t,e,i){t._bindings={},Array.prototype.slice.call(document.querySelectorAll(`[${e}]`)).forEach(h=>{let r=h.getAttribute(e);!r||(t._bindings[r]||(t._bindings[r]=[]),t._bindings[r].push(h))}),i.forEach(h=>{Object.defineProperty(t,h,{set:l=>{t[`_${h}`]=l,t._bindings[h]&&t._bindings[h].forEach(a=>a.innerHTML=l)},get:()=>t[`_${h}`]})})}bindProp(t,e,i,s){let h=Array.prototype.slice.call(document.querySelectorAll(`[${e}]`));Object.defineProperty(t,i,{set:l=>{t[`_${String(i)}`]=l,h.forEach(a=>s(a,l))},get:()=>t[`_${String(i)}`]})}}class L{constructor(t){o(this,"level");o(this,"steps");o(this,"points");o(this,"progress");o(this,"default");o(this,"stopped");o(this,"roundPoints");o(this,"field");this.default=q,this.stopped=!1,new $(this,"data-bind",["roundPoints","points","steps","level"]).bindProp(this,"data-progress","progress",(i,s)=>i.style.width=`${s}%`),this.level=1,this.steps=15,this.points=0,this.roundPoints=1e3,this.progress=this.points/this.roundPoints*100,this.field=new k({width:t.width||this.default.width,height:t.heigth||this.default.height,colors:t.colors||this.default.colors,min:t.min||this.default.min,canvas:t.canvas}),this.field.subscribe("remove",i=>this.onRemove(i)),this.field.start()}onRemove(t){this.steps--,this.points+=this.countPoints(t),this.progress=this.points>=this.roundPoints?100:this.points/this.roundPoints*100,this.points>=this.roundPoints&&this.finish(),this.steps<=0&&this.finish()}countPoints(t){let e=t*10;return t>=5&&t%2&&(e+=(Math.floor(t/2)-1)*10),e}finish(){this.stopped=!0,this.field.stop();let t=this.points>=this.roundPoints?"success":"fail";alert("finish - "+t)}}let M=document.getElementById("game-field");new L({canvas:M});
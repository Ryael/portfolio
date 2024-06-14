/**
 * @name    Shuffle Letters
 * @author    Martin Angelov
 * @version   1.0
 * @url     http://tutorialzine.com/2011/09/shuffle-letters-effect-jquery/
 * @license   MIT License
 */

(function(e){function t(e){var t="";if(e=="lowerLetter"){t="abcdefghijklmnopqrstuvwxyz0123456789"}else if(e=="upperLetter"){t="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"}else if(e=="symbol"){t=",.?/\\(^)![]{}*&^%$#'\""}var n=t.split("");return n[Math.floor(Math.random()*n.length)]}e.fn.shuffleLetters=function(n){var r=e.extend({step:12,fps:25,text:"",callback:function(){}},n);return this.each(function(){var n=e(this),i="";if(n.data("animated")){return true}n.data("animated",true);if(r.text){i=r.text.split("")}else{i=n.text().split("")}var s=[],o=[];for(var u=0;u<i.length;u++){var a=i[u];if(a==" "){s[u]="space";continue}else if(/[a-z]/.test(a)){s[u]="lowerLetter"}else if(/[A-Z]/.test(a)){s[u]="upperLetter"}else{s[u]="symbol"}o.push(u)}n.html("");(function f(e){var u,a=o.length,l=i.slice(0);if(e>a){n.data("animated",false);r.callback(n);return}for(u=Math.max(e,0);u<a;u++){if(u<e+r.step){l[o[u]]=t(s[o[u]])}else{l[o[u]]=""}}n.text(l.join(""));setTimeout(function(){f(e+1)},1e3/r.fps)})(-r.step)})}})(jQuery);

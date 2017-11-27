var btn = document.createElement("button");
var txt = document.createTextNode("Hello");
btn.appendChild(txt);
document.body.appendChild(btn);
btn.addEventListener ("click", function() {
  alert("Hello");
});

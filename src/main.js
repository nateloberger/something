function scriptMagic() {
  var scriptEl = document.createElement('p');
  scriptEl.innerText = "It's happening!";
  return scriptEl;
}


document.body.appendChild(scriptMagic());

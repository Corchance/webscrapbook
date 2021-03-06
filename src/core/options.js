/********************************************************************
 *
 * Script for options.html
 *
 * @require {Object} scrapbook
 *******************************************************************/

const OPTION_PREFIX = "opt_";

function initDefaultOptions() {
  scrapbook.loadOptions().then((options) => {
    for (let id in options) {
      setOptionToDocument(id, options[id]);
    }
  });
}

function getOptionFromDocument(id) {
  const elem = document.getElementById(OPTION_PREFIX + id);
  if (!elem) { return; }
  switch (elem.getAttribute("type")) {
    case "checkbox":
      return elem.checked;
    default:
      return elem.value;
  }
}

function setOptionToDocument(id, value) {
  const elem = document.getElementById(OPTION_PREFIX + id);
  if (!elem) { return; }
  switch (elem.getAttribute("type")) {
    case "checkbox":
      elem.checked = value;
      break;
    default:
      elem.value = value;
      break;
  }
}

function exportOptions() {
  const data = new Blob([JSON.stringify(scrapbook.options, null, 2)], {type: "application/json"});
  const elem = document.createElement("a");
  elem.href = URL.createObjectURL(data);
  elem.download = "webscrapbook.options." + scrapbook.dateToId().slice(0, 8) + ".json";
  document.body.appendChild(elem);
  elem.click();
  elem.remove();
}

function importOptions() {
  document.getElementById("import-input").click();
}

function importFile(file) {
  document.getElementById("import-input").value = null;

  scrapbook.readFileAsText(file).then((text) => {
    const data = JSON.parse(text);
    const options = Object.assign(scrapbook.options, data);
    scrapbook.options = options;
    return scrapbook.saveOptions();
  }).then((options) => {
    for (let id in options) {
      setOptionToDocument(id, options[id]);
    }
  }).then(() => {
    showMessage(scrapbook.lang("OptionsImportSuccess"));
  }).catch((ex) => {
    showMessage(scrapbook.lang("ErrorImportOptions", [ex]));
  });
}

function showMessage(msg) {
  document.getElementById("message").textContent = msg;
  window.scrollTo(0, 0);
}

function closeWindow() {
  chrome.tabs.getCurrent((tab) => {
    if (!tab) {
      // options.html is a prompt diaglog
      window.close();
    } else if (tab.url.startsWith(chrome.runtime.getURL(""))) {
      // options.html is in a tab (or Firefox Android)
      // close the tab
      chrome.tabs.remove(tab.id, () => {});
    } else {
      // options.html is embedded in about:addon in Firefox
      // do not close the tab
    }
  });
}

window.addEventListener("DOMContentLoaded", (event) => {
  // load languages
  scrapbook.loadLanguages(document);

  // event handlers
  document.getElementById("options").addEventListener("submit", (event) => {
    event.preventDefault();
    for (let id in scrapbook.options) {
      scrapbook.options[id] = getOptionFromDocument(id);
    }
    scrapbook.saveOptions().then(() => {
      closeWindow();
    });
  });

  document.getElementById("export").addEventListener("click", (event) => {
    event.preventDefault();
    exportOptions();
  });

  document.getElementById("import").addEventListener("click", (event) => {
    event.preventDefault();
    importOptions();
  });

  document.getElementById("import-input").addEventListener("change", (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    importFile(file);
  });

  // default options
  initDefaultOptions();
});

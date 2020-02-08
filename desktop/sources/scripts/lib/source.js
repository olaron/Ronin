'use strict'

/* global FileReader */
/* global MouseEvent */

function Source (client) {
  this.cache = {}

  this.path = null

  this.install = () => {
  }

  this.start = () => {
    this.new()
  }

  this.new = () => {
    console.log('Source', 'New file..')
    this.cache = {}
  }

  this.open = (ext, callback) => {
    console.log('Source', 'Open file..')
    const input = document.createElement('input')
    input.type = 'file'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file.name.indexOf('.' + ext) < 0) { console.warn('Source', `Skipped ${file.name}`); return }
      this.read(file, callback)
    }
    input.click()
  }

  this.load = (ext, callback) => {
    console.log('Source', 'Load files..')
    const input = document.createElement('input')
    input.type = 'file'
    input.setAttribute('multiple', 'multiple')
    input.onchange = (e) => {
      for (const file of e.target.files) {
        if (file.name.indexOf('.' + ext) < 0) { console.warn('Source', `Skipped ${file.name}`); return }
        this.read(file, this.store)
      }
    }
    input.click()
  }

  this.store = (file, content) => {
    console.info('Source', 'Stored ' + file.name)
    this.cache[file.name] = content
  }

  this.save = (name, content, type = 'text/plain', callback) => {
    this.saveAs(name, content, type, callback)
  }

  this.saveAs = (name, ext, content, type = 'text/plain', callback) => {
    console.log('Source', 'Save new file..')
    this.write(name, ext, content, type, callback)
  }

  // I/O

  this.read = (file, callback) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const res = event.target.result
      if (callback) { callback(file, res) }
    }
    reader.readAsText(file, 'UTF-8')
  }

  this.write = (name, content) => {
    if (!this.path)
    {
      const dialog = require('electron').remote.dialog;
      this.path = dialog.showSaveDialogSync({
        defaultPath: name,
        properties : ['openFile'],
      });
    }

    const fs = require('fs');
    try { fs.writeFileSync(this.path, content); }
    catch(e) 
    { 
      alert('Failed to save the file !');
      this.path = null; 
    }
  }
}

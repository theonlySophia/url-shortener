import Url from '../Models/url.js';

export function validateUrl(value){
    const isValidUrl = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
    const isxyzDomain = /\.xyz(\/|$)/i.test(value); // Check if the URL contains .xyz domain

    if (isxyzDomain) return false; // Reject URLs containing .xyz domain
    if (!isValidUrl) return false; // Reject invalid URLs
    return isValidUrl && !isxyzDomain; // Return true only if it's a valid URL and does not contain .xyz domain
}

// In memory cache and buffer save function
export const urlCache = {};
export let saveBuffer = [];
export let saveTimer = null;

export function bufferedSave(data) {
  saveBuffer.push(data);
  console.log(`Buffered save: ${saveBuffer.length} item(s) in buffer`); // Debugging log
  if (!saveTimer) {
    saveTimer = setTimeout(async () => {
        console.log(`Saving ${saveBuffer.length} item(s) to database...`); // Debugging log
      for (const item of saveBuffer) {
        const url = new Url(item);
        await item.save();
      }
      console.log('Buffered save completed'); // Debugging log  
      saveBuffer = [];
      saveTimer = null;
    }, 2000);
  }
}
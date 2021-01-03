import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';

// timeout error handler
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // convert to JSON
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // 1. fetch recipes within the timeout seconds
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    // 2. convert recipes to json
    const data = await res.json();

    // 3. check response returned ok
    if (!res.ok) throw new Error(`${data.status}`);

    // 4. return recipes
    return data;
  } catch (err) {
    // this will send back a rejected promise
    throw err;
  }
};

/*
// GET
export const getJSON = async function (url) {
  try {
    // 1. fetch recipes within the timeout seconds
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);

    // 2. convert recipes to json
    const data = await res.json();

    // 3. check response returned ok
    if (!res.ok) throw new Error(`${data.status}`);

    // 4. return recipes
    return data;
  } catch (err) {
    // this will send back a rejected promise
    throw err;
  }
};

// POST
export const sendJSON = async function (url, uploadData) {
  try {
    // 1. fetch recipes within the timeout seconds
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // convert to JSON
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);

    // 2. convert recipes to json
    const data = await res.json();

    // 3. check response returned ok
    if (!res.ok) throw new Error(`${data.status}`);

    // 4. return recipes
    return data;
  } catch (err) {
    // this will send back a rejected promise
    throw err;
  }
};
*/

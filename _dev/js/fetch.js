
export default function FetchContent(res) {

  return new Promise(function (resolve) {

    const cssPromise = new Promise((resolve) => {
      import(/*webpackMode:"lazy"*/ /* webpackChunkName: "[request]" */ `@css/${res}`).then(() => {
        console.log("Loaded CSS", res);
        resolve(true)
      }, (err) => {
        console.log("Error", err)
        resolve(true)

      })

    })
    const jsPromise = new Promise((resolve) => {
      import(/*webpackMode:"lazy"*/ /* webpackChunkName: "[request]" */ `@js/controllers/${res}`).then(() => {
        console.log("Loaded JS", res);
        resolve(true)
      }, (err) => {
        console.log("Error", err)
        resolve(true)

      })

    })
    Promise.all([cssPromise, jsPromise]).then(() => {
      resolve(true);
    })

  })

}

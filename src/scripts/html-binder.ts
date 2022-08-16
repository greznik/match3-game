export class HTMLBinder {
  constructor(
    obj: { [x: string]: any; _bindings: { [x: string]: any[] } },
    target: any,
    props: any[],
  ) {
    obj._bindings = {}

    let els = Array.prototype.slice.call(
      document.querySelectorAll(`[${target}]`),
    )
    els.forEach((el) => {
      let bind = el.getAttribute(target)
      console.log(1, bind)
      if (!bind) return
      if (!obj._bindings[bind]) obj._bindings[bind] = []
      obj._bindings[bind].push(el)
    })

    props.forEach((prop) => {
      let descriptor = {
        set: (newValue: any) => {
          obj[`_${prop}`] = newValue
          if (obj._bindings[prop]) {
            obj._bindings[prop].forEach((el) => (el.innerHTML = newValue))
          }
        },
        get: () => obj[`_${prop}`],
      }
      Object.defineProperty(obj, prop, descriptor)
    })
  }

  bindProp(
    obj: { [x: string]: any },
    target: any,
    prop: PropertyKey,
    handler: (arg0: any, arg1: any) => void,
  ) {
    let els = Array.prototype.slice.call(
      document.querySelectorAll(`[${target}]`),
    )

    let descriptor = {
      set: (newValue: any) => {
        obj[`_${String(prop)}`] = newValue
        els.forEach((el) => handler(el, newValue))
      },
      get: () => obj[`_${String(prop)}`],
    }

    Object.defineProperty(obj, prop, descriptor)
  }
}

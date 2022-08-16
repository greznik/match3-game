export class Subscriber {
  constructor(obj: any) {
    obj.subscribers = {}

    obj.subscribe = (event: string | number, callback: any) => {
      if (!obj.subscribers[event]) obj.subscribers[event] = []

      obj.subscribers[event].push(callback)
    }

    obj.publish = (event: string | number, data: any) => {
      if (!obj.subscribers[event] || !obj.subscribers[event].length) return

      obj.subscribers[event].forEach((callback: (arg0: any) => any) =>
        callback(data),
      )
    }
  }
}

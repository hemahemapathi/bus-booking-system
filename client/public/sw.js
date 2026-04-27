const timers = {}

self.addEventListener('message', (event) => {
  const { type, id, fireAt, title, body } = event.data

  if (type === 'SCHEDULE') {
    // Clear existing timer for this booking if any
    if (timers[id]) clearTimeout(timers[id])

    const delay = fireAt - Date.now()
    if (delay <= 0) return

    timers[id] = setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: id,
        renotify: true,
      })
      delete timers[id]
    }, delay)
  }

  if (type === 'CANCEL') {
    if (timers[id]) {
      clearTimeout(timers[id])
      delete timers[id]
    }
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      if (list.length > 0) return list[0].focus()
      return clients.openWindow('/')
    })
  )
})

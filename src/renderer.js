const m = require("mithril")
const UI = require("./app/ui")
const Bus = require("./bus")
const Autodect = require("./autodetect")
const Session = require("./session")
const Macros = require("./macros")
const CustomCSS = require("./storage/custom-css")
const Theme = require("./storage/theme")
const Settings = require("./settings")

window.messages = window.messages || []

CustomCSS.injectCSS().then(() =>
  document.body.classList.remove("loading")
)

Bus.on(Bus.events.CHANGE_THEME, (data) => {
  Theme.changeTheme(data)
})

m.mount(document.getElementById("sessions"), UI.Sessions)
m.mount(document.getElementById("hands-wrapper"), UI.Hands)
m.mount(document.getElementById("cli-wrapper"), UI.CLI)
m.mount(document.getElementById("hud"), UI.HUD)
m.mount(
  document.getElementById("flash-container"),
  UI.FlashMessage
)

Bus.on(Bus.events.FLASH, (message) => {
  message.ttl = message.ttl || Date.now() + 5000 // seconds
  window.messages.push(message)
  m.redraw()
})

Bus.on(Bus.events.ERR, (err) => {
  Bus.emit(Bus.events.FLASH, {
    message: err.message,
    kind: "error",
  })
})

Bus.on(Bus.events.REDRAW, () => {
  const sess = Session.focused()
  if (sess) sess.streams.redraw()
  m.redraw()
})

Bus.on(Bus.events.FOCUS, (session) => {
  //if (session.has_focus()) return session.idle()
  document.querySelector("title").innerText = session.name
  session.attach(document.getElementById("feed-wrapper"))
  m.redraw()

  // Set theme from settings
  // TODO: flashes original theme
  const theme = Settings.get("theme")
  Theme.changeTheme({ theme: theme })
})

Bus.on("macro", (macro) => {
  const cli = document.getElementById("cli")
  cli && UI.CLI.exec_macro(cli, macro)
})

window.addEventListener("resize", function () {
  const session = Session.focused()
  if (!session) return
  session.feed.reattach_head()
})

document.addEventListener(
  "keypress",
  UI.CLI.global_handlekeypress
)
document.addEventListener(
  "autocomplete/right",
  UI.CLI.autocomplete_right
)

Autodect.connect_all().catch((err) =>
  Bus.emit(Bus.events.ERR, err)
)

Macros.set_context()

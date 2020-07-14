const commands = new Map()
commands.set("compiler", require("./commands/compiler.js"))
commands.set("config", require("./commands/config.js"))
commands.set("connect", require("./commands/connect.js"))
commands.set("explain", require("./commands/explain.js"))
commands.set("focus", require("./commands/focus.js"))
commands.set("hilite", require("./commands/hilite.js"))
commands.set("launch", require("./commands/launch.js"))
commands.set("macros", require("./commands/macros.js"))
commands.set("quit", require("./commands/quit.js"))
commands.set(
  "reload-skin",
  require("./commands/reload-skin.js")
)
commands.set("rename", require("./commands/rename.js"))
commands.set("set", require("./commands/set.js"))
commands.set("stream", require("./commands/stream.js"))
commands.set("sudo", require("./commands/sudo.js"))
commands.set("swap", require("./commands/swap.js"))
commands.set("theme", require("./commands/theme.js"))
commands.set("ui", require("./commands/ui.js"))

exports.commands = commands

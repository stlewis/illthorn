const LimitedList = require("../util/limited-list")
const Storage = require("../storage")

module.exports = class CommandHistory {
  static of() {
    return new CommandHistory()
  }
  /**
   * [recent] ----> [oldest]
   */
  constructor() {
    this.index = 0

    setTimeout(() => {
      const name = document
        .querySelector("#feed-wrapper")
        .getAttribute("data-name")

      const commandsFromStorage = Storage.get(
        `commands-${name}`
      )

      this.buffer = LimitedList.of(commandsFromStorage, {
        limit: 100,
      })
    }, 500)
  }

  add(command) {
    if (this.head().length == 0) {
      return (this.buffer.members[0] = command)
    }
    this.buffer.lpush(command)

    // Save command list to Storage
    const name = document
      .querySelector("#feed-wrapper")
      .getAttribute("data-name")

    Storage.set(`commands-${name}`, this.buffer.members)
  }

  get last_index() {
    return Math.max(this.buffer.length - 1, 0)
  }

  forward() {
    --this.index
    if (this.index < 0) this.index = this.last_index
    //console.log("history:forward", this.index, this.read(), this.buffer.toJSON())
  }

  back() {
    ++this.index
    if (this.index > this.last_index) this.index = 0
    //console.log("history:back", this.index, this.read(), this.buffer.toJSON())
  }

  read(index = this.index) {
    return this.buffer.members[index] || ""
  }

  update(value) {
    this.buffer[this.index] = value
  }

  match(input) {
    return this.buffer.filter(
      (cmd) =>
        cmd.startsWith(input) && cmd.length > input.length
    )
  }

  write(input, { forward, back }) {
    input.value = this.read()
    if (forward) this.forward()
    if (back) this.back()
    input.focus()
  }

  head() {
    return this.read(0)
  }

  seek(idx) {
    // console.log("command:seek", idx)
    this.index = idx
    if (this.index < 0) this.index = this.last_index
    if (this.index > this.last_index) this.index = 0
    return this
  }
}

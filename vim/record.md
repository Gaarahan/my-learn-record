# After read <Learn Vimscript in hard way>

## Setting Options

- use `set xxx=value` to set option value
- use `set xxx!` to toggle boolean value
- use `set xxx?` to show current value

## Basic Mapping

- `map [KeyString A] [KeyString B]` : map KeyString A to B
- use `<KeyName>` to express the special key in KeyString
- use `*unmap [KeyString]` to remove map

## Modewl Mapping

- `map` means map keys in **Normal mode** and **Visual mode**
- use `vmap nmap imap` to set mapping in special mode

## Strict Mapping

- when you use `map`to set mapping, vim will **consider about existed mapping**, this may cause recursive mapping
- use `*noremap` to set mapping only depends on the basic mapping
- when change key map, we should alaways use `*noremap`. Because of :
  - the use of `*map` will destory the other custom mapping which depending on the basic mapping.
  - `*map` will set mapping base on mapped key. In this case, it's hardly to make sure the result will same with what we need.

## Leaders

- vim use `leader` as a `prefix key`
- `let mapledaer = "[key]"`: change default leader

- `local leader` can only take effect for certain types of files
- `let maplocalleader = "[key]"`: change default local leader

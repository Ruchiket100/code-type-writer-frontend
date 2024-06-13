import React from "react"

const specialCharacters = {
  gray: [".", ",", ";", ":", "?", "!", "'"],
  black: [
    "+",
    "-",
    "*",
    "/",
    "%",
    "=",
    "<",
    ">",
    "&&",
    "||",
    "!",
    "===",
    "!==",
  ],
  yellow: ["(", ")", "{", "}", "[", "]"],
  transparent: [" ", "\t", "\n"],
  purple: [
    "import",
    "export",
    "class",
    "function",
    "interface",
    "const",
    "let",
    "var",
  ], // Special keywords
  orange: ["@", "#", "$", "&", "^", "|", "~"],
}

const hightlightSyntax = (word: string) => {
  let color = ""

  Object.entries(specialCharacters).forEach(([key, value]) => {
    if (value.includes(word)) {
      color = key
    }
  })

  return <span className={`bg-${color}-700`}>{word}</span>
}

export default hightlightSyntax

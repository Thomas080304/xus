import test = require("tape")
import lexer = require("../lexer")
import { fromString } from "../transform"

test("tokenize html", t => {
    const html =
`<table cols=3>
  <tbody>blah blah blah</tbody>
  <tr><td>there</td></tr>
  <tr><td>it</td></tr>
  <tr><td bgcolor="blue">is</td></tr>
</table>`

    const expected = [
        [ 1, "table", { cols: "3" } ],
        [ 3, "\n  " ],
        [ 1, "tbody", {} ],
        [ 3, "blah blah blah" ],
        [ 2, "tbody" ],
        [ 3, "\n  " ],
        [ 1, "tr", {} ],
        [ 1, "td", {} ],
        [ 3, "there" ],
        [ 2, "td" ],
        [ 2, "tr" ],
        [ 3, "\n  " ],
        [ 1, "tr", {} ],
        [ 1, "td", {} ],
        [ 3, "it" ],
        [ 2, "td" ],
        [ 2, "tr" ],
        [ 3, "\n  " ],
        [ 1, "tr", {} ],
        [ 1, "td", { bgcolor: "blue" } ],
        [ 3, "is" ],
        [ 2, "td" ],
        [ 2, "tr" ],
        [ 3, "\n" ],
        [ 2, "table" ]
    ]

    t.plan(expected.length)

    fromString(html)
        .pipe(lexer.tokenizeStache())
        .on("data", data => {
            const x = expected.shift()
            t.deepEqual(data, x)
        })
})

test("tokenize stache", t => {
    const html =
`<table cols=3>
  {#fruits}
    <tr>
      <td bgcolor="blue">{name}</td>
      {#proteins}<td>{name}</td>{/proteins}
    </tr>
  {/fruits}
</table>`

    const expected = [
        [ 1, "table", { cols: "3" } ],
        [ 3, "\n  " ],
        [ 5, "fruits" ],
        [ 3, "\n    " ],
        [ 1, "tr", {} ],
        [ 3, "\n      " ],
        [ 1, "td", { bgcolor: "blue" } ],
        [ 4, "name" ],
        [ 2, "td" ],
        [ 3, "\n      " ],
        [ 5, "proteins" ],
        [ 1, "td", {} ],
        [ 4, "name" ],
        [ 2, "td" ],
        [ 6, "proteins" ],
        [ 3, "\n    " ],
        [ 2, "tr" ],
        [ 3, "\n  " ],
        [ 6, "fruits" ],
        [ 3, "\n" ],
        [ 2, "table" ]
    ]

    t.plan(expected.length)

    fromString(html)
        .pipe(lexer.tokenizeStache())
        .on("data", data => {
            const x = expected.shift()
            t.deepEqual(data, x)
        })
})

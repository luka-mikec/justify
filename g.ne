# nearley grammar for formulas

line -> "|":* "L":? _ expr             {% ([indent, isnew, _, form]) => ({ indent: indent.length + (isnew ? 1 : 0), isnew, form }) %}
expr -> "(" _ expr _ ")"               {% ([_, _1, e, _2, _3]) => e %}
      | quantifier _ [a-z] _ expr      {% ([op, _ , v, _2, e]) => ({op: op[0], e, v: v[0]}) %}
      | unary_operator _ expr          {% ([op, _ , e]) => ({op: op[0], e}) %}
      | expr _ binary_operator _ expr  {% ([e1, _1 , op, _2, e2]) => ({op: op[0], e1, e2}) %}
      | "#"                            {% _ => ({op: '#'}) %}
      | [B-DF-Z] [a-z]:+               {% ([rel, vars]) => ({rel: rel[0], vs: vars.map(v => v[0]) })  %}
      | [A-Z]                          {% rel => ({rel: rel[0], vs: [] })  %}
binary_operator -> "/\\" | "\\/" | "->" | "<->"
unary_operator -> "¬"
quantifier -> "A" | "E"
_ -> [ \n\t\r]:*

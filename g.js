// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "line$ebnf$1", "symbols": []},
    {"name": "line$ebnf$1", "symbols": ["line$ebnf$1", {"literal":"|"}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "line$ebnf$2", "symbols": [{"literal":"L"}], "postprocess": id},
    {"name": "line$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "line", "symbols": ["line$ebnf$1", "line$ebnf$2", "_", "expr"], "postprocess": ([indent, isnew, _, form]) => ({ indent: indent.length + (isnew ? 1 : 0), isnew, form })},
    {"name": "expr", "symbols": [{"literal":"("}, "_", "expr", "_", {"literal":")"}], "postprocess": ([_, _1, e, _2, _3]) => e},
    {"name": "expr", "symbols": ["quantifier", "_", /[a-z]/, "_", "expr"], "postprocess": ([op, _ , v, _2, e]) => ({op: op[0], e, v: v[0]})},
    {"name": "expr", "symbols": ["unary_operator", "_", "expr"], "postprocess": ([op, _ , e]) => ({op: op[0], e})},
    {"name": "expr", "symbols": ["expr", "_", "binary_operator", "_", "expr"], "postprocess": ([e1, _1 , op, _2, e2]) => ({op: op[0], e1, e2})},
    {"name": "expr", "symbols": [{"literal":"#"}], "postprocess": _ => ({op: '#'})},
    {"name": "expr$ebnf$1", "symbols": [/[a-z]/]},
    {"name": "expr$ebnf$1", "symbols": ["expr$ebnf$1", /[a-z]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "expr", "symbols": [/[B-DF-Z]/, "expr$ebnf$1"], "postprocess": ([rel, vars]) => ({rel: rel[0], vs: vars.map(v => v[0]) })},
    {"name": "expr", "symbols": [/[A-Z]/], "postprocess": rel => ({rel: rel[0], vs: [] })},
    {"name": "binary_operator$string$1", "symbols": [{"literal":"/"}, {"literal":"\\"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "binary_operator", "symbols": ["binary_operator$string$1"]},
    {"name": "binary_operator$string$2", "symbols": [{"literal":"\\"}, {"literal":"/"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "binary_operator", "symbols": ["binary_operator$string$2"]},
    {"name": "binary_operator$string$3", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "binary_operator", "symbols": ["binary_operator$string$3"]},
    {"name": "binary_operator$string$4", "symbols": [{"literal":"<"}, {"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "binary_operator", "symbols": ["binary_operator$string$4"]},
    {"name": "unary_operator", "symbols": [{"literal":"¬"}]},
    {"name": "quantifier", "symbols": [{"literal":"A"}]},
    {"name": "quantifier", "symbols": [{"literal":"E"}]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \n\t\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]}
]
  , ParserStart: "line"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();

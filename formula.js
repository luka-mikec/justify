/*
    This file contains generic functions related to formula processing (parsing, substitution, printing etc.)
    There are also unrelated bits, such as translations, which have to do with global state.
    Languages are global dicts, current language is saved in the "clang", and refresh_dict should be called to apply changes.
 */

var land = '/\\', lor = '\\/', lcond = '->', liff = '<->', lnot = '~', lfals = '#', lreit='re',
    lintro = 'i', lelim = 'e', lall = 'A', lexists = 'E', lasm = 'assump.', ltrue = 'T';

var operator_info = {
    [lfals]: {
        synonyms: ["#", "_|_"],
        latex: "\\bot",
        html: "⊥",
    },
    [ltrue]: {
        synonyms: ["T"],
        latex: "\\top",
        html: "⊤",
    },
    [land]: {
        synonyms: ["/\\", "&" , "&&" , "*" , "."],
        latex: "\\wedge",
        html: "∧",
    },
    [lor]: {
        synonyms: ["\\/",  "|" , "||" , "+" , ","],
        latex: "\\vee",
        html: "∨",
    },
    [lcond]: {
        synonyms: ["->", "=>", ">"],
        latex: "\\to",
        html: "→",
    },
    [liff]: {
        synonyms: ["<->", "<=>" , "=" , "<>"],
        latex: "\\leftrightarrow",
        html: "↔",
    },
    [lnot]: {
        synonyms: ["¬" , "~" , "-"],
        latex: "\\neg",
        html: "¬",
    },
    [lall]: {
        synonyms: ["A", "@"],
        latex: "\\forall",
        html: "∀",
    },
    [lexists]: {
        synonyms: ["E"],
        latex: "\\exists",
        html: "∃",
    },
};

function synonym_base(symb) {
    for (const [k, info] of Object.entries(operator_info))
        if (info.synonyms.includes(symb) )
            return k ;
    throw "uknown symbol " + symb;
}

var latex = Object.fromEntries(
    Object.entries(operator_info).map(
        ([key, info]) => [key, info.latex]
    )
);

latex[lasm] =  '\\text{assump.}';
latex[lreit] = '\\text{re.}';

var html = Object.fromEntries(
    Object.entries(operator_info).map(
        ([key, info]) => [key, info.html]
    )
);

html[lreit] = 're.';
html[lasm] = 'assump.';

function subst_inst_of(inst, schema, transl, abusive /* if t/x and have subformula QxP(t), reject */)
{
    if (inst.op !== schema.op)
        return false;

    if (inst.rel)
    {
        if (inst.rel != schema.rel || inst.vs.length != schema.vs.length)
            return false;
        for (let [i, obj] of inst.vs.entries())
        {
            if (transl.ignore_transl)
            {
                if (obj != schema.vs[i])
                    return false;
            }
            else
            {
                if (schema.vs[i] == transl.v)
                {
                    if (transl.c == null)
                    {
                        transl.c = obj;
                    }
                    else if (transl.c != obj && (transl.total  ||  obj != schema.vs[i]))
                    {
                        return false;
                    }
                }
                else if (schema.vs[i] != obj)
                    return false;
            }
        }
        return true;
    }

    switch (inst.op) {
        case lfals: case ltrue:
            return true;
        case lnot:
            return subst_inst_of(inst.e, schema.e, transl, abusive);
        case land: case lor: case lcond: case liff:
            return subst_inst_of(inst.e1, schema.e1, transl, abusive) && subst_inst_of(inst.e2, schema.e2, transl, abusive);
        case lall: case lexists:
            if (inst.v !== schema.v)
                return false;

            if (transl.ignore_transl || inst.v === transl.v) {
                let old_ignore_transl = transl.ignore_transl;
                transl.ignore_transl = true;
                let istrue = subst_inst_of(inst.e, schema.e, transl, abusive);

                if (abusive && has_constant(schema.e, transl.c))
                    return false;

                transl.ignore_transl = old_ignore_transl;
                return istrue;
            }

            return subst_inst_of(inst.e, schema.e, transl, abusive);
    }
}

function formulas_eql(f, g)
{
    return subst_inst_of(f, g, { ignore_transl: true }, false);
}

function deep_copy(frm, to) {
    if (!to)
        return JSON.parse(JSON.stringify(frm));
    else
        Object.assign(to, JSON.parse(JSON.stringify(frm)));
}

function has_constant(form, c, not_consts)
{
    if (!not_consts)
        not_consts = [];

    if (form.rel)
    {
        return form.vs.includes(c);
    }

    switch (form.op) {
        case lfals: case ltrue:
            return false;
        case lall: lexists:
            not_consts = not_consts.slice();
            not_consts.push(form.v);
            return has_constant(form.e, c, not_consts);
        case lnot:
            return has_constant(form.e, c, not_consts);
        case land: case lor: case lcond: case liff:
            return has_constant(form.e1, c, not_consts) || has_constant(form.e2, c, not_consts);
    }
}

function subst(form, v, c)
{
    if (form.rel)
    {
        form.vs = form.vs.map(x => x == v ? c : x);
    }

    switch (form.op) {
        case lfals: case ltrue:
            return;
        case lall: case lexists: case lnot:
            subst(form.e, v, c);
            return;
        case land: case lor: case lcond: case liff:
            subst(form.e1, v, c);
            subst(form.e2, v, c);
            return;
    }
}

function formula_terms(form, bound)
{
    if (!bound)
        bound = [];

    if (form.rel)
    {
        return form.vs.filter(x => ! bound.includes(x));
    }

    switch (form.op) {
        case lfals: case ltrue:
            return [];
        case lall: case lexists:
            return formula_terms(form.e, bound.concat(form.v));
        case lnot:
            return formula_terms(form.e, bound);
        case land: case lor: case lcond: case liff:
            return formula_terms(form.e1, bound).concat(formula_terms(form.e2, bound));
    }
}

var hr = {
    'asm': 'pretp.',
    'e': 'i',
    'i': 'u',
    'reit': 'op.',
}, en = {
    'asm': 'assump.',
    'e': 'e',
    'i': 'i',
    'reit': 're.',
};

var clang = en;

function refresh_lang() {
    //lintro = window.clang['intro'];
    //lelim = window.clang['elim'];
    //lasm = window.clang['asm'];

    latex[lreit] = '\\text{' + window.clang['reit'] + '}';
    html[lreit] = window.clang['reit'];

    latex[lasm] = '\\text{' + window.clang['asm'] + '}';
    html[lasm] = window.clang['asm'];
}

function html_str_formula(form, depth) {
    let str_formula = html_str_formula;
    if (!depth) depth = 0;
    if (form.rel) {
        return form.rel + form.vs.join("");
    }
    if (form.v)
        return html[form.op] + form.v + " " + str_formula(form.e, depth + 1);
    if (form.e)
        return html[form.op] + str_formula(form.e, depth + 1);
    if (form.e1)
        return (depth > 0 ? '(' : '') + str_formula(form.e1, depth + 1) + ' ' + html[form.op] + ' ' + str_formula(form.e2, depth + 1) + (depth > 0 ? ')' : '');
    if (form.op === lfals || form.op === ltrue)
        return html[form.op];
    return form;
}

function latex_str_formula(form, depth) {
    let str_formula = latex_str_formula;
    if (!depth) depth = 0;
    if (form.rel) {
        return form.rel + form.vs.join("");
    }
    if (form.v)
        return latex[form.op] + form.v + " " + str_formula(form.e, depth + 1);
    if (form.e)
        return latex[form.op] + " " + str_formula(form.e, depth + 1);
    if (form.e1)
        return (depth > 0 ? '(' : '') + str_formula(form.e1, depth + 1) + ' ' + latex[form.op] + ' ' + str_formula(form.e2, depth + 1) + (depth > 0 ? ')' : '');
    if (form.op === lfals || form.op === ltrue)
        return latex[form.op];
    return form;
}

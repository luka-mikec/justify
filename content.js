

var demorgan1 = `
|L A /\\ B
||L ¬A \\/ ¬B
|||L ¬A
|||| A
|||| #
|||L ¬B
|||| B
|||| #
||| #
|| ¬(¬A \\/ ¬B)
|L ¬(¬A \\/ ¬B)
||L ¬A
||| ¬A \\/ ¬B
||| #
|| ¬¬A
|| A 
||L ¬B
||| ¬A \\/ ¬B
||| #
|| ¬¬B
|| B
|| A /\\ B
| A /\\ B <-> ¬(¬A \\/ ¬B)
`;

var demorgan2 = `
|L A + B
||L -A * -B
|||L A
|||| -A
|||| #
|||L B
|||| -B
|||| #
||| #
|| -(-A * -B)
|L -(-A * -B)
||L - (A + B)
|||L A
|||| A + B
|||| #
||| -A
|||L B
|||| A + B
|||| #
||| -B
||| -A * -B
||| #
|| --(A + B)
|| A + B
| A + B <-> -(-A * -B)
`;

var drinker = `
|L ¬(AxPx \\/ ¬AxPx)
||L AxPx
||| AxPx \\/ ¬AxPx
||| #
|| ¬AxPx
|| AxPx \\/ ¬AxPx
|| #
| ¬¬(AxPx \\/ ¬AxPx)
| (AxPx \\/ ¬AxPx)
|L AxPx
||L Pa
||| AxPx
|| Pa -> AxPx
|| Ey(Py -> AxPx)
|L ¬AxPx
||L ¬Ex¬Px
|||L ¬Pa
|||| Ex¬Px
|||| #
||| ¬¬Pa
||| Pa
||| AxPx
||| #
|| ¬¬Ex¬Px
|| Ex¬Px
||L ¬Pb
|||L Pb
|||| #
|||| AxPx
||| Pb -> AxPx
||| Ey(Py -> AxPx)
|| Ey(Py -> AxPx)
| Ey(Py -> AxPx)
`;

var contrapos = `
L A -> B
|L ~B
||L A
||| B
||| #
|| ~A
| ~B -> ~A
`;

var bicond_assoc = `
|L -(B + -B)
||L B
||| B + -B
||| #
|| -B
|| B + -B
|| #
| --(B + -B)
| B + -B
|L (A = B) = C
||L A
|||L B
||||L A
||||| B
||||L B
||||| A
|||| A = B
|||| C
|||L C
|||| A = B
|||| B
||| B = C
||L B = C
|||L B
|||| C
|||| A = B
|||| A
|||L -B
||||L C
||||| B
||||| #
|||| -C
||||L A = B
||||| C
||||| #
|||| -(A = B)
||||L -A
|||||L A
|||||| #
|||||| B
|||||L B
|||||| #
|||||| A
||||| A = B
||||| #
|||| --A
|||| A
||| A
|| A = (B = C)
|L A = (B = C)
||L A = B
|||L B
|||| A
|||| B = C
|||| C
|||L -B
||||L A
||||| B
||||| #
|||| -A
||||L B = C
||||| A
||||| #
|||| -(B = C)
||||L -C
|||||L B
|||||| #
|||||| C
|||||L C
|||||| #
|||||| B
||||| B = C
||||| #
|||| --C
|||| C
||| C
||L C
|||L A
|||| B = C
|||| B
|||L B
||||L B
||||| C
||||L C
||||| B
|||| B = C
|||| A
||| A = B
|| (A = B) = C 
| ((A = B) = C) = (A = (B = C))
`;

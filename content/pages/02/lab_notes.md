## Core Idea (bird's-eye view)

A **phylogenetic tree** is a *hypothesis* about evolutionary relationships among taxa, inferred from data (never directly observed). This practical is about **how trees are represented as text files** (Newick, Nexus) and the **structural rules/math** behind them. You need to be fluent in reading a tree string, counting its parts, and knowing why two strings can describe the same tree.

Key conceptual anchors from theory you must carry into the practical:
- **Tree = topology + (optionally) branch lengths**. Topology = branching pattern only.
- **Cladogram** (topology only) vs **phylogram** (branch length = evolutionary change) vs **chronogram** (branch length = time).
- **Rooted vs unrooted**: rooting gives direction (time) to the tree. Done via *outgroup* or *midpoint*.
- **Clades**: monophyletic (ancestor + ALL descendants), paraphyletic (ancestor + SOME descendants), polyphyletic (multiple ancestors, misleading group).
- **Synapomorphy** = shared derived trait → defines clades. Symplesiomorphy (shared ancestral) is misleading.
- **Nodes** = ancestors (internal) or OTUs/tips (terminal). **Branches** connect them. **Polytomy** = unresolved node with >2 descendants.
- A tree is **NOT a ladder** — no taxon is "more advanced"; relatedness comes from MRCA, not tip order.

---

## Inputs

The practical works on **tree files** as text. The two formats:

### 1. Newick (`.nwk`)
A nested-parenthesis string. Building blocks: `( )`, `,`, `:`, names, numbers, terminating `;`.

Examples (increasing complexity):
```
(,(),(,));                              no names
(A,(B,(C,D)));                          leaf names only
(A,(B,(C,D)E))F;                        all nodes named
(A:0.1,(B:0.2,(C:0.3,D:0.4):0.5));      names + branch lengths
```

Polytomy vs dichotomy:
```
(A,B,(C,D));        polytomy at root
(A,(B,(C,D)));      fully dichotomous
```

### 2. Nexus (`.nex`)
A structured file with **blocks** (`BEGIN ... END;`). Header is `#NEXUS`. Common blocks:
- **TAXA** — list of taxon labels
- **CHARACTERS / DATA** — character matrix (DNA, morphology, etc.)
- **TREES** — contains one or more trees written *in Newick format* internally

```
#NEXUS
BEGIN TREES;
  TREE tree1 = ((A,B),(C,D));
END;
```

So Nexus is the **flexible container**, Newick is the **tree-string syntax** that lives inside it (or alone).

### Tools to view them
- **FigTree** (GUI), or online viewers — visualize `.nwk` / `.nex`.

---

## Outputs

The practical doesn't really "produce" data — the outputs are:
- A **rendered tree** in FigTree (or similar) from a Newick/Nexus string.
- Your ability to **count branches/nodes** for a given N tips.
- Recognition that **multiple Newick strings = the same tree** (rotations are free).

### The counting formulas (memorize — likely exam fodder)
For an **unrooted** tree with **N tips**:
| Quantity | Formula |
|---|---|
| Terminal branches | N |
| Total branches | 2N − 3 |
| Internal branches | N − 3 |
| Internal nodes | N − 2 |

Number of possible trees explodes:
- A **rooted** tree has **2N − 3** times as many possibilities as the unrooted equivalent.
- 10 leaves → ~2 million unrooted, ~34 million rooted.

---

## Interpretations

- **Same tree, different strings**: `(A,B,(C,D));` ≡ `(B,A,(C,D));` ≡ `((C,D),A,B);` ≡ `(A,B,(D,C));`. Any internal node can be **rotated** without changing the topology. Don't be fooled by tip order.
- **Different trees** look superficially similar but differ in their **bipartitions/splits** (which taxa are grouped together). For 4 taxa: only 3 distinct unrooted topologies exist → `AB|CD`, `AC|BD`, `AD|BC`.
- **Branch length meaning depends on tree type**: in a cladogram lengths are arbitrary; in a phylogram they = substitutions/site; in a chronogram they = time.
- **A polytomy ≠ a real burst of speciation** necessarily — usually it means *unresolved relationships* in the data.
- **Reading relatedness**: trace back to the **most recent common ancestor (MRCA)**. Adjacency at the tips means *nothing*.

### Common pitfalls of Newick (the prof may quiz these)
- Must end with `;`
- Parentheses must balance
- Either give branch lengths everywhere or nowhere
- Special chars in names → quote: `'Homo sapiens'`
- Whitespace is ignored; trees can wrap across lines


## Possible Exam Questions

- ............................................................
- ............................................................
- ............................................................
- ............................................................
- ............................................................
- ............................................................
- ............................................................

## 60-second mental cheat sheet
- Newick = string with `( , ) ;`. Nexus = `#NEXUS` file with `BEGIN ... END;` blocks containing Newick trees.
- N tips → N−2 internal nodes, 2N−3 total branches, N−3 internal branches.
- Rotation of internal nodes = SAME tree.
- 4 taxa → only 3 unrooted topologies.
- Cladogram (shape) → Phylogram (change) → Chronogram (time).
- Mono / Para / Poly — know the diagram.
- Synapomorphy defines clades. Symplesiomorphy misleads.
- A tree is a HYPOTHESIS, never a fact.
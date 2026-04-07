## Core Idea (bird's-eye view)

Now that you have aligned sequences (Lesson 05), you finally build a tree from them. There are two fundamentally different ways to do this, and this lesson contrasts them head-to-head:

1. **Distance-based methods** — collapse the alignment into a **pairwise distance matrix** (one number per pair of sequences) and build a tree from that matrix. The original sequences are thrown away after step one. Fast, simple, good for exploration. Examples: **UPGMA**, **Neighbor Joining (NJ)**.
2. **Character-based methods** — work directly on the alignment, looking at **one column at a time**, and score each candidate tree by how well it explains the observed character states. Slower but more accurate because they preserve information about which positions support which groupings. Examples: **Maximum Parsimony (MP)**, **Maximum Likelihood (ML)**, **Bayesian Inference (BI)**.

The lesson covers UPGMA, NJ, and MP in detail. ML and BI come in Lessons 08 and 09.

Key conceptual anchors to bring into the meeting:

- **Distance methods compress information**. Once you turn the alignment into a matrix of numbers, you cannot recover which sites supported which groupings. Character methods keep that information, which is why they handle conflict and homoplasy better.
- **UPGMA assumes a molecular clock** (constant evolutionary rate); NJ does not. This single difference is why UPGMA produces a rooted, ultrametric tree and NJ produces an unrooted tree with variable branch lengths.
- **Parsimony minimises the total number of character changes** required to explain the data on a tree. The "best" tree is the shortest one. It uses an *implicit* model of evolution but no explicit statistical model — and this is its weakness.
- **Only informative sites matter for parsimony**: a column must contain at least two character states, each present in at least two taxa. Invariant columns and singletons contribute nothing.
- **Tree space is too large to search exhaustively**. All character methods need a **search strategy**. The three main rearrangement moves are NNI (small, fast, local), SPR (medium, prune-and-regraft), and TBR (largest, bisect-and-reconnect). The bigger the move, the better the chance of escaping local optima but the more expensive each step.

---

## Inputs

### For both methods
- A **multiple sequence alignment** (FASTA, PHYLIP, or Nexus). The Lesson 05 output goes straight in here.

### For distance-based methods
- The alignment gets converted into a **distance matrix**. The choice of distance metric matters:
  - **p-distance** — raw proportion of differing sites. No correction for multiple substitutions, no rate variation, no transition/transversion bias.
  - **Model-based distances** — Jukes-Cantor, K2P, Tamura-Nei, HKY, GTR — correct for the things p-distance ignores. Coming in Lesson 07.
- The practical uses **p-distance**, which is the simplest possible choice.

### For parsimony
- The alignment directly. No matrix step. Parsimony scans columns and counts how many state changes each candidate tree requires.
- A **tree search strategy**: in the practical, the **parsimony ratchet** (Nixon 1999), which is much better than plain NNI/SPR at escaping local optima.

---

## Outputs

### UPGMA
- A **rooted, ultrametric** tree. All tips are equidistant from the root because the algorithm assumes a constant clock. Looks like a clean dendrogram.

### NJ
- An **unrooted** tree with variable branch lengths reflecting the actual pairwise distances. No molecular-clock assumption.

### Maximum Parsimony
- A tree (or several equally-parsimonious trees) that minimises the total number of character state changes across the alignment.
- A **parsimony score** — the total number of changes the tree requires. Lower is better. You can compute this score for *any* tree (even the UPGMA or NJ tree) to compare them on parsimony's own terms.

---

## Hands-on: Commands and What to Look At

This lesson runs in **R**. In the Docker container, open RStudio in your browser at `http://localhost:8787` (login `rstudio` / `phylo123`) — everything is pre-installed, no headaches.

### Set up the session
```r
setwd("~/MP26")
library(Biostrings)
library(msa)
library(ape)
library(seqinr)
library(phangorn)
library(phytools)
```

### Load sequences and align them inside R
```r
sequences <- readDNAStringSet("data/example_alignements/nt/Rhabdomeric1.nt.aln")
alignment <- as.phyDat(msa(sequences, "Muscle"))
```
Note: even though the file already has `.aln` in the name, the practical re-aligns it with MUSCLE inside R. `as.phyDat` converts the result into the data structure `phangorn` expects.

### Build a distance matrix (p-distance)
```r
dm <- dist.p(alignment)
dm
```
Inspect the matrix. It is symmetric, with zero on the diagonal. Each cell is the proportion of sites that differ between two sequences.

### UPGMA tree
```r
treeUPGMA <- upgma(dm)
plot(treeUPGMA)
```
You should see a rooted, ladder-like tree where all tips are aligned at the same right edge — that's the molecular clock assumption made visible.

### NJ tree
```r
treeNJ <- nj(dm)
plot(treeNJ)
```
Compare it side by side with the UPGMA tree. Tips will not be aligned anymore; branch lengths will vary, and the tree is unrooted.

### Parsimony tree using the ratchet
```r
treePARSIMONY <- pratchet(alignment,
                          maxit = 200, minit = 50,
                          k = 50, all = TRUE)
```
The parsimony ratchet is a stochastic search that perturbs the data and re-optimises repeatedly, helping the search escape local optima. Much better than plain NNI for non-trivial datasets.

### Refine with NNI from the ratchet starting point
```r
treePARSIMONY <- optim.parsimony(treePARSIMONY, alignment, rearrangements = "NNI")
plot(treePARSIMONY)
```

### Score the three trees against the alignment
```r
fitch(treeUPGMA, alignment)
fitch(treeNJ, alignment)
fitch(treePARSIMONY, alignment)
```
`fitch()` returns the parsimony score (number of state changes) for each tree on the same data. The parsimony tree should have the lowest score by definition; the comparison tells you how much "worse" UPGMA and NJ look from parsimony's point of view.

### Compare topologies side by side
```r
par(mfrow = c(1, 3))
plot(treeUPGMA,    main = "UPGMA")
plot(treeNJ,       main = "NJ")
plot(treePARSIMONY, main = "Parsimony")
```
Look for: which clades are recovered by all three methods (probably real signal) vs which clades disagree between methods (probably weak signal or real biological conflict).

### What good looks like at this stage
- A distance matrix that makes intuitive sense (closely related species closer to zero).
- UPGMA and NJ trees that mostly agree on the obvious clades.
- A parsimony tree that has the lowest `fitch()` score — if it doesn't, your search hasn't converged and you should rerun with more iterations.
- Topological agreement on the well-supported clades and disagreement on the genuinely uncertain ones.

---

## Interpretations

- **UPGMA's molecular clock assumption is its biggest weakness**. If lineages evolve at different rates (which they almost always do), UPGMA will systematically misplace fast-evolving taxa, dragging them toward the root or pairing them artificially. This is why UPGMA is rarely used today for serious phylogenetics, despite being conceptually simple.
- **NJ is the workhorse distance method**. It is fast, doesn't assume a clock, and produces reasonable trees for exploratory work or for very large datasets where character methods are too slow. It is still used as a starting tree for ML/BI searches.
- **Distance methods lose information by construction**. Two different alignments can produce the same distance matrix if their patterns of conflict cancel out. Character methods can distinguish them. This is the deepest argument for character-based phylogenetics.
- **Parsimony's appeal is conceptual purity**: the simplest explanation wins, no hidden parameters. But it has real failure modes:
  - **No correction for multiple substitutions**: if a site has changed twice (A → G → A), parsimony sees no change. This biases parsimony badly when sequences are diverged.
  - **Long branch attraction (LBA)**: long branches get pulled together because random parallel changes accumulate by chance and look like shared derived states. Parsimony has no model to discount these.
  - **Sensitive to homoplasy** in general — convergent evolution and reversals fool it.
- **Why informative sites matter**: a singleton (state present in one taxon only) supports the same parsimony cost on every possible tree, so it can never discriminate between topologies. Only sites with at least two states each present in at least two taxa are useful. This is also a window into why huge datasets aren't necessarily informative — what matters is the number of *informative* columns, not the total length.
- **Tree rearrangement spectrum**: NNI < SPR < TBR in both expressiveness and cost. NNI is for refinement near a good tree. SPR is for serious search. TBR is for thorough search but expensive. Parsimony ratchet stacks on top of these by adding stochastic perturbations, which is why it finds better trees than any single rearrangement strategy alone.
- **Bridging to next lessons**: distance methods need a model of evolution to compute meaningful distances (Lesson 07: Markov models). Character methods need an explicit statistical framework to overcome parsimony's failures (Lesson 08: ML; Lesson 09: BI). The progression is: distance with raw counts → distance with model → likelihood → Bayesian. Each step adds statistical machinery to handle a problem the previous step couldn't.

---

## Lexicon to keep handy

- distance-based vs character-based methods
- pairwise distance, distance matrix
- p-distance, model-based distance
- UPGMA, WPGMA, ultrametric tree
- Neighbor Joining (NJ), Q-matrix, net divergence
- molecular clock assumption
- maximum parsimony (MP), parsimony score
- informative site, singleton, invariant site
- Fitch algorithm
- tree space, tree search
- NNI (Nearest Neighbour Interchange)
- SPR (Subtree Pruning and Regrafting)
- TBR (Tree Bisection and Reconnection)
- parsimony ratchet
- local optimum
- long branch attraction (LBA)
- homoplasy (carried over from L03)

---

## Possible Exam Questions

*(to be filled in during the meeting)*
## Core Idea (bird's-eye view)

Phylogenetics needs **homologous characters**, but sequences in a FASTA file are just strings of different lengths. Before you can compare them, you need to **align** them: arrange the sequences so that each column represents a single position that descended from one position in the common ancestor. **Orthologous genes give you homologous genes; alignment gives you homologous sites.**

This lesson is the bridge between the orthogroups produced in Lesson 04 and the tree-building of Lesson 06+. The pipeline is:

1. **Align** each orthogroup (MAFFT) — turn unaligned FASTA into a matrix where columns are putatively homologous positions.
2. **Filter** the alignment (Gblocks) — throw away columns whose homology you don't trust, because misaligned regions will mislead every downstream analysis.

Two conceptual layers sit underneath this:

- **Sequences evolve on a tree**: substitutions, insertions, and deletions happen along branches. The alignment is your hypothesis about which positions trace back to the same ancestral position. Multiple alignments of the same sequences are possible, and choosing among them is partly an "art" — you balance gaps against mismatches.
- **Scoring**: alignments are scored by summing match/mismatch values and subtracting **gap penalties**. Two penalty schemes exist: linear (`c = -d·g`) and affine (`c = -d - (g-1)·e`, where `d` is gap-open and `e` is gap-extend). Affine is the standard because it correctly models the biology: opening a gap is rare and costly, but extending an existing gap is cheap.

The number of possible alignments explodes combinatorially with sequence number and length, exactly like the number of possible trees. Exhaustive search is impossible, so all real aligners use heuristics.

Important points to carry into the meeting:
- **Alignment vs filtering are separate steps** with separate tools and separate failure modes.
- **You can never recover from a bad alignment** in downstream tree-building — the errors propagate silently.
- **Modern datasets are too large for manual curation**, which is why automated filters like Gblocks, Aliscore, and BMGE exist, even though manual curation is technically the gold standard.

---

## Inputs

### For alignment (MAFFT)
- A single **unaligned FASTA file** per orthogroup, where sequences differ in length and contain no gaps. These come straight from the `Single_Copy_Orthologue_Sequences/` folder produced by OrthoFinder in Lesson 04.
- Optional parameters worth knowing:
  - `--auto` — let MAFFT pick the best algorithm based on dataset size and divergence (FFT-NS-1, FFT-NS-2, L-INS-i, etc.).
  - `--op <n>` — gap-opening penalty (default 1.53). Higher values discourage gaps; lower values produce more gappy alignments.
  - Algorithm flags (`--localpair`, `--genafpair`, `--globalpair`) when you don't want auto.

### For filtering (Gblocks)
- An **aligned FASTA file** (the output of MAFFT).
- Key parameters from the practical:
  - `-t=p` (protein), `-t=d` (DNA), or `-t=c` (codons). Tells Gblocks how to interpret the data.
  - `-b4` — minimum length of a conserved block to keep.
  - `-b5` — allowed gap positions: `n` (none), `h` (half), `a` (all).

---

## Outputs

### MAFFT
- An **aligned FASTA file** where every sequence has the same length, with `-` characters inserted as gaps. Columns are the alignment matrix that all downstream tools consume.

### Gblocks
- `*-gb` — the **filtered FASTA file**, containing only the columns Gblocks judged trustworthy.
- `*-gb.htm` — an **HTML report** showing which positions were kept (highlighted) and which were removed. Open in a browser to inspect what got cut.

---

## Hands-on: Commands and What to Look At

### Inspect an unaligned orthogroup
```bash
cd ~/MP26
bat data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.fa
```
Notice: no `-` characters, sequences have different lengths. That is the "before" state.

### Align with MAFFT (default settings)
```bash
mafft --auto \
  data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.fa \
  > data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.aln
```
`--auto` picks the algorithm. The output is a FASTA where every sequence is the same length.

### Try a different gap-opening penalty
```bash
mafft --auto --op 7 \
  data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.fa \
  > data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.op7.aln
```
Higher `--op` (7 vs default 1.53) makes opening a gap much more expensive, so MAFFT will prefer mismatches over gaps. Compare the two `.aln` files in **AliView** side by side — the high-penalty version will have fewer, longer gaps and more aligned columns full of substitutions.

### Quick visual check from the terminal
```bash
bat data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.aln | head -n 20

# How many columns in the alignment?
head -n 2 data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.aln | tail -n 1 | wc -c
```

### Loop over all orthogroups (the practical's bonus exercise)
```bash
mkdir -p data/alignments
for f in data/Single_Copy_Orthologue_Sequences/*.fa; do
  name=$(basename "$f" .fa)
  mafft --auto "$f" > "data/alignments/${name}.aln"
done
```
This is what you do in a real pipeline: you never align orthogroups one at a time.

### Filter with Gblocks
```bash
Gblocks data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.aln \
  -t=p -b4=5 -b5=a
```
- `-t=p` because these are proteins.
- `-b4=5` keeps blocks at least 5 columns long.
- `-b5=a` allows gaps in any position.

Two files appear next to the input: `*.aln-gb` (the filtered alignment) and `*.aln-gb.htm` (the report). Open the HTML in a browser — kept positions are highlighted, removed ones are not.

### Try a much stricter filter
```bash
Gblocks data/Single_Copy_Orthologue_Sequences/N0.HOG0000020.aln \
  -t=p -b4=59 -b5=n
```
- `-b4=59` requires very long conserved blocks.
- `-b5=n` allows no gaps anywhere.

This is deliberately too strict — almost everything gets thrown away. The point of the exercise is to feel the trade-off: stricter filters give you cleaner columns but may leave you with so little signal that the remaining alignment is useless for phylogenetics.

### What good looks like at this stage
- Aligned columns where conserved positions look genuinely conserved across species.
- Gaps clustered in clear insertion/deletion regions, not scattered randomly.
- After Gblocks: most of the alignment retained when parameters are reasonable; obvious junk regions removed.
- A clear visual difference between `--auto` and `--op 7` outputs in AliView, which proves you understand that gap penalty is a real choice, not a black box.

---

## Interpretations

- **There is no single "correct" alignment**. Different gap penalties, different algorithms, and different filtering strategies all produce defensible answers. The prof's framing of alignment as "an art" is the honest version of this — you are making modelling choices, and you should be able to justify them.
- **The combinatorial explosion matters**: just like trees, the number of possible alignments grows fast enough that exhaustive search is impossible. Every aligner is a heuristic. This is why two tools can give different answers on the same input and neither is "wrong".
- **Hamming distance vs pairwise distance vs model-based distance**: Hamming only counts mismatches and ignores gaps. Pairwise distance accounts for gaps and indels. Model-based distances (Jukes-Cantor, K2P, GTR — coming next week) correct for multiple substitutions at the same site. The alignment determines what your distance metric can even measure.
- **Gap penalty trade-off**: low penalty produces many gaps (the aligner happily inserts gaps to avoid mismatches), high penalty produces few gaps (the aligner accepts mismatches to keep sequences flush). Neither extreme is right; the biological truth is somewhere in between, and depends on how indel-prone the gene is.
- **Filtering is destructive but necessary**. You are throwing away data on the assumption that the discarded columns are noise rather than signal. Get the parameters wrong and you can throw away real phylogenetic information. The `-b4=59 -b5=n` exercise is designed to show you exactly this failure mode.
- **Why the practical uses proteins**: same reason as Lesson 04. Mollusks and annelids are deep enough that nucleotide sites are saturated. Proteins are slower-evolving and align more reliably at this depth. For closely related species you would prefer nucleotides.
- **Connection to the next step**: the filtered alignments are the direct input to the tree-building methods of Lesson 06 onwards. Whatever errors survive into the alignment will be inherited by the tree, often invisibly. This is why everyone in the field repeats that "garbage in, garbage out" applies more to alignment than to almost any other step.
- **Phylogenetic subsampling** (mentioned at the end of the slides) is the higher-level version of filtering: instead of removing columns within an alignment, you remove entire genes or entire taxa. This will get its own lesson under "biases".

---

## Lexicon to keep handy

- multiple sequence alignment (MSA), pairwise alignment
- global vs local alignment, Needleman-Wunsch, Smith-Waterman
- progressive alignment, guide tree
- gap, gap-open penalty, gap-extension penalty
- linear vs affine gap cost
- match / mismatch score
- Hamming distance, pairwise distance, model-based distance
- alignment filtering, conserved block
- MAFFT, Gblocks, Aliscore, BMGE
- AliView (visualisation)
- saturation
- in-paralog vs out-paralog (carried over from L04)
- homologous sites vs homologous genes

---

## Possible Exam Questions

*(to be filled in during the meeting)*
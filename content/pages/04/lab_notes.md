<!-- auth-wall -->

# Lesson 04 — Orthology Inference and Taxon Sampling

## Core Idea (bird's-eye view)

This lesson is the first real step of a phylogenomic pipeline: **deciding which species and which genes to use**. Two big problems get tackled together:

1. **Taxon sampling** — which species you include shapes the whole downstream tree. Bad sampling produces real, named pathologies (long branch attraction, artificial clades, lost signal, broken rate estimation). The fix is broad, representative sampling and good outgroups.
2. **Orthology inference** — phylogenetics needs **homologous** characters, but within homology you must distinguish orthologs (split by speciation) from paralogs (split by duplication) and xenologs (split by horizontal transfer). Only orthologs are expected to track the species tree. The classic Walter Fitch quote — "phylogenies require orthologous, not paralogous genes" — is the entire motivation for this lesson.

The practical operationalises both: you take 8 proteomes (7 mollusks + 1 annelid outgroup) and run **OrthoFinder** to cluster genes into **orthogroups**, identify single-copy orthologs, and even get a draft species tree as a by-product.

Key conceptual anchors to bring into the meeting:

- **Homology** (shared ancestry) is the umbrella. Within it: **orthology** (speciation), **paralogy** (duplication), **xenology** (transfer). Outside it: **analogy / homoplasy** (similar without shared ancestry).
- The category is defined by **the event at the most recent common ancestor of the two genes**, NOT by their function. The "orthology conjecture" (orthologs share function) is contested.
- **In-paralogs** vs **out-paralogs**: defined relative to a reference speciation. In = duplication after the split, out = duplication before.
- **One-to-one, one-to-many, many-to-many orthologs**: depends on how many copies survived in each lineage after speciation, with or without lineage-specific duplications.
- **Orthogroup**: extension of orthology to multiple species. A group of homologous genes descending from the MRCA of a chosen set of species, defined by a reference speciation event. This is the actual unit OrthoFinder produces.
- **Reciprocal Best Hit (RBH)**: the original simple way to call orthologs between two genomes — gene A's best hit in genome 2 is gene X, and gene X's best hit back in genome 1 is gene A. Symmetric. Cheap. Misses one-to-many cases. Modern tools (OrthoFinder, OrthoMCL, OMA) move beyond it via clustering and gene-tree reconciliation.
- **Type of sequencing matters too**: genomes vs transcriptomes vs mitogenomes vs UCEs vs RADseq vs PCR — each has cost/marker/quality tradeoffs that determine what kind of phylogenetic question you can even ask.

---

## Inputs

### For the practical
- A folder of **proteomes** in FASTA format, one file per species, in `Data/Proteoms/`. Eight species total: 7 mollusks (gasteropods, bivalves, polyplacophora, cephalopoda) plus *Helobdella robusta* (annelid) as outgroup.
- The choice to use **amino acid** sequences rather than nucleotides because the species are very distantly related — at this depth, nucleotides would be saturated, while proteins remain informative. The opposite would be true for closely related species, where nucleotides give more signal thanks to codon degeneracy.

### For OrthoFinder specifically
- The command at minimum: `orthofinder -f <proteoms_folder>`.
- In the practical: `orthofinder -o Analyses/My_Orthology.Inference -f Data/Proteoms`.
- Important tunable parameters worth knowing:
  - `-M` — gene tree inference method (`dendroblast` default, or `msa`).
  - `-S` — sequence search program (`diamond` default, or `blast`, `mmseqs`...).
  - `-T` — tree inference method when using `-M msa` (`fasttree`, `iqtree`, `raxml`...).
  - `-s` — supply your own rooted species tree.
  - `-d` — input is DNA, not protein.
  - `-t` / `-a` — parallelism.
- Stopping points (`-op`, `-og`, `-os`, `-oa`, `-ot`) and restart points (`-b`, `-fg`, `-ft`) let you resume from intermediate steps without redoing the expensive BLAST stage.

### What OrthoFinder is doing under the hood (4 steps)
1. Orthogroup inference via reciprocal best BLAST/DIAMOND hits, building a similarity graph and clustering with MCL.
2. Inference and rooting of a species tree from the orthogroups.
3. Gene tree inference and rooting for each orthogroup.
4. Reconciliation of gene trees against the species tree to identify orthologs and label duplication events.

---

## Outputs

OrthoFinder produces a large output directory. The pieces the practical actually uses:

### 1. `Statistics_Overall.tsv`
Summary numbers for the whole run. The ones to look at:
- Number of genes / number in orthogroups / unassigned (and the percentages).
- Number of orthogroups, mean and median orthogroup size.
- **Number of orthogroups with all species present** — how many groups are complete across the dataset.
- **Number of single-copy orthogroups** — the gold-standard set for downstream phylogenetics.
- Species-specific orthogroups (groups containing only one species; usually lineage-specific expansions).

In the practical's example: 8 species, 3534 genes, 88.5% in orthogroups, 101 orthogroups, 56 with all species present, and **49 single-copy orthogroups**.

### 2. `Orthogroups.GeneCount.tsv`
A matrix: rows are orthogroups, columns are species, cells are gene counts per species in that orthogroup, with a Total column. This is where you read off:
- Whether an orthogroup is single-copy across species.
- Whether it's species-specific (all zeros except one column).
- Lineage-specific expansions (one species with much higher count) or losses (zeros where you'd expect presence).

### 3. `SpeciesTree_rooted.txt`
A rooted species tree in Newick format, produced by OrthoFinder as a byproduct of reconciliation. You open it in FigTree and check it against published phylogenies (Kocot et al. 2011 in this case). The outgroup *H. robusta* should sit at the root.

### 4. `Single_Copy_Orthologue_Sequences/`
A folder with one FASTA file per **single-copy orthogroup**. Each file contains one sequence per species. These are the inputs you will carry forward to alignment (Lesson 05) and tree-building.

---

## Hands-on: Commands and What to Look At

The Docker image (`mp26-phylo`) has OrthoFinder pre-installed plus pretty-printing tools (`bat`, `eza`, `csvlook`, `tsv`) that make the outputs much easier to read than raw `cat`.

### Inspect the input proteomes first
```bash
cd ~/MP26
eza -lh data/proteoms/                          # nicer ls of the input folder
for f in data/proteoms/*.pep; do
  echo "=== $f ==="
  grep ">" "$f" | head -n 3                     # first three headers per species
  grep -c ">" "$f"                              # total number of proteins
done
```
This tells you how many proteins each species contributes before you start. Big imbalances between species are a warning sign for orthogroup quality.

### Run OrthoFinder
```bash
orthofinder -o Analyses/My_Orthology.Inference -f Data/Proteoms
```
Quick-and-dirty defaults: DIAMOND for the search, dendroblast for gene trees, MCL inflation 1.5. Good enough for the practical. Real projects: tune `-S`, `-M msa`, `-T iqtree`, possibly `-s` to feed in a known species tree.

If you want to see what knobs are available without running anything:
```bash
orthofinder --help
```

### Look at the summary statistics

```bash
head -n 22 test/Results_Apr07/Comparative_Genomics_Statistics/Statistics_Overall.tsv | csvlook -t

```


`csvlook -t` formats the TSV as a real table in the terminal. The numbers to read off:
- `Number of single-copy orthogroups` — how many clean markers you can carry to Lesson 05.
- `Number of orthogroups with all species present` — broader complete set.
- `Percentage of genes in orthogroups` — clustering coverage.
- `Number of species-specific orthogroups` — lineage-specific expansions or junk.

### Inspect the orthogroup count matrix
```bash
bat $RESULTS/Orthogroups/Orthogroups.GeneCount.tsv | head -n 30
```
`bat` gives syntax highlighting and line numbers. To find specific patterns:
```bash
# Orthogroups present in all 8 species (no zeros in any column)
awk -F'\t' 'NR>1 && $2>0 && $3>0 && $4>0 && $5>0 && $6>0 && $7>0 && $8>0 && $9>0' \
  $RESULTS/Orthogroups/Orthogroups.GeneCount.tsv | wc -l

# Orthogroups where one species has > 50 copies (lineage-specific expansion)
awk -F'\t' 'NR>1 {for(i=2;i<=9;i++) if($i>50) {print; next}}' \
  $RESULTS/Orthogroups/Orthogroups.GeneCount.tsv
```

### Look at the species tree OrthoFinder produced
```bash
bat $RESULTS/Species_Tree/SpeciesTree_rooted.txt
```
Then download the file and open it in **FigTree** to visualise. Check:
- Is *H. robusta* at the root, as expected from the outgroup?
- Does the bivalve / gastropod / cephalopod / polyplacophora branching match Kocot et al. 2011?

### Inspect the single-copy orthogroup sequences (the input for Lesson 05)
```bash
SCO=$RESULTS/Single_Copy_Orthologue_Sequences
eza -lh $SCO | head                             # how many SCO files
ls $SCO | wc -l                                 # exact count
bat $SCO/$(ls $SCO | head -n1)                  # peek at the first one
```
Each file is a small FASTA: one sequence per species, header = species name, ready to align.

### What "good" looks like at this stage
- Most genes assigned to orthogroups (>80%).
- A reasonable number of single-copy orthogroups (tens to hundreds, depending on species depth).
- A species tree topology that makes biological sense and places the outgroup correctly.
- No species contributing wildly more or fewer genes than the others.

If any of those go wrong, the issue is upstream (proteome quality, contamination, missing data) and you should fix it before moving on.

---

## Interpretations

- **Single-copy orthogroups are the safe but small set**. They are the cleanest input for phylogenetics because each species contributes exactly one sequence with no duplication ambiguity, but at deep evolutionary distances you may end up with very few of them. The trade-off: clean signal vs amount of data. Tools like PhyloTreePruner (and newer gene-family methods like SpeciesRax, ASTRAL-Pro) try to expand the usable set by including in-paralogs under user-defined constraints or by handling whole gene families with duplication/loss/transfer/ILS events.
- **Species-specific orthogroups** mean the genes cluster only within one species — typically a lineage-specific expansion (often transposable elements, immune genes, or fast-evolving families) or contamination. They are useless for species-tree inference but interesting for comparative genomics.
- **Reading the GeneCount matrix as a comparative genomics tool**: rows with one species dominating point to expansions; rows with one species at zero and others at small counts point to losses. This is how you start to "see" gene-family dynamics across the tree.
- **The OrthoFinder species tree is a byproduct, not a final answer**. It is built from the orthogroup structure itself and is fine as a sanity check, but you would not publish it without rerunning a proper phylogenetic analysis on the single-copy alignments. Comparing it against the literature is a sanity check, not a result.
- **Why the practical uses proteins, not DNA**: deep divergence means nucleotide sites have been substituted multiple times (saturation), so the signal is washed out. Proteins evolve more slowly because of codon degeneracy and selection on amino acid identity. For closely related species the reverse is true — nucleotides carry more information.
- **Connecting back to taxon sampling**: the prof's exercise prompts ("how would more taxa influence these statistics?") are pushing you to realise that more taxa generally means **fewer single-copy orthogroups** (because the chance of any orthogroup being single-copy in all species drops with each species added) but **better breaking up of long branches** and more reliable tree rooting. There is a real tension here.
- **RBH limitations matter conceptually**: any method based purely on best hits will systematically miss one-to-many and many-to-many orthologs and can be fooled by gene loss in one lineage. OrthoFinder's clustering plus tree reconciliation is the modern answer.

---

## Lexicon to keep handy

- homology, analogy, homoplasy
- orthology, paralogy, xenology
- in-paralog, out-paralog
- one-to-one, one-to-many, many-to-many orthologs
- orthogroup, single-copy orthogroup, species-specific orthogroup
- reciprocal best hit (RBH), all-vs-all search, MCL clustering
- gene tree vs species tree, reconciliation
- proteome, transcriptome, mitogenome, UCE, RADseq, GBS
- saturation, codon degeneracy
- long branch attraction, taxon sampling bias
- gene family expansion / contraction / loss / gain
- the orthology conjecture (and why it is contested)
- Walter Fitch's principle: phylogenies require orthologous, not paralogous genes

---

## Possible Exam Questions

*(to be filled in during the meeting)*
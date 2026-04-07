## Core Idea (bird's-eye view)

Lesson 02 was about **trees as objects** (Newick/Nexus). Lesson 03 is about **the data that goes into building those trees**: molecular sequences. The practical is short and format-focused (FASTA, PHYLIP, Nexus-DATA), but it sits on top of a heavy theoretical layer you must carry into the meeting:

- Phylogenetics can use any heritable character, but **molecular characters dominate** because they are abundant, cheap, objective, standardized, and resolve both shallow and deep relationships.
- Characters used must be: **heritable, independent, informative, clearly coded, homologous, and ideally non-homoplasious**.
- **Homology** (similarity from shared ancestry) is the prerequisite. **Homoplasy** (convergence, reversal) is the enemy — it produces character conflict and misleads inference.
- Genetic distance between two taxa = sum of changes along the two branches connecting them to their common ancestor: `d(SP1,SP2) = (SP0 to SP1) + (SP0 to SP2)`.
- **Molecular clock hypothesis** (Kimura, neutral theory): neutral mutations accumulate at a roughly constant rate, so older splits accumulate more differences. This is what allows dating divergences — but rates vary across genes, lineages, and time, so calibrations (fossils, known splits) are needed.
- Historical anchors: Nuttall (1904, immunological distances), Cavalli-Sforza & Edwards (1963, first computed trees), Fitch & Margoliash (1967, first modern sequence-distance tree).

The practical itself is teaching you how molecular data is **physically stored on disk** so you can feed it into alignment and tree-building tools later in the course.

---

## Inputs

The practical introduces three sequence file formats. The "input" here is raw sequence data — nucleotides (DNA/RNA) or amino acids — for multiple taxa.

### 1. FASTA
The simplest and most common format. Each sequence has a header line starting with `>` followed by the sequence on the next line(s).

```
>Taxon1
ATGCGTACGTAGCTAGCTACGATCG
>Taxon2
ATGCGTACGTAGCTAGATACGATCG
>Taxon3
ATGCGTACGTAGCTAGCTACGATCC
```

Key points:
- Header line must start with `>`.
- No length declaration, no strict columns. Very flexible.
- Used everywhere — alignments, databases (NCBI, UniProt), tool inputs.

### 2. PHYLIP
A strict column-based format originally for the PHYLIP software package.

```
3 25
Taxon1    ATGCGTACGTAGCTAGCTACGATCG
Taxon2    ATGCGTACGTAGCTAGATACGATCG
Taxon3    ATGCGTACGTAGCTAGCTACGATCC
```

Key points:
- First line: `<number of sequences> <number of characters>`.
- Taxon names traditionally limited to **10 characters** — longer names get truncated. This is a real source of bugs.
- Two flavors exist: sequential (one taxon at a time) and interleaved (blocks of all taxa, repeating). The example above shows the interleaved style.
- Less flexible than FASTA but still expected by many phylogenetics tools.

### 3. Nexus (DATA block)
The same Nexus container from Lesson 02, but here storing a sequence matrix instead of a tree.

```
#NEXUS
BEGIN DATA;
    DIMENSIONS NTAX=3 NCHAR=25;
    FORMAT DATATYPE=DNA MISSING=? GAP=-;
    MATRIX
        Taxon1    ATGCGTACGTAGCTAGCTACGATCG
        Taxon2    ATGCGTACGTAGCTAGATACGATCG
        Taxon3    ATGCGTACGTAGCTAGCTACGATCC
    ;
END;
```

Key points:
- Block-based: `BEGIN DATA; ... END;`.
- Declares dimensions (NTAX, NCHAR), datatype (DNA/RNA/protein), and the symbols used for missing data and gaps.
- Most flexible — can store sequences, trees, character sets, and analysis commands all in one file. This is why programs like MrBayes and PAUP* use it natively.

---

## Outputs

The practical does not "produce" anything computed — its outputs are conceptual:

- The ability to **recognize at a glance** which format a file is in.
- Understanding that **the same sequence data** can be written in any of these three formats and converted between them losslessly (modulo PHYLIP's name-length limit).
- Knowing **which format which tool expects** — FASTA for aligners (mafft), PHYLIP for many tree builders (older iqtree, RAxML), Nexus for Bayesian tools (MrBayes) and tree storage.

---

## Interpretations

- **Format choice is downstream-driven**: you pick the format the next tool in your pipeline wants. Conversions are routine.
- **PHYLIP's 10-character name limit** is the most common gotcha. If your taxa have long names, they get silently truncated, and downstream you may end up with duplicated or confused labels.
- **FASTA has no built-in concept of alignment**: the sequences in a FASTA file may or may not be aligned. An "aligned FASTA" is just a FASTA where every sequence has the same length (gaps usually shown as `-`). This matters because phylogenetics needs aligned data, not raw sequences.
- **Nexus is a container, not a format**: the same `#NEXUS` file can hold a DATA block (Lesson 03 practical) or a TREES block (Lesson 02 practical), or both at once. This is why Nexus shows up in both lessons.
- **Connecting back to theory**: each column in an aligned matrix is a character; each cell is a character state. The whole matrix is the input to every algorithm in this course. The quality of phylogenetic inference is bounded by how well the columns represent **homologous** positions — which is the entire job of sequence alignment (Lesson 05).
- **On the molecular clock**: the data in these files is what you measure distance on. Whether that distance reflects time depends on whether the rate of change has been constant — which the prof has flagged as usually NOT being the case in practice.

---

## Lexicon to keep handy

- homology / homoplasy / convergence / reversal
- heritable, independent, informative, clear, homologous, non-homoplasious (the six character criteria)
- genetic distance, molecular clock, neutral theory
- FASTA, PHYLIP (sequential vs interleaved), Nexus DATA block
- aligned vs unaligned sequences
- NTAX, NCHAR, DATATYPE, GAP, MISSING

---

## Possible Exam Questions

*(to be filled in during the meeting)*
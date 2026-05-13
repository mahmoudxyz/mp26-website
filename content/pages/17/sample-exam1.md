## Exam Sample1

**22 closed questions · 1 pt each · no penalty for wrong answers**

**2 open questions · 5 pts total · max three sentences each**

---

## Multiple Choice

**01.** Phylogenomics is:
- A. The study of how genomes function within individual cells.
- **B. A field that combines phylogenetics and genomics to infer evolutionary history. ✓**
- C. A method that exclusively uses mitochondrial DNA to construct species trees.
- D. The analysis of protein structures to determine gene expression levels.

---

**02.** The molecular clock …
- A. … works perfectly in all evolutionary scenarios.
- B. … has never been observed to work in any case.
- **C. … in some cases, it can provide a reasonable approximation of evolutionary time. ✓**
- D. … what time is it again?

---

**03.** Phylogenetic trees are — *choose the wrong one:*
- A. hypotheses on the past.
- B. a representation of evolutionary histories.
- **C. direct observations of speciation events. ✓**
- D. tools to study the relationships among organisms.

---

**04.** Which is *not* a branch support metric?
- A. Concordance Factors (geneCFs or sitesCFs)
- B. Bootstrap
- C. Jackknife
- **D. Metropolis-Hastings ✓**

---

**05.** In Bayesian inference the burn-in is …
- **A. the initial portion of the MCMC chain that is discarded before convergence is reached. ✓**
- B. a count of all trees not included in a bootstrap consensus due to instability in topology estimates.
- C. an estimate of the proportion of missing or ambiguous positions in a sequence alignment matrix.
- D. a correction factor used when substitution rates vary among sites.

---

**07.** An outgroup is:
- A. a species included in the analysis that shares no single gene with the others.
- **B. a taxon known to fall outside the group of interest, used to root the tree. ✓**
- C. a randomly chosen species to test model robustness.
- D. a taxon used to calibrate molecular clocks using fossil data.

---

**08.** The root of a phylogenetic tree is:
- A. the specific location where two species happen to share identical DNA sequences across all loci.
- B. the most recently evolved lineage in the tree.
- **C. the node representing the most recent common ancestor of all taxa in the tree. ✓**
- D. a terminal branch that points to a species no longer existing, inferred from fossil evidence alone.

---

**09.** What is a 1-to-1 (single-copy) orthogroup?
- A. A collection of genes uniquely present in only one species and absent in all others across the dataset.
- **B. A group of orthologous genes where each species contributes exactly one gene copy. ✓**
- C. A set of duplicated genes within a single genome.
- D. A set of genes showing similar transcription levels across various tissue types in one organism.

---

**10.** Which of the following is a desirable characteristic of a trait used in phylogenetic analysis?
- A. It varies randomly within species.
- **B. It is heritable and varies among species. ✓**
- C. It is beautiful!
- D. It is only found in one individual.

---

**11.** In an Mk model for discrete character evolution, what does the "M" stand for?
- A. Mutation.
- B. Maximum likelihood.
- **C. Markov process. ✓**
- D. Matrix-based model.

---

**12.** Which is *not* a perturbation approach?
- A. Nearest Neighbor Interchange.
- **B. Metropolis-Hastings Criterion. ✓**
- C. Subtree Pruning and Regrafting.
- D. Tree Bisection and Reconnection.

---

**13.** A monophyletic group is also referred to as …
- **A. … a clade. ✓**
- B. … a stem.
- C. … a twig.
- D. … a root.

---

**14.** Which of the following best describes the primary advantage of using a mixture model in phylogenetics?
- A. They assume all sites evolve under a single model.
- **B. They allow for the combination of multiple components to better account for heterogeneity. ✓**
- C. They are used exclusively for estimating divergence times.
- D. Sites are *a priori* assigned exclusively to a single substitution model.

---

**15.** What is Incomplete Lineage Sorting (ILS) in phylogenetic analysis?
- A. A phenomenon that occurs when the gene tree matches the species tree exactly, without any conflict.
- **B. Ancestral polymorphisms persist across speciation, and alleles sort into descendant lineages erratically. ✓**
- C. It occurs when there is no genetic variation between species in a particular gene.
- D. It is the phenomenon where all genes evolve at the same rate across all lineages.

---

**16.** What is a likely effect of systematic biases in phylogenomics?
- A. They are eliminated simply by adding more data.
- **B. They persist as long as model assumptions are violated, regardless of the amount of data used. ✓**
- C. They only affect small datasets, not large ones.
- D. They are easily addressed by using a large number of parametric bootstrap replicates.

---

**17.** In phylogenetics the gamma distribution is often used to:
- **A. model among-site variation. ✓**
- B. align sequences.
- C. be a component of the Metropolis-Hastings algorithm.
- D. estimate branch lengths in nucleotide substitution models.

---

**18.** Which is *not* a synonym of the others?
- A. Bipartition
- **B. Taxon ✓**
- C. Split
- D. Node

---

**20.** What is a potential limitation of concatenation in phylogenetics?
- A. It cannot handle protein sequences.
- **B. It assumes that all genes evolved under the same tree, ignoring gene tree discordance. ✓**
- C. It is only used for mitochondrial genomes.
- D. It removes informative sites from alignments.

---

**23.** A quartet is:
- A. a group of four genes duplicated within the same genome.
- **B. a minimal unrooted phylogeny showing one of the three possible relationships among four taxa. ✓**
- C. a group of four species collaborating closely, often in harmony but not always in agreement.
- D. a group of four species that share a common phenotype, unique to them.

---

**27.** Homoplasy refers to:
- A. similarity caused by shared ancestry and inherited from a common ancestor.
- B. a trait that is uniquely passed down from the last universal common ancestor without any modification.
- **C. similarity that evolved independently in different lineages due to convergent evolution. ✓**
- D. the duplication of a gene that leads to identical traits in unrelated species.

---

**To align a gene you use:**
- A. IQ-TREE
- B. ASTRAL
- C. Gblocks
- **D. MAFFT ✓**

---

## Fill in the Blank

**06.** In codon-based models of molecular evolution, dN represents the rate of **nonsynonymous** substitutions, while dS represents the rate of **synonymous** substitutions. The ratio dN/dS is used to infer the action of **natural selection** on protein-coding genes.

**19.** Sequence saturation occurs when multiple **substitutions** happen at the same site, making it hard to infer the true number of **differences (evolutionary changes)** between sequences.

**21.** In phylogenetic comparative methods, Brownian Motion (BM) models assume that traits evolve by random **drift** over time, while Ornstein-Uhlenbeck (OU) models add the effect of **stabilizing selection**, pulling traits toward an optimal value.

**22.** Approaches like PIC and PGLS are used to account for the fact that species are not **statistically independent** from each other, because they share some common **ancestry (evolutionary history)**.

**24.** The Markov property in substitution models states that the probability of a nucleotide changing from one state to another depends only on its **current** state, not on its **past** one.

**25.** In phylogenetic analysis, a site is considered parsimony-informative if it contains at least **two** different character states, each represented in at least **two** sequences.

**26.** Paralogous genes arise from gene **duplication** events, while orthologous genes arise from gene **speciation** events.

---

## Open Questions

**Q1.** Briefly explain what an orthogroup is and how it relates to the concept of orthology. Also, what is a 1-to-1 orthogroup?

**Q2.** Explain what is the input for the ASTRAL software(s) and which software can be used to generate it.

**Q3.** Define what we mean by character-based and distance-based methods in phylogenetics.
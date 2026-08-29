import type { Subject } from "./types";

export const CSE_SUBJECTS: Subject[] = [
  {
    id: "dm", name: "Discrete Mathematics", weight: "7.4%", color: "#6c63ff",
    dates: "Feb 9 – Feb 25, 2026", start: "2026-02-09", end: "2026-02-25",
    topics: [
      { id: "dm1", name: "Sets, Relations & Functions", imp: "high" },
      { id: "dm2", name: "Propositional Logic & Predicate Logic", imp: "high" },
      { id: "dm3", name: "Combinatorics — Permutations & Combinations", imp: "high" },
      { id: "dm4", name: "Pigeonhole Principle", imp: "med" },
      { id: "dm5", name: "Principle of Inclusion-Exclusion", imp: "med" },
      { id: "dm6", name: "Recurrence Relations", imp: "high" },
      { id: "dm7", name: "Generating Functions", imp: "med" },
      { id: "dm8", name: "Graph Theory — Basic Definitions", imp: "high" },
      { id: "dm9", name: "Trees — Spanning Trees, MST", imp: "high" },
      { id: "dm10", name: "Planar Graphs & Graph Colouring", imp: "med" },
      { id: "dm11", name: "Euler & Hamiltonian Paths", imp: "med" },
      { id: "dm12", name: "Group Theory & Lattices", imp: "low" },
    ]
  },
  {
    id: "dbms", name: "Database Management Systems", weight: "7.7%", color: "#00d4a0",
    dates: "Feb 26 – Mar 15, 2026", start: "2026-02-26", end: "2026-03-15",
    topics: [
      { id: "db1", name: "ER Model & ER to Relational Mapping", imp: "high" },
      { id: "db2", name: "Relational Algebra & Calculus", imp: "high" },
      { id: "db3", name: "SQL — Queries, Joins, Subqueries", imp: "high" },
      { id: "db4", name: "Normalisation — 1NF, 2NF, 3NF, BCNF", imp: "high" },
      { id: "db5", name: "Functional Dependencies & Closure", imp: "high" },
      { id: "db6", name: "Transactions & ACID Properties", imp: "med" },
      { id: "db7", name: "Concurrency Control — 2PL, Timestamp", imp: "med" },
      { id: "db8", name: "Indexing — B+ Trees, Hashing", imp: "high" },
      { id: "db9", name: "File Organisation", imp: "low" },
    ]
  },
  {
    id: "de", name: "Digital Electronics", weight: "5.8%", color: "#f5a623",
    dates: "Mar 16 – Mar 29, 2026", start: "2026-03-16", end: "2026-03-29",
    topics: [
      { id: "de1", name: "Boolean Algebra & Minimization (K-Map)", imp: "high" },
      { id: "de2", name: "Logic Gates & Combinational Circuits", imp: "high" },
      { id: "de3", name: "Multiplexers, Decoders, Adders", imp: "high" },
      { id: "de4", name: "Sequential Circuits — Flip-Flops", imp: "high" },
      { id: "de5", name: "Counters & Shift Registers", imp: "med" },
      { id: "de6", name: "Number Systems & Codes", imp: "med" },
    ]
  },
  {
    id: "co", name: "Computer Architecture", weight: "8.1%", color: "#ff5c5c",
    dates: "Mar 30 – Apr 17, 2026", start: "2026-03-30", end: "2026-04-17",
    topics: [
      { id: "co1", name: "Machine Instructions & Addressing Modes", imp: "high" },
      { id: "co2", name: "ALU Design & Data Path", imp: "high" },
      { id: "co3", name: "Pipeline — Hazards & Forwarding", imp: "high" },
      { id: "co4", name: "Cache Memory — Mapping, Replacement", imp: "high" },
      { id: "co5", name: "Virtual Memory & TLB", imp: "high" },
      { id: "co6", name: "I/O Interface & DMA", imp: "med" },
      { id: "co7", name: "RISC vs CISC", imp: "low" },
    ]
  },
  {
    id: "os", name: "Operating System", weight: "7.1%", color: "#a78bfa",
    dates: "Apr 18 – May 4, 2026", start: "2026-04-18", end: "2026-05-04",
    topics: [
      { id: "os1", name: "Process Management & PCB", imp: "high" },
      { id: "os2", name: "CPU Scheduling Algorithms", imp: "high" },
      { id: "os3", name: "Process Synchronisation — Mutex, Semaphore", imp: "high" },
      { id: "os4", name: "Deadlock — Detection, Prevention, Avoidance", imp: "high" },
      { id: "os5", name: "Memory Management — Paging, Segmentation", imp: "high" },
      { id: "os6", name: "Page Replacement Algorithms", imp: "high" },
      { id: "os7", name: "File Systems & Directory Structure", imp: "med" },
      { id: "os8", name: "Disk Scheduling", imp: "med" },
    ]
  },
  {
    id: "cl", name: "C Language", weight: "4.7%", color: "#34d399",
    dates: "May 5 – May 15, 2026", start: "2026-05-05", end: "2026-05-15",
    topics: [
      { id: "cl1", name: "Pointers & Memory Management", imp: "high" },
      { id: "cl2", name: "Structures & Unions", imp: "med" },
      { id: "cl3", name: "Recursion & Functions", imp: "high" },
      { id: "cl4", name: "Arrays & Strings", imp: "high" },
      { id: "cl5", name: "File I/O in C", imp: "low" },
    ]
  },
  {
    id: "ds", name: "Data Structures", weight: "7.6%", color: "#60a5fa",
    dates: "May 16 – Jun 2, 2026", start: "2026-05-16", end: "2026-06-02",
    topics: [
      { id: "ds1", name: "Arrays, Linked Lists, Stacks, Queues", imp: "high" },
      { id: "ds2", name: "Binary Trees & BST Operations", imp: "high" },
      { id: "ds3", name: "AVL Trees & Red-Black Trees", imp: "high" },
      { id: "ds4", name: "Heaps & Priority Queues", imp: "high" },
      { id: "ds5", name: "Hashing — Chaining, Open Addressing", imp: "high" },
      { id: "ds6", name: "Graph Representations", imp: "med" },
    ]
  },
  {
    id: "algo", name: "Algorithms", weight: "6.4%", color: "#f59e0b",
    dates: "Jun 3 – Jun 17, 2026", start: "2026-06-03", end: "2026-06-17",
    topics: [
      { id: "al1", name: "Asymptotic Analysis — Big O, Theta, Omega", imp: "high" },
      { id: "al2", name: "Sorting Algorithms & Complexity", imp: "high" },
      { id: "al3", name: "Divide & Conquer — Merge Sort, Quick Sort", imp: "high" },
      { id: "al4", name: "Recurrence Relations — Master Theorem", imp: "high" },
      { id: "al5", name: "Dynamic Programming — Memoisation", imp: "high" },
      { id: "al6", name: "Classic DP Problems (LCS, Knapsack, MCM)", imp: "high" },
      { id: "al7", name: "Greedy Algorithms — Activity Selection, Huffman", imp: "high" },
      { id: "al8", name: "Graph Algorithms — BFS, DFS", imp: "high" },
      { id: "al9", name: "Shortest Path — Dijkstra, Bellman-Ford", imp: "high" },
      { id: "al10", name: "Minimum Spanning Tree — Kruskal, Prim", imp: "high" },
      { id: "al11", name: "String Matching — KMP, Rabin-Karp", imp: "med" },
      { id: "al12", name: "NP-Completeness & Reductions", imp: "med" },
    ]
  },
  {
    id: "cn", name: "Computer Networks", weight: "9.2%", color: "#f472b6",
    dates: "Jun 18 – Jul 9, 2026", start: "2026-06-18", end: "2026-07-09",
    topics: [
      { id: "cn1", name: "OSI & TCP/IP Layers", imp: "high" },
      { id: "cn2", name: "Data Link Layer — Framing, Error Control", imp: "high" },
      { id: "cn3", name: "MAC Protocols — CSMA/CD, ALOHA", imp: "high" },
      { id: "cn4", name: "Network Layer — IP Addressing, Subnetting", imp: "high" },
      { id: "cn5", name: "Routing Algorithms — RIP, OSPF, BGP", imp: "high" },
      { id: "cn6", name: "Transport Layer — TCP vs UDP", imp: "high" },
      { id: "cn7", name: "TCP Congestion & Flow Control", imp: "high" },
      { id: "cn8", name: "Application Layer — DNS, HTTP, FTP", imp: "med" },
      { id: "cn9", name: "Socket Programming Concepts", imp: "low" },
    ]
  },
  {
    id: "toc", name: "Theory of Computation", weight: "8.3%", color: "#818cf8",
    dates: "Jul 10 – Jul 28, 2026", start: "2026-07-10", end: "2026-07-28",
    topics: [
      { id: "tc1", name: "DFA & NFA — Construction, Conversion", imp: "high" },
      { id: "tc2", name: "Regular Expressions & Pumping Lemma", imp: "high" },
      { id: "tc3", name: "Context-Free Grammars & Parse Trees", imp: "high" },
      { id: "tc4", name: "PDA — Deterministic & Non-deterministic", imp: "high" },
      { id: "tc5", name: "Turing Machine — Variants", imp: "high" },
      { id: "tc6", name: "Decidability & Undecidability", imp: "high" },
      { id: "tc7", name: "Halting Problem & Rice's Theorem", imp: "med" },
    ]
  },
  {
    id: "cd", name: "Compiler Design", weight: "4.1%", color: "#fb923c",
    dates: "Jul 29 – Aug 7, 2026", start: "2026-07-29", end: "2026-08-07",
    topics: [
      { id: "cd1", name: "Lexical Analysis — Tokens, Lexer", imp: "med" },
      { id: "cd2", name: "Parsing — LL(1), LR(0), SLR, LALR", imp: "high" },
      { id: "cd3", name: "Syntax Directed Translation", imp: "high" },
      { id: "cd4", name: "Intermediate Code Generation", imp: "med" },
      { id: "cd5", name: "Symbol Table & Scope", imp: "low" },
      { id: "cd6", name: "Code Optimisation Techniques", imp: "low" },
    ]
  },
  {
    id: "em", name: "Engineering Mathematics", weight: "8.6%", color: "#2dd4bf",
    dates: "Aug 8 – Aug 27, 2026", start: "2026-08-08", end: "2026-08-27",
    topics: [
      { id: "em1", name: "Linear Algebra — Matrix, Eigenvalues", imp: "high" },
      { id: "em2", name: "Calculus — Limits, Derivatives, Integration", imp: "high" },
      { id: "em3", name: "Probability — Distributions, Bayes' Theorem", imp: "high" },
      { id: "em4", name: "Statistics — Mean, Variance, Standard Deviation", imp: "med" },
      { id: "em5", name: "Differential Equations", imp: "med" },
      { id: "em6", name: "Numerical Methods", imp: "low" },
    ]
  },
  {
    id: "ga", name: "General Aptitude", weight: "10.0%", color: "#4ade80",
    dates: "Aug 28 – Sep 19, 2026", start: "2026-08-28", end: "2026-09-19",
    topics: [
      { id: "ga1", name: "Number System & Arithmetic", imp: "high" },
      { id: "ga2", name: "Ratio, Proportion & Percentage", imp: "high" },
      { id: "ga3", name: "Time, Work, Speed & Distance", imp: "high" },
      { id: "ga4", name: "Logical Reasoning — Sequences, Puzzles", imp: "high" },
      { id: "ga5", name: "Verbal Analogies & Sentence Completion", imp: "high" },
      { id: "ga6", name: "Critical Reasoning", imp: "med" },
      { id: "ga7", name: "Data Interpretation", imp: "med" },
    ]
  },
  {
    id: "en", name: "English (Verbal)", weight: "5.0%", color: "#e879f9",
    dates: "Sep 20 – Sep 30, 2026", start: "2026-09-20", end: "2026-09-30",
    topics: [
      { id: "en1", name: "Reading Comprehension", imp: "high" },
      { id: "en2", name: "Vocabulary & Synonyms/Antonyms", imp: "med" },
      { id: "en3", name: "Grammar & Error Correction", imp: "med" },
      { id: "en4", name: "Sentence Ordering & Para Jumbles", imp: "high" },
    ]
  },
];

# files
*how snippets are organised in the file system*

A snippet about feature `A` is stored in `A.md`. If we create a sub-feature `B` of the original feature `A`, it is stored in `A/B.md`. If we create a new sub-feature `C` of the new feature `A/B`, it is stored in `A/B/C.md`. This keeps all pathnames concise and easy to read.

Any meta-information about the feature `A/B/C` (such as conversations, notes, pseudocode, tests, code snippets, or runnable code) is stored in the folder `A/B/.C` (also called the *metafolder*).

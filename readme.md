ᕦ(ツ)ᕤ
# miso

`miso` is an experiment in agent-based coding that tackles a common problem with vibe-coded projects - maintainability.

In conventional vibe-coding workflows, a conversation between a user and agent results in some running code, and the conversation is then thrown away. This later makes it harder for a user to modify the code at a fine level of detail, because it's harder to isolate the precise part of the code.

`miso` introduces the concept of *feature-modular specification* - a tree of short markdown documents called *snippets*, that document the system from the topmost level (its purpose) down to the finest level of detail. Each snippet adds detail to its parent, while remaining short enough (100-300 words) to be read quickly by users, and to fit easily into LLM contexts.

The `miso` agent workflow aims to preserve this feature-modular specification as the actual "source of truth" for the system. Ideally, it should contain enough information to allow an agent to completely regenerate the code in any language or languages, or on any platform.

It should also be possible to 'lift' legacy software into this feature-modular form, enabling a range of useful capabilities (such as automatically porting code from one platform to another).
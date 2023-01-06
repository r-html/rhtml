This file is with purpose to replace original file inside `node_modules/@apollo/client/link/core/types.d.ts`
Fixes bug with not transpiling package due to newer version of graphql >15 which has 2 generic arguments but instead older one has one generic argument
TODO delete this after migration to newer graphql version
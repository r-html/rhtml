dev:
	mode=dev deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=importmap.json --unstable -c tsconfig.json index.ts

start: 
	deno run --no-check --allow-net --allow-read --allow-env --allow-run --allow-write --import-map=importmap.json --unstable -c tsconfig.json index.ts

cache:
	deno cache --reload --no-check -c tsconfig.json index.ts
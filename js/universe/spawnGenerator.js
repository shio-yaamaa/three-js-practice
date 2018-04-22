// Plural form ga hoshii!!

function* assetMaker(mamuka, mumu, mamukaProportion) {
  const mamukaGenerator = mamukaMaker(mamuka);
  const mumuGenerator = mumuMaker(mumu)
  while (true) {
    yield Math.random() < mamukaProportion
      ? mamukaGenerator.next().value
      : mumuGenerator.next().value;
  }
}

function* mamukaMaker(mamuka) {
	let nextIndex = 0;
	while (true) {
		yield mamuka[nextIndex++ % mamuka.length];
	}
}

function* mumuMaker(mumu) {
  let nextIndex = 0;
  while (true) {
    yield mumu[nextIndex++ % mumu.length];
  }
}

const assetGenerator = assetMaker(data.mamuka, data.mumu, 0.2);
for (let i = 0; i < 20; i++) {
  console.log(assetGenerator.next().value.name);
}
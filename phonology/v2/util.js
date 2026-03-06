function hasRepeat(arr) {
	const unique = [...new Set(arr)];
	return unique.length !== arr.length;
}

function choice(items, weights) {
	if (!weights) weights = Array(items.length).fill(1);
	if (weights.length != items.length) {
		weights = Array(items.length).fill(1);
		weights.unshift(...weights);
		weights.length = items.length;
	}

	const cw = weights.reduce((acc, weight, i) => {
		acc.push((acc[i - 1] || 0) + weight);
		return acc;
	}, []);

	const total = cw[cw.length - 1];
	const rand = Math.random() * total;

	for (let i = 0; i < cw.length; i++) {
		if (rand < cw[i]) return items[i];
	}
}

function counts(arr) {
	return arr.reduce((acc, x) => {
		acc[x] = (acc[x] || 0) + 1;
		return acc;
	}, {});
}

function comb(options) {
	const results = [];
	
	function rec(i, c) {
		if (i === options.length) {
			results.push([...c].join(''));
			return;
		}
		rec(i + 1, c);
		c.push(options[i]);
		rec(i + 1, c);
		c.pop();
	}

	rec(0, []);
	return [... new Set(results)];
}
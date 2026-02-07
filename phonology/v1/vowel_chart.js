const DEFAULT_SETTINGS = {
	centralLowVowel: true,
	layout: 'trapezoid',
	size: 32,
}

const IPA_VOWELS = {
	'i': [1, 0.0, 0.0],
	'y': [1, 0.0, 0.0],
	'e': [2, 0.0, 1.0],
	'ø': [2, 0.0, 1.0],
	'ɛ': [3, 0.0, 2.0],
	'œ': [3, 0.0, 2.0],
	'a': [4, 0.0, 3.0],
	'ɶ': [4, 0.0, 3.0],
	'ɑ': [5, 2.0, 3.0],
	'ɒ': [5, 2.0, 3.0],
	'ɔ': [6, 2.0, 2.0],
	'ʌ': [6, 2.0, 2.0],
	'o': [7, 2.0, 1.0],
	'ɤ': [7, 2.0, 1.0],
	'u': [8, 2.0, 0.0],
	'ɯ': [8, 2.0, 0.0],
	'ɨ': [9, 1.0, 0.0],
	'ʉ': [9, 1.0, 0.0],
	'ɘ': [10, 1.0, 1.0],
	'ɵ': [10, 1.0, 1.0],
	'ə': [11, 1.0, 1.5],
	'ɞ': [12, 1.0, 2.0],
	'ɜ': [12, 1.0, 2.0],
	'ɪ': [13, 0.5, 0.5],
	'ʏ': [13, 0.5, 0.5],
	'ʊ': [14, 1.5, 0.5],
	'ɐ': [15, 1.0, 2.5],
	'æ': [16, 0.0, 2.5],
}

const IPA_VOWELS_CENTRAL_A = {
	...IPA_VOWELS,
	'a': [17, 1.0, 3.0],
	'æ': [4, 0.0, 3.0],
}

const IPA_VOWELS_TRIANGLE = {
	...IPA_VOWELS,
	'a': [17, 1.0, 3.0],
	'æ': [4, 0.0, 2.5],
	'ɶ': [4, 0.0, 2.5],
	'ɑ': [5, 2.0, 2.5],
	'ɒ': [5, 2.0, 2.5],
}

const IPA_VOWELS_FORMANT = {
	'i': [1 , 0.0 , 0.0],
	'e': [2 , 0.0 , 1.0],
	'ɛ': [3 , 0.0 , 2.0],
	'a': [4 , 0.0 , 3.0],
	'ɑ': [5 , 2.0 , 3.0],
	'ɔ': [6 , 2.0 , 2.0],
	'o': [7 , 2.0 , 1.0],
	'u': [8 , 2.0 , 0.0],
	'ɯ': [9 , 1.33, 0.0],
	'ɨ': [9 , 1.33, 0.0],
	'ɤ': [10, 1.33, 1.0],
	'ɵ': [10, 1.33, 1.0],
	'ə': [11, 1.0 , 1.5],
	'ʌ': [12, 1.33, 2.0],
	'ɞ': [12, 1.33, 2.0],
	'ɪ': [13, 0.33, 0.5],
	'ʏ': [13, 0.33, 0.5],
	'ʊ': [14, 1.66, 0.5],
	'ɐ': [15, 1.0 , 2.5],
	'æ': [16, 0.0 , 2.5],
	'ɶ': [16, 0.0 , 2.5],
	'y': [18, 0.66, 0.0],
	'ɘ': [19, 0.66, 1.0],
	'ø': [19, 0.66, 1.0],
	'œ': [20, 0.66, 2.0],
	'ɜ': [20, 0.66, 2.0],
	'ʉ': [21, 1.0 , 0.5],
	'ɒ': [22, 2.0 , 2.5],
}

const HEIGHT_KEYWORDS = [
	['near high', 0.5],
	['high mid', 1],
	['low mid', 2],
	['near low', 2.5],
	['high', 0],
	['low', 3],
	['near close', 0.5],
	['close mid', 1],
	['open mid', 2],
	['near open', 2.5],
	['close', 0],
	['open', 3],
	['mid', 1.5],
]

const BACKNESS_KEYWORDS = [
	['near front', 0.5],
	['near back', 1.5],
	['front', 0],
	['central', 1],
	['back', 2],
]

function getCardinalLayout(settings) {
	if (settings.layout === 'triangle')
		return IPA_VOWELS_TRIANGLE;

	if (settings.layout === 'formant')
		return IPA_VOWELS_FORMANT;

	return settings.centralLowVowel ? IPA_VOWELS_CENTRAL_A : IPA_VOWELS;
}

function keywords(position, settings) {
	position = position.toLowerCase().replace(/-/g, ' ');
	let x = 1, y = 1.5;
	for (const kw of HEIGHT_KEYWORDS) {
		if (position.includes(kw[0])) {
			y = kw[1];
			break;
		}
	}
	for (const kw of BACKNESS_KEYWORDS) {
		if (position.includes(kw[0])) {
			x = kw[1];
			break;
		}
	}

	return {x, y};
}

function getPosition(position, settings) {
	if (position[0] == '(' && position.includes(',')) {
		const axis = position.slice(1, -1).split(',');
		return {x: parseFloat(axis[0]?.trim()||'0'), y: parseFloat(axis[1]?.trim()||'0')};
	}

	if (position[0] == '[') {
		const decomposed = position.slice(1, -1).normalize("NFD");

		const chart = getCardinalLayout(settings);

		const vowel = chart[decomposed[0]??''];
		if (!vowel) return null;

		return {label: decomposed, cardinal: vowel[0], x: vowel[1], y: vowel[2]};
	}

	return keywords(position, settings);
}

function parse(source, settings=DEFAULT_SETTINGS, error) {
	let end = 0;
	const vowels = [];

	const lines = source.split('\n');
	for (const line of lines) {
		if (line.trim() == '') { end++; continue; }
		if (line[0] == ';') { end++; continue; }

		const layoutMatch = line.match(/^layout (\w+)/m);
		if (layoutMatch) {
			end++;
			settings.layout = layoutMatch[1]?.toLowerCase()??'trapezoid';
			continue;
		}

		const configMatch = line.match(/^config ([\w-]+) (.*)/);
		if (configMatch && configMatch[1]) {
			end++;
			//@ts-ignore Oh please
			settings[configMatch[1]] = JSON.parse(configMatch[2]);
			continue;
		}

		const match = line.match(/^add\s+(?:(?:dot\s+)?(left|right))?\s*(\[[^\]]+\]|\([^)]+\)|[^"]+)\s*(?:"([^"]*)")?/m);
		if (!match) { break; }

		end++;

		const dot = match[1]??'middle';
		const position = getPosition(match[2]??'', settings);
		let label = match[3];

		if (!position) {
			error(`Error rendering line ‘${line}’`);
			continue;
		}

		if (label === undefined) {
			if (!position.label) {
				error(`Error rendering line ‘${line}’: Missing label`);
				continue;
			}
			label = position.label;
		}

		vowels.push({label, x: position.x, y: position.y, dot});
	}

	const positionMap = {};

	lines.slice(end).join(' ').split(/\s+/g)
		.forEach(v => {
			if (!v.trim()) return;
			const p = getPosition(`[${v}]`, settings);
			if (!p || !p.cardinal) {
				error(`Error rendering vowel ‘${v}’`);
				return;
			}
			const cardinal = positionMap[p.cardinal];
			if (cardinal) {
				cardinal.text.push(v);
			} else {
				positionMap[p.cardinal] = {x: p.x, y: p.y, text:[v]};
			}
		});

	for (const cardinal in positionMap) {
		const v = positionMap[cardinal];
		vowels.push({label: v.text.join(' '), x: v.x, y: v.y, dot: 'middle'});
	}

	return vowels;
}


function trapezoidChartCoord(x, y) {
	x = x * ((6-y)/3);
	return [x+(2*y/3), y];
}

function triangleChartCoord(x, y) {
	x = x * 2* ((3-y)/3);
	return [x+(2*y/3), y];
}

function squareChartCoord(x, y) {
	return [x*2, y];
}

function formantChartCoord(x, y) {
	const nx = 1 - (x/2)*0.2;
	y = y*nx;
	x = x * 2* ((3-y)/3);
	return [x+(2*y/3), y];
}

const layoutFunction = {
	'square': squareChartCoord,
	'trapezoid': trapezoidChartCoord,
	'triangle': triangleChartCoord,
	'formant': formantChartCoord,
}

function drawSVG(svg, layout, size) {
	svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	svg.setAttribute('width', (size*4+64)+'px');
	svg.setAttribute('height', (size*3+32)+'px');
	svg.setAttribute('viewBox', `0 0 ${64+4*size} ${32+3*size}`);
	svg.setAttribute('aria-label', 'Vowel diagram');
	svg.setAttribute('class', 'vowel-chart-svg');

	let line = (x1,y1,x2,y2) => {
		const l = document.createElement("line");
		l.setAttribute('x1', String(x1));
		l.setAttribute('y1', String(y1));
		l.setAttribute('x2', String(x2));
		l.setAttribute('y2', String(y2));
		svg.appendChild(l);
	};

	const polygon = document.createElement("polygon");
	polygon.setAttribute("fill", `transparent`);
	svg.appendChild(polygon);

	if (layout == 'square') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+0*size},${16+3*size}`);
		line(32+2*size,16,32+2*size,16+3*size);
		line(32+4*size,16+1*size,32,16+1*size);
		line(32+4*size,16+2*size,32,16+2*size);
	} else if (layout == 'triangle') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+2*size},${16+3*size}`);
		line(32+2*size,16,32+2*size,16+3*size);
		line(32+3.33*size,16+1*size,32+0.66*size,16+1*size);
		line(32+2.69*size,16+2*size,32+1.32*size,16+2*size);
	} else if (layout == 'formant') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+2*size},${16+3*size}`);
		line(32+1.33*size,16,32+2*size,16+3*size);
		line(32+2.66*size,16,32+2*size,16+3*size);
		line(32+3.46*size,16+0.8*size,32+0.66*size,16+1*size);
		line(32+2.93*size,16+1.6*size,32+1.32*size,16+2*size);
	} else {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+2*size},${16+3*size}`);
		line(32+2*size,16,32+3*size,16+3*size);
		line(32+4*size,16+1*size,32+0.66*size,16+1*size);
		line(32+4*size,16+2*size,32+1.32*size,16+2*size);
	}
}

const renderVowels = (vowels, settings=DEFAULT_SETTINGS) => {
	settings.size = Number(settings.size) || DEFAULT_SETTINGS.size;
	settings.layout = settings.layout.toLowerCase();

	const positionFunc = layoutFunction[settings.layout] ?? trapezoidChartCoord;

	const container = document.createElement('div');
	container.setAttribute('class', 'vowel-chart-container');

	// const svgEl = document.createElement("svg");
	const svgEl = document.createElement("svg");
	container.appendChild(svgEl);
	const textFloat = document.createElement('div');
	textFloat.setAttribute('class', 'vowel-chart-text-float-container');
	container.appendChild(textFloat);


	for (const vowel of vowels) {
		const [x, y] = positionFunc(vowel.x, vowel.y);

		if (vowel.dot!='middle') {
			const dotEl = document.createElement('span');
			dotEl.setAttribute('class', 'vowel-chart-text-dot');
			dotEl.setAttribute('style', `left: ${(x*settings.size+32)-3}px; top: ${(y*settings.size+16)-3}px;`);
			textFloat.appendChild(dotEl);
		}
		const text = document.createElement('span');
		text.setAttribute('class', 'vowel-chart-text-float '+vowel.dot);
		text.setAttribute('style', `left: ${(x*settings.size+32)+(vowel.dot=='left'?-4:vowel.dot=='right'?4:0)}px; top: ${(y*settings.size+16)}px;`);
		text.innerText = vowel.label;
		textFloat.appendChild(text);
	}

	drawSVG(svgEl, settings.layout.toLowerCase(), settings.size);

	return container.outerHTML;
};
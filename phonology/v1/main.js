
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

function removeVoice(x) {
	return x.replace(/[+-](voice|spread)/g, '');
}

function removePlace(x) {
	return x.replace(/\*(lab|cor|vel|vlb|pal|plv|uvu|ulb|ant|epi|glt|dnt)\b|\+labiodental/g, '');
}

const VOWEL_ELEMENT_A = {
	'Ā': 'a',
	'Ī': 'i',
	'Ū': 'u',
	'AI': 'ɛ',
	'AU': 'ɔ',
	'AĪ': 'e',
	'AŪ': 'o',
	'': 'ɨ',
	'ŪI': 'y',
	'AŪI': 'ø',
	'AUI': 'œ',
	'ĀI': 'æ',
	'ĀU': 'ɑ',
	'A': 'ə',
	'I': 'ɪ',
	'UI': 'ʏ',
	'U': 'ʊ',
}

/*
Single Head
+-4----------------
5 Ī   ĪU   IŪ   Ū
| I   IU   _    U
| AĪ  AĪU  AIŪ  AŪ
| AI  AIU  A    AU
| ĀI  ĀIU  Ā    ĀU

+-4----------------
5 I;I   I;IU        U;U
|  ;I    ;IU    ;    ;U
| I;AI  I;AIU       U;AU
|  ;AI   ;AIU   ;A   ;AU
| A;AI  A:AIU  A;A  A;AU

*/

const BASE_VOWELS = [
	/*'T3':  */ ['a', 'i',           'u'],
	/*'S4':  */ ['a', 'i', 'e',      'u'],
	/*'T4':  */ ['a', 'i', 'ə',      'u'],
	// /*'T4a': */ ['a', 'i', 'ə',      'o'],
	// /*'T4b': */ ['a', 'i', 'ə',      'e'],
	/*'T4c': */ ['a', 'i', 'o',      'u'],
	/*'T4d': */ ['a', 'i', 'e',      'o'],
	/*'T5':  */ ['a', 'i', 'e', 'o', 'u'],
	/*'S5':  */ ['ɑ', 'i', 'æ', 'ə', 'u'],
	/*'T6':  */ ['a', 'i', 'e', 'o', 'u', 'ɨ'],
	/*'T6':  */ ['a', 'i', 'e', 'o', 'u', 'ɯ'],
	/*       */ ['a', 'i', 'e', 'o', 'u', 'ə'],
	/*'T6a': */ ['a', 'i', 'o', 'ə', 'u'],
	/*'T6b': */ ['a', 'i', 'e', 'ə', 'u'],
	/*'T6c': */ ['a', 'i', 'e', 'ə', 'o'],
	/*'T6C': */ ['a', 'i', 'e', 'o', 'u', 'ə', 'ɨ'],
	/*'S6':  */ ['ɑ', 'i', 'e', 'o', 'u', 'æ'],
	/*'T7':  */ ['a', 'i', 'e', 'o', 'u', 'ɔ', 'ɛ'],
	/*'T7':  */ ['a', 'i', 'e', 'o', 'u', 'ɔ', 'ɛ', 'ɨ'],
	/*'T5R': */ ['a', 'i', 'e', 'o', 'u', 'ø', 'y'],
	/*'S5R': */ ['ɑ', 'i', 'æ', 'ə', 'u', 'ɨ'],
	/*'T6R': */ ['a', 'i', 'e', 'o', 'u', 'ə', 'ø', 'y'],
	/*'S6R': */ ['ɑ', 'i', 'e', 'o', 'u', 'æ', 'ø', 'y'],
]


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

function generate_vowels() {
	let v = ['Ā','Ī','Ū']; // T3

	if (Math.random() < 0.8) {
		v.push('AI', 'AU'); // T5
		if (Math.random() < 0.5) {
			v.push('AĪ', 'AŪ'); // T7
		}
	}

	if (Math.random() < 0.25) {
		v = v.filter(x => x!='AU');
	} else if (Math.random() < 0.25) {
		v = v.filter(x => x!='AI');
	}

	let lowMid = false;
	let umlaut = v.length >= 4 && Math.random() < 0.25;
	let atr = v.length >= 3 && Math.random() < 0.15;

	// if (!atr && Math.random() < 0.5) {
	// 	lowMid = true;
	// 	v.push('ĀI');
	// 	if (Math.random() < 0.90) {
	// 		v.push('ĀU');
	// 		if (Math.random() < 0.30) v.push('A');
	// 	}
	// }

	// if (!atr && Math.random() < 0.5) {
	// 	if (!lowMid && Math.random() < 0.5) v.push('ĀI');
	// 	else v.push('ĀĪ');
	// }


	if (umlaut) {
		v = v.flatMap(x => x.includes('Ī') || x.includes('I') ? [x] : [x, x+'I'])

		console.log(v)

		if (Math.random() < 0.90) {
			v = v.filter(x => x!='ĀI');
			if (Math.random() < 0.30) {
				v = v.filter(x => x!='AUI');
				if (Math.random() < 0.30) v = v.filter(x => x!='AŪI');
			}
		}
	}

	if (atr) {
		v = v.flatMap(x => [x.replace('Ā','A').replace('Ī','I').replace('Ū','U'), x]);

		if (Math.random() < 0.70) v = v.filter(x => x!='A');
		if (Math.random() < 0.50) v = v.filter(x => x!='AI' && x!='AU');
		if (Math.random() < 0.50) {
			v = v.filter(x => x!='I' && x!='U');
			if (Math.random() < 0.90) v = v.filter(x => x!='IU');
		}
	}

	

	if (Math.random() < 0.10) {
		v.push('');
		if (v.length >= 5 && Math.random() < 0.20) v.push('A');
	}
	
	v = [...new Set(v)]

	let k = VOWEL_ELEMENT_A // Math.random() < 0.5 ? VOWEL_ELEMENT_A : VOWEL_ELEMENT_B;

	if (v.includes('I') && !v.includes('AĪ')) {
		k['I'] = 'e'
		k['IU'] = 'ø'
		k['U'] = 'o'
	}
	// else if (v.includes('A') && !v.includes('AI')) k = VOWEL_ELEMENT_B;

	if (v.includes('ĀI')) {
		k['Ā'] = 'ɑ'
	} else if (v.includes('AI') && !v.includes('AU') && Math.random() < 0.5) {
		k['Ā'] = 'ɑ'
		k['AI'] = 'æ'
	}

	// if (v.includes('A')) {
	// 	if (Math.random() < 0.5) {
	// 		k['A'] = 'ə'
	// 		k[''] = 'ɨ'
	// 	}

	// 	// if (atr) {
	// 	// 	k['Ā'] = 'æ'
	// 	// 	k['A'] = 'a'
	// 	// } else {
	// 	// 	k['Ā'] = 'a'
	// 	// 	k['A'] = 'ɑ'
	// 	// }
	// }

	if (!v.includes('A') && Math.random() < 0.5) k[''] = 'ə'

	console.log(v)

	return v.map(x => k[x]);
}

function generate_inventory() {
	const PLACE = ['*lab', '*cor', '~*rtr', '~*pal', '*vel'].filter(x => x[0] != '~' || Math.random() > 0.5).map(x=>x.replace('~',''));
	const MANNER = [ '-sonorant -nasal -fricative', '-sonorant -nasal +fricative', '-sonorant +nasal', ]
	const VOICE = [
		{'+fricative':['-voice'],         '-fricative':['-voice']},
		{'+fricative':['-voice'],         '-fricative':['-voice','+voice']},
		{'+fricative':['-voice','+voice'],'-fricative':['-voice']},
		{'+fricative':['-voice','+voice'],'-fricative':['-voice','+voice']},
		{'+fricative':['-voice'],         '-fricative':['-voice','+voice','-voice +spread']},
		{'+fricative':['-voice','+voice'],'-fricative':['-voice','+voice','-voice +spread']},
		{'+fricative':['-voice'],         '-fricative':['-voice','-voice +spread']},
		{'+fricative':['-voice'],         '-fricative':['-voice','-voice +ejective']},
		// {'+fricative':['-voice','+voice'],'-fricative':['-voice','-voice +ejective']},
		{'+fricative':['-voice'],         '-fricative':['-voice','+voice','-voice +ejective']},
		{'+fricative':['-voice','+voice'],'-fricative':['-voice','+voice','-voice +ejective']},
		// {'+fricative':['-voice'],         '-fricative':['-voice','+voice','-voice +spread','-voice +ejective']},
	][~~(Math.random()*10)];

	let cons = [];

	function remove(x) {
		cons = cons.filter(y => !y.includes(x));
	}

	function take(x) {
		return cons.filter(y => y.includes(x));
	}

	for (const p of PLACE)
	for (const m of MANNER) {
		const mx = m.match(/[+-]fricative/)?.[0];
		if (mx in VOICE && m.includes('-nasal')) {
			for (const v of VOICE[mx])
				cons.push(Seg(`${p} ${m} ${v}`))
		} else {
			cons.push(Seg(`${p} ${m}`))
		}
	}

	if (Math.random() < 0.8) {
		console.log('+ rhotic')
		cons.push(Seg(`*cor rhotic`));
		if (Math.random() < 0.5 && PLACE.includes('*rtr')) cons.push(Seg(`*rtr rhotic`));
	}
	if (Math.random() < 0.5) {
		console.log('+ lateral approximant')
		cons.push(Seg(`*cor +approx +lateral`));
		if (Math.random() < 0.5 && PLACE.includes('*pal')) cons.push(Seg(`*pal +approx +lateral`));
		if (Math.random() < 0.5 && PLACE.includes('*rtr')) cons.push(Seg(`*rtr +approx +lateral`));
	}

	if (PLACE.includes('*rtr')) {
		if (Math.random() > 0.8) {
			console.log('+ retroflex series')
		} else if (Math.random() < 0.5) {
			console.log('+ retroflex stops')
			cons = cons.filter(x => !(x.includes('*rtr +fricative')))
		} else {
			console.log('+ retroflex fricatives')
			cons = cons.filter(x => !(x.includes('*rtr') && !x.includes('+fricative')))
		}

		let count = take('*rtr').length;
		let lateral = take('*rtr +lateral').length;

		if (count < 4 || Math.random() < ( lateral ? 0.3 : 0.6)) {
			console.log('- retroflex nasal')
			remove("-sonorant +nasal *rtr")
		}
	}


	if (Math.random() < 0.5) {
		console.log('+ palatal approximant');
		cons.push(Seg(`*pal +approx`));

		if (!PLACE.includes('*pal') && Math.random() < 0.3) {
			console.log('+ palatal nasal');
			cons.push(Seg(`*pal +nasal -sonorant`));
		}
	}

	if (PLACE.includes('*pal') && Math.random() < 0.8) {
		PLACE.push('*plv')
		if (PLACE.includes('*rtr') || Math.random() > 0.8) {
			console.log('+ postalveolar series')
		} else if (Math.random() < 0.5) {
			console.log('+ postalveolar stops')
			cons = cons.filter(x => !(x.includes('*pal +fricative')))
		} else {
			console.log('+ postalveolar fricatives')
			cons = cons.filter(x => !(x.includes('*pal') && !x.includes('+fricative')))
		}
		cons = cons.map(x => x.includes('+approx') || x.includes('+nasal') ? x : Seg(x.replace('*pal', '*plv')))
		if (Math.random() < 0.5) {
			console.log('- palatal nasal');
			remove("-sonorant +nasal *pal");
		}
		if (Math.random() < 0.5) {
			console.log('- palatal lateral');
			remove("+lateral +approx *pal")
		}
	}

	if (Math.random() < 0.5) cons.push(Seg(`*glt -sonorant -nasal -fricative -voice`));
	if (Math.random() < 0.5) cons.push(Seg(`*glt +approx`));
	
	// cons = cons.map(Seg)

	const STOP_GAP = 0.4;
	const FRICATIVE_GAP = 0.6;
	// Whitin Manner Stop Gapping
	if (VOICE['-fricative'].includes('+voice')) {
		if (Math.random() < 0.5) {
			remove(choice([
				"+voice -sonorant -nasal -fricative *vel", //-g +k
				"-voice -sonorant -nasal -fricative *lab", //-p +b
				"+voice -sonorant -nasal -fricative *cor", //-d +t
				"+voice -sonorant -nasal -fricative *lab", //-b +p
			],[160,100,50,50]))
		}

		if (Math.random() < 0.5) remove("+voice -sonorant -nasal -fricative *pal"); //-ɟ +c //>affricate
		
		if (Math.random() < STOP_GAP/5) remove("+voice -sonorant -nasal -fricative *rtr"); //-ɖ +ʈ
		else if (Math.random() < STOP_GAP/3) remove("-voice -sonorant -nasal -fricative *rtr"); //-ʈ +ɖ
	}

	// Whitin Manner Fricative Gapping
	if (VOICE['+fricative'].length >= 2) {
		if (Math.random() < STOP_GAP) remove("+voice -sonorant -nasal +fricative *cor"); //+s -z
		if (Math.random() < STOP_GAP) remove("+voice -sonorant -nasal +fricative *plv"); //+s -ʒ
		
		if (Math.random() < STOP_GAP) remove("+voice -sonorant -nasal +fricative *lab"); //+f -v
		else if (Math.random() < STOP_GAP/3) remove("-voice -sonorant -nasal +fricative *lab"); //-f +v

		if (Math.random() < STOP_GAP) remove("+voice -sonorant -nasal +fricative *vel"); //+x -ɣ
		else if (Math.random() < STOP_GAP) remove("-voice -sonorant -nasal +fricative *vel"); //+ɣ -x

		if (Math.random() < STOP_GAP/3) remove("+voice -sonorant -nasal +fricative *pal"); //+ç -ʝ
		if (Math.random() < STOP_GAP/3) remove("+voice -sonorant -nasal +fricative *rtr"); //+ʂ -ʐ
	}

	if (Math.random() < FRICATIVE_GAP) remove("-voice -sonorant -nasal +fricative *vel"); //-x +k
	if (Math.random() < FRICATIVE_GAP/2) remove("-voice -sonorant -nasal +fricative *lab"); //-f +p
	if (Math.random() < FRICATIVE_GAP) remove("-voice -sonorant -nasal +fricative *pal"); //+c -ç
	if (VOICE['-fricative'].includes('+voice')) {
		if (Math.random() < FRICATIVE_GAP) remove("+voice -sonorant -nasal +fricative *vel"); //-ɣ +g
		if (Math.random() < FRICATIVE_GAP/2) remove("+voice -sonorant -nasal +fricative *pal"); //-ʝ +ɟ
		if (Math.random() < FRICATIVE_GAP/4) remove("+voice -sonorant -nasal +fricative *lab"); //-v +b
		if (Math.random() < FRICATIVE_GAP/2) remove("+voice -sonorant -nasal +fricative *plv"); //-ʒ +dʒ
	} else {
		if (Math.random() < FRICATIVE_GAP) remove("-voice -sonorant -nasal -fricative *plv"); //-tʃ
		if (Math.random() < FRICATIVE_GAP) remove("-voice -sonorant -nasal +fricative *plv"); //-ʃ
	}
	
	if (Math.random() < STOP_GAP) remove("-sonorant +nasal *vel"); //-ŋ
	
	if (take("+approx *pal")) remove("+voice -sonorant -nasal +fricative *pal"); //-ʝ < j
	if (take("-voice -sonorant -nasal +fricative *vel")) remove("-voice -sonorant -nasal +fricative *pal"); //-ç < x

	if (Math.random() < 0.5) {
		cons.push(Seg(`*vlb +approx`));

		if (Math.random() < 0.5) {
			const vellab = cons.filter(x => x.includes('*vel')).map(x => Seg(x.replace('*vel', '*vlb')))
			cons.push(...vellab)
			PLACE.push('*vlb')
		}

		if (Math.random() < 0.5) remove("-sonorant +nasal *vlb"); //-ŋʷ
		if (Math.random() < 0.3) remove("+voice -sonorant -fricative -nasal *vlb"); //-gʷ
		if (Math.random() < 0.3) remove("+spread -voice -sonorant -fricative -nasal *vlb"); //-kʷʰ
		if (Math.random() < 0.3) remove("+ejective -voice -sonorant -fricative -nasal *vlb"); //-kʷ’
		if (Math.random() < 0.3 || VOICE['-fricative'].includes('-voice +spread')) {
			remove("-voice -sonorant +fricative -nasal *vlb"); //-xʷ
			remove("+ejective -voice -sonorant -fricative -nasal *vlb"); //-kʷ’
		}

		remove("+voice -sonorant +fricative -nasal *vlb"); //-ɣʷ
	}

	if (Math.random() < 0.4) {
		const filter = Math.random() < 0.3 ? (x => x.includes('*vel')) : (x => x.includes('*vel -fricative'))

		const uvular = cons.filter(filter).map(x => Seg(x.replace('*vel', '*uvu')))
		cons.push(...uvular)
		PLACE.push('*uvu')

		if (Math.random() < 0.9) remove("+voice -sonorant -nasal -fricative *uvu"); //-ɢ
		remove("-sonorant +nasal *uvu"); //-ɴ

		if (Math.random() < 0.5) remove("+ejective -voice -sonorant -nasal -fricative *uvu"); //-qʼ
		if (Math.random() < 0.5) remove("+spread -voice -sonorant -nasal -fricative *uvu"); //-qʰ

		if (PLACE.includes('*vlb') && Math.random() < 0.4) {
			cons.push(Seg(`-voice -sonorant -nasal -fricative *ulb`))
			PLACE.push('*ulb')

			if (VOICE['-fricative'].includes('-voice +ejective') && Math.random() < 0.4
				&& take("+ejective -voice -sonorant -nasal -fricative *uvu").length) {
				cons.push(Seg("+ejective -voice -sonorant -nasal -fricative *ulb"))
			}
		}
	}

	if (Math.random() < 0.1) {
		PLACE.push('*dnt')
		for (const m of MANNER) {
			const mx = m.match(/[+-]fricative/)?.[0];
			if (mx in VOICE && m.includes('-nasal')) {
				for (const v of VOICE[mx])
					cons.push(Seg(`*dnt ${m} ${v}`))
			} else {
				cons.push(Seg(`*dnt ${m}`))
			}
		}

		if (Math.random() < 0.5) {
			cons = cons.filter(x => !(x.includes('*dnt') && x.includes('+fricative')))
		} else {
			cons = cons.filter(x => !(x.includes('*dnt') && !x.includes('+fricative')))
		}
	}


	const force = {};

	if (Math.random() < 0.2) {
		cons = cons.map(x => {
			if (x.includes('+fricative') && x.includes('*lab')) {
				force[x] = Seg(x.replace('*lab', '*lab +labiodental'))
				return Seg(x.replace('*lab', '*lab +labiodental'))
			}
			return x;
		})
	}

	if (take('*pal').length == 1) {
		const placed = cons.filter(x => x.includes('*plv')).length ?
			'*plv +approx' : '*vel +approx'
		force[placed] = `*pal +approx`;
		force[`*pal`] = `0`;
	}

	if (take('*vlb').length == 1) {
		force[`*lab +approx`] = `*vlb +approx`;
		force[`*vlb`] = `0`;
	}

	if (!hasRepeat(cons.filter(x => x.includes('+approx')).map(x => x.place()))) {
		cons.forEach(x => x.includes('+approx') ? (force[Seg(x.replace(/\+lateral/,''))] = x, force[x] = '0') : x)
	}

	force[Seg("-voice -sonorant -nasal +fricative *glt")] = `*glt +approx`;
	force[Seg(`*glt +approx`)] = '0';

	// const vowels = BASE_VOWELS[~~(Math.random()*BASE_VOWELS.length)];

	const vowels = generate_vowels();

	return {cons,PLACE,MANNER,VOICE,force,vowels};
}

function generate_onsets(cons) {
	const obstruents = cons.filter(x => x.includes('-nasal -sonorant'));
	const nasals = cons.filter(x => x.includes('+nasal -sonorant'));
	const liquids = cons.filter(x => x.includes('rhotic') || x.includes('+lateral'));
	const glides = cons.filter(x => x.includes('+approx') && !x.includes('*glt') && !x.includes('+lateral'));
	const rhotics = cons.filter(x => x.includes('rhotic'));

	const onsets = [];

	for (const o of obstruents) {
		if (o.includes("*glt") && Math.random() < 0.99) continue;
		if (o.includes("*uvu") && Math.random() < 0.9) continue;
		if (o.includes("*ulb") && Math.random() < 0.9) continue;
		if (o.includes("+fricative") && Math.random() < 0.8) continue;
		if (o.includes("*plv") && Math.random() < 0.8) continue;
		if (o.includes("*cor") && Math.random() < 0.5) continue;
		if (o.includes("*rtr") && Math.random() < 0.5) continue;
		if (o.includes("*dnt") && Math.random() < 0.5) continue;
		for (const g of glides) onsets.push([o,g])
		for (const l of liquids) onsets.push([o,l])
	}

	const cluster_count = ~~(Math.random()*20)
	// remove random until <Count
	while (onsets.length > cluster_count) {
		onsets.splice(Math.floor(Math.random()*onsets.length), 1)[0]
	}

	// console.log(onsets.map(y => y.map(x => IPA_TABLE[x]??x).join('')))

	onsets.push(...cons.map(x => [x]))
	onsets.push([])

	return onsets;
}

function generate_medial_clusters(inv, onsets) {
	const rhotics = inv.cons.filter(x => x.includes('rhotic'));
	const laterals = inv.cons.filter(x => x.includes('+lateral'));

	if (Math.random() < 0.5) onsets = onsets.filter(x => x.length == 1);


	/* ### Medial Clusters

	C likes in this order:
		O > N > S,L > R > H,ʔ
	inside O:
		(Plos > Fric)

	D doesn't like to be H
	DC likes RL much more than LR
	DC doesn't like SR,SL

	For each onset, what are the agreeable codas
		O:	N > O > R,L,S > ʔ > G,H
		N: 	N,O > R,L > S,G,ʔ,H
		S:  N,O > S > R > L,G,ʔ,H
		G:  O > N > L,R > S,G,ʔ,H
		L:  O > L > N > ʔ,G,R,S,H
		R:  O >> N > ʔ,G,R,L,S,H
		H:  N,O > ʔ,G,R,L,S,H
		ʔ:  N,O > ʔ,G,R,L,S,H
	*/

	const codas = [];
	if (Math.random() < 0.5) codas.push('O');
	if (Math.random() < 0.5) codas.push('N');
	if (Math.random() < 0.25) codas.push('S');
	if (laterals.length && Math.random() < 0.25) codas.push('L');
	if (rhotics.length && Math.random() < 0.15) codas.push('R');
	if (Math.random() < 0.02) codas.push('H');

	const options = {
		'O': ['N'  ,'N'  ,'O'  ,'RLS','G'   ,'H'].slice(0,~~(Math.random()*6)).join('').split('').filter(x=>codas.includes(x)),
		'N': ['NO' ,'NO' ,'RL' ,      'SG'  ,'H'].slice(0,~~(Math.random()*6)).join('').split('').filter(x=>codas.includes(x)),
		'S': ['NO' ,'NO' ,'S'  ,'R'  ,'LG'  ,'H'].slice(0,~~(Math.random()*6)).join('').split('').filter(x=>codas.includes(x)),
		'G': ['O'  ,'O'  ,'N'  ,'RL' ,'SG'  ,'H'].slice(0,~~(Math.random()*6)).join('').split('').filter(x=>codas.includes(x)),
		'L': ['O'  ,'O'  ,'L'  ,'N'  ,'RSG' ,'H'].slice(0,~~(Math.random()*6)).join('').split('').filter(x=>codas.includes(x)),
		'R': ['O'  ,'O'  ,'O'  ,'N'  ,'RSG','LH'].slice(0,~~(Math.random()*6)).join('').split('').filter(x=>codas.includes(x)),
		'H': ['NO' ,'NO' ,            'RLSG','H'].slice(0,~~(Math.random()*4)).join('').split('').filter(x=>codas.includes(x)),
	}

	options['N'] = options['N'].filter(x => x!='N');
	options['S'] = options['S'].filter(x => x!='S');

	// console.log(options, codas)

	const clusters = [];

	for (const o of onsets) {
		if (o.length==0) continue;
		const codas_list = options[o[0].sca()];
		for (const co of codas_list) {
			if (co == 'N') {
				let place = o[0].place();
				place = ({
					'*uvu': '*vel',
					'*ulb': '*vlb',
				})[place]??place;
				let nasal = Seg(place+' -sonorant +nasal');
				if (!inv.cons.some(x => x+''==nasal+'')) {
					if (place=='*vlb') nasal = Seg('*vel -sonorant +nasal');
					else nasal = Seg('*cor -sonorant +nasal');
				}
				if (!inv.cons.some(x => x+''==nasal+'')) {
					nasal = Seg('*cor -sonorant +nasal');
				}

				clusters.push([nasal, ...o]);
				continue;
			}
			if (co == 'S') {
				const sibilant = Seg('*cor -sonorant -nasal +fricative -voice');
				clusters.push([sibilant, ...o]);
				continue;
			}
			if (co == 'R') {
				const rhotic = Seg('*cor rhotic');
				clusters.push([rhotic, ...o]);
				continue;
			}
			if (co == 'L') {
				const lateral = Seg('*cor +approx +lateral');
				clusters.push([lateral, ...o]);
				continue;
			}
			if (co == 'G') {
				const lateral = Seg('*cor +approx +lateral');
				clusters.push([lateral, ...o]);
				continue;
			}
		}
	}

	console.log(clusters.map(y => y.map(x => x.ipa()).join('')))
	clusters.push(...onsets)

	return clusters;
}

function generate_syllable(inv) {

	const filterFunc = choice([(x => !x.includes('+nasal -sonorant *vel')), (x => true)])
	const onsetConsonants = inv.cons.filter(filterFunc);

	const nasals = inv.cons.filter(x => x.includes('+nasal -sonorant'));

	const onsets = generate_onsets(onsetConsonants);
	const medial = generate_medial_clusters(inv, onsets);

	const structure = choice(['KVD', 'KVCVD'], [1,1]);
	

	// console.log(structure, onset)

	// function choiceFreq(l, freq) {
	// 	const arr = l.map(x => Math.pow(freq[x]??1,2))
	// 	return choice(l,arr);
	// }

	let sample = Array(100).fill(structure)
		// .map(x => x.replace('K', () => choice(onset) ))
		.map(w => {
		const struct = Array.from(w)

		const segments = struct.flatMap(seg => {
			if (seg == 'K') return choice(onsets);
			if (seg == 'V') return [choice(inv.vowels)];
			if (seg == 'D') return [choice(['', choice(nasals)],[0.8,0.2])];
			if (seg == 'C') return choice(medial);
			// if (seg == 'D') return String(choice(['', choice(nasals)],[0.8,0.2]));
			// if (seg == 'O') return String(choice(obstruents));
			// if (seg == 'N') return String(choice(nasals));
			// if (seg == 'L') return String(choice(liquids)??'');
			// if (seg == 'R') return String(choice(rhotics)??'');
			// if (seg == 'G') return String(choice(glides)??'');
			return seg;
		});

		// CC = OC / CG
		// OS ⇒ OO ⇒ SS ⇒ SO
		// Voicing [-][-] ⇒ ([+][+] ⇒) [-][+] ⇒ [+][-]

		// C{j,w} / Cʲ{j,ʋ}   *[+palatalized]+w
		// N{j,w} / Nʲ{j,ʋ}   *[+palatalized]+w
		// CʲRʲ CˠRˠ CʲLʲ CˠLˠ
		// Cɬ[=voice]
		// Ƈk (only)

		const word = segments.map(x => IPA_TABLE[x]??x).join('');
		// const word = segments.map(x => x ? Seg(x).ipa() : '').join('');

		return {struct,segments,word};
	});


	// const freq = counts(sample.flatMap(x => x.segments.map(x => IPA_TABLE[x]??x)))
	// delete freq['']
	



	return sample.sort((a, b) => a.word.localeCompare(b.word));
}
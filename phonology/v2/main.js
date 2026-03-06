
function removePlace(x) {
	// return x.placeless()
	return x.replace(/\*(lab|cor|vel|vlb|pal|plv|uvu|ulb|rtr|epi|glt|dnt|lat|sib)\b|\+labiodental|U|I/g, '');
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
*/

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
	let umlaut = v.length >= 4 && Math.random() < 0.15;
	let atr = v.length >= 3 && Math.random() < 0.15;

	if (umlaut) {
		v = v.flatMap(x => x.includes('Ī') || x.includes('I') ? [x] : [x, x+'I'])

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
	const PLACE = ['*lab', '*cor', '~*rtr', '~*plv', '*vel'].filter(x => x[0] != '~' || Math.random() > 0.5).map(x=>x.replace('~',''));
	const MANNER = [ 'N', 'ʔ' ]
	if (Math.random() < 0.3) {
		MANNER.push('ʔ̱')
		if (Math.random() < 0.1) { MANNER.push('ʔ L') }
	}
	else if (Math.random() < 0.5) {
		MANNER.push('ʔ L')
		if (Math.random() < 0.2) MANNER.push('ʔ N')
		if (Math.random() < 0.2) MANNER.push('ʔ̱ L')
	}
	if (Math.random() < 0.2) { MANNER.push('ʔ H') }
	MANNER.push('H')
	if (Math.random() < 0.4) { MANNER.push('H L') }
	const CHOICES = {
		w: Math.random() < 0.5,
		j: Math.random() < 0.5,
		uvu: Math.random() < 0.3,
		labialized_dorsals: choice([0, 1, 2], [0.6, 0.25, 0.15]),
		coronal_affricates: Math.random() < 0.3,
		th_sounds: Math.random() < 0.5,
		laterals: Math.random() < 0.5,
		velopalatal: Math.random() < 0.2,
		rhotics: Math.random() < 0.8,
		dental: Math.random() < 0.2,
	}

	let cons = [];

	function remove(x, z) {
		const f = z ? (y => !(y.includes(x) && !y.includes(z)))
			: (y => !y.includes(x));
		cons = cons.filter(f);
	}

	function removeExact(x) {
		cons = cons.filter(y => !y.is(x));
	}

	function take(x) {
		return cons.filter(y => y.includes(x));
	}

	for (const p of PLACE)
	for (const m of MANNER) {
		cons.push(Seg(`${p} ${m}`))
	}




	if (MANNER.includes('H')) cons.push(Seg("*cor *sib H"));
	if (MANNER.includes('H L')) cons.push(Seg("*cor *sib H L"));
	if (MANNER.includes('H̱')) cons.push(Seg("*cor *sib H̱"));
	if (CHOICES.coronal_affricates) {
		cons.push(...cons.filter(x => x.includes('*cor ʔ')).map(x => Seg((x+' *sib'))))
	}

	if (!CHOICES.th_sounds) {
		removeExact('*cor H')
		removeExact('*cor H L')
	}

	if (CHOICES.rhotics) {
		console.log('+ rhotic')
		cons.push(Seg(`*cor G`));
		if (Math.random() < 0.5 && PLACE.includes('*rtr')) cons.push(Seg(`*rtr G`));
	}

	if (CHOICES.laterals) {
		console.log('+ lateral approximant')
		cons.push(Seg(`*lat G`));
		if (Math.random() < 0.5 && PLACE.includes('*plv')) {
			console.log('+ palatal lateral')
			cons.push(Seg(`*plv G *lat`));
		}
		if (Math.random() < 0.5 && PLACE.includes('*rtr')) {
			console.log('+ retroflex lateral')
			cons.push(Seg(`*rtr G *lat`));
		}
		
		if (Math.random() < 0.3) {
			console.log('+ lateral fricative')
			cons.push(Seg("H *lat"));
		}

		if (Math.random() < 0.2) {
			console.log('+ lateral affricates')

			for (const m of MANNER) {
				if (m.includes('ʔ')) cons.push(Seg(`*lat ${m}`))
			}

			removeExact("H ʔ *lat")
			removeExact("L ʔ̱ *lat")

			if (Math.random() < 0.8) {
				console.log('- voiced lateral affricates')
				removeExact("N ʔ *lat")
				removeExact("L ʔ *lat")
			}
		}
	}

	if (PLACE.includes('*rtr')) {
		if (Math.random() > 0.8) {
			console.log('+ retroflex series')
		} else if (Math.random() < 0.5) {
			console.log('+ retroflex stops')
			// cons = cons.filter(x => !(x.includes('*rtr +fricative')))
			cons = cons.filter(x => !(x.includes('*rtr') && !x.includes('ʔ')))
		} else {
			console.log('+ retroflex fricatives')
			cons = cons.filter(x => !(x.includes('*rtr ʔ')))
		}

		let count = take('*rtr').length;
		let lateral = take('*rtr *lat').length;

		if (count < 4 || Math.random() < ( lateral ? 0.3 : 0.6)) {
			console.log('- retroflex nasal')
			remove("N *rtr")
		}
	}

	if (Math.random() < 0.5) {
		console.log('- palatal nasal');
		remove("N *plv");
	}

	if (CHOICES.j) {
		console.log('+ palatal approximant');
		cons.push(Seg(`*plv G`));
	}

	if (CHOICES.w) {
		console.log('+ velar-labial approximant');
		cons.push(Seg(`*lab G`));
	}

	if (PLACE.includes('*plv')) {
		if (Math.random() > 0.8) {
			console.log('+ postalveolar series')
		} else if (Math.random() < 0.5) {
			console.log('+ postalveolar stops')
			cons = cons.filter(x => !(x.includes('*plv H') && !x.includes('ʔ')))
		} else {
			console.log('+ postalveolar fricatives')
			remove("*plv ʔ")
			remove("*plv ʔ̱")
		}
		if (Math.random() < 0.5) {
			console.log('- palatal nasal');
			remove("N *plv");
		}
	}

	if (CHOICES.velopalatal) {
		const c = cons.filter(x => x.includes('*vel')).map(x => Seg(x.replace('*vel', '*pal')))
		cons.push(...c)
		PLACE.push('*pal')
	}

	if (Math.random() < 0.5) cons.push(Seg(`*glt ʔ`));
	if (Math.random() < 0.5) cons.push(Seg(`*glt H`));
	
	// cons = cons.map(Seg)

	const STOP_GAP = 0.4;
	const FRICATIVE_GAP = 0.6;
	// Whitin Manner Stop Gapping
	if (MANNER.includes('ʔ L')) {
		if (Math.random() < 0.5) {
			removeExact(choice([
				"*vel L ʔ", //-g +k
				"*lab ʔ", //-p +b
				"*cor ʔ", //-d +t
				"*lab L ʔ", //-b +p
			],[160,100,50,50]))
		}

		if (Math.random() < 0.3) removeExact("L ʔ *cor *sib"); //-dz +ts
		if (Math.random() < 0.2) removeExact("L ʔ *plv"); //-dʒ +tʃ

		if (Math.random() < 0.5) removeExact("L ʔ *pal"); //-ɟ +c //>affricate

		
		if (Math.random() < STOP_GAP/5) removeExact("L ʔ *rtr"); //-ɖ +ʈ
		else if (Math.random() < STOP_GAP/3) {
			removeExact("ʔ *rtr"); //-ʈ  +ɖ
			removeExact("ʔ̱ *rtr"); //-ʈ' +ɖ
		}
	}

	// Whitin Manner Fricative Gapping
	if (MANNER.includes('H L')) {
		if (Math.random() < STOP_GAP) removeExact("L H *sib *cor"); //+s -z
		if (Math.random() < STOP_GAP) removeExact("L H *plv"); //+s -ʒ

		if (Math.random() < FRICATIVE_GAP) removeExact("H *cor"); //+ð -θ
		else if (Math.random() < FRICATIVE_GAP) removeExact("L H *cor"); //+θ -ð
		
		if (Math.random() < STOP_GAP) removeExact("L H *lab"); //+f -v
		else if (Math.random() < STOP_GAP/3) removeExact("H *lab"); //-f +v

		if (Math.random() < STOP_GAP) removeExact("L H *vel"); //+x -ɣ
		else if (Math.random() < STOP_GAP) removeExact("H *vel"); //+ɣ -x

		if (Math.random() < STOP_GAP/3) removeExact("L H *pal"); //+ç -ʝ
		if (Math.random() < STOP_GAP/3) removeExact("L H *rtr"); //+ʂ -ʐ
	}

	// Between Manner Gapping
	if (Math.random() < FRICATIVE_GAP) removeExact("H *vel"); //-x +k
	if (Math.random() < FRICATIVE_GAP/2) removeExact("H *lab"); //-f +p
	if (Math.random() < FRICATIVE_GAP) removeExact("H *pal"); //-ç +c
	if (take("ʔ *rtr").length && Math.random() < FRICATIVE_GAP/3) removeExact("H *rtr"); //-ʂ +ʈ
	if (MANNER.includes('ʔ L')) {
		if (Math.random() < FRICATIVE_GAP) remove("L H *vel"); //-ɣ +g
		if (Math.random() < FRICATIVE_GAP/2) remove("L H *pal"); //-ʝ +ɟ
		if (Math.random() < FRICATIVE_GAP/4) remove("L H *lab"); //-v +b
		if (Math.random() < FRICATIVE_GAP/2) remove("L H *plv"); //-ʒ +dʒ

		if (Math.random() < FRICATIVE_GAP/6) removeExact("L H *rtr"); //-ʐ +ɖ
		if (Math.random() < FRICATIVE_GAP/6) removeExact("L H *cor *sib"); //-z +d
	} else {
		if (Math.random() < FRICATIVE_GAP) removeExact("ʔ *plv"); //-tʃ
		if (Math.random() < FRICATIVE_GAP) removeExact("H *plv"); //-ʃ
	}
	
	if (Math.random() < STOP_GAP) remove("N *vel"); //-ŋ
	
	if (take("G *pal").length) removeExact("H L *pal"); //-ʝ < j
	if (take("H *vel").length) removeExact("H *pal"); //-ç < x

	if (CHOICES.labialized_dorsals) {
		const vellab = cons.filter(x => x.includes('*vel')).map(x => Seg(x.replace('*vel', '*vel U')))
		cons.push(...vellab)
		PLACE.push('*vel U')

		if (Math.random() < 0.5) remove("N *vel U"); //-ŋʷ
		if (Math.random() < 0.3) remove("L ʔ *vel U"); //-gʷ
		if (Math.random() < 0.3) remove("H ʔ *vel U"); //-kʷʰ
		if (Math.random() < 0.3) remove("ʔ̱ *vel U"); //-kʷ’
		// if (Math.random() < 0.3 || VOICE['-fricative'].includes('-voice +spread')) {
		// 	remove("-voice -sonorant +fricative -nasal *vel U"); //-xʷ
		// 	remove("+ejective -voice -sonorant -fricative -nasal *vel U"); //-kʷ’
		// }

		remove("H L *vel U"); //-ɣʷ
	}

	if (CHOICES.uvu) {
		const filter = Math.random() < 0.3 ? (x => x.includes('*vel')) : (x => x.includes('*vel') && !x.includes('H'))

		const uvular = cons.filter(filter).map(x => Seg(x.replace('*vel', '*uvu')))
		cons.push(...uvular)
		PLACE.push('*uvu')

		if (Math.random() < 0.9) remove("L ʔ *uvu"); //-ɢ
		remove("N *uvu"); //-ɴ
		remove("G *uvu"); //-ɴ

		if (Math.random() < 0.5) remove("ʔ̱ *uvu"); //-qʼ
		if (Math.random() < 0.5) remove("ʔ H *uvu"); //-qʰ

		if (CHOICES.labialized_dorsals == 2) {
			// cons.push(Seg(`ʔ *ulb`))
			// PLACE.push('*ulb')

			// if (take("ʔ̱ *uvu").length && Math.random() < 0.4) {
			// 	cons.push(Seg(`ʔ̱ *ulb`))
			// }
		} else {
			remove('*uvu U');
		}
	}

	if (CHOICES.dental) {
		const c = cons.filter(x => x.includes('*cor ʔ') && !x.includes('*sib')).map(x => Seg(x.replace('*cor', '*dnt')))
		cons.push(...c)
		if (Math.random() < 0.5) cons.push(Seg(`*dnt N`))
		PLACE.push('*dnt')
	}

	remove("L ʔ̱ *uvu");
	remove("L ʔ̱ *plv");
	remove("L ʔ̱ *dnt");
	remove("L ʔ̱ *vel U");
	if (Math.random() < 0.9) { remove("L ʔ̱ *vel"); }
	if (Math.random() < 0.5) { remove("L ʔ̱ *pal"); remove("L ʔ̱ *vel"); }
	if (Math.random() < 0.5) { remove("L ʔ̱ *rtr"); remove("L ʔ̱ *vel"); }
	if (Math.random() < 0.3) { remove("L ʔ̱ *cor"); {if (Math.random() < 0.2) remove("L ʔ̱ *rtr")}; remove("L ʔ̱ *pal"); remove("L ʔ̱ *vel"); }
	if (Math.random() < 0.1) { remove("L ʔ̱ *lab"); }





	const force = {};

	if (Math.random() < 0.8) {
		cons = cons.map(x => {
			if (x.includes('*lab H') && !x.includes('ʔ')) {
				force[x] = Seg(x.replace('*lab', '*lab +labiodental'))
				return Seg(x.replace('*lab', '*lab +labiodental'))
			}
			return x;
		})
	}

	let match;
	if (!CHOICES.coronal_affricates && (match = take('*cor H').filter(x => !x.includes('ʔ') && !x.includes('*sib'))).length>0) {
		match.map(x => {
			force[x.replace('*cor','*dnt')] = x
			force[x] = `0`
		})
		force['*dnt'] = `1`
	}

	if (!CHOICES.coronal_affricates) {
		force['*cor H'] = Seg(`H *cor *sib`)
		if (take('*cor *sib H L').length==1) {
			force['*cor H L'] = Seg(`*cor *sib H L`)
		}
		force['*cor *sib'] = `0`;
	}

	if (take('*plv').length == 1) {
		if (PLACE.includes('*pal')) {
			force[`*pal G`] = `*plv G`;
		} else {
			force[`*vel G`] = `*plv G`;
		}
		force[`*plv`] = `0`;
	}

	if (take('*cor G').length == 0 && take('*lat').length >= 1) {
		force[`*cor G`] = Seg(`*lat G`); force[`*lat`] = `0`;
	}

	if (take('*rtr G').length == 1 && take('*rtr *lat').length == 1) {
		force[`*rtr G`] = Seg(`*rtr *lat G`); force[`*lat *rtr`] = `0`;
	}

	if (take('*plv G').length == 1 && take('*plv *lat').length == 1) {
		force[`*plv G`] = Seg(`*plv *lat G`); force[`*plv *lat`] = `0`;
	}

	// if (take('*vel U').length == 1) {
	// 	force[`*lab G`] = Seg(`*vel U G`);
	// 	force[`*vel U`] = `0`;
	// }

	const vowels = generate_vowels();

	return {cons,PLACE,MANNER,force,vowels};
}

function generate_onsets(cons) {
	const obstruents = cons.filter(x => x.sca() == 'O');
	const nasals = cons.filter(x => x.sca() == 'N');
	const liquids = cons.filter(x => x.sca() == 'R' || x.sca() == 'L');
	const glides = cons.filter(x => x.sca() == 'G');
	const rhotics = cons.filter(x => x.sca() == 'R');

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

	console.log(onsets.map(y => y.map(x => x.ipa()).join('')))

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
		const codas_list = options[o[0].sca()]??[];
		for (const co of codas_list) {
			if (co == 'N') {
				let place = o[0].place();
				// place = ({
				// 	'*uvu': '*vel',
				// 	'*ulb': '*vlb',
				// })[place]??place;
				let nasal = Seg(place+'N');
				if (!inv.cons.some(x => x+''==nasal+'')) {
					if (place=='*vlb') nasal = Seg('*vel N');
					else nasal = Seg('*cor N');
				}
				if (!inv.cons.some(x => x+''==nasal+'')) {
					nasal = Seg('*cor N');
				}

				clusters.push([nasal, ...o]);
				continue;
			}
			if (co == 'S') {
				const sibilant = Seg('*cor *sib H');
				clusters.push([sibilant, ...o]);
				continue;
			}
			if (co == 'R') {
				const rhotic = Seg('*cor G');
				clusters.push([rhotic, ...o]);
				continue;
			}
			if (co == 'L') {
				const lateral = Seg('*lat G');
				clusters.push([lateral, ...o]);
				continue;
			}
			if (co == 'G') {
				const lateral = Seg('*lat G');
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

	const filterFunc = choice([(x => !x.includes('N *vel')), (x => true)])
	const onsetConsonants = inv.cons.filter(filterFunc);

	const nasals = inv.cons.filter(x => x.includes('N'));

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
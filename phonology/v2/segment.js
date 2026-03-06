
class Seg_ {
	constructor(x) {
		this.seg = [...new Set(String(x).trim().split(/\s+/))];
	}

	includes(x) {
		return x.split(/\s+/).every(y => this.seg.includes(y))
	}

	is(x) {
		const set = new Set(x.split(/\s+/))
		if (set.size != (new Set(this.seg)).size) return false;
		return [...set].every(y => this.seg.includes(y))
	}

	place() {
		return this.seg.flatMap(x => {
			let m = x.match(/\*\w+|[UI]/)
			return m ? [m[0]] : []
		}).join(' ')
	}

	// placeless() {
	// 	return x.replace(/\*(lab|cor|vel|vlb|pal|plv|uvu|ulb|rtr|epi|glt|dnt|lat|sib)\b|\+labiodental/g, '');
	// }

	replace(a, b) {
		return new Seg_(this.seg.join(' ').replace(a,b))
	}

	toString() {
		return this.seg.sort().join(' ')
	}

	sca() {
		if (this.includes('*glt')) return 'H';
		if (this.includes('N')) return 'N';
		if (!this.includes('G')) return 'O';
		if (this.seg.length == 1) return 'V';
		// if (this.includes('rhotic')) return 'R';
		if (this.includes('*lat')) return 'L';
		if (this.includes('G')) return 'G';

		return '?'
	}

	ipa() {
		return IPA_TABLE[this]??'?';
	}
}

function Seg(x) {
	if (typeof x === 'string') {
		return new Seg_(x);
	}
	return x;
}

/*
Manner: H L ʔ

ʔ̱	ʔ̱N	ʔ̱L
t'	n'	ɖ

ʔ	ʔH	ʔH̱	ʔL	ʔHL	ʔH̱L	ʔN
t	tʰ	tx	d 	dʰ		nd
d	t	tʰ	d	dʰ

H	H̱	HL
s   sʰ	z
z	s

N 	NH	NL 	ʔ̱N
n 	n̥	nʰ	n'
*/

/*
A	I	I+	A̱	A̱+	I̱	I̱+	U	U+	U̱	U̱+
t̪	t	ts	ʈ	ʈʂ	tʃ	tɕ	k	q	p	pf
s̪	θ	s	s̠	ʂ	ʃ	ɕ	x	χ	ɸ	f
											tɫ
r₂	r₁	l̪	r₃	ɭ	j	ʎ	ɰ	ɫ	w	ʋ	l

*/

const IPA_TABLE = {
	[Seg("*lab N")]: 'm',
	[Seg("*cor N")]: 'n',
	[Seg("*vel N")]: 'ŋ',
	[Seg("*plv N")]: 'ɲ',
	[Seg("*pal N")]: 'ɲ',
	[Seg("*uvu N")]: 'ɴ',
	[Seg("*rtr N")]: 'ɳ',
	[Seg("*dnt N")]:'n̪',
	[Seg("*vel U N")]: 'ŋʷ',

	[Seg("*glt ʔ")]: 'ʔ',

	[Seg("*lab ʔ")]: 'p',
	[Seg("*lab H ʔ")]: 'pʰ',
	[Seg("*cor ʔ")]: 't',
	[Seg("*cor H ʔ")]: 'tʰ',
	[Seg("*vel ʔ")]: 'k',
	[Seg("*vel H ʔ ")]: 'kʰ',
	[Seg("*pal ʔ")]:'c',
	[Seg("*pal H ʔ")]:'cʰ',
	[Seg("*uvu ʔ")]:'q',
	[Seg("*uvu H ʔ")]:'qʰ',
	[Seg("*rtr ʔ")]:'ʈ',
	[Seg("*rtr H ʔ")]:'ʈʰ',
	[Seg("*dnt ʔ")]:'t̪',
	[Seg("*dnt H ʔ")]:'t̪ʰ',
	[Seg("*plv ʔ")]:'tʃ',
	[Seg("*plv H ʔ")]:'tʃʰ',
	[Seg("*vel U ʔ")]: 'kʷ',
	[Seg("*uvu U ʔ")]: 'qʷ',
	[Seg("*uvu U H ʔ")]: 'qʷʰ',
	[Seg("*vel U H ʔ")]: 'kʷʰ',

	[Seg("*cor *sib ʔ̱")]: 'tsʼ',
	[Seg("*cor *sib ʔ")]: 'ts',
	[Seg("*cor *sib H ʔ")]: 'tsʰ',
	[Seg("*cor *sib L ʔ")]: 'dz',
	[Seg("*cor *sib N ʔ")]: 'ⁿdz',
	[Seg("*lat ʔ")]: 'tɬ',
	[Seg("*lat H")]: 'ɬ',
	[Seg("*lat ʔ̱")]: 'tɬʼ',
	[Seg("*lat H ʔ")]: 'tɬʰ',
	[Seg("*lat L ʔ")]: 'dɮ',
	[Seg("*lat N ʔ")]: 'ⁿdɮ',



	[Seg("*lab L ʔ")]: 'b',
	[Seg("*cor L ʔ")]: 'd',
	[Seg("*vel L ʔ ")]: 'g',
	[Seg("*pal L ʔ")]:'ɟ',
	[Seg("*uvu L ʔ")]:'ɢ',
	[Seg("*rtr L ʔ")]:'ɖ',
	[Seg("*dnt L ʔ")]:'d̪',
	[Seg("*plv L ʔ")]:'dʒ',
	[Seg("*vel U L ʔ")]: 'gʷ',
	[Seg("*uvu U L ʔ")]: 'ɢʷ',

	[Seg("*lab L ʔ̱")]: 'ɓ',
	[Seg("*cor L ʔ̱")]: 'ɗ',
	[Seg("*vel L ʔ̱ ")]: 'ɠ',
	[Seg("*vel U L ʔ̱ ")]: 'ɠʷ',
	[Seg("*pal L ʔ̱")]:'ʄ',
	[Seg("*uvu L ʔ̱")]:'ʛ',
	[Seg("*rtr L ʔ̱")]:'ᶑ',

	[Seg("*lab N ʔ")]: 'ᵐb',
	[Seg("*cor N ʔ")]: 'ⁿd',
	[Seg("*vel N ʔ ")]: 'ᵑg',
	[Seg("*pal N ʔ")]:'ᶮɟ',
	[Seg("*uvu N ʔ")]:'ᶰɢ',
	[Seg("*rtr N ʔ")]:'ᶯɖ',
	[Seg("*dnt N ʔ")]:'ⁿd̪',
	[Seg("*plv N ʔ")]:'ⁿdʒ',
	[Seg("*vel U N ʔ")]: 'ᵑgʷ',
	[Seg("*uvu U N ʔ")]: 'ᶰɢʷ', // ᵐ ⁿ ᵑ ᶮ ᶯ ᶰ
	
	[Seg("*pal H")]:'ç',
	[Seg("*uvu H")]:'χ',
	[Seg("*lab H +labiodental")]:'f',
	[Seg("*lab H")]:'ɸ',
	[Seg("*cor H")]:'θ',
	[Seg("*cor *sib H")]:'s',
	[Seg("*vel H")]:'x',
	[Seg("*rtr H")]:'ʂ',
	[Seg("*dnt H")]:'θ',
	[Seg("*plv H")]:'ʃ',
	[Seg("*vel U H")]:'xʷ',
	[Seg("*uvu U H")]:'χʷ',
	[Seg("*pal L H")]:'ʝ',
	[Seg("*uvu L H")]:'ʁ',
	[Seg("*lab L H +labiodental")]:'v',
	[Seg("*lab L H")]:'β',
	[Seg("*cor L H")]:'ð',
	[Seg("*cor *sib L H")]:'z',
	[Seg("*vel L H")]:'ɣ',
	[Seg("*rtr L H")]:'ʐ',
	[Seg("*dnt L H")]:'ð',
	[Seg("*plv L H")]:'ʒ',
	[Seg("*vel U L H")]:'ɣʷ',
	[Seg("*uvu U L H")]:'ʁʷ',
	[Seg("*pal H̱")]:'çʰ',
	[Seg("*uvu H̱")]:'χʰ',
	[Seg("*lab H̱")]:'fʰ',
	[Seg("*lab H̱ +labiodental")]:'ɸʰ',
	[Seg("*cor H̱")]:'θʰ',
	[Seg("*cor *sib H̱")]:'sʰ',
	[Seg("*vel H̱")]:'xʰ',
	[Seg("*rtr H̱")]:'ʂʰ',
	[Seg("*dnt H̱")]:'θʰ',
	[Seg("*plv H̱")]:'ʃʰ',
	[Seg("*vel U H̱")]:'xʷʰ',
	[Seg("*uvu U H̱")]:'χʷʰ',

	[Seg("*glt H")]: 'h',

	[Seg("*lab ʔ̱")]: 'pʼ',
	[Seg("*cor ʔ̱")]: 'tʼ',
	[Seg("*vel ʔ̱")]: 'kʼ',
	[Seg("*pal ʔ̱")]:'cʼ',
	[Seg("*uvu ʔ̱")]:'qʼ',
	[Seg("*rtr ʔ̱")]:'ʈʼ',
	[Seg("*plv ʔ̱")]:'tʃʼ',
	[Seg("*vel U ʔ̱")]: 'kʷʼ',
	[Seg("*uvu U ʔ̱")]: 'qʷʼ',
	[Seg("*dnt ʔ̱")]:'t̪ʼ',


	

	[Seg("*cor G")]:'r',
	[Seg("*rtr G")]:'ɽ',


	[Seg("*lat G")]: 'l',
	[Seg("*rtr *lat G")]: 'ɭ',
	// [Seg("*pal *lat G")]: 'ʎ',
	[Seg("*plv *lat G")]: 'ʎ',

	

	
	[Seg("*lab G")]: 'w',
	// [Seg("*glt G")]: 'h',
	[Seg("*pal G")]: 'j',
	[Seg("*plv G")]: 'j',

	
	
	
}
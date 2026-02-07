
class Seg_ {
	constructor(x) {
		this.seg = String(x).trim().split(/\s+/);
	}

	includes(x) {
		return x.split(/\s+/).every(y => this.seg.includes(y))
	}

	place() {
		return this.seg.join(' ').match(/\*\w+/)[0]
	}

	placeless() {
		return x.replace(/\*(lab|cor|vel|vlb|pal|plv|uvu|ulb|rtr|epi|glt|dnt)\b|\+labiodental/g, '');
	}

	replace(a, b) {
		return new Seg_(this.seg.join(' ').replace(a,b))
	}

	toString() {
		return this.seg.sort().join(' ')
	}

	sca() {
		if (this.includes('*glt')) return 'H';
		if (this.includes('+nasal')) return 'N';
		if (this.includes('-sonorant')) return 'O';
		if (this.seg.length == 1) return 'V';
		if (this.includes('rhotic')) return 'R';
		if (this.includes('+lateral')) return 'L';
		if (this.includes('+approx')) return 'G';

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

// sonorant fricative affricate !nasal !prenasalised implosive !vibrant !trill lateral long;
// !labial !coronal !dorsal labiodental !anterior !retroflex !laminal sibilant !high front  pharyngealised back round palatalised_velar !ATR low; 
// voice constricted_glottis !spread_glottis


/// -sonorant -nasal -fricative = stop/affricate
/// -sonorant -nasal +fricative = fricative
/// -sonorant +nasal -fricative = nasal
///
/// +sonorant = sonorant
/// +sonorant +vibrant -trill = tap
/// +sonorant +vibrant +trill = trill
/// +sonorant -vibrant = approximant

const IPA_TABLE = {
	[Seg("*lab -sonorant +nasal")]: 'm',
	[Seg("*cor -sonorant +nasal")]: 'n',
	[Seg("-sonorant +nasal *vel")]: 'ŋ',
	[Seg("-voice *lab -sonorant -nasal -fricative")]: 'p',
	[Seg("+voice *lab -sonorant -nasal -fricative")]: 'b',
	[Seg("+spread -voice *lab -sonorant -nasal -fricative")]: 'pʰ',
	[Seg("-voice *cor -sonorant -nasal -fricative")]: 't',
	[Seg("+voice *cor -sonorant -nasal -fricative")]: 'd',
	[Seg("+spread -voice *cor -sonorant -nasal -fricative")]: 'tʰ',
	[Seg("-voice -sonorant -nasal -fricative *vel")]: 'k',
	[Seg("+voice -sonorant -nasal -fricative *vel")]: 'g',
	[Seg("+spread -voice -sonorant -nasal -fricative *vel")]: 'kʰ',
	[Seg("*cor +approx +lateral")]: 'l',
	[Seg("*rtr +approx +lateral")]: 'ɭ',
	[Seg("*pal +approx +lateral")]: 'ʎ',
	[Seg("-voice *glt -sonorant -nasal -fricative")]: 'ʔ',
	[Seg("-voice -sonorant -nasal +fricative *glt")]: 'h',
	[Seg("*cor rhotic")]:'r',
	[Seg("*rtr rhotic")]:'ɽ',
	[Seg("-sonorant +nasal *pal")]:'ɲ',
	[Seg("-voice *pal -sonorant -nasal -fricative")]:'c',
	[Seg("+voice *pal -sonorant -nasal -fricative")]:'ɟ',
	[Seg("+spread -voice *pal -sonorant -nasal -fricative")]:'cʰ',
	[Seg("-voice -sonorant -nasal +fricative *pal")]:'ç',
	[Seg("+voice -sonorant -nasal +fricative *pal")]:'ʝ',
	[Seg("-sonorant +nasal *uvu")]:'ɴ',
	[Seg("-voice -sonorant -nasal -fricative *uvu")]:'q',
	[Seg("+voice -sonorant -nasal -fricative *uvu")]:'ɢ',
	[Seg("+spread -voice -sonorant -nasal -fricative *uvu")]:'qʰ',
	[Seg("-voice -sonorant -nasal +fricative *uvu")]:'χ',
	[Seg("+voice -sonorant -nasal +fricative *uvu")]:'ʁ',
	[Seg("-voice -sonorant -nasal +fricative *lab")]:'f',
	[Seg("+voice -sonorant -nasal +fricative *lab")]:'v',
	[Seg("-voice -sonorant -nasal +fricative *lab +labiodental")]:'ɸ',
	[Seg("+voice -sonorant -nasal +fricative *lab +labiodental")]:'β',
	[Seg("-voice *cor -sonorant -nasal +fricative")]:'s',
	[Seg("+voice *cor -sonorant -nasal +fricative")]:'z',
	[Seg("-voice -sonorant -nasal +fricative *vel")]:'x',
	[Seg("+voice -sonorant -nasal +fricative *vel")]:'ɣ',

	[Seg("-sonorant +nasal *rtr")]:'ɳ',
	[Seg("-voice *rtr -sonorant -nasal -fricative")]:'ʈ',
	[Seg("+voice *rtr -sonorant -nasal -fricative")]:'ɖ',
	[Seg("+spread -voice *rtr -sonorant -nasal -fricative")]:'ʈʰ',
	[Seg("-voice -sonorant -nasal +fricative *rtr")]:'ʂ',
	[Seg("+voice -sonorant -nasal +fricative *rtr")]:'ʐ',

	[Seg("-sonorant +nasal *dnt")]:'n̪',
	[Seg("-voice *dnt -sonorant -nasal -fricative")]:'t̪',
	[Seg("+voice *dnt -sonorant -nasal -fricative")]:'d̪',
	[Seg("+spread -voice *dnt -sonorant -nasal -fricative")]:'t̪ʰ',
	[Seg("+ejective -voice *dnt -sonorant -nasal -fricative")]:'t̪ʼ',
	[Seg("-voice -sonorant -nasal +fricative *dnt")]:'θ',
	[Seg("+voice -sonorant -nasal +fricative *dnt")]:'ð',

	[Seg("-voice *plv -sonorant -nasal -fricative")]:'tʃ',
	[Seg("+voice *plv -sonorant -nasal -fricative")]:'dʒ',
	[Seg("+spread -voice *plv -sonorant -nasal -fricative")]:'tʃʰ',
	[Seg("-voice -sonorant -nasal +fricative *plv")]:'ʃ',
	[Seg("+voice -sonorant -nasal +fricative *plv")]:'ʒ',

	[Seg("+ejective -voice *lab -sonorant -nasal -fricative")]: 'pʼ',
	[Seg("+ejective -voice *cor -sonorant -nasal -fricative")]: 'tʼ',
	[Seg("+ejective -voice -sonorant -nasal -fricative *vel")]: 'kʼ',
	[Seg("+ejective -voice *pal -sonorant -nasal -fricative")]:'cʼ',
	[Seg("+ejective -voice -sonorant -nasal -fricative *uvu")]:'qʼ',
	[Seg("+ejective -voice *rtr -sonorant -nasal -fricative")]:'ʈʼ',
	[Seg("+ejective -voice *plv -sonorant -nasal -fricative")]:'tʃʼ',

	[Seg("*vlb +approx")]: 'w',
	[Seg("*glt +approx")]: 'h',
	[Seg("*pal +approx")]: 'j',

	[Seg("-sonorant +nasal *vlb")]: 'ŋʷ',
	[Seg("-voice -sonorant -nasal -fricative *vlb")]: 'kʷ',
	[Seg("+voice -sonorant -nasal -fricative *vlb")]: 'gʷ',
	[Seg("+spread -voice -sonorant -nasal -fricative *vlb")]: 'kʷʰ',
	[Seg("-voice -sonorant -nasal +fricative *vlb")]:'xʷ',
	[Seg("+voice -sonorant -nasal +fricative *vlb")]:'ɣʷ',
	[Seg("+ejective -voice -sonorant -nasal -fricative *vlb")]: 'kʷʼ',
	[Seg("-voice -sonorant -nasal -fricative *ulb")]: 'qʷ',
	[Seg("+voice -sonorant -nasal -fricative *ulb")]: 'ɢʷ',
	[Seg("+spread -voice -sonorant -nasal -fricative *ulb")]: 'qʷʰ',
	[Seg("-voice -sonorant -nasal +fricative *ulb")]:'χʷ',
	[Seg("+voice -sonorant -nasal +fricative *ulb")]:'ʁʷ',
	[Seg("+ejective -voice -sonorant -nasal -fricative *ulb")]: 'qʷʼ',
}
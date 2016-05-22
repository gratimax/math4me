export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var precs = {
	"+":0,
	"-":0,
	"*":1,
	"/":1
}

class Token {
	toString(): string {
		return ""
	}
	prec(): number {
		return Number.MAX_VALUE;
	}
}
class NToken extends Token {
	constructor(public n: number) {
		super();
	}
	toString(): string {
		return this.n.toString();
	}
}
class OpToken extends Token {
	constructor(public op: string, public t1: Token, public t2: Token) {
		super();
	}
	toString(): string {
		var a = this.prec() > this.t1.prec();
		var b = this.prec() > this.t2.prec();
		if(a && b)
			return "(" + this.t1.toString() + this.op + this.t2.toString() + ")";
		if(a)
			return "(" + this.t1.toString() + ")" + this.op + this.t2.toString();
		if(b)
			return this.t1.toString() + this.op + "(" + this.t2.toString() + ")";
		return this.t1.toString() + this.op + this.t2.toString();
	}
	prec(): number {
		return precs[this.op];
	}
}
class BlockToken extends Token {
	constructor(public tok: Token) {
		super();
	}
	toString(): string {
		return "(" + this.tok.toString() + ")";
	}
}

interface Transform {
	num: number;
	transform(toks: Token[]): Token;
}

export function gen(nums: number[], transforms: Transform[]) {
	var toks: Token[] = nums.map((n: number) => new NToken(n));
	var i = 0;
	while(toks.length != 1) {
		var index = getRandomInt(0, transforms.length-1);
		var transform = transforms[index];
		var max = toks.length - transform.num;
		if(max >= 0)
		{
			var pos = getRandomInt(0, max);
			toks[pos] = transform.transform(toks.slice(pos, pos+transform.num));
			toks.splice(pos+1, transform.num-1);
			i++;
		} else {
			transforms.splice(index, 1);
		}
	}
	return toks;
}

export function opTransform(op: string): Transform {
	return {
		num: 2,
		transform: (toks: Token[]) => {
			return new OpToken(op, toks[0], toks[1]);
		}
	}
}

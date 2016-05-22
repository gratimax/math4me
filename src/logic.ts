var math = require("mathjs"); 
math.config({
  number: 'Fraction'
});

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

export class Token {
	toString(): string {
		return ""
	}
	prec(): number {
		return Number.MAX_VALUE;
	}
}
export class NToken extends Token {
	constructor(public n: number) {
		super();
	}
	toString(): string {
		return this.n.toString();
	}
}
export class OpToken extends Token {
	constructor(public op: string, public t1: Token, public t2: Token) {
		super();
	}
	toString(): string {
		var leftIsLower = this.prec() > this.t1.prec();
		var rightIsLower = this.prec() > this.t2.prec();
		if(leftIsLower && rightIsLower)
			return `(${this.t1}) ${this.op} (${this.t2})`;
		if(leftIsLower)
			return `(${this.t1}) ${this.op} ${this.t2}`;
		if(rightIsLower)
			return `${this.t1} ${this.op} (${this.t2})`;
		return `${this.t1} ${this.op} ${this.t2}`;
	}
	prec(): number {
		return precs[this.op];
	}
}

export class Transform {
	num: number;
	transform(toks: Token[]): Token {
		return null;
	}
}

export class OpTransform extends Transform {
	constructor(public op: string) {
		super();
		this.num = 2;
	}
	transform(toks: Token[]): Token {
		return new OpToken(this.op, toks[0], toks[1]);
	}
}

export function gen(nums: number[], transforms: Transform[]): [Token, Transform[]] {
	var toks: Token[] = nums.map((n: number) => new NToken(n));
	var i = 0;
	var done: Transform[] = [];
	while(toks.length != 1) {
		var index = getRandomInt(0, transforms.length-1);
		var transform = transforms[index];
		var max = toks.length - transform.num;
		if(max >= 0)
		{
			var pos = getRandomInt(0, max);
			toks[pos] = transform.transform(toks.slice(pos, pos+transform.num));
			toks.splice(pos+1, transform.num-1);
			done.push(transform);
			i++;
		} else {
			transforms.splice(index, 1);
		}
	}
	return [toks[0], done];
}

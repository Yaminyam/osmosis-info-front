import { action, computed, makeObservable, observable } from "mobx";
import { Request } from "../request";
import { Fees, Pool, PoolAPR, PoolResponse, ReturnAPR } from "./pools";
const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;
import axios, { AxiosResponse } from "axios";
import { TokenStore } from "../tokens/token-store";

type PromiseRequest = AxiosResponse<PoolResponse, PoolResponse>;

export interface PoolStoreArgs {
	pool: Pool;
}
export class PoolStore extends Request<PromiseRequest> {
	@observable private _id = 0;
	get id(): number {
		return this._id;
	}
	set id(id: number) {
		this._id = id;
	}

	@observable private _tokens = [] as TokenStore[];
	get tokens(): TokenStore[] {
		return this._tokens;
	}
	set tokens(tokens: TokenStore[]) {
		this._tokens = tokens;
	}

	@observable private _apr: PoolAPR[] = [];
	get apr(): PoolAPR[] {
		return this._apr;
	}
	set apr(apr: PoolAPR[]) {
		this._apr = apr;
	}

	@observable private _fees: Fees;
	get fees(): Fees {
		return this._fees;
	}
	set fees(fees: Fees) {
		this._fees = fees;
	}

	@observable private _main = false;
	get main(): boolean {
		return this._main;
	}
	set main(main: boolean) {
		this._main = main;
	}

	@observable private _liquidity = 0;
	get liquidity(): number {
		return this._liquidity;
	}
	set liquidity(liquidity: number) {
		this._liquidity = liquidity;
	}

	@observable private _liquidity24hChange = 0;
	get liquidity24hChange(): number {
		return this._liquidity24hChange;
	}
	set liquidity24hChange(liquidity24hChange: number) {
		this._liquidity24hChange = liquidity24hChange;
	}

	@observable private _volume24hChange = 0;
	get volume24hChange(): number {
		return this._volume24hChange;
	}
	set volume24hChange(volume24hChange: number) {
		this._volume24hChange = volume24hChange;
	}

	@observable private _volume24h = 0;
	get volume24h(): number {
		return this._volume24h;
	}
	set volume24h(volume24h: number) {
		this._volume24h = volume24h;
	}

	@observable private _volume7d = 0;
	get volume7d(): number {
		return this._volume7d;
	}
	set volume7d(volume7d: number) {
		this._volume7d = volume7d;
	}

	@computed get name(): string {
		return this._tokens.reduce((acc, currentValue) => {
			const symbolName = currentValue.symbol.length === 0 ? currentValue.denom : currentValue.symbol;
			return `${acc}${acc.length > 0 ? "/" : ""}${symbolName}`;
		}, "");
	}

	@computed get internalReturn(): ReturnAPR {
		const internalReturn: ReturnAPR = {
			apr1d: 0,
			apr7d: 0,
			apr14d: 0,
			aprSuperfluid: 0,
			tokens: [],
		};

		this.apr.forEach((apr) => {
			if (apr.token?.symbol === "OSMO") {
				const dateAPR = new Date(apr.startDate);
				if (dateAPR <= new Date()) {
					internalReturn.apr1d += apr.apr1d;
					internalReturn.apr7d += apr.apr7d;
					internalReturn.apr14d += apr.apr14d;
					internalReturn.aprSuperfluid += apr.aprSuperfluid;
					internalReturn.tokens.push(apr.token);
				}
			}
		});
		return internalReturn;
	}

	@computed get externalReturn(): ReturnAPR {
		const externalReturn: ReturnAPR = {
			apr1d: 0,
			apr7d: 0,
			apr14d: 0,
			aprSuperfluid: 0,
			tokens: [],
		};

		this.apr.forEach((apr) => {
			if (apr.token && apr.token.symbol !== "OSMO") {
				const dateAPR = new Date(apr.startDate);
				if (dateAPR <= new Date()) {
					externalReturn.apr1d += apr.apr1d;
					externalReturn.apr7d += apr.apr7d;
					externalReturn.apr14d += apr.apr14d;
					externalReturn.aprSuperfluid += apr.aprSuperfluid;
					externalReturn.tokens.push(apr.token);
				}
			}
		});
		return externalReturn;
	}

	@computed get totalReturn(): ReturnAPR {
		const totalReturn: ReturnAPR = {
			apr1d: this.externalReturn.apr1d + this.totalReturn.apr1d,
			apr7d: this.externalReturn.apr7d + this.totalReturn.apr7d,
			apr14d: this.externalReturn.apr14d + this.totalReturn.apr14d,
			aprSuperfluid: this.externalReturn.aprSuperfluid + this.totalReturn.aprSuperfluid,
			tokens: [...this.externalReturn.tokens, ...this.totalReturn.tokens],
		};
		return totalReturn;
	}

	@computed get totalAPR(): number {
		if (this.apr.length === 0) return 0;
		const percent = (((this.fees.feesSpent7d / 7) * 365) / this.liquidity) * 100;
		let total = percent;
		const totalSuperfluid = this.apr[0].aprSuperfluid - this.apr[0].apr14d;
		this.apr.forEach((apr) => {
			total += apr.apr14d;
		});
		total += totalSuperfluid;

		return total;
	}

	constructor({ pool }: PoolStoreArgs) {
		super({ delayCache: 5 * 60 * 100 });
		this._id = pool.id;
		this._liquidity = pool.liquidity;
		this._liquidity24hChange = pool.liquidity24hChange;
		this._volume24hChange = pool.volume24hChange;
		this._volume24h = pool.volume24h;
		this._volume7d = pool.volume7d;
		this._fees = pool.fees;
		this._apr = pool.apr;
		this._main = pool.main;
		this._tokens = pool.tokens;
		this._fees = pool.fees;
		makeObservable(this);
	}

	@action
	format(reponseData: PromiseRequest): void {
		console.log("%cpool-store.ts -> 57 BLUE: reponseData", "background: #2196f3; color:#FFFFFF", reponseData);
	}

	public get errorPool(): string | undefined {
		return this._error;
	}

	public get isLoadingPool(): boolean {
		return this._isLoading;
	}

	public getPool = () => {
		this.sendRequest(() => axios({ url: `${API_URL}/pools/v2/${this._id}` }));
	};
}

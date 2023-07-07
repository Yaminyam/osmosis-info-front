import React from "react";
import { useTranslation } from "react-multi-lang";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_APP_API_URL;

export default function Pools() {
	const t = useTranslation();
	return (
		<div className="w-full">
			<h1 className="text-2xl">{t("pools.title")}</h1>
		</div>
	);
}

export async function getServerSideProps() {
	const responses = await Promise.all([
		axios({ url: `${API_URL}/overview/v1/metrics` }),
		axios({ url: `${API_URL}/tokens/v2/all` }),
		axios({ url: `${API_URL}/tokens/v2/mcap` }),
		axios({ url: `https://raw.githubusercontent.com/osmosis-labs/assetlists/main/osmosis-1/osmosis-1.assetlist.json` }),
		axios({ url: `${API_URL}/pools/v2/all?low_liquidity=false` }),
		axios({ url: `${API_URL}/apr/v2/all` }),
		axios({ url: `${API_URL}/fees/v1/pools` }),
		axios({ url: `${API_URL}/liquidity/v2/historical/chart` }),
		axios({ url: `${API_URL}/volume/v2/historical/chart` }),
	]);

	return {
		props: {
			initialState: {
				metricsState: responses[0].data,
				tokensState: { tokens: responses[1].data, marketCap: responses[2].data, assetList: responses[3].data },
				poolsState: { pools: responses[4].data, apr: responses[5].data, fees: responses[6].data },
				liquidityChartState: responses[7].data,
				volumeChartState: responses[8].data,
			},
		},
	};
}

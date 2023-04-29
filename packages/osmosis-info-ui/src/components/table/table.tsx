import React from "react";
import { TableConfiguration } from "./types";
import { TableRoot } from "./table-root";
import { TableProvider } from "./context/table-context";
import { useStateInitialize } from "./hooks/use-state-initializer";
import { Body } from "./body/body";
import { Footer } from "./footer/footer";

export type TableProps = {
	config: TableConfiguration;
	data: any[];
};

export const Table = React.memo(function ({ data, config }: TableProps) {
	const { tableState, columnsState, rowState } = useStateInitialize(config);

	return (
		<TableProvider
			initialTableState={tableState}
			initialColumnsState={columnsState}
			initialRowState={rowState}
			configuration={config}
		>
			<TableRoot>
				<div className="h-[53px] flex items-center p-2 box-border border-[1px] border-main-700 rounded-t-md">
					Header
				</div>
				<Body data={data} />
				<Footer data={data} />
			</TableRoot>
		</TableProvider>
	);
});

Table.displayName = "Table";

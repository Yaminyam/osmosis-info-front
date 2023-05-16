import React, { MutableRefObject, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Switch } from "../../../switch/switch";
import { ColumnState } from "../../types";
import { useTable } from "../../context/table-context";
import { MenuSvg } from "../../../svg";
import { useDrag } from "@use-gesture/react";
import { clamp, reorderArray, swap } from "../../utils/utils";

const totalHeight = 40 + 4; // height + padding

type SpringProps = {
	key: string;
	zIndex: number;
	shadow: number;
	y: number;
	scale: number;
	active: boolean;
};

const DragableColumns = ({
	columns,
	onChangeHideColumn,
	reorder,
}: {
	columns: ColumnState[];
	onChangeHideColumn: (value: boolean, index: number) => void;
	reorder: (order: number[]) => void;
}) => {
	const order = useRef<number[]>(columns.map((_, index) => index));

	const [springs, setSprings] = useState<SpringProps[]>([]);

	useLayoutEffect(() => {
		order.current = columns.map((_, index) => index);
		const newSprings = columns.map((column, index) => {
			return fn(order.current, false, index, index, 0, column.key);
		});
		setSprings(newSprings);
	}, [columns]);
	const bind = useDrag(({ args: [originalIndex], active, movement: [, y] }) => {
		const curIndex = order.current.indexOf(originalIndex);
		const curRow = clamp(Math.round((curIndex * totalHeight + y) / totalHeight), 0, columns.length - 1);
		const newOrder = swap(order.current, curIndex, curRow);

		if (!active) {
			order.current = newOrder;
			reorder(newOrder);
		} else {
			const newSprings: SpringProps[] = columns.map((column, index) => {
				return fn(newOrder, active, originalIndex, index, y, column.key);
			});
			setSprings(newSprings);
		}
	});
	return (
		<div className="relative" style={{ height: columns.length * totalHeight }}>
			{springs.map(({ zIndex, shadow, y, scale, active, key }, i) => {
				const onChange = (value: boolean) => {
					onChangeHideColumn(!value, i);
				};
				let className =
					"absolute w-full flex items-center h-[40px] bg-primary-700 border-[1px] border-primary-300 rounded-md my-1 duration-default";
				if (active) className += " !transition-none";

				return (
					<div
						{...bind(i)}
						className={className}
						key={key}
						style={{
							zIndex,
							boxShadow: `rgba(0, 0, 0, 0.15) 0px ${shadow}px ${2 * shadow}px 0px`,
							transform: `translateY(${y}px) scale(${scale})`,
						}}
					>
						<MenuSvg className="mx-2 fill-default-500 cursor-grab" height={24} width={24} />
						<Switch value={!columns[i].hide} onChange={onChange} className="mr-2" name={columns[i].key} />
						{columns[i].display}
					</div>
				);
			})}
		</div>
	);
};

const fn = (order: number[], active = false, originalIndex = 0, curIndex = 0, y = 0, key: string): SpringProps => {
	let newY = y;
	const maxY = (order.length - 1 - curIndex) * totalHeight;

	const minY = -(curIndex * totalHeight);
	if (newY < minY) newY = minY;
	if (newY > maxY) newY = maxY;

	return {
		key,
		zIndex: active && originalIndex === curIndex ? 1 : 0,
		shadow: active && originalIndex === curIndex ? 15 : 1,
		y: active && originalIndex === curIndex ? curIndex * totalHeight + newY : order.indexOf(curIndex) * totalHeight,
		scale: active && originalIndex === curIndex ? 1.05 : 1,
		active: active && originalIndex === curIndex,
	};
};

export const ColumnsSettings = () => {
	const { updateColumnsState, columnsState } = useTable();

	const onChangeHideColumn = (value: boolean, index: number) => {
		const columnUpdated = { ...columnsState[index] };

		let columns: ColumnState[] = [];

		columnUpdated.hide = value;

		columns = [...columnsState.slice(0, index), { ...columnUpdated }, ...columnsState.slice(index + 1)];

		updateColumnsState([...columns]);
	};

	const reorder = (newOrder: number[]) => {
		const newColumnsState = reorderArray(columnsState, newOrder);
		updateColumnsState(newColumnsState);
	};

	return (
		<div className="my-2">
			<p>Columns: </p>
			<div>
				<DragableColumns columns={columnsState} onChangeHideColumn={onChangeHideColumn} reorder={reorder} />
			</div>
		</div>
	);
};

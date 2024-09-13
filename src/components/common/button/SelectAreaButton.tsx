import React from 'react';
import { regions } from '@/constants/regions';
import { Text } from '../Text';

type SelectAreaButtonProps = {
	code: string;
	isSelected?: boolean;
	onClick?: () => void;
};

export default function SelectAreaButton({
	code,
	isSelected = false,
	onClick,
}: SelectAreaButtonProps) {
	const region = regions.find((region) => region.code === code);

	return (
		<div
			className={`w-full h-60pxr flex flex-col items-center justify-center rounded-8pxr px-16pxr py-11pxr gap-2pxr cursor-pointer ${
				isSelected
					? 'bg-activeLylac100 border border-activeLylac300'
					: 'bg-gray050'
			}`}
			onClick={onClick}
		>
			<Text
				fontSize={16}
				fontWeight={700}
				color={isSelected ? 'activeLylac600' : 'gray700'}
				className="whitespace-nowrap"
			>
				{region!.area}
			</Text>
		</div>
	);
}

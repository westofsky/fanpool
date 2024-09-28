'use client';
import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { FanpoolSubmitButton } from './FanpoolSubmitButton';
import { Text } from '../common/Text';
import { FanpoolMatchBottomSheet } from './FanpoolMatchBottomSheet';
import SelectHighlightButton from '../common/button/SelectHighlightButton';
import PlusButton from '../common/button/PlusButton';
import MinusButton from '../common/button/MinusButton';
import { IconDefaultPin, IconPencilGray } from '@/public/icons';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { PlaceSearchBottomSheet } from './PlaceSearchBottomSheet';

interface FanpoolFormData {
	title: string;
	datePeriod: '오전' | '오후';
	hour: number;
	minute: number;
	fanpoolType: '차량공유' | '택시팟' | null;
	collectCount: number;
	passengerCondition: '남녀모두' | '남자만' | '여자만';
}

export default function FanpoolAddForm() {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
		watch,
	} = useForm<FanpoolFormData>({
		defaultValues: {
			fanpoolType: null,
			collectCount: 1,
			passengerCondition: '남녀모두',
			datePeriod: '오전',
			hour: 12,
			minute: 0,
		},
	});
	const [bottomSheet, setBottomSheet] = useState<{
		visible: boolean;
		type: 'date' | 'match' | 'place' | null;
	}>({
		visible: false,
		type: null,
	});
	const [selectedPlace, setSelectedPlace] = useState<{
		name: string;
		x: string;
		y: string;
	} | null>(null);

	const fanpoolType = useWatch({ control, name: 'fanpoolType' });
	const collectCount = useWatch({ control, name: 'collectCount' });
	const title = useWatch({ control, name: 'title' });
	const hour = useWatch({ control, name: 'hour' });
	const minute = useWatch({ control, name: 'minute' });
	const datePeriod = useWatch({ control, name: 'datePeriod' });
	const passengerCondition = useWatch({ control, name: 'passengerCondition' });

	const [isSubmitting, setIsSubmitting] = useState(false);

	const checkIsSubmitting = () => {
		if (
			fanpoolType &&
			hour &&
			minute !== null &&
			collectCount > 0 &&
			passengerCondition &&
			selectedPlace &&
			title
		) {
			setIsSubmitting(true);
		} else {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		checkIsSubmitting();
	}, [
		fanpoolType,
		hour,
		minute,
		collectCount,
		passengerCondition,
		selectedPlace,
		title,
	]);

	const onSubmit: SubmitHandler<FanpoolFormData> = (data) => {
		console.log('입력 데이터: ', { ...data, selectedPlace });
	};

	const openBottomSheet = (type: 'date' | 'match' | 'place') => {
		setBottomSheet({ visible: true, type });
	};

	const closeBottomSheet = () => {
		setBottomSheet({ visible: false, type: null });
	};

	const handleTypeSelect = (type: '차량공유' | '택시팟') => {
		setValue('fanpoolType', type);
	};

	const handleCollectCountChange = (change: number) => {
		setValue('collectCount', Math.max(1, collectCount + change));
	};

	const handlePlaceSelect = (place: { name: string; x: string; y: string }) => {
		setSelectedPlace(place);
		closeBottomSheet();
	};

	return (
		<section
			className="overflow-y-scroll"
			style={{ height: 'calc(100vh - 49px)' }}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-40pxr px-20pxr pt-17pxr"
			>
				<div className="flex flex-col gap-8pxr">
					<Text fontSize={18} fontWeight={700} color="gray700">
						팬풀 유형
					</Text>
					<div className="flex gap-8pxr">
						<SelectHighlightButton
							text="차량공유"
							isSelected={fanpoolType === '차량공유'}
							onClick={() => handleTypeSelect('차량공유')}
						/>
						<SelectHighlightButton
							text="택시팟"
							isSelected={fanpoolType === '택시팟'}
							onClick={() => handleTypeSelect('택시팟')}
						/>
					</div>
				</div>

				<div className="flex flex-col gap-8pxr">
					<Text fontSize={18} fontWeight={700} color="gray700">
						보러 갈 경기
					</Text>
					<div
						className="w-full h-full p-12pxr rounded-8pxr bg-gray100 cursor-pointer text-center"
						onClick={() => openBottomSheet('match')}
					>
						<Text fontSize={16} fontWeight={500} color="gray700">
							경기 찾아보기
						</Text>
					</div>
				</div>

				<div className="flex flex-col gap-8pxr">
					<Text fontSize={18} fontWeight={700} color="gray700">
						출발 일시
					</Text>
					<div className="flex gap-40pxr">
						{/* 오전/오후 선택 */}
						<div className="flex items-center gap-12pxr">
							<label className="flex gap-8pxr">
								<input
									type="radio"
									value="오전"
									{...register('datePeriod')}
									defaultChecked
								/>
								<Text fontSize={16} fontWeight={500} color="gray700">
									오전
								</Text>
							</label>
							<label className="flex gap-8pxr">
								<input type="radio" value="오후" {...register('datePeriod')} />
								<Text fontSize={16} fontWeight={500} color="gray700">
									오후
								</Text>
							</label>
						</div>

						{/* 시/분 입력 */}
						<div className="flex items-center gap-8pxr">
							<input
								type="number"
								{...register('hour', {
									required: true,
									min: 1,
									max: 12,
									valueAsNumber: true,
								})}
								placeholder="시"
								className="w-40pxr h-40pxr rounded-8pxr border-none bg-gray050 p-2"
							/>
							<Text fontSize={16} fontWeight={500} color="gray600">
								시
							</Text>

							<input
								type="number"
								{...register('minute', {
									required: true,
									min: 0,
									max: 59,
									valueAsNumber: true,
								})}
								placeholder="분"
								className="w-40pxr h-40pxr rounded-8pxr border-none bg-gray050  p-2"
							/>
							<Text fontSize={16} fontWeight={500} color="gray600">
								분
							</Text>
						</div>
					</div>
					{errors.hour && <p>시간을 올바르게 입력해주세요</p>}
					{errors.minute && <p>분을 올바르게 입력해주세요</p>}
				</div>

				<div className="flex flex-col">
					<Text fontSize={18} fontWeight={700} color="gray700">
						모집 인원
					</Text>
					<div className="h-4pxr" />

					<Text fontSize={14} fontWeight={400} color="gray700">
						나를 제외하고 함께 이동할 인원 수를 선택해주세요.
					</Text>
					<div className="h-14pxr" />
					<div className="flex justify-between items-center">
						<MinusButton onClick={() => handleCollectCountChange(-1)} />
						<div className="flex gap-2pxr items-center">
							<Text fontSize={18} fontWeight={700} color="gray700">
								{collectCount}명
							</Text>
							<IconPencilGray />
						</div>
						<PlusButton onClick={() => handleCollectCountChange(1)} />
					</div>
				</div>

				<div className="flex flex-col gap-8pxr">
					<Text fontSize={18} fontWeight={700} color="gray700">
						동승자 조건
					</Text>
					<div className="h-4pxr" />

					<Text fontSize={14} fontWeight={400} color="gray700" className="mt-2">
						조건에 맞지 않는 회원도 채팅을 걸 수 있으며, 내가 수락하면 채팅을
						통해 조건을 조율할 수 있어요.
					</Text>

					<div className="flex flex-col gap-12pxr">
						<label className="flex items-center gap-2pxr">
							<input
								type="radio"
								value="성별무관"
								{...register('passengerCondition')}
								defaultChecked
							/>
							<Text fontSize={14} fontWeight={400} color="gray700">
								성별 무관
							</Text>
						</label>

						<label className="flex items-center gap-2pxr">
							<input
								type="radio"
								value="여자만"
								{...register('passengerCondition')}
							/>
							<Text fontSize={14} fontWeight={400} color="gray700">
								여자만
							</Text>
						</label>

						<label className="flex items-center gap-2pxr">
							<input
								type="radio"
								value="남자만"
								{...register('passengerCondition')}
							/>
							<Text fontSize={14} fontWeight={400} color="gray700">
								남자만
							</Text>
						</label>
					</div>
				</div>

				<div className="flex flex-col gap-8pxr">
					<Text fontSize={18} fontWeight={700} color="gray700">
						출발 장소
					</Text>
					<div
						className="relative w-full h-40pxr cursor-pointer"
						onClick={() => openBottomSheet('place')}
					>
						<IconDefaultPin className="absolute left-8pxr top-1/2 transform -translate-y-1/2" />
						<div className="w-full h-full pl-40pxr pr-8pxr py-8pxr rounded-8pxr bg-gray050">
							<Text fontSize={14} color="gray500">
								{selectedPlace ? selectedPlace.name : '위치를 입력해주세요'}
							</Text>
						</div>
					</div>

					{/* 지도 표시 */}
					{selectedPlace && (
						<Map
							center={{
								lat: Number(selectedPlace.y),
								lng: Number(selectedPlace.x),
							}}
							style={{ width: '100%', height: '200px' }}
							level={3}
						>
							<MapMarker
								position={{
									lat: Number(selectedPlace.y),
									lng: Number(selectedPlace.x),
								}}
							/>
						</Map>
					)}
				</div>

				<div className="flex flex-col gap-8pxr">
					<Text fontSize={18} fontWeight={700} color="gray700">
						제목
					</Text>
					<input
						type="text"
						placeholder="제목을 입력해주세요"
						{...register('title', { required: '제목을 입력해주세요' })}
						className="w-full h-full p-12pxr rounded-8pxr bg-gray050 placeholder:text-gray400 text-sm"
					/>
				</div>
				<div className="flex flex-col gap-8pxr">
					<Text fontSize={18} fontWeight={700} color="gray700">
						하고싶은 말
						<Text
							fontSize={18}
							fontWeight={400}
							color="gray700"
							className="inline"
						>
							(선택)
						</Text>
					</Text>

					<textarea
						placeholder="내 팬풀에 대해 더 자세한 정보를 제공하면 응답율이 높아져요."
						className="w-full h-100pxr p-12pxr rounded-8pxr bg-gray050 placeholder:text-gray400 text-sm resize-none"
					/>
				</div>
				<div className="h-80pxr" />
				<FanpoolSubmitButton isSubmitting={isSubmitting} />
			</form>

			<FanpoolMatchBottomSheet
				isVisible={bottomSheet.visible && bottomSheet.type === 'match'}
				onClose={closeBottomSheet}
			/>
			<PlaceSearchBottomSheet
				isVisible={bottomSheet.visible && bottomSheet.type === 'place'}
				onClose={closeBottomSheet}
				onSelectPlace={handlePlaceSelect}
			/>
		</section>
	);
}
